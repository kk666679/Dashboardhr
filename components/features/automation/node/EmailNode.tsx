"use client";

import { NodeProps } from "@xyflow/react";
import type { AutomationNode } from "./types";
import { NodeBase } from "./NodeBase";
import { Mail } from "lucide-react";

export function EmailNode({ data, selected }: NodeProps<AutomationNode>) {
  return (
    <NodeBase
      icon={<Mail className="h-5 w-5 text-rose-600" />}
      label={data?.label || "Send Email"}
      description={data?.description || "Send an email"}
      status={data?.status}
      selected={selected}
      variant="communication"
    >
      {data?.to && <div>To: {data.to}</div>}
      {data?.subject && <div>Subject: {data.subject}</div>}
      {data?.body && <div className="truncate">Body: {data.body}</div>}
    </NodeBase>
  );
}
