"use client";

import { NodeProps } from "@xyflow/react";
import type { AutomationNode } from "./types";
import { NodeBase } from "./NodeBase";
import { MessageSquare } from "lucide-react";

export function MessageNode({ data, selected }: NodeProps<AutomationNode>) {
  return (
    <NodeBase
      icon={<MessageSquare className="h-5 w-5 text-violet-600" />}
      label={data?.label || "Message"}
      description={data?.description || "Send a message"}
      status={data?.status}
      selected={selected}
      variant="communication"
    >
      {data?.channel && <div>Channel: {data.channel}</div>}
      {data?.text && <div className="truncate">Text: {data.text}</div>}
    </NodeBase>
  );
}
