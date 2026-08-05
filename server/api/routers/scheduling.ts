import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const schedulingRouter = router({
  shiftPattern: router({
    getAll: protectedProcedure.query(async () => []),
    getById: protectedProcedure.input(z.object({ id: z.string() })).query(async () => null),
    create: protectedProcedure.input(z.any()).mutation(async () => ({ id: "new" })),
    update: protectedProcedure.input(z.any()).mutation(async () => ({ success: true })),
    delete: protectedProcedure.input(z.object({ id: z.string() })).mutation(async () => ({ success: true })),
  }),
  rotation: router({
    getAll: protectedProcedure.query(async () => []),
    getById: protectedProcedure.input(z.object({ id: z.string() })).query(async () => null),
    create: protectedProcedure.input(z.any()).mutation(async () => ({ id: "new" })),
    update: protectedProcedure.input(z.any()).mutation(async () => ({ success: true })),
    delete: protectedProcedure.input(z.object({ id: z.string() })).mutation(async () => ({ success: true })),
  }),
});
