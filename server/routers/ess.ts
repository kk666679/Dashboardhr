/**
 * Employee Self-Service (ESS) tRPC Router — Sprint 17
 *
 * Aggregates self-service data for the ESS portal:
 * leave, payslips, claims, profile, training summary, assets.
 *
 * Requirements: 14.3, 17.1–17.8
 */

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { guardedProcedure, router } from "../trpc";
import { prisma } from "@/lib/prisma";

export const essRouter = router({

  // ── Dashboard ─────────────────────────────────────────────────────────────────

  getDashboard: guardedProcedure
    .input(z.object({}).optional())
    .query(async ({ ctx }) => {
      const employeeId = ctx.session?.employeeId;
      if (!employeeId) throw new TRPCError({ code: "UNAUTHORIZED", message: "No employee context" });

      const year = new Date().getFullYear();

      const [employee, leaveBalances, pendingLeaves, myAssets, myClaims] = await Promise.all([
        prisma.employee.findFirst({
          where:   { id: employeeId, tenantId: ctx.tenantId },
          include: { profile: true },
        }),
        prisma.leaveBalance.findMany({
          where: { tenantId: ctx.tenantId, employeeId, year },
        }),
        (prisma as any).leaveApplication.findMany({
          where: { tenantId: ctx.tenantId, employeeId, status: "PENDING" },
          take:  5,
        }),
        (prisma as any).assetAssignment.findMany({
          where:   { tenantId: ctx.tenantId, employeeId, returnedAt: null },
          include: { asset: { select: { name: true, category: true, assetTag: true } } },
          take:    10,
        }),
        (prisma as any).claim.findMany({
          where:   { tenantId: ctx.tenantId, employeeId },
          orderBy: { createdAt: "desc" },
          take:    5,
        }),
      ]);

      return {
        employee: {
          id:               employee?.id,
          name:             employee?.name,
          position:         employee?.position,
          department:       employee?.department,
          employmentStatus: employee?.profile?.employmentStatus ?? "ACTIVE",
          hireDate:         employee?.hireDate,
          profilePhotoUrl:  employee?.profile?.profilePhotoUrl,
        },
        leaveBalances,
        pendingLeaves,
        myAssets,
        recentClaims: myClaims,
      };
    }),

  // ── Profile ───────────────────────────────────────────────────────────────────

  getMyProfile: guardedProcedure
    .input(z.object({}).optional())
    .query(async ({ ctx }) => {
      const employeeId = ctx.session?.employeeId;
      if (!employeeId) throw new TRPCError({ code: "UNAUTHORIZED" });

      return prisma.employee.findFirst({
        where:   { id: employeeId, tenantId: ctx.tenantId },
        include: { profile: true, contracts: { orderBy: { createdAt: "desc" }, take: 1 } },
      });
    }),

  updateMyProfile: guardedProcedure
    .input(z.object({
      phone:                z.string().optional(),
      address:              z.string().optional(),
      emergencyName:        z.string().optional(),
      emergencyPhone:       z.string().optional(),
      emergencyRelation:    z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const employeeId = ctx.session?.employeeId;
      if (!employeeId) throw new TRPCError({ code: "UNAUTHORIZED" });

      // Update base employee fields
      const { emergencyName, emergencyPhone, emergencyRelation, ...empData } = input;
      if (Object.keys(empData).length > 0) {
        await prisma.employee.update({
          where: { id: employeeId },
          data:  empData,
        });
      }

      // Update profile fields
      await (prisma as any).employeeProfile.upsert({
        where:  { employeeId },
        create: { employeeId, emergencyName, emergencyPhone, emergencyRelation },
        update: { emergencyName, emergencyPhone, emergencyRelation },
      });

      return { success: true };
    }),

  // ── Payslips ──────────────────────────────────────────────────────────────────

  getMyPayslips: guardedProcedure
    .input(z.object({
      year: z.number().int().optional(),
      take: z.number().int().min(1).max(24).default(12),
    }).optional())
    .query(async ({ ctx, input }) => {
      const employeeId = ctx.session?.employeeId;
      if (!employeeId) throw new TRPCError({ code: "UNAUTHORIZED" });

      return prisma.payroll.findMany({
        where: {
          tenantId:   ctx.tenantId,
          employeeId,
          ...(input?.year ? {
            periodStart: { gte: new Date(input.year, 0, 1) },
            periodEnd:   { lte: new Date(input.year, 11, 31) },
          } : {}),
        },
        orderBy: { periodStart: "desc" },
        take: input?.take ?? 12,
      });
    }),

  // ── Leave Summary ─────────────────────────────────────────────────────────────

  getMyLeaveBalance: guardedProcedure
    .input(z.object({ year: z.number().int().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const employeeId = ctx.session?.employeeId;
      if (!employeeId) throw new TRPCError({ code: "UNAUTHORIZED" });

      const year = input?.year ?? new Date().getFullYear();
      return prisma.leaveBalance.findMany({
        where: { tenantId: ctx.tenantId, employeeId, year },
      });
    }),

  // ── Claims ────────────────────────────────────────────────────────────────────

  getMyClaims: guardedProcedure
    .input(z.object({
      status: z.string().optional(),
      take:   z.number().int().min(1).max(50).default(20),
    }).optional())
    .query(async ({ ctx, input }) => {
      const employeeId = ctx.session?.employeeId;
      if (!employeeId) throw new TRPCError({ code: "UNAUTHORIZED" });

      return (prisma as any).claim.findMany({
        where: {
          tenantId:   ctx.tenantId,
          employeeId,
          ...(input?.status ? { status: input.status } : {}),
        },
        orderBy: { createdAt: "desc" },
        take: input?.take ?? 20,
      });
    }),

  // ── Assets ────────────────────────────────────────────────────────────────────

  getMyAssets: guardedProcedure
    .input(z.object({}).optional())
    .query(async ({ ctx }) => {
      const employeeId = ctx.session?.employeeId;
      if (!employeeId) throw new TRPCError({ code: "UNAUTHORIZED" });

      return (prisma as any).assetAssignment.findMany({
        where:   { tenantId: ctx.tenantId, employeeId, returnedAt: null },
        include: { asset: true },
        orderBy: { assignedAt: "desc" },
      });
    }),

  // ── Training ──────────────────────────────────────────────────────────────────

  getMyTraining: guardedProcedure
    .input(z.object({}).optional())
    .query(async ({ ctx }) => {
      const employeeId = ctx.session?.employeeId;
      if (!employeeId) throw new TRPCError({ code: "UNAUTHORIZED" });

      // LMS enrolments — basic shape; lmsRouter provides full detail
      try {
        const enrolments = await (prisma as any).lmsEnrolment?.findMany?.({
          where:   { tenantId: ctx.tenantId, employeeId },
          include: { course: { select: { title: true, category: true } } },
          take:    10,
        }) ?? [];
        return enrolments;
      } catch {
        return [];
      }
    }),
});
