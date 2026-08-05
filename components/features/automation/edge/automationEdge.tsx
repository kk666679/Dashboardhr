"use client";

import { EdgeProps, getBezierPath, getSmoothStepPath, getStraightPath } from "@xyflow/react";
import { useState } from "react";
import { cn } from "@/lib/utils";

// ─── AnimatedFlowEdge ──────────────────────────────────────────────────────
export function AnimatedFlowEdge({
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
}: EdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const gradientId = `animated-${id}`;

  return (
    <>
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6">
            <animate attributeName="stopColor" values="#3b82f6;#8b5cf6;#3b82f6" dur="3s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.6">
            <animate attributeName="stopColor" values="#8b5cf6;#3b82f6;#8b5cf6" dur="3s" repeatCount="indefinite" />
          </stop>
        </linearGradient>
      </defs>
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        style={{
          ...style,
          stroke: `url(#${gradientId})`,
          strokeWidth: 2.5,
          strokeLinecap: "round",
        }}
        markerEnd={markerEnd}
      />
      {data?.label && (
        <foreignObject
          width={120}
          height={28}
          x={edgePath ? "50%" : 0}
          y={edgePath ? "50%" : 0}
          className="overflow-visible"
          requiredExtensions="http://www.w3.org/1999/xhtml"
        >
          <div className="bg-background/80 backdrop-blur-sm border rounded-full px-3 py-0.5 text-xs shadow-lg flex items-center justify-center">
            <span className="truncate">{String(data.label)}</span>
          </div>
        </foreignObject>
      )}
    </>
  );
}

// ─── StepEdge ──────────────────────────────────────────────────────────────
export function StepEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}: EdgeProps) {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <path
        className="react-flow__edge-path"
        d={edgePath}
        style={{
          ...style,
          stroke: isHovered ? "#3b82f6" : "#94a3b8",
          strokeWidth: isHovered ? 3 : 2,
          transition: "stroke 0.2s, stroke-width 0.2s",
        }}
        markerEnd={markerEnd}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />
      {data?.label && (
        <foreignObject
          width={80}
          height={24}
          x={edgePath ? "50%" : 0}
          y={edgePath ? "50%" : 0}
          className="overflow-visible"
          requiredExtensions="http://www.w3.org/1999/xhtml"
        >
          <div className="bg-background border rounded-full px-2 py-0.5 text-xs shadow-sm">
            {String(data.label)}
          </div>
        </foreignObject>
      )}
    </>
  );
}

// ─── StatusEdge ────────────────────────────────────────────────────────────
export function StatusEdge({
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
}: EdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const statusColors = {
    pending: "#94a3b8",
    running: "#3b82f6",
    completed: "#22c55e",
    failed: "#ef4444",
  };

  const status = data?.status || "pending";
  const color = statusColors[status as keyof typeof statusColors] || "#94a3b8";

  return (
    <>
      {/* Animated dash for running state */}
      {status === "running" && (
        <path
          d={edgePath}
          fill="none"
          stroke={color}
          strokeWidth={3}
          strokeDasharray="8 8"
          style={{ pointerEvents: "none" }}
        >
          <animate attributeName="stroke-dashoffset" from="0" to="-16" dur="1s" repeatCount="indefinite" />
        </path>
      )}
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        style={{
          ...style,
          stroke: color,
          strokeWidth: 2,
          transition: "stroke 0.2s",
        }}
        markerEnd={markerEnd}
      />
      {data?.label && (
        <foreignObject
          width={120}
          height={28}
          x={edgePath ? "50%" : 0}
          y={edgePath ? "50%" : 0}
          className="overflow-visible"
          requiredExtensions="http://www.w3.org/1999/xhtml"
        >
          <div className={`bg-background border rounded-full px-3 py-0.5 text-xs shadow-md flex items-center gap-2`}>
            <span className={cn(
              "h-2 w-2 rounded-full",
              status === "running" && "animate-pulse",
              status === "completed" ? "bg-green-500" :
              status === "failed" ? "bg-red-500" :
              status === "running" ? "bg-blue-500" : "bg-gray-400"
            )} />
            <span className="truncate">{String(data.label)}</span>
          </div>
        </foreignObject>
      )}
    </>
  );
}

// ─── ConditionalEdge ──────────────────────────────────────────────────────
export function ConditionalEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const condition = typeof data?.condition === "string" ? data.condition : "Yes";

  return (
    <>
      <path
        className="react-flow__edge-path"
        d={edgePath}
        style={{
          ...style,
          stroke: "#eab308",
          strokeWidth: 2,
          strokeDasharray: "4 4",
        }}
        markerEnd={markerEnd}
      />
      <foreignObject
        width={50}
        height={24}
        x={labelX - 25}
        y={labelY - 12}
        className="overflow-visible"
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <div className="bg-yellow-100 border border-yellow-300 rounded-full px-2 py-0.5 text-[10px] font-medium text-yellow-800 shadow-sm">
          {condition}
        </div>
      </foreignObject>
    </>
  );
}

// ─── DashedEdge ────────────────────────────────────────────────────────────
export function DashedEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}: EdgeProps) {
  const [edgePath] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <path
        className="react-flow__edge-path"
        d={edgePath}
        style={{
          ...style,
          stroke: isHovered ? "#8b5cf6" : "#94a3b8",
          strokeWidth: isHovered ? 3 : 2,
          strokeDasharray: "6 6",
          transition: "stroke 0.2s, stroke-width 0.2s",
        }}
        markerEnd={markerEnd}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />
      {data?.label && (
        <foreignObject
          width={80}
          height={24}
          x={edgePath ? "50%" : 0}
          y={edgePath ? "50%" : 0}
          className="overflow-visible"
          requiredExtensions="http://www.w3.org/1999/xhtml"
        >
          <div className="bg-background border border-dashed rounded-full px-2 py-0.5 text-xs shadow-sm">
            {String(data.label)}
          </div>
        </foreignObject>
      )}
    </>
  );
}