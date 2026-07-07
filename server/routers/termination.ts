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

  createTermination: protectedProcedure
    .input(TerminationCreateSchema)
    .mutation(({ ctx, input }) => createTermination(ctx.tenantId, input)),
});
