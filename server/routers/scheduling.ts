/**
 * Scheduling tRPC Router
 * Handles shift patterns, rotations, and swap requests.
 */
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { guardedProcedure, router } from "../trpc";
import { prisma } from "@/lib/prisma";

// ─── Raw SQL helpers for models not yet in Prisma schema ──────────────────────

async function queryAll(table: string, tenantId: string, orderBy = "created_at DESC") {
  try {
    return await prisma.$queryRawUnsafe(`SELECT * FROM "${table}" WHERE tenant_id = $1 ORDER BY ${orderBy}`, tenantId) as any[];
  } catch { return []; }
}

async function queryById(table: string, tenantId: string, id: string) {
  try {
    const rows = await prisma.$queryRawUnsafe(`SELECT * FROM "${table}" WHERE tenant_id = $1 AND id = $2::text LIMIT 1`, tenantId, id) as any[];
    return rows[0] ?? null;
  } catch { return null; }
}

// ─── Shift Patterns ───────────────────────────────────────────────────────────

const SHIFT_PATTERN_TABLE = "shift_patterns";
const SHIFT_SLOT_TABLE = "shift_time_slots";

export const shiftPatternRouter = router({
  getAll: guardedProcedure.query(async ({ ctx }) => {
    return queryAll(SHIFT_PATTERN_TABLE, ctx.tenantId);
  }),

  getById: guardedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const pattern = await queryById(SHIFT_PATTERN_TABLE, ctx.tenantId, input.id);
      if (!pattern) throw new TRPCError({ code: "NOT_FOUND" });
      try {
        const slots = await prisma.$queryRawUnsafe(`SELECT * FROM "${SHIFT_SLOT_TABLE}" WHERE pattern_id = $1::text ORDER BY day_of_week, start_time`, input.id) as any[];
        return { ...pattern, timeSlots: slots };
      } catch {
        return { ...pattern, timeSlots: [] };
      }
    }),

  create: guardedProcedure
    .input(z.object({
      name:        z.string().min(1),
      description: z.string().optional(),
      cycleLength: z.number().int().min(1).default(7),
      timeSlots: z.array(z.object({
        dayOfWeek:  z.number().int().min(0).max(6),
        startTime:  z.string(),
        endTime:    z.string(),
        breakMins:  z.number().int().default(0),
      })).default([]),
    }))
    .mutation(async ({ ctx, input }) => {
      const { timeSlots, ...rest } = input;
      const id = crypto.randomUUID();
      try {
        await prisma.$queryRawUnsafe(
          `INSERT INTO "${SHIFT_PATTERN_TABLE}" (id, tenant_id, name, description, cycle_length) VALUES ($1, $2, $3, $4, $5)`,
          id, ctx.tenantId, rest.name, rest.description ?? null, rest.cycleLength
        );
        for (const slot of timeSlots) {
          const slotId = crypto.randomUUID();
          await prisma.$queryRawUnsafe(
            `INSERT INTO "${SHIFT_SLOT_TABLE}" (id, pattern_id, day_of_week, start_time, end_time, break_mins) VALUES ($1, $2, $3, $4, $5, $6)`,
            slotId, id, slot.dayOfWeek, slot.startTime, slot.endTime, slot.breakMins
          );
        }
      } catch { /* table may not exist */ }
      return { id, ...rest, timeSlots };
    }),

  update: guardedProcedure
    .input(z.object({
      id:          z.string(),
      name:        z.string().min(1).optional(),
      description: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      if (data.name) {
        try {
          await prisma.$queryRawUnsafe(`UPDATE "${SHIFT_PATTERN_TABLE}" SET name = $1, description = $2 WHERE id = $3::text AND tenant_id = $4`, data.name, data.description ?? null, id, ctx.tenantId);
        } catch { /* ignore */ }
      }
      return { ok: true };
    }),

  delete: guardedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        await prisma.$queryRawUnsafe(`DELETE FROM "${SHIFT_PATTERN_TABLE}" WHERE id = $1::text AND tenant_id = $2`, input.id, ctx.tenantId);
      } catch { /* ignore */ }
      return { ok: true };
    }),
});

// ─── Rotations ────────────────────────────────────────────────────────────────

const ROTATION_TABLE = "rotation_assignments";

export const rotationRouter = router({
  getByGroup: guardedProcedure
    .input(z.object({ groupId: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      try {
        if (input.groupId) {
          return await prisma.$queryRawUnsafe(`SELECT * FROM "${ROTATION_TABLE}" WHERE tenant_id = $1 AND group_id = $2::text ORDER BY date ASC`, ctx.tenantId, input.groupId) as any[];
        }
        return await prisma.$queryRawUnsafe(`SELECT * FROM "${ROTATION_TABLE}" WHERE tenant_id = $1 ORDER BY date ASC`, ctx.tenantId) as any[];
      } catch { return []; }
    }),

  generate: guardedProcedure
    .input(z.object({
      groupId:     z.string().optional(),
      patternId:   z.string(),
      employeeIds: z.array(z.string()).min(1),
      startDate:   z.string().optional(),
      weeks:       z.number().int().min(1).max(52).default(4),
    }))
    .mutation(async ({ ctx, input }) => {
      let pattern: any = null;
      try {
        const rows = await prisma.$queryRawUnsafe(`SELECT * FROM "${SHIFT_PATTERN_TABLE}" WHERE id = $1::text AND tenant_id = $2 LIMIT 1`, input.patternId, ctx.tenantId) as any[];
        pattern = rows[0] ?? null;
      } catch { /* ignore */ }

      if (!pattern) throw new TRPCError({ code: "NOT_FOUND", message: "Shift pattern not found" });

      let slots: any[] = [];
      try {
        slots = await prisma.$queryRawUnsafe(`SELECT * FROM "${SHIFT_SLOT_TABLE}" WHERE pattern_id = $1::text`, input.patternId) as any[];
      } catch { /* ignore */ }

      const start = input.startDate ? new Date(input.startDate) : new Date();
      let count = 0;

      for (let w = 0; w < input.weeks; w++) {
        for (const slot of slots) {
          for (const empId of input.employeeIds) {
            const date = new Date(start);
date.setDate(date.getDate() + w * 7 + (slot.day_of_week ?? 0));
            try {
              await prisma.$queryRawUnsafe(
                `INSERT INTO "${ROTATION_TABLE}" (id, tenant_id, employee_id, pattern_id, group_id, date, shift_start, shift_end) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                crypto.randomUUID(), ctx.tenantId, empId, input.patternId, input.groupId ?? null, date.toISOString().split('T')[0],
                slot.start_time ?? slot.startTime, slot.end_time ?? slot.endTime
              );
              count++;
            } catch { /* ignore */ }
          }
        }
      }

      return { generated: count };
    }),
});

// ─── Swap Requests ────────────────────────────────────────────────────────────

const SWAP_TABLE = "swap_requests";

export const swapRouter = router({
  getAll: guardedProcedure
    .input(z.object({ status: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      try {
        if (input?.status) {
          return await prisma.$queryRawUnsafe(`SELECT * FROM "${SWAP_TABLE}" WHERE tenant_id = $1 AND status = $2 ORDER BY created_at DESC`, ctx.tenantId, input.status) as any[];
        }
        return await prisma.$queryRawUnsafe(`SELECT * FROM "${SWAP_TABLE}" WHERE tenant_id = $1 ORDER BY created_at DESC`, ctx.tenantId) as any[];
      } catch { return []; }
    }),

  request: guardedProcedure
    .input(z.object({
      targetEmployeeId: z.string(),
      assignmentId:     z.string(),
      targetAssignmentId: z.string().optional(),
      reason:           z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const id = crypto.randomUUID();
      try {
        await prisma.$queryRawUnsafe(
          `INSERT INTO "${SWAP_TABLE}" (id, tenant_id, requester_id, target_employee_id, assignment_id, target_assignment_id, reason, status) VALUES ($1, $2, $3, $4, $5, $6, $7, 'PENDING')`,
          id, ctx.tenantId, ctx.userId, input.targetEmployeeId, input.assignmentId, input.targetAssignmentId ?? null, input.reason ?? null
        );
      } catch { /* table may not exist */ }
      return { id, ...input, status: "PENDING" };
    }),

  approve: guardedProcedure
    .input(z.object({ id: z.string(), comment: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      try {
        await prisma.$queryRawUnsafe(`UPDATE "${SWAP_TABLE}" SET status = 'APPROVED', approved_by_id = $1, approved_at = NOW(), comment = $2 WHERE id = $3::text AND tenant_id = $4`, ctx.userId, input.comment ?? null, input.id, ctx.tenantId);
      } catch { /* ignore */ }
      return { success: true };
    }),

  reject: guardedProcedure
    .input(z.object({ id: z.string(), reason: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      try {
        await prisma.$queryRawUnsafe(`UPDATE "${SWAP_TABLE}" SET status = 'REJECTED', rejected_by_id = $1, rejected_at = NOW(), reason = $2 WHERE id = $3::text AND tenant_id = $4`, ctx.userId, input.reason ?? null, input.id, ctx.tenantId);
      } catch { /* ignore */ }
      return { success: true };
    }),
});
