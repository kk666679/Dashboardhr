"use client";

import { trpc } from "@/lib/trpc";
import { useMemo } from "react";

/**
 * Offboarding management hook with optimistic updates.
 *
 * Manages employee terminations and offboarding processes.
 * Optimistic updates provide instant UI feedback, rolling back on error.
 *
 * @see server/routers/termination.ts for available procedures
 */
export function useOffboarding() {
  const utils = trpc.useUtils();

  // ─── Queries ──────────────────────────────────────────────────────────────

  const listQuery = trpc.termination.getTerminations.useQuery(undefined, {
    staleTime: 30_000,
  });

  const getById = (id: string) =>
    trpc.termination.getById.useQuery({ id }, {
      staleTime: 60_000,
      enabled: !!id,
    });

  // ─── Mutations (with optimistic updates) ─────────────────────────────────

  const createMutation = trpc.termination.createTermination.useMutation({
    onMutate: async (newItem) => {
      await utils.termination.getTerminations.cancel();
      const previousList = utils.termination.getTerminations.getData();

      utils.termination.getTerminations.setData(undefined, (old: any) => [
        ...(old ?? []),
        { ...newItem, id: `temp-${Date.now()}`, createdAt: new Date() } as any,
      ]);

      return { previousList };
    },
    onError: (_err, _newItem, context) => {
      if (context?.previousList) {
        utils.termination.getTerminations.setData(undefined, context.previousList);
      }
    },
    onSettled: () => {
      utils.termination.getTerminations.invalidate();
    },
  });

  // Note: update/delete mutations are not available on the terminationRouter.
  // The router only provides: getTerminations, getById, createTermination

  // ─── Invalidation helpers ────────────────────────────────────────────────

  const invalidate = {
    list: () => utils.termination.getTerminations.invalidate(),
    detail: (id: string) => utils.termination.getById.invalidate({ id }),
    all: async () => {
      await Promise.all([
        utils.termination.getTerminations.invalidate(),
      ]);
    },
  };

  // ─── Return ──────────────────────────────────────────────────────────────

  return useMemo(
    () => ({
      list: {
        data: listQuery.data ?? [],
        isLoading: listQuery.isLoading,
        isError: listQuery.isError,
        error: listQuery.error,
        refetch: listQuery.refetch,
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
      invalidate,
      utils,
    }),
    [
      listQuery.data,
      listQuery.isLoading,
      listQuery.isError,
      listQuery.error,
      listQuery.refetch,
      createMutation.isPending,
      createMutation.isError,
      createMutation.error,
      createMutation.mutate,
      createMutation.mutateAsync,
      createMutation.reset,
      invalidate,
      utils,
    ],
  );
}