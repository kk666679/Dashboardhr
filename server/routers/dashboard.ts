import { protectedProcedure, router } from "../trpc";
import { DashboardDataSchema } from "@/lib/schema";
import { getDashboardData } from "@/types/service";

export const dashboardRouter = router({
  getData: protectedProcedure
    .output(DashboardDataSchema)
    .query(({ ctx }) => getDashboardData(ctx.tenantId)),
});
