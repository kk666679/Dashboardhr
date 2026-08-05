"use client";

import { NodeProps } from "@xyflow/react";
import type { AutomationNode } from "./types";
import { NodeBase } from "./NodeBase";
import { GitBranch } from "lucide-react";

interface WorkflowNodeData {
  label?: string;
  description?: string;
  status?: "pending" | "running" | "completed" | "failed" | "idle";
  [key: string]: unknown;
}

export function WorkflowNode({ data, selected }: NodeProps<AutomationNode>) {
  const d = data as WorkflowNodeData;
  return (
    <NodeBase
      icon={<GitBranch className="h-5 w-5 text-purple-600" />}
      label={d?.label ?? "Workflow"}
      description={d?.description ?? "Execute a workflow"}
      status={d?.status}
      selected={selected}
      variant="action"
    />
  );
}
