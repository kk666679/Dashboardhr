/**
 * useAhros — Unified React hook for the AHROS Agentic Workspace.
 *
 * Combines EventBus subscriptions, artifact CRUD, workspace layout state,
 * execution state, plan state, compliance state, and memory into one
 * ergonomic hook surface.
 *
 * This is the primary entrypoint for React components to interact with
 * the AHROS core layer.
 */

"use client";

import { useCallback, useMemo, useEffect } from "react";
import { useAhrosStore } from "@/lib/zustand/ahros-store";
import { useMemoryStore } from "@/lib/zustand/memory-store";
import { useArtifactStore } from "@/lib/zustand/artifact-store";
import { useEventBus } from "./use-event-bus";
import { getEventBus } from "@/lib/ahros/event-bus";
import { getArtifactRegistry } from "@/lib/ahros/artifact-registry";
import type {
  BusinessEvent,
  BusinessEventType,
  PanelId,
  Plan,
  PlanTask,
  ExecutionStep,
  ExecutionState,
  ComplianceReport,
  ArtifactRecord,
  ArtifactType,
  SyncEventType,
  WorkspaceConfig,
  LearningEvent,
} from "@/lib/ahros/types";
import { v4 as uuidv4 } from "uuid";

// ─── Return Type ─────────────────────────────────────────────────────────────

export interface UseAhrosReturn {
  // ── Workspace State ────────────────────────────────────────────────────
  status: string;
  activeEvent: BusinessEvent | null;
  activeArtifactIds: string[];
  panels: ReturnType<typeof useAhrosStore.getState>["panels"];

  // ── Plan State ──────────────────────────────────────────────────────────
  plan: Plan | null;
  planTasks: PlanTask[];

  // ── Execution State ────────────────────────────────────────────────────
  execution: ExecutionState | null;

  // ── Compliance State ───────────────────────────────────────────────────
  compliance: ComplianceReport | null;

  // ── UI State ───────────────────────────────────────────────────────────
  activePanelId: PanelId;
  error: string | null;

  // ── Actions ────────────────────────────────────────────────────────────
  processEvent: (event: Omit<BusinessEvent, "id" | "timestamp">) => Promise<void>;
  setActivePanel: (panelId: PanelId) => void;
  togglePanelVisibility: (panelId: PanelId) => void;
  setPanelCollapsed: (panelId: PanelId, collapsed: boolean) => void;
  resetWorkspace: () => void;

  // ── Execution Actions ──────────────────────────────────────────────────
  startExecution: () => void;
  pauseExecution: () => void;
  resumeExecution: () => void;
  addStep: (step: ExecutionStep) => void;

  // ── Plan Actions ───────────────────────────────────────────────────────
  setPlan: (plan: Plan) => void;
  updateTask: (taskId: string, updates: Partial<PlanTask>) => void;

  // ── Compliance ─────────────────────────────────────────────────────────
  setCompliance: (report: ComplianceReport) => void;

  // ── Artifact Actions ───────────────────────────────────────────────────
  createArtifact: <T>(
    type: ArtifactType,
    title: string,
    data: T,
  ) => ArtifactRecord<T>;
  updateArtifact: <T>(id: string, data: T) => void;
  getArtifact: <T>(id: string) => ArtifactRecord<T> | undefined;

  // ── Event Bus ──────────────────────────────────────────────────────────
  subscribe: (
    eventType: SyncEventType | "*",
    handler: (event: any) => void,
  ) => string;
  publish: (eventType: SyncEventType, payload?: unknown) => Promise<void>;

  // ── Memory / Learning ──────────────────────────────────────────────────
  addLearningEvent: (event: Parameters<ReturnType<typeof useMemoryStore.getState>["addLearningEvent"]>[0]) => void;
  getActiveRecommendations: () => ReturnType<ReturnType<typeof useMemoryStore.getState>["getActiveRecommendations"]>;

  // ── Last Sync Event ────────────────────────────────────────────────────
  lastSyncEvent: ReturnType<typeof useEventBus>["lastEvent"];
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useAhros(): UseAhrosReturn {
  // ── Zustand stores ─────────────────────────────────────────────────────
  const store = useAhrosStore();
  const memory = useMemoryStore();

  // ── Event Bus subscription ─────────────────────────────────────────────
  const { lastEvent } = useEventBus();

  // React to events from the bus
  useEffect(() => {
    if (!lastEvent) return;
    const event = lastEvent;
    if (event.type === "EXECUTION_STARTED") {
      store.setStatus("executing");
    } else if (event.type === "EXECUTION_COMPLETED") {
      store.setStatus("completed");
    } else if (event.type === "EXECUTION_FAILED") {
      store.setStatus("error");
    } else if (event.type === "EXECUTION_PAUSED") {
      store.setStatus("paused");
    } else if (event.type === "EXECUTION_RESUMED") {
      store.setStatus("executing");
    } else if (event.type === "ARTIFACT_CREATED") {
      if (event.artifactId) store.registerArtifact(event.artifactId);
    }
  }, [lastEvent, store]);

  // ── Derived State ──────────────────────────────────────────────────────
  const planTasks = useMemo(() => store.currentPlan?.tasks ?? [], [store.currentPlan]);

  // ── Actions ────────────────────────────────────────────────────────────

  const processEvent = useCallback(
    async (event: Omit<BusinessEvent, "id" | "timestamp">) => {
      const fullEvent: BusinessEvent = {
        ...event,
        id: uuidv4(),
        timestamp: new Date(),
      };
      await store.processBusinessEvent(fullEvent);
    },
    [store],
  );

  const togglePanelVisibility = useCallback(
    (panelId: PanelId) => {
      const panel = store.panels.find((p) => p.id === panelId);
      if (panel) {
        store.setPanelVisibility(panelId, !panel.visible);
      }
    },
    [store],
  );

  const addStep = useCallback(
    (step: ExecutionStep) => {
      store.addExecutionStep(step);
    },
    [store],
  );

  const setCompliance = useCallback(
    (report: ComplianceReport) => {
      store.setComplianceReport(report);
    },
    [store],
  );

  const createArtifact = useCallback(
    <T>(type: ArtifactType, title: string, data: T): ArtifactRecord<T> => {
      const registry = getArtifactRegistry();
      const record = registry.create(type, title, data);
      store.registerArtifact(record.meta.id);
      return record;
    },
    [store],
  );

  const updateArtifact = useCallback(
    <T>(id: string, data: T) => {
      const registry = getArtifactRegistry();
      registry.update(id, data);
    },
    [],
  );

  const getArtifact = useCallback(
    <T>(id: string): ArtifactRecord<T> | undefined => {
      const registry = getArtifactRegistry();
      return registry.get<T>(id);
    },
    [],
  );

  const publish = useCallback(
    async (eventType: SyncEventType, payload?: unknown) => {
      const bus = getEventBus();
      await bus.publish({
        type: eventType,
        payload,
        source: "use-ahros",
      });
    },
    [],
  );

  const subscribe = useCallback(
    (eventType: SyncEventType | "*", handler: (event: any) => void): string => {
      const bus = getEventBus();
      return bus.subscribe(eventType, handler);
    },
    [],
  );

  // ── Return ─────────────────────────────────────────────────────────────
  return {
    // Workspace
    status: store.status,
    activeEvent: store.activeEvent,
    activeArtifactIds: store.activeArtifactIds,
    panels: store.panels,

    // Plan
    plan: store.currentPlan,
    planTasks,

    // Execution
    execution: store.execution,

    // Compliance
    compliance: store.complianceReport,

    // UI
    activePanelId: store.ui.activePanelId,
    error: store.ui.error,

    // Actions
    processEvent,
    setActivePanel: store.setActivePanel,
    togglePanelVisibility,
    setPanelCollapsed: store.setPanelCollapsed,
    resetWorkspace: store.resetWorkspace,

    // Execution Actions
    startExecution: store.startExecution,
    pauseExecution: store.pauseExecution,
    resumeExecution: store.resumeExecution,
    addStep,

    // Plan Actions
    setPlan: store.setPlan,
    updateTask: store.updatePlanTask,

    // Compliance
    setCompliance,

    // Artifact Actions
    createArtifact,
    updateArtifact,
    getArtifact,

    // Event Bus
    subscribe,
    publish,

    // Memory
    addLearningEvent: memory.addLearningEvent,
    getActiveRecommendations: memory.getActiveRecommendations,

    // Sync
    lastSyncEvent: lastEvent,
  };
}

