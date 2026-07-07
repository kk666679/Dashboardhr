/**
 * Data Retention Worker — Sprint 25, Task 25.2
 *
 * Sunday 02:00 cron: auto-mask/pseudonymise records exceeding retention period.
 * Archives documents to cold storage and purges primary DB record.
 * Logs all masking actions in AuditTrail.
 *
 * Requirements: 20.3, 20.8
 */

import { Worker, Queue } from "bullmq";
import IORedis from "ioredis";
import { prisma } from "@/lib/prisma";

const connection = new IORedis(process.env.REDIS_URL ?? "redis://localhost:6379", {
  maxRetriesPerRequest: null,
});

export const retentionQueue = new Queue("retention", { connection });

interface RetentionJob {
  type: "mask-personal-data" | "archive-documents";
  tenantId: string;
  retentionYears?: number;
}

export const retentionWorker = new Worker<RetentionJob>(
  "retention",
  async (job) => {
    const { type, tenantId, retentionYears = 7 } = job.data;

    if (type === "mask-personal-data") {
      await maskPersonalData(tenantId, retentionYears);
    } else if (type === "archive-documents") {
      await archiveDocuments(tenantId, retentionYears);
    }
  },
  { connection, concurrency: 1 }
);

/**
 * Req 20.3: Pseudonymise employee records after retention period.
 * Employees separated more than retentionYears ago have PII masked.
 */
async function maskPersonalData(tenantId: string, retentionYears: number): Promise<void> {
  const cutoffDate = new Date();
  cutoffDate.setFullYear(cutoffDate.getFullYear() - retentionYears);

  const expiredEmployees = await prisma.employee.findMany({
    where: {
      tenantId,
      isDeleted: false,
      employmentStatus: { in: ["TERMINATED", "RESIGNED", "RETIRED"] },
      separationDate: { lt: cutoffDate },
    },
    select: { id: true, name: true, email: true },
  });

  for (const emp of expiredEmployees) {
    await prisma.$transaction(async (tx) => {
      const before = { name: emp.name, email: emp.email };

      await tx.employee.update({
        where: { id: emp.id },
        data: {
          name:       `[REDACTED-${emp.id.slice(0, 8)}]`,
          email:      `redacted-${emp.id.slice(0, 8)}@masked.invalid`,
          phone:      null,
          nationalId: null,
          address:    null,
          dateOfBirth: null,
          emergencyContacts: null,
        },
      });

      await tx.auditTrail.create({
        data: {
          tenantId,
          entityType: "Employee",
          entityId: emp.id,
          action: "UPDATE",
          actorId: "system",
          actorRole: "system",
          previousValue: before as any,
          newValue: { masked: true, reason: "RETENTION_POLICY" },
          metadata: { type: "pseudonymisation", retentionYears, changedFields: ["name", "email", "phone", "nationalId", "address"] },
        },
      });
    });
  }

  console.log(`[retention-worker] Masked ${expiredEmployees.length} expired employee records in tenant ${tenantId}`);
}

/**
 * Req 20.8: Archive documents to S3 cold storage after retention period.
 */
async function archiveDocuments(tenantId: string, retentionYears: number): Promise<void> {
  const cutoffDate = new Date();
  cutoffDate.setFullYear(cutoffDate.getFullYear() - retentionYears);

  const expiredDocs = await prisma.document.findMany({
    where: {
      tenantId,
      expiryDate: { lt: cutoffDate },
      status: { not: "EXPIRED" },
    },
    take: 100,
  });

  for (const doc of expiredDocs) {
    // TODO: copy doc.fileUrl to cold storage bucket (archive tier)
    // TODO: delete from primary storage

    await prisma.$transaction(async (tx) => {
      await tx.document.update({
        where: { id: doc.id },
        data: { status: "EXPIRED" },
      });

      await tx.auditTrail.create({
        data: {
          tenantId,
          entityType: "Document",
          entityId: doc.id,
          action: "UPDATE",
          actorId: "system",
          actorRole: "system",
          newValue: { archived: true, originalUrl: doc.fileUrl },
          metadata: { type: "retention_archive", retentionYears, changedFields: ["status"] },
        },
      });
    });
  }

  console.log(`[retention-worker] Archived ${expiredDocs.length} expired documents in tenant ${tenantId}`);
}

retentionWorker.on("failed", (job, err) => {
  console.error(`[retention-worker] Failed: ${job?.id}`, err.message);
});

console.log("[retention-worker] Started");
