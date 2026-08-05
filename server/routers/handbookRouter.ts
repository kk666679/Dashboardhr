import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { guardedProcedure, router } from "../trpc";
import { prisma } from "@/lib/prisma";

export const handbookRouter = router({
  getAll: guardedProcedure.query(async ({ ctx }) => {
    return (prisma as any).handbook.findMany({ where: { tenantId: ctx.tenantId }, orderBy: { title: "asc" } });
  }),
  getById: guardedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const r = await (prisma as any).handbook.findFirst({ where: { id: input.id, tenantId: ctx.tenantId } });
      if (!r) throw new TRPCError({ code: "NOT_FOUND" });
      return r;
    }),
  save: guardedProcedure
    .input(z.object({
      id:       z.string().optional(),
      title:    z.string().min(1),
      content:  z.string().min(1),
      version:  z.string().min(1),
      status:   z.enum(["Draft", "Published", "Archived"]),
      category: z.string().optional(),
      tags:     z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      if (id) {
        await (prisma as any).handbook.updateMany({ where: { id, tenantId: ctx.tenantId }, data });
        return (prisma as any).handbook.findFirst({ where: { id, tenantId: ctx.tenantId } });
      }
      return (prisma as any).handbook.create({ data: { tenantId: ctx.tenantId, ...data } });
    }),
  delete: guardedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await (prisma as any).handbook.deleteMany({ where: { id: input.id, tenantId: ctx.tenantId } });
      return { ok: true };
    }),
});
