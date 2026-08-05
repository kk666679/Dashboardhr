import { useAutoLayout } from "./useAutoLayout";
import { useFlowOperations } from "./useFlowOperations";
import { useNodeOperations } from "./useNodeOperations";
import { useSelection } from "./useSelection";
import { useViewportOperations } from "./useViewportOperations";
import { useFlow } from "./useFlow";

export interface UseFlowOperationOptions {
  snapToGrid?: boolean;
  gridSize?: number;
}

/**
 * A unified hook that combines all flow-related operations:
 * - Flow state (nodes, edges, CRUD)
 * - Undo/Redo
 * - Clipboard (copy/paste)
 * - Auto-layout (arrange, align, distribute)
 * - Node operations (duplicate, align)
 * - Selection management
 * - Viewport operations (zoom, fit, center)
 */
export function useFlowOperation(options?: UseFlowOperationOptions) {
  // Core flow operations
  const flowOps = useFlow() as any;

  // Additional hooks
  const layout = useAutoLayout();
  const nodeOps = useNodeOperations({
    nodes: flowOps.nodes,
    onAddNode: flowOps.addNode,
    onUpdateNode: flowOps.updateNode,
    onDeleteNode: flowOps.deleteNode,
    onDeleteNodes: flowOps.deleteNodes,
  });
  const viewport = useViewportOperations(options);

  // Selection - requires nodes and edges from flowOps
  const selection = useSelection({
    nodes: flowOps.nodes,
    edges: flowOps.edges,
  });

  // Undo/Redo
  const { undo, redo, canUndo, canRedo } = flowOps;

  // Clipboard
  const { copySelected, pasteClipboard, clearClipboard } = flowOps;

  return {
    // State
    nodes: flowOps.nodes,
    edges: flowOps.edges,
    isDirty: flowOps.isDirty,
    currentId: flowOps.currentId,

    // Core operations
    addNode: flowOps.addNode,
    updateNode: flowOps.updateNode,
    deleteNode: flowOps.deleteNode,
    deleteNodes: flowOps.deleteNodes,
    addEdge: flowOps.addEdge,
    updateEdge: flowOps.updateEdge,
    deleteEdge: flowOps.deleteEdge,
    onNodesChange: flowOps.onNodesChange,
    onEdgesChange: flowOps.onEdgesChange,
    onConnect: flowOps.onConnect,

    // Undo/Redo
    undo,
    redo,
    canUndo,
    canRedo,

    // Clipboard
    copySelected,
    pasteClipboard,
    clearClipboard,

    // Persistence
    saveFlow: flowOps.saveFlow,
    loadFlow: flowOps.loadFlow,
    exportFlow: flowOps.exportFlow,
    importFlow: flowOps.importFlow,
    clearFlow: flowOps.clearFlow,

    // Auto-layout
    layoutDefault: layout.layoutDefault,
    layoutHierarchical: layout.layoutHierarchical,
    layoutForce: layout.layoutForce,

    // Node operations
    getNode: nodeOps.getNode,
    getNodesByType: nodeOps.getNodesByType,
    duplicateNode: nodeOps.duplicateNode,
    duplicateNodes: nodeOps.duplicateNodes,
    alignNodes: nodeOps.alignNodes,

    // Selection
    ...selection,

    // Viewport
    fit: viewport.fit,
    zoomIn: viewport.zoomIn,
    zoomOut: viewport.zoomOut,
    zoomTo: viewport.zoomTo,
    centerView: viewport.centerView,
    snapPosition: viewport.snapPosition,
    getViewport: viewport.getViewport,
  };
}

