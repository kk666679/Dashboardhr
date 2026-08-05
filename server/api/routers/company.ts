import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const companyRouter = router({
  getAll: protectedProcedure.query(async () => []),
  getById: protectedProcedure.input(z.object({ id: z.string() })).query(async () => null),
  create: protectedProcedure.input(z.any()).mutation(async () => ({ id: "new" })),
  update: protectedProcedure.input(z.any()).mutation(async () => ({ success: true })),
  delete: protectedProcedure.input(z.object({ id: z.string() })).mutation(async () => ({ success: true })),
  branch: router({
    getByCompany: protectedProcedure.input(z.object({ companyId: z.string() })).query(async () => []),
    create: protectedProcedure.input(z.any()).mutation(async () => ({ id: "new" })),
    update: protectedProcedure.input(z.any()).mutation(async () => ({ success: true })),
    delete: protectedProcedure.input(z.object({ id: z.string() })).mutation(async () => ({ success: true })),
  }),
  department: router({
    getByCompany: protectedProcedure.input(z.object({ companyId: z.string() })).query(async () => []),
    create: protectedProcedure.input(z.any()).mutation(async () => ({ id: "new" })),
    update: protectedProcedure.input(z.any()).mutation(async () => ({ success: true })),
    delete: protectedProcedure.input(z.object({ id: z.string() })).mutation(async () => ({ success: true })),
  }),
  settings: router({
    get: protectedProcedure.query(async () => ({})),
    update: protectedProcedure.input(z.any()).mutation(async () => ({ success: true })),
  }),
});
