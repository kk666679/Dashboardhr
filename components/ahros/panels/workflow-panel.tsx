/**
 * WorkflowPanel — Interactive workflow blueprint.
 *
 * Renders the FlowDesigner component (React Flow) as the center panel,
 * automatically populated from the AI-generated plan.
 * Supports editing, versioning, AI suggestions, and live collaboration.
 */

"use client";

import { useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import { useAhrosStore } from "@/lib/zustand/ahros-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlayIcon, SaveIcon, DownloadIcon } from "lucide-react";

// Dynamic import to avoid SSR issues with React Flow
const FlowDesigner = dynamic(
  () =>
    import("@/components/features/automation/FlowDesigner").then(
      (mod) => mod.FlowDesigner,
    ),
  {
    ssr: false,
    loading: () => <WorkflowLoading />,
  },
);

function WorkflowLoading() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center gap-2 text-muted-foreground">
        <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-sm">Loading workflow designer...</p>
      </div>
    </div>
  );
}

export function WorkflowPanel() {
  const plan = useAhrosStore((s) => s.currentPlan);
  const status = useAhrosStore((s) => s.status);

  // Convert plan tasks to initial nodes/edges for FlowDesigner
  const initialNodes = useMemo(() => {
    if (!plan || plan.tasks.length === 0) return undefined;

    return plan.tasks.map((task, index) => ({
      id: task.id,
      type: "default" as const,
      position: { x: 250, y: index * 100 + 50 },
      data: {
        label: task.title,
        description: task.description,
        risk: task.risk,
        confidence: task.confidence,
        estimatedDuration: task.estimatedDuration,
      },
    }));
  }, [plan]);

  const initialEdges = useMemo(() => {
    if (!plan) return undefined;

    const edges: Array<{
      id: string;
      source: string;
      target: string;
      type: string;
      animated: boolean;
    }> = [];

    plan.tasks.forEach((task) => {
      task.dependencies.forEach((depId) => {
        edges.push({
          id: `e-${depId}-${task.id}`,
          source: depId,
          target: task.id,
          type: "smoothstep",
          animated: true,
        });
      });
    });

    return edges.length > 0 ? edges : undefined;
  }, [plan]);

  const handleExecute = useCallback(() => {
    const store = useAhrosStore.getState();
    store.startExecution();
  }, []);

  if (!plan) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center text-muted-foreground">
        <p className="text-sm">No workflow generated yet</p>
        <p className="text-xs mt-1">
          The workflow will appear here once a plan is created
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b bg-muted/20 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium">Workflow Canvas</span>
          <Badge variant="outline" className="text-[9px]">
            {plan.tasks.length} nodes
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            className="h-7 px-2 text-xs"
            onClick={handleExecute}
          >
            <PlayIcon className="size-3 mr-1" />
            Execute
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 px-2 text-xs"
          >
            <SaveIcon className="size-3 mr-1" />
            Save
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 px-2 text-xs"
          >
            <DownloadIcon className="size-3 mr-1" />
            Export
          </Button>
        </div>
      </div>

      {/* Flow Designer */}
      <div className="flex-1">
        <FlowDesigner
          initialNodes={initialNodes}
          initialEdges={initialEdges}
          defaultShowMinimap
          defaultShowControls
        />
      </div>
    </div>
  );
}
