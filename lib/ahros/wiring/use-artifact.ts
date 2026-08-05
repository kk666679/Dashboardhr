/**
 * useArtifact — React hooks for interacting with the Artifact Registry.
 *
 * Provides:
 *  - Hook for a single artifact with live updates
 *  - Hook for artifact list with filtering
 *  - Utility to create/update artifacts and subscribe to changes
 */

import { useSyncExternalStore, useCallback, useRef } from "react";
import { getArtifactRegistry } from "@/lib/ahros/artifact-registry";
import type { ArtifactRecord, ArtifactMeta, ArtifactType, ArtifactStatus } from "@/lib/ahros/types";

// ─── Reactive store for artifact changes ─────────────────────────────────────

const artifactListeners = new Set<() => void>();
let artifactVersion = 0;

function notifyArtifactListeners(): void {
  artifactVersion++;
  artifactListeners.forEach((l) => l());
}

function subscribeToArtifacts(callback: () => void): () => void {
  artifactListeners.add(callback);

  // Hook into the registry's update cycle via monkey-patch
  // In production, the registry would emit events; for now we poll via useSyncExternalStore
  return () => {
    artifactListeners.delete(callback);
  };
}

function getArtifactSnapshot(): number {
  return artifactVersion;
}

// ─── Hook: Single Artifact ───────────────────────────────────────────────────

export function useArtifact<T = unknown>(artifactId: string | null): {
  record: ArtifactRecord<T> | null;
  meta: ArtifactMeta | null;
  data: T | null;
  isLoaded: boolean;
  update: (newData: T, options?: { title?: string; description?: string; tags?: string[] }) => void;
  rollback: (version: number) => void;
  archive: () => void;
} {
  const version = useSyncExternalStore(subscribeToArtifacts, getArtifactSnapshot, getArtifactSnapshot);

  const registry = getArtifactRegistry();

  const record = artifactId ? (registry.get<T>(artifactId) ?? null) : null;
  const meta = record?.meta ?? null;
  const data = record?.data as T ?? null;

  const update = useCallback(
    (newData: T, options?: { title?: string; description?: string; tags?: string[] }) => {
      if (!artifactId) return;
      registry.update(artifactId, newData, options as any);
      notifyArtifactListeners();
    },
    [artifactId],
  );

  const rollback = useCallback(
    (version: number) => {
      if (!artifactId) return;
      registry.rollback(artifactId, version);
      notifyArtifactListeners();
    },
    [artifactId],
  );

  const archive = useCallback(() => {
    if (!artifactId) return;
    registry.archive(artifactId);
    notifyArtifactListeners();
  }, [artifactId]);

  return {
    record,
    meta,
    data,
    isLoaded: artifactId !== null && record !== null,
    update,
    rollback,
    archive,
  };
}

// ─── Hook: Artifacts by Type ─────────────────────────────────────────────────

export function useArtifactsByType<T = unknown>(type: ArtifactType | null): {
  artifacts: ArtifactRecord<T>[];
  count: number;
  create: (title: string, data: T, options?: {
    description?: string;
    parentId?: string;
    tags?: string[];
    createdBy?: string;
  }) => string;
} {
  const version = useSyncExternalStore(subscribeToArtifacts, getArtifactSnapshot, getArtifactSnapshot);

  const registry = getArtifactRegistry();

  const artifacts = type ? registry.getByType<T>(type) : [];
  const count = artifacts.length;

  const create = useCallback(
    (title: string, data: T, options?: {
      description?: string;
      parentId?: string;
      tags?: string[];
      createdBy?: string;
    }) => {
      const record = registry.create(type ?? "conversation", title, data, options as any);
      notifyArtifactListeners();
      return record.meta.id;
    },
    [type],
  );

  return { artifacts, count, create };
}

// ─── Hook: Search Artifacts ──────────────────────────────────────────────────

export function useArtifactSearch(query: string): {
  results: ArtifactRecord[];
  hasResults: boolean;
} {
  const version = useSyncExternalStore(subscribeToArtifacts, getArtifactSnapshot, getArtifactSnapshot);

  const registry = getArtifactRegistry();
  const results = query ? registry.search(query) : [];
  const hasResults = results.length > 0;

  return { results, hasResults };
}

// ─── Hook: All Artifacts ─────────────────────────────────────────────────────

export function useAllArtifacts(): {
  artifacts: ArtifactRecord[];
  count: number;
  clear: () => void;
} {
  const version = useSyncExternalStore(subscribeToArtifacts, getArtifactSnapshot, getArtifactSnapshot);

  const registry = getArtifactRegistry();
  const artifacts = registry.getAll();

  const clear = useCallback(() => {
    artifacts.forEach((a) => registry.delete(a.meta.id));
    notifyArtifactListeners();
  }, []);

  return { artifacts, count: artifacts.length, clear };
}

