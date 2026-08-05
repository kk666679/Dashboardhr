"use client";

/**
 * @deprecated Use `useWorkflowStore` from `@/lib/zustand/workflow-store` instead.
 *
 * This standalone useDnd hook was replaced by the unified AutomationProvider
 * which integrates DnD state directly with the workflow store.
 * The store provides all DnD handlers through a single AutomationProvider context.
 */

import { useWorkflowStore } from "@/lib/zustand/workflow-store";

/**
 * Returns a no-op handle for backward compatibility.
 * All DnD state is now managed by AutomationProvider + useWorkflowStore.
 */
export function useDnd() {
  return {
    activeId: null,
    overId: null,
    currentItems: [],
    handleDragStart: () => {},
    handleDragOver: () => {},
    handleDragEnd: () => {},
    setCurrentItems: () => {},
  };
}

