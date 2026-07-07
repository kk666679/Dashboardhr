import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import {
  getExpatriateById,
  getExpatriatesDashboard,
} from "@/components/features/employee/service";
import {
  ExpatriateSchema,
  ExpatriatesDashboardSchema,
} from "@/components/features/employee/schema";

export const expatriateRouter = router({
  list: protectedProcedure
    .output(ExpatriatesDashboardSchema)
    .query(({ ctx }) => getExpatriatesDashboard(ctx.tenantId)),

  byId: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .output(ExpatriateSchema)
    .query(async ({ ctx, input }) => {
      const expatriate = await getExpatriateById(input.id, ctx.tenantId);

      if (!expatriate) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Expatriate not found for the active tenant",
        });
      }

      return expatriate;
    }),
});
