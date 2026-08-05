/**
 * Offboarding tRPC Router
 * Handles clearance, asset return, exit interviews,
 * knowledge transfer, final settlement, and access revocation.
 */
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { guardedProcedure, router } from "../trpc";
import { prisma } from "@/lib/prisma";

// ─── Clearance ────────────────────────────────────────────────────────────────

export const clearanceRouter = router({
  getByTermination: guardedProcedure
    .input(z.object({ terminationId: z.string() }))
    .query(async ({ ctx, input }) => {
      return (prisma as any).clearanceInstance.findFirst({
        where:   { terminationId: input.terminationId, tenantId: ctx.tenantId },
        include: { tasks: true },
      });
    }),

  getTasks: guardedProcedure
    .input(z.object({ terminationId: z.string() }))
    .query(async ({ ctx, input }) => {
      return (prisma as any).clearanceTask.findMany({
        where: {
          instance: { terminationId: input.terminationId, tenantId: ctx.tenantId },
        },
        orderBy: { order: "asc" },
      });
    }),

  updateTask: guardedProcedure
    .input(z.object({
      taskId:  z.string(),
      status:  z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "WAIVED"]),
      notes:   z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return (prisma as any).clearanceTask.update({
        where: { id: input.taskId },
        data:  { status: input.status, notes: input.notes, updatedAt: new Date() },
      });
    }),
});

// ─── Asset Return ─────────────────────────────────────────────────────────────

export const assetReturnRouter = router({
  getByTermination: guardedProcedure
    .input(z.object({ terminationId: z.string() }))
    .query(async ({ ctx, input }) => {
      return (prisma as any).assetReturn.findFirst({
        where:   { terminationId: input.terminationId, tenantId: ctx.tenantId },
        include: { items: true },
      });
    }),

  save: guardedProcedure
    .input(z.object({
      terminationId:     z.string(),
      expectedReturnDate: z.string(),
      items: z.array(z.object({
        name:         z.string(),
        serialNumber: z.string().optional(),
        expected:     z.boolean().default(true),
        returned:     z.boolean().default(false),
        condition:    z.string().optional(),
        notes:        z.string().optional(),
      })),
    }))
    .mutation(async ({ ctx, input }) => {
      const { items, ...rest } = input;
      const existing = await (prisma as any).assetReturn.findFirst({
        where: { terminationId: input.terminationId, tenantId: ctx.tenantId },
      });
      if (existing) {
        await (prisma as any).assetReturnItem.deleteMany({ where: { assetReturnId: existing.id } });
        return (prisma as any).assetReturn.update({
          where:   { id: existing.id },
          data:    { ...rest, items: { create: items } },
          include: { items: true },
        });
      }
      return (prisma as any).assetReturn.create({
        data:    { tenantId: ctx.tenantId, ...rest, items: { create: items } },
        include: { items: true },
      });
    }),
});

// ─── Exit Interview ───────────────────────────────────────────────────────────

export const exitInterviewRouter = router({
  getByTermination: guardedProcedure
    .input(z.object({ terminationId: z.string() }))
    .query(async ({ ctx, input }) => {
      return (prisma as any).exitInterview.findFirst({
        where: { terminationId: input.terminationId, tenantId: ctx.tenantId },
      });
    }),

  create: guardedProcedure
    .input(z.object({
      terminationId: z.string(),
      interviewDate: z.string(),
      interviewerId: z.string(),
      exitReason:    z.string(),
      reasonTags:    z.array(z.string()).default([]),
      ratings:       z.record(z.string(), z.number()).optional(),
      notes:         z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return (prisma as any).exitInterview.create({
        data: { tenantId: ctx.tenantId, ...input },
      });
    }),

  update: guardedProcedure
    .input(z.object({
      id:            z.string(),
      terminationId: z.string(),
      interviewDate: z.string().optional(),
      interviewerId: z.string().optional(),
      exitReason:    z.string().optional(),
      reasonTags:    z.array(z.string()).optional(),
      ratings:       z.record(z.string(), z.number()).optional(),
      notes:         z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, terminationId, ...data } = input;
      const existing = await (prisma as any).exitInterview.findFirst({
        where: { id, terminationId, tenantId: ctx.tenantId },
      });
      if (!existing) throw new TRPCError({ code: "NOT_FOUND" });
      return (prisma as any).exitInterview.update({ where: { id }, data });
    }),
});

// ─── Knowledge Transfer ───────────────────────────────────────────────────────

export const knowledgeTransferRouter = router({
  getByTermination: guardedProcedure
    .input(z.object({ terminationId: z.string() }))
    .query(async ({ ctx, input }) => {
      return (prisma as any).knowledgeTransfer.findFirst({
        where: { terminationId: input.terminationId, tenantId: ctx.tenantId },
      });
    }),

  save: guardedProcedure
    .input(z.object({
      terminationId: z.string(),
      plan:          z.string().optional(),
      summary:       z.string().optional(),
      owners:        z.array(z.string()).default([]),
      attachments:   z.array(z.string()).default([]),
      documentLinks: z.array(z.string()).default([]),
    }))
    .mutation(async ({ ctx, input }) => {
      const existing = await (prisma as any).knowledgeTransfer.findFirst({
        where: { terminationId: input.terminationId, tenantId: ctx.tenantId },
      });
      if (existing) {
        return (prisma as any).knowledgeTransfer.update({
          where: { id: existing.id },
          data:  input,
        });
      }
      return (prisma as any).knowledgeTransfer.create({
        data: { tenantId: ctx.tenantId, ...input },
      });
    }),
});

// ─── Final Settlement ─────────────────────────────────────────────────────────

export const settlementRouter = router({
  getByTermination: guardedProcedure
    .input(z.object({ terminationId: z.string() }))
    .query(async ({ ctx, input }) => {
      return (prisma as any).finalSettlement.findFirst({
        where:   { terminationId: input.terminationId, tenantId: ctx.tenantId },
        include: { lineItems: true },
      });
    }),

  save: guardedProcedure
    .input(z.object({
      terminationId:      z.string(),
      finalSalary:        z.number().min(0),
      pendingLeave:       z.number().min(0),
      additionalPayments: z.number().min(0),
      totalAmount:        z.number().min(0),
      status:             z.enum(["DRAFT", "REVIEW", "APPROVED", "PAID"]),
      notes:              z.string().optional(),
      lineItems: z.array(z.object({
        description: z.string(),
        amount:      z.number(),
        category:    z.string(),
      })).default([]),
    }))
    .mutation(async ({ ctx, input }) => {
      const { lineItems, ...rest } = input;
      const existing = await (prisma as any).finalSettlement.findFirst({
        where: { terminationId: input.terminationId, tenantId: ctx.tenantId },
      });
      if (existing) {
        await (prisma as any).settlementLineItem.deleteMany({ where: { settlementId: existing.id } });
        return (prisma as any).finalSettlement.update({
          where:   { id: existing.id },
          data:    { ...rest, lineItems: { create: lineItems } },
          include: { lineItems: true },
        });
      }
      return (prisma as any).finalSettlement.create({
        data:    { tenantId: ctx.tenantId, ...rest, lineItems: { create: lineItems } },
        include: { lineItems: true },
      });
    }),
});

// ─── Access Revocation ────────────────────────────────────────────────────────

export const revocationRouter = router({
  getByTermination: guardedProcedure
    .input(z.object({ terminationId: z.string() }))
    .query(async ({ ctx, input }) => {
      return (prisma as any).accessRevocation.findMany({
        where:   { terminationId: input.terminationId, tenantId: ctx.tenantId },
        orderBy: { createdAt: "desc" },
      });
    }),

  create: guardedProcedure
    .input(z.object({
      terminationId: z.string(),
      system:        z.string(),
      accessType:    z.string(),
      revokedAt:     z.string().optional(),
      revokedById:   z.string().optional(),
      notes:         z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return (prisma as any).accessRevocation.create({
        data: {
          tenantId: ctx.tenantId,
          ...input,
          revokedAt: input.revokedAt ? new Date(input.revokedAt) : new Date(),
        },
      });
    }),

  markRevoked: guardedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return (prisma as any).accessRevocation.updateMany({
        where: { id: input.id, tenantId: ctx.tenantId },
        data:  { revokedAt: new Date(), revokedById: ctx.userId },
      });
    }),
});