"use client";

import { EdgeProps } from "@xyflow/react";
import { BaseEdge } from "./BaseEdge";

export function StatusEdge(props: EdgeProps) {
  return <BaseEdge {...props} pathType="smoothstep" showLabel animated />;
}