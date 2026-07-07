/**
 * Enhanced Flow Process Designer
 * 
 * Advanced workflow designer with simplified interface.
 * Uses shared FlowDesigner component for consistent architecture.
 * Connected to ISO compliance workflows for full integration.
 */

"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { FlowDesigner } from "../components";

// Default workflow nodes for enhanced page
const initialNodes = [
  { 
    id: "1", 
    type: "trigger", 
    position: { x: 100, y: 200 }, 
    data: { event: "Order Received", source: "Webhook" }
  },
  { 
    id: "2", 
    type: "task", 
    position: { x: 350, y: 180 }, 
    data: { title: "Validate Order", status: "pending" }
  },
  { 
    id: "3", 
    type: "condition", 
    position: { x: 600, y: 180 }, 
    data: { condition: "Is valid?" }
  },
  { 
    id: "4", 
    type: "action", 
    position: { x: 850, y: 100 }, 
    data: { action: "Process Payment" }
  },
  { 
    id: "5", 
    type: "end", 
    position: { x: 1100, y: 180 }, 
    data: { result: "Complete" }
  },
];

const initialEdges = [
  { id: "e1-2", source: "1", target: "2", type: "smoothstep", markerEnd: { type: "arrowclosed" as const } },
  { id: "e2-3", source: "2", target: "3", type: "smoothstep", markerEnd: { type: "arrowclosed" as const } },
  { id: "e3-4", source: "3", target: "4", type: "conditional", markerEnd: { type: "arrowclosed" as const } },
  { id: "e4-5", source: "4", target: "5", type: "animated", markerEnd: { type: "arrowclosed" as const } },
];

// Workflow execution handler
async function handleWorkflowExecute(nodes: any[], edges: any[]) {
  console.log("Executing enhanced workflow:", { nodes, edges });
  
  // Simulate execution
  for (const node of nodes) {
    console.log(`Executing node: ${node.id} (${node.type})`);
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  
  console.log("Enhanced workflow execution complete!");
}

export default function EnhancedFlowPage() {
  return (
    <div className="h-screen flex flex-col">
      {/* Navigation Header */}
      <div className="border-b bg-card p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/iso">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="size-4" />
              Back to ISO Compliance
            </Button>
          </Link>
          <div>
            <h1 className="text-lg font-semibold">Enhanced Flow Designer</h1>
            <p className="text-sm text-muted-foreground">Simplified workflow designer for fast iterations</p>
          </div>
        </div>
        <Link href="/iso">
          <Button variant="outline" size="sm">
            View ISO Compliance
          </Button>
        </Link>
      </div>

      {/* Designer Container */}
      <div className="flex-1 overflow-hidden">
        <FlowDesigner
          initialNodes={initialNodes}
          initialEdges={initialEdges}
          enableAI={false}
          leftSidebarCollapsible={false}
          rightSidebarCollapsible={false}
          defaultEdgeType="smoothstep"
          defaultShowMinimap={true}
          defaultShowControls={true}
          workflowName="Enhanced Flow Designer"
          onWorkflowExecute={handleWorkflowExecute}
          onWorkflowSave={(nodes, edges) => {
            console.log("Saving enhanced workflow:", { nodes, edges });
          }}
          onWorkflowExport={(nodes, edges) => {
            console.log("Exporting enhanced workflow:", { nodes, edges });
          }}
          onWorkflowImport={(data) => {
            console.log("Importing enhanced workflow:", data);
          }}
        />
      </div>
    </div>
  );
}
