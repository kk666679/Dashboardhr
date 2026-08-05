import { useCallback } from "react";
import { Edge } from "@xyflow/react";

interface UseEdgeOperationsProps {
  edges: Edge[];
  onAddEdge: (connection: unknown) => void;
  onUpdateEdge: (id: string, data: unknown) => void;
  onDeleteEdge: (id: string) => void;
}

export function useEdgeOperations({
  edges,
  onAddEdge,
  onUpdateEdge,
  onDeleteEdge,
}: UseEdgeOperationsProps) {
  const getEdge = useCallback((id: string) => {
    return edges.find((e) => e.id === id);
  }, [edges]);

  const getEdgesConnectedToNode = useCallback((nodeId: string) => {
    return edges.filter((e) => e.source === nodeId || e.target === nodeId);
  }, [edges]);

  const getIncomingEdges = useCallback((nodeId: string) => {
    return edges.filter((e) => e.target === nodeId);
  }, [edges]);

  const getOutgoingEdges = useCallback((nodeId: string) => {
    return edges.filter((e) => e.source === nodeId);
  }, [edges]);

  const reconnectEdge = useCallback((id: string, newSource: string, newTarget: string) => {
    onUpdateEdge(id, { source: newSource, target: newTarget });
  }, [onUpdateEdge]);

  const deleteEdgesConnectedToNode = useCallback((nodeId: string) => {
    const connected = getEdgesConnectedToNode(nodeId);
    connected.forEach((e) => onDeleteEdge(e.id));
  }, [getEdgesConnectedToNode, onDeleteEdge]);

  return {
    getEdge,
    getEdgesConnectedToNode,
    getIncomingEdges,
    getOutgoingEdges,
    reconnectEdge,
    deleteEdgesConnectedToNode,
  };
}
