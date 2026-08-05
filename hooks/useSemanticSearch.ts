"use client";

import { useState, useEffect, useRef } from "react";
import { trpc } from "@/lib/trpc";
import type { z } from "zod";

type SearchKind = "employees" | "documents" | "rules" | "all";

interface UseSemanticSearchOptions {
  kind?: SearchKind;
  topK?: number;
  minScore?: number;
  debounceMs?: number;
}

export function useSemanticSearch(options: UseSemanticSearchOptions = {}) {
  const { kind = "all", topK = 8, minScore = 0.25, debounceMs = 350 } = options;

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(
      () => setDebouncedQuery(query.trim()),
      debounceMs,
    );
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query, debounceMs]);

  const { data, isLoading, error } = trpc.search.query.useQuery(
    { query: debouncedQuery, kind, topK, minScore },
    { enabled: debouncedQuery.length >= 2 },
  );

  return {
    query,
    setQuery,
    results: data?.results ?? [],
    isLoading: isLoading && debouncedQuery.length >= 2,
    error: error?.message ?? null,
  };
}
