/**
 * Workforce Planning tRPC Router — Sprint 28
 *
 * Headcount planning cycles, position plans, vacancy forecasts, and gap analysis.
 *
 * Requirements: 28.1–28.8
 */

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { guardedProcedure, abacProcedure, router } from "../trpc";
import { prisma } from "@/lib/prisma";

export const workforcePlanningRouter = router({

  // ── Headcount Plans ───────────────────────────────────────────────────────────

  listPlans: guardedProcedure
    .input(z.object({
      planYear:   z.number().int().min(2020).max(2050),
      orgNodeId:  z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      return (prisma as any).headcountPlan.findMany({
        where: {
          tenantId: ctx.tenantId,
          planYear: input.planYear,
          ...(input.orgNodeId ? { orgNodeId: input.orgNodeId } : {}),
        },
        orderBy: [{ orgNodeId: "asc" }, { planMonth: "asc" }],
      });
    }),

  upsertPlan: abacProcedure("org", "write")
    .input(z.object({
      orgNodeId: z.string().min(1),
      planYear:  z.number().int().min(2020).max(2050),
      planMonth: z.number().int().min(1).max(12).optional(),
      planned:   z.number().int().min(0),
      notes:     z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return (prisma as any).headcountPlan.upsert({
        where: {
          tenantId_orgNodeId_planYear_planMonth: {
            tenantId:  ctx.tenantId,
            orgNodeId: input.orgNodeId,
            planYear:  input.planYear,
            planMonth: input.planMonth ?? 0,
          },
        },
        create: { tenantId: ctx.tenantId, ...input, planMonth: input.planMonth ?? 0 },
        update: { planned: input.planned, notes: input.notes },
      });
    }),

  // Sync actual headcount into plans for a given year/month
  syncActual: abacProcedure("org", "write")
    .input(z.object({
      planYear:  z.number().int(),
      planMonth: z.number().int().min(1).max(12).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Get all active positions grouped by orgNode
      const positions = await (prisma as any).position.findMany({
        where: { tenantId: ctx.tenantId, isActive: true },
        select: { orgNodeId: true, filledCount: true },
      });

      const nodeActuals = new Map<string, number>();
      for (const pos of positions) {
        nodeActuals.set(pos.orgNodeId, (nodeActuals.get(pos.orgNodeId) ?? 0) + pos.filledCount);
      }

      for (const [orgNodeId, actual] of nodeActuals.entries()) {
        const plan = await (prisma as any).headcountPlan.findFirst({
          where: { tenantId: ctx.tenantId, orgNodeId, planYear: input.planYear, planMonth: input.planMonth ?? 0 },
        });
        if (plan) {
          await (prisma as any).headcountPlan.update({
            where: { id: plan.id },
            data:  { actual, variance: plan.planned - actual },
          });
        }
      }

      return { synced: nodeActuals.size };
    }),

  // ── Gap Analysis ─────────────────────────────────────────────────────────────

  getGapAnalysis: guardedProcedure
    .input(z.object({
      planYear:  z.number().int(),
      planMonth: z.number().int().min(1).max(12).optional(),
    }))
    .query(async ({ ctx, input }) => {
      const plans = await (prisma as any).headcountPlan.findMany({
        where: {
          tenantId: ctx.tenantId,
          planYear: input.planYear,
          planMonth: input.planMonth ?? 0,
          variance: { not: 0 },
        },
        orderBy: { variance: "asc" }, // biggest deficits first
      });

      return plans.map((p: unknown) => ({
        orgNodeId:    (p as any).orgNodeId,
        planYear:     (p as any).planYear,
        planMonth:    (p as any).planMonth,
        planned:      (p as any).planned,
        actual:       (p as any).actual,
        variance:     (p as any).variance,
        isDeficit:    (p as any).variance > 0,  // planned > actual = deficit
        isSurplus:    (p as any).variance < 0,
      }));
    }),

  // ── Vacancy Forecast ─────────────────────────────────────────────────────────

  getVacancyForecast: guardedProcedure
    .input(z.object({}).optional())
    .query(async ({ ctx }) => {
      // Positions where filledCount < headcount
      const positions = await (prisma as any).position.findMany({
        where: {
          tenantId: ctx.tenantId,
          isActive: true,
        },
        include: { orgNode: { select: { name: true, level: true } } },
      });

      return positions
        .filter((p: unknown) => (p as any).filledCount < (p as any).headcount)
        .map((p: unknown) => ({
          positionId:   (p as any).id,
          title:        (p as any).title,
          orgNode:      (p as any).orgNode?.name,
          orgNodeLevel: (p as any).orgNode?.level,
          headcount:    (p as any).headcount,
          filled:       (p as any).filledCount,
          vacancies:    (p as any).headcount - (p as any).filledCount,
          isCritical:   (p as any).isCritical,
        }));
    }),

  // Deviation alerts — plans deviating by >10%
  getDeviationAlerts: guardedProcedure
    .input(z.object({ planYear: z.number().int() }))
    .query(async ({ ctx, input }) => {
      const plans = await (prisma as any).headcountPlan.findMany({
        where: { tenantId: ctx.tenantId, planYear: input.planYear },
      });

      return plans
        .filter((p: unknown) => {
          if ((p as any).planned === 0) return false;
          const deviationPct = Math.abs((p as any).variance / (p as any).planned) * 100;
          return deviationPct > 10;
        })
        .map((p: unknown) => ({
          orgNodeId:    (p as any).orgNodeId,
          planned:      (p as any).planned,
          actual:       (p as any).actual,
          variance:     (p as any).variance,
          deviationPct: (p as any).planned > 0 ? Math.abs((p as any).variance / (p as any).planned) * 100 : 0,
        }));
    }),
});
