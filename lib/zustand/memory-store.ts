/**
 * Memory Store — Continuous learning and memory persistence for AHROS.
 *
 * Captures:
 *  - Successful execution patterns
 *  - Failures and their resolutions
 *  - Human corrections and feedback
 *  - Preferred workflows and policies
 *  - Generated recommendations
 */

import { create } from "zustand";
import { subscribeWithSelector, persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import type { LearningEvent, MemoryEntry } from "@/lib/ahros/types";
import { getEventBus } from "@/lib/ahros/event-bus";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface LearningPattern {
  id: string;
  pattern: string;
  frequency: number;
  confidence: number;
  lastObserved: Date;
  context: string;
  outcome: string;
  recommendation?: string;
  tags: string[];
}

export interface UserPreference {
  key: string;
  value: unknown;
  updatedAt: Date;
  category: "ui" | "workflow" | "notification" | "compliance";
}

export interface Recommendation {
  id: string;
  type: "optimization" | "automation" | "compliance" | "workflow";
  title: string;
  description: string;
  confidence: number;
  source: string;
  context: string;
  applied: boolean;
  createdAt: Date;
  expiresAt?: Date;
}

export interface MemoryStore {
  // ── Learning Events ────────────────────────────────────────────────────
  learningEvents: LearningEvent[];
  addLearningEvent: (event: Omit<LearningEvent, "id" | "timestamp">) => void;
  getLearningEvents: (filter?: {
    type?: LearningEvent["type"];
    tags?: string[];
    limit?: number;
  }) => LearningEvent[];

  // ── Patterns ───────────────────────────────────────────────────────────
  patterns: LearningPattern[];
  addPattern: (pattern: Omit<LearningPattern, "id" | "frequency" | "lastObserved">) => void;
  incrementPattern: (patternId: string) => void;
  getPatterns: (minConfidence?: number) => LearningPattern[];
  findPattern: (context: string) => LearningPattern | undefined;

  // ── Memory Entries ─────────────────────────────────────────────────────
  entries: MemoryEntry[];
  setEntry: (key: string, value: unknown, options?: {
    type?: MemoryEntry["type"];
    confidence?: number;
    ttl?: number;
  }) => void;
  getEntry: (key: string) => MemoryEntry | undefined;
  deleteEntry: (key: string) => boolean;
  getEntriesByType: (type: MemoryEntry["type"]) => MemoryEntry[];

  // ── Preferences ────────────────────────────────────────────────────────
  preferences: UserPreference[];
  setPreference: (key: string, value: unknown, category: UserPreference["category"]) => void;
  getPreference: (key: string) => UserPreference | undefined;
  getPreferencesByCategory: (category: UserPreference["category"]) => UserPreference[];

  // ── Recommendations ────────────────────────────────────────────────────
  recommendations: Recommendation[];
  addRecommendation: (rec: Omit<Recommendation, "id" | "createdAt" | "applied">) => void;
  markRecommendationApplied: (id: string) => void;
  dismissRecommendation: (id: string) => void;
  getActiveRecommendations: () => Recommendation[];

  // ── Utility ────────────────────────────────────────────────────────────
  clear: () => void;
  pruneExpired: () => void;
}

// ─── Store ───────────────────────────────────────────────────────────────────

export const useMemoryStore = create<MemoryStore>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        // ── Learning Events ────────────────────────────────────────────────
        learningEvents: [],

        addLearningEvent: (event) => {
          const newEvent: LearningEvent = {
            ...event,
            id: uuidv4(),
            timestamp: new Date(),
          };

          set((state) => ({
            learningEvents: [...state.learningEvents, newEvent],
          }));

          const bus = getEventBus();
          bus.publish({
            type: "LEARNING_CAPTURED",
            payload: { event: newEvent },
            source: "memory-store",
          });
        },

        getLearningEvents: (filter) => {
          let events = get().learningEvents;
          if (filter?.type) events = events.filter((e) => e.type === filter.type);
          if (filter?.tags?.length) {
            events = events.filter((e) =>
              filter.tags!.some((t) => e.tags.includes(t)),
            );
          }
          return events.slice(-(filter?.limit ?? 100));
        },

        // ── Patterns ───────────────────────────────────────────────────────
        patterns: [],

        addPattern: (pattern) => {
          const existing = get().patterns.find(
            (p) => p.pattern === pattern.pattern && p.context === pattern.context,
          );
          if (existing) {
            get().incrementPattern(existing.id);
            return;
          }
          set((state) => ({
            patterns: [
              ...state.patterns,
              { ...pattern, id: uuidv4(), frequency: 1, lastObserved: new Date() },
            ],
          }));
        },

        incrementPattern: (patternId) => {
          set((state) => ({
            patterns: state.patterns.map((p) =>
              p.id === patternId
                ? {
                    ...p,
                    frequency: p.frequency + 1,
                    lastObserved: new Date(),
                    confidence: Math.min(1, p.confidence + 0.05),
                  }
                : p,
            ),
          }));
        },

        getPatterns: (minConfidence) => {
          const patterns = get().patterns;
          if (minConfidence !== undefined) {
            return patterns.filter((p) => p.confidence >= minConfidence);
          }
          return [...patterns].sort(
            (a, b) => b.confidence - a.confidence || b.frequency - a.frequency,
          );
        },

        findPattern: (context) => get().patterns.find((p) => p.context === context),

        // ── Memory Entries ─────────────────────────────────────────────────
        entries: [],

        setEntry: (key, value, options) => {
          const now = new Date();
          const existingIndex = get().entries.findIndex((e) => e.key === key);
          const entry: MemoryEntry = {
            id: existingIndex >= 0 ? get().entries[existingIndex].id : uuidv4(),
            key,
            value,
            type: options?.type ?? "pattern",
            confidence: options?.confidence ?? 0.8,
            createdAt: existingIndex >= 0 ? get().entries[existingIndex].createdAt : now,
            updatedAt: now,
            ttl: options?.ttl,
          };
          set((state) => {
            const newEntries = [...state.entries];
            if (existingIndex >= 0) newEntries[existingIndex] = entry;
            else newEntries.push(entry);
            return { entries: newEntries };
          });
          const bus = getEventBus();
          bus.publish({ type: "MEMORY_UPDATED", payload: { key, type: entry.type }, source: "memory-store" });
        },

        getEntry: (key) => get().entries.find((e) => e.key === key),

        deleteEntry: (key) => {
          const existed = get().entries.some((e) => e.key === key);
          if (existed) set((state) => ({ entries: state.entries.filter((e) => e.key !== key) }));
          return existed;
        },

        getEntriesByType: (type) => get().entries.filter((e) => e.type === type),

        // ── Preferences ────────────────────────────────────────────────────
        preferences: [],

        setPreference: (key, value, category) => {
          const existingIndex = get().preferences.findIndex((p) => p.key === key);
          const pref: UserPreference = { key, value, category, updatedAt: new Date() };
          set((state) => {
            const newPreferences = [...state.preferences];
            if (existingIndex >= 0) newPreferences[existingIndex] = pref;
            else newPreferences.push(pref);
            return { preferences: newPreferences };
          });
        },

        getPreference: (key) => get().preferences.find((p) => p.key === key),

        getPreferencesByCategory: (category) =>
          get().preferences.filter((p) => p.category === category),

        // ── Recommendations ────────────────────────────────────────────────
        recommendations: [],

        addRecommendation: (rec) => {
          set((state) => ({
            recommendations: [
              ...state.recommendations,
              {
                ...rec,
                id: uuidv4(),
                applied: false,
                createdAt: new Date(),
              },
            ],
          }));
        },

        markRecommendationApplied: (id) => {
          set((state) => ({
            recommendations: state.recommendations.map((r) =>
              r.id === id ? { ...r, applied: true } : r,
            ),
          }));
        },

        dismissRecommendation: (id) => {
          set((state) => ({
            recommendations: state.recommendations.filter((r) => r.id !== id),
          }));
        },

        getActiveRecommendations: () =>
          get().recommendations
            .filter((r) => !r.applied && (!r.expiresAt || new Date(r.expiresAt) > new Date()))
            .sort((a, b) => b.confidence - a.confidence),

        // ── Utility ────────────────────────────────────────────────────────
        clear: () =>
          set({
            learningEvents: [],
            patterns: [],
            entries: [],
            preferences: [],
            recommendations: [],
          }),

        pruneExpired: () => {
          const now = new Date();
          set((state) => ({
            entries: state.entries.filter((e) => !e.ttl || new Date(e.updatedAt).getTime() + e.ttl * 86400000 > now.getTime()),
            recommendations: state.recommendations.filter(
              (r) => !r.expiresAt || new Date(r.expiresAt) > now,
            ),
          }));
        },
      }),
      {
        name: "ahros-memory-store",
        partialize: (state: MemoryStore) => ({
          learningEvents: state.learningEvents,
          patterns: state.patterns,
          entries: state.entries,
          preferences: state.preferences,
          recommendations: state.recommendations,
        }),
      },
    ),
  ),
);
