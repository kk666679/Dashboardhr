/**
 * Flow Process Designer Page
 * 
 * Main workflow designer page with full features including AI assistant.
 * Uses shared FlowDesigner component for consistent architecture.
 * Connected to ISO compliance workflows for full integration.
 */

"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FlowStudio } from "@/components/features/automation/flow-studio";
import type { Edge, Node } from "@xyflow/react";
import { getComplianceWorkflowTemplate, type ComplianceWorkflowType } from "@/lib/iso-workflow-integration";

// Default workflow nodes
const initialNodes: Node[] = [
  { 
    id: "trigger-1", 
    type: "trigger", 
    position: { x: 100, y: 200 }, 
    data: { event: "Order Received", source: "Webhook" }
  },
  { 
    id: "task-1", 
    type: "task", 
    position: { x: 350, y: 180 }, 
    data: { title: "Validate Order", description: "Check order details", status: "pending", priority: "high" }
  },
  { 
    id: "condition-1", 
    type: "condition", 
    position: { x: 600, y: 180 }, 
    data: { condition: "Is valid?", trueLabel: "Yes", falseLabel: "No" }
  },
  { 
    id: "action-1", 
    type: "action", 
    position: { x: 850, y: 100 }, 
    data: { action: "Process Payment", provider: "Stripe", status: "idle" }
  },
  { 
    id: "action-2", 
    type: "action", 
    position: { x: 850, y: 280 }, 
    data: { action: "Send Rejection", provider: "Email", status: "idle" }
  },
  { 
    id: "wait-1", 
    type: "wait", 
    position: { x: 1100, y: 180 }, 
    data: { duration: 24, unit: "hours" }
  },
  { 
    id: "end-1", 
    type: "end", 
    position: { x: 1350, y: 180 }, 
    data: { result: "Order Complete", summary: "Successfully processed" }
  },
];

const initialEdges: Edge[] = [
  { id: "e1", source: "trigger-1", target: "task-1", type: "smoothstep", markerEnd: { type: "arrowclosed" as const } },
  { id: "e2", source: "task-1", target: "condition-1", type: "smoothstep", markerEnd: { type: "arrowclosed" as const } },
  { id: "e3", source: "condition-1", sourceHandle: "true", target: "action-1", type: "conditional", data: { branch: "true" }, markerEnd: { type: "arrowclosed" as const }, style: { stroke: "#22c55e" } },
  { id: "e4", source: "condition-1", sourceHandle: "false", target: "action-2", type: "conditional", data: { branch: "false" }, markerEnd: { type: "arrowclosed" as const }, style: { stroke: "#ef4444" } },
  { id: "e5", source: "action-1", target: "wait-1", type: "animated", markerEnd: { type: "arrowclosed" as const } },
  { id: "e6", source: "wait-1", target: "end-1", type: "smoothstep", markerEnd: { type: "arrowclosed" as const } },
];

// Workflow execution handler
async function handleWorkflowExecute(nodes: { id: string; type?: string }[], edges: unknown[]) {
  console.log("Executing workflow:", { nodes, edges });
  for (const node of nodes) {
    console.log(`Executing node: ${node.id} (${node.type})`);
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  console.log("Workflow execution complete!");
}

function FlowDesignerInner() {
  // next/navigation hooks must not run during static prerender.
  // App is client-side, but build prerender still inspects the component.
  // We therefore guard usage behind a mount flag.
  const searchParams = useSearchParams();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);
  const [workflowData, setWorkflowData] = useState<{ nodes: Node[]; edges: Edge[] }>({
    nodes: initialNodes,
    edges: initialEdges,
  });
  const [workflowName, setWorkflowName] = useState("Flow Process Designer");
  const [templateInfo, setTemplateInfo] = useState<{ type?: string; standard?: string } | null>(null);

  // Load template from query parameters
  useEffect(() => {
    if (!hasMounted) return;

    const templateType = searchParams.get("template") as ComplianceWorkflowType | null;
    const isoStandard = searchParams.get("standard") || "ISO9001";

    if (templateType) {
      try {
        const template = getComplianceWorkflowTemplate(templateType, isoStandard);
        setWorkflowData({
          nodes: template.defaultNodes as Node[],
          edges: template.defaultEdges as Edge[],
        });
        setWorkflowName(`${template.name} (${template.isoStandard})`);
        setTemplateInfo({ type: templateType, standard: isoStandard });
      } catch (error) {
        console.error("Failed to load template:", error);
      }
    }
  }, [hasMounted, searchParams]);

  if (!hasMounted) {
    // Avoid next/navigation hooks during prerender/SSG inspection.
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Navigation Header */}
      <div className="border-b bg-card p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/automation">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="size-4" />
              Back to Automation
            </Button>
          </Link>
          <div>
            <h1 className="text-lg font-semibold">{workflowName}</h1>
            <p className="text-sm text-muted-foreground">Design, execute, and manage workflows</p>
          </div>
        </div>
        <Link href="/automation/designer">
          <Button variant="outline" size="sm">
            Open Designer
          </Button>
        </Link>
      </div>

      {/* Template Info Alert */}
      {templateInfo && (
        <Alert className="m-4 border-blue-200 bg-blue-50">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-sm text-blue-800">
            Compliance workflow template loaded: <strong>{templateInfo.type}</strong> for <strong>{templateInfo.standard}</strong>
          </AlertDescription>
        </Alert>
      )}

{/* Designer Container */}
      <div className="flex-1 overflow-hidden">
        <FlowStudio
          initialNodes={workflowData.nodes}
          initialEdges={workflowData.edges}
          enableAI={true}
          workflowName={workflowName}
          onWorkflowExecute={handleWorkflowExecute}
          onWorkflowSave={(nodes, edges) => {
            console.log("Saving workflow:", { nodes, edges });
          }}
          onWorkflowExport={(nodes, edges) => {
            console.log("Exporting workflow:", { nodes, edges });
          }}
          onWorkflowImport={(data) => {
            console.log("Importing workflow:", data);
          }}
        />
      </div>
    </div>
  );
}

export default function FlowDesignerPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center text-muted-foreground text-sm">Loading…</div>}>
      <FlowDesignerInner />
    </Suspense>
  );
}
