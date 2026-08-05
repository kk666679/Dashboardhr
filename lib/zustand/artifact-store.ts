/**
 * Artifact Store — Individual artifact state management.
 *
 * Manages versioning, history, rollback, and sync status
 * for individual artifacts within the AHROS workspace.
 */

import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import type { ArtifactRecord, ArtifactType, ArtifactMeta } from "@/lib/ahros/types";
import { getEventBus } from "@/lib/ahros/event-bus";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ArtifactViewState {
  expanded: boolean;
  pinned: boolean;
  highlighted: boolean;
}

export interface ArtifactStoreEntry<T = unknown> {
  record: ArtifactRecord<T>;
  viewState: ArtifactViewState;
  isLoading: boolean;
  lastAccessed: Date;
}

export interface ArtifactStore {
  // ── Store State ────────────────────────────────────────────────────────
  artifacts: Map<string, ArtifactStoreEntry>;
  selectedArtifactId: string | null;

  // ── CRUD ───────────────────────────────────────────────────────────────
  addArtifact: <T>(record: ArtifactRecord<T>) => void;
  removeArtifact: (id: string) => void;
  updateArtifactData: <T>(id: string, data: T) => void;
  updateArtifactMeta: (id: string, partial: Partial<ArtifactMeta>) => void;

  // ── Selection ──────────────────────────────────────────────────────────
  selectArtifact: (id: string | null) => void;
  getSelectedArtifact: <T>() => ArtifactRecord<T> | null;

  // ── View State ─────────────────────────────────────────────────────────
  setExpanded: (id: string, expanded: boolean) => void;
  setPinned: (id: string, pinned: boolean) => void;
  setHighlighted: (id: string, highlighted: boolean) => void;
  toggleExpanded: (id: string) => void;
  togglePinned: (id: string) => void;

  // ── Versioning ─────────────────────────────────────────────────────────
  getVersionHistory: <T>(id: string) => { version: number; timestamp: Date }[];
  rollbackToVersion: <T>(id: string, version: number) => boolean;

  // ── Query ──────────────────────────────────────────────────────────────
  getArtifact: <T>(id: string) => ArtifactRecord<T> | null;
  getArtifactsByType: <T>(type: ArtifactType) => ArtifactRecord<T>[];
  getArtifactsByStatus: (status: ArtifactMeta["status"]) => ArtifactRecord[];

  // ── Sync ───────────────────────────────────────────────────────────────
  markSynced: (id: string) => void;
  markSyncing: (id: string) => void;
  markDirty: (id: string) => void;

  // ── Cleanup ────────────────────────────────────────────────────────────
  clear: () => void;
  pruneUnpinned: () => void;
}

// ─── Store ───────────────────────────────────────────────────────────────────

export const useArtifactStore = create<ArtifactStore>()(
  subscribeWithSelector((set, get) => ({
    artifacts: new Map(),
    selectedArtifactId: null,

    // ── CRUD ─────────────────────────────────────────────────────────────

    addArtifact: <T>(record: ArtifactRecord<T>) => {
      set((state) => {
        const newArtifacts = new Map(state.artifacts);
        newArtifacts.set(record.meta.id, {
          record,
          viewState: {
            expanded: true,
            pinned: false,
            highlighted: false,
          },
          isLoading: false,
          lastAccessed: new Date(),
        });
        return { artifacts: newArtifacts };
      });
    },

    removeArtifact: (id) => {
      set((state) => {
        const newArtifacts = new Map(state.artifacts);
        newArtifacts.delete(id);
        return {
          artifacts: newArtifacts,
          selectedArtifactId:
            state.selectedArtifactId === id ? null : state.selectedArtifactId,
        };
      });
    },

    updateArtifactData: <T>(id: string, data: T) => {
      const entry = get().artifacts.get(id);
      if (!entry) return;

      const { record, viewState } = entry;
      const now = new Date();
      const newVersion = record.meta.version + 1;

      // Save previous version
      const prevVersions = record.previousVersions
        ? [...record.previousVersions]
        : [];
      prevVersions.push({
        version: record.meta.version,
        data: record.data as T,
        timestamp: record.meta.updatedAt,
      });

      // Trim to last 10
      while (prevVersions.length > 10) prevVersions.shift();

      const updatedMeta: ArtifactMeta = {
        ...record.meta,
        version: newVersion,
        updatedAt: now,
        syncStatus: "dirty",
      };

      const updatedRecord = {
        meta: updatedMeta,
        data,
        previousVersions: prevVersions as ArtifactRecord<T>['previousVersions'],
      } as ArtifactRecord<T>;

      set((state) => {
        const newArtifacts = new Map(state.artifacts);
        const existing = newArtifacts.get(id);
        if (!existing) return state;
        newArtifacts.set(id, {
          ...existing,
          record: updatedRecord as unknown as ArtifactRecord,
          lastAccessed: now,
        });
        return { artifacts: newArtifacts };
      });

      // Notify event bus
      const bus = getEventBus();
      bus.publish({
        type: "ARTIFACT_UPDATED",
        artifactId: id,
        artifactType: record.meta.type,
        payload: { version: newVersion },
        source: "artifact-store",
      });
    },

    updateArtifactMeta: (id, partial) => {
      const entry = get().artifacts.get(id);
      if (!entry) return;

      set((state) => {
        const newArtifacts = new Map(state.artifacts);
        const existing = newArtifacts.get(id);
        if (!existing) return state;
        newArtifacts.set(id, {
          ...existing,
          record: {
            ...existing.record,
            meta: { ...existing.record.meta, ...partial, updatedAt: new Date() },
          },
        });
        return { artifacts: newArtifacts };
      });
    },

    // ── Selection ────────────────────────────────────────────────────────

    selectArtifact: (id) => {
      set((state) => {
        if (id) {
          const newArtifacts = new Map(state.artifacts);
          const entry = newArtifacts.get(id);
          if (entry) {
            newArtifacts.set(id, {
              ...entry,
              lastAccessed: new Date(),
            });
            return { artifacts: newArtifacts, selectedArtifactId: id };
          }
        }
        return { selectedArtifactId: id };
      });
    },

    getSelectedArtifact: <T>() => {
      const { artifacts, selectedArtifactId } = get();
      if (!selectedArtifactId) return null;
      const entry = artifacts.get(selectedArtifactId);
      return entry ? (entry.record as ArtifactRecord<T>) : null;
    },

    // ── View State ───────────────────────────────────────────────────────

    setExpanded: (id, expanded) => {
      set((state) => {
        const newArtifacts = new Map(state.artifacts);
        const entry = newArtifacts.get(id);
        if (!entry) return state;
        newArtifacts.set(id, {
          ...entry,
          viewState: { ...entry.viewState, expanded },
        });
        return { artifacts: newArtifacts };
      });
    },

    setPinned: (id, pinned) => {
      set((state) => {
        const newArtifacts = new Map(state.artifacts);
        const entry = newArtifacts.get(id);
        if (!entry) return state;
        newArtifacts.set(id, {
          ...entry,
          viewState: { ...entry.viewState, pinned },
        });
        return { artifacts: newArtifacts };
      });
    },

    setHighlighted: (id, highlighted) => {
      set((state) => {
        const newArtifacts = new Map(state.artifacts);
        const entry = newArtifacts.get(id);
        if (!entry) return state;
        newArtifacts.set(id, {
          ...entry,
          viewState: { ...entry.viewState, highlighted },
        });
        return { artifacts: newArtifacts };
      });
    },

    toggleExpanded: (id) => {
      const entry = get().artifacts.get(id);
      if (entry) {
        get().setExpanded(id, !entry.viewState.expanded);
      }
    },

    togglePinned: (id) => {
      const entry = get().artifacts.get(id);
      if (entry) {
        get().setPinned(id, !entry.viewState.pinned);
      }
    },

    // ── Versioning ───────────────────────────────────────────────────────

    getVersionHistory: <T>(id: string) => {
      const entry = get().artifacts.get(id);
      if (!entry) return [];

      const history: { version: number; timestamp: Date }[] = [
        { version: entry.record.meta.version, timestamp: entry.record.meta.updatedAt },
      ];

      if (entry.record.previousVersions) {
        history.push(
          ...entry.record.previousVersions.map((v) => ({
            version: v.version,
            timestamp: v.timestamp,
          })),
        );
      }

      return history.sort((a, b) => b.version - a.version);
    },

    rollbackToVersion: <T>(id: string, version: number) => {
      const entry = get().artifacts.get(id);
      if (!entry) return false;

      const { record } = entry;

      // Check if it's current version
      if (record.meta.version === version) return true;

      // Find in previous versions
      const prev = record.previousVersions?.find(
        (v) => v.version === version,
      );
      if (!prev) return false;

      get().updateArtifactData(id, prev.data as T);
      return true;
    },

    // ── Query ────────────────────────────────────────────────────────────

    getArtifact: <T>(id: string) => {
      const entry = get().artifacts.get(id);
      return entry ? (entry.record as ArtifactRecord<T>) : null;
    },

    getArtifactsByType: <T>(type: string) => {
      return Array.from(get().artifacts.values())
        .filter((e) => e.record.meta.type === type)
        .map((e) => e.record) as ArtifactRecord<T>[];
    },

    getArtifactsByStatus: (status) => {
      return Array.from(get().artifacts.values())
        .filter((e) => e.record.meta.status === status)
        .map((e) => e.record);
    },

    // ── Sync ─────────────────────────────────────────────────────────────

    markSynced: (id) => get().updateArtifactMeta(id, { syncStatus: "synced" }),
    markSyncing: (id) => get().updateArtifactMeta(id, { syncStatus: "syncing" }),
    markDirty: (id) => get().updateArtifactMeta(id, { syncStatus: "dirty" }),

    // ── Cleanup ──────────────────────────────────────────────────────────

    clear: () => set({ artifacts: new Map(), selectedArtifactId: null }),

    pruneUnpinned: () => {
      set((state) => {
        const newArtifacts = new Map(state.artifacts);
        for (const [id, entry] of newArtifacts) {
          if (!entry.viewState.pinned) {
            newArtifacts.delete(id);
          }
        }
        return {
          artifacts: newArtifacts,
          selectedArtifactId: state.selectedArtifactId &&
            newArtifacts.has(state.selectedArtifactId)
            ? state.selectedArtifactId
            : null,
        };
      });
    },
  })),
);
