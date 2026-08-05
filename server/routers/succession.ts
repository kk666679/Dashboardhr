/**
 * Succession Planning tRPC Router — Sprint 14
 *
 * Manages 9-Box grid, critical roles, succession candidates, readiness.
 *
 * Requirements: 14.1–14.6
 */

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { guardedProcedure, router } from "../trpc";
import { prisma } from "@/lib/prisma";
import { writeAuditEntry } from "@/lib/shared-kernel/audit/audit-middleware";

const ReadinessSchema = z.enum(["READY_NOW", "READY_IN_1Y", "READY_IN_3Y"]);

export const successionRouter = router({

  listPlans: guardedProcedure
    .input(z.object({ criticalOnly: z.boolean().optional() }).optional())
    .query(async ({ ctx, input }) => {
      return (prisma as any).successionPlan.findMany({
        where: {
          tenantId: ctx.tenantId,
          ...(input?.criticalOnly ? { criticalRole: true } : {}),
        },
        include: {
          candidates: {
            orderBy: { readiness: "asc" },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    }),

  getPlan: guardedProcedure
    .input(z.object({ positionId: z.string() }))
    .query(async ({ ctx, input }) => {
      const plan = await (prisma as any).successionPlan.findFirst({
        where:   { tenantId: ctx.tenantId, positionId: input.positionId },
        include: { candidates: true },
      });
      if (!plan) throw new TRPCError({ code: "NOT_FOUND" });
      return plan;
    }),

  upsertPlan: guardedProcedure
    .input(z.object({
      positionId:   z.string().min(1),
      criticalRole: z.boolean().default(false),
    }))
    .mutation(async ({ ctx, input }) => {
      return (prisma as any).successionPlan.upsert({
        where:  { tenantId_positionId: { tenantId: ctx.tenantId, positionId: input.positionId } },
        create: { tenantId: ctx.tenantId, ...input },
        update: { criticalRole: input.criticalRole },
      });
    }),

  addCandidate: guardedProcedure
    .input(z.object({
      positionId:  z.string().min(1),
      employeeId:  z.string().min(1),
      readiness:   ReadinessSchema.default("READY_IN_3Y"),
      nineBoxX:    z.number().int().min(1).max(3).optional(),
      nineBoxY:    z.number().int().min(1).max(3).optional(),
      notes:       z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Get or create the plan
      const plan = await (prisma as any).successionPlan.upsert({
        where:  { tenantId_positionId: { tenantId: ctx.tenantId, positionId: input.positionId } },
        create: { tenantId: ctx.tenantId, positionId: input.positionId },
        update: {},
      });

      const candidate = await (prisma as any).successionCandidate.upsert({
        where:  { planId_employeeId: { planId: (plan as any).id, employeeId: input.employeeId } },
        create: {
          planId:     (plan as any).id,
          employeeId: input.employeeId,
          readiness:  input.readiness,
          nineBoxX:   input.nineBoxX,
          nineBoxY:   input.nineBoxY,
          notes:      input.notes,
        },
        update: {
          readiness: input.readiness,
          nineBoxX:  input.nineBoxX,
          nineBoxY:  input.nineBoxY,
          notes:     input.notes,
        },
      });

      await writeAuditEntry({
        tenantId:   ctx.tenantId,
        module:     "succession",
        entityType: "SuccessionCandidate",
        entityId:   candidate.id,
        action:     "CREATE",
        actorId:    ctx.userId,
        actorRole:  ctx.userRole,
        newValue:   { positionId: input.positionId, employeeId: input.employeeId, readiness: input.readiness },
      });

      return candidate;
    }),

  removeCandidate: guardedProcedure
    .input(z.object({ candidateId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Verify the candidate's plan belongs to this tenant
      const candidate = await (prisma as any).successionCandidate.findFirst({
        where:   { id: input.candidateId },
        include: { plan: { select: { tenantId: true } } },
      });
      if (!candidate || candidate.plan.tenantId !== ctx.tenantId) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      return (prisma as any).successionCandidate.delete({ where: { id: input.candidateId } });
    }),

  // 9-Box grid data — all positions with their candidates + 9-box coords
  getNineBoxGrid: guardedProcedure
    .input(z.object({}).optional())
    .query(async ({ ctx }) => {
      const plans = await (prisma as any).successionPlan.findMany({
        where:   { tenantId: ctx.tenantId },
        include: { candidates: true },
      });

      return plans.flatMap((plan: unknown) =>
        (plan as any).candidates
          .filter((c: unknown) => (c as any).nineBoxX != null && (c as any).nineBoxY != null)
          .map((c: unknown) => ({
            planId:     (plan as any).id,
            positionId: (plan as any).positionId,
            employeeId: (c as any).employeeId,
            readiness:  (c as any).readiness,
            x:          (c as any).nineBoxX,
            y:          (c as any).nineBoxY,
          }))
      );
    }),
});
