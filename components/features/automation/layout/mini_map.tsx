"use client";

import { MiniMap as ReactFlowMiniMap, Node } from "@xyflow/react";

interface MiniMapProps {
  nodeColor?: (node: Node) => string;
  className?: string;
}

export function MiniMap({
  nodeColor = (node) => {
    switch (node.type) {
      case "start": return "#22c55e";
      case "end": return "#ef4444";
      case "decision": return "#eab308";
      case "workflow": return "#8b5cf6";
      case "action": return "#3b82f6";
      case "trigger": return "#f97316";
      case "output": return "#ec4899";
      case "condition": return "#06b6d4";
      default: return "#64748b";
    }
  },
  className,
}: MiniMapProps) {
  return (
    <ReactFlowMiniMap
      nodeColor={nodeColor}
      className={`bg-background border rounded-md shadow-md ${className}`}
      maskColor="rgba(0,0,0,0.1)"
    />
  );
}