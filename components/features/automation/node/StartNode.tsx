"use client";

import { NodeProps } from "@xyflow/react";
import type { AutomationNode } from "./types";
import { NodeBase } from "./NodeBase";
import { Play } from "lucide-react";

export function StartNode({ data, selected }: NodeProps<AutomationNode>) {
  return (
    <NodeBase
      icon={<Play className="h-5 w-5 text-green-600" />}
      label={data?.label || "Start"}
      description={data?.description || "Begin workflow"}
      status={data?.status}
      selected={selected}
      variant="start"
    >
      {data?.trigger && <div>Trigger: {data.trigger}</div>}
    </NodeBase>
  );
}
