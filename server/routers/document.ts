import { router, publicProcedure } from '../trpc';
import { z } from 'zod';

// STUB ROUTER for document hooks
export const documentRouter = router({
  list: publicProcedure
    .input(z.object({ type: z.string().optional(), status: z.string().optional(), tags: z.array(z.string()).optional() }).optional())
    .query(() => [{ id: 'doc1', title: 'Test Doc', status: 'draft' }]),

  create: publicProcedure
    .input(z.object({ title: z.string(), content: z.string() }))
    .mutation(({ input }) => ({ id: 'doc-new', ...input })),

  update: publicProcedure
    .input(z.object({ id: z.string(), data: z.record(z.string(), z.any()) }))
    .mutation(({ input }) => ({ ...input.data, id: input.id })),

  validate: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) => ({ valid: true, id: input.id })),
});

