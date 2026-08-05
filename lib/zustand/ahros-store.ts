/**
 * AHROS Workspace Store — Central Zustand store for the Agentic Workspace.
 *
 * Manages:
 *  - Active artifacts and their synchronization
 *  - Workspace layout/panel configuration
 *  - Execution state (running, paused, failed)
 *  - Integration with event bus
 *  - Business event processing pipeline
 */

import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import {
  getArtifactRegistry,
  type ArtifactRegistry,
} from "@/lib/ahros/artifact-registry";
import { getEventBus, type EventBus } from "@/lib/ahros/event-bus";
import type {
  ArtifactRecord,
  ArtifactType,
  BusinessEvent,
  BusinessEventType,
  ExecutionState,
  ExecutionStep,
  PanelConfig,
  PanelId,
  Plan,
  PlanTask,
  WorkspaceConfig,
  ComplianceReport,
  ComplianceCheck,
} from "@/lib/ahros/types";

// ─── Types ───────────────────────────────────────────────────────────────────

export type WorkspaceStatus =
  | "idle"
  | "processing"
  | "executing"
  | "paused"
  | "completed"
  | "error";

export interface WorkspaceUIState {
  activePanelId: PanelId;
  sidebarCollapsed: boolean;
  floatingArtifactIds: string[];
  streamingContent: Record<string, string>;
  error: string | null;
}

export interface AhrosStore {
  // ── Registry & Bus ──────────────────────────────────────────────────────
  registry: ArtifactRegistry;
  bus: EventBus;

  // ── Workspace Config ────────────────────────────────────────────────────
  config: WorkspaceConfig;
  updateConfig: (partial: Partial<WorkspaceConfig>) => void;

  // ── Panels ──────────────────────────────────────────────────────────────
  panels: PanelConfig[];
  setPanelVisibility: (panelId: PanelId, visible: boolean) => void;
  setPanelCollapsed: (panelId: PanelId, collapsed: boolean) => void;
  reorderPanels: (panelIds: PanelId[]) => void;

  // ── UI State ────────────────────────────────────────────────────────────
  ui: WorkspaceUIState;
  setActivePanel: (panelId: PanelId) => void;
  toggleSidebar: () => void;
  setStreamingContent: (artifactId: string, content: string) => void;
  appendStreamingContent: (artifactId: string, chunk: string) => void;
  clearStreamingContent: (artifactId: string) => void;
  setError: (error: string | null) => void;

  // ── Active Business Event ───────────────────────────────────────────────
  activeEvent: BusinessEvent | null;
  setActiveEvent: (event: BusinessEvent | null) => void;

  // ── Active Artifacts ────────────────────────────────────────────────────
  activeArtifactIds: string[];
  registerArtifact: (artifactId: string) => void;
  unregisterArtifact: (artifactId: string) => void;
  clearActiveArtifacts: () => void;

  // ── Execution State ─────────────────────────────────────────────────────
  execution: ExecutionState | null;
  status: WorkspaceStatus;
  setStatus: (status: WorkspaceStatus) => void;
  initExecution: (businessEventId: string, planId: string) => void;
  startExecution: () => void;
  pauseExecution: () => void;
  resumeExecution: () => void;
  completeExecution: () => void;
  failExecution: (error?: string) => void;
  addExecutionStep: (step: ExecutionStep) => void;
  updateExecutionStep: (
    stepId: string,
    updates: Partial<ExecutionStep>,
  ) => void;
  addExecutionLog: (log: string) => void;

  // ── Plan ────────────────────────────────────────────────────────────────
  currentPlan: Plan | null;
  setPlan: (plan: Plan) => void;
  updatePlanTask: (taskId: string, updates: Partial<PlanTask>) => void;

  // ── Compliance ──────────────────────────────────────────────────────────
  complianceReport: ComplianceReport | null;
  setComplianceReport: (report: ComplianceReport) => void;

  // ── Actions ─────────────────────────────────────────────────────────────
  processBusinessEvent: (event: BusinessEvent) => Promise<void>;
  resetWorkspace: () => void;
}

// ─── Defaults ────────────────────────────────────────────────────────────────

const DEFAULT_PANELS: PanelConfig[] = [
  { id: "conversation", label: "Conversation", visible: true, order: 0, position: "left" },
  { id: "workflow", label: "Workflow", visible: true, order: 1, position: "center" },
  { id: "reasoning", label: "Reasoning", visible: true, order: 2, position: "right" },
  { id: "timeline", label: "Timeline", visible: true, order: 3, position: "bottom" },
  { id: "planning", label: "Planning", visible: true, order: 4, position: "right", collapsed: true },
  { id: "compliance", label: "Compliance", visible: true, order: 5, position: "right", collapsed: true },
  { id: "knowledge", label: "Knowledge Tree", visible: false, order: 6, position: "floating" },
  { id: "sandbox", label: "Sandbox", visible: false, order: 7, position: "floating" },
  { id: "memory", label: "Memory", visible: false, order: 8, position: "floating" },
];

const DEFAULT_UI: WorkspaceUIState = {
  activePanelId: "conversation",
  sidebarCollapsed: false,
  floatingArtifactIds: [],
  streamingContent: {},
  error: null,
};

const DEFAULT_CONFIG: WorkspaceConfig = {
  id: "default",
  name: "AI Workspace",
  panels: DEFAULT_PANELS,
  autoSave: true,
};

// ─── Store ───────────────────────────────────────────────────────────────────

export const useAhrosStore = create<AhrosStore>()(
  subscribeWithSelector((set, get) => ({
    // ── Registry & Bus ──────────────────────────────────────────────────
    registry: getArtifactRegistry(),
    bus: getEventBus(),

    // ── Workspace Config ────────────────────────────────────────────────
    config: DEFAULT_CONFIG,

    updateConfig: (partial) =>
      set((state) => ({ config: { ...state.config, ...partial } })),

    // ── Panels ──────────────────────────────────────────────────────────
    panels: DEFAULT_PANELS,

    setPanelVisibility: (panelId, visible) =>
      set((state) => ({
        panels: state.panels.map((p) =>
          p.id === panelId ? { ...p, visible } : p,
        ),
      })),

    setPanelCollapsed: (panelId, collapsed) =>
      set((state) => ({
        panels: state.panels.map((p) =>
          p.id === panelId ? { ...p, collapsed } : p,
        ),
      })),

    reorderPanels: (panelIds) =>
      set((state) => {
        const panelMap = new Map(state.panels.map((p) => [p.id, p]));
        return {
          panels: panelIds
            .map((id, index) => {
              const panel = panelMap.get(id);
              return panel ? { ...panel, order: index } : null;
            })
            .filter(Boolean) as PanelConfig[],
        };
      }),

    // ── UI State ────────────────────────────────────────────────────────
    ui: DEFAULT_UI,

    setActivePanel: (panelId) =>
      set((state) => ({ ui: { ...state.ui, activePanelId: panelId } })),

    toggleSidebar: () =>
      set((state) => ({
        ui: { ...state.ui, sidebarCollapsed: !state.ui.sidebarCollapsed },
      })),

    setStreamingContent: (artifactId, content) =>
      set((state) => ({
        ui: {
          ...state.ui,
          streamingContent: { ...state.ui.streamingContent, [artifactId]: content },
        },
      })),

    appendStreamingContent: (artifactId, chunk) =>
      set((state) => ({
        ui: {
          ...state.ui,
          streamingContent: {
            ...state.ui.streamingContent,
            [artifactId]:
              (state.ui.streamingContent[artifactId] ?? "") + chunk,
          },
        },
      })),

    clearStreamingContent: (artifactId) =>
      set((state) => {
        const { [artifactId]: _remove, ...rest } = state.ui.streamingContent;
        return { ui: { ...state.ui, streamingContent: rest } };
      }),

    setError: (error) =>
      set((state) => ({ ui: { ...state.ui, error } })),

    // ── Active Business Event ───────────────────────────────────────────
    activeEvent: null,

    setActiveEvent: (event) => set({ activeEvent: event }),

    // ── Active Artifacts ────────────────────────────────────────────────
    activeArtifactIds: [],

    registerArtifact: (artifactId) =>
      set((state) => ({
        activeArtifactIds: state.activeArtifactIds.includes(artifactId)
          ? state.activeArtifactIds
          : [...state.activeArtifactIds, artifactId],
      })),

    unregisterArtifact: (artifactId) =>
      set((state) => ({
        activeArtifactIds: state.activeArtifactIds.filter(
          (id) => id !== artifactId,
        ),
      })),

    clearActiveArtifacts: () => set({ activeArtifactIds: [] }),

    // ── Execution State ─────────────────────────────────────────────────
    execution: null,
    status: "idle",

    setStatus: (status) => set({ status }),

    initExecution: (businessEventId, planId) =>
      set({
        execution: {
          id: uuidv4(),
          businessEventId,
          planId,
          status: "idle",
          currentStepIndex: 0,
          steps: [],
          logs: [`[${new Date().toISOString()}] Execution initialized`],
        },
        status: "idle",
      }),

    startExecution: () =>
      set((state) => {
        if (!state.execution) return state;
        return {
          execution: {
            ...state.execution,
            status: "running",
            logs: [
              ...state.execution.logs,
              `[${new Date().toISOString()}] Execution started`,
            ],
          },
          status: "executing",
        };
      }),

    pauseExecution: () =>
      set((state) => {
        if (!state.execution) return state;
        return {
          execution: {
            ...state.execution,
            status: "paused",
            logs: [
              ...state.execution.logs,
              `[${new Date().toISOString()}] Execution paused`,
            ],
          },
          status: "paused",
        };
      }),

    resumeExecution: () =>
      set((state) => {
        if (!state.execution) return state;
        return {
          execution: {
            ...state.execution,
            status: "running",
            logs: [
              ...state.execution.logs,
              `[${new Date().toISOString()}] Execution resumed`,
            ],
          },
          status: "executing",
        };
      }),

    completeExecution: () =>
      set((state) => {
        if (!state.execution) return state;
        const now = new Date();
        return {
          execution: {
            ...state.execution,
            status: "completed",
            completedAt: now,
            logs: [
              ...state.execution.logs,
              `[${now.toISOString()}] Execution completed`,
            ],
          },
          status: "completed",
        };
      }),

    failExecution: (error) =>
      set((state) => {
        if (!state.execution) return state;
        const now = new Date();
        return {
          execution: {
            ...state.execution,
            status: "failed",
            completedAt: now,
            logs: [
              ...state.execution.logs,
              `[${now.toISOString()}] Execution failed: ${error ?? "Unknown error"}`,
            ],
          },
          status: "error",
          ui: { ...state.ui, error: error ?? "Execution failed" },
        };
      }),

    addExecutionStep: (step) =>
      set((state) => {
        if (!state.execution) return state;
        return {
          execution: {
            ...state.execution,
            steps: [...state.execution.steps, step],
          },
        };
      }),

    updateExecutionStep: (stepId, updates) =>
      set((state) => {
        if (!state.execution) return state;
        return {
          execution: {
            ...state.execution,
            steps: state.execution.steps.map((s) =>
              s.id === stepId ? { ...s, ...updates } : s,
            ),
          },
        };
      }),

    addExecutionLog: (log) =>
      set((state) => {
        if (!state.execution) return state;
        return {
          execution: {
            ...state.execution,
            logs: [
              ...state.execution.logs,
              `[${new Date().toISOString()}] ${log}`,
            ],
          },
        };
      }),

    // ── Plan ────────────────────────────────────────────────────────────
    currentPlan: null,

    setPlan: (plan) => set({ currentPlan: plan }),

    updatePlanTask: (taskId, updates) =>
      set((state) => {
        if (!state.currentPlan) return state;
        return {
          currentPlan: {
            ...state.currentPlan,
            tasks: state.currentPlan.tasks.map((t) =>
              t.id === taskId ? { ...t, ...updates } : t,
            ),
          },
        };
      }),

    // ── Compliance ──────────────────────────────────────────────────────
    complianceReport: null,

    setComplianceReport: (report) => set({ complianceReport: report }),

    // ── Actions ─────────────────────────────────────────────────────────
    processBusinessEvent: async (event) => {
      const state = get();
      const { registry, bus } = state;

      set({ activeEvent: event, status: "processing" });

      // 1. Create conversation artifact
      const conversationArtifact = registry.create(
        "conversation",
        `Conversation: ${event.title}`,
        { event, messages: [] },
        { tags: [event.type] },
      );
      state.registerArtifact(conversationArtifact.meta.id);

      // 2. Publish event to bus
      await bus.publish({
        type: "EXECUTION_STARTED",
        artifactId: conversationArtifact.meta.id,
        artifactType: "conversation",
        payload: { event },
        source: "ahros-store",
      });

      set({ status: "idle" });
    },

    resetWorkspace: () =>
      set({
        activeEvent: null,
        activeArtifactIds: [],
        execution: null,
        status: "idle",
        currentPlan: null,
        complianceReport: null,
        ui: DEFAULT_UI,
      }),
  })),
);
