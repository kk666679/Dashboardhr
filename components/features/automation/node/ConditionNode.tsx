"use client";

import { NodeProps } from "@xyflow/react";
import type { AutomationNode } from "./types";
import { NodeBase } from "./NodeBase";
import { HelpCircle } from "lucide-react";

export function ConditionNode({ data, selected }: NodeProps<AutomationNode>) {
  return (
    <NodeBase
      icon={<HelpCircle className="h-5 w-5 text-cyan-600" />}
      label={data?.label || "Condition"}
      description={data?.description || "Wait for a condition"}
      status={data?.status}
      selected={selected}
      variant="decision"
    >
      {data?.condition && <div>Condition: {data.condition}</div>}
      {data?.timeout && <div>Timeout: {data.timeout}s</div>}
    </NodeBase>
  );
}
