"use client";

import { trpc } from "@/lib/trpc";
import { useKbChat } from "./useKbChat";
import { useCallback, useMemo, useState } from "react";
import type {
  Candidate,
  RecruitmentAnalysis,
} from "@/types";
import type { Expatriate, ExpatStats } from "@/types/expat";

// ─── Empty stats for initial state ──────────────────────────────────────────

const emptyStats: ExpatStats = {
  total: 0,
  active: 0,
  onboarding: 0,
  renewalPending: 0,
};

// ─── Main hook ──────────────────────────────────────────────────────────────

export function useExpatriates(employeeId?: string, tenantId?: string) {
  const utils = trpc.useUtils();

  // ─── tRPC Queries ─────────────────────────────────────────────────────────

  const expatsQuery = trpc.expatriate.list.useQuery(undefined, {
    staleTime: 30_000,
  });

  const getExpatriate = (id: string) =>
    trpc.expatriate.byId.useQuery({ id }, {
      enabled: !!id,
      staleTime: 30_000,
    });

  const candidatesQuery = trpc.recruitment.pipeline.useQuery(undefined, {
    staleTime: 30_000,
  });

  // ─── tRPC Mutations ──────────────────────────────────────────────────────

  const createJDMutation = trpc.recruitment.jdCreate.useMutation({
    onSuccess: () => {
      utils.recruitment.pipeline.invalidate();
    },
  });

  const hrScreenMutation = trpc.agent.hrScreen.useMutation();

  // ─── KBChat (unified orchestrator) ──────────────────────────────────────

  const kbChat = useKbChat({
    employeeId,
    tenantId,
    provider: "claude",
  });

  const {
    messages,
    sendMessage,
    latestResponse,
    latestSuggestions,
    sources,
    isLoading: kbLoading,
    error: kbError,
    clear,
  } = kbChat;

  // ─── Local state for analysis ────────────────────────────────────────────

  const [analysis, setAnalysis] = useState<RecruitmentAnalysis | null>(null);

  // ─── Expatriate‑specific methods ─────────────────────────────────────────

  const visaChecklist = useCallback(
    async (nationality: string, country: string = "Malaysia") => {
      const prompt = `
Generate a detailed visa checklist for a ${nationality} worker relocating to ${country}.
Include:
- Required documents (passport, medical, police clearance, etc.)
- Timeline for each step.
- Estimated costs.
- Processing agencies involved (e.g., Immigration, FOMEMA).
- Common pitfalls and how to avoid them.
`;
      await sendMessage(prompt);
    },
    [sendMessage],
  );

  const renewalAdvice = useCallback(
    async (expatriateId: string) => {
      const expat = expatsQuery.data?.expatriates?.find((e: any) => e.id === expatriateId);
      if (!expat) {
        console.warn("Expatriate not found");
        return;
      }
      const prompt = `
Provide renewal advice for the following expatriate:
Name: ${expat.employee?.name || "Unknown"}
Nationality: ${expat.employee?.nationality || "Unknown"}
Status: ${expat.status}
Visa expiry: ${(expat as any).epExpiry || "Unknown"}

Please include:
- Steps for renewal.
- Documents required.
- Timeline.
- Potential issues.
`;
      await sendMessage(prompt);
    },
    [sendMessage, expatsQuery.data],
  );

  // ─── Recruitment‑specific methods ────────────────────────────────────────

  const runFullPipeline = useCallback(
    async (jdTitle: string) => {
      const candidates: Candidate[] = candidatesQuery.data ?? [];

      const result = await hrScreenMutation.mutateAsync({
        jd: jdTitle,
        candidates,
      });

      const ranked = result.ranked.map((r: any) => ({
        candidateId: r.candidateId,
        score: r.score,
        rank: r.rank,
        shortlisted: r.shortlisted,
        interviewQuestions: r.interviewQuestions ?? [],
      }));

      setAnalysis({ rankings: ranked, summary: result.summary });

      const prompt = `
I have just screened candidates for the job "${jdTitle}".
Summary: ${result.summary}
Top candidates: ${ranked.filter((c: any) => c.shortlisted).map((c: any) => c.candidateId).join(", ")}

Please provide a concise recommendation and next steps.
`;
      await sendMessage(prompt);

      return ranked;
    },
    [candidatesQuery.data, hrScreenMutation, sendMessage],
  );

  const createJD = useCallback(
    async (jdData: Parameters<typeof createJDMutation.mutateAsync>[0]) => {
      const result = await createJDMutation.mutateAsync(jdData);
      const prompt = `
I have just created a new job description:
Title: ${result.title}
Description: ${result.description}

Based on this JD, suggest:
- The best sourcing channels.
- Key skills to look for.
- Potential challenges in the current market.
`;
      await sendMessage(prompt);
      return result;
    },
    [createJDMutation, sendMessage],
  );

  // ─── Derived state ──────────────────────────────────────────────────────

const expatriates = useMemo(
    () => (expatsQuery.data?.expatriates ?? []) as unknown as Expatriate[],
    [expatsQuery.data],
  );

  const stats = useMemo(
    () => (expatsQuery.data?.stats ?? emptyStats) as ExpatStats,
    [expatsQuery.data],
  );

  const candidateSources = useMemo(
    () => sources.filter((src) => src.title?.toLowerCase().includes("candidate") || src.id?.startsWith("cand-")),
    [sources],
  );

  // ─── Return ──────────────────────────────────────────────────────────────

  return {
    // Expatriate data
    expatriates,
    stats,
    getExpatriate,
    isLoading: expatsQuery.isLoading || candidatesQuery.isLoading || kbLoading,
    error: expatsQuery.error?.message ?? candidatesQuery.error?.message ?? kbError,
    refetch: () => {
      expatsQuery.refetch();
      candidatesQuery.refetch();
    },

    // Recruitment data
    candidates: candidatesQuery.data ?? [],
    createJD: {
      mutate: createJDMutation.mutate,
      mutateAsync: createJDMutation.mutateAsync,
      isPending: createJDMutation.isPending,
    },
    runFullPipeline,
    analysis,

    // KBChat
    messages,
    sendMessage,
    clear,
    latestResponse,
    latestSuggestions,
    sources,
    candidateSources,

    // Expatriate actions
    visaChecklist,
    renewalAdvice,

    utils,
  };
}

// ─── Single expatriate hook (convenience) ─────────────────────────────────

export function useExpatriate(id?: string) {
  const query = trpc.expatriate.byId.useQuery(
    { id: id ?? "" },
    { enabled: Boolean(id), retry: false, staleTime: 30_000 },
  );

  return {
    expatriate: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error?.message ?? null,
    refetch: query.refetch,
  };
}