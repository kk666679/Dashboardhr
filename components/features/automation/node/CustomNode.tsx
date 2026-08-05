"use client";

import { NodeProps } from "@xyflow/react";
import type { AutomationNode } from "./types";
import { NodeBase } from "./NodeBase";
import { Code } from "lucide-react";

interface CustomNodeData {
  label?: string;
  description?: string;
  status?: "pending" | "running" | "completed" | "failed" | "idle";
  language?: string;
  code?: string;
  [key: string]: unknown;
}

export function CustomNode({ data, selected }: NodeProps<AutomationNode>) {
  const d = data as CustomNodeData;
  return (
    <NodeBase
      icon={<Code className="h-5 w-5 text-orange-600" />}
      label={d?.label ?? "Custom"}
      description={d?.description ?? "Run custom code"}
      status={d?.status}
      selected={selected}
      variant="custom"
    >
      {d?.language && <div>Language: {d.language}</div>}
      {d?.code && <div className="truncate">Code: {d.code}</div>}
    </NodeBase>
  );
}
