"use client";

import { EdgeProps, getBezierPath } from "@xyflow/react";
import { BaseEdge } from "./BaseEdge";

export function AnimatedFlowEdge(props: EdgeProps) {
  return <BaseEdge {...props} animated pathType="smoothstep" showLabel />;
}