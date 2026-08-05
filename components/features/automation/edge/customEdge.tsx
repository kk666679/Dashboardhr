"use client";

import { EdgeProps, getBezierPath } from "@xyflow/react";

export function CustomEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <path
      className="react-flow__edge-path"
      d={edgePath}
      style={{
        ...style,
        stroke: "#64748b",
        strokeWidth: 2,
      }}
      markerEnd={markerEnd}
    />
  );
}