/**
 * Data Governance tRPC Router — Sprint 25
 *
 * GDPR/PDPA consent management, Data Subject Access Requests (DSAR),
 * data retention enforcement, and immutable audit trail queries.
 *
 * Requirements: 20.1–20.6, 25.1–25.6
 */

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { guardedProcedure, abacProcedure, router } from "../trpc";
import { prisma } from "@/lib/prisma";
import { dispatchNotification } from "@/lib/notification-dispatch";

const DsarTypeSchema = z.enum([
  "ACCESS", "RECTIFICATION", "ERASURE", "PORTABILITY", "RESTRICTION",
]);

export const dataGovernanceRouter = router({

  // ── DSAR ─────────────────────────────────────────────────────────────────────

  listDsarRequests: abacProcedure("compliance", "read")
    .input(z.object({
      status: z.string().optional(),
      take:   z.number().int().min(1).max(200).default(50),
      skip:   z.number().int().min(0).default(0),
    }).optional())
    .query(async ({ ctx, input }) => {
      return (prisma as any).dsarRequest.findMany({
        where: {
          tenantId: ctx.tenantId,
          ...(input?.status ? { status: input.status } : {}),
        },
        orderBy: { createdAt: "desc" },
        take: input?.take ?? 50,
        skip: input?.skip ?? 0,
      });
    }),

  submitDsarRequest: guardedProcedure
    .input(z.object({
      requestType: DsarTypeSchema,
      notes:       z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // GDPR/PDPA: response within 30 calendar days
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 30);

      const dsar = await (prisma as any).dsarRequest.create({
        data: {
          tenantId:    ctx.tenantId,
          requestorId: ctx.userId,
          requestType: input.requestType,
          status:      "PENDING",
          dueDate,
          notes:       input.notes,
        },
      });

      // Notify compliance officer
      await dispatchNotification({
        tenantId:    ctx.tenantId,
        recipientId: ctx.userId,
        eventType:   "dsar.submitted",
        channel:     "EMAIL",
        subject:     `New DSAR: ${input.requestType}`,
        body:        `A Data Subject Access Request (${input.requestType}) was submitted. Due by: ${dueDate.toDateString()}.`,
      });

      return dsar;
    }),

  updateDsarStatus: abacProcedure("compliance", "write")
    .input(z.object({
      id:     z.string(),
      status: z.enum(["IN_PROGRESS", "COMPLETED", "REJECTED"]),
      notes:  z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const dsar = await (prisma as any).dsarRequest.findFirst({
        where: { id: input.id, tenantId: ctx.tenantId },
      });
      if (!dsar) throw new TRPCError({ code: "NOT_FOUND" });

      return (prisma as any).dsarRequest.update({
        where: { id: input.id },
        data: {
          status:      input.status,
          completedAt: input.status === "COMPLETED" ? new Date() : undefined,
          notes:       input.notes ?? dsar.notes,
        },
      });
    }),

  // ── Audit Trail ───────────────────────────────────────────────────────────────

  getAuditTrail: abacProcedure("compliance", "read")
    .input(z.object({
      entityType: z.string().optional(),
      entityId:   z.string().optional(),
      actorId:    z.string().optional(),
      module:     z.string().optional(),
      action:     z.enum(["CREATE", "UPDATE", "DELETE", "READ"]).optional(),
      from:       z.coerce.date().optional(),
      to:         z.coerce.date().optional(),
      take:       z.number().int().min(1).max(500).default(100),
      skip:       z.number().int().min(0).default(0),
    }))
    .query(async ({ ctx, input }) => {
      return prisma.auditTrail.findMany({
        where: {
          tenantId: ctx.tenantId,
          ...(input.entityType ? { entityType: input.entityType } : {}),
          ...(input.entityId   ? { entityId:   input.entityId   } : {}),
          ...(input.actorId    ? { actorId:    input.actorId    } : {}),
          ...(input.module     ? { module:     input.module     } : {}),
          ...(input.action     ? { action:     input.action     } : {}),
          ...(input.from || input.to ? {
            createdAt: {
              ...(input.from ? { gte: input.from } : {}),
              ...(input.to   ? { lte: input.to   } : {}),
            },
          } : {}),
        },
        orderBy: { createdAt: "desc" },
        take: input.take,
        skip: input.skip,
      });
    }),

  // ── Consent Management ────────────────────────────────────────────────────────

  // Returns outstanding candidate PDPA consents nearing expiry (60-day scan)
  getConsentExpiryAlerts: abacProcedure("compliance", "read")
    .input(z.object({}).optional())
    .query(async ({ ctx }) => {
      const in60Days = new Date();
      in60Days.setDate(in60Days.getDate() + 60);

      return prisma.candidate.findMany({
        where: {
          tenantId:      ctx.tenantId,
          consentExpiry: { lte: in60Days, gte: new Date() },
        },
        select: {
          id:            true,
          fullName:      true,
          email:         true,
          consentDate:   true,
          consentExpiry: true,
        },
        orderBy: { consentExpiry: "asc" },
      });
    }),

  // Retention statistics
  getRetentionStats: abacProcedure("compliance", "read")
    .input(z.object({}).optional())
    .query(async ({ ctx }) => {
      const [totalEmployees, totalAuditRecords, totalDsar] = await Promise.all([
        prisma.employee.count({ where: { tenantId: ctx.tenantId } }),
        prisma.auditTrail.count({ where: { tenantId: ctx.tenantId } }),
        (prisma as any).dsarRequest.count({ where: { tenantId: ctx.tenantId } }),
      ]);

      return {
        totalEmployees,
        totalAuditRecords,
        totalDsar,
        // 7-year retention policy baseline
        retentionPolicyYears: 7,
      };
    }),
});
