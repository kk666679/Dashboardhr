import { router, createTRPCRouter, publicProcedure } from '../trpc';
import { z } from 'zod';

// STUB ROUTER for Malaysian Standards hooks
export const msRouter = router({
  list: publicProcedure.query(() => [
    { code: 'MS ISO 9001', title: 'Quality Management' },
    { code: 'MS 1725', title: 'Construction Safety' },
  ]),

  get: publicProcedure
    .input(z.object({ code: z.string() }))
    .query(({ input }) => ({ code: input.code, title: 'Standard Title', clauses: [] })),

  search: publicProcedure
    .input(z.object({ query: z.string() }))
    .query(({ input }) => [{ code: 'MS123', title: `Match for ${input.query}` }]),

  getRequirements: publicProcedure
    .input(z.object({ code: z.string() }))
    .query(({ input }) => ({ requirements: [{ clause: '4.1', text: 'Requirement text' }] })),

  getClauses: publicProcedure
    .input(z.object({ code: z.string() }))
    .query(({ input }) => [{ number: '4.1', title: 'Context' }]),

  checkCompliance: publicProcedure
    .input(z.object({ code: z.string(), documents: z.array(z.any()) }))
    .mutation(() => ({ compliant: true, gaps: [] })),
});


