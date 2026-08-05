"use client";

import { trpc } from "@/lib/trpc";
import { useMemo } from "react";

/**
 * Employee Relations hook with optimistic updates.
 *
 * Manages grievances, conduct issues, and disciplinary actions.
 * Optimistic updates provide instant UI feedback, rolling back on error.
 *
 * @see server/routers/employeeRelations.ts for available procedures
 */
export function useEmployeeRelations() {
  const utils = trpc.useUtils();

  // ─── Queries ──────────────────────────────────────────────────────────────

  // Grievances (type = "GRIEVANCE")
  const grievancesList = trpc.er.listCases.useQuery(
    { type: "GRIEVANCE" },
    { staleTime: 30_000 },
  );

  const getGrievance = (id: string) =>
    trpc.er.getCase.useQuery(
      { id },
      { staleTime: 60_000, enabled: !!id },
    );

  // Conduct Issues (type = "COMPLAINT")
  const conductList = trpc.er.listCases.useQuery(
    { type: "COMPLAINT" },
    { staleTime: 30_000 },
  );

  const getConduct = (id: string) =>
    trpc.er.getCase.useQuery(
      { id },
      { staleTime: 60_000, enabled: !!id },
    );

  // Disciplinary Actions (type = "DISCIPLINARY")
  const disciplinaryList = trpc.er.listCases.useQuery(
    { type: "DISCIPLINARY" },
    { staleTime: 30_000 },
  );

  const getDisciplinary = (id: string) =>
    trpc.er.getCase.useQuery(
      { id },
      { staleTime: 60_000, enabled: !!id },
    );

  // ─── Mutations with optimistic updates ───────────────────────────────────

  // ── Grievances ─────────────────────────────────────────────────────────────

  const createGrievanceMutation = trpc.er.createGrievance.useMutation({
    onMutate: async (newItem) => {
      await utils.er.listCases.cancel();
      const previous = utils.er.listCases.getData({ type: "GRIEVANCE" });

      utils.er.listCases.setData({ type: "GRIEVANCE" }, (old: any) => [
        ...(old ?? []),
        { ...newItem, id: `temp-${Date.now()}`, status: "OPEN", createdAt: new Date() } as any,
      ]);

      return { previous };
    },
    onError: (_err, _new, context) => {
      if (context?.previous) {
        utils.er.listCases.setData({ type: "GRIEVANCE" }, context.previous);
      }
    },
    onSettled: () => {
      utils.er.listCases.invalidate();
    },
  });

  const updateGrievanceMutation = trpc.er.updateStatus.useMutation({
    onMutate: async (input: any) => {
      if (!input) return {};
      await utils.er.listCases.cancel();
      const previous = utils.er.listCases.getData({ type: "GRIEVANCE" });

      utils.er.listCases.setData({ type: "GRIEVANCE" }, (old: any) =>
        (old ?? []).map((item: any) =>
          item.id === input.id
            ? { ...item, status: input.status, ...(input.resolution ? { resolution: input.resolution } : {}) }
            : item,
        ),
      );

      return { previous };
    },
    onError: (_err, _input, context) => {
      if (context?.previous) {
        utils.er.listCases.setData({ type: "GRIEVANCE" }, context.previous);
      }
    },
    onSettled: () => {
      utils.er.listCases.invalidate();
    },
  });

  const resolveGrievanceMutation = trpc.er.updateStatus.useMutation({
    onMutate: async (input: any) => {
      if (!input) return {};
      await utils.er.listCases.cancel();
      const previous = utils.er.listCases.getData({ type: "GRIEVANCE" });

      utils.er.listCases.setData({ type: "GRIEVANCE" }, (old: any) =>
        (old ?? []).map((item: any) =>
          item.id === input.id ? { ...item, status: "RESOLVED", resolution: input.resolution } : item,
        ),
      );

      return { previous };
    },
    onError: (_err, _input, context) => {
      if (context?.previous) {
        utils.er.listCases.setData({ type: "GRIEVANCE" }, context.previous);
      }
    },
    onSettled: () => {
      utils.er.listCases.invalidate();
    },
  });

  const escalateGrievanceMutation = trpc.er.updateStatus.useMutation({
    onMutate: async (input: any) => {
      if (!input) return {};
      await utils.er.listCases.cancel();
      const previous = utils.er.listCases.getData({ type: "GRIEVANCE" });

      utils.er.listCases.setData({ type: "GRIEVANCE" }, (old: any) =>
        (old ?? []).map((item: any) =>
          item.id === input.id ? { ...item, status: "ESCALATED", escalationReason: input.resolution } : item,
        ),
      );

      return { previous };
    },
    onError: (_err, _input, context) => {
      if (context?.previous) {
        utils.er.listCases.setData({ type: "GRIEVANCE" }, context.previous);
      }
    },
    onSettled: () => {
      utils.er.listCases.invalidate();
    },
  });

  // ── Conduct Issues ────────────────────────────────────────────────────────

  const createConductMutation = trpc.er.createComplaint.useMutation({
    onMutate: async (newItem) => {
      await utils.er.listCases.cancel();
      const previous = utils.er.listCases.getData({ type: "COMPLAINT" });

      utils.er.listCases.setData({ type: "COMPLAINT" }, (old: any) => [
        ...(old ?? []),
        { ...newItem, id: `temp-${Date.now()}`, status: "OPEN", createdAt: new Date() } as any,
      ]);

      return { previous };
    },
    onError: (_err, _new, context) => {
      if (context?.previous) {
        utils.er.listCases.setData({ type: "COMPLAINT" }, context.previous);
      }
    },
    onSettled: () => {
      utils.er.listCases.invalidate();
    },
  });

  const updateConductMutation = trpc.er.updateStatus.useMutation({
    onMutate: async (input: any) => {
      if (!input) return {};
      await utils.er.listCases.cancel();
      const previous = utils.er.listCases.getData({ type: "COMPLAINT" });

      utils.er.listCases.setData({ type: "COMPLAINT" }, (old: any) =>
        (old ?? []).map((item: any) =>
          item.id === input.id
            ? { ...item, status: input.status, ...(input.resolution ? { resolution: input.resolution } : {}) }
            : item,
        ),
      );

      return { previous };
    },
    onError: (_err, _input, context) => {
      if (context?.previous) {
        utils.er.listCases.setData({ type: "COMPLAINT" }, context.previous);
      }
    },
    onSettled: () => {
      utils.er.listCases.invalidate();
    },
  });

  // ── Disciplinary Actions ─────────────────────────────────────────────────

  const createDisciplinaryMutation = trpc.er.createDisciplinary.useMutation({
    onMutate: async (newItem) => {
      await utils.er.listCases.cancel();
      const previous = utils.er.listCases.getData({ type: "DISCIPLINARY" });

      utils.er.listCases.setData({ type: "DISCIPLINARY" }, (old: any) => [
        ...(old ?? []),
        { ...newItem, id: `temp-${Date.now()}`, status: "OPEN", createdAt: new Date() } as any,
      ]);

      return { previous };
    },
    onError: (_err, _new, context) => {
      if (context?.previous) {
        utils.er.listCases.setData({ type: "DISCIPLINARY" }, context.previous);
      }
    },
    onSettled: () => {
      utils.er.listCases.invalidate();
    },
  });

  const updateDisciplinaryMutation = trpc.er.updateStatus.useMutation({
    onMutate: async (input: any) => {
      if (!input) return {};
      await utils.er.listCases.cancel();
      const previous = utils.er.listCases.getData({ type: "DISCIPLINARY" });

      utils.er.listCases.setData({ type: "DISCIPLINARY" }, (old: any) =>
        (old ?? []).map((item: any) =>
          item.id === input.id
            ? { ...item, status: input.status, ...(input.resolution ? { resolution: input.resolution } : {}) }
            : item,
        ),
      );

      return { previous };
    },
    onError: (_err, _input, context) => {
      if (context?.previous) {
        utils.er.listCases.setData({ type: "DISCIPLINARY" }, context.previous);
      }
    },
    onSettled: () => {
      utils.er.listCases.invalidate();
    },
  });

  const cancelDisciplinaryMutation = trpc.er.updateStatus.useMutation({
    onMutate: async (input: any) => {
      if (!input) return {};
      await utils.er.listCases.cancel();
      const previous = utils.er.listCases.getData({ type: "DISCIPLINARY" });

      utils.er.listCases.setData({ type: "DISCIPLINARY" }, (old: any) =>
        (old ?? []).map((item: any) =>
          item.id === input.id ? { ...item, status: "CLOSED" } : item,
        ),
      );

      return { previous };
    },
    onError: (_err, _input, context) => {
      if (context?.previous) {
        utils.er.listCases.setData({ type: "DISCIPLINARY" }, context.previous);
      }
    },
    onSettled: () => {
      utils.er.listCases.invalidate();
    },
  });

  // ─── Invalidation helpers ────────────────────────────────────────────────

  const invalidate = {
    grievances: () => utils.er.listCases.invalidate(),
    conduct: () => utils.er.listCases.invalidate(),
    disciplinary: () => utils.er.listCases.invalidate(),
    all: async () => {
      await utils.er.listCases.invalidate();
    },
  };

  // ─── Return ──────────────────────────────────────────────────────────────

  return useMemo(
    () => ({
      grievances: {
        list: {
          data: grievancesList.data ?? [],
          isLoading: grievancesList.isLoading,
          isError: grievancesList.isError,
          error: grievancesList.error,
          refetch: grievancesList.refetch,
        },
        get: getGrievance,
        create: {
          mutate: createGrievanceMutation.mutate,
          mutateAsync: createGrievanceMutation.mutateAsync,
          isPending: createGrievanceMutation.isPending,
          isError: createGrievanceMutation.isError,
          error: createGrievanceMutation.error,
          reset: createGrievanceMutation.reset,
        },
        update: {
          mutate: updateGrievanceMutation.mutate,
          mutateAsync: updateGrievanceMutation.mutateAsync,
          isPending: updateGrievanceMutation.isPending,
          isError: updateGrievanceMutation.isError,
          error: updateGrievanceMutation.error,
          reset: updateGrievanceMutation.reset,
        },
        resolve: {
          mutate: resolveGrievanceMutation.mutate,
          mutateAsync: resolveGrievanceMutation.mutateAsync,
          isPending: resolveGrievanceMutation.isPending,
          isError: resolveGrievanceMutation.isError,
          error: resolveGrievanceMutation.error,
          reset: resolveGrievanceMutation.reset,
        },
        escalate: {
          mutate: escalateGrievanceMutation.mutate,
          mutateAsync: escalateGrievanceMutation.mutateAsync,
          isPending: escalateGrievanceMutation.isPending,
          isError: escalateGrievanceMutation.isError,
          error: escalateGrievanceMutation.error,
          reset: escalateGrievanceMutation.reset,
        },
      },
      conduct: {
        list: {
          data: conductList.data ?? [],
          isLoading: conductList.isLoading,
          isError: conductList.isError,
          error: conductList.error,
          refetch: conductList.refetch,
        },
        get: getConduct,
        create: {
          mutate: createConductMutation.mutate,
          mutateAsync: createConductMutation.mutateAsync,
          isPending: createConductMutation.isPending,
          isError: createConductMutation.isError,
          error: createConductMutation.error,
          reset: createConductMutation.reset,
        },
        update: {
          mutate: updateConductMutation.mutate,
          mutateAsync: updateConductMutation.mutateAsync,
          isPending: updateConductMutation.isPending,
          isError: updateConductMutation.isError,
          error: updateConductMutation.error,
          reset: updateConductMutation.reset,
        },
      },
      disciplinary: {
        list: {
          data: disciplinaryList.data ?? [],
          isLoading: disciplinaryList.isLoading,
          isError: disciplinaryList.isError,
          error: disciplinaryList.error,
          refetch: disciplinaryList.refetch,
        },
        get: getDisciplinary,
        create: {
          mutate: createDisciplinaryMutation.mutate,
          mutateAsync: createDisciplinaryMutation.mutateAsync,
          isPending: createDisciplinaryMutation.isPending,
          isError: createDisciplinaryMutation.isError,
          error: createDisciplinaryMutation.error,
          reset: createDisciplinaryMutation.reset,
        },
        update: {
          mutate: updateDisciplinaryMutation.mutate,
          mutateAsync: updateDisciplinaryMutation.mutateAsync,
          isPending: updateDisciplinaryMutation.isPending,
          isError: updateDisciplinaryMutation.isError,
          error: updateDisciplinaryMutation.error,
          reset: updateDisciplinaryMutation.reset,
        },
        cancel: {
          mutate: cancelDisciplinaryMutation.mutate,
          mutateAsync: cancelDisciplinaryMutation.mutateAsync,
          isPending: cancelDisciplinaryMutation.isPending,
          isError: cancelDisciplinaryMutation.isError,
          error: cancelDisciplinaryMutation.error,
          reset: cancelDisciplinaryMutation.reset,
        },
      },
      invalidate,
      utils,
    }),
    [
      grievancesList.data,
      grievancesList.isLoading,
      grievancesList.isError,
      grievancesList.error,
      grievancesList.refetch,
      conductList.data,
      conductList.isLoading,
      conductList.isError,
      conductList.error,
      conductList.refetch,
      disciplinaryList.data,
      disciplinaryList.isLoading,
      disciplinaryList.isError,
      disciplinaryList.error,
      disciplinaryList.refetch,
      createGrievanceMutation.isPending,
      createGrievanceMutation.isError,
      createGrievanceMutation.error,
      createGrievanceMutation.mutate,
      createGrievanceMutation.mutateAsync,
      createGrievanceMutation.reset,
      updateGrievanceMutation.isPending,
      updateGrievanceMutation.isError,
      updateGrievanceMutation.error,
      updateGrievanceMutation.mutate,
      updateGrievanceMutation.mutateAsync,
      updateGrievanceMutation.reset,
      resolveGrievanceMutation.isPending,
      resolveGrievanceMutation.isError,
      resolveGrievanceMutation.error,
      resolveGrievanceMutation.mutate,
      resolveGrievanceMutation.mutateAsync,
      resolveGrievanceMutation.reset,
      escalateGrievanceMutation.isPending,
      escalateGrievanceMutation.isError,
      escalateGrievanceMutation.error,
      escalateGrievanceMutation.mutate,
      escalateGrievanceMutation.mutateAsync,
      escalateGrievanceMutation.reset,
      createConductMutation.isPending,
      createConductMutation.isError,
      createConductMutation.error,
      createConductMutation.mutate,
      createConductMutation.mutateAsync,
      createConductMutation.reset,
      updateConductMutation.isPending,
      updateConductMutation.isError,
      updateConductMutation.error,
      updateConductMutation.mutate,
      updateConductMutation.mutateAsync,
      updateConductMutation.reset,
      createDisciplinaryMutation.isPending,
      createDisciplinaryMutation.isError,
      createDisciplinaryMutation.error,
      createDisciplinaryMutation.mutate,
      createDisciplinaryMutation.mutateAsync,
      createDisciplinaryMutation.reset,
      updateDisciplinaryMutation.isPending,
      updateDisciplinaryMutation.isError,
      updateDisciplinaryMutation.error,
      updateDisciplinaryMutation.mutate,
      updateDisciplinaryMutation.mutateAsync,
      updateDisciplinaryMutation.reset,
      cancelDisciplinaryMutation.isPending,
      cancelDisciplinaryMutation.isError,
      cancelDisciplinaryMutation.error,
      cancelDisciplinaryMutation.mutate,
      cancelDisciplinaryMutation.mutateAsync,
      cancelDisciplinaryMutation.reset,
      invalidate,
      utils,
    ],
  );
}
