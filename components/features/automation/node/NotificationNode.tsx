"use client";

import { NodeProps } from "@xyflow/react";
import type { AutomationNode } from "./types";
import { NodeBase } from "./NodeBase";
import { BellRing } from "lucide-react";

export function NotificationNode({ data, selected }: NodeProps<AutomationNode>) {
  return (
    <NodeBase
      icon={<BellRing className="h-5 w-5 text-amber-600" />}
      label={data?.label || "Notification"}
      description={data?.description || "Send a notification"}
      status={data?.status}
      selected={selected}
      variant="communication"
    >
      {data?.title && <div>Title: {data.title}</div>}
      {data?.message && <div className="truncate">Message: {data.message}</div>}
    </NodeBase>
  );
}
