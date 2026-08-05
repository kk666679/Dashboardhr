"use client";

/**
 * useRegulatoryIntelligence — client hook for the Malaysia Regulatory
 * Intelligence & Continuous Compliance module.
 *
 * Surfaces regulatory changes, trusted sources, compliance scorecards,
 * and provides actions to trigger monitor polls and change pipelines.
 */
import { useCallback, useEffect, useState } from "react";

export interface RegulatoryChange {
  id: string;
  title: string;
  referenceNo?: string | null;
  description?: string | null;
  diffSummary?: string | null;
  status: string;
  impactLevel: string;
  affectedWorkflows: string[];
  affectedPolicies: string[];
  implementationDeadline?: string | null;
  impactAssessment?: string | null;
  notified: boolean;
  migrationTasksCreated: boolean;
  knowledgeIndexUpdated: boolean;
  detectedAt: string;
  sourceUrl?: string | null;
}

export interface RegulatorySource {
  id: string;
  name: string;
  sourceType: string;
  url?: string | null;
  priority: number;
  isActive: boolean;
  lastPolledAt?: string | null;
  frequencyMinutes: number;
}

export interface Scorecard {
  id: string;
  period: string;
  agencyCode?: string | null;
  totalScore: number;
  maxScore: number;
  status: string;
  metrics?: any;
  publishedAt?: string | null;
}

interface UseRegulatoryIntelligenceOptions {
  tenantId?: string;
  pollIntervalMs?: number;
}

export function useRegulatoryIntelligence(options: UseRegulatoryIntelligenceOptions = {}) {
  const { tenantId, pollIntervalMs = 60_000 } = options;

  const [changes, setChanges] = useState<RegulatoryChange[]>([]);
  const [sources, setSources] = useState<RegulatorySource[]>([]);
  const [scorecards, setScorecards] = useState<Scorecard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const qs = tenantId ? `?tenantId=${encodeURIComponent(tenantId)}` : "";
      const [changesRes, sourcesRes] = await Promise.all([
        fetch(`/api/regulatory/changes${qs}`),
        fetch(`/api/regulatory/monitor`),
      ]);
      const changesJson = await changesRes.json();
      const sourcesJson = await sourcesRes.json();

      if (changesJson.success) setChanges(changesJson.changes ?? []);
      if (sourcesJson.success) setSources(sourcesJson.sources ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [tenantId]);

  /** Trigger a source poll. */
  const pollSources = useCallback(async () => {
    const res = await fetch("/api/regulatory/monitor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "poll" }),
    });
    return res.json();
  }, []);

  /** Enqueue a background monitor job. */
  const enqueueMonitor = useCallback(async () => {
    const res = await fetch("/api/regulatory/monitor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "enqueue", tenantId }),
    });
    return res.json();
  }, [tenantId]);

  /** Seed trusted sources registry. */
  const seedSources = useCallback(async () => {
    const res = await fetch("/api/regulatory/monitor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "seed" }),
    });
    return res.json();
  }, []);

  /** Manually run the 10-step change pipeline. */
  const runChangePipeline = useCallback(
    async (input: {
      tenantId: string;
      title: string;
      description?: string;
      referenceNo?: string;
      sourceUrl?: string;
      implementationDeadline?: string;
    }) => {
      const res = await fetch("/api/regulatory/changes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      return res.json();
    },
    []
  );

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, pollIntervalMs);
    return () => clearInterval(interval);
  }, [refresh, pollIntervalMs]);

  return {
    changes,
    sources,
    scorecards,
    loading,
    error,
    refresh,
    pollSources,
    enqueueMonitor,
    seedSources,
    runChangePipeline,
    setScorecards,
  };
}

