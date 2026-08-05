"use client";

import { NodeProps } from "@xyflow/react";
import type { AutomationNode } from "./types";
import { NodeBase } from "./NodeBase";
import { Bell } from "lucide-react";

export function TriggerNode({ data, selected }: NodeProps<AutomationNode>) {
  return (
    <NodeBase
      icon={<Bell className="h-5 w-5 text-orange-600" />}
      label={data?.label || "Trigger"}
      description={data?.description || "Wait for an event"}
      status={data?.status}
      selected={selected}
      variant="action"
    >
      {data?.event && <div>Event: {data.event}</div>}
      {data?.schedule && <div>Schedule: {data.schedule}</div>}
    </NodeBase>
  );
}
