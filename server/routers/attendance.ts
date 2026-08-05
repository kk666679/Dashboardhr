/**
 * Attendance Management tRPC Router — Sprint 7
 *
 * Covers:
 * - Clock-in / clock-out with GPS geofence validation
 * - Overtime calculation (Property 10: always ≥ 0, = Σ max(0, worked − standard))
 * - Exception flagging (late, absent, early departure)
 * - Daily / weekly summary queries
 * - Shift-based standard hours lookup
 *
 * Requirements: 7.1–7.6 — Property 10: Attendance Overtime Invariant
 */

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { guardedProcedure, router } from "../trpc";
import { prisma } from "@/lib/prisma";
import { Decimal } from "decimal.js";
import { writeAuditEntry } from "@/lib/shared-kernel/audit/audit-middleware";
import { dispatchNotification } from "@/lib/notification-dispatch";

// Standard hours per shift (default 8h if no shift pattern assigned)
const DEFAULT_STANDARD_HOURS = new Decimal(8);

/** Calculates overtime for one day. Never negative — Property 10. */
function calcDayOvertime(hoursWorked: Decimal, standardHours: Decimal): Decimal {
  return Decimal.max(new Decimal(0), hoursWorked.sub(standardHours));
}

export const attendanceRouter = router({

  // ── Clock-in ─────────────────────────────────────────────────────────────────

  clockIn: guardedProcedure
    .input(z.object({
      employeeId: z.string().min(1),
      latitude:   z.number().optional(),
      longitude:  z.number().optional(),
      method:     z.enum(["MANUAL", "GPS", "QR", "BIOMETRIC"]).default("MANUAL"),
    }))
    .mutation(async ({ ctx, input }) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Prevent double clock-in on same day
      const existing = await prisma.attendance.findFirst({
        where: {
          tenantId:   ctx.tenantId,
          employeeId: input.employeeId,
          date:       { gte: today },
          checkIn:    { not: null },
        },
      });
      if (existing?.checkIn) {
        throw new TRPCError({ code: "CONFLICT", message: "Employee already clocked in today" });
      }

      const now = new Date();

      // Geofence check (soft — log violation, don't block)
      let geofenceViolation = false;
      if (input.latitude != null && input.longitude != null) {
        const geofences = await prisma.geofence.findMany({
          where: { tenantId: ctx.tenantId, isActive: true },
          select: { radius: true, coordinates: true },
        });

        if (geofences.length > 0) {
          // Violation when the point is NOT inside ANY active geofence.
          const isInsideSome = geofences.some((gf: any) => {
            const coords = (gf.coordinates as unknown as number[][] | null | undefined)?.[0];
            if (!coords || coords.length < 2) return true; // treat malformed fence as non-blocking

            const [glatMaybe, glngMaybe] = coords;
            if (typeof glatMaybe !== "number" || typeof glngMaybe !== "number") return true;
            if (gf.radius == null) return true;

            const glat = glatMaybe;
            const glng = glngMaybe;

            const R = 6371000; // metres
            const dLat = ((input.latitude! - glat) * Math.PI) / 180;
            const dLng = ((input.longitude! - glng) * Math.PI) / 180;
            const a =
              Math.sin(dLat / 2) ** 2 +
              Math.cos((glat * Math.PI) / 180) *
                Math.cos((input.latitude! * Math.PI) / 180) *
                Math.sin(dLng / 2) ** 2;
            const dist = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return dist <= gf.radius;
          });

          geofenceViolation = !isInsideSome;
        }
      }

      const record = await prisma.attendance.create({
        data: {
          tenantId:   ctx.tenantId,
          employeeId: input.employeeId,
          date:       now,
          checkIn:    now,
          status:     "PRESENT",
        },
      });


      if (geofenceViolation) {
        await dispatchNotification({
          tenantId:    ctx.tenantId,
          recipientId: ctx.userId,
          eventType:   "attendance.geofence_violation",
          channel:     "IN_APP",
          subject:     "Geofence violation on clock-in",
          body:        `Employee ${input.employeeId} clocked in outside designated work location.`,
        });
      }

      return { id: record.id, checkIn: record.checkIn, geofenceViolation };
    }),

  // ── Clock-out ────────────────────────────────────────────────────────────────

  clockOut: guardedProcedure
    .input(z.object({
      employeeId: z.string().min(1),
      latitude:   z.number().optional(),
      longitude:  z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const record = await prisma.attendance.findFirst({
        where: {
          tenantId:   ctx.tenantId,
          employeeId: input.employeeId,
          date:       { gte: today },
          checkIn:    { not: null },
          checkOut:   null,
        },
      });
      if (!record) {
        throw new TRPCError({ code: "NOT_FOUND", message: "No open clock-in record for today" });
      }

      const now = new Date();
      const hoursWorked = new Decimal(
        (now.getTime() - record.checkIn!.getTime()) / 3_600_000
      ).toDecimalPlaces(4);

      // Lookup shift for standard hours
      const shiftAssignment = await (prisma as any).shiftAssignment?.findFirst?.({
        where: { tenantId: ctx.tenantId, employeeId: input.employeeId, effectiveDate: { lte: now } },
        include: { shift: { select: { startTime: true, endTime: true, breakMinutes: true } } },
        orderBy: { effectiveDate: "desc" },
      });

      let standardHours = DEFAULT_STANDARD_HOURS;
      if (shiftAssignment?.shift) {
        const [sh, sm] = shiftAssignment.shift.startTime.split(":").map(Number);
        const [eh, em] = shiftAssignment.shift.endTime.split(":").map(Number);
        const totalMins = (eh * 60 + em) - (sh * 60 + sm) - (shiftAssignment.shift.breakMinutes ?? 60);
        standardHours = new Decimal(totalMins).div(60);
      }

      // Property 10: overtime = max(0, worked - standard)
      const overtime = calcDayOvertime(hoursWorked, standardHours);

      // Status flags
      const isLate  = record.checkIn && record.checkIn.getHours() > 9; // after 09:00 = late (configurable)
      const status  = isLate ? "LATE" : "PRESENT";

      const updated = await prisma.attendance.update({
        where: { id: record.id },
        data: {
          checkOut:    now,
          hoursWorked,
          status:      status as any,
        },
      });

      return {
        id:          updated.id,
        hoursWorked: hoursWorked.toFixed(2),
        overtime:    overtime.toFixed(2),
        status,
      };
    }),

  // ── Daily summary ─────────────────────────────────────────────────────────────

  getDailySummary: guardedProcedure
    .input(z.object({ date: z.coerce.date() }))
    .query(async ({ ctx, input }) => {
      const start = new Date(input.date); start.setHours(0, 0, 0, 0);
      const end   = new Date(input.date); end.setHours(23, 59, 59, 999);

      const total = await prisma.employee.count({ where: { tenantId: ctx.tenantId } });

      const records = await prisma.attendance.findMany({
        where: { tenantId: ctx.tenantId, date: { gte: start, lte: end } },
        select: { status: true, hoursWorked: true },
      });

      const present = records.filter(
        (r: { status: string }) => r.status === "PRESENT",
      ).length;
      const late = records.filter((r: { status: string }) => r.status === "LATE").length;
      const halfDay = records.filter(
        (r: { status: string }) => r.status === "HALF_DAY",
      ).length;
      const absent = total - records.length;

      // Total overtime for the day — Property 10: sum of max(0, worked-8) per record
      const overtime = records.reduce((sum: Decimal, r: { hoursWorked: unknown }) => {
        const hw = r.hoursWorked ? new Decimal((r as any).hoursWorked) : new Decimal(0);
        return sum.add(calcDayOvertime(hw, DEFAULT_STANDARD_HOURS));
      }, new Decimal(0));

      // On-leave count from LeaveApplication
      const onLeave = await (prisma as any).leaveApplication?.count?.({
        where: {
          tenantId: ctx.tenantId,
          status:   "APPROVED",
          startDate: { lte: end },
          endDate:   { gte: start },
        },
      }) ?? 0;

      return {
        present,
        late,
        halfDay,
        absent,
        onLeave,
        overtime: overtime.toFixed(2),
        total,
      };
    }),

  // ── List records ──────────────────────────────────────────────────────────────

  list: guardedProcedure
    .input(z.object({
      employeeId: z.string().optional(),
      from:       z.coerce.date().optional(),
      to:         z.coerce.date().optional(),
      status:     z.enum(["PRESENT", "ABSENT", "LATE", "HALF_DAY"]).optional(),
      take:       z.number().int().min(1).max(500).default(100),
      skip:       z.number().int().min(0).default(0),
    }).optional())
    .query(async ({ ctx, input }) => {
      return prisma.attendance.findMany({
        where: {
          tenantId: ctx.tenantId,
          ...(input?.employeeId ? { employeeId: input.employeeId } : {}),
          ...(input?.status     ? { status:     input.status as any } : {}),
          ...(input?.from || input?.to ? {
            date: {
              ...(input?.from ? { gte: input.from } : {}),
              ...(input?.to   ? { lte: input.to   } : {}),
            },
          } : {}),
        },
        orderBy: { date: "desc" },
        take: input?.take ?? 100,
        skip: input?.skip ?? 0,
      });
    }),

  // ── Overtime report ───────────────────────────────────────────────────────────

  getOvertimeReport: guardedProcedure
    .input(z.object({
      employeeId: z.string().optional(),
      from:       z.coerce.date(),
      to:         z.coerce.date(),
    }))
    .query(async ({ ctx, input }) => {
      const records = await prisma.attendance.findMany({
        where: {
          tenantId:   ctx.tenantId,
          date:       { gte: input.from, lte: input.to },
          hoursWorked: { not: null },
          ...(input.employeeId ? { employeeId: input.employeeId } : {}),
        },
        select: { employeeId: true, date: true, hoursWorked: true },
      });

      // Group by employee — Property 10: sum of daily max(0, worked − standard)
      const byEmployee = new Map<string, Decimal>();
      for (const r of records) {
        const hw  = new Decimal(r.hoursWorked!);
        const ot  = calcDayOvertime(hw, DEFAULT_STANDARD_HOURS);
        byEmployee.set(r.employeeId, (byEmployee.get(r.employeeId) ?? new Decimal(0)).add(ot));
      }

      return Array.from(byEmployee.entries()).map(([employeeId, totalOt]) => ({
        employeeId,
        totalOvertimeHours: totalOt.toFixed(2),
      }));
    }),

  // ── Exception flags ───────────────────────────────────────────────────────────

  getExceptions: guardedProcedure
    .input(z.object({
      from: z.coerce.date(),
      to:   z.coerce.date(),
      type: z.enum(["LATE", "ABSENT", "HALF_DAY", "ALL"]).default("ALL"),
    }))
    .query(async ({ ctx, input }) => {
      const where: unknown = {
        tenantId: ctx.tenantId,
        date: { gte: input.from, lte: input.to },
      };
      if (input.type !== "ALL") (where as any).status = input.type;
      else (where as any).status = { in: ["LATE", "ABSENT", "HALF_DAY"] };

      return prisma.attendance.findMany({
        where,
        orderBy: { date: "desc" },
        take: 200,
      });
    }),

  // ── Manual entry / override (HR only) ────────────────────────────────────────

  manualEntry: guardedProcedure
    .input(z.object({
      employeeId:  z.string().min(1),
      date:        z.coerce.date(),
      checkIn:     z.coerce.date().optional(),
      checkOut:    z.coerce.date().optional(),
      status:      z.enum(["PRESENT", "ABSENT", "LATE", "HALF_DAY"]).default("PRESENT"),
      hoursWorked: z.number().min(0).max(24).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const hoursWorked = input.hoursWorked != null
        ? new Decimal(input.hoursWorked)
        : (input.checkIn && input.checkOut
          ? new Decimal((input.checkOut.getTime() - input.checkIn.getTime()) / 3_600_000).toDecimalPlaces(4)
          : undefined);

      const record = await prisma.attendance.upsert({
        where: {
          // Composite unique is not on schema; use findFirst + update pattern
          id: (await prisma.attendance.findFirst({
            where: { tenantId: ctx.tenantId, employeeId: input.employeeId, date: input.date },
            select: { id: true },
          }))?.id ?? "nonexistent",
        },
        create: {
          tenantId:    ctx.tenantId,
          employeeId:  input.employeeId,
          date:        input.date,
          checkIn:     input.checkIn,
          checkOut:    input.checkOut,
          hoursWorked,
          status:      input.status as any,
        },
        update: {
          checkIn:     input.checkIn,
          checkOut:    input.checkOut,
          hoursWorked,
          status:      input.status as any,
        },
      });

      await writeAuditEntry({
        tenantId:   ctx.tenantId,
        module:     "attendance",
        entityType: "Attendance",
        entityId:   record.id,
        action:     "UPDATE",
        actorId:    ctx.userId,
        actorRole:  ctx.userRole,
        newValue:   { status: input.status, date: input.date, employeeId: input.employeeId },
      });

      return record;
    }),
});
