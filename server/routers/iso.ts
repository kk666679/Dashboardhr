import { router, createTRPCRouter, publicProcedure } from '../trpc';
import { z } from 'zod';

// STUB ROUTER for ISO hooks
// Inputs/outputs are aligned with the ISO feature pages & components so the
// client-side `.useQuery` / `.useMutation` calls type-check correctly.
export const isoRouter = router({
  compliance: createTRPCRouter({
    check: publicProcedure
      .input(z.object({ standard: z.string() }))
      .query(() => ({
        findings: [],
        totalClauses: 0,
        compliant: 0,
        openFindings: 0,
      })),

    score: publicProcedure
      .input(z.object({
        standard: z.string(),
        requirements: z.array(z.object({
          requirement: z.string(),
          implemented: z.boolean(),
          evidence: z.array(z.any()).optional(),
        })).optional(),
      }))
      .mutation(() => ({
        compliancePercentage: 92,
        totalRequirements: 26,
        implementedRequirements: 24,
      })),

    gapAnalysis: publicProcedure
      .input(z.object({
        standard: z.string(),
        current: z.number().optional(),
        target: z.number().optional(),
      }))
      .mutation(() => ({
        currentScore: 0,
        targetScore: 100,
        gap: 100,
        recommendations: ['Implement tracking'],
      })),
  }),

  audit: createTRPCRouter({
    generate: publicProcedure
      .input(z.object({ standard: z.string(), clauses: z.array(z.string()) }))
      .mutation(() => ({
        checklist: [{ clause: '4.1', questions: ['Is the QMS context documented?'] }],
      })),

    list: publicProcedure
      .input(z.object({ take: z.number().optional() }))
      .query(() => []),

    createPlan: publicProcedure
      .input(z.object({
        standard: z.string(),
        scope: z.string(),
        duration: z.number().optional(),
      }))
      .mutation(() => ({ planId: 'audit-1', status: 'draft' })),
  }),

  risk: createTRPCRouter({
    assess: publicProcedure
      .input(z.object({ risks: z.array(z.any()) }))
      .mutation(() => ({ matrix: [], totalRisk: 'medium' })),

    matrix: publicProcedure.query(() => ({ matrix: [] })),

    climate: publicProcedure
      .input(z.object({ hazards: z.array(z.string()) }))
      .mutation(() => ({ risks: [], score: 75 })),
  }),

  capa: createTRPCRouter({
    create: publicProcedure
      .input(z.object({
        title: z.string(),
        description: z.string().optional().default(''),
        type: z.string(),
        source: z.string().optional().default('nonconformity'),
        rootCause: z.string().optional().default(''),
        proposedAction: z.string().optional().default(''),
        owner: z.string().optional().default(''),
        dueDate: z.date().optional(),
        priority: z.string().optional().default('medium'),
      }))
      .mutation(() => ({ capaId: 'capa-1' })),

    list: publicProcedure
      .input(z.object({ take: z.number().optional() }))
      .query(() => []),

    fiveWhys: publicProcedure
      .input(z.object({ problem: z.string() }))
      .mutation(() => ({ whys: ['Why1?', 'Why2?', 'Root cause'] })),

    fishbone: publicProcedure
      .input(z.object({ problem: z.string() }))
      .mutation(() => ({ categories: { man: [], machine: [] } })),
  }),
});
