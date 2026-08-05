import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const terminationRouter = router({
  getAll: protectedProcedure
    .input(z.object({ status: z.string().optional() }).optional())
    .query(async () => []),
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async () => null),
  create: protectedProcedure
    .input(z.any())
    .mutation(async () => ({ id: "new" })),
  update: protectedProcedure
    .input(z.any())
    .mutation(async () => ({ success: true })),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async () => ({ success: true })),
  exitInterview: router({
    getByTermination: protectedProcedure
      .input(z.object({ terminationId: z.string() }))
      .query(async () => null),
    create: protectedProcedure
      .input(z.any())
      .mutation(async () => ({ id: "new" })),
    update: protectedProcedure
      .input(z.any())
      .mutation(async () => ({ success: true })),
  }),
  clearance: router({
    getByTermination: protectedProcedure
      .input(z.object({ terminationId: z.string() }))
      .query(async () => []),
    completeTask: protectedProcedure
      .input(z.any())
      .mutation(async () => ({ success: true })),
    skipTask: protectedProcedure
      .input(z.any())
      .mutation(async () => ({ success: true })),
    getProgress: protectedProcedure
      .input(z.object({ terminationId: z.string() }))
      .query(async () => ({ progress: 0 })),
  }),
  settlement: router({
    getByTermination: protectedProcedure
      .input(z.object({ terminationId: z.string() }))
      .query(async () => null),
    create: protectedProcedure
      .input(z.any())
      .mutation(async () => ({ id: "new" })),
    update: protectedProcedure
      .input(z.any())
      .mutation(async () => ({ success: true })),
    approve: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async () => ({ success: true })),
    pay: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async () => ({ success: true })),
    generateDraft: protectedProcedure
      .input(z.object({ terminationId: z.string() }))
      .mutation(async () => ({})),
  }),
  asset: router({
    getByTermination: protectedProcedure
      .input(z.object({ terminationId: z.string() }))
      .query(async () => []),
    update: protectedProcedure
      .input(z.any())
      .mutation(async () => ({ success: true })),
    returnAsset: protectedProcedure
      .input(z.any())
      .mutation(async () => ({ success: true })),
  }),
  revocation: router({
    getByTermination: protectedProcedure
      .input(z.object({ terminationId: z.string() }))
      .query(async () => []),
    create: protectedProcedure
      .input(z.any())
      .mutation(async () => ({ id: "new" })),
    complete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async () => ({ success: true })),
  }),
  knowledgeTransfer: router({
    getByTermination: protectedProcedure
      .input(z.object({ terminationId: z.string() }))
      .query(async () => null),
    create: protectedProcedure
      .input(z.any())
      .mutation(async () => ({ id: "new" })),
    update: protectedProcedure
      .input(z.any())
      .mutation(async () => ({ success: true })),
  }),
  alumni: router({
    getByTermination: protectedProcedure
      .input(z.object({ terminationId: z.string() }))
      .query(async () => null),
    updateStatus: protectedProcedure
      .input(z.any())
      .mutation(async () => ({ success: true })),
  }),
});
