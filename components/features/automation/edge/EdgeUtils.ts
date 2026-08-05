import { Edge, MarkerType } from "@xyflow/react";
import { v4 as uuidv4 } from "uuid";

export type EdgeType = "bezier" | "step" | "straight" | "smoothstep" | "animated" | "automation";

export interface EdgeData {
  label?: string;
  status?: "pending" | "running" | "completed" | "failed";
  color?: string;
  showDelete?: boolean;
  editableLabel?: boolean;
  tooltip?: string;
  [key: string]: any;
}

export const createEdge = (
  source: string,
  target: string,
  type: EdgeType = "smoothstep",
  data?: EdgeData
): Edge => ({
  id: uuidv4(),
  source,
  target,
  type,
  data,
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: data?.color || "#64748b",
  },
});

export const createEdges = (
  connections: { source: string; target: string }[],
  type: EdgeType = "smoothstep",
  data?: EdgeData
): Edge[] => connections.map(c => createEdge(c.source, c.target, type, data));

export const getEdgeColor = (status?: string, defaultColor = "#64748b"): string => {
  switch (status) {
    case "running": return "#3b82f6";
    case "completed": return "#22c55e";
    case "failed": return "#ef4444";
    default: return defaultColor;
  }
};

export const getEdgeStyle = (status?: string): React.CSSProperties => {
  const color = getEdgeColor(status);
  return {
    stroke: color,
    strokeWidth: status === "running" ? 3 : 2,
    strokeDasharray: status === "running" ? "5,5" : undefined,
  };
};

export interface StatusEdgeData extends EdgeData {
  status: "pending" | "running" | "completed" | "failed";
  progress?: number;
}

export interface ConditionalEdgeData extends EdgeData {
  condition: string;
  trueLabel?: string;
  falseLabel?: string;
  outcome?: "true" | "false";
}

export interface AnimatedFlowEdgeData extends EdgeData {
  speed?: "slow" | "medium" | "fast";
  pulse?: boolean;
}

export interface StepEdgeData extends EdgeData {
  stepIndex?: number;
  totalSteps?: number;
}