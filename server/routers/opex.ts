/**
 * server/routers/opex.ts
 *
 * Operational Excellence (Opex) tRPC router.
 *
 * Storage: uses (prisma as any).opexDocument — a generic key/value store
 * keyed by (tenantId, type, name) — consistent with the pattern used by
 * compliance, compensationPlans, etc. for models not yet in the Prisma schema.
 *
 * Each procedure returns the exact shape the dashboard pages consume, so
 * pages can drop their useState mock data and call trpc.opex.* directly.
 */

import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { prisma } from "@/lib/prisma";

// ─── Type helpers ─────────────────────────────────────────────────────────────

const db = prisma as any;

// ─── Shared sub-schemas ────────────────────────────────────────────────────────

export const SixSigmaProjectSchema = z.object({
  id: z.string(),
  title: z.string(),
  phase: z.enum(["Define", "Measure", "Analyze", "Improve", "Control"]),
  progress: z.number().min(0).max(100),
  status: z.enum(["on-track", "at-risk", "completed"]),
  sigma: z.number(),
  department: z.string().optional(),
  owner: z.string().optional(),
});

export const KaizenIdeaSchema = z.object({
  id: z.string(),
  title: z.string(),
  submittedBy: z.string(),
  status: z.enum(["idea", "in-review", "approved", "completed", "rejected"]),
  estimatedSaving: z.number(),
  category: z.string(),
  submittedAt: z.string(),
});

export type SixSigmaProject = z.infer<typeof SixSigmaProjectSchema>;
export type KaizenIdea = z.infer<typeof KaizenIdeaSchema>;

// ─── Router ───────────────────────────────────────────────────────────────────

export const opexRouter = router({
  /**
   * Overview KPIs + chart data for /dashboard/opex
   */
  overview: protectedProcedure.query(async ({ ctx }) => {
    const kpiDoc = await db.opexDocument?.findFirst({
      where: { tenantId: ctx.tenantId, type: "OPEX_KPI" },
      orderBy: { updatedAt: "desc" },
    });

    const kpi = (kpiDoc?.data ?? {}) as {
      totalSavings?: number;
      oee?: number;
      kaizenIdeas?: number;
      savingsBreakdown?: { name: string; value: number; color: string }[];
      oeeTrend?: { month: string; oee: number }[];
      wasteReduction?: { name: string; before: number; after: number; reduction: number }[];
      costSavingsData?: { month: string; waste: number; lean: number; sixSigma: number }[];
    };

    const projectDocs = await db.opexDocument?.findMany({
      where: { tenantId: ctx.tenantId, type: "OPEX_SIX_SIGMA" },
      orderBy: { updatedAt: "desc" },
      take: 10,
    }) ?? [];

    return {
      totalSavings: kpi.totalSavings ?? 0,
      oee: kpi.oee ?? 0,
      kaizenIdeas: kpi.kaizenIdeas ?? 0,
      savingsBreakdown: kpi.savingsBreakdown ?? [],
      oeeTrend: kpi.oeeTrend ?? [],
      wasteReduction: kpi.wasteReduction ?? [],
      costSavingsData: kpi.costSavingsData ?? [],
      sixSigmaProjects: projectDocs.map((d: any) => d.data as SixSigmaProject),
    };
  }),

  /** List Six Sigma / DMAIC projects with optional filtering. */
  listSixSigmaProjects: protectedProcedure
    .input(z.object({
      phase: z.enum(["Define", "Measure", "Analyze", "Improve", "Control"]).optional(),
      status: z.enum(["on-track", "at-risk", "completed"]).optional(),
    }))
    .query(async ({ input, ctx }) => {
      const docs = await db.opexDocument?.findMany({
        where: { tenantId: ctx.tenantId, type: "OPEX_SIX_SIGMA" },
        orderBy: { updatedAt: "desc" },
      }) ?? [];

      let projects = docs.map((d: any) => d.data as SixSigmaProject);
      if (input.phase) projects = projects.filter((p: SixSigmaProject) => p.phase === input.phase);
      if (input.status) projects = projects.filter((p: SixSigmaProject) => p.status === input.status);
      return projects;
    }),

  /** Create or update a Six Sigma project. */
  upsertSixSigmaProject: protectedProcedure
    .input(SixSigmaProjectSchema)
    .mutation(async ({ input, ctx }) => {
      const existing = await db.opexDocument?.findFirst({
        where: { tenantId: ctx.tenantId, type: "OPEX_SIX_SIGMA", name: input.id },
      });
      if (existing) {
        return db.opexDocument.update({ where: { id: existing.id }, data: { data: input, updatedAt: new Date() } });
      }
      return db.opexDocument.create({
        data: { tenantId: ctx.tenantId, type: "OPEX_SIX_SIGMA", name: input.id, data: input, createdBy: ctx.userId },
      });
    }),

  /** List Kaizen ideas. */
  listKaizenIdeas: protectedProcedure
    .input(z.object({
      status: z.enum(["idea", "in-review", "approved", "completed", "rejected"]).optional(),
    }))
    .query(async ({ input, ctx }) => {
      const docs = await db.opexDocument?.findMany({
        where: { tenantId: ctx.tenantId, type: "OPEX_KAIZEN" },
        orderBy: { updatedAt: "desc" },
      }) ?? [];

      let ideas = docs.map((d: any) => d.data as KaizenIdea);
      if (input.status) ideas = ideas.filter((i: KaizenIdea) => i.status === input.status);
      return ideas;
    }),

  /** Submit a new Kaizen idea. */
  submitKaizenIdea: protectedProcedure
    .input(KaizenIdeaSchema.omit({ id: true }))
    .mutation(async ({ input, ctx }) => {
      const id = `KZN-${Date.now()}`;
      const payload = { id, ...input };
      return db.opexDocument.create({
        data: { tenantId: ctx.tenantId, type: "OPEX_KAIZEN", name: id, data: payload, createdBy: ctx.userId },
      }) ?? payload;
    }),

  /**
   * Analytics page data.
   * Returns defect pareto, cycle time trend, cost by category, sigma levels, lean metrics.
   */
  analytics: protectedProcedure
    .input(z.object({ timeRange: z.enum(["1m", "3m", "6m", "1y"]).default("6m") }))
    .query(async ({ input, ctx }) => {
      const doc = await db.opexDocument?.findFirst({
        where: { tenantId: ctx.tenantId, type: "OPEX_ANALYTICS" },
        orderBy: { updatedAt: "desc" },
      });

      const data = (doc?.data ?? {}) as {
        defectPareto?: { cause: string; defects: number; cumPct: number }[];
        cycleTimeTrend?: { week: string; cycleTime: number; taktTime: number }[];
        costByCategory?: { category: string; current: number; prior: number; variance: number }[];
        sigmaLevelData?: { process: string; sigma: number; target: number }[];
        leanMetrics?: { metric: string; value: string; target: string; gap: string }[];
        kpi?: { processSigma: number; flowEfficiency: number; costPerUnit: number; avgCycleTime: number };
      };

      return {
        timeRange: input.timeRange,
        defectPareto: data.defectPareto ?? [],
        cycleTimeTrend: data.cycleTimeTrend ?? [],
        costByCategory: data.costByCategory ?? [],
        sigmaLevelData: data.sigmaLevelData ?? [],
        leanMetrics: data.leanMetrics ?? [],
        kpi: data.kpi ?? { processSigma: 0, flowEfficiency: 0, costPerUnit: 0, avgCycleTime: 0 },
      };
    }),
});
