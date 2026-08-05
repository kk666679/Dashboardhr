"use client";

import { trpc } from "@/lib/trpc";
import { useMemo } from "react";

/**
 * Employee data access hook using direct tRPC pattern.
 *
 * Server state is managed by TanStack Query cache.
 * Do NOT store employee data in Zustand or Redux.
 *
 * @see /docs/ARCHITECTURE.md — State Management Architecture
 */
export function useEmployee() {
  const utils = trpc.useUtils();

  // ─── Queries ────────────────────────────────────────────────────────────────

  const employeesQuery = trpc.employee.list.useQuery(undefined, {
    staleTime: 30_000, // 30 seconds
  });

  const getById = (id: string) =>
    trpc.employee.byId.useQuery({ id }, {
      staleTime: 5 * 60_000, // 5 minutes
      enabled: !!id,
    });

  // ─── Mutations ──────────────────────────────────────────────────────────────

  const createMutation = trpc.employee.create.useMutation({
    onSuccess: () => {
      utils.employee.list.invalidate();
    },
  });

  const updateMutation = trpc.employee.update.useMutation({
    onSuccess: () => {
      utils.employee.list.invalidate();
    },
  });

  const deleteMutation = trpc.employee.delete.useMutation({
    onSuccess: () => {
      utils.employee.list.invalidate();
    },
  });

  // ─── Return ─────────────────────────────────────────────────────────────────

  return useMemo(() => ({
    employees: {
      getAll: {
        data: employeesQuery.data ?? [],
        isLoading: employeesQuery.isLoading,
        isError: employeesQuery.isError,
        error: employeesQuery.error,
        refetch: employeesQuery.refetch,
      },
      getById,
      create: {
        mutate: createMutation.mutate,
        mutateAsync: createMutation.mutateAsync,
        isPending: createMutation.isPending,
        isError: createMutation.isError,
        error: createMutation.error,
        reset: createMutation.reset,
      },
      update: {
        mutate: updateMutation.mutate,
        mutateAsync: updateMutation.mutateAsync,
        isPending: updateMutation.isPending,
        isError: updateMutation.isError,
        error: updateMutation.error,
        reset: updateMutation.reset,
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
  }), [employeesQuery.data, employeesQuery.isLoading, employeesQuery.isError, employeesQuery.error, employeesQuery.refetch,
      createMutation.isPending, createMutation.isError, createMutation.error, createMutation.mutate, createMutation.mutateAsync, createMutation.reset,
      updateMutation.isPending, updateMutation.isError, updateMutation.error, updateMutation.mutate, updateMutation.mutateAsync, updateMutation.reset,
      deleteMutation.isPending, deleteMutation.isError, deleteMutation.error, deleteMutation.mutate, deleteMutation.mutateAsync, deleteMutation.reset,
      utils]);
}
