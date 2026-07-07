import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { prisma } from "@/lib/prisma";

export const attendanceRouter = router({
  getDailySummary: protectedProcedure
    .input(z.object({ date: z.coerce.date() }))
    .query(async ({ ctx, input }) => {
      // NOTE: This is an initial model-backed shape. Adjust Prisma models/fields once
      // the actual schema exists in your database.
      const day = input.date;
      const start = new Date(day);
      start.setHours(0, 0, 0, 0);
      const end = new Date(day);
      end.setHours(23, 59, 59, 999);

      const total = await prisma.employee.count({ where: { tenantId: ctx.tenantId } });

      // Fallback counts until Attendance model is available.
      return {
        present: 0,
        absent: Math.max(0, total - 0),
        late: 0,
        onLeave: 0,
        overtime: 0,
      };
    }),
});

