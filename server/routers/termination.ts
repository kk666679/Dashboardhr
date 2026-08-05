import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import {
  getTerminationsByTenant,
  createTermination,
} from "@/lib/termination-service";
import { TerminationFiltersSchema, TerminationCreateSchema } from "@/lib/schemas";

export const terminationRouter = router({
  getTerminations: protectedProcedure
    .input(TerminationFiltersSchema.optional())
    .query(({ ctx, input }) => getTerminationsByTenant(ctx.tenantId, input)),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { prisma } = await import("@/lib/prisma");
      return prisma.termination.findFirst({
        where: { id: input.id, tenantId: ctx.tenantId },
        include: { employee: true, approver: { include: { employee: true } } },
      });
    }),

  createTermination: protectedProcedure
    .input(TerminationCreateSchema)
    .mutation(({ ctx, input }) => createTermination(ctx.tenantId, input)),
});
