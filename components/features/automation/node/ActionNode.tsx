"use client";

import { NodeProps } from "@xyflow/react";
import type { AutomationNode } from "./types";
import { NodeBase } from "./NodeBase";
import { Zap } from "lucide-react";

interface ActionNodeData {
  label?: string;
  description?: string;
  status?: "pending" | "running" | "completed" | "failed" | "idle";
  actionType?: string;
  config?: Record<string, unknown>;
  [key: string]: unknown;
}

export function ActionNode({ data, selected }: NodeProps<AutomationNode>) {
  const d = data as ActionNodeData;
  return (
    <NodeBase
      icon={<Zap className="h-5 w-5 text-blue-600" />}
      label={d?.label ?? "Action"}
      description={d?.description ?? "Execute an action"}
      status={d?.status}
      selected={selected}
      variant="action"
    >
      {d?.actionType && <div>Type: {d.actionType}</div>}
      {d?.config && <div className="truncate">Config: {JSON.stringify(d.config)}</div>}
    </NodeBase>
  );
}
