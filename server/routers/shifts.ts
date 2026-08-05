/**
 * Shifts & Roster tRPC Router — Sprint 7
 *
 * Manages shift patterns and employee shift assignments.
 *
 * Requirements: 7.1–7.6
 */

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { guardedProcedure, router } from "../trpc";
import { prisma } from "@/lib/prisma";
import { writeAuditEntry } from "@/lib/shared-kernel/audit/audit-middleware";

export const shiftsRouter = router({

  // ── Shift Patterns ────────────────────────────────────────────────────────────

  listPatterns: guardedProcedure
    .input(z.object({ isActive: z.boolean().optional() }).optional())
    .query(async ({ ctx, input }) => {
      return (prisma as any).shiftPattern.findMany({
        where: {
          tenantId: ctx.tenantId,
          ...(input?.isActive !== undefined ? { isActive: input.isActive } : {}),
        },
        orderBy: { name: "asc" },
      });
    }),

  createPattern: guardedProcedure
    .input(z.object({
      name:         z.string().min(1),
      startTime:    z.string().regex(/^\d{2}:\d{2}$/),
      endTime:      z.string().regex(/^\d{2}:\d{2}$/),
      breakMinutes: z.number().int().min(0).default(60),
      workDays:     z.array(z.number().int().min(0).max(6)).min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      const pattern = await (prisma as any).shiftPattern.create({
        data: { ...input, tenantId: ctx.tenantId },
      });

      await writeAuditEntry({
        tenantId:   ctx.tenantId,
        module:     "attendance",
        entityType: "ShiftPattern",
        entityId:   pattern.id,
        action:     "CREATE",
        actorId:    ctx.userId,
        actorRole:  ctx.userRole,
        newValue:   { name: pattern.name, startTime: pattern.startTime, endTime: pattern.endTime },
      });

      return pattern;
    }),

  updatePattern: guardedProcedure
    .input(z.object({
      id:           z.string(),
      name:         z.string().optional(),
      startTime:    z.string().regex(/^\d{2}:\d{2}$/).optional(),
      endTime:      z.string().regex(/^\d{2}:\d{2}$/).optional(),
      breakMinutes: z.number().int().min(0).optional(),
      workDays:     z.array(z.number().int().min(0).max(6)).optional(),
      isActive:     z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return (prisma as any).shiftPattern.update({ where: { id }, data });
    }),

  // ── Shift Assignments ─────────────────────────────────────────────────────────

  assignShift: guardedProcedure
    .input(z.object({
      employeeId:    z.string().min(1),
      shiftId:       z.string().min(1),
      effectiveDate: z.coerce.date(),
      endDate:       z.coerce.date().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Verify shift belongs to tenant
      const shift = await (prisma as any).shiftPattern.findFirst({
        where: { id: input.shiftId, tenantId: ctx.tenantId },
      });
      if (!shift) throw new TRPCError({ code: "NOT_FOUND", message: "Shift pattern not found" });

      const assignment = await (prisma as any).shiftAssignment.create({
        data: { ...input, tenantId: ctx.tenantId },
      });

      await writeAuditEntry({
        tenantId:   ctx.tenantId,
        module:     "attendance",
        entityType: "ShiftAssignment",
        entityId:   assignment.id,
        action:     "CREATE",
        actorId:    ctx.userId,
        actorRole:  ctx.userRole,
        newValue:   { employeeId: input.employeeId, shiftId: input.shiftId, effectiveDate: input.effectiveDate },
      });

      return assignment;
    }),

  getEmployeeShift: guardedProcedure
    .input(z.object({
      employeeId: z.string().min(1),
      asOf:       z.coerce.date().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const asOf = input.asOf ?? new Date();
      return (prisma as any).shiftAssignment.findFirst({
        where: {
          tenantId:      ctx.tenantId,
          employeeId:    input.employeeId,
          effectiveDate: { lte: asOf },
          OR: [
            { endDate: null },
            { endDate: { gte: asOf } },
          ],
        },
        include: { shift: true },
        orderBy:  { effectiveDate: "desc" },
      });
    }),

  listAssignments: guardedProcedure
    .input(z.object({
      shiftId:    z.string().optional(),
      employeeId: z.string().optional(),
    }).optional())
    .query(async ({ ctx, input }) => {
      return (prisma as any).shiftAssignment.findMany({
        where: {
          tenantId: ctx.tenantId,
          ...(input?.shiftId    ? { shiftId:    input.shiftId    } : {}),
          ...(input?.employeeId ? { employeeId: input.employeeId } : {}),
        },
        include: { shift: { select: { name: true, startTime: true, endTime: true } } },
        orderBy: { effectiveDate: "desc" },
      });
    }),
});
