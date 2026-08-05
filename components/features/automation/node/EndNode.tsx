"use client";

import { NodeProps } from "@xyflow/react";
import type { AutomationNode } from "./types";
import { NodeBase } from "./NodeBase";
import { Square } from "lucide-react";

export function EndNode({ data, selected }: NodeProps<AutomationNode>) {
  return (
    <NodeBase
      icon={<Square className="h-5 w-5 text-red-600" />}
      label={data?.label || "End"}
      description={data?.description || "Workflow complete"}
      status={data?.status}
      selected={selected}
      variant="end"
    >
      {data?.result && <div>Result: {data.result}</div>}
    </NodeBase>
  );
}
