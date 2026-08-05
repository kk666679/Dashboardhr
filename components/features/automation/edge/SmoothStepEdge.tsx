"use client";

import { BaseEdge } from "./BaseEdge";
import { EdgeProps } from "@xyflow/react";

export function SmoothStepEdge(props: EdgeProps) {
  return <BaseEdge {...props} pathType="smoothstep" />;
}