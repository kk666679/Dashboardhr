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
import { prisma } from "@/lib/prisma";
import { createBullMqConnection } from "@/lib/queues/bullmq-connection";
import { put, del } from "@vercel/blob";

// Lazy blob token check
const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN ?? "";

const connection = createBullMqConnection();

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
    await prisma.$transaction(async (tx: unknown) => {
      const before = { name: emp.name, email: emp.email };

      await (tx as any).employee.update({
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

      await (tx as any).auditTrail.create({
        data: {
          tenantId,
          module: "data_governance",
          entityType: "Employee",
          entityId: emp.id,
          action: "UPDATE",
          actorId: "system",
          actorRole: "system",
          previousValue: before as any,
          newValue: { masked: true, reason: "RETENTION_POLICY" },
          changedFields: ["name", "email", "phone", "nationalId", "address"],
          metadata: { type: "pseudonymisation", retentionYears },
        },
      });
    });
  }

  const safeTenantId = String(tenantId).replace(/[\r\n\t]/g, "_").slice(0, 64);
  console.log(`[retention-worker] Masked ${expiredEmployees.length} expired employee records in tenant ${safeTenantId}`);
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
    // AUTO-FLAG: Copy document to cold storage archive tier + delete from primary
    let archiveUrl: string | null = null;
    try {
      // Fetch the document content from its current location
      const response = await fetch(doc.fileUrl);
      if (response.ok) {
        const blob = await response.blob();
        // Upload to cold storage path (archive tier)
        const archivePath = `archive/${tenantId}/${doc.id}_${Date.now()}`;
        const result = await put(archivePath, blob, {
          access: "public",
          token: BLOB_TOKEN,
          addRandomSuffix: true,
        });
        archiveUrl = result.url;
      }
    } catch (archiveErr) {
      console.warn(`[retention-worker] Failed to archive doc ${doc.id} to cold storage:`, archiveErr);
    }

    await prisma.$transaction(async (tx: unknown) => {
      await (tx as any).document.update({
        where: { id: doc.id },
        data: { status: "EXPIRED" },
      });

      // Delete from primary storage if archive succeeded
      if (archiveUrl && doc.fileUrl) {
        try {
          await del(doc.fileUrl, { token: BLOB_TOKEN });
        } catch (delErr) {
          console.warn(`[retention-worker] Failed to delete primary blob for doc ${doc.id}:`, delErr);
        }
      }

      await (tx as any).auditTrail.create({
        data: {
          tenantId,
          module: "data_governance",
          entityType: "Document",
          entityId: doc.id,
          action: "UPDATE",
          actorId: "system",
          actorRole: "system",
          newValue: { archived: true, archiveUrl, originalUrl: doc.fileUrl },
          changedFields: ["status"],
          metadata: { type: "retention_archive", retentionYears },
        },
      });
    });
  }

  const safeTenantId = String(tenantId).replace(/[\r\n\t]/g, "_").slice(0, 64);
  console.log(`[retention-worker] Archived ${expiredDocs.length} expired documents in tenant ${safeTenantId}`);
}

retentionWorker.on("failed", (job, err) => {
  const safeJobId = String(job?.id ?? "").replace(/[\r\n\t]/g, "_").slice(0, 64);
  console.error(`[retention-worker] Failed: ${safeJobId}`, err.message);
});

export async function stopWorker() {
  try { await retentionWorker.close(); } catch {}
  try { await retentionQueue.close(); } catch {}
}

console.log("[retention-worker] Started");

