"use client";

import { EdgeProps, getBezierPath, getSmoothStepPath, getStraightPath } from "@xyflow/react";
import { useState } from "react";
import { EdgeLabel } from "./EdgeLabel";
import { getEdgeColor, getEdgeStyle, EdgeData } from "./EdgeUtils";

interface BaseEdgeProps extends EdgeProps {
  pathType?: "bezier" | "smoothstep" | "straight" | "step";
  animated?: boolean;
  showLabel?: boolean;
  editableLabel?: boolean;
  onLabelChange?: (id: string, newLabel: string) => void;
  onDeleteEdge?: (id: string) => void;
}

export function BaseEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
  pathType = "smoothstep",
  animated = false,
  showLabel = true,
  editableLabel = false,
  onLabelChange,
  onDeleteEdge,
}: BaseEdgeProps) {
  const [isHovered, setIsHovered] = useState(false);

  const edgeData = data as EdgeData | undefined;
  const label = edgeData?.label || "";
  const status = edgeData?.status;
  const color = edgeData?.color || getEdgeColor(status);

  let path: string;
  let labelPosition = { x: 0, y: 0 };

  switch (pathType) {
    case "bezier": {
      const [p, x, y] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
      });
      path = p;
      labelPosition = { x, y };
      break;
    }
    case "straight": {
      const [p, x, y] = getStraightPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
      });
      path = p;
      labelPosition = { x, y };
      break;
    }
    case "step":
    case "smoothstep":
    default: {
      const [p, x, y] = getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
      });
      path = p;
      labelPosition = { x, y };
      break;
    }
  }

  const edgeStyle = {
    ...getEdgeStyle(status),
    ...style,
    stroke: color,
    transition: "stroke 0.2s, stroke-width 0.2s",
  };

  return (
    <>
      {animated && (
        <path
          d={path}
          fill="none"
          stroke={color}
          strokeWidth={edgeStyle.strokeWidth}
          strokeDasharray="5,5"
          opacity={0.3}
        />
      )}
      <path
        id={id}
        className="react-flow__edge-path"
        d={path}
        style={edgeStyle}
        markerEnd={markerEnd}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />
      {showLabel && label && (
        <foreignObject
          width={160}
          height={32}
          x={labelPosition.x - 80}
          y={labelPosition.y - 16}
          className="overflow-visible"
          requiredExtensions="http://www.w3.org/1999/xhtml"
        >
          <EdgeLabel
            label={label}
            onLabelChange={(newLabel) => onLabelChange?.(id, newLabel)}
            onDelete={() => onDeleteEdge?.(id)}
            isHovered={isHovered}
            status={status}
            editable={editableLabel}
          />
        </foreignObject>
      )}
    </>
  );
}