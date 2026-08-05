"use client";

import { NodeProps } from "@xyflow/react";
import type { AutomationNode } from "./types";
import { NodeBase } from "./NodeBase";
import { Send } from "lucide-react";

export function OutputNode({ data, selected }: NodeProps<AutomationNode>) {
  return (
    <NodeBase
      icon={<Send className="h-5 w-5 text-pink-600" />}
      label={data?.label || "Output"}
      description={data?.description || "Send output data"}
      status={data?.status}
      selected={selected}
      variant="action"
    >
      {data?.outputType && <div>Type: {data.outputType}</div>}
      {data?.target && <div>Target: {data.target}</div>}
    </NodeBase>
  );
}
