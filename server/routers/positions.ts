/**
 * Positions tRPC Router — Organisation / Succession
 *
 * Manages job positions within org nodes (headcount, filled count, critical flag).
 * Used by Succession Planning and Workforce Planning modules.
 *
 * Requirements: 1.3, 14.2, 28.5
 */

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { guardedProcedure, router } from "../trpc";
import { prisma } from "@/lib/prisma";
import { writeAuditEntry } from "@/lib/shared-kernel/audit/audit-middleware";

export const positionsRouter = router({

  list: guardedProcedure
    .input(z.object({
      orgNodeId:  z.string().optional(),
      isCritical: z.boolean().optional(),
      isActive:   z.boolean().optional(),
    }).optional())
    .query(async ({ ctx, input }) => {
      return (prisma as any).position.findMany({
        where: {
          tenantId: ctx.tenantId,
          deletedAt: null,
          ...(input?.orgNodeId  ? { orgNodeId:  input.orgNodeId  } : {}),
          ...(input?.isCritical !== undefined ? { isCritical: input.isCritical } : {}),
          ...(input?.isActive   !== undefined ? { isActive:   input.isActive   } : {}),
        },
        include: { orgNode: { select: { name: true, level: true } } },
        orderBy: [{ orgNodeId: "asc" }, { title: "asc" }],
      });
    }),

  getById: guardedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const pos = await (prisma as any).position.findFirst({
        where:   { id: input.id, tenantId: ctx.tenantId, deletedAt: null },
        include: { orgNode: true },
      });
      if (!pos) throw new TRPCError({ code: "NOT_FOUND" });
      return pos;
    }),

  create: guardedProcedure
    .input(z.object({
      orgNodeId:  z.string().min(1),
      title:      z.string().min(1),
      jobGrade:   z.string().optional(),
      headcount:  z.number().int().min(1).default(1),
      isCritical: z.boolean().default(false),
    }))
    .mutation(async ({ ctx, input }) => {
      const orgNode = await prisma.orgNode.findFirst({
        where: { id: input.orgNodeId, tenantId: ctx.tenantId },
      });
      if (!orgNode) throw new TRPCError({ code: "NOT_FOUND", message: "Org node not found" });

      const position = await (prisma as any).position.create({
        data: { ...input, tenantId: ctx.tenantId },
      });

      await writeAuditEntry({
        tenantId:   ctx.tenantId,
        module:     "org",
        entityType: "Position",
        entityId:   position.id,
        action:     "CREATE",
        actorId:    ctx.userId,
        actorRole:  ctx.userRole,
        newValue:   { title: position.title, orgNodeId: position.orgNodeId },
      });

      return position;
    }),

  update: guardedProcedure
    .input(z.object({
      id:         z.string(),
      title:      z.string().optional(),
      jobGrade:   z.string().optional(),
      headcount:  z.number().int().min(1).optional(),
      isCritical: z.boolean().optional(),
      isActive:   z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const existing = await (prisma as any).position.findFirst({
        where: { id, tenantId: ctx.tenantId, deletedAt: null },
      });
      if (!existing) throw new TRPCError({ code: "NOT_FOUND" });

      return (prisma as any).position.update({ where: { id }, data });
    }),

  softDelete: guardedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const pos = await (prisma as any).position.findFirst({
        where: { id: input.id, tenantId: ctx.tenantId, deletedAt: null },
      });
      if (!pos) throw new TRPCError({ code: "NOT_FOUND" });

      await writeAuditEntry({
        tenantId:   ctx.tenantId,
        module:     "org",
        entityType: "Position",
        entityId:   input.id,
        action:     "DELETE",
        actorId:    ctx.userId,
        actorRole:  ctx.userRole,
        previousValue: { title: pos.title },
      });

      return (prisma as any).position.update({
        where: { id: input.id },
        data:  { deletedAt: new Date(), isActive: false },
      });
    }),

  // Increment/decrement filled count (called when employee is assigned/removed from position)
  updateFilledCount: guardedProcedure
    .input(z.object({
      id:    z.string(),
      delta: z.number().int(), // +1 or -1
    }))
    .mutation(async ({ ctx, input }) => {
      const pos = await (prisma as any).position.findFirst({
        where: { id: input.id, tenantId: ctx.tenantId },
        select: { filledCount: true, headcount: true },
      });
      if (!pos) throw new TRPCError({ code: "NOT_FOUND" });

      const newCount = Math.max(0, pos.filledCount + input.delta);

      return (prisma as any).position.update({
        where: { id: input.id },
        data:  { filledCount: newCount },
      });
    }),
});
