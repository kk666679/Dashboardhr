"use client";

import { useState, useCallback } from "react";
import type { AgentPersona } from "@/server/agents/prompts";

interface RagChunk {
  source: string;
  text: string;
  score: number;
}

interface RagResult {
  answer: string;
  chunks: RagChunk[];
  provider: "ollama";
}

interface UseRagOptions {
  persona?: AgentPersona;
  tenantId?: string;
}

export function useRag({
  persona = "orchestrator",
  tenantId,
}: UseRagOptions = {}) {
  const [result, setResult] = useState<RagResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const query = useCallback(
    async (q: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/ai/rag", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: q, persona, tenantId }),
        });
        if (!res.ok) throw new Error(await res.text());
        const data: RagResult = await res.json();
        setResult(data);
        return data;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "RAG query failed";
        setError(msg);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [persona, tenantId],
  );

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { query, result, isLoading, error, reset };
}
