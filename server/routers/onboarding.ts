import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { prisma } from "@/lib/prisma";

// These are minimal real-data implementations to satisfy the UI.
// Adjust Prisma models/fields once available.

export const onboardingRouter = router({
  getChecklistByEmployee: protectedProcedure
    .input(z.object({ employeeId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      // Placeholder persistence until onboarding tables exist.
      // Using employee existence as a guard.
      const employee = await prisma.employee.findFirst({
        where: { id: input.employeeId, tenantId: ctx.tenantId },
        select: { id: true },
      });
      if (!employee) return [];

      return [
        {
          id: `check-${input.employeeId}`,
          employeeId: input.employeeId,
          completionPct: 0,
          tasks: [],
        },
      ];
    }),

  completeTask: protectedProcedure
    .input(z.object({ taskId: z.string().min(1) }))
    .mutation(async () => {
      // TODO: persist task completion.
      return { success: true };
    }),
});

