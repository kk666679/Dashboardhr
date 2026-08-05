/**
 * Manager Self-Service (MSS) tRPC Router — Sprint 18
 *
 * Team dashboard, pending approvals queue, delegation, and team skill matrix.
 *
 * Requirements: 15.1–15.8
 */

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { guardedProcedure, router } from "../trpc";
import { prisma } from "@/lib/prisma";

export const mssRouter = router({

  // ── Team Dashboard ────────────────────────────────────────────────────────────

  getTeamDashboard: guardedProcedure
    .input(z.object({}).optional())
    .query(async ({ ctx }) => {
      const managerId = ctx.session?.employeeId;
      // Find all employees in manager's departments
      const departments = ctx.session?.departments ?? [];

      const teamMembers = await prisma.employee.findMany({
        where: {
          tenantId:   ctx.tenantId,
          department: departments.length > 0 ? { in: departments } : undefined,
        },
        include: { profile: { select: { employmentStatus: true } } },
      });

      const year = new Date().getFullYear();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const [pendingLeaves, todayAttendance] = await Promise.all([
        (prisma as any).leaveApplication.count({
          where: {
            tenantId:   ctx.tenantId,
            status:     "PENDING",
            employeeId: { in: teamMembers.map((e: any) => e.id) },
          },
        }),
        prisma.attendance.count({
          where: {
            tenantId:   ctx.tenantId,
            date:       { gte: today, lt: tomorrow },
            employeeId: { in: teamMembers.map((e: any) => e.id) },
            status:     "PRESENT",
          },
        }),
      ]);

      return {
        teamSize:      teamMembers.length,
        activeCount:   teamMembers.filter((e: any) => e.profile?.employmentStatus === "ACTIVE").length,
        pendingLeaves,
        presentToday:  todayAttendance,
      };
    }),

  // ── Approvals Queue ───────────────────────────────────────────────────────────

  getPendingApprovals: guardedProcedure
    .input(z.object({
      type: z.enum(["leave", "claims", "travel", "all"]).default("all"),
    }).optional())
    .query(async ({ ctx, input }) => {
      const type = input?.type ?? "all";
      const departments = ctx.session?.departments ?? [];

      const teamEmployeeIds = (await prisma.employee.findMany({
        where: {
          tenantId:   ctx.tenantId,
          department: departments.length > 0 ? { in: departments } : undefined,
        },
        select: { id: true },
      })).map((e: any) => e.id);

      const where = { tenantId: ctx.tenantId, status: "PENDING", employeeId: { in: teamEmployeeIds } };

      const [leaveApps, claims, travel] = await Promise.all([
        (type === "leave" || type === "all")
          ? (prisma as any).leaveApplication.findMany({ where, orderBy: { createdAt: "asc" }, take: 20 })
          : [],
        (type === "claims" || type === "all")
          ? (prisma as any).claim.findMany({ where, orderBy: { createdAt: "asc" }, take: 20 })
          : [],
        (type === "travel" || type === "all")
          ? (prisma as any).travelRequest.findMany({ where, orderBy: { createdAt: "asc" }, take: 20 })
          : [],
      ]);

      return {
        leave:  leaveApps,
        claims,
        travel,
        total:  leaveApps.length + claims.length + travel.length,
      };
    }),

  // ── Team Members ─────────────────────────────────────────────────────────────

  getTeamMembers: guardedProcedure
    .input(z.object({}).optional())
    .query(async ({ ctx }) => {
      const departments = ctx.session?.departments ?? [];

      return prisma.employee.findMany({
        where: {
          tenantId:   ctx.tenantId,
          department: departments.length > 0 ? { in: departments } : undefined,
        },
        include: { profile: true },
        orderBy: { name: "asc" },
      });
    }),

  // ── Team Attendance Summary ───────────────────────────────────────────────────

  getTeamAttendance: guardedProcedure
    .input(z.object({ date: z.coerce.date().optional() }))
    .query(async ({ ctx, input }) => {
      const date = input.date ?? new Date();
      const start = new Date(date); start.setHours(0, 0, 0, 0);
      const end   = new Date(date); end.setHours(23, 59, 59, 999);

      const departments = ctx.session?.departments ?? [];
      const teamEmployeeIds = (await prisma.employee.findMany({
        where: {
          tenantId:   ctx.tenantId,
          department: departments.length > 0 ? { in: departments } : undefined,
        },
        select: { id: true },
      })).map((e: any) => e.id);

      return prisma.attendance.findMany({
        where: {
          tenantId:   ctx.tenantId,
          employeeId: { in: teamEmployeeIds },
          date:       { gte: start, lte: end },
        },
        include: { employee: { select: { name: true } } },
      });
    }),

  // ── Team Performance ─────────────────────────────────────────────────────────

  getTeamPerformanceSummary: guardedProcedure
    .input(z.object({ cycleId: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      // Returns basic performance stats; full details in performanceRouter
      const departments = ctx.session?.departments ?? [];
      const teamSize = await prisma.employee.count({
        where: {
          tenantId:   ctx.tenantId,
          department: departments.length > 0 ? { in: departments } : undefined,
        },
      });

      return {
        teamSize,
        reviewedCount:    0, // populated once performance reviews linked
        pendingReviews:   0,
        averageRating:    null as number | null,
      };
    }),

  // ── Delegation ───────────────────────────────────────────────────────────────

  getDelegations: guardedProcedure
    .input(z.object({}).optional())
    .query(async ({ ctx }) => {
      const approverId = ctx.session?.employeeId;
      if (!approverId) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Employee session required" });
      }

      const delegations = await prisma.mSSDelegation.findMany({
        where: {
          tenantId: ctx.tenantId,
          approverId,
          deletedAt: null,
        },
        include: {
          delegate: { select: { id: true, name: true, email: true } },
          approver: { select: { id: true, name: true, email: true } },
        },
        orderBy: { fromDate: "desc" },
      });

      return delegations.map((delegation: {
        id: string;
        delegateId: string;
        delegate: { name: string };
        module: string;
        fromDate: Date;
        toDate: Date;
        status: string;
        reason: string | null;
      }) => ({
        id: delegation.id,
        delegateTo: delegation.delegateId,
        delegateName: delegation.delegate.name,
        module: delegation.module,
        from: delegation.fromDate.toISOString(),
        to: delegation.toDate.toISOString(),
        status: delegation.status,
        reason: delegation.reason,
      }));
    }),
});
