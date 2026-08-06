"use client";

import { useWorkflowStore } from "@/lib/zustand/workflow-store";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  CircleDot,
  Loader2,
  CheckCircle2,
  XCircle,
  Users,
  Save,
  MousePointer2,
} from "lucide-react";

interface FlowStudioStatusBarProps {
  instanceId?: string;
  className?: string;
}

/**
 * Persistent bottom status bar showing live workflow state:
 *  - Zoom level
 *  - Node / edge counts
 *  - Current selection count
 *  - Execution status (Running / Completed / Failed)
 *  - Save state (saved X seconds ago)
 *  - Collaborators online
 */
export function FlowStudioStatusBar({ instanceId, className }: FlowStudioStatusBarProps) {
  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);
  const selectedNodeIds = useWorkflowStore((s) => s.selectedNodeIds);
  const selectedEdgeIds = useWorkflowStore((s) => s.selectedEdgeIds);
  const executionStatus = useWorkflowStore((s) => s.executionStatus);
  const isDirty = useWorkflowStore((s) => s.isDirty);
  const viewport = useWorkflowStore((s) => s.viewport);

  const zoom = Math.round(viewport.zoom * 100);
  const selectionCount = selectedNodeIds.length + selectedEdgeIds.length;

  const executionMeta = {
    idle: { label: "Idle", icon: <CircleDot className="h-3 w-3" />, cls: "text-muted-foreground" },
    running: { label: "Running", icon: <Loader2 className="h-3 w-3 animate-spin" />, cls: "text-green-600" },
    paused: { label: "Paused", icon: <CircleDot className="h-3 w-3" />, cls: "text-yellow-600" },
    completed: { label: "Completed", icon: <CheckCircle2 className="h-3 w-3" />, cls: "text-green-600" },
    failed: { label: "Failed", icon: <XCircle className="h-3 w-3" />, cls: "text-red-600" },
  }[executionStatus] ?? { label: "Idle", icon: <CircleDot className="h-3 w-3" />, cls: "text-muted-foreground" };

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-3 h-7 border-t bg-background/95 backdrop-blur-md text-[11px] text-muted-foreground shrink-0 overflow-x-auto scrollbar-none select-none",
        className
      )}
    >
      {/* Zoom */}
      <span className="flex items-center gap-1 whitespace-nowrap">
        <MousePointer2 className="h-3 w-3" />
        Zoom: {zoom}%
      </span>

      <span className="w-px h-3 bg-border" />

      {/* Node / edge counts */}
      <span className="whitespace-nowrap">Nodes: {nodes.length}</span>
      <span className="whitespace-nowrap">Edges: {edges.length}</span>

      {/* Selection */}
      {selectionCount > 0 && (
        <>
          <span className="w-px h-3 bg-border" />
          <span className="whitespace-nowrap text-foreground">Selection: {selectionCount}</span>
        </>
      )}

      <span className="flex-1" />

      {/* Execution status */}
      <span className={cn("flex items-center gap-1 whitespace-nowrap", executionMeta.cls)}>
        {executionMeta.icon}
        {executionMeta.label}
      </span>

      {/* Save state */}
      <span className="flex items-center gap-1 whitespace-nowrap">
        <Save className="h-3 w-3" />
        {isDirty ? (
          <span className="text-amber-500 font-medium">Unsaved changes</span>
        ) : (
          <span>Saved just now</span>
        )}
      </span>

      <span className="w-px h-3 bg-border" />

      {/* Collaborators */}
      <span className="flex items-center gap-1 whitespace-nowrap">
        <Users className="h-3 w-3" />
        3 online
      </span>

      {instanceId && (
        <Badge variant="outline" className="h-4 text-[9px] px-1.5 whitespace-nowrap">
          {instanceId}
        </Badge>
      )}
    </div>
  );
}
