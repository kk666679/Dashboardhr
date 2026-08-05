/**
 * Benefits Administration tRPC Router — Sprint 16
 *
 * Manages benefit plans, employee enrolments, and open-enrolment periods.
 *
 * Requirements: 16.1–16.7
 */

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { guardedProcedure, router } from "../trpc";
import { prisma } from "@/lib/prisma";
import { writeAuditEntry } from "@/lib/shared-kernel/audit/audit-middleware";

const PlanTypeSchema = z.enum([
  "MEDICAL", "DENTAL", "VISION", "LIFE_INSURANCE", "PENSION", "WELLNESS", "OTHER",
]);

export const benefitsRouter = router({

  // ── Benefit Plans ─────────────────────────────────────────────────────────────

  listPlans: guardedProcedure
    .input(z.object({
      planType: PlanTypeSchema.optional(),
      isActive: z.boolean().optional(),
    }).optional())
    .query(async ({ ctx, input }) => {
      return (prisma as any).benefitPlan.findMany({
        where: {
          tenantId: ctx.tenantId,
          ...(input?.planType !== undefined ? { planType: input.planType } : {}),
          ...(input?.isActive !== undefined ? { isActive: input.isActive } : {}),
        },
        include: { _count: { select: { enrolments: true } } },
        orderBy: { name: "asc" },
      });
    }),

  getPlan: guardedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const plan = await (prisma as any).benefitPlan.findFirst({
        where:   { id: input.id, tenantId: ctx.tenantId },
        include: { enrolments: { take: 10 } },
      });
      if (!plan) throw new TRPCError({ code: "NOT_FOUND" });
      return plan;
    }),

  createPlan: guardedProcedure
    .input(z.object({
      name:              z.string().min(1),
      planType:          PlanTypeSchema,
      description:       z.string().optional(),
      isActive:          z.boolean().default(true),
      enrolmentDeadline: z.coerce.date().optional(),
      effectiveDate:     z.coerce.date().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const plan = await (prisma as any).benefitPlan.create({
        data: { ...input, tenantId: ctx.tenantId },
      });

      await writeAuditEntry({
        tenantId:   ctx.tenantId,
        module:     "benefits",
        entityType: "BenefitPlan",
        entityId:   plan.id,
        action:     "CREATE",
        actorId:    ctx.userId,
        actorRole:  ctx.userRole,
        newValue:   { name: plan.name, planType: plan.planType },
      });

      return plan;
    }),

  updatePlan: guardedProcedure
    .input(z.object({
      id:          z.string(),
      name:        z.string().optional(),
      description: z.string().optional(),
      isActive:    z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return (prisma as any).benefitPlan.update({
        where: { id },
        data,
      });
    }),

  // ── Enrolments ───────────────────────────────────────────────────────────────

  enrol: guardedProcedure
    .input(z.object({
      employeeId:   z.string().min(1),
      planId:       z.string().min(1),
      effectiveDate: z.coerce.date().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Verify plan belongs to tenant
      const plan = await (prisma as any).benefitPlan.findFirst({
        where: { id: input.planId, tenantId: ctx.tenantId, isActive: true },
      });
      if (!plan) throw new TRPCError({ code: "NOT_FOUND", message: "Plan not found or inactive" });

      const enrolment = await (prisma as any).benefitEnrolment.upsert({
        where: {
          tenantId_employeeId_planId: {
            tenantId:   ctx.tenantId,
            employeeId: input.employeeId,
            planId:     input.planId,
          },
        },
        create: {
          tenantId:     ctx.tenantId,
          employeeId:   input.employeeId,
          planId:       input.planId,
          status:       "ACTIVE",
          effectiveDate: input.effectiveDate,
        },
        update: {
          status:       "ACTIVE",
          effectiveDate: input.effectiveDate,
        },
      });

      await writeAuditEntry({
        tenantId:   ctx.tenantId,
        module:     "benefits",
        entityType: "BenefitEnrolment",
        entityId:   enrolment.id,
        action:     "CREATE",
        actorId:    ctx.userId,
        actorRole:  ctx.userRole,
        newValue:   { employeeId: input.employeeId, planId: input.planId },
      });

      return enrolment;
    }),

  waive: guardedProcedure
    .input(z.object({
      employeeId: z.string().min(1),
      planId:     z.string().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      return (prisma as any).benefitEnrolment.update({
        where: {
          tenantId_employeeId_planId: {
            tenantId:   ctx.tenantId,
            employeeId: input.employeeId,
            planId:     input.planId,
          },
        },
        data: { status: "WAIVED" },
      });
    }),

  listEnrolments: guardedProcedure
    .input(z.object({
      employeeId: z.string().optional(),
      planId:     z.string().optional(),
      status:     z.string().optional(),
    }).optional())
    .query(async ({ ctx, input }) => {
      return (prisma as any).benefitEnrolment.findMany({
        where: {
          tenantId: ctx.tenantId,
          ...(input?.employeeId ? { employeeId: input.employeeId } : {}),
          ...(input?.planId     ? { planId:     input.planId     } : {}),
          ...(input?.status     ? { status:     input.status     } : {}),
        },
        include: { plan: { select: { name: true, planType: true } } },
        orderBy: { enrolledAt: "desc" },
      });
    }),
});
