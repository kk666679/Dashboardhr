"use client";

import { trpc } from "@/lib/trpc";
import { useMemo } from "react";

/**
 * Workforce Planning data access hook.
 * Server router key: `workforcePlanning`
 *
 * @see server/routers/workforcePlanning.ts
 */
export function useWorkforcePlanning() {
  const utils = trpc.useUtils();

  const currentYear = new Date().getFullYear();
  const listPlans = trpc.workforcePlanning.listPlans.useQuery({ planYear: currentYear }, { staleTime: 60_000 });
  const upsertPlan = trpc.workforcePlanning.upsertPlan.useMutation({
    onSuccess: () => utils.workforcePlanning.listPlans.invalidate(),
  });
  const syncActual = trpc.workforcePlanning.syncActual.useMutation({
    onSuccess: () => utils.workforcePlanning.listPlans.invalidate(),
  });
  const gapAnalysis = trpc.workforcePlanning.getGapAnalysis.useQuery({ planYear: currentYear }, { staleTime: 60_000 });
  const vacancyForecast = trpc.workforcePlanning.getVacancyForecast.useQuery(undefined, { staleTime: 60_000 });
  const deviationAlerts = trpc.workforcePlanning.getDeviationAlerts.useQuery({ planYear: currentYear }, { staleTime: 60_000 });

  return useMemo(() => ({
    listPlans,
    upsertPlan,
    syncActual,
    gapAnalysis,
    vacancyForecast,
    deviationAlerts,
    utils,
  }), [
    listPlans.data, listPlans.isLoading, upsertPlan.isPending, syncActual.isPending,
    gapAnalysis.data, gapAnalysis.isLoading,
    vacancyForecast.data, vacancyForecast.isLoading,
    deviationAlerts.data, deviationAlerts.isLoading,
    utils,
  ]);
}
