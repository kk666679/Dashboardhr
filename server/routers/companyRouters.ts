import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { guardedProcedure, router } from "../trpc";
import { prisma } from "@/lib/prisma";

export const companyRouter = router({
  getAll: guardedProcedure.query(async ({ ctx }) => {
    return (prisma as any).company.findMany({ where: { tenantId: ctx.tenantId }, orderBy: { name: "asc" } });
  }),
  getById: guardedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const r = await (prisma as any).company.findFirst({ where: { id: input.id, tenantId: ctx.tenantId } });
      if (!r) throw new TRPCError({ code: "NOT_FOUND" });
      return r;
    }),
  save: guardedProcedure
    .input(z.object({
      id:                 z.string().optional(),
      name:               z.string().min(1),
      registrationNumber: z.string().min(1),
      industry:           z.string().min(1),
      size:               z.string().min(1),
      founded:            z.string().min(1),
      status:             z.enum(["Active", "Inactive", "Pending"]),
      address:            z.string().optional(),
      phone:              z.string().optional(),
      email:              z.string().email().optional(),
      website:            z.string().optional(),
      parentCompany:      z.string().optional(),
      description:        z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      if (id) {
        await (prisma as any).company.updateMany({ where: { id, tenantId: ctx.tenantId }, data });
        return (prisma as any).company.findFirst({ where: { id, tenantId: ctx.tenantId } });
      }
      return (prisma as any).company.create({ data: { tenantId: ctx.tenantId, ...data, founded: new Date(data.founded) } });
    }),
  delete: guardedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await (prisma as any).company.deleteMany({ where: { id: input.id, tenantId: ctx.tenantId } });
      return { ok: true };
    }),
});
