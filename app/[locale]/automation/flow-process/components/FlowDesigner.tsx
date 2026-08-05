"use client";

/**
 * FlowDesigner — Bridge component for flow-process pages.
 *
 * Previously this was a thin wrapper that dropped all props.
 * Now properly passes all props to the shared FlowDesigner.
 *
 * @see FlowDesigner (shared base in components/features/automation)
 */

import type { Node, Edge } from "@xyflow/react";
import { FlowDesigner as BaseFlowDesigner } from "@/components/features/automation/FlowDesigner";

interface FlowDesignerProps {
  initialNodes?: Node[];
  initialEdges?: Edge[];
  enableAI?: boolean;
  leftSidebarCollapsible?: boolean;
  rightSidebarCollapsible?: boolean;
  defaultEdgeType?: string;
  defaultShowMinimap?: boolean;
  defaultShowControls?: boolean;
  workflowName?: string;
  onWorkflowExecute?: (nodes: Node[], edges: Edge[]) => void;
  onWorkflowSave?: (nodes: Node[], edges: Edge[]) => void;
  onWorkflowExport?: (nodes: Node[], edges: Edge[]) => void;
  onWorkflowImport?: (data: unknown) => void;
}

export function FlowDesigner(props: FlowDesignerProps) {
  return <BaseFlowDesigner {...props} />;
}

