import { useFlowOperations } from "@/hooks/useFlowOperations";
import { useAutoLayout } from "./useAutoLayout";
import { useNodeOperations } from "./useNodeOperations";
import { useSelection } from "./useSelection";
import { useViewportOperations } from "./useViewportOperations";
import { useCallback } from "react";

interface FlowNodeData {
  label: string;
  [key: string]: unknown;
}

/**
 * A comprehensive hook that combines all flow-related functionality:
 * - Core flow operations (CRUD, undo/redo, persistence)
 * - Layout (auto-layout, distribution)
 * - Node operations (duplicate, align)
 * - Selection
 * - Viewport controls
 */
export function useFlow() {
  // Core operations
  const flowOps = useFlowOperations() as any;

  // Layout
  const layout = useAutoLayout();

  // Node operations
  const nodeOps = useNodeOperations();

  // Viewport
  const viewport = useViewportOperations({ snapToGrid: true as any, gridSize: 15 });

  // Selection – uses the same nodes/edges from flowOps
  const selection = useSelection({
    nodes: flowOps.nodes,
    edges: flowOps.edges,
  });

  // Combined actions
  const resetFlow = useCallback(() => {
    flowOps.clear?.();
  }, [flowOps]);

  const getSelectedNodes = useCallback(() => {
    return flowOps.nodes.filter((n: any) => selection.selectedNodeIds.includes(n.id));
  }, [flowOps.nodes, selection.selectedNodeIds]);

  const getSelectedEdges = useCallback(() => {
    return flowOps.edges.filter((e: any) => selection.selectedEdgeIds.includes(e.id));
  }, [flowOps.edges, selection.selectedEdgeIds]);

  return {
    // ── Core ──────────────────────────────────────────────────────────────
    nodes: flowOps.nodes,
    edges: flowOps.edges,
    isDirty: flowOps.isDirty,
    currentId: flowOps.currentId,

    // ── Node CRUD ────────────────────────────────────────────────────────
    addNode: flowOps.addNode,
    updateNode: flowOps.updateNode,
    deleteNode: flowOps.deleteNode,
    deleteNodes: flowOps.deleteNodes,

    // ── Edge CRUD ────────────────────────────────────────────────────────
    addEdge: flowOps.addEdge,
    updateEdge: flowOps.updateEdge,
    deleteEdge: flowOps.deleteEdge,

    // ── React Flow callbacks ────────────────────────────────────────────
    onNodesChange: flowOps.onNodesChange,
    onEdgesChange: flowOps.onEdgesChange,
    onConnect: flowOps.onConnect,

    // ── Undo/Redo ────────────────────────────────────────────────────────
    undo: flowOps.undo,
    redo: flowOps.redo,
    canUndo: flowOps.canUndo,
    canRedo: flowOps.canRedo,

    // ── Persistence ──────────────────────────────────────────────────────
    saveFlow: flowOps.save,
    loadFlow: flowOps.loadFlow,
    exportFlow: flowOps.exportFlow,
    importFlow: flowOps.importFlow,

    // ── Clipboard ────────────────────────────────────────────────────────
    copySelected: flowOps.copySelected,
    pasteClipboard: flowOps.pasteClipboard,
    clearClipboard: flowOps.clearClipboard,

    // ── Reset ────────────────────────────────────────────────────────────
    resetFlow,

    // ── Layout ────────────────────────────────────────────────────────────
    layout: {
      default: layout.layoutDefault,
      hierarchical: layout.layoutHierarchical,
      force: layout.layoutForce,
      isLayoutable: layout.isLayoutable,
    },

    // ── Node Operations ──────────────────────────────────────────────────
    nodeOps: {
      getNode: nodeOps.getNode,
      getNodesByType: nodeOps.getNodesByType,
      duplicateNode: nodeOps.duplicateNode,
      duplicateNodes: nodeOps.duplicateNodes,
      alignNodes: nodeOps.alignNodes,
    },

    // ── Selection ─────────────────────────────────────────────────────────
    selection: {
      selectedNodeIds: selection.selectedNodeIds,
      selectedEdgeIds: selection.selectedEdgeIds,
      selectedNodes: selection.selectedNodes,
      selectedEdges: selection.selectedEdges,
      selectNode: selection.selectNode,
      selectEdge: selection.selectEdge,
      selectAll: selection.selectAll,
      clearSelection: selection.clearSelection,
      selectNodes: selection.selectNodes,
      selectEdges: selection.selectEdges,
      getSelectedNodes,
      getSelectedEdges,
    },

    // ── Viewport ──────────────────────────────────────────────────────────
    viewport: {
      fit: viewport.fit,
      zoomIn: viewport.zoomIn,
      zoomOut: viewport.zoomOut,
      zoomTo: viewport.zoomTo,
      centerView: viewport.centerView,
      snapPosition: viewport.snapPosition,
      getViewport: viewport.getViewport,
    },
  };
}

