/**
 * Compliance Scorecard Service
 *
 * Computes and persists tenant-level compliance scorecards per regulatory
 * agency and period. Scorecards are stored in `compliance_scorecards` and
 * surfaced through the Regulatory Intelligence dashboard.
 */
import { prisma } from "@/lib/prisma";

export interface ScorecardMetric {
  key: string;
  label: string;
  value: number;
  max: number;
  weight?: number;
}

export interface ScorecardInput {
  tenantId: string;
  period: string;
  agencyCode?: string;
  category?: string;
  metrics: ScorecardMetric[];
  generatedBy?: string;
}

/** Computes a weighted total score from metrics and persists the scorecard. */
export async function computeAndPersistScorecard(input: ScorecardInput) {
  const totalWeight = input.metrics.reduce((sum, m) => sum + (m.weight ?? 1), 0) || 1;
  const weightedScore = input.metrics.reduce(
    (sum, m) => sum + (m.value / Math.max(m.max, 1)) * (m.weight ?? 1) * 100,
    0
  );
  const totalScore = Math.min(100, Math.round(weightedScore / totalWeight));

  const scorecard = await prisma.compliance_scorecards.upsert({
    where: {
      tenantId_period_agencyCode: {
        tenantId: input.tenantId,
        period: input.period,
        agencyCode: input.agencyCode ?? "MOHR",
      },
    },
    create: {
      tenantId: input.tenantId,
      period: input.period,
      agencyCode: input.agencyCode ?? "MOHR",
      category: input.category ?? null,
      totalScore,
      maxScore: 100,
      metrics: input.metrics as any,
      status: "DRAFT",
      generatedBy: input.generatedBy ?? null,
    },
    update: {
      totalScore,
      metrics: input.metrics as any,
      category: input.category ?? null,
      generatedBy: input.generatedBy ?? null,
      updatedAt: new Date(),
    },
  });

  return { ...scorecard, totalScore };
}

/** Publishes a draft scorecard (sets status to PUBLISHED). */
export async function publishScorecard(scorecardId: string, publishedBy: string) {
  return prisma.compliance_scorecards.update({
    where: { id: scorecardId },
    data: { status: "PUBLISHED", publishedAt: new Date(), generatedBy: publishedBy },
  });
}

/** Returns scorecards for a tenant, optionally filtered by agency/period. */
export async function getScorecards(params: {
  tenantId: string;
  agencyCode?: string;
  period?: string;
  status?: string;
}) {
  return prisma.compliance_scorecards.findMany({
    where: {
      tenantId: params.tenantId,
      ...(params.agencyCode ? { agencyCode: params.agencyCode as any } : {}),
      ...(params.period ? { period: params.period } : {}),
      ...(params.status ? { status: params.status as any } : {}),
    },
    orderBy: [{ period: "desc" }, { agencyCode: "asc" }],
  });
}

