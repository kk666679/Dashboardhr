"use client";

import { EdgeProps, getBezierPath } from "@xyflow/react";
import { BaseEdge } from "./BaseEdge";
import { ConditionalEdgeData } from "./EdgeUtils";

export function ConditionalEdge(props: EdgeProps) {
  const data = props.data as ConditionalEdgeData;
  return <BaseEdge {...props} pathType="smoothstep" showLabel editableLabel />;
}