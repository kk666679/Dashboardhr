import { useState, useCallback } from "react";
import type { Node, Edge } from "@xyflow/react";

interface UseSelectionProps {
  nodes?: Node[];
  edges?: Edge[];
  onSelectionChange?: (selected: { nodes: Node[]; edges: Edge[] }) => void;
}

export function useSelection({ nodes = [], edges = [], onSelectionChange }: UseSelectionProps = {}) {
  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);
  const [selectedEdgeIds, setSelectedEdgeIds] = useState<string[]>([]);

  const selectedNodes = nodes.filter(n => selectedNodeIds.includes(n.id));
  const selectedEdges = edges.filter(e => selectedEdgeIds.includes(e.id));

  const selectNode = useCallback((id: string, multi = false) => {
    setSelectedNodeIds((prev) => {
      if (multi) {
        if (prev.includes(id)) return prev.filter(n => n !== id);
        return [...prev, id];
      }
      return [id];
    });
  }, []);

  const selectEdge = useCallback((id: string, multi = false) => {
    setSelectedEdgeIds((prev) => {
      if (multi) {
        if (prev.includes(id)) return prev.filter(e => e !== id);
        return [...prev, id];
      }
      return [id];
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelectedNodeIds(nodes.map(n => n.id));
    setSelectedEdgeIds(edges.map(e => e.id));
  }, [nodes, edges]);

  const clearSelection = useCallback(() => {
    setSelectedNodeIds([]);
    setSelectedEdgeIds([]);
  }, []);

  const selectNodes = useCallback((ids: string[]) => {
    setSelectedNodeIds(ids);
  }, []);

  const selectEdges = useCallback((ids: string[]) => {
    setSelectedEdgeIds(ids);
  }, []);

  // Notify on change
  useCallback(() => {
    onSelectionChange?.({ nodes: selectedNodes, edges: selectedEdges });
  }, [selectedNodes, selectedEdges, onSelectionChange]);

  return {
    selectedNodeIds,
    selectedEdgeIds,
    selectedNodes,
    selectedEdges,
    hasSelection: selectedNodeIds.length > 0 || selectedEdgeIds.length > 0,
    nodeCount: selectedNodeIds.length,
    edgeCount: selectedEdgeIds.length,
    selectNode,
    selectEdge,
    selectAll,
    clearSelection,
    selectNodes,
    selectEdges,
  };
}
