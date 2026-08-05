"use client";

/**
 * SOPWorkflowDesigner — SOP-specific workflow designer.
 *
 * Now uses the shared FlowDesigner component with SOP-specific node/edge types.
 * This eliminates the previous standalone implementation that duplicated
 * state management, toolbar, sidebar, and canvas logic.
 *
 * @see FlowDesigner (shared base)
 * @see SOPNodeTypes (SOP-specific nodes)
 * @see SOPEdgeTypes (SOP-specific edges)
 */

import { useCallback } from "react";
import { FlowDesigner } from "../FlowDesigner";
import { SOPNodeTypes } from "./nodes";
import { SOPEdgeTypes } from "./edges";
import { useToast } from "@/components/ui/use-toast";
import type { Node, Edge } from "@xyflow/react";

interface SOPWorkflowDesignerProps {
  sopId?: string;
}

export function SOPWorkflowDesigner({ sopId }: SOPWorkflowDesignerProps) {
  const { toast } = useToast();

  const handleExecute = useCallback(
    (nodes: Node[], edges: Edge[]) => {
      toast({ title: "Executing SOP workflow", description: `${nodes.length} nodes, ${edges.length} edges` });
    },
    [toast]
  );

  const handleSave = useCallback(
    (_nodes: Node[], _edges: Edge[]) => {
      toast({ title: "SOP workflow saved" });
    },
    [toast]
  );

  return (
    <FlowDesigner
      flowId={sopId ? `sop-${sopId}` : undefined}
      nodeTypes={SOPNodeTypes}
      edgeTypes={SOPEdgeTypes}
      onWorkflowExecute={handleExecute}
      onWorkflowSave={handleSave}
      leftSidebarCollapsible={true}
      rightSidebarCollapsible={true}
    />
  );
}

/**
 * Standalone entry for use outside a ReactFlowProvider.
 */
export function SOPWorkflowDesignerWithProvider({ sopId }: SOPWorkflowDesignerProps) {
  return <SOPWorkflowDesigner sopId={sopId} />;
}

