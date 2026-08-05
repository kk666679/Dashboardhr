"use client";

import { NodeProps } from "@xyflow/react";
import type { AutomationNode } from "./types";
import { NodeBase } from "./NodeBase";
import { Repeat } from "lucide-react";

export function LoopNode({ data, selected }: NodeProps<AutomationNode>) {
  return (
    <NodeBase
      icon={<Repeat className="h-5 w-5 text-indigo-600" />}
      label={data?.label || "Loop"}
      description={data?.description || "Iterate over items"}
      status={data?.status}
      selected={selected}
      variant="workflow"
    >
      {data?.iterations && <div>Iterations: {data.iterations}</div>}
      {data?.collection && <div>Collection: {data.collection}</div>}
    </NodeBase>
  );
}
