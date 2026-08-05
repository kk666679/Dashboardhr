"use client";

import { trpc } from "@/lib/trpc";
import { useMemo } from "react";

/**
 * Industrial Relations data access hook with optimistic updates.
 *
 * Manages unions, collective bargaining, and disputes.
 * Optimistic updates provide instant UI feedback, rolling back on error.
 *
 * @see server/routers/industrialRelations.ts for available procedures
 */
export function useIndustrialRelations() {
  const utils = trpc.useUtils();

  // ─── Queries ──────────────────────────────────────────────────────────────

  // Unions (type = "UNION")
  const unionsList = trpc.industrialRelations.listCases.useQuery(
    { status: "OPEN" },
    { staleTime: 30_000 },
  );

  const getUnion = (id: string) =>
    trpc.industrialRelations.getCase.useQuery(
      { id },
      { staleTime: 60_000, enabled: !!id },
    );

  // Collective Bargaining (type = "BARGAINING")
  const bargainingList = trpc.industrialRelations.listCases.useQuery(
    undefined,
    { staleTime: 30_000 },
  );

  const getBargaining = (id: string) =>
    trpc.industrialRelations.getCase.useQuery(
      { id },
      { staleTime: 60_000, enabled: !!id },
    );

  // Disputes (type = "DISPUTE")
  const disputesList = trpc.industrialRelations.listCases.useQuery(
    undefined,
    { staleTime: 30_000 },
  );

  const getDispute = (id: string) =>
    trpc.industrialRelations.getCase.useQuery(
      { id },
      { staleTime: 60_000, enabled: !!id },
    );

  // ─── Mutations with optimistic updates ───────────────────────────────────

  // ── Unions ─────────────────────────────────────────────────────────────────

  const createUnionMutation = trpc.industrialRelations.createCase.useMutation({
    onMutate: async (newItem) => {
      await utils.industrialRelations.listCases.cancel();
      const previous = utils.industrialRelations.listCases.getData();

      utils.industrialRelations.listCases.setData(undefined, (old: any) => [
        ...(old ?? []),
        { ...newItem, id: `temp-${Date.now()}`, status: "OPEN", createdAt: new Date() } as any,
      ]);

      return { previous };
    },
    onError: (_err, _new, context) => {
      if (context?.previous) {
        utils.industrialRelations.listCases.setData(undefined, context.previous);
      }
    },
    onSettled: () => {
      utils.industrialRelations.listCases.invalidate();
    },
  });

  const updateUnionMutation = trpc.industrialRelations.updateCase.useMutation({
    onMutate: async (input: { id: string; status?: string; outcome?: string; notes?: string; resolvedDate?: string }) => {
      await utils.industrialRelations.listCases.cancel();
      const previous = utils.industrialRelations.listCases.getData();

      utils.industrialRelations.listCases.setData(undefined, (old: any) =>
        (old ?? []).map((item: any) =>
          item.id === input.id ? { ...item, ...input } : item,
        ),
      );

      return { previous };
    },
    onError: (_err, _input, context) => {
      if (context?.previous) {
        utils.industrialRelations.listCases.setData(undefined, context.previous);
      }
    },
    onSettled: () => {
      utils.industrialRelations.listCases.invalidate();
    },
  });

  const deleteUnionMutation = trpc.industrialRelations.updateCase.useMutation({
    onMutate: async (input: { id: string }) => {
      await utils.industrialRelations.listCases.cancel();
      const previous = utils.industrialRelations.listCases.getData();

      utils.industrialRelations.listCases.setData(undefined, (old: any) =>
        (old ?? []).filter((item: any) => item.id !== input.id),
      );

      return { previous };
    },
    onError: (_err, _input, context) => {
      if (context?.previous) {
        utils.industrialRelations.listCases.setData(undefined, context.previous);
      }
    },
    onSettled: () => {
      utils.industrialRelations.listCases.invalidate();
    },
  });

  // ── Collective Bargaining ─────────────────────────────────────────────────

  const createBargainingMutation = trpc.industrialRelations.createCase.useMutation({
    onMutate: async (newItem) => {
      await utils.industrialRelations.listCases.cancel();
      const previous = utils.industrialRelations.listCases.getData();

      utils.industrialRelations.listCases.setData(undefined, (old: any) => [
        ...(old ?? []),
        { ...newItem, id: `temp-${Date.now()}`, status: "OPEN", createdAt: new Date() } as any,
      ]);

      return { previous };
    },
    onError: (_err, _new, context) => {
      if (context?.previous) {
        utils.industrialRelations.listCases.setData(undefined, context.previous);
      }
    },
    onSettled: () => {
      utils.industrialRelations.listCases.invalidate();
    },
  });

  const updateBargainingMutation = trpc.industrialRelations.updateCase.useMutation({
    onMutate: async (input: { id: string; status?: string; outcome?: string; notes?: string; resolvedDate?: string }) => {
      await utils.industrialRelations.listCases.cancel();
      const previous = utils.industrialRelations.listCases.getData();

      utils.industrialRelations.listCases.setData(undefined, (old: any) =>
        (old ?? []).map((item: any) =>
          item.id === input.id ? { ...item, ...input } : item,
        ),
      );

      return { previous };
    },
    onError: (_err, _input, context) => {
      if (context?.previous) {
        utils.industrialRelations.listCases.setData(undefined, context.previous);
      }
    },
    onSettled: () => {
      utils.industrialRelations.listCases.invalidate();
    },
  });

  const closeBargainingMutation = trpc.industrialRelations.updateCase.useMutation({
    onMutate: async (input: { id: string; status?: string }) => {
      await utils.industrialRelations.listCases.cancel();
      const previous = utils.industrialRelations.listCases.getData();

      utils.industrialRelations.listCases.setData(undefined, (old: any) =>
        (old ?? []).map((item: any) =>
          item.id === input.id ? { ...item, status: "RESOLVED" } : item,
        ),
      );

      return { previous };
    },
    onError: (_err, _input, context) => {
      if (context?.previous) {
        utils.industrialRelations.listCases.setData(undefined, context.previous);
      }
    },
    onSettled: () => {
      utils.industrialRelations.listCases.invalidate();
    },
  });

  // ── Disputes ──────────────────────────────────────────────────────────────

  const createDisputeMutation = trpc.industrialRelations.createCase.useMutation({
    onMutate: async (newItem) => {
      await utils.industrialRelations.listCases.cancel();
      const previous = utils.industrialRelations.listCases.getData();

      utils.industrialRelations.listCases.setData(undefined, (old: any) => [
        ...(old ?? []),
        { ...newItem, id: `temp-${Date.now()}`, status: "OPEN", createdAt: new Date() } as any,
      ]);

      return { previous };
    },
    onError: (_err, _new, context) => {
      if (context?.previous) {
        utils.industrialRelations.listCases.setData(undefined, context.previous);
      }
    },
    onSettled: () => {
      utils.industrialRelations.listCases.invalidate();
    },
  });

  const updateDisputeMutation = trpc.industrialRelations.updateCase.useMutation({
    onMutate: async (input: { id: string; status?: string; outcome?: string; notes?: string; resolvedDate?: string }) => {
      await utils.industrialRelations.listCases.cancel();
      const previous = utils.industrialRelations.listCases.getData();

      utils.industrialRelations.listCases.setData(undefined, (old: any) =>
        (old ?? []).map((item: any) =>
          item.id === input.id ? { ...item, ...input } : item,
        ),
      );

      return { previous };
    },
    onError: (_err, _input, context) => {
      if (context?.previous) {
        utils.industrialRelations.listCases.setData(undefined, context.previous);
      }
    },
    onSettled: () => {
      utils.industrialRelations.listCases.invalidate();
    },
  });

  const resolveDisputeMutation = trpc.industrialRelations.updateCase.useMutation({
    onMutate: async (input: { id: string; status?: string; outcome?: string }) => {
      await utils.industrialRelations.listCases.cancel();
      const previous = utils.industrialRelations.listCases.getData();

      utils.industrialRelations.listCases.setData(undefined, (old: any) =>
        (old ?? []).map((item: any) =>
          item.id === input.id ? { ...item, status: "RESOLVED", outcome: input.outcome } : item,
        ),
      );

      return { previous };
    },
    onError: (_err, _input, context) => {
      if (context?.previous) {
        utils.industrialRelations.listCases.setData(undefined, context.previous);
      }
    },
    onSettled: () => {
      utils.industrialRelations.listCases.invalidate();
    },
  });

  // ─── Invalidation helpers ────────────────────────────────────────────────

  const invalidate = {
    unions: () => utils.industrialRelations.listCases.invalidate(),
    bargaining: () => utils.industrialRelations.listCases.invalidate(),
    disputes: () => utils.industrialRelations.listCases.invalidate(),
    all: async () => {
      await utils.industrialRelations.listCases.invalidate();
    },
  };

  // ─── Return ──────────────────────────────────────────────────────────────

  return useMemo(
    () => ({
      unions: {
        list: {
          data: unionsList.data ?? [],
          isLoading: unionsList.isLoading,
          isError: unionsList.isError,
          error: unionsList.error,
          refetch: unionsList.refetch,
        },
        get: getUnion,
        create: {
          mutate: createUnionMutation.mutate,
          mutateAsync: createUnionMutation.mutateAsync,
          isPending: createUnionMutation.isPending,
          isError: createUnionMutation.isError,
          error: createUnionMutation.error,
          reset: createUnionMutation.reset,
        },
        update: {
          mutate: updateUnionMutation.mutate,
          mutateAsync: updateUnionMutation.mutateAsync,
          isPending: updateUnionMutation.isPending,
          isError: updateUnionMutation.isError,
          error: updateUnionMutation.error,
          reset: updateUnionMutation.reset,
        },
        delete: {
          mutate: deleteUnionMutation.mutate,
          mutateAsync: deleteUnionMutation.mutateAsync,
          isPending: deleteUnionMutation.isPending,
          isError: deleteUnionMutation.isError,
          error: deleteUnionMutation.error,
          reset: deleteUnionMutation.reset,
        },
      },
      bargaining: {
        list: {
          data: bargainingList.data ?? [],
          isLoading: bargainingList.isLoading,
          isError: bargainingList.isError,
          error: bargainingList.error,
          refetch: bargainingList.refetch,
        },
        get: getBargaining,
        create: {
          mutate: createBargainingMutation.mutate,
          mutateAsync: createBargainingMutation.mutateAsync,
          isPending: createBargainingMutation.isPending,
          isError: createBargainingMutation.isError,
          error: createBargainingMutation.error,
          reset: createBargainingMutation.reset,
        },
        update: {
          mutate: updateBargainingMutation.mutate,
          mutateAsync: updateBargainingMutation.mutateAsync,
          isPending: updateBargainingMutation.isPending,
          isError: updateBargainingMutation.isError,
          error: updateBargainingMutation.error,
          reset: updateBargainingMutation.reset,
        },
        close: {
          mutate: closeBargainingMutation.mutate,
          mutateAsync: closeBargainingMutation.mutateAsync,
          isPending: closeBargainingMutation.isPending,
          isError: closeBargainingMutation.isError,
          error: closeBargainingMutation.error,
          reset: closeBargainingMutation.reset,
        },
      },
      disputes: {
        list: {
          data: disputesList.data ?? [],
          isLoading: disputesList.isLoading,
          isError: disputesList.isError,
          error: disputesList.error,
          refetch: disputesList.refetch,
        },
        get: getDispute,
        create: {
          mutate: createDisputeMutation.mutate,
          mutateAsync: createDisputeMutation.mutateAsync,
          isPending: createDisputeMutation.isPending,
          isError: createDisputeMutation.isError,
          error: createDisputeMutation.error,
          reset: createDisputeMutation.reset,
        },
        update: {
          mutate: updateDisputeMutation.mutate,
          mutateAsync: updateDisputeMutation.mutateAsync,
          isPending: updateDisputeMutation.isPending,
          isError: updateDisputeMutation.isError,
          error: updateDisputeMutation.error,
          reset: updateDisputeMutation.reset,
        },
        resolve: {
          mutate: resolveDisputeMutation.mutate,
          mutateAsync: resolveDisputeMutation.mutateAsync,
          isPending: resolveDisputeMutation.isPending,
          isError: resolveDisputeMutation.isError,
          error: resolveDisputeMutation.error,
          reset: resolveDisputeMutation.reset,
        },
      },
      invalidate,
      utils,
    }),
    [
      unionsList.data,
      unionsList.isLoading,
      unionsList.isError,
      unionsList.error,
      unionsList.refetch,
      bargainingList.data,
      bargainingList.isLoading,
      bargainingList.isError,
      bargainingList.error,
      bargainingList.refetch,
      disputesList.data,
      disputesList.isLoading,
      disputesList.isError,
      disputesList.error,
      disputesList.refetch,
      createUnionMutation.isPending,
      createUnionMutation.isError,
      createUnionMutation.error,
      createUnionMutation.mutate,
      createUnionMutation.mutateAsync,
      createUnionMutation.reset,
      updateUnionMutation.isPending,
      updateUnionMutation.isError,
      updateUnionMutation.error,
      updateUnionMutation.mutate,
      updateUnionMutation.mutateAsync,
      updateUnionMutation.reset,
      deleteUnionMutation.isPending,
      deleteUnionMutation.isError,
      deleteUnionMutation.error,
      deleteUnionMutation.mutate,
      deleteUnionMutation.mutateAsync,
      deleteUnionMutation.reset,
      createBargainingMutation.isPending,
      createBargainingMutation.isError,
      createBargainingMutation.error,
      createBargainingMutation.mutate,
      createBargainingMutation.mutateAsync,
      createBargainingMutation.reset,
      updateBargainingMutation.isPending,
      updateBargainingMutation.isError,
      updateBargainingMutation.error,
      updateBargainingMutation.mutate,
      updateBargainingMutation.mutateAsync,
      updateBargainingMutation.reset,
      closeBargainingMutation.isPending,
      closeBargainingMutation.isError,
      closeBargainingMutation.error,
      closeBargainingMutation.mutate,
      closeBargainingMutation.mutateAsync,
      closeBargainingMutation.reset,
      createDisputeMutation.isPending,
      createDisputeMutation.isError,
      createDisputeMutation.error,
      createDisputeMutation.mutate,
      createDisputeMutation.mutateAsync,
      createDisputeMutation.reset,
      updateDisputeMutation.isPending,
      updateDisputeMutation.isError,
      updateDisputeMutation.error,
      updateDisputeMutation.mutate,
      updateDisputeMutation.mutateAsync,
      updateDisputeMutation.reset,
      resolveDisputeMutation.isPending,
      resolveDisputeMutation.isError,
      resolveDisputeMutation.error,
      resolveDisputeMutation.mutate,
      resolveDisputeMutation.mutateAsync,
      resolveDisputeMutation.reset,
      invalidate,
      utils,
    ],
  );
}

