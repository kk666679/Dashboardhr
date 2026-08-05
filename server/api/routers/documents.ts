import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const documentsRouter = router({
  getAll: protectedProcedure.query(async () => []),
  getById: protectedProcedure.input(z.object({ id: z.string() })).query(async () => null),
  create: protectedProcedure.input(z.any()).mutation(async () => ({ id: "new" })),
  update: protectedProcedure.input(z.any()).mutation(async () => ({ success: true })),
  delete: protectedProcedure.input(z.object({ id: z.string() })).mutation(async () => ({ success: true })),
  template: router({
    getAll: protectedProcedure.query(async () => []),
    getById: protectedProcedure.input(z.object({ id: z.string() })).query(async () => null),
    create: protectedProcedure.input(z.any()).mutation(async () => ({ id: "new" })),
    update: protectedProcedure.input(z.any()).mutation(async () => ({ success: true })),
    delete: protectedProcedure.input(z.object({ id: z.string() })).mutation(async () => ({ success: true })),
  }),
  generate: protectedProcedure.input(z.any()).mutation(async () => ({})),
  preview: protectedProcedure.input(z.any()).mutation(async () => ({})),
  signing: router({
    getByDocument: protectedProcedure.input(z.object({ documentId: z.string() })).query(async () => []),
    sign: protectedProcedure.input(z.any()).mutation(async () => ({ success: true })),
    remind: protectedProcedure.input(z.any()).mutation(async () => ({ success: true })),
  }),
  version: router({
    getByDocument: protectedProcedure.input(z.object({ documentId: z.string() })).query(async () => []),
    restore: protectedProcedure.input(z.any()).mutation(async () => ({ success: true })),
  }),
});
