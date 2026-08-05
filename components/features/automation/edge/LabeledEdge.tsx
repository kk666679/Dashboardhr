"use client";

import { BaseEdge } from "./BaseEdge";
import { EdgeProps } from "@xyflow/react";

export function LabeledEdge(props: EdgeProps) {
  return <BaseEdge {...props} showLabel editableLabel />;
}