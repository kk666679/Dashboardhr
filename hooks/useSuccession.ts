"use client";

import { trpc } from "@/lib/trpc";
import { useMemo } from "react";
import { safeQuery, safeQueryArray, safeMutation } from "./safe";

// Type definitions for the succession module
interface Position {
  id: string;
  title: string;
  department?: string;
  level?: string;
  [key: string]: unknown;
}

interface Successor {
  id: string;
  positionId: string;
  employeeId: string;
  rank?: number;
  [key: string]: unknown;
}

interface Readiness {
  id: string;
  positionId: string;
  employeeId: string;
  readinessLevel?: number;
  [key: string]: unknown;
}

interface Bench {
  id: string;
  positionId: string;
  employeeId: string;
  [key: string]: unknown;
}

interface DevPlan {
  id: string;
  positionId: string;
  employeeId: string;
  tasks?: DevTask[];
  [key: string]: unknown;
}

interface DevTask {
  id: string;
  description: string;
  completed: boolean;
  [key: string]: unknown;
}

interface NineBox {
  id: string;
  employeeId: string;
  performance?: number;
  potential?: number;
  [key: string]: unknown;
}

export function useSuccession() {
  const succession = trpc.succession as any;

  const positions = useMemo(() => ({
    getAll: safeQueryArray(succession?.position?.list?.useQuery),
    getById: safeQuery(succession?.position?.get?.useQuery),
    create: safeMutation(succession?.position?.create?.useMutation),
    update: safeMutation(succession?.position?.update?.useMutation),
    delete: safeMutation(succession?.position?.delete?.useMutation),
  }), [succession]);

  const successors = useMemo(() => ({
    getByPosition: safeQueryArray(succession?.successor?.getByPosition?.useQuery),
    assign: safeMutation(succession?.successor?.assign?.useMutation),
    updateRank: safeMutation(succession?.successor?.updateRank?.useMutation),
    remove: safeMutation(succession?.successor?.remove?.useMutation),
    reorder: safeMutation(succession?.successor?.reorder?.useMutation),
  }), [succession]);

  const readiness = useMemo(() => ({
    getByPosition: safeQueryArray(succession?.readiness?.getByPosition?.useQuery),
    create: safeMutation(succession?.readiness?.create?.useMutation),
    update: safeMutation(succession?.readiness?.update?.useMutation),
    getHistory: safeQueryArray(succession?.readiness?.getHistory?.useQuery),
  }), [succession]);

  const bench = useMemo(() => ({
    getSnapshot: safeQuery(succession?.bench?.getSnapshot?.useQuery),
    getHistory: safeQueryArray(succession?.bench?.getHistory?.useQuery),
    refresh: safeMutation(succession?.bench?.refresh?.useMutation),
  }), [succession]);

  const devPlans = useMemo(() => ({
    getAll: safeQueryArray(succession?.devPlan?.list?.useQuery),
    getById: safeQuery(succession?.devPlan?.get?.useQuery),
    create: safeMutation(succession?.devPlan?.create?.useMutation),
    update: safeMutation(succession?.devPlan?.update?.useMutation),
    delete: safeMutation(succession?.devPlan?.delete?.useMutation),
    addTask: safeMutation(succession?.devPlan?.addTask?.useMutation),
    completeTask: safeMutation(succession?.devPlan?.completeTask?.useMutation),
  }), [succession]);

  const nineBox = useMemo(() => ({
    getAll: safeQueryArray(succession?.nineBox?.list?.useQuery),
    create: safeMutation(succession?.nineBox?.create?.useMutation),
    update: safeMutation(succession?.nineBox?.update?.useMutation),
    getMatrix: safeQuery(succession?.nineBox?.getMatrix?.useQuery),
  }), [succession]);

  return {
    positions,
    successors,
    readiness,
    bench,
    devPlans,
    nineBox,
  };
}

