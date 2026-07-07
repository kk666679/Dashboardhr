import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../trpc";
import { prisma } from "@/lib/prisma";

const performanceSchema = z.object({
  employeeId: z.string().min(1),
  reviewPeriod: z.enum(["q1", "q2", "q3", "q4", "annual", "semi_annual"]),
  reviewDate: z.date(),
  overallPerformance: z.number().min(1).max(5),
  teamwork: z.number().min(1).max(5),
  productivity: z.number().min(1).max(5),
  qualityWork: z.number().min(1).max(5),
  initiative: z.number().min(1).max(5),
  strengths: z.string(),
  areasImprovement: z.string(),
  nextQuarterGoals: z.string(),
  approverId: z.string(),
});

export const performanceRouter = router({
  getCycles: publicProcedure
    .input(z.object({ status: z.string().optional() }).optional())
    .query(async () => {
      // Placeholder until PerformanceCycle model is available.
      return [] as {
        id: string;
        name: string;
        openDate: Date | string;
        submissionDeadline: Date | string;
        reviewForms?: { id: string }[];
      }[];
    }),

  getEmployees: publicProcedure.query(async ({ ctx }) => {

    return prisma.employee.findMany({
      select: {
        id: true,
        name: true,
      },
      where: {
        tenantId: ctx.tenantId,
      },
    });
  }),
  getApprovers: publicProcedure.query(async ({ ctx }) => {
    return prisma.user.findMany({
      where: {
        role: {
          in: ["HR", "ADMIN"],
        },
        tenantId: ctx.tenantId,
      },
      select: {
        id: true,
        email: true,
      },
    });
  }),
  createReview: protectedProcedure
    .input(performanceSchema)
    .mutation(async ({ ctx, input }) => {
      // Mock save - add PerformanceReview model later
      console.log("Saving performance review:", input);
      return {
        success: true,
        id: `perf-${Date.now()}`,
      };
    }),
  getReviews: protectedProcedure.query(async ({ ctx }) => {
    // Mock - add model later
    return [];
  }),
});
