import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { prisma } from "@/lib/prisma";

export const aiRouter = router({
  getWorkforceForecast: protectedProcedure

    .input(z.object({ annualGrowthTarget: z.number().optional().default(0.05) }).optional())
    .query(async ({ ctx, input }) => {
      const months = Array.from({ length: 12 }).map((_, i) => {
        const month = new Date();
        month.setMonth(month.getMonth() + i);
        return {
          month: month.toLocaleString("en-US", { month: "short" }),
          projected: i,
          hiringRequired: i,
        };
      });

      const totalEmployees = await prisma.employee.count({ where: { tenantId: ctx.tenantId } });
      return {
        netChange: 0,
        months,
        insights: [`Based on tenant headcount (${totalEmployees}) and growth target. (placeholder)`],
      };
    }),
});

