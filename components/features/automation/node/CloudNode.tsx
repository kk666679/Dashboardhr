"use client";

import { NodeProps } from "@xyflow/react";
import type { AutomationNode } from "./types";
import { NodeBase } from "./NodeBase";
import { Cloud } from "lucide-react";

export function CloudNode({ data, selected }: NodeProps<AutomationNode>) {
  return (
    <NodeBase
      icon={<Cloud className="h-5 w-5 text-blue-500" />}
      label={data?.label || "Cloud Service"}
      description={data?.description || "Interact with cloud services"}
      status={data?.status}
      selected={selected}
      variant="integration"
    >
      {data?.service && <div>Service: {data.service}</div>}
      {data?.action && <div>Action: {data.action}</div>}
    </NodeBase>
  );
}
