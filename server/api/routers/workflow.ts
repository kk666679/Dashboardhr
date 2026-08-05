import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const workflowRouter = router({
  getAll: protectedProcedure.query(async () => []),
  getById: protectedProcedure.input(z.object({ id: z.string() })).query(async () => null),
  create: protectedProcedure.input(z.any()).mutation(async () => ({ id: "new" })),
  update: protectedProcedure.input(z.any()).mutation(async () => ({ success: true })),
  delete: protectedProcedure.input(z.object({ id: z.string() })).mutation(async () => ({ success: true })),
  instance: router({
    getByWorkflow: protectedProcedure.input(z.object({ workflowId: z.string() })).query(async () => []),
    start: protectedProcedure.input(z.any()).mutation(async () => ({ id: "new" })),
    pause: protectedProcedure.input(z.object({ id: z.string() })).mutation(async () => ({ success: true })),
    resume: protectedProcedure.input(z.object({ id: z.string() })).mutation(async () => ({ success: true })),
    cancel: protectedProcedure.input(z.object({ id: z.string() })).mutation(async () => ({ success: true })),
  }),
  task: router({
    getByInstance: protectedProcedure.input(z.object({ instanceId: z.string() })).query(async () => []),
    complete: protectedProcedure.input(z.any()).mutation(async () => ({ success: true })),
    assign: protectedProcedure.input(z.any()).mutation(async () => ({ success: true })),
  }),
});
