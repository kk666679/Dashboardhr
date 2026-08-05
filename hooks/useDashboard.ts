"use client";

import { trpc } from "@/lib/trpc";
import { useMemo } from "react";

/**
 * Dashboard data access hook using direct tRPC pattern.
 *
 * All queries are enabled by default with appropriate stale times
 * for near-real-time dashboard metrics.
 *
 * @see server/routers/dashboard.ts for available procedures
 */
export function useDashboard() {
  const utils = trpc.useUtils();

  // ─── Queries ────────────────────────────────────────────────────────────────

  const {
    data: dashboardData,
    isLoading: loading,
    isError: error,
    error: errorObj,
    refetch,
  } = trpc.dashboard.getData.useQuery(undefined, {
    staleTime: 30_000, // 30 seconds — near-real-time
  });

  // ─── Processed data with defaults ───────────────────────────────────────────

  const data = useMemo(() => ({
    totalEmployees: (dashboardData as any)?.totalEmployees ?? 0,
    activeEmployees: (dashboardData as any)?.activeEmployees ?? 0,
    totalPayroll: (dashboardData as any)?.totalPayroll ?? 0,
    pendingApprovals: (dashboardData as any)?.pendingApprovals ?? 0,
    upcomingExpirations: (dashboardData as any)?.upcomingExpirations ?? 0,
    complianceScore: (dashboardData as any)?.complianceScore ?? 0,
    recentActivity: (dashboardData as any)?.recentActivity ?? null,
    workforceForecast: (dashboardData as any)?.workforceForecast ?? null,
  }), [dashboardData]);

  // ─── Invalidation helpers ───────────────────────────────────────────────────

  const invalidate = {
    dashboard: () => utils.dashboard.getData.invalidate(),
  };

  // ─── Return ─────────────────────────────────────────────────────────────────

  return {
    data,
    loading,
    error,
    errorObj,
    invalidate,
    refetch,
    utils,
  };
}
