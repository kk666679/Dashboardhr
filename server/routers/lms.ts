import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";
import { prisma } from "@/lib/prisma";

export const lmsRouter = router({
  listCourses: publicProcedure
    .input(z.object({}).optional())
    .query(async ({ ctx }) => {
      // No course tables yet; return empty list.
      return [] as { id: string; title: string; deliveryMode: string; durationHours?: number }[];
    }),

  getProgress: protectedProcedure
    .input(z.object({ employeeId: z.string().min(1) }))
    .query(async () => {
      return [] as {
        id: string;
        courseId: string;
        course?: { title: string; deliveryMode: string };
        status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
      }[];
    }),

  enrolEmployee: protectedProcedure
    .input(z.object({ courseId: z.string().min(1), employeeId: z.string().min(1) }))
    .mutation(async () => ({ success: true })),

  // Required by MSS team page
  getSkillMatrix: protectedProcedure
    .input(z.object({ departmentId: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      // Placeholder until skill matrix schema exists.
      const department = input?.departmentId;
      // Use employee existence as a tenant guard.
      await prisma.employee.count({ where: { tenantId: ctx.tenantId } });

      return {
        skills: [] as {
          skill: string;
          coveragePct: number;
        }[],
        department,
      };
    }),
});

