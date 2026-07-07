import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const workflowEngineRouter = router({
  // MSS approval queue
  getActiveWorkflows: protectedProcedure
    .input(z.object({}).optional())
    .query(async ({ ctx }) => {
      // Placeholder until workflow instances table exists.
      return [] as {
        id: string;
        entityType: string;
        entityId: string;
        status: string;
        steps: {
          stepId: string;
          stepName: string;
          status: "ACTIVE" | "DONE";
          slaDeadline?: string;
        }[];
      }[];
    }),

  submitDecision: protectedProcedure
    .input(
      z.object({
        instanceId: z.string().min(1),
        stepId: z.string().min(1),
        decision: z.enum(["APPROVED", "REJECTED"]),
      })
    )
    .mutation(async () => ({ success: true })),

  saveDefinition: protectedProcedure

    .input(
      z.object({
        name: z.string().min(1),
        module: z.string().min(1),
        graphJson: z.any(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async () => ({ id: `wf-${Date.now()}` })),

  listDefinitions: protectedProcedure
    .input(z.object({}).optional())
    .query(async () => {
      return [] as {
        id: string;
        name: string;
        version: number;
        module: string;
        isActive: boolean;
        graphJson: any;
      }[];
    }),

  getMonitoringDashboard: protectedProcedure
    .input(z.object({}).optional())
    .query(async () => ({
      active: 0,
      completed: 0,
      rejected: 0,
      slaBreached: 0,
    })),
});

