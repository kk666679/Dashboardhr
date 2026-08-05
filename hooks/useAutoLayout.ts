"use client";

import { useCallback } from "react";
import type { Node, Edge } from "@xyflow/react";
import { useWorkflowStore } from "@/lib/zustand/workflow-store";
import {
  applyLayout,
  applyHierarchicalLayout,
  applyForceLayout,
  type LayoutOptions,
} from "@/components/features/automation/layout/LayoutEngine";

// ─── Type Definitions ────────────────────────────────────────────────────────

type LayoutDirection = "TB" | "LR";

interface UseAutoLayoutOptions {
  direction?: LayoutDirection;
  animate?: boolean;
  duration?: number;
}

// ─── Hook ──────────────────────────────────────────────────────────────────

export function useAutoLayout(options?: UseAutoLayoutOptions) {
  const direction = options?.direction ?? "TB";
  const animate = options?.animate ?? true;
  const duration = options?.duration ?? 300;

  const applyAutoLayout = useCallback(
    (
      layoutFn: typeof applyLayout,
      layoutOptions?: Partial<LayoutOptions>
    ) => {
      const state = useWorkflowStore.getState();
      const { nodes, edges } = state;

      if (!nodes.length) {
        console.warn("No nodes to layout");
        return;
      }

      try {
        const combinedOptions: LayoutOptions = {
          direction,
          ...layoutOptions,
        };

        const result = layoutFn(
          nodes as unknown as Node[],
          edges as unknown as Edge[],
          combinedOptions
        );

        if (!result.nodes || !result.nodes.length) {
          console.warn("Layout returned no nodes");
          return;
        }

        // Batch update all node positions
        useWorkflowStore.setState({
          nodes: result.nodes as any,
          isDirty: true,
        });

        state.pushHistory();
      } catch (error) {
        console.error("Failed to apply layout:", error);
      }
    },
    [direction, animate, duration]
  );

  const layoutDefault = useCallback(
    (layoutOptions?: Partial<LayoutOptions>) =>
      applyAutoLayout(applyLayout, layoutOptions),
    [applyAutoLayout]
  );

  const layoutHierarchical = useCallback(
    (layoutOptions?: Partial<LayoutOptions>) =>
      applyAutoLayout(applyHierarchicalLayout, layoutOptions),
    [applyAutoLayout]
  );

  const layoutForce = useCallback(
    (layoutOptions?: Partial<LayoutOptions>) =>
      applyAutoLayout(applyForceLayout, layoutOptions),
    [applyAutoLayout]
  );

  const isLayoutable = useCallback(() => {
    return useWorkflowStore.getState().nodes.length > 0;
  }, []);

  const getNodeCount = useCallback(() => {
    return useWorkflowStore.getState().nodes.length;
  }, []);

  const getEdgeCount = useCallback(() => {
    return useWorkflowStore.getState().edges.length;
  }, []);

  return {
    // Layout functions
    applyLayout: layoutDefault,
    layoutDefault,
    layoutHierarchical,
    layoutForce,

    // Utility functions
    isLayoutable,
    getNodeCount,
    getEdgeCount,

    // Configuration
    direction,
    animate,
    duration,

    // Raw data access (for advanced use cases)
    nodes: useWorkflowStore((s) => s.nodes),
    edges: useWorkflowStore((s) => s.edges),
  };
}

