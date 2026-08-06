"use client";

/**
 * Workflow Engine Page
 *
 * Replaced standalone ReactFlow with the shared FlowStudio component.
 * This integrates with the unified automation state management and
 * provides all canvas tools, palette, properties panel, AI copilot,
 * execution panel, version history, and responsive mobile sheets.
 *
 * @see FlowStudio (shared base)
 */

import { useCallback } from "react";
import { FlowStudio } from "@/components/features/automation/flow-studio";
import { useToast } from "@/components/ui/use-toast";
import type { Node, Edge } from "@xyflow/react";

export default function WorkflowEnginePage() {
  const { toast } = useToast();

  const handleExecute = useCallback(
    (nodes: Node[], edges: Edge[]) => {
      toast({
        title: "Workflow execution started",
        description: `${nodes.length} nodes, ${edges.length} edges`,
      });
    },
    [toast]
  );

  const handleSave = useCallback(
    (_nodes: Node[], _edges: Edge[]) => {
      toast({ title: "Workflow saved" });
    },
    [toast]
  );

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <FlowStudio
        onWorkflowExecute={handleExecute}
        onWorkflowSave={handleSave}
        enableAI
      />
    </div>
  );
}
