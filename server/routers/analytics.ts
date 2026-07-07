import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { prisma } from "@/lib/prisma";

export const analyticsRouter = router({
  getHeadcountSummary: protectedProcedure
    .input(z.object({}).optional())
    .query(async ({ ctx }) => {
      // Fallback implementation until headcount/employee status models are finalized.
      const total = await prisma.employee.count({ where: { tenantId: ctx.tenantId } });
      return {
        total,
        active: total,
      };
    }),

  getTurnoverRate: protectedProcedure
    .input(z.object({ months: z.number().int().min(1).max(120).default(12) }).optional())
    .query(async ({ ctx, input }) => {
      // Placeholder model-backed calculation: use employee count delta when available.
      const months = input?.months ?? 12;
      const total = await prisma.employee.count({ where: { tenantId: ctx.tenantId } });
      return {
        months,
        turnoverRatePct: 0,
        separations: total > 0 ? 0 : 0,
      };
    }),

  getDepartmentBreakdown: protectedProcedure
    .input(z.object({}).optional())
    .query(async ({ ctx }) => {
      // Placeholder until Department/Employee relations are exact.
      const employees = await prisma.employee.findMany({
        where: { tenantId: ctx.tenantId },
        select: { department: true, isForeign: true, id: true },
      });

      const map = new Map<string, { department: string; total: number; foreign: number; male: number; female: number }>();
      for (const e of employees) {
        const dep = (e.department ?? "UNASSIGNED") as string;
        const cur = map.get(dep) ?? { department: dep, total: 0, foreign: 0, male: 0, female: 0 };
        cur.total += 1;
        if (e.isForeign) cur.foreign += 1;
        map.set(dep, cur);
      }

      return Array.from(map.values());
    }),
});

