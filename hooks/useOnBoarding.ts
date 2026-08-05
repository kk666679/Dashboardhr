"use client";

import { trpc } from "@/lib/trpc";
import { useMemo } from "react";

/**
 * Onboarding management hook with optimistic updates.
 *
 * Manages onboarding plans, checklists, and tasks.
 * Optimistic updates provide instant UI feedback, rolling back on error.
 *
 * @see server/routers/onboarding.ts for available procedures
 * @see lib/onboarding-service.ts for service layer
 */
export function useOnboarding() {
  const utils = trpc.useUtils();

  // ─── Queries ──────────────────────────────────────────────────────────────

  const listQuery = trpc.onboarding.listChecklists.useQuery(undefined, {
    staleTime: 30_000,
  });

  // getChecklistByEmployee serves as the "detail" getter per employee
  const getByEmployee = (employeeId: string) =>
    trpc.onboarding.getChecklistByEmployee.useQuery({ employeeId }, {
      staleTime: 60_000,
      enabled: !!employeeId,
    });

  // ─── Mutations (with optimistic updates) ─────────────────────────────────

  const createMutation = trpc.onboarding.createChecklist.useMutation({
    onMutate: async (newItem) => {
      await utils.onboarding.listChecklists.cancel();
      const previousList = utils.onboarding.listChecklists.getData();

      utils.onboarding.listChecklists.setData(undefined, (old: any) => [
        ...(old ?? []),
        { ...newItem, id: `temp-${Date.now()}`, createdAt: new Date() } as any,
      ]);

      return { previousList };
    },
    onError: (_err, _newItem, context) => {
      if (context?.previousList) {
        utils.onboarding.listChecklists.setData(undefined, context.previousList);
      }
    },
    onSettled: () => {
      utils.onboarding.listChecklists.invalidate();
    },
  });

  // completeTask mutation
  const completeTaskMutation = trpc.onboarding.completeTask.useMutation({
    onMutate: async (input: { taskId: string; employeeId: string }) => {
      await utils.onboarding.listChecklists.cancel();
      const previousList = utils.onboarding.listChecklists.getData();

      utils.onboarding.listChecklists.setData(undefined, (old: any) =>
        (old ?? []).map((item: any) =>
          item.id === input.employeeId ? { ...item, status: "COMPLETED" } : item,
        ),
      );

      return { previousList };
    },
    onError: (_err, _input, context) => {
      if (context?.previousList) {
        utils.onboarding.listChecklists.setData(undefined, context.previousList);
      }
    },
    onSettled: () => {
      utils.onboarding.listChecklists.invalidate();
    },
  });

  // Note: standalone update/delete mutations are not available on the onboardingRouter.
  // The router provides: getChecklistByEmployee, completeTask, createChecklist, listChecklists, listOverdue

  // ─── Invalidation helpers ────────────────────────────────────────────────

  const invalidate = {
    list: () => utils.onboarding.listChecklists.invalidate(),
    detail: (employeeId: string) => utils.onboarding.getChecklistByEmployee.invalidate({ employeeId }),
    all: async () => {
      await Promise.all([
        utils.onboarding.listChecklists.invalidate(),
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
      getByEmployee,
      create: {
        mutate: createMutation.mutate,
        mutateAsync: createMutation.mutateAsync,
        isPending: createMutation.isPending,
        isError: createMutation.isError,
        error: createMutation.error,
        reset: createMutation.reset,
      },
      completeTask: {
        mutate: completeTaskMutation.mutate,
        mutateAsync: completeTaskMutation.mutateAsync,
        isPending: completeTaskMutation.isPending,
        isError: completeTaskMutation.isError,
        error: completeTaskMutation.error,
        reset: completeTaskMutation.reset,
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
      completeTaskMutation.isPending,
      completeTaskMutation.isError,
      completeTaskMutation.error,
      completeTaskMutation.mutate,
      completeTaskMutation.mutateAsync,
      completeTaskMutation.reset,
      invalidate,
      utils,
    ],
  );
}