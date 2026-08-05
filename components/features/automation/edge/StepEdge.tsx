"use client";

import { EdgeProps } from "@xyflow/react";
import { BaseEdge } from "./BaseEdge";

export function StepEdge(props: EdgeProps) {
  return <BaseEdge {...props} pathType="step" />;
}