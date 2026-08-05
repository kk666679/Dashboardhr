"use client";

import { trpc } from "@/lib/trpc";
import { useMemo } from "react";

/**
 * Benefits management hook.
 *
 * The `benefitsRouter` exposes flat procedures: listPlans, getPlan, createPlan,
 * updatePlan, enrol, waive, listEnrolments.
 *
 * @see server/routers/benefits.ts for available procedures
 */
export function useBenefits() {
  const utils = trpc.useUtils();

  // ─── Queries ──────────────────────────────────────────────────────────────

  const plansList = trpc.benefits.listPlans.useQuery(undefined, {
    staleTime: 60_000,
  });

  const getPlan = (id: string) =>
    trpc.benefits.getPlan.useQuery({ id }, {
      staleTime: 60_000,
      enabled: !!id,
    });

  const enrolmentsList = trpc.benefits.listEnrolments.useQuery(undefined, {
    staleTime: 60_000,
  });

  // ─── Mutations ──────────────────────────────────────────────────────────

  const createPlanMutation = trpc.benefits.createPlan.useMutation({
    onMutate: async (newItem) => {
      await utils.benefits.listPlans.cancel();
      const previous = utils.benefits.listPlans.getData();

      utils.benefits.listPlans.setData(undefined, (old: any) => [
        ...(old ?? []),
        { ...newItem, id: `temp-${Date.now()}` } as any,
      ]);

      return { previous };
    },
    onError: (_err, _new, context) => {
      if (context?.previous) {
        utils.benefits.listPlans.setData(undefined, context.previous);
      }
    },
    onSettled: () => {
      utils.benefits.listPlans.invalidate();
    },
  });

  const updatePlanMutation = trpc.benefits.updatePlan.useMutation({
    onMutate: async (input: any) => {
      await utils.benefits.listPlans.cancel();
      const previous = utils.benefits.listPlans.getData();

      utils.benefits.listPlans.setData(undefined, (old: any) =>
        (old ?? []).map((item: any) =>
          item.id === input.id ? { ...item, ...input } : item,
        ),
      );

      return { previous };
    },
    onError: (_err, _input, context) => {
      if (context?.previous) {
        utils.benefits.listPlans.setData(undefined, context.previous);
      }
    },
    onSettled: () => {
      utils.benefits.listPlans.invalidate();
    },
  });

  const enrolMutation = trpc.benefits.enrol.useMutation({
    onMutate: async (input: { employeeId: string; planId: string; effectiveDate?: unknown }) => {
      await utils.benefits.listPlans.cancel();
      const previous = utils.benefits.listPlans.getData();

      utils.benefits.listPlans.setData(undefined, (old: any) =>
        (old ?? []).map((item: any) =>
          item.id === input.planId ? { ...item, enrolled: true } : item,
        ),
      );

      return { previous };
    },
    onError: (_err, _input, context) => {
      if (context?.previous) {
        utils.benefits.listPlans.setData(undefined, context.previous);
      }
    },
    onSettled: () => {
      utils.benefits.listPlans.invalidate();
    },
  });

  const waiveMutation = trpc.benefits.waive.useMutation({
    onMutate: async (input: { employeeId: string; planId: string }) => {
      await utils.benefits.listPlans.cancel();
      const previous = utils.benefits.listPlans.getData();

      utils.benefits.listPlans.setData(undefined, (old: any) =>
        (old ?? []).map((item: any) =>
          item.id === input.planId ? { ...item, status: "WAIVED" } : item,
        ),
      );

      return { previous };
    },
    onError: (_err, _input, context) => {
      if (context?.previous) {
        utils.benefits.listPlans.setData(undefined, context.previous);
      }
    },
    onSettled: () => {
      utils.benefits.listPlans.invalidate();
    },
  });

  // ─── Invalidation helpers ────────────────────────────────────────────────

  const invalidate = {
    plans: () => utils.benefits.listPlans.invalidate(),
    enrolments: () => utils.benefits.listEnrolments.invalidate(),
    all: async () => {
      await Promise.all([
        utils.benefits.listPlans.invalidate(),
        utils.benefits.listEnrolments.invalidate(),
      ]);
    },
  };

  // ─── Return ──────────────────────────────────────────────────────────────

  return useMemo(
    () => ({
      plans: {
        list: {
          data: plansList.data ?? [],
          isLoading: plansList.isLoading,
          isError: plansList.isError,
          error: plansList.error,
          refetch: plansList.refetch,
        },
        get: getPlan,
      },
      enrolments: {
        list: {
          data: enrolmentsList.data ?? [],
          isLoading: enrolmentsList.isLoading,
          isError: enrolmentsList.isError,
          error: enrolmentsList.error,
          refetch: enrolmentsList.refetch,
        },
      },
      createPlan: {
        mutate: createPlanMutation.mutate,
        mutateAsync: createPlanMutation.mutateAsync,
        isPending: createPlanMutation.isPending,
        isError: createPlanMutation.isError,
        error: createPlanMutation.error,
        reset: createPlanMutation.reset,
      },
      updatePlan: {
        mutate: updatePlanMutation.mutate,
        mutateAsync: updatePlanMutation.mutateAsync,
        isPending: updatePlanMutation.isPending,
        isError: updatePlanMutation.isError,
        error: updatePlanMutation.error,
        reset: updatePlanMutation.reset,
      },
      enrol: {
        mutate: enrolMutation.mutate,
        mutateAsync: enrolMutation.mutateAsync,
        isPending: enrolMutation.isPending,
        isError: enrolMutation.isError,
        error: enrolMutation.error,
        reset: enrolMutation.reset,
      },
      waive: {
        mutate: waiveMutation.mutate,
        mutateAsync: waiveMutation.mutateAsync,
        isPending: waiveMutation.isPending,
        isError: waiveMutation.isError,
        error: waiveMutation.error,
        reset: waiveMutation.reset,
      },
      invalidate,
      utils,
    }),
    [
      plansList.data,
      plansList.isLoading,
      plansList.isError,
      plansList.error,
      plansList.refetch,
      enrolmentsList.data,
      enrolmentsList.isLoading,
      enrolmentsList.isError,
      enrolmentsList.error,
      enrolmentsList.refetch,
      createPlanMutation.isPending,
      createPlanMutation.isError,
      createPlanMutation.error,
      createPlanMutation.mutate,
      createPlanMutation.mutateAsync,
      createPlanMutation.reset,
      updatePlanMutation.isPending,
      updatePlanMutation.isError,
      updatePlanMutation.error,
      updatePlanMutation.mutate,
      updatePlanMutation.mutateAsync,
      updatePlanMutation.reset,
      enrolMutation.isPending,
      enrolMutation.isError,
      enrolMutation.error,
      enrolMutation.mutate,
      enrolMutation.mutateAsync,
      enrolMutation.reset,
      waiveMutation.isPending,
      waiveMutation.isError,
      waiveMutation.error,
      waiveMutation.mutate,
      waiveMutation.mutateAsync,
      waiveMutation.reset,
      invalidate,
      utils,
    ],
  );
}
