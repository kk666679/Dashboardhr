import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { guardedProcedure, router } from "../trpc";
import { prisma } from "@/lib/prisma";

export const foreignWorkerRouter = router({
  getAll: guardedProcedure.query(async ({ ctx }) => {
    return (prisma as any).foreignWorkerProfile.findMany({
      where: { tenantId: ctx.tenantId },
      orderBy: { name: "asc" },
    });
  }),
  getById: guardedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const r = await (prisma as any).foreignWorkerProfile.findFirst({ where: { id: input.id, tenantId: ctx.tenantId } });
      if (!r) throw new TRPCError({ code: "NOT_FOUND" });
      return r;
    }),
  save: guardedProcedure
    .input(z.object({
      id:            z.string().optional(),
      name:          z.string().min(1),
      passportNumber: z.string().min(1),
      nationality:   z.string().min(1),
      permitType:    z.string().min(1),
      permitExpiry:  z.string().min(1),
      employer:      z.string().min(1),
      phone:         z.string().optional(),
      address:       z.string().optional(),
      status:        z.enum(["Active", "Pending", "Expired", "Renewal"]),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      if (id) {
        await (prisma as any).foreignWorkerProfile.updateMany({ where: { id, tenantId: ctx.tenantId }, data });
        return (prisma as any).foreignWorkerProfile.findFirst({ where: { id, tenantId: ctx.tenantId } });
      }
      return (prisma as any).foreignWorkerProfile.create({ data: { tenantId: ctx.tenantId, ...data } });
    }),
  delete: guardedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await (prisma as any).foreignWorkerProfile.deleteMany({ where: { id: input.id, tenantId: ctx.tenantId } });
      return { ok: true };
    }),
});
