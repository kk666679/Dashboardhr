"use client";

import { trpc } from "@/lib/trpc";
import { useMemo } from "react";

/**
 * Payroll data access hook using direct tRPC pattern.
 *
 * Server state is managed by TanStack Query cache.
 *
 * @see /docs/ARCHITECTURE.md — State Management Architecture
 */
export function usePayroll() {
  const utils = trpc.useUtils();

  // ─── Queries ────────────────────────────────────────────────────────────────

  const runsQuery = trpc.payroll.list.useQuery(undefined, {
    staleTime: 5 * 60_000, // 5 minutes (payroll processed periodically)
  });

  const getPayslip = (id: string) =>
    trpc.payroll.payslip.useQuery({ id }, {
      staleTime: 5 * 60_000,
      enabled: !!id,
    });

  // ─── Mutations ──────────────────────────────────────────────────────────────

  const createMutation = trpc.payroll.create.useMutation({
    onSuccess: () => {
      utils.payroll.list.invalidate();
    },
  });

  const processMutation = trpc.payroll.process.useMutation({
    onSuccess: () => {
      utils.payroll.list.invalidate();
    },
  });

  // ─── Return ─────────────────────────────────────────────────────────────────

  return useMemo(() => ({
    runs: {
      getAll: {
        data: runsQuery.data ?? [],
        isLoading: runsQuery.isLoading,
        isError: runsQuery.isError,
        error: runsQuery.error,
        refetch: runsQuery.refetch,
      },
      getById: getPayslip,
      create: {
        mutate: createMutation.mutate,
        mutateAsync: createMutation.mutateAsync,
        isPending: createMutation.isPending,
        isError: createMutation.isError,
        error: createMutation.error,
        reset: createMutation.reset,
      },
      process: {
        mutate: processMutation.mutate,
        mutateAsync: processMutation.mutateAsync,
        isPending: processMutation.isPending,
        isError: processMutation.isError,
        error: processMutation.error,
        reset: processMutation.reset,
      },
    },
    utils,
  }), [runsQuery.data, runsQuery.isLoading, runsQuery.isError, runsQuery.error, runsQuery.refetch,
      createMutation.isPending, createMutation.isError, createMutation.error, createMutation.mutate, createMutation.mutateAsync, createMutation.reset,
      processMutation.isPending, processMutation.isError, processMutation.error, processMutation.mutate, processMutation.mutateAsync, processMutation.reset,
      utils]);
}
