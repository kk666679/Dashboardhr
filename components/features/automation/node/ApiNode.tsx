"use client";

import { NodeProps } from "@xyflow/react";
import type { AutomationNode } from "./types";
import { NodeBase } from "./NodeBase";
import { Globe } from "lucide-react";

export function ApiNode({ data, selected }: NodeProps<AutomationNode>) {
  return (
    <NodeBase
      icon={<Globe className="h-5 w-5 text-teal-600" />}
      label={data?.label || "API Call"}
      description={data?.description || "Call an external API"}
      status={data?.status}
      selected={selected}
      variant="integration"
    >
      {data?.method && <div>Method: {data.method}</div>}
      {data?.url && <div className="truncate">URL: {data.url}</div>}
    </NodeBase>
  );
}
