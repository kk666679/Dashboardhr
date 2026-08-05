import dagre from "dagre";
import { Node, Edge } from "@xyflow/react";

export interface LayoutOptions {
  direction?: "LR" | "TB" | "RL" | "BT";
  nodeSpacing?: number;
  edgeSpacing?: number;
  rankSpacing?: number;
  nodeWidth?: number;
  nodeHeight?: number;
}

export const defaultLayoutOptions: LayoutOptions = {
  direction: "TB",
  nodeSpacing: 50,
  edgeSpacing: 50,
  rankSpacing: 80,
  nodeWidth: 172,
  nodeHeight: 72,
};

/**
 * Applies a generic layout using dagre.
 */
export function applyLayout(
  nodes: Node[],
  edges: Edge[],
  options: LayoutOptions = defaultLayoutOptions
): { nodes: Node[]; edges: Edge[] } {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const {
    direction = "TB",
    nodeSpacing = 50,
    edgeSpacing = 50,
    rankSpacing = 80,
    nodeWidth = 172,
    nodeHeight = 72,
  } = options;

  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: nodeSpacing,
    edgesep: edgeSpacing,
    ranksep: rankSpacing,
  });

  // Add nodes
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  // Add edges
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  // Update node positions
  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: (nodeWithPosition.x ?? 0) - nodeWidth / 2,
        y: (nodeWithPosition.y ?? 0) - nodeHeight / 2,
      },
    };
  });

  return { nodes: newNodes, edges };
}

/**
 * Applies a hierarchical layout (top‑down).
 */
export function applyHierarchicalLayout(
  nodes: Node[],
  edges: Edge[],
  options: LayoutOptions = defaultLayoutOptions
): { nodes: Node[]; edges: Edge[] } {
  return applyLayout(nodes, edges, { ...options, direction: "TB" });
}

/**
 * Applies a “force”‑like layout (left‑to‑right with more spacing).
 */
export function applyForceLayout(
  nodes: Node[],
  edges: Edge[],
  options: LayoutOptions = defaultLayoutOptions
): { nodes: Node[]; edges: Edge[] } {
  return applyLayout(nodes, edges, {
    ...options,
    direction: "LR",
    nodeSpacing: 100,
    rankSpacing: 120,
  });
}

/**
 * Calculates the bounding box of a set of nodes.
 */
export function getNodeBoundingBox(nodes: Node[]): {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
} {
  if (nodes.length === 0) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0, width: 0, height: 0 };
  }
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  nodes.forEach((n) => {
    const x = n.position.x;
    const y = n.position.y;
    const w = n.width || 172;
    const h = n.height || 72;
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x + w > maxX) maxX = x + w;
    if (y + h > maxY) maxY = y + h;
  });
  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

/**
 * Centers nodes on a virtual canvas.
 */
export function centerNodes(
  nodes: Node[],
  canvasWidth: number,
  canvasHeight: number
): Node[] {
  const bbox = getNodeBoundingBox(nodes);
  const centerX = (canvasWidth - bbox.width) / 2 - bbox.minX;
  const centerY = (canvasHeight - bbox.height) / 2 - bbox.minY;
  return nodes.map((n) => ({
    ...n,
    position: {
      x: n.position.x + centerX,
      y: n.position.y + centerY,
    },
  }));
}

/**
 * Distributes nodes vertically with equal spacing.
 */
export function distributeNodesVertically(nodes: Node[], spacing: number = 100): Node[] {
  const sorted = [...nodes].sort((a, b) => a.position.x - b.position.x);
  let y = 0;
  return sorted.map((n) => {
    const newNode = { ...n, position: { ...n.position, y } };
    y += (n.height || 72) + spacing;
    return newNode;
  });
}

/**
 * Distributes nodes horizontally with equal spacing.
 */
export function distributeNodesHorizontally(nodes: Node[], spacing: number = 100): Node[] {
  const sorted = [...nodes].sort((a, b) => a.position.y - b.position.y);
  let x = 0;
  return sorted.map((n) => {
    const newNode = { ...n, position: { ...n.position, x } };
    x += (n.width || 172) + spacing;
    return newNode;
  });
}