/**
 * Succession Planning sub-routers
 * criticalPosition, devPlan, nineBox, readiness, successor
 * (in addition to the existing successionRouter in succession.ts)
 */
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { guardedProcedure, router } from "../trpc";
import { prisma } from "@/lib/prisma";

// ─── Critical Positions ───────────────────────────────────────────────────────
export const criticalPositionRouter = router({
  getAll: guardedProcedure.query(async ({ ctx }) => {
    return (prisma as any).criticalPosition.findMany({
      where: { tenantId: ctx.tenantId },
      orderBy: { jobTitle: "asc" },
    });
  }),
  getById: guardedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const r = await (prisma as any).criticalPosition.findFirst({ where: { id: input.id, tenantId: ctx.tenantId } });
      if (!r) throw new TRPCError({ code: "NOT_FOUND" });
      return r;
    }),
  save: guardedProcedure
    .input(z.object({
      id:          z.string().optional(),
      jobTitle:    z.string().min(1),
      department:  z.string().optional(),
      description: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      if (id) {
        await (prisma as any).criticalPosition.updateMany({ where: { id, tenantId: ctx.tenantId }, data });
        return (prisma as any).criticalPosition.findFirst({ where: { id, tenantId: ctx.tenantId } });
      }
      return (prisma as any).criticalPosition.create({ data: { tenantId: ctx.tenantId, ...data } });
    }),
  delete: guardedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await (prisma as any).criticalPosition.deleteMany({ where: { id: input.id, tenantId: ctx.tenantId } });
      return { ok: true };
    }),
});

// ─── Development Plans ────────────────────────────────────────────────────────
export const devPlanRouter = router({
  getAll: guardedProcedure
    .input(z.object({ employeeId: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      return (prisma as any).developmentPlan.findMany({
        where: { tenantId: ctx.tenantId, ...(input?.employeeId ? { employeeId: input.employeeId } : {}) },
        orderBy: { startDate: "desc" },
      });
    }),
  getById: guardedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const r = await (prisma as any).developmentPlan.findFirst({ where: { id: input.id, tenantId: ctx.tenantId } });
      if (!r) throw new TRPCError({ code: "NOT_FOUND" });
      return r;
    }),
  save: guardedProcedure
    .input(z.object({
      id:          z.string().optional(),
      employeeId:  z.string(),
      title:       z.string().min(1),
      startDate:   z.string(),
      endDate:     z.string().optional(),
      status:      z.string().default("ACTIVE"),
      description: z.string().optional(),
      goals:       z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      if (id) {
        await (prisma as any).developmentPlan.updateMany({ where: { id, tenantId: ctx.tenantId }, data });
        return (prisma as any).developmentPlan.findFirst({ where: { id, tenantId: ctx.tenantId } });
      }
      return (prisma as any).developmentPlan.create({ data: { tenantId: ctx.tenantId, ...data } });
    }),
});

// ─── Nine Box ─────────────────────────────────────────────────────────────────
export const nineBoxRouter = router({
  getAll: guardedProcedure.query(async ({ ctx }) => {
    return (prisma as any).nineBoxAssessment.findMany({
      where: { tenantId: ctx.tenantId },
      include: { employee: { select: { id: true, name: true } } },
    });
  }),
  save: guardedProcedure
    .input(z.object({
      id:           z.string().optional(),
      employeeId:   z.string(),
      performance:  z.number().int().min(1).max(3),
      potential:    z.number().int().min(1).max(3),
      cycleId:      z.string().optional(),
      notes:        z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      if (id) {
        await (prisma as any).nineBoxAssessment.updateMany({ where: { id, tenantId: ctx.tenantId }, data });
        return (prisma as any).nineBoxAssessment.findFirst({ where: { id, tenantId: ctx.tenantId } });
      }
      return (prisma as any).nineBoxAssessment.create({ data: { tenantId: ctx.tenantId, ...data } });
    }),
});

// ─── Readiness ────────────────────────────────────────────────────────────────
export const readinessRouter = router({
  getById: guardedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return (prisma as any).readinessAssessment.findFirst({ where: { id: input.id, tenantId: ctx.tenantId } });
    }),
  getByEmployee: guardedProcedure
    .input(z.object({ employeeId: z.string() }))
    .query(async ({ ctx, input }) => {
      return (prisma as any).readinessAssessment.findMany({
        where: { employeeId: input.employeeId, tenantId: ctx.tenantId },
        orderBy: { assessedAt: "desc" },
      });
    }),
  save: guardedProcedure
    .input(z.object({
      id:          z.string().optional(),
      employeeId:  z.string(),
      positionId:  z.string(),
      readiness:   z.enum(["READY_NOW", "READY_IN_1Y", "READY_IN_3Y"]),
      score:       z.number().min(0).max(100).optional(),
      gaps:        z.string().optional(),
      notes:       z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      if (id) {
        await (prisma as any).readinessAssessment.updateMany({ where: { id, tenantId: ctx.tenantId }, data });
        return (prisma as any).readinessAssessment.findFirst({ where: { id, tenantId: ctx.tenantId } });
      }
      return (prisma as any).readinessAssessment.create({
        data: { tenantId: ctx.tenantId, ...data, assessedAt: new Date() },
      });
    }),
});

// ─── Successors ───────────────────────────────────────────────────────────────
export const successorRouter = router({
  getByPosition: guardedProcedure
    .input(z.object({ positionId: z.string() }))
    .query(async ({ ctx, input }) => {
      return (prisma as any).successionCandidate.findMany({
        where: {
          plan: { positionId: input.positionId, tenantId: ctx.tenantId },
        },
        include: { employee: { select: { id: true, name: true } } },
        orderBy: { readiness: "asc" },
      });
    }),
  updateRanking: guardedProcedure
    .input(z.object({
      updates: z.array(z.object({
        candidateId: z.string(),
        rank:        z.number().int().min(1),
      })),
    }))
    .mutation(async ({ ctx, input }) => {
      await Promise.all(
        input.updates.map(({ candidateId, rank }) =>
          (prisma as any).successionCandidate.updateMany({
            where: { id: candidateId },
            data:  { rank },
          })
        )
      );
      return { ok: true };
    }),
});
