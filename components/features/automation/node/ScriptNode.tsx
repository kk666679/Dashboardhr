"use client";

import { NodeProps } from "@xyflow/react";
import type { AutomationNode } from "./types";
import { NodeBase } from "./NodeBase";
import { FileCode } from "lucide-react";

export function ScriptNode({ data, selected }: NodeProps<AutomationNode>) {
  return (
    <NodeBase
      icon={<FileCode className="h-5 w-5 text-emerald-600" />}
      label={data?.label || "Script"}
      description={data?.description || "Execute a script"}
      status={data?.status}
      selected={selected}
      variant="custom"
    >
      {data?.language && <div>Language: {data.language}</div>}
      {data?.script && <div className="truncate">Script: {data.script}</div>}
    </NodeBase>
  );
}
