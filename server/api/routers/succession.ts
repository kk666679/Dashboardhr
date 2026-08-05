import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const successionRouter = router({
  position: router({
    getAll: protectedProcedure.query(async () => []),
    getById: protectedProcedure.input(z.object({ id: z.string() })).query(async () => null),
    create: protectedProcedure.input(z.any()).mutation(async () => ({ id: "new" })),
    update: protectedProcedure.input(z.any()).mutation(async () => ({ success: true })),
    delete: protectedProcedure.input(z.object({ id: z.string() })).mutation(async () => ({ success: true })),
  }),
  successor: router({
    getByPosition: protectedProcedure.input(z.object({ positionId: z.string() })).query(async () => []),
    assign: protectedProcedure.input(z.any()).mutation(async () => ({ success: true })),
    updateRank: protectedProcedure.input(z.any()).mutation(async () => ({ success: true })),
    remove: protectedProcedure.input(z.any()).mutation(async () => ({ success: true })),
    reorder: protectedProcedure.input(z.any()).mutation(async () => ({ success: true })),
  }),
  readiness: router({
    getByPosition: protectedProcedure.input(z.object({ positionId: z.string() })).query(async () => []),
    create: protectedProcedure.input(z.any()).mutation(async () => ({ id: "new" })),
    update: protectedProcedure.input(z.any()).mutation(async () => ({ success: true })),
    getHistory: protectedProcedure.input(z.object({ positionId: z.string() })).query(async () => []),
  }),
  bench: router({
    getSnapshot: protectedProcedure.input(z.object({ positionId: z.string() })).query(async () => ({})),
    getHistory: protectedProcedure.input(z.object({ positionId: z.string() })).query(async () => []),
    refresh: protectedProcedure.input(z.object({ positionId: z.string() })).mutation(async () => ({ success: true })),
  }),
  devPlan: router({
    getAll: protectedProcedure.query(async () => []),
    getById: protectedProcedure.input(z.object({ id: z.string() })).query(async () => null),
    create: protectedProcedure.input(z.any()).mutation(async () => ({ id: "new" })),
    update: protectedProcedure.input(z.any()).mutation(async () => ({ success: true })),
    delete: protectedProcedure.input(z.object({ id: z.string() })).mutation(async () => ({ success: true })),
    addTask: protectedProcedure.input(z.any()).mutation(async () => ({ success: true })),
    completeTask: protectedProcedure.input(z.any()).mutation(async () => ({ success: true })),
  }),
  nineBox: router({
    getAll: protectedProcedure.query(async () => []),
    create: protectedProcedure.input(z.any()).mutation(async () => ({ id: "new" })),
    update: protectedProcedure.input(z.any()).mutation(async () => ({ success: true })),
    getMatrix: protectedProcedure.query(async () => ({})),
  }),
});
