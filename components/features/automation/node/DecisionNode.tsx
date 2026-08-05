"use client";

import { NodeProps } from "@xyflow/react";
import type { AutomationNode } from "./types";
import { NodeBase } from "./NodeBase";
import { GitBranch } from "lucide-react";

export function DecisionNode({ data, selected }: NodeProps<AutomationNode>) {
  return (
    <NodeBase
      icon={<GitBranch className="h-5 w-5 text-yellow-600" />}
      label={data?.label || "Decision"}
      description={data?.description || "Branch based on condition"}
      status={data?.status}
      selected={selected}
      variant="decision"
    >
      {data?.condition && <div>Condition: {data.condition}</div>}
      <div className="flex gap-2 text-[10px]">
        <span className="text-green-600">Yes → {data?.yes || "..."}</span>
        <span className="text-red-600">No → {data?.no || "..."}</span>
      </div>
    </NodeBase>
  );
}
