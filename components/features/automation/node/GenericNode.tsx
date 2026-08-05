"use client";

import { NodeProps } from "@xyflow/react";
import type { AutomationNode } from "./types";
import { NodeBase } from "./NodeBase";
import { Circle } from "lucide-react";

export function GenericNode({ data, selected }: NodeProps<AutomationNode>) {
  return (
    <NodeBase
      icon={<Circle className="h-5 w-5 text-gray-600" />}
      label={data?.label || "Node"}
      description={data?.description || "Generic node"}
      status={data?.status}
      selected={selected}
      variant="default"
    >
      {data?.details && <div className="truncate">{data.details}</div>}
    </NodeBase>
  );
}