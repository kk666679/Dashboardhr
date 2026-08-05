import { useCallback } from "react";
import type { Node } from "@xyflow/react";

interface UseNodeOperationsProps {
  nodes?: Node[];
  onAddNode?: (type: string, data: unknown, position?: { x: number; y: number }) => void;
  onUpdateNode?: (id: string, data: unknown) => void;
  onDeleteNode?: (id: string) => void;
  onDeleteNodes?: (ids: string[]) => void;
  selectedNodeIds?: string[];
  selectedEdgeIds?: string[];
}

export function useNodeOperations({
  nodes = [],
  onAddNode = () => undefined,
  onUpdateNode = () => undefined,
  onDeleteNode = () => undefined,
  onDeleteNodes = () => undefined,
  selectedNodeIds = [],
}: UseNodeOperationsProps = {}) {
  const getNode = useCallback((id: string) => {
    return nodes.find((n) => n.id === id);
  }, [nodes]);

  const getNodesByType = useCallback((type: string) => {
    return nodes.filter((n) => n.type === type);
  }, [nodes]);

  const duplicateNode = useCallback((id: string, offset = { x: 20, y: 20 }) => {
    const node = getNode(id);
    if (!node) return null;
    const generatedId = `node_${Math.random().toString(36).slice(2, 9)}`;
    const newNode: Node = {
      ...node,
      id: generatedId,
      position: {
        x: node.position.x + offset.x,
        y: node.position.y + offset.y,
      },
      data: { ...node.data, label: `${node.data?.label || "Copy"}` },
    };
    onAddNode(node.type ?? "default", newNode.data, newNode.position);
    return newNode;
  }, [getNode, onAddNode]);

  const duplicateNodes = useCallback((ids: string[], offset = { x: 20, y: 20 }) => {
    const newNodes: Node[] = [];
    ids.forEach((id) => {
      const node = getNode(id);
      if (node) {
        const generatedId = `node_${Math.random().toString(36).slice(2, 9)}`;
        const newNode: Node = {
          ...node,
          id: generatedId,
          position: {
            x: node.position.x + offset.x,
            y: node.position.y + offset.y,
          },
          data: { ...node.data, label: `${node.data?.label || "Copy"}` },
        };
        onAddNode(node.type ?? "default", newNode.data, newNode.position);
        newNodes.push(newNode);
      }
    });
    return newNodes;
  }, [getNode, onAddNode]);

  const alignNodes = useCallback((ids: string[], alignment: "left" | "center" | "right" | "top" | "middle" | "bottom") => {
    const targetNodes = ids.map(id => getNode(id)).filter(Boolean) as Node[];
    if (targetNodes.length < 2) return;

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    targetNodes.forEach(n => {
      if (n.position.x < minX) minX = n.position.x;
      if (n.position.x > maxX) maxX = n.position.x;
      if (n.position.y < minY) minY = n.position.y;
      if (n.position.y > maxY) maxY = n.position.y;
    });

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    targetNodes.forEach((n) => {
      let newX = n.position.x, newY = n.position.y;
      switch (alignment) {
        case "left": newX = minX; break;
        case "center": newX = centerX; break;
        case "right": newX = maxX; break;
        case "top": newY = minY; break;
        case "middle": newY = centerY; break;
        case "bottom": newY = maxY; break;
      }
      onUpdateNode(n.id, { position: { x: newX, y: newY } });
    });
  }, [getNode, onUpdateNode]);

  const deleteSelectedNodes = useCallback(() => {
    if (selectedNodeIds.length === 0) return;
    onDeleteNodes(selectedNodeIds);
  }, [selectedNodeIds, onDeleteNodes]);

  const updateNodeData = useCallback((id: string, data: Record<string, unknown>) => {
    const node = getNode(id);
    if (!node) return;
    onUpdateNode(id, { ...node.data, ...data });
  }, [getNode, onUpdateNode]);

  return {
    getNode,
    getNodesByType,
    duplicateNode,
    duplicateNodes,
    alignNodes,
    deleteSelectedNodes,
    updateNodeData,
  };
}
