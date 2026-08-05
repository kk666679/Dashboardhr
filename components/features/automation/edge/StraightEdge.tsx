"use client";

import { BaseEdge } from "./BaseEdge";
import { EdgeProps } from "@xyflow/react";

export function StraightEdge(props: EdgeProps) {
  return <BaseEdge {...props} pathType="straight" />;
}