"use client";

/**
 * Visual Workflow Designer page — Task 4.5
 *
 * Client Component using @xyflow/react dynamic import.
 * - Save/load workflow definition JSON via tRPC
 * - Monitoring view sub-route shows active workflows + SLA countdown
 *
 * Requirements: 24.1, 24.5
 */

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Save, Play, Eye } from "lucide-react";

// Dynamically import React Flow (no SSR)
const ReactFlow = dynamic(() => import("@xyflow/react").then((m) => m.ReactFlow), { ssr: false });
const Background = dynamic(() => import("@xyflow/react").then((m) => m.Background), { ssr: false });
const Controls = dynamic(() => import("@xyflow/react").then((m) => m.Controls), { ssr: false });
const MiniMap = dynamic(() => import("@xyflow/react").then((m) => m.MiniMap), { ssr: false });

// ─── Step type colours ────────────────────────────────────────────────────────

const STEP_COLORS: Record<string, string> = {
  human:       "#2563eb",
  auto:        "#059669",
  parallel:    "#7c3aed",
  condition:   "#d97706",
  escalation:  "#dc2626",
};

// ─── Default empty graph ──────────────────────────────────────────────────────

const DEFAULT_NODES = [
  {
    id: "start",
    type: "input",
    position: { x: 250, y: 50 },
    data: { label: "Start" },
    style: { background: "#059669", color: "#fff", border: "none", borderRadius: 8 },
  },
  {
    id: "step1",
    position: { x: 250, y: 160 },
    data: { label: "Manager Approval", type: "human" },
    style: { background: "#2563eb", color: "#fff", borderRadius: 8 },
  },
  {
    id: "end",
    type: "output",
    position: { x: 250, y: 270 },
    data: { label: "End" },
    style: { background: "#64748b", color: "#fff", border: "none", borderRadius: 8 },
  },
];

const DEFAULT_EDGES = [
  { id: "e-start-step1", source: "start", target: "step1", type: "smoothstep" },
  { id: "e-step1-end",   source: "step1", target: "end",   type: "smoothstep" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function WorkflowDesignerPage() {
  const router = useRouter();
  const [flowNodes, setFlowNodes] = useState<any[]>(DEFAULT_NODES);
  const [flowEdges, setFlowEdges] = useState<any[]>(DEFAULT_EDGES);
  const [workflowName, setWorkflowName] = useState("New Workflow");
  const [selectedModule, setSelectedModule] = useState("leave");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");

  const saveDefinition = trpc.workflowEngine.saveDefinition.useMutation();
  const { data: definitions } = trpc.workflowEngine.listDefinitions.useQuery({});
  const { data: monitoring } = trpc.workflowEngine.getMonitoringDashboard.useQuery({});

  const handleSave = useCallback(async () => {
    setSaveStatus("saving");
    try {
      await saveDefinition.mutateAsync({
        name: workflowName,
        module: selectedModule,
        graphJson: {
          nodes: flowNodes.map((n) => ({
            id: n.id,
            type: n.data?.type ?? "human",
            label: typeof n.data?.label === "string" ? n.data.label : n.id,
            assigneeRole: n.data?.assigneeRole,
          })),
          edges: flowEdges.map((e) => ({
            id: e.id,
            source: e.source,
            target: e.target,
            condition: e.data?.condition,
          })),
        },
        isActive: false,
      });
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (err) {
      setSaveStatus("idle");
      console.error("Save failed", err);
    }
  }, [flowNodes, flowEdges, workflowName, selectedModule, saveDefinition]);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Workflow Designer</h1>
          <p className="text-sm text-muted-foreground">
            Build and manage approval workflows for any HCM module
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/dashboard/workflow-engine/monitor")}>
            <Eye className="h-4 w-4 mr-2" /> Monitor
          </Button>
          <Button onClick={handleSave} disabled={saveStatus === "saving"}>
            <Save className="h-4 w-4 mr-2" />
            {saveStatus === "saving" ? "Saving…" : saveStatus === "saved" ? "Saved ✓" : "Save"}
          </Button>
        </div>
      </div>

      {/* Monitoring stats */}
      {monitoring && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="text-2xl font-bold text-blue-600">{monitoring.active}</div>
            <div className="text-sm text-muted-foreground">Active</div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-green-600">{monitoring.completed}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-red-600">{monitoring.rejected}</div>
            <div className="text-sm text-muted-foreground">Rejected</div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{monitoring.slaBreached}</div>
            <div className="text-sm text-muted-foreground">SLA Breached</div>
          </Card>
        </div>
      )}

      {/* Designer canvas */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3 flex-wrap">
            <CardTitle className="text-base">Canvas</CardTitle>
            <input
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              className="border rounded px-2 py-1 text-sm w-48"
              placeholder="Workflow name"
            />
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="border rounded px-2 py-1 text-sm"
            >
              {["leave", "recruitment", "payroll", "lifecycle", "onboarding", "performance"].map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            {/* Step type legend */}
            <div className="flex gap-2 ml-auto flex-wrap">
              {Object.entries(STEP_COLORS).map(([type, color]) => (
                <Badge key={type} style={{ background: color, color: "#fff" }}>{type}</Badge>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div style={{ height: 540, width: "100%" }}>
            <ReactFlow
              nodes={flowNodes}
              edges={flowEdges}
              onNodesChange={(changes: any) => {
                setFlowNodes((nds: any[]) => {
                  // apply position changes
                  return nds.map((n) => {
                    const change = changes.find((c: any) => c.id === n.id);
                    if (change?.type === "position" && change.position) {
                      return { ...n, position: change.position };
                    }
                    return n;
                  });
                });
              }}
              onEdgesChange={(changes: any) => {
                // handle edge removals
                setFlowEdges((eds: any[]) =>
                  eds.filter((e) => !changes.some((c: any) => c.type === "remove" && c.id === e.id))
                );
              }}
              onConnect={(connection: any) => {
                setFlowEdges((eds) => [
                  ...eds,
                  {
                    id: `e-${connection.source}-${connection.target}`,
                    source: connection.source,
                    target: connection.target,
                    type: "smoothstep",
                  },
                ]);
              }}
              fitView
            >
              <Background />
              <Controls />
              <MiniMap />
            </ReactFlow>
          </div>
        </CardContent>
      </Card>

      {/* Saved definitions */}
      {definitions && definitions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Saved Definitions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {definitions.map((def) => (
                <div key={def.id} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <span className="font-medium">{def.name}</span>
                    <span className="text-sm text-muted-foreground ml-2">v{def.version} · {def.module}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={def.isActive ? "default" : "outline"}>
                      {def.isActive ? "Active" : "Draft"}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const graph = def.graphJson as any;
                        setFlowNodes(
                          graph.nodes?.map((n: any, i: number) => ({
                            id: n.id,
                            position: { x: i * 200, y: 100 },
                            data: { label: n.label, type: n.type },
                            style: {
                              background: STEP_COLORS[n.type] ?? "#64748b",
                              color: "#fff",
                              borderRadius: 8,
                            },
                          })) ?? []
                        );
                        setFlowEdges(
                          graph.edges?.map((e: any) => ({
                            id: e.id,
                            source: e.source,
                            target: e.target,
                            type: "smoothstep",
                          })) ?? []
                        );
                        setWorkflowName(def.name);
                        setSelectedModule(def.module);
                      }}
                    >
                      Load
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
