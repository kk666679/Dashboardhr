"use client";

import { trpc } from "@/hooks/client/trpc";
import type { Expatriate, ExpatStats } from "@/components/features/employee/types";

const emptyStats: ExpatStats = {
  total: 0,
  byStatus: {
    ONBOARDING: 0,
    ACTIVE: 0,
    RELOCATION: 0,
    RENEWAL_PENDING: 0,
    TERMINATING: 0,
    TERMINATED: 0,
  },
  criticalRenewals: 0,
};

export function useExpatriates() {
  const query = trpc.expatriate.list.useQuery(undefined, {
    staleTime: 30_000,
  });

  return {
    expatriates: (query.data?.expatriates ?? []) as unknown as Expatriate[],
    stats: (query.data?.stats ?? emptyStats) as ExpatStats,
    isLoading: query.isLoading,
    error: query.error?.message ?? null,
    refetch: query.refetch,
  };
}

export function useExpatriate(id?: string) {
  const query = trpc.expatriate.byId.useQuery(
    { id: id ?? "" },
    { enabled: Boolean(id), retry: false, staleTime: 30_000 },
  );

  return {
    expatriate: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error?.message ?? null,
    refetch: query.refetch,
  };
}
