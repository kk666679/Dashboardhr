/**
 * @deprecated Use `useWorkflowStore` from `@/lib/zustand/workflow-store` instead.
 *
 * This hook was the original state management for the Automation module.
 * It has been superseded by `useWorkflowStore` (Zustand-based) which provides:
 *  - Unified state across all Automation pages
 *  - Built-in undo/redo, clipboard, selection, viewport, settings
 *  - Persistence, layout, and execution state
 *
 * This re-export shim will be removed in a future release.
 * Please migrate all usages to:
 *
 *   import { useWorkflowStore } from "@/lib/zustand/workflow-store";
 *
 * Migration guide:
 *   useFlowOperations().nodes          → useWorkflowStore((s) => s.nodes)
 *   useFlowOperations().edges          → useWorkflowStore((s) => s.edges)
 *   useFlowOperations().addNode(...)   → useWorkflowStore.getState().addNode(...)
 *   useFlowOperations().updateNode(...)→ useWorkflowStore.getState().updateNode(...)
 *   useFlowOperations().deleteNode(...)→ useWorkflowStore.getState().deleteNode(...)
 *   useFlowOperations().onNodesChange  → useWorkflowStore((s) => s.onNodesChange)
 *   useFlowOperations().onEdgesChange  → useWorkflowStore((s) => s.onEdgesChange)
 *   useFlowOperations().onConnect      → useWorkflowStore((s) => s.onConnect)
 *   useFlowOperations().undo()         → useWorkflowStore.getState().undo()
 *   useFlowOperations().redo()         → useWorkflowStore.getState().redo()
 *   useFlowOperations().saveFlow()     → useWorkflowStore.getState().saveFlow()
 *   useFlowOperations().loadFlow(id)   → useWorkflowStore.getState().loadFlow(id)
 *   useFlowOperations().exportFlow()   → useWorkflowStore.getState().exportFlow()
 *   useFlowOperations().importFlow(f)  → useWorkflowStore.getState().importFlow(f)
 *   useFlowOperations().clearFlow()    → useWorkflowStore.getState().clearFlow()
 */

"use client";

import { useWorkflowStore, type FlowNode, type FlowEdge } from "@/lib/zustand/workflow-store";

export function useFlowOperations() {
  const store = useWorkflowStore;

  return {
    // State
    nodes: useWorkflowStore((s) => s.nodes) as any,
    edges: useWorkflowStore((s) => s.edges) as any,
    isDirty: useWorkflowStore((s) => s.isDirty),
    currentId: useWorkflowStore((s) => s.currentId),

    // Node operations
    onNodesChange: useWorkflowStore((s) => s.onNodesChange),
    addNode: useWorkflowStore((s) => s.addNode) as any,
    updateNode: useWorkflowStore((s) => s.updateNode) as any,
    deleteNode: useWorkflowStore((s) => s.deleteNode),
    deleteNodes: useWorkflowStore((s) => s.deleteNodes),

    // Edge operations
    onEdgesChange: useWorkflowStore((s) => s.onEdgesChange),
    onConnect: useWorkflowStore((s) => s.onConnect),
    addEdge: (connection: any) => {
      store.getState().onConnect(connection);
    },
    updateEdge: useWorkflowStore((s) => s.updateEdge),
    deleteEdge: useWorkflowStore((s) => s.deleteEdge),

    // Undo/Redo
    undo: useWorkflowStore((s) => s.undo),
    redo: useWorkflowStore((s) => s.redo),
    canUndo: useWorkflowStore((s) => s.canUndo()),
    canRedo: useWorkflowStore((s) => s.canRedo()),

    // Clipboard
    copySelected: useWorkflowStore((s) => s.copySelected) as any,
    pasteClipboard: useWorkflowStore((s) => s.pasteClipboard) as any,
    clearClipboard: useWorkflowStore((s) => s.clearClipboard),

    // Persistence
    saveFlow: useWorkflowStore((s) => s.saveFlow),
    loadFlow: useWorkflowStore((s) => s.loadFlow),
    loadTemplate: useWorkflowStore((s) => s.loadTemplate),
    exportFlow: useWorkflowStore((s) => s.exportFlow),
    importFlow: useWorkflowStore((s) => s.importFlow),
    clearFlow: useWorkflowStore((s) => s.clearFlow),

    // Internal
    pushCurrentState: () => store.getState().pushHistory(),
  };
}
