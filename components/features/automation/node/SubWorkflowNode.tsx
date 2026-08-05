"use client";

import type { Node, NodeProps } from "@xyflow/react";
import type { AutomationNodeData } from "./types";
import { NodeBase } from "./NodeBase";
import { GitBranch } from "lucide-react";
export function SubWorkflowNode({ data, selected }: NodeProps<Node<AutomationNodeData, string | undefined>>) {
  return (
    <NodeBase
      icon={<GitBranch className="h-5 w-5 text-cyan-600" />}
      label={data?.label || "Sub‑Workflow"}
      description={data?.description || "Call another workflow"}
      status={data?.status as "pending" | "running" | "completed" | "failed" | "idle" | undefined}
      selected={selected}
      variant="workflow"
      badge={data?.workflowName || "Subflow"}
    >
      <div className="space-y-1 text-[11px]">
        {data?.workflowId && (
          <div>🔗 ID: {data.workflowId}</div>
        )}
        {data?.version && (
          <div>📌 v{data.version}</div>
        )}
        {data?.parameters && Object.keys(data.parameters).length > 0 && (
          <div className="truncate text-muted-foreground">
            ⚙️ {Object.keys(data.parameters).join(", ")}
          </div>
        )}
      </div>
    </NodeBase>
  );
}
