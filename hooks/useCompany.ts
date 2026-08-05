"use client";

import { trpc } from "@/lib/trpc";
import { useMemo } from "react";

/**
 * Company data access hook using direct tRPC pattern.
 *
 * Server state is managed by TanStack Query cache.
 *
 * @see /docs/ARCHITECTURE.md — State Management Architecture
 */
export function useCompany() {
  const utils = trpc.useUtils();

  // ─── Queries ────────────────────────────────────────────────────────────────

  const companiesQuery = trpc.company.getAll.useQuery(undefined, {
    staleTime: 10 * 60_000, // 10 minutes (rarely changes)
  });

  const getById = (id: string) =>
    trpc.company.getById.useQuery({ id }, {
      staleTime: 10 * 60_000,
      enabled: !!id,
    });

  // ─── Mutations ──────────────────────────────────────────────────────────────

  const saveMutation = trpc.company.save.useMutation({
    onSuccess: () => {
      utils.company.getAll.invalidate();
    },
  });

  const deleteMutation = trpc.company.delete.useMutation({
    onSuccess: () => {
      utils.company.getAll.invalidate();
    },
  });

  // ─── Return ─────────────────────────────────────────────────────────────────

  return useMemo(() => ({
    companies: {
      getAll: {
        data: companiesQuery.data ?? [],
        isLoading: companiesQuery.isLoading,
        isError: companiesQuery.isError,
        error: companiesQuery.error,
        refetch: companiesQuery.refetch,
      },
      getById,
      save: {
        mutate: saveMutation.mutate,
        mutateAsync: saveMutation.mutateAsync,
        isPending: saveMutation.isPending,
        isError: saveMutation.isError,
        error: saveMutation.error,
        reset: saveMutation.reset,
      },
      delete: {
        mutate: deleteMutation.mutate,
        mutateAsync: deleteMutation.mutateAsync,
        isPending: deleteMutation.isPending,
        isError: deleteMutation.isError,
        error: deleteMutation.error,
        reset: deleteMutation.reset,
      },
    },
    utils,
  }), [companiesQuery.data, companiesQuery.isLoading, companiesQuery.isError, companiesQuery.error, companiesQuery.refetch,
      saveMutation.isPending, saveMutation.isError, saveMutation.error, saveMutation.mutate, saveMutation.mutateAsync, saveMutation.reset,
      deleteMutation.isPending, deleteMutation.isError, deleteMutation.error, deleteMutation.mutate, deleteMutation.mutateAsync, deleteMutation.reset,
      utils]);
}
