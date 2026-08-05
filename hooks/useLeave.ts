"use client";

import { trpc } from "@/lib/trpc";
import { useMemo } from "react";

/**
 * Leave management hook with optimistic updates.
 *
 * Optimistic updates immediately reflect changes in the UI before the server
 * responds, then roll back on error.
 *
 * @see server/routers/leave.ts for available procedures
 */
export function useLeave() {
  const utils = trpc.useUtils();

  // ─── Queries ──────────────────────────────────────────────────────────────

  const listQuery = trpc.leave.list.useQuery(undefined, {
    staleTime: 30_000,
  });

  // Note: No single leave application getter exists on the router.
  // Use list() with filters or listRequests() with employeeId instead.
  const getById = (id: string) =>
    ({ data: null, isLoading: false, isError: false, error: null, refetch: () => {} }) as any;

  const listByEmployee = (employeeId: string) =>
    trpc.leave.listRequests.useQuery({ employeeId }, {
      staleTime: 30_000,
      enabled: !!employeeId,
    });

  const getBalance = (employeeId: string, year?: number) =>
    trpc.leave.balance.useQuery({ employeeId, year }, {
      staleTime: 60_000,
      enabled: !!employeeId,
    });

  const listPolicies = trpc.leave.listPolicies.useQuery(undefined, {
    staleTime: 10 * 60_000,
  });

  const getCalendar = (from: Date, to: Date, employeeId?: string) =>
    trpc.leave.getCalendar.useQuery({ from, to, employeeId }, {
      staleTime: 30_000,
      enabled: !!from && !!to,
    });

  // ─── Mutations (with optimistic updates) ─────────────────────────────────

  const createMutation = trpc.leave.request.useMutation({
    onMutate: async (newLeave) => {
      await utils.leave.list.cancel();
      const previousList = utils.leave.list.getData();

      utils.leave.list.setData(undefined, (old) => [
        ...(old ?? []),
        {
          ...newLeave,
          id: `temp-${Date.now()}`,
          status: "PENDING" as const,
          createdAt: new Date(),
        } as any,
      ]);

      return { previousList };
    },
    onError: (_err, _newLeave, context) => {
      if (context?.previousList) {
        utils.leave.list.setData(undefined, context.previousList);
      }
    },
    onSettled: () => {
      utils.leave.list.invalidate();
    },
  });

  const approveMutation = trpc.leave.approve.useMutation({
    onMutate: async (input: { leaveId: string; comment?: string }) => {
      await utils.leave.list.cancel();
      const previousList = utils.leave.list.getData();

      utils.leave.list.setData(undefined, (old) =>
        (old ?? []).map((item: any) =>
          item.id === input.leaveId
            ? { ...item, status: "APPROVED" as const }
            : item,
        ),
      );

      return { previousList };
    },
    onError: (_err, _input, context) => {
      if (context?.previousList) {
        utils.leave.list.setData(undefined, context.previousList);
      }
    },
    onSettled: () => {
      utils.leave.list.invalidate();
    },
  });

  const rejectMutation = trpc.leave.reject.useMutation({
    onMutate: async (input: { leaveId: string; reason: string }) => {
      await utils.leave.list.cancel();
      const previousList = utils.leave.list.getData();

      utils.leave.list.setData(undefined, (old) =>
        (old ?? []).map((item: any) =>
          item.id === input.leaveId
            ? { ...item, status: "REJECTED" as const, rejectedReason: input.reason }
            : item,
        ),
      );

      return { previousList };
    },
    onError: (_err, _input, context) => {
      if (context?.previousList) {
        utils.leave.list.setData(undefined, context.previousList);
      }
    },
    onSettled: () => {
      utils.leave.list.invalidate();
    },
  });

  const cancelMutation = trpc.leave.cancel.useMutation({
    onMutate: async (input: { leaveId: string }) => {
      await utils.leave.list.cancel();
      const previousList = utils.leave.list.getData();

      utils.leave.list.setData(undefined, (old) =>
        (old ?? []).map((item: any) =>
          item.id === input.leaveId
            ? { ...item, status: "CANCELLED" as const }
            : item,
        ),
      );

      return { previousList };
    },
    onError: (_err, _input, context) => {
      if (context?.previousList) {
        utils.leave.list.setData(undefined, context.previousList);
      }
    },
    onSettled: () => {
      utils.leave.list.invalidate();
    },
  });

  // ─── Invalidation helpers ────────────────────────────────────────────────

  const invalidate = {
    list: () => utils.leave.list.invalidate(),
    balance: (employeeId: string) => utils.leave.balance.invalidate({ employeeId }),
    policies: () => utils.leave.listPolicies.invalidate(),
    all: async () => {
      await Promise.all([
        utils.leave.list.invalidate(),
        utils.leave.listPolicies.invalidate(),
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
      policies: {
        data: listPolicies.data ?? [],
        isLoading: listPolicies.isLoading,
        isError: listPolicies.isError,
        error: listPolicies.error,
        refetch: listPolicies.refetch,
      },
      getById,
      listByEmployee,
      getBalance,
      getCalendar,
      create: {
        mutate: createMutation.mutate,
        mutateAsync: createMutation.mutateAsync,
        isPending: createMutation.isPending,
        isError: createMutation.isError,
        error: createMutation.error,
        reset: createMutation.reset,
      },
      approve: {
        mutate: approveMutation.mutate,
        mutateAsync: approveMutation.mutateAsync,
        isPending: approveMutation.isPending,
        isError: approveMutation.isError,
        error: approveMutation.error,
        reset: approveMutation.reset,
      },
      reject: {
        mutate: rejectMutation.mutate,
        mutateAsync: rejectMutation.mutateAsync,
        isPending: rejectMutation.isPending,
        isError: rejectMutation.isError,
        error: rejectMutation.error,
        reset: rejectMutation.reset,
      },
      cancel: {
        mutate: cancelMutation.mutate,
        mutateAsync: cancelMutation.mutateAsync,
        isPending: cancelMutation.isPending,
        isError: cancelMutation.isError,
        error: cancelMutation.error,
        reset: cancelMutation.reset,
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
      listPolicies.data,
      listPolicies.isLoading,
      listPolicies.isError,
      listPolicies.error,
      listPolicies.refetch,
      createMutation.isPending,
      createMutation.isError,
      createMutation.error,
      createMutation.mutate,
      createMutation.mutateAsync,
      createMutation.reset,
      approveMutation.isPending,
      approveMutation.isError,
      approveMutation.error,
      approveMutation.mutate,
      approveMutation.mutateAsync,
      approveMutation.reset,
      rejectMutation.isPending,
      rejectMutation.isError,
      rejectMutation.error,
      rejectMutation.mutate,
      rejectMutation.mutateAsync,
      rejectMutation.reset,
      cancelMutation.isPending,
      cancelMutation.isError,
      cancelMutation.error,
      cancelMutation.mutate,
      cancelMutation.mutateAsync,
      cancelMutation.reset,
      invalidate,
      utils,
    ],
  );
}