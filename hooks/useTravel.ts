"use client";

import { trpc } from "@/lib/trpc";
import { useMemo } from "react";

/**
 * Travel & Expense management hooks.
 * Server router key: `travel`
 */
export function useTravel() {
  const utils = trpc.useUtils();

  // The travel router exposes flat procedures: list, getById, submit, approve, reject, cancel
  // No sub-routers for request/expense/policy exist.

  // ─── Travel Request Queries ────────────────────────────────────────────
  const listQuery = trpc.travel.list.useQuery(undefined, {
    staleTime: 60_000,
  });
  const getById = (id: string) =>
    trpc.travel.getById.useQuery({ id }, {
      staleTime: 60_000,
      enabled: !!id,
    });

  // ─── Travel Request Mutations ─────────────────────────────────────────
  const submitMutation = trpc.travel.submit.useMutation({
    onSuccess: () => utils.travel.list.invalidate(),
  });
  const approveMutation = trpc.travel.approve.useMutation({
    onSuccess: () => utils.travel.list.invalidate(),
  });
  const rejectMutation = trpc.travel.reject.useMutation({
    onSuccess: () => utils.travel.list.invalidate(),
  });
  const cancelMutation = trpc.travel.cancel.useMutation({
    onSuccess: () => utils.travel.list.invalidate(),
  });

  // ─── Invalidation Helpers ─────────────────────────────────────────────
  const invalidate = {
    list: () => utils.travel.list.invalidate(),
    all: async () => {
      await utils.travel.list.invalidate();
    },
  };

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
      submit: {
        mutate: submitMutation.mutate,
        mutateAsync: submitMutation.mutateAsync,
        isPending: submitMutation.isPending,
        isError: submitMutation.isError,
        error: submitMutation.error,
        reset: submitMutation.reset,
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
      listQuery.data, listQuery.isLoading, listQuery.isError, listQuery.error, listQuery.refetch,
      submitMutation.isPending, submitMutation.isError, submitMutation.error,
      submitMutation.mutate, submitMutation.mutateAsync, submitMutation.reset,
      approveMutation.isPending, approveMutation.isError, approveMutation.error,
      approveMutation.mutate, approveMutation.mutateAsync, approveMutation.reset,
      rejectMutation.isPending, rejectMutation.isError, rejectMutation.error,
      rejectMutation.mutate, rejectMutation.mutateAsync, rejectMutation.reset,
      cancelMutation.isPending, cancelMutation.isError, cancelMutation.error,
      cancelMutation.mutate, cancelMutation.mutateAsync, cancelMutation.reset,
      invalidate,
      utils,
    ]
  );
}
