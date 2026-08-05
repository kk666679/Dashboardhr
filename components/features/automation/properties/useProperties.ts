"use client";

import { useState, useCallback } from "react";
import { Node, Edge } from "@xyflow/react";

interface PropertyState {
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  isDirty: boolean;
}

export function useProperties() {
  const [state, setState] = useState<PropertyState>({
    selectedNodeId: null,
    selectedEdgeId: null,
    isDirty: false,
  });

  const selectNode = useCallback((nodeId: string | null) => {
    setState((prev) => ({
      ...prev,
      selectedNodeId: nodeId,
      selectedEdgeId: null,
    }));
  }, []);

  const selectEdge = useCallback((edgeId: string | null) => {
    setState((prev) => ({
      ...prev,
      selectedEdgeId: edgeId,
      selectedNodeId: null,
    }));
  }, []);

  const clearSelection = useCallback(() => {
    setState((prev) => ({
      ...prev,
      selectedNodeId: null,
      selectedEdgeId: null,
    }));
  }, []);

  const markDirty = useCallback(() => {
    setState((prev) => ({ ...prev, isDirty: true }));
  }, []);

  const markClean = useCallback(() => {
    setState((prev) => ({ ...prev, isDirty: false }));
  }, []);

  return {
    ...state,
    selectNode,
    selectEdge,
    clearSelection,
    markDirty,
    markClean,
  };
}
