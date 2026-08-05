"use client";

import { trpc } from "@/lib/trpc";
import { useMemo } from "react";
import { safeQuery, safeQueryArray, safeMutation } from "./safe";

export function useCompensation() {
  const compensation = trpc.compensation;

  const bands = useMemo(() => ({
    list: safeQueryArray(compensation?.listBands?.useQuery),
    upsert: safeMutation(compensation?.upsertBand?.useMutation),
  }), [compensation]);

  const records = useMemo(() => ({
    getHistory: safeQueryArray(compensation?.getHistory?.useQuery),
    create: safeMutation(compensation?.createRecord?.useMutation),
    getCurrent: safeQuery(compensation?.getCurrent?.useQuery),
    getCompaRatioReport: safeQueryArray(compensation?.getCompaRatioReport?.useQuery),
  }), [compensation]);

  return { bands, records };
}
