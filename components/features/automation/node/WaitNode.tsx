"use client";

import type { Node, NodeProps } from "@xyflow/react";
import type { AutomationNodeData } from "./types";
import { NodeBase } from "./NodeBase";
import { Clock } from "lucide-react";
export function WaitNode({ data, selected }: NodeProps<Node<AutomationNodeData, string | undefined>>) {
  const waitType = data?.waitType || "time";
  const duration = data?.duration;
  const event = data?.event;
  const condition = data?.condition;
  const timeout = data?.timeout;

  return (
    <NodeBase
      icon={<Clock className="h-5 w-5 text-amber-600" />}
      label={data?.label || "Wait"}
      description={data?.description || "Pause execution"}
      status={data?.status as "pending" | "running" | "completed" | "failed" | "idle" | undefined}
      selected={selected}
      variant="default"
    >
      <div className="space-y-1 text-[11px]">
        {waitType === "time" && duration !== undefined && (
          <div>⏱️ Wait {duration}s</div>
        )}
        {waitType === "event" && event && (
          <div>📡 Wait for {event}</div>
        )}
        {waitType === "condition" && condition && (
          <div>🔍 Wait until {condition}</div>
        )}
        {timeout !== undefined && (
          <div className="text-muted-foreground">Timeout: {timeout}s</div>
        )}
      </div>
    </NodeBase>
  );
}
