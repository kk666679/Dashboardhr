"use client";

import { trpc } from "@/lib/trpc";
import { useMemo } from "react";

/**
 * Audit Trail data access hook.
 * Server router key: `auditTrail`
 *
 * @see server/routers/auditTrail.ts
 */
export function useAuditTrail() {
  const utils = trpc.useUtils();

  const list = trpc.auditTrail.list.useQuery({ take: 100 }, { staleTime: 60_000 });
  const getByEntity = (entityType: string, entityId: string) =>
    trpc.auditTrail.getByEntity.useQuery({ entityType, entityId }, { staleTime: 60_000, enabled: !!entityType && !!entityId });
  const getSummary = trpc.auditTrail.getSummary.useQuery(undefined, { staleTime: 60_000 });

  return useMemo(() => ({ list, getByEntity, getSummary, utils }), [
    list.data, list.isLoading, getSummary.data, getSummary.isLoading, utils,
  ]);
}
