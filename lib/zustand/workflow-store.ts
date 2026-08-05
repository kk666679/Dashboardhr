/**
 * Unified Workflow Store — Single source of truth for all Automation state.
 *
 * Consolidates:
 *  - useFlowOperations   → nodes, edges, CRUD, persistence
 *  - useCanvas           → viewport, settings, selection
 *  - useSelection        → selected node/edge IDs
 *  - useViewportOperations → zoom, fit, center
 *  - useClipboard        → copy/paste
 *  - useUndoRedo         → history stack
 *  - useAutoLayout       → layout engine interface
 *
 * @see /docs/ARCHITECTURE.md — State Management Architecture
 */

import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import {
  type Node,
  type Edge,
  type Connection,
  type Viewport,
  applyNodeChanges,
  applyEdgeChanges,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  type NodeChange,
  type EdgeChange,
  MarkerType,
  type FitViewOptions,
  type XYPosition,
} from "@xyflow/react";
import { v4 as uuidv4 } from "uuid";

// ──────────────────────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────────────────────

export type FlowNodeData = Record<string, unknown> & {
  label?: string;
  description?: string;
};

export type FlowEdgeData = Record<string, unknown> & {
  label?: string;
  status?: "pending" | "running" | "completed" | "failed";
};

export type FlowNode = Node<FlowNodeData>;
export type FlowEdge = Edge<FlowEdgeData>;

export interface FlowSnapshot {
  nodes: FlowNode[];
  edges: FlowEdge[];
}

export interface CanvasSettings {
  gridSize: number;
  snapEnabled: boolean;
  gridEnabled: boolean;
  zoomMin: number;
  zoomMax: number;
  showBackground: boolean;
  showMiniMap: boolean;
  showControls: boolean;
  backgroundVariant: "dots" | "lines" | "cross";
}

export type LayoutDirection = "TB" | "LR" | "RL" | "BT";
export type LayoutAlgorithm = "default" | "hierarchical" | "force" | "grid";

interface HistoryEntry {
  nodes: FlowNode[];
  edges: FlowEdge[];
}

interface ClipboardData {
  nodes: FlowNode[];
  edges: FlowEdge[];
}

// ──────────────────────────────────────────────────────────────────────────────
// Store Interface
// ──────────────────────────────────────────────────────────────────────────────

export interface WorkflowStore {
  // ── Flow State ──────────────────────────────────────────────────────────
  nodes: FlowNode[];
  edges: FlowEdge[];
  currentId: string | null;
  isDirty: boolean;

  // ── Selection ───────────────────────────────────────────────────────────
  selectedNodeIds: string[];
  selectedEdgeIds: string[];

  // ── Viewport ────────────────────────────────────────────────────────────
  viewport: Viewport;

  // ── Canvas Settings ─────────────────────────────────────────────────────
  settings: CanvasSettings;

  // ── History (Undo/Redo) ─────────────────────────────────────────────────
  history: HistoryEntry[];
  historyIndex: number;
  maxHistory: number;

  // ── Clipboard ───────────────────────────────────────────────────────────
  clipboard: ClipboardData | null;

  // ── Layout ──────────────────────────────────────────────────────────────
  layoutDirection: LayoutDirection;
  layoutAlgorithm: LayoutAlgorithm;

  // ── Execution State ─────────────────────────────────────────────────────
  isExecuting: boolean;
  executionStatus: "idle" | "running" | "paused" | "completed" | "failed";
  executingNodeIds: string[];

  // ════════════════════════════════════════════════════════════════════════
  // Actions
  // ════════════════════════════════════════════════════════════════════════

  // ── Core Actions ────────────────────────────────────────────────────────
  setNodes: (nodes: FlowNode[]) => void;
  setEdges: (edges: FlowEdge[]) => void;
  onNodesChange: OnNodesChange<FlowNode>;
  onEdgesChange: OnEdgesChange<FlowEdge>;
  onConnect: OnConnect;
  pushHistory: () => void;

  // ── Node CRUD ───────────────────────────────────────────────────────────
  addNode: (type: string, data?: FlowNodeData, position?: XYPosition) => FlowNode;
  updateNode: (id: string, data: Partial<FlowNodeData> & { position?: XYPosition }) => void;
  deleteNode: (id: string) => void;
  deleteNodes: (ids: string[]) => void;
  duplicateNodes: (ids: string[], offset?: XYPosition) => FlowNode[];

  // ── Edge CRUD ───────────────────────────────────────────────────────────
  updateEdge: (id: string, data: Partial<FlowEdgeData>) => void;
  deleteEdge: (id: string) => void;

  // ── Selection ───────────────────────────────────────────────────────────
  selectNode: (id: string, multi?: boolean) => void;
  selectEdge: (id: string, multi?: boolean) => void;
  selectAll: () => void;
  clearSelection: () => void;
  setSelectedNodes: (ids: string[]) => void;
  setSelectedEdges: (ids: string[]) => void;

  // ── Viewport ────────────────────────────────────────────────────────────
  setViewport: (viewport: Partial<Viewport>) => void;
  zoomIn: (amount?: number) => void;
  zoomOut: (amount?: number) => void;
  zoomTo: (level: number) => void;
  fitView: (options?: FitViewOptions) => void;
  centerOnNode: (nodeId: string) => void;

  // ── Settings ────────────────────────────────────────────────────────────
  updateSettings: (settings: Partial<CanvasSettings>) => void;
  toggleSnap: () => void;
  toggleGrid: () => void;

  // ── History ─────────────────────────────────────────────────────────────
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  resetHistory: () => void;

  // ── Clipboard ───────────────────────────────────────────────────────────
  copySelected: () => void;
  pasteClipboard: (position?: XYPosition) => void;
  cutSelected: () => void;
  clearClipboard: () => void;
  hasClipboard: () => boolean;

  // ── Layout ──────────────────────────────────────────────────────────────
  setLayoutDirection: (direction: LayoutDirection) => void;
  setLayoutAlgorithm: (algorithm: LayoutAlgorithm) => void;

  // ── Execution ───────────────────────────────────────────────────────────
  startExecution: () => void;
  pauseExecution: () => void;
  resumeExecution: () => void;
  completeExecution: () => void;
  failExecution: () => void;
  setExecutingNodes: (nodeIds: string[]) => void;

  // ── Persistence ─────────────────────────────────────────────────────────
  saveFlow: (name?: string) => string;
  loadFlow: (id: string) => boolean;
  loadTemplate: (templateId: string) => void;
  exportFlow: () => void;
  importFlow: (file: File) => void;
  clearFlow: () => void;
  getSavedFlows: () => { id: string; name: string }[];

  // ── Utilities ───────────────────────────────────────────────────────────
  getNode: (id: string) => FlowNode | undefined;
  getEdge: (id: string) => FlowEdge | undefined;
  getNodesByType: (type: string) => FlowNode[];
  getConnectedEdges: (nodeId: string) => FlowEdge[];
  hasSelection: () => boolean;
  selectedNodes: () => FlowNode[];
  selectedEdges: () => FlowEdge[];
}

// ──────────────────────────────────────────────────────────────────────────────
// Defaults
// ──────────────────────────────────────────────────────────────────────────────

const DEFAULT_SETTINGS: CanvasSettings = {
  gridSize: 15,
  snapEnabled: true,
  gridEnabled: true,
  zoomMin: 0.2,
  zoomMax: 2,
  showBackground: true,
  showMiniMap: true,
  showControls: true,
  backgroundVariant: "dots",
};

const DEFAULT_VIEWPORT: Viewport = { x: 0, y: 0, zoom: 1 };

// ──────────────────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────────────────

const createEdgeId = (source: string, target: string) => `e-${source}-${target}`;

const defaultEdge = (source: string, target: string): FlowEdge => ({
  id: uuidv4(),
  source,
  target,
  type: "smoothstep",
  markerEnd: { type: MarkerType.ArrowClosed, color: "#64748b" },
});

/**
 * Returns a viewport reference for the currently mounted ReactFlow instance.
 * Set by EnhancedFlowCanvas via ReactFlow's setViewport ref.
 */
let flowViewportApi: {
  fitView: (opts?: FitViewOptions) => void;
  zoomIn: (opts?: { duration?: number }) => void;
  zoomOut: (opts?: { duration?: number }) => void;
  zoomTo: (level: number, opts?: { duration?: number }) => void;
  setViewport: (vp: Viewport, opts?: { duration?: number }) => void;
  getViewport: () => Viewport;
} | null = null;

export function setFlowViewportApi(api: typeof flowViewportApi) {
  flowViewportApi = api;
}

// ──────────────────────────────────────────────────────────────────────────────
// Store
// ──────────────────────────────────────────────────────────────────────────────

export const useWorkflowStore = create<WorkflowStore>()(
  subscribeWithSelector((set, get) => ({
    // ── Initial State ─────────────────────────────────────────────────────
    nodes: [],
    edges: [],
    currentId: null,
    isDirty: false,

    selectedNodeIds: [],
    selectedEdgeIds: [],

    viewport: DEFAULT_VIEWPORT,

    settings: DEFAULT_SETTINGS,

    history: [],
    historyIndex: -1,
    maxHistory: 50,

    clipboard: null,

    layoutDirection: "TB",
    layoutAlgorithm: "default",

    isExecuting: false,
    executionStatus: "idle",
    executingNodeIds: [],

    // ── Core Actions ─────────────────────────────────────────────────────

    setNodes: (nodes) => set({ nodes }),
    setEdges: (edges) => set({ edges }),

    onNodesChange: (changes: NodeChange[]) => {
      set((state) => ({
        nodes: applyNodeChanges(changes, state.nodes) as FlowNode[],
        isDirty: true,
      }));
    },

    onEdgesChange: (changes: EdgeChange[]) => {
      set((state) => ({
        edges: applyEdgeChanges(changes, state.edges),
        isDirty: true,
      }));
    },

    onConnect: (connection: Connection) => {
      if (!connection.source || !connection.target) return;
      const state = get();
      const newEdge = {
        ...defaultEdge(connection.source, connection.target),
        sourceHandle: connection.sourceHandle ?? undefined,
        targetHandle: connection.targetHandle ?? undefined,
      };
      set({ edges: [...state.edges, newEdge], isDirty: true });
    },

    pushHistory: () => {
      const { nodes, edges, history, historyIndex, maxHistory } = get();
      const entry: HistoryEntry = {
        nodes: JSON.parse(JSON.stringify(nodes)),
        edges: JSON.parse(JSON.stringify(edges)),
      };
      const truncated = history.slice(0, historyIndex + 1);
      truncated.push(entry);
      if (truncated.length > maxHistory) truncated.shift();
      set({ history: truncated, historyIndex: truncated.length - 1 });
    },

    // ── Node CRUD ─────────────────────────────────────────────────────────

    addNode: (type, data = {}, position) => {
      const state = get();
      const id = uuidv4();
      const node: FlowNode = {
        id,
        type,
        position: position ?? {
          x: Math.random() * 400 + 100,
          y: Math.random() * 300 + 100,
        },
        data: {
          label: data.label ?? type.charAt(0).toUpperCase() + type.slice(1),
          description: data.description ?? "",
          ...data,
        },
      };
      set({ nodes: [...state.nodes, node], isDirty: true });
      return node;
    },

    updateNode: (id, updates) => {
      set((state) => ({
        nodes: state.nodes.map((n) => {
          if (n.id !== id) return n;
          const { position, ...dataFields } = updates;
          return {
            ...n,
            ...(position !== undefined ? { position } : {}),
            data: { ...n.data, ...dataFields },
          };
        }),
        isDirty: true,
      }));
    },

    deleteNode: (id) => {
      set((state) => ({
        nodes: state.nodes.filter((n) => n.id !== id),
        edges: state.edges.filter((e) => e.source !== id && e.target !== id),
        selectedNodeIds: state.selectedNodeIds.filter((nid) => nid !== id),
        isDirty: true,
      }));
    },

    deleteNodes: (ids) => {
      const idSet = new Set(ids);
      set((state) => ({
        nodes: state.nodes.filter((n) => !idSet.has(n.id)),
        edges: state.edges.filter((e) => !idSet.has(e.source) && !idSet.has(e.target)),
        selectedNodeIds: state.selectedNodeIds.filter((nid) => !idSet.has(nid)),
        isDirty: true,
      }));
    },

    duplicateNodes: (ids, offset = { x: 40, y: 40 }) => {
      const state = get();
      const idMap: Record<string, string> = {};
      const newNodes: FlowNode[] = [];

      ids.forEach((id) => {
        const original = state.nodes.find((n) => n.id === id);
        if (!original) return;
        const newId = uuidv4();
        idMap[id] = newId;
        newNodes.push({
          ...original,
          id: newId,
          position: {
            x: original.position.x + offset.x,
            y: original.position.y + offset.y,
          },
          data: { ...original.data, label: `${original.data?.label ?? "Copy"} (Copy)` },
          selected: false,
        });
      });

      const newEdges: FlowEdge[] = [];
      state.edges.forEach((e) => {
        if (ids.includes(e.source) && ids.includes(e.target)) {
          newEdges.push({
            ...e,
            id: uuidv4(),
            source: idMap[e.source],
            target: idMap[e.target],
          });
        }
      });

      set({
        nodes: [...state.nodes, ...newNodes],
        edges: [...state.edges, ...newEdges],
        isDirty: true,
      });
      return newNodes;
    },

    // ── Edge CRUD ─────────────────────────────────────────────────────────

    updateEdge: (id, data) => {
      set((state) => ({
        edges: state.edges.map((e) =>
          e.id === id ? { ...e, ...data } : e
        ),
        isDirty: true,
      }));
    },

    deleteEdge: (id) => {
      set((state) => ({
        edges: state.edges.filter((e) => e.id !== id),
        selectedEdgeIds: state.selectedEdgeIds.filter((eid) => eid !== id),
        isDirty: true,
      }));
    },

    // ── Selection ─────────────────────────────────────────────────────────

    selectNode: (id, multi = false) => {
      set((state) => {
        if (multi) {
          const exists = state.selectedNodeIds.includes(id);
          return {
            selectedNodeIds: exists
              ? state.selectedNodeIds.filter((n) => n !== id)
              : [...state.selectedNodeIds, id],
          };
        }
        return { selectedNodeIds: [id], selectedEdgeIds: [] };
      });
    },

    selectEdge: (id, multi = false) => {
      set((state) => {
        if (multi) {
          const exists = state.selectedEdgeIds.includes(id);
          return {
            selectedEdgeIds: exists
              ? state.selectedEdgeIds.filter((e) => e !== id)
              : [...state.selectedEdgeIds, id],
          };
        }
        return { selectedEdgeIds: [id], selectedNodeIds: [] };
      });
    },

    selectAll: () => {
      const { nodes, edges } = get();
      set({
        selectedNodeIds: nodes.map((n) => n.id),
        selectedEdgeIds: edges.map((e) => e.id),
      });
    },

    clearSelection: () => {
      set({ selectedNodeIds: [], selectedEdgeIds: [] });
    },

    setSelectedNodes: (ids) => set({ selectedNodeIds: ids }),
    setSelectedEdges: (ids) => set({ selectedEdgeIds: ids }),

    // ── Viewport ──────────────────────────────────────────────────────────

    setViewport: (vp) => {
      set((state) => ({ viewport: { ...state.viewport, ...vp } }));
      flowViewportApi?.setViewport({ ...get().viewport, ...vp });
    },

    zoomIn: (amount = 0.2) => {
      flowViewportApi?.zoomIn({ duration: 150 });
    },

    zoomOut: (amount = 0.2) => {
      flowViewportApi?.zoomOut({ duration: 150 });
    },

    zoomTo: (level) => {
      flowViewportApi?.zoomTo(level, { duration: 200 });
    },

    fitView: (options) => {
      flowViewportApi?.fitView({ padding: 0.2, duration: 200, ...options });
    },

    centerOnNode: (nodeId) => {
      const node = get().nodes.find((n) => n.id === nodeId);
      if (node && flowViewportApi) {
        const vp = flowViewportApi.getViewport();
        flowViewportApi.setViewport(
          { x: -node.position.x * vp.zoom + window.innerWidth / 2, y: -node.position.y * vp.zoom + 200, zoom: vp.zoom },
          { duration: 200 }
        );
      }
    },

    // ── Settings ──────────────────────────────────────────────────────────

    updateSettings: (partial) => {
      set((state) => ({ settings: { ...state.settings, ...partial } }));
    },

    toggleSnap: () => {
      set((state) => ({ settings: { ...state.settings, snapEnabled: !state.settings.snapEnabled } }));
    },

    toggleGrid: () => {
      set((state) => ({ settings: { ...state.settings, gridEnabled: !state.settings.gridEnabled } }));
    },

    // ── History ───────────────────────────────────────────────────────────

    undo: () => {
      const { historyIndex, history } = get();
      if (historyIndex < 0) return;
      const entry = history[historyIndex];
      if (!entry) return;
      set({
        nodes: JSON.parse(JSON.stringify(entry.nodes)),
        edges: JSON.parse(JSON.stringify(entry.edges)),
        historyIndex: historyIndex - 1,
      });
    },

    redo: () => {
      const { historyIndex, history } = get();
      if (historyIndex >= history.length - 2) return;
      const entry = history[historyIndex + 2];
      if (!entry) return;
      set({
        nodes: JSON.parse(JSON.stringify(entry.nodes)),
        edges: JSON.parse(JSON.stringify(entry.edges)),
        historyIndex: historyIndex + 1,
      });
    },

    canUndo: () => get().historyIndex >= 0,
    canRedo: () => get().historyIndex < get().history.length - 2,

    resetHistory: () => {
      set({ history: [], historyIndex: -1 });
    },

    // ── Clipboard ─────────────────────────────────────────────────────────

    copySelected: () => {
      const { selectedNodeIds, nodes, edges } = get();
      const selectedNodes = nodes.filter((n) => selectedNodeIds.includes(n.id));
      const selectedEdges = edges.filter(
        (e) =>
          selectedNodeIds.includes(e.source) && selectedNodeIds.includes(e.target)
      );
      const data: ClipboardData = { nodes: selectedNodes, edges: selectedEdges };
      set({ clipboard: data });
      // Also write to native clipboard
      try {
        navigator.clipboard.writeText(JSON.stringify(data)).catch(() => {});
      } catch {}
    },

    pasteClipboard: (position) => {
      const { clipboard, nodes } = get();
      if (!clipboard || clipboard.nodes.length === 0) return;
      const offset = position ?? { x: 40, y: 40 };
      const idMap: Record<string, string> = {};
      const newNodes: FlowNode[] = clipboard.nodes.map((n) => {
        const newId = uuidv4();
        idMap[n.id] = newId;
        return {
          ...n,
          id: newId,
          position: {
            x: n.position.x + offset.x,
            y: n.position.y + offset.y,
          },
          data: { ...n.data },
          selected: false,
        };
      });
      const newEdges: FlowEdge[] = clipboard.edges.map((e) => ({
        ...e,
        id: uuidv4(),
        source: idMap[e.source] ?? e.source,
        target: idMap[e.target] ?? e.target,
      }));
      set((state) => ({
        nodes: [...state.nodes, ...newNodes],
        edges: [...state.edges, ...newEdges],
        isDirty: true,
        selectedNodeIds: newNodes.map((n) => n.id),
        selectedEdgeIds: newEdges.map((e) => e.id),
      }));
    },

    cutSelected: () => {
      const { selectedNodeIds, nodes, edges } = get();
      const cutNodes = nodes.filter((n) => selectedNodeIds.includes(n.id));
      const cutEdges = edges.filter(
        (e) => selectedNodeIds.includes(e.source) && selectedNodeIds.includes(e.target)
      );
      set({
        clipboard: { nodes: cutNodes, edges: cutEdges },
        nodes: nodes.filter((n) => !selectedNodeIds.includes(n.id)),
        edges: edges.filter(
          (e) => !selectedNodeIds.includes(e.source) && !selectedNodeIds.includes(e.target)
        ),
        selectedNodeIds: [],
        selectedEdgeIds: [],
        isDirty: true,
      });
    },

    clearClipboard: () => set({ clipboard: null }),
    hasClipboard: () => get().clipboard !== null && get().clipboard!.nodes.length > 0,

    // ── Layout ────────────────────────────────────────────────────────────

    setLayoutDirection: (direction) => set({ layoutDirection: direction }),
    setLayoutAlgorithm: (algorithm) => set({ layoutAlgorithm: algorithm }),

    // ── Execution ─────────────────────────────────────────────────────────

    startExecution: () => set({ isExecuting: true, executionStatus: "running", executingNodeIds: [] }),
    pauseExecution: () => set({ executionStatus: "paused" }),
    resumeExecution: () => set({ executionStatus: "running" }),
    completeExecution: () => set({ isExecuting: false, executionStatus: "completed", executingNodeIds: [] }),
    failExecution: () => set({ isExecuting: false, executionStatus: "failed", executingNodeIds: [] }),
    setExecutingNodes: (nodeIds) => set({ executingNodeIds: nodeIds }),

    // ── Persistence ───────────────────────────────────────────────────────

    saveFlow: (name) => {
      const { nodes, edges, currentId } = get();
      const id = currentId ?? `flow-${uuidv4().slice(0, 8)}`;
      const flowData = {
        nodes,
        edges,
        name: name || `Flow ${new Date().toLocaleString()}`,
        savedAt: new Date().toISOString(),
      };
      try {
        localStorage.setItem(id, JSON.stringify(flowData));
        const list = JSON.parse(localStorage.getItem("flow-list") || "[]");
        const existing = list.findIndex((l: { id: string }) => l.id === id);
        if (existing >= 0) {
          list[existing] = { id, name: flowData.name };
        } else {
          list.push({ id, name: flowData.name });
        }
        localStorage.setItem("flow-list", JSON.stringify(list));
      } catch (e) {
        console.error("Failed to save flow:", e);
      }
      set({ currentId: id, isDirty: false });
      return id;
    },

    loadFlow: (id) => {
      try {
        const raw = localStorage.getItem(id);
        if (!raw) return false;
        const data = JSON.parse(raw);
        const nodes = data.nodes ?? [];
        const edges = data.edges ?? [];
        set({
          nodes,
          edges,
          currentId: id,
          isDirty: false,
          selectedNodeIds: [],
          selectedEdgeIds: [],
          history: [{ nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) }],
          historyIndex: 0,
        });
        return true;
      } catch (e) {
        console.error("Failed to load flow:", e);
        return false;
      }
    },

    loadTemplate: (templateId) => {
      // Try to load from the real template registry first
      let nodes: FlowNode[];
      let edges: FlowEdge[];

      try {
        // Dynamic import avoided — registry is pure data, no side effects
        // We import lazily here to avoid bundling React Flow server-side
        const { getFlowTemplate } = require("@/lib/flow-templates");
        const tpl = getFlowTemplate(templateId);
        if (tpl && tpl.nodes.length > 0) {
          nodes = tpl.nodes as FlowNode[];
          edges = tpl.edges as FlowEdge[];
        } else {
          throw new Error("not found");
        }
      } catch {
        // Fallback: minimal 3-node scaffold
        const label = templateId
          .split("-")
          .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
          .join(" ");
        nodes = [
          { id: "start-1", type: "start",  position: { x: 80, y: 200 },  data: { label: "Start",    description: "Workflow start"    } },
          { id: "action-1", type: "action", position: { x: 320, y: 200 }, data: { label,             description: `${label} workflow` } },
          { id: "end-1",   type: "end",    position: { x: 600, y: 200 },  data: { label: "Complete", description: "Workflow complete" } },
        ];
        edges = [
          { id: "e-start-action", source: "start-1",  target: "action-1", type: "smoothstep" as const, markerEnd: { type: MarkerType.ArrowClosed, color: "#64748b" } },
          { id: "e-action-end",   source: "action-1", target: "end-1",    type: "smoothstep" as const, markerEnd: { type: MarkerType.ArrowClosed, color: "#64748b" } },
        ];
      }

      set({
        nodes,
        edges,
        currentId: null,
        isDirty: true,
        selectedNodeIds: [],
        selectedEdgeIds: [],
        history: [{ nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) }],
        historyIndex: 0,
      });
    },

    exportFlow: () => {
      const { nodes, edges } = get();
      const blob = new Blob([JSON.stringify({ nodes, edges }, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `flow-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    },

    importFlow: (file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          if (data.nodes && data.edges) {
            set({
              nodes: data.nodes,
              edges: data.edges,
              isDirty: false,
              selectedNodeIds: [],
              selectedEdgeIds: [],
              history: [{ nodes: JSON.parse(JSON.stringify(data.nodes)), edges: JSON.parse(JSON.stringify(data.edges)) }],
              historyIndex: 0,
            });
          }
        } catch (err) {
          console.error("Import error:", err);
        }
      };
      reader.readAsText(file);
    },

    clearFlow: () => {
      set({
        nodes: [],
        edges: [],
        currentId: null,
        isDirty: false,
        selectedNodeIds: [],
        selectedEdgeIds: [],
        history: [],
        historyIndex: -1,
        clipboard: null,
      });
    },

    getSavedFlows: () => {
      try {
        return JSON.parse(localStorage.getItem("flow-list") || "[]");
      } catch {
        return [];
      }
    },

    // ── Utilities ─────────────────────────────────────────────────────────

    getNode: (id) => get().nodes.find((n) => n.id === id),
    getEdge: (id) => get().edges.find((e) => e.id === id),
    getNodesByType: (type) => get().nodes.filter((n) => n.type === type),
    getConnectedEdges: (nodeId) =>
      get().edges.filter((e) => e.source === nodeId || e.target === nodeId),
    hasSelection: () =>
      get().selectedNodeIds.length > 0 || get().selectedEdgeIds.length > 0,
    selectedNodes: () =>
      get().nodes.filter((n) => get().selectedNodeIds.includes(n.id)),
    selectedEdges: () =>
      get().edges.filter((e) => get().selectedEdgeIds.includes(e.id)),
  }))
);

