/**
 * Selector hooks for the unified workflow store.
 * Provides granular subscriptions to avoid unnecessary re-renders.
 */
import { useWorkflowStore, type WorkflowStore, type FlowNode, type FlowEdge, type FlowNodeData, type FlowEdgeData, type CanvasSettings, type LayoutDirection, type LayoutAlgorithm } from "@/lib/zustand/workflow-store";
import { type Viewport, type FitViewOptions, type XYPosition, type NodeChange, type EdgeChange, type Connection } from "@xyflow/react";

// ── Granular Selectors ──────────────────────────────────────────────────────

export const useNodes = () => useWorkflowStore((s) => s.nodes);
export const useEdges = () => useWorkflowStore((s) => s.edges);
export const useIsDirty = () => useWorkflowStore((s) => s.isDirty);
export const useCurrentId = () => useWorkflowStore((s) => s.currentId);

export const useSelectedNodeIds = () => useWorkflowStore((s) => s.selectedNodeIds);
export const useSelectedEdgeIds = () => useWorkflowStore((s) => s.selectedEdgeIds);
export const useSelectedNodes = () => useWorkflowStore((s) => s.selectedNodes());
export const useSelectedEdges = () => useWorkflowStore((s) => s.selectedEdges());
export const useHasSelection = () => useWorkflowStore((s) => s.hasSelection());

export const useViewport = () => useWorkflowStore((s) => s.viewport);
export const useCanvasSettings = () => useWorkflowStore((s) => s.settings);

export const useCanUndo = () => useWorkflowStore((s) => s.canUndo());
export const useCanRedo = () => useWorkflowStore((s) => s.canRedo());
export const useHasClipboard = () => useWorkflowStore((s) => s.hasClipboard());

export const useExecutionStatus = () => useWorkflowStore((s) => s.executionStatus);
export const useIsExecuting = () => useWorkflowStore((s) => s.isExecuting);
export const useExecutingNodeIds = () => useWorkflowStore((s) => s.executingNodeIds);

// ── Actions ─────────────────────────────────────────────────────────────────

export const useWorkflowActions = () =>
  useWorkflowStore((s) => ({
    // Core
    onNodesChange: s.onNodesChange,
    onEdgesChange: s.onEdgesChange,
    onConnect: s.onConnect,

    // Node CRUD
    addNode: s.addNode,
    updateNode: s.updateNode,
    deleteNode: s.deleteNode,
    deleteNodes: s.deleteNodes,
    duplicateNodes: s.duplicateNodes,

    // Edge CRUD
    updateEdge: s.updateEdge,
    deleteEdge: s.deleteEdge,

    // Selection
    selectNode: s.selectNode,
    selectEdge: s.selectEdge,
    selectAll: s.selectAll,
    clearSelection: s.clearSelection,
    setSelectedNodes: s.setSelectedNodes,
    setSelectedEdges: s.setSelectedEdges,

    // Viewport
    setViewport: s.setViewport,
    zoomIn: s.zoomIn,
    zoomOut: s.zoomOut,
    zoomTo: s.zoomTo,
    fitView: s.fitView,
    centerOnNode: s.centerOnNode,

    // Settings
    updateSettings: s.updateSettings,
    toggleSnap: s.toggleSnap,
    toggleGrid: s.toggleGrid,

    // History
    undo: s.undo,
    redo: s.redo,
    resetHistory: s.resetHistory,

    // Clipboard
    copySelected: s.copySelected,
    pasteClipboard: s.pasteClipboard,
    cutSelected: s.cutSelected,
    clearClipboard: s.clearClipboard,

    // Layout
    setLayoutDirection: s.setLayoutDirection,
    setLayoutAlgorithm: s.setLayoutAlgorithm,

    // Execution
    startExecution: s.startExecution,
    pauseExecution: s.pauseExecution,
    resumeExecution: s.resumeExecution,
    completeExecution: s.completeExecution,
    failExecution: s.failExecution,
    setExecutingNodes: s.setExecutingNodes,

    // Persistence
    saveFlow: s.saveFlow,
    loadFlow: s.loadFlow,
    loadTemplate: s.loadTemplate,
    exportFlow: s.exportFlow,
    importFlow: s.importFlow,
    clearFlow: s.clearFlow,

    // Utils
    getNode: s.getNode,
    getEdge: s.getEdge,
    pushHistory: s.pushHistory,
  }));

