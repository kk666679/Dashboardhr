/**
 * FOMEMA tRPC Router
 * Handles FOMEMA medical examination records for foreign workers.
 */
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { guardedProcedure, router } from "../trpc";
import { prisma } from "@/lib/prisma";

export const fomemaRouter = router({
  getAll: guardedProcedure
    .input(z.object({
      employeeId: z.string().optional(),
      status:     z.string().optional(),
      limit:      z.number().int().max(200).default(50),
    }).optional())
    .query(async ({ ctx, input }) => {
      return (prisma as any).fomemaRecord.findMany({
        where: {
          tenantId: ctx.tenantId,
          ...(input?.employeeId ? { employeeId: input.employeeId } : {}),
          ...(input?.status     ? { status:     input.status }     : {}),
        },
        include: { employee: { select: { id: true, name: true } } },
        orderBy: { examinationDate: "desc" },
        take:    input?.limit ?? 50,
      });
    }),

  getById: guardedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const r = await (prisma as any).fomemaRecord.findFirst({
        where:   { id: input.id, tenantId: ctx.tenantId },
        include: { employee: true },
      });
      if (!r) throw new TRPCError({ code: "NOT_FOUND" });
      return r;
    }),

  getFomemaRecords: guardedProcedure
    .input(z.object({ employeeId: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      return (prisma as any).fomemaRecord.findMany({
        where: {
          tenantId: ctx.tenantId,
          ...(input?.employeeId ? { employeeId: input.employeeId } : {}),
        },
        include: { employee: { select: { id: true, name: true } } },
        orderBy: { examinationDate: "desc" },
      });
    }),

  schedule: guardedProcedure
    .input(z.object({
      employeeId:      z.string(),
      examinationDate: z.string(),
      clinic:          z.string().optional(),
      notes:           z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return (prisma as any).fomemaRecord.create({
        data: {
          tenantId:        ctx.tenantId,
          employeeId:      input.employeeId,
          examinationDate: new Date(input.examinationDate),
          clinic:          input.clinic,
          notes:           input.notes,
          status:          "SCHEDULED",
        },
      });
    }),

  updateResult: guardedProcedure
    .input(z.object({
      id:     z.string(),
      result: z.enum(["FIT", "UNFIT", "UNFIT_FOLLOWUP", "PENDING"]),
      notes:  z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      await (prisma as any).fomemaRecord.updateMany({
        where: { id: input.id, tenantId: ctx.tenantId },
        data:  { result: input.result, notes: input.notes, status: "COMPLETED", resultDate: new Date() },
      });
      return { ok: true };
    }),
});
