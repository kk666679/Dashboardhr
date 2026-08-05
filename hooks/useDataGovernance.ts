"use client";

import { trpc } from "@/lib/trpc";
import { useMemo } from "react";
import { skipToken } from "@tanstack/react-query";

export function useDataGovernance() {
  const utils = trpc.useUtils();

  const dsarList = trpc.dataGovernance.listDsarRequests.useQuery(skipToken, { staleTime: 60_000 });
  const dsarSubmit = trpc.dataGovernance.submitDsarRequest.useMutation({
    onSuccess: () => utils.dataGovernance.listDsarRequests.invalidate(),
  });
  const dsarUpdateStatus = trpc.dataGovernance.updateDsarStatus.useMutation({
    onSuccess: () => utils.dataGovernance.listDsarRequests.invalidate(),
  });
  const auditTrail = trpc.dataGovernance.getAuditTrail.useQuery(skipToken, { staleTime: 120_000 });
  const consentExpiryAlerts = trpc.dataGovernance.getConsentExpiryAlerts.useQuery(skipToken, { staleTime: 120_000 });
  const retentionStats = trpc.dataGovernance.getRetentionStats.useQuery(skipToken, { staleTime: 60_000 });

  return useMemo(() => ({
    dsar: { list: dsarList, submit: dsarSubmit, updateStatus: dsarUpdateStatus },
    auditTrail,
    consentExpiryAlerts,
    retentionStats,
    utils,
  }), [
    dsarList.data, dsarList.isLoading, dsarSubmit.isPending, dsarUpdateStatus.isPending,
    auditTrail.data, auditTrail.isLoading,
    consentExpiryAlerts.data, retentionStats.data, utils,
  ]);
}
