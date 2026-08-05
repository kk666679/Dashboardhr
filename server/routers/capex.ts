/**
 * server/routers/capex.ts
 *
 * Capital Expenditure (Capex) tRPC router.
 *
 * Storage: uses (prisma as any).capexDocument — same pattern as compliance,
 * compensationPlans, etc. for models not yet in the Prisma schema.
 */

import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { prisma } from "@/lib/prisma";

const db = prisma as any;

// ─── Sub-schemas (exported for frontend type inference) ───────────────────────

export const CapexProjectSchema = z.object({
  id: z.string(),
  title: z.string(),
  dept: z.string(),
  status: z.enum(["In Progress", "Approved", "Pending", "Completed"]),
  budget: z.number(),
  spent: z.number(),
  roi: z.number(),
  start: z.string(),
  end: z.string(),
  progress: z.number().min(0).max(100),
  risk: z.enum(["Low", "Medium", "High"]),
  pm: z.string(),
  description: z.string().optional(),
  irr: z.number().optional(),
  npv: z.number().optional(),
  payback: z.number().optional(),
});

export const BudgetRequestSchema = z.object({
  id: z.string(),
  title: z.string(),
  dept: z.string(),
  amount: z.number(),
  status: z.enum(["pending", "approved", "rejected"]),
  submitted: z.string(),
  priority: z.enum(["low", "medium", "high", "critical"]),
});

export const AssetSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  value: z.number(),
  dept: z.string(),
  status: z.enum(["Active", "Inactive", "Pending", "Disposed"]),
  nextMaint: z.string().optional(),
});

export type CapexProject = z.infer<typeof CapexProjectSchema>;
export type BudgetRequest = z.infer<typeof BudgetRequestSchema>;
export type CapexAsset = z.infer<typeof AssetSchema>;

// ─── Router ───────────────────────────────────────────────────────────────────

export const capexRouter = router({
  /** Overview KPIs + charts for /dashboard/capex */
  overview: protectedProcedure.query(async ({ ctx }) => {
    const kpiDoc = await db.capexDocument?.findFirst({
      where: { tenantId: ctx.tenantId, type: "CAPEX_KPI" },
      orderBy: { updatedAt: "desc" },
    });

    const kpi = (kpiDoc?.data ?? {}) as {
      budgetData?: { dept: string; allocated: number; spent: number; remaining: number }[];
      budgetAllocation?: { name: string; value: number; color: string }[];
      spendTrend?: { month: string; planned: number; actual: number }[];
    };

    const projectDocs = await db.capexDocument?.findMany({
      where: { tenantId: ctx.tenantId, type: "CAPEX_PROJECT" },
      orderBy: { updatedAt: "desc" },
      take: 5,
    }) ?? [];

    const topProjects = projectDocs.map((d: any) => d.data as CapexProject);
    const totalAllocated = kpi.budgetAllocation?.reduce((a: number, b: { value: number }) => a + b.value, 0) ?? 0;
    const totalSpent = kpi.budgetData?.reduce((a: number, b: { spent: number }) => a + b.spent, 0) ?? 0;
    const totalRemaining = kpi.budgetData?.reduce((a: number, b: { remaining: number }) => a + b.remaining, 0) ?? 0;
    const avgRoi = topProjects.length
      ? topProjects.reduce((a: number, p: CapexProject) => a + p.roi, 0) / topProjects.length
      : 0;

    return { totalAllocated, totalSpent, totalRemaining, avgRoi, budgetData: kpi.budgetData ?? [], budgetAllocation: kpi.budgetAllocation ?? [], spendTrend: kpi.spendTrend ?? [], topProjects };
  }),

  /** List capital projects with optional filtering. */
  listProjects: protectedProcedure
    .input(z.object({
      status: z.enum(["In Progress", "Approved", "Pending", "Completed"]).optional(),
      dept: z.string().optional(),
      search: z.string().optional(),
    }))
    .query(async ({ input, ctx }) => {
      const docs = await db.capexDocument?.findMany({
        where: { tenantId: ctx.tenantId, type: "CAPEX_PROJECT" },
        orderBy: { updatedAt: "desc" },
      }) ?? [];

      let projects = docs.map((d: any) => d.data as CapexProject);
      if (input.status) projects = projects.filter((p: CapexProject) => p.status === input.status);
      if (input.dept) projects = projects.filter((p: CapexProject) => p.dept === input.dept);
      if (input.search) {
        const q = input.search.toLowerCase();
        projects = projects.filter((p: CapexProject) =>
          p.title.toLowerCase().includes(q) || p.id.toLowerCase().includes(q) || p.dept.toLowerCase().includes(q),
        );
      }
      return projects;
    }),

  /** Upsert a capital project. */
  upsertProject: protectedProcedure
    .input(CapexProjectSchema)
    .mutation(async ({ input, ctx }) => {
      const existing = await db.capexDocument?.findFirst({
        where: { tenantId: ctx.tenantId, type: "CAPEX_PROJECT", name: input.id },
      });
      if (existing) {
        return db.capexDocument.update({ where: { id: existing.id }, data: { data: input, updatedAt: new Date() } });
      }
      return db.capexDocument.create({
        data: { tenantId: ctx.tenantId, type: "CAPEX_PROJECT", name: input.id, data: input, createdBy: ctx.userId },
      }) ?? input;
    }),

  /** Budget page: dept budgets, quarterly totals, approval queue. */
  budget: protectedProcedure.query(async ({ ctx }) => {
    const doc = await db.capexDocument?.findFirst({
      where: { tenantId: ctx.tenantId, type: "CAPEX_BUDGET" },
      orderBy: { updatedAt: "desc" },
    });

    const data = (doc?.data ?? {}) as {
      deptBudget?: { dept: string; annual: number; ytd: number; remaining: number; status: string }[];
      quarterlyBudget?: { quarter: string; allocated: number; spent: number; variance: number }[];
      approvalQueue?: BudgetRequest[];
    };

    return {
      deptBudget: data.deptBudget ?? [],
      quarterlyBudget: data.quarterlyBudget ?? [],
      approvalQueue: data.approvalQueue ?? [],
    };
  }),

  /** Submit a new budget request. */
  submitBudgetRequest: protectedProcedure
    .input(BudgetRequestSchema.omit({ id: true, status: true }))
    .mutation(async ({ input, ctx }) => {
      const id = `REQ-${Date.now()}`;
      const newReq: BudgetRequest = { id, ...input, status: "pending" };

      const budgetDoc = await db.capexDocument?.findFirst({
        where: { tenantId: ctx.tenantId, type: "CAPEX_BUDGET" },
        orderBy: { updatedAt: "desc" },
      });

      if (budgetDoc) {
        const prev = budgetDoc.data as { approvalQueue?: BudgetRequest[] };
        await db.capexDocument.update({
          where: { id: budgetDoc.id },
          data: { data: { ...prev, approvalQueue: [...(prev.approvalQueue ?? []), newReq] }, updatedAt: new Date() },
        });
      }
      return newReq;
    }),

  /** ROI analysis page. */
  roiAnalysis: protectedProcedure.query(async ({ ctx }) => {
    const projectDocs = await db.capexDocument?.findMany({
      where: { tenantId: ctx.tenantId, type: "CAPEX_PROJECT" },
      orderBy: { updatedAt: "desc" },
    }) ?? [];

    const projects = projectDocs.map((d: any) => d.data as CapexProject);

    const roiDoc = await db.capexDocument?.findFirst({
      where: { tenantId: ctx.tenantId, type: "CAPEX_ROI" },
      orderBy: { updatedAt: "desc" },
    });

    const roiData = (roiDoc?.data ?? {}) as {
      paybackChart?: { year: number; cashflow: number; cumulative: number }[];
      npvSensitivity?: { discount: number; npv: number }[];
    };

    const totalInvestment = projects.reduce((a: number, p: CapexProject) => a + p.budget, 0);
    const avgIrr = projects.length ? projects.reduce((a: number, p: CapexProject) => a + (p.irr ?? p.roi), 0) / projects.length : 0;
    const avgPayback = projects.length ? projects.reduce((a: number, p: CapexProject) => a + (p.payback ?? 0), 0) / projects.length : 0;
    const totalNpv = projects.reduce((a: number, p: CapexProject) => a + (p.npv ?? 0), 0);

    return { projects, paybackChart: roiData.paybackChart ?? [], npvSensitivity: roiData.npvSensitivity ?? [], kpi: { totalInvestment, avgIrr, avgPayback, totalNpv } };
  }),

  /** Asset management page. */
  assets: protectedProcedure
    .input(z.object({ search: z.string().optional() }))
    .query(async ({ input, ctx }) => {
      const assetDocs = await db.capexDocument?.findMany({
        where: { tenantId: ctx.tenantId, type: "CAPEX_ASSET" },
        orderBy: { updatedAt: "desc" },
      }) ?? [];

      let assets = assetDocs.map((d: any) => d.data as CapexAsset);
      if (input.search) {
        const q = input.search.toLowerCase();
        assets = assets.filter((a: CapexAsset) => a.name.toLowerCase().includes(q));
      }

      const metaDoc = await db.capexDocument?.findFirst({
        where: { tenantId: ctx.tenantId, type: "CAPEX_ASSET_META" },
        orderBy: { updatedAt: "desc" },
      });

      const meta = (metaDoc?.data ?? {}) as {
        categories?: { name: string; value: number; count: number; color: string }[];
        depreciationSchedule?: { year: string; gross: number; accumulated: number; net: number }[];
        maintenanceAlerts?: { asset: string; type: string; due: string; status: "scheduled" | "overdue"; priority: string }[];
      };

      const totalValue = meta.categories?.reduce((a: number, c: { value: number }) => a + c.value, 0) ?? 0;
      const totalCount = meta.categories?.reduce((a: number, c: { count: number }) => a + c.count, 0) ?? 0;
      const currentNet = meta.depreciationSchedule?.[meta.depreciationSchedule.length - 1]?.net ?? 0;
      const overdueCount = meta.maintenanceAlerts?.filter((a: { status: string }) => a.status === "overdue").length ?? 0;

      return { assets, categories: meta.categories ?? [], depreciationSchedule: meta.depreciationSchedule ?? [], maintenanceAlerts: meta.maintenanceAlerts ?? [], kpi: { totalValue, totalCount, currentNet, overdueCount } };
    }),

  /** Upsert an asset. */
  upsertAsset: protectedProcedure
    .input(AssetSchema)
    .mutation(async ({ input, ctx }) => {
      const existing = await db.capexDocument?.findFirst({
        where: { tenantId: ctx.tenantId, type: "CAPEX_ASSET", name: input.id },
      });
      if (existing) {
        return db.capexDocument.update({ where: { id: existing.id }, data: { data: input, updatedAt: new Date() } });
      }
      return db.capexDocument.create({
        data: { tenantId: ctx.tenantId, type: "CAPEX_ASSET", name: input.id, data: input, createdBy: ctx.userId },
      }) ?? input;
    }),
});
