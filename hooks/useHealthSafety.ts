"use client";

import { trpc } from "@/lib/trpc";
import { useMemo } from "react";

/**
 * Health & Safety data access hook.
 * Server router key: `healthSafety`
 *
 * @see server/routers/healthSafety.ts
 */
export function useHealthSafety() {
  const utils = trpc.useUtils();

  const incidentsList = trpc.healthSafety.listIncidents.useQuery(undefined, { staleTime: 30_000 });
  const incidentGet = (id: string) =>
    trpc.healthSafety.getIncident.useQuery({ id }, { staleTime: 60_000, enabled: !!id });
  const incidentReport = trpc.healthSafety.reportIncident.useMutation({
    onSuccess: () => utils.healthSafety.listIncidents.invalidate(),
  });
  const incidentUpdate = trpc.healthSafety.updateStatus.useMutation({
    onSuccess: () => utils.healthSafety.listIncidents.invalidate(),
  });

  return useMemo(() => ({
    incidents: {
      list: incidentsList,
      get: incidentGet,
      report: incidentReport,
      update: incidentUpdate,
    },
    utils,
  }), [
    incidentsList.data, incidentsList.isLoading,
    incidentReport.isPending, incidentUpdate.isPending, utils,
  ]);
}
