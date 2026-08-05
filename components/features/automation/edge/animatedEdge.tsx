"use client";

import { EdgeProps, getBezierPath } from "@xyflow/react";

export function AnimatedEdge({
  id,
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
    <>
      <defs>
        <linearGradient id={`gradient-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.8" />
        </linearGradient>
      </defs>
      <path
        id={id}
        className="react-flow__edge-path animated-path"
        d={edgePath}
        style={{
          ...style,
          stroke: `url(#gradient-${id})`,
          strokeWidth: 2,
          strokeDasharray: "5,5",
        }}
        markerEnd={markerEnd}
      />
    </>
  );
}