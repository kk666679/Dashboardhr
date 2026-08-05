/**
 * Compensation Plans tRPC Router
 * Handles bonus plans, compensation cycles, equity grants,
 * incentive plans, merit reviews, and variable pay payouts.
 */
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { guardedProcedure, router } from "../trpc";
import { prisma } from "@/lib/prisma";

// ─── Bonus Plans ──────────────────────────────────────────────────────────────
export const bonusPlanRouter = router({
  getById: guardedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const r = await (prisma as any).bonusPlan.findFirst({ where: { id: input.id, tenantId: ctx.tenantId } });
      if (!r) throw new TRPCError({ code: "NOT_FOUND" });
      return r;
    }),
  getByCycle: guardedProcedure
    .input(z.object({ cycleId: z.string() }))
    .query(async ({ ctx, input }) => {
      return (prisma as any).bonusPlan.findMany({ where: { cycleId: input.cycleId, tenantId: ctx.tenantId } });
    }),
  save: guardedProcedure
    .input(z.object({
      id:          z.string().optional(),
      cycleId:     z.string(),
      name:        z.string().min(1),
      description: z.string().optional(),
      eligibility: z.string().optional(),
      tiers:       z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      if (id) {
        return (prisma as any).bonusPlan.updateMany({ where: { id, tenantId: ctx.tenantId }, data });
      }
      return (prisma as any).bonusPlan.create({ data: { tenantId: ctx.tenantId, ...data } });
    }),
  delete: guardedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await (prisma as any).bonusPlan.deleteMany({ where: { id: input.id, tenantId: ctx.tenantId } });
      return { ok: true };
    }),
});

// ─── Compensation Cycles ──────────────────────────────────────────────────────
export const compensationCycleRouter = router({
  getAll: guardedProcedure.query(async ({ ctx }) => {
    return (prisma as any).compensationCycle.findMany({ where: { tenantId: ctx.tenantId }, orderBy: { startDate: "desc" } });
  }),
  getById: guardedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const r = await (prisma as any).compensationCycle.findFirst({ where: { id: input.id, tenantId: ctx.tenantId } });
      if (!r) throw new TRPCError({ code: "NOT_FOUND" });
      return r;
    }),
  save: guardedProcedure
    .input(z.object({
      id:          z.string().optional(),
      name:        z.string().min(1),
      startDate:   z.string(),
      endDate:     z.string(),
      status:      z.string().default("DRAFT"),
      budget:      z.number().optional(),
      description: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      if (id) {
        return (prisma as any).compensationCycle.updateMany({ where: { id, tenantId: ctx.tenantId }, data });
      }
      return (prisma as any).compensationCycle.create({ data: { tenantId: ctx.tenantId, ...data } });
    }),
});

// ─── Equity ───────────────────────────────────────────────────────────────────
export const equityDefinitionRouter = router({
  getAll: guardedProcedure.query(async ({ ctx }) => {
    return (prisma as any).equityDefinition.findMany({ where: { tenantId: ctx.tenantId } });
  }),
  getById: guardedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return (prisma as any).equityDefinition.findFirst({ where: { id: input.id, tenantId: ctx.tenantId } });
    }),
  save: guardedProcedure
    .input(z.object({
      id:          z.string().optional(),
      name:        z.string().min(1),
      type:        z.string().default("RSU"),
      vestingSchedule: z.string().optional(),
      description: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      if (id) return (prisma as any).equityDefinition.updateMany({ where: { id, tenantId: ctx.tenantId }, data });
      return (prisma as any).equityDefinition.create({ data: { tenantId: ctx.tenantId, ...data } });
    }),
});

export const equityGrantRouter = router({
  getById: guardedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return (prisma as any).equityGrant.findFirst({ where: { id: input.id, tenantId: ctx.tenantId } });
    }),
  getByEmployee: guardedProcedure
    .input(z.object({ employeeId: z.string() }))
    .query(async ({ ctx, input }) => {
      return (prisma as any).equityGrant.findMany({ where: { employeeId: input.employeeId, tenantId: ctx.tenantId } });
    }),
  save: guardedProcedure
    .input(z.object({
      id:               z.string().optional(),
      employeeId:       z.string(),
      definitionId:     z.string(),
      grantDate:        z.string(),
      quantity:         z.number().min(0),
      vestingStartDate: z.string().optional(),
      strikePrice:      z.number().optional(),
      notes:            z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      if (id) return (prisma as any).equityGrant.updateMany({ where: { id, tenantId: ctx.tenantId }, data });
      return (prisma as any).equityGrant.create({ data: { tenantId: ctx.tenantId, ...data } });
    }),
});

// ─── Incentive Plans ──────────────────────────────────────────────────────────
export const incentivePlanRouter = router({
  getAll: guardedProcedure.query(async ({ ctx }) => {
    return (prisma as any).incentivePlan.findMany({ where: { tenantId: ctx.tenantId } });
  }),
  getById: guardedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return (prisma as any).incentivePlan.findFirst({ where: { id: input.id, tenantId: ctx.tenantId } });
    }),
  save: guardedProcedure
    .input(z.object({
      id:          z.string().optional(),
      name:        z.string().min(1),
      type:        z.string().default("KPI"),
      description: z.string().optional(),
      metrics:     z.string().optional(),
      targetAmount: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      if (id) return (prisma as any).incentivePlan.updateMany({ where: { id, tenantId: ctx.tenantId }, data });
      return (prisma as any).incentivePlan.create({ data: { tenantId: ctx.tenantId, ...data } });
    }),
});

// ─── Merit ────────────────────────────────────────────────────────────────────
export const meritRouter = router({
  getById: guardedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return (prisma as any).meritReview.findFirst({ where: { id: input.id, tenantId: ctx.tenantId } });
    }),
  getByCycle: guardedProcedure
    .input(z.object({ cycleId: z.string() }))
    .query(async ({ ctx, input }) => {
      return (prisma as any).meritReview.findMany({ where: { cycleId: input.cycleId, tenantId: ctx.tenantId } });
    }),
  save: guardedProcedure
    .input(z.object({
      id:              z.string().optional(),
      cycleId:         z.string(),
      employeeId:      z.string(),
      currentSalary:   z.number().min(0),
      proposedSalary:  z.number().min(0),
      increasePercent: z.number().optional(),
      justification:   z.string().optional(),
      status:          z.string().default("DRAFT"),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      if (id) return (prisma as any).meritReview.updateMany({ where: { id, tenantId: ctx.tenantId }, data });
      return (prisma as any).meritReview.create({ data: { tenantId: ctx.tenantId, ...data } });
    }),
});

// ─── Variable Pay ─────────────────────────────────────────────────────────────
export const variablePayRouter = router({
  getById: guardedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return (prisma as any).variablePay.findFirst({ where: { id: input.id, tenantId: ctx.tenantId } });
    }),
  getByEmployee: guardedProcedure
    .input(z.object({ employeeId: z.string() }))
    .query(async ({ ctx, input }) => {
      return (prisma as any).variablePay.findMany({ where: { employeeId: input.employeeId, tenantId: ctx.tenantId } });
    }),
  save: guardedProcedure
    .input(z.object({
      id:          z.string().optional(),
      employeeId:  z.string(),
      cycleId:     z.string(),
      amount:      z.number().min(0),
      type:        z.string().default("BONUS"),
      payoutDate:  z.string().optional(),
      notes:       z.string().optional(),
      status:      z.string().default("PENDING"),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      if (id) return (prisma as any).variablePay.updateMany({ where: { id, tenantId: ctx.tenantId }, data });
      return (prisma as any).variablePay.create({ data: { tenantId: ctx.tenantId, ...data } });
    }),
});
