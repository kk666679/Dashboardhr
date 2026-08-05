import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const foreignWorkerRouter = router({
  getAll: protectedProcedure.query(async () => []),
  getById: protectedProcedure.input(z.object({ id: z.string() })).query(async () => null),
  create: protectedProcedure.input(z.any()).mutation(async () => ({ id: "new" })),
  update: protectedProcedure.input(z.any()).mutation(async () => ({ success: true })),
  delete: protectedProcedure.input(z.object({ id: z.string() })).mutation(async () => ({ success: true })),
  permit: router({
    getByWorker: protectedProcedure.input(z.object({ workerId: z.string() })).query(async () => []),
    create: protectedProcedure.input(z.any()).mutation(async () => ({ id: "new" })),
    update: protectedProcedure.input(z.any()).mutation(async () => ({ success: true })),
  }),
  medical: router({
    getByWorker: protectedProcedure.input(z.object({ workerId: z.string() })).query(async () => []),
    create: protectedProcedure.input(z.any()).mutation(async () => ({ id: "new" })),
    update: protectedProcedure.input(z.any()).mutation(async () => ({ success: true })),
  }),
  insurance: router({
    getByWorker: protectedProcedure.input(z.object({ workerId: z.string() })).query(async () => []),
    create: protectedProcedure.input(z.any()).mutation(async () => ({ id: "new" })),
    update: protectedProcedure.input(z.any()).mutation(async () => ({ success: true })),
  }),
  visa: router({
    getByWorker: protectedProcedure.input(z.object({ workerId: z.string() })).query(async () => []),
    create: protectedProcedure.input(z.any()).mutation(async () => ({ id: "new" })),
    update: protectedProcedure.input(z.any()).mutation(async () => ({ success: true })),
  }),
});
