"use client";

import { BaseEdge } from "./BaseEdge";
import { EdgeProps } from "@xyflow/react";

export function EdgeWithStatus(props: EdgeProps) {
  return <BaseEdge {...props} showLabel animated pathType="smoothstep" />;
}