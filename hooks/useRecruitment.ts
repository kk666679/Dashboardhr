"use client";

import { trpc } from "@/lib/trpc";
import { useKbChat, type KbMessage } from "./useKbChat";
import { useCallback, useMemo } from "react";

export interface RecruitmentContext {
  /** Job title to screen for */
  jdTitle?: string;
  /** Number of candidates in the pipeline */
  candidateCount?: number;
}

/**
 * Recruitment‑specific agent hook built on the unified KBChat.
 *
 * Provides:
 *  - Conversational screening with structured outputs.
 *  - Access to tRPC recruitment data (pipeline, JD creation).
 *  - Automatic source citations and action tracking.
 */
export function useRecruitmentAgent(employeeId?: string, tenantId?: string) {
  const utils = trpc.useUtils();

  // ─── tRPC queries / mutations ─────────────────────────────────────────────

  const candidatesQuery = trpc.recruitment.pipeline.useQuery(undefined, {
    staleTime: 30_000,
  });

  const createJDMutation = trpc.recruitment.jdCreate.useMutation({
    onSuccess: () => {
      utils.recruitment.pipeline.invalidate();
    },
  });

  // ─── KBChat (unified orchestrator) ────────────────────────────────────────

  const kbChat = useKbChat({
    employeeId,
    tenantId,
    // Optionally, we can pre‑select recruitment agents if needed
    // agents: ["recruitment", "talent-acquisition"],
    provider: "claude",
  });

  const { messages, sendMessage, latestResponse, latestSuggestions, sources } = kbChat;

  // ─── Recruitment‑specific methods ─────────────────────────────────────────

  /**
   * Screen candidates for a given job description (JD) title.
   * Sends a structured request to the orchestrator, which will retrieve
   * candidate data from the pipeline and provide a screening summary.
   */
  const screenCandidates = useCallback(
    async (jdTitle: string) => {
      const context: RecruitmentContext = {
        jdTitle,
        candidateCount: candidatesQuery.data?.length ?? 0,
      };

      const prompt = `
Screen candidates for the following job description:
Title: ${jdTitle}
Candidates in pipeline: ${context.candidateCount}

Please provide:
- A short summary of the candidate pool.
- Top 3 matches with reasoning.
- Any skill gaps or missing qualifications.
- Recommended next steps.

Use the recruitment data available via your tools.
`;

      await sendMessage(prompt);
    },
    [sendMessage, candidatesQuery.data],
  );

  /**
   * Create a new job description via tRPC and then ask the orchestrator
   * to suggest the best sourcing strategy.
   */
  const createJD = useCallback(
    async (jdData: Parameters<typeof createJDMutation.mutateAsync>[0]) => {
      const result = await createJDMutation.mutateAsync(jdData);
      // After creation, let the orchestrator analyse it
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

  /** Latest structured response from the orchestrator, if any */
  const latestScreeningResult = useMemo(() => {
    // If the latest response has actions or sources, it's likely a screening result
    const response = latestResponse;
    if (response?.actions?.length || response?.sources?.length) {
      return response;
    }
    return null;
  }, [latestResponse]);

  /** Candidate‑specific sources (i.e., candidate profiles referenced) */
  const candidateSources = useMemo(() => {
    return sources.filter((src) => src.title?.toLowerCase().includes("candidate") || src.id?.startsWith("cand-"));
  }, [sources]);

  return {
    // tRPC
    candidates: candidatesQuery,
    createJD: {
      mutate: createJDMutation.mutate,
      mutateAsync: createJDMutation.mutateAsync,
      isPending: createJDMutation.isPending,
      isError: createJDMutation.isError,
      error: createJDMutation.error,
      reset: createJDMutation.reset,
    },

    // KBChat
    messages: messages as KbMessage[],
    sendMessage,
    isLoading: kbChat.isLoading,
    error: kbChat.error,
    clear: kbChat.clear,
    latestResponse,
    latestSuggestions,
    sources,

    // Recruitment‑specific
    screenCandidates,
    latestScreeningResult,
    candidateSources,
  };
}