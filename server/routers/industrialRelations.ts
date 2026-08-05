
/**
 * Industrial Relations (IR) tRPC Router
 * Handles IR cases, hearings, and union interactions.
 */
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { guardedProcedure, router } from "../trpc";
import { prisma } from "@/lib/prisma";

export const industrialRelationsRouter = router({
  listCases: guardedProcedure
    .input(z.object({ status: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      return (prisma as any).irCase.findMany({
        where: {
          tenantId: ctx.tenantId,
          ...(input?.status ? { status: input.status } : {}),
        },
        orderBy: { createdAt: "desc" },
      });
    }),

  getCase: guardedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const c = await (prisma as any).irCase.findFirst({
        where: { id: input.id, tenantId: ctx.tenantId },
      });
      if (!c) throw new TRPCError({ code: "NOT_FOUND" });
      return c;
    }),

  createCase: guardedProcedure
    .input(z.object({
      type:          z.string().min(1),
      subjectId:     z.string().optional(),
      description:   z.string().min(1),
      referenceNo:   z.string().optional(),
      filedDate:     z.string().optional(),
      respondent:    z.string().optional(),
      claimAmount:   z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return (prisma as any).irCase.create({
        data: {
          tenantId: ctx.tenantId,
          status:   "OPEN",
          ...input,
          filedDate: input.filedDate ? new Date(input.filedDate) : new Date(),
        },
      });
    }),

  updateCase: guardedProcedure
    .input(z.object({
      id:          z.string(),
      status:      z.string().optional(),
      outcome:     z.string().optional(),
      notes:       z.string().optional(),
      resolvedDate: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      await (prisma as any).irCase.updateMany({
        where: { id, tenantId: ctx.tenantId },
        data,
      });
      return { ok: true };
    }),

  getDashboard: guardedProcedure.query(async ({ ctx }) => {
    const [open, pending, resolved] = await Promise.all([
      (prisma as any).irCase.count({ where: { tenantId: ctx.tenantId, status: "OPEN" } }),
      (prisma as any).irCase.count({ where: { tenantId: ctx.tenantId, status: "PENDING" } }),
      (prisma as any).irCase.count({ where: { tenantId: ctx.tenantId, status: "RESOLVED" } }),
    ]);
    return { open, pending, resolved, total: open + pending + resolved };
  }),
});
