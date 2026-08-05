/**
 * Keyboard Shortcuts Provider for the Automation module.
 * Registers global keyboard shortcuts that work across all canvas views.
 *
 * Shortcuts:
 *  Ctrl+Z / Cmd+Z    → Undo
 *  Ctrl+Y / Cmd+Y    → Redo
 *  Ctrl+C / Cmd+C    → Copy selected
 *  Ctrl+V / Cmd+V    → Paste clipboard
 *  Ctrl+X / Cmd+X    → Cut selected
 *  Ctrl+A / Cmd+A    → Select all
 *  Ctrl+D / Cmd+D    → Duplicate selected
 *  Delete / Backspace → Delete selected
 *  Ctrl+F / Cmd+F    → Open search
 *  Ctrl+S / Cmd+S    → Save flow
 *  +/-               → Zoom in/out
 *  0                 → Fit view
 *  Escape            → Clear selection
 */

"use client";

import { useEffect, useCallback, type ReactNode } from "react";
import { useWorkflowStore } from "@/lib/zustand/workflow-store";

interface KeyboardShortcutsProviderProps {
  children: ReactNode;
  /** When true, shortcuts are disabled (e.g. when an input is focused) */
  disabled?: boolean;
  /** Callbacks for UI actions not managed by the store */
  onOpenSearch?: () => void;
  onSave?: () => void;
}

export function KeyboardShortcutsProvider({
  children,
  disabled = false,
  onOpenSearch,
  onSave,
}: KeyboardShortcutsProviderProps) {
  const isInputFocused = useCallback(() => {
    const tag = document.activeElement?.tagName;
    return (
      tag === "INPUT" ||
      tag === "TEXTAREA" ||
      tag === "SELECT" ||
      document.activeElement?.getAttribute("contenteditable") === "true"
    );
  }, []);

  useEffect(() => {
    if (disabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when typing in inputs
      if (isInputFocused()) return;

      const mod = e.ctrlKey || e.metaKey;
      const store = useWorkflowStore.getState();

      switch (true) {
        // Undo
        case mod && e.key === "z" && !e.shiftKey:
          e.preventDefault();
          store.undo();
          break;

        // Redo
        case (mod && e.key === "y") || (mod && e.key === "z" && e.shiftKey):
          e.preventDefault();
          store.redo();
          break;

        // Copy
        case mod && e.key === "c":
          e.preventDefault();
          store.copySelected();
          break;

        // Paste
        case mod && e.key === "v":
          e.preventDefault();
          store.pasteClipboard();
          break;

        // Cut
        case mod && e.key === "x":
          e.preventDefault();
          store.cutSelected();
          break;

        // Select all
        case mod && e.key === "a":
          // Only intercept if we have nodes (avoid stealing browser select-all)
          if (store.nodes.length > 0) {
            e.preventDefault();
            store.selectAll();
          }
          break;

        // Duplicate
        case mod && e.key === "d":
          e.preventDefault();
          store.duplicateNodes(store.selectedNodeIds);
          break;

        // Delete selected
        case e.key === "Delete" || e.key === "Backspace":
          if (store.selectedNodeIds.length > 0 || store.selectedEdgeIds.length > 0) {
            e.preventDefault();
            if (store.selectedNodeIds.length > 0) {
              store.deleteNodes(store.selectedNodeIds);
            }
            store.selectedEdgeIds.forEach((id) => store.deleteEdge(id));
          }
          break;

        // Search
        case mod && e.key === "f":
          e.preventDefault();
          onOpenSearch?.();
          break;

        // Save
        case mod && e.key === "s":
          e.preventDefault();
          if (onSave) onSave();
          else store.saveFlow();
          break;

        // Zoom in
        case mod && e.key === "=":
        case mod && e.key === "+":
          e.preventDefault();
          store.zoomIn();
          break;

        // Zoom out
        case mod && e.key === "-":
          e.preventDefault();
          store.zoomOut();
          break;

        // Fit view (0)
        case !mod && e.key === "0":
          e.preventDefault();
          store.fitView();
          break;

        // Escape → clear selection
        case e.key === "Escape":
          if (store.hasSelection()) {
            e.preventDefault();
            store.clearSelection();
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [disabled, isInputFocused, onOpenSearch, onSave]);

  return <>{children}</>;
}

