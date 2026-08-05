"use client";

import type { NodeProps } from "@xyflow/react";
import { NodeBase } from "../../node/NodeBase";
import { Play, Square, GitBranch, FileText, Users, Bell, Mail, CheckSquare } from "lucide-react";

export function SOPStartNode({ data, selected }: NodeProps) {
  return (
    <NodeBase
      icon={<Play className="h-5 w-5 text-green-600" />}
      label={String(data?.label ?? "Start")}
      description={String(data?.description ?? "Begin SOP")}
      status={data?.status as "pending" | "running" | "completed" | "failed" | "idle"}
      selected={selected}
      variant="start"
    />
  );
}

export function SOPEndNode({ data, selected }: NodeProps) {
  return (
    <NodeBase
      icon={<Square className="h-5 w-5 text-red-600" />}
      label={String(data?.label ?? "End")}
      description={String(data?.description ?? "SOP complete")}
      status={data?.status as "pending" | "running" | "completed" | "failed" | "idle"}
      selected={selected}
      variant="end"
    />
  );
}

export function SOPDecisionNode({ data, selected }: NodeProps) {
  return (
    <NodeBase
      icon={<GitBranch className="h-5 w-5 text-yellow-600" />}
      label={String(data?.label ?? "Decision")}
      description={String(data?.description ?? "Branch condition")}
      status={data?.status as "pending" | "running" | "completed" | "failed" | "idle"}
      selected={selected}
      variant="decision"
    />
  );
}

export function SOPActionNode({ data, selected }: NodeProps) {
  return (
    <NodeBase
      icon={<FileText className="h-5 w-5 text-blue-600" />}
      label={String(data?.label ?? "Action")}
      description={String(data?.description ?? "Perform action")}
      status={data?.status as "pending" | "running" | "completed" | "failed" | "idle"}
      selected={selected}
      variant="action"
    />
  );
}

export function SOPApprovalNode({ data, selected }: NodeProps) {
  return (
    <NodeBase
      icon={<Users className="h-5 w-5 text-purple-600" />}
      label={String(data?.label ?? "Approval")}
      description={String(data?.description ?? "Requires approval")}
      status={data?.status as "pending" | "running" | "completed" | "failed" | "idle"}
      selected={selected}
      variant="workflow"
      badge="Approval"
    />
  );
}

export function SOPNotificationNode({ data, selected }: NodeProps) {
  return (
    <NodeBase
      icon={<Bell className="h-5 w-5 text-pink-600" />}
      label={String(data?.label ?? "Notification")}
      description={String(data?.description ?? "Send notification")}
      status={data?.status as "pending" | "running" | "completed" | "failed" | "idle"}
      selected={selected}
      variant="communication"
    />
  );
}

export function SOPEmailNode({ data, selected }: NodeProps) {
  return (
    <NodeBase
      icon={<Mail className="h-5 w-5 text-rose-600" />}
      label={String(data?.label ?? "Email")}
      description={String(data?.description ?? "Send email")}
      status={data?.status as "pending" | "running" | "completed" | "failed" | "idle"}
      selected={selected}
      variant="communication"
    />
  );
}

export function SOPTaskNode({ data, selected }: NodeProps) {
  return (
    <NodeBase
      icon={<CheckSquare className="h-5 w-5 text-cyan-600" />}
      label={String(data?.label ?? "Task")}
      description={String(data?.description ?? "Manual task")}
      status={data?.status as "pending" | "running" | "completed" | "failed" | "idle"}
      selected={selected}
      variant="default"
      badge="Task"
    />
  );
}
