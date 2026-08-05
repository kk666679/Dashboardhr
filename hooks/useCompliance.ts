"use client";

import { trpc } from "@/lib/trpc";
import { useHrOrchestrator } from './useHrOrchestrator';
import { useCallback } from 'react';

export function useComplianceAgent(employeeId?: string) {
  const complianceQuery = trpc.compliance.check.useQuery(
    { employeeId: employeeId ?? '' },
    { enabled: Boolean(employeeId) },
  );

  const orchestrator = useHrOrchestrator({ provider: "claude" });
  const { messages, sendMessage } = orchestrator;

  const generateChecklist = useCallback(async (sector: string) => {
    const context = `Malaysian compliance for ${sector}: FOMEMA, levy.`;
    await sendMessage(context);
  }, [sendMessage]);

  return {
    ...orchestrator,
    complianceQuery,
    generateChecklist,
  };
}
