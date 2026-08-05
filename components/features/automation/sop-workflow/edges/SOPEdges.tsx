"use client";

import { type EdgeProps } from "@xyflow/react";
import { AnimatedEdge } from "../../edge/animatedEdge";
import { BaseEdge } from "../../edge/BaseEdge";

const SOPDefaultEdge = (props: EdgeProps) => (
  <BaseEdge {...props} pathType="smoothstep" />
);

export const SOPEdgeTypes = {
  sop_animated: AnimatedEdge,
  sop_automation: AnimatedEdge,
  sop_default: SOPDefaultEdge,
};
