"use client";

import { trpc } from "@/lib/trpc";
import { useMemo } from "react";
import { safeQuery, safeQueryArray, safeMutation } from "./safe";

export function useForeignWorker() {
  const fw = trpc.foreignWorker;

  const workers = useMemo(() => ({
    getAll: safeQueryArray(fw?.getAll?.useQuery),
    getById: safeQuery(fw?.getById?.useQuery),
    create: safeMutation(fw?.save?.useMutation),
    update: safeMutation(fw?.save?.useMutation),
    delete: safeMutation(fw?.delete?.useMutation),
  }), [fw]);

  const permits = useMemo(() => ({
    getByWorker: safeQueryArray(fw?.getById?.useQuery),
    create: safeMutation(fw?.save?.useMutation),
    update: safeMutation(fw?.save?.useMutation),
  }), [fw]);

  return { workers, permits };
}
