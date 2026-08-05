"use client";

import { NodeProps } from "@xyflow/react";
import type { AutomationNode } from "./types";
import { NodeBase } from "./NodeBase";
import { RefreshCw } from "lucide-react";

export function SubflowNode({ data, selected }: NodeProps<AutomationNode>) {
  return (
    <NodeBase
      icon={<RefreshCw className="h-5 w-5 text-cyan-600" />}
      label={data?.label || "Subflow"}
      description={data?.description || "Call another flow"}
      status={data?.status}
      selected={selected}
      variant="workflow"
    >
      {data?.flowId && <div>Flow: {data.flowId}</div>}
      {data?.params && <div>Params: {JSON.stringify(data.params)}</div>}
    </NodeBase>
  );
}
