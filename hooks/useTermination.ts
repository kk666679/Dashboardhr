"use client";

import { trpc } from "@/lib/trpc";
import { useMemo } from "react";
import { safeQuery, safeQueryArray, safeMutation } from "./safe";

export function useTermination() {
  const termination = trpc.termination;

  const cases = useMemo(() => {
    return {
      getAll: safeQueryArray(termination?.getTerminations?.useQuery),
      getById: safeQuery(termination?.getById?.useQuery),
      create: safeMutation(termination?.createTermination?.useMutation),
    };
  }, [termination]);

  return { cases };
}
