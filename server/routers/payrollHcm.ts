import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { prisma } from "@/lib/prisma";

// Namespaces used by dashboard pages:
// - payrollHcm.listRuns
// - payrollHcm.getRunById
// - payrollHcm.getVarianceReport
// - payrollHcm.finalizeRun

export const payrollHcmRouter = router({
  listRuns: protectedProcedure
    .input(
      z
        .object({
          legalEntityId: z.string().optional(),
          status: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      await prisma.employee.count({ where: { tenantId: ctx.tenantId } });
      const effectiveStatus = input?.status ?? "FINALIZED";
      return [
        {
          id: "run-1",
          legalEntityId: "le-1",
          periodStart: new Date().toISOString(),
          periodEnd: new Date().toISOString(),
          status: effectiveStatus,
          checksum: "checksum",
          createdAt: new Date().toISOString(),
        },
      ];
    }),


  initiateRun: protectedProcedure
    .input(
      z.object({
        legalEntityId: z.string().min(1),
        periodStart: z.coerce.date(),
        periodEnd: z.coerce.date(),
      })
    )
    .mutation(async () => ({
      id: `run-${Date.now()}`,
    })),

  getRunById: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(async ({ ctx }) => {
      await prisma.employee.count({ where: { tenantId: ctx.tenantId } });
      return {
        id: "run-1",
        legalEntityId: "le-1",
        status: "PENDING_REVIEW",
        periodStart: new Date().toISOString(),
        periodEnd: new Date().toISOString(),
        checksum: "checksum",
        lineItems: [] as {
          id: string;
          employeeId: string;
          componentType: string;
          amount: number;
          currency: string;
          isTaxable: boolean;
        }[],
      };
    }),

  getVarianceReport: protectedProcedure
    .input(z.object({ runId: z.string().min(1) }))
    .query(async ({ ctx }) => {
      await prisma.employee.count({ where: { tenantId: ctx.tenantId } });
      return {
        runId: "run-1",
        flags: [] as {
          employeeId: string;
          currentNet: string;
          priorNet: string;
          variancePct: number;
        }[],
      };
    }),

  finalizeRun: protectedProcedure
    .input(z.object({ runId: z.string().min(1) }))
    .mutation(async ({ input }) => ({ success: true, runId: input.runId })),

});


