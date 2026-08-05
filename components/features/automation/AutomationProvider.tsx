/**
 * AutomationProvider — Shared context for all Automation pages.
 *
 * Wires together:
 *  - @dnd-kit/core DndContext (drag from palette/canvas)
 *  - @dnd-kit/sortable (sortable lists in layers/properties)
 *  - Keyboard shortcuts
 *  - Flow viewport API ref
 *  - Shared provider wrapping
 *
 * Every Automation page should be wrapped in this provider.
 */

"use client";

import { type ReactNode, useCallback, useRef, useState, useEffect } from "react";
import {
  DndContext as DndKitContext,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  closestCenter,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  type PointerActivationConstraint,
  DragOverlay,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useWorkflowStore, setFlowViewportApi } from "@/lib/zustand/workflow-store";
import { KeyboardShortcutsProvider } from "./keyboard/KeyboardShortcutsProvider";

interface AutomationProviderProps {
  children: ReactNode;
  /** Disable keyboard shortcuts */
  disableShortcuts?: boolean;
  /** Custom node types for DnD data */
  nodeTypes?: string[];
  /** Show/hide search overlay */
  onSearchToggle?: () => void;
  /** Save handler */
  onSave?: () => void;
}

export function AutomationProvider({
  children,
  disableShortcuts = false,
  onSearchToggle,
  onSave,
}: AutomationProviderProps) {
  const [activeDragItem, setActiveDragItem] = useState<any>(null);
  const [activeDragType, setActiveDragType] = useState<string | null>(null);

  // DnD Sensors with proper activation constraints
  const mouseActivation: PointerActivationConstraint = { distance: 5 };
  const touchActivation: PointerActivationConstraint = { delay: 200, tolerance: 5 };

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: mouseActivation }),
    useSensor(TouchSensor, { activationConstraint: touchActivation }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // DnD Handlers
  const handleDragStart = useCallback((event: DragStartEvent) => {
    const data = event.active.data.current ?? null;
    setActiveDragItem(data);
    setActiveDragType(data?.type ?? null);
  }, []);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    // Track which item we're dragging over for highlighting
    const overId = event.over?.id ?? null;
    if (overId) {
      // Could set hover state here for drop target highlighting
    }
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragItem(null);
    setActiveDragType(null);

    if (!over) return;

    // Add node from palette to canvas
    const nodeData = active.data.current as Record<string, unknown> | undefined;
    if (nodeData?.type === "node") {
      const store = useWorkflowStore.getState();
      const reactFlowEl = document.querySelector(".react-flow") as HTMLElement | null;
      const canvasRect = reactFlowEl?.getBoundingClientRect();

      // Get the drop coordinates relative to the canvas
      const overRect = over.rect;
      const viewport = store.viewport;
      const dropX = ((overRect?.left ?? 0) - (canvasRect?.left ?? 0) - viewport.x) / viewport.zoom;
      const dropY = ((overRect?.top ?? 0) - (canvasRect?.top ?? 0) - viewport.y) / viewport.zoom;

      const type = (nodeData.nodeType as string) ?? "default";
      const data = (nodeData.nodeData as Record<string, unknown>) ?? {};
      const position = { x: Math.max(0, dropX), y: Math.max(0, dropY) };

      store.addNode(type, data, position);
    }
  }, []);

  // Expose viewport API ref for the store
  const flowContainerRef = useRef<HTMLDivElement>(null);

  return (
    <DndKitContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <KeyboardShortcutsProvider
        disabled={disableShortcuts}
        onOpenSearch={onSearchToggle}
        onSave={onSave}
      >
        <div ref={flowContainerRef} className="h-full w-full">
          {children}
        </div>
        {/* Global drag overlay for palette/library items */}
        {activeDragItem && (
          <DragOverlay>
            <div className="flex items-center gap-2 rounded-lg border bg-background px-3 py-2 shadow-lg">
              {activeDragType === "node" && (
                <>
                  <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center text-xs font-bold">
                    {(activeDragItem?.nodeType as string)?.charAt(0).toUpperCase() ?? "N"}
                  </div>
                  <span className="text-sm font-medium">
                    {(activeDragItem?.label as string) ?? "Node"}
                  </span>
                </>
              )}
              {activeDragType === "shape" && (
                <span className="text-sm font-medium">
                  {(activeDragItem?.label as string) ?? "Shape"}
                </span>
              )}
              {!activeDragType && (
                <span className="text-sm font-medium">Drag item</span>
              )}
            </div>
          </DragOverlay>
        )}
      </KeyboardShortcutsProvider>
    </DndKitContext>
  );
}

