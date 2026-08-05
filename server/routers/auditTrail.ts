/**
 * Audit Trail tRPC Router
 *
 * Read-only access to the immutable audit trail.
 * Supports pagination, filtering by entity/actor/module/action/date range.
 * Only accessible to roles with compliance or analytics read permission.
 *
 * Requirements: 1.7, 2.4, 20.1 — Property 5: Audit Trail Completeness
 */

import { z } from "zod";
import { abacProcedure, router } from "../trpc";
import { prisma } from "@/lib/prisma";

export const auditTrailRouter = router({

  list: abacProcedure("compliance", "read")
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
      const records = await prisma.auditTrail.findMany({
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

      const total = await prisma.auditTrail.count({
        where: {
          tenantId: ctx.tenantId,
          ...(input.entityType ? { entityType: input.entityType } : {}),
          ...(input.entityId   ? { entityId:   input.entityId   } : {}),
          ...(input.actorId    ? { actorId:    input.actorId    } : {}),
          ...(input.module     ? { module:     input.module     } : {}),
          ...(input.action     ? { action:     input.action     } : {}),
        },
      });

      return { records, total, take: input.take, skip: input.skip };
    }),

  getByEntity: abacProcedure("compliance", "read")
    .input(z.object({
      entityType: z.string().min(1),
      entityId:   z.string().min(1),
    }))
    .query(async ({ ctx, input }) => {
      return prisma.auditTrail.findMany({
        where: {
          tenantId:   ctx.tenantId,
          entityType: input.entityType,
          entityId:   input.entityId,
        },
        orderBy: { createdAt: "desc" },
      });
    }),

  // Summary stats for governance dashboard
  getSummary: abacProcedure("analytics", "read")
    .input(z.object({
      days: z.number().int().min(1).max(365).default(30),
    }).optional())
    .query(async ({ ctx, input }) => {
      const since = new Date();
      since.setDate(since.getDate() - (input?.days ?? 30));

      const [total, byAction] = await Promise.all([
        prisma.auditTrail.count({
          where: { tenantId: ctx.tenantId, createdAt: { gte: since } },
        }),
        prisma.auditTrail.groupBy({
          by:     ["action"],
          where:  { tenantId: ctx.tenantId, createdAt: { gte: since } },
          _count: { action: true },
        }),
      ]);

      return {
        total,
        byAction: byAction.map((r: any) => ({ action: r.action, count: r._count.action })),
        since:    since.toISOString(),
      };
    }),
});