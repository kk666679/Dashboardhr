"use client";

import { trpc } from "@/lib/trpc";
import { useMemo } from "react";
import { safeQuery, safeQueryArray, safeMutation } from "./safe";

export function useZakat() {
  const zakat = trpc.zakat;

  const records = useMemo(() => ({
    getAll: safeQueryArray(zakat?.getAll?.useQuery),
    getById: safeQuery(zakat?.getById?.useQuery),
    create: safeMutation(zakat?.create?.useMutation),
    update: safeMutation(zakat?.update?.useMutation),
    delete: safeMutation(zakat?.delete?.useMutation),
  }), [zakat]);

  const eligibility = useMemo(() => ({
    getAll: safeQueryArray(zakat?.eligibility?.getAll?.useQuery),
    calculate: safeMutation(zakat?.eligibility?.calculate?.useMutation),
  }), [zakat]);

  const payments = useMemo(() => ({
    getAll: safeQueryArray(zakat?.payment?.getAll?.useQuery),
    create: safeMutation(zakat?.payment?.create?.useMutation),
    verify: safeMutation(zakat?.payment?.verify?.useMutation),
  }), [zakat]);

  const settings = useMemo(() => ({
    get: safeQuery(zakat?.settings?.get?.useQuery),
    update: safeMutation(zakat?.settings?.update?.useMutation),
  }), [zakat]);

  const report = useMemo(() => ({
    generate: safeMutation(zakat?.report?.generate?.useMutation),
  }), [zakat]);

  return { records, eligibility, payments, settings, report };
}
