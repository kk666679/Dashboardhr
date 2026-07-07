"use client";

/**
 * Organisation Hierarchy Page — Task 2.3
 *
 * Uses @xyflow/react (dynamically imported) to render the full org hierarchy
 * within the authenticated user's permitted scope.
 *
 * Target: initial render within 2 seconds (Req 1.6)
 * Requirements: 1.6
 */

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Building2, GitBranch, Plus } from "lucide-react";

// Dynamically import React Flow to avoid SSR issues
const ReactFlow = dynamic(
  () => import("@xyflow/react").then((m) => m.ReactFlow),
  { ssr: false }
);
const Background = dynamic(
  () => import("@xyflow/react").then((m) => m.Background),
  { ssr: false }
);
const Controls = dynamic(
  () => import("@xyflow/react").then((m) => m.Controls),
  { ssr: false }
);
const MiniMap = dynamic(
  () => import("@xyflow/react").then((m) => m.MiniMap),
  { ssr: false }
);

// ─── Level colour map ─────────────────────────────────────────────────────────

const LEVEL_COLORS: Record<string, string> = {
  GROUP:         "#1e3a5f",
  LEGAL_ENTITY:  "#2563eb",
  BUSINESS_UNIT: "#7c3aed",
  DEPARTMENT:    "#059669",
  BRANCH:        "#d97706",
  COST_CENTER:   "#64748b",
};

const LEVEL_LABELS: Record<string, string> = {
  GROUP:         "Group",
  LEGAL_ENTITY:  "Legal Entity",
  BUSINESS_UNIT: "Business Unit",
  DEPARTMENT:    "Department",
  BRANCH:        "Branch",
  COST_CENTER:   "Cost Centre",
};

// ─── Layout helper — simple top-down tree layout ──────────────────────────────

function layoutTree(nodes: any[]): { id: string; x: number; y: number }[] {
  const levelGroups: Record<string, string[]> = {};
  for (const n of nodes) {
    const lvl = n.level ?? "GROUP";
    levelGroups[lvl] = levelGroups[lvl] ?? [];
    levelGroups[lvl].push(n.id);
  }

  const LEVELS = ["GROUP", "LEGAL_ENTITY", "BUSINESS_UNIT", "DEPARTMENT", "BRANCH", "COST_CENTER"];
  const positions: { id: string; x: number; y: number }[] = [];

  LEVELS.forEach((level, yIndex) => {
    const group = levelGroups[level] ?? [];
    group.forEach((id, xIndex) => {
      positions.push({ id, x: xIndex * 240, y: yIndex * 120 });
    });
  });

  return positions;
}

// ─── Flatten hierarchy (recursive) ───────────────────────────────────────────

function flattenHierarchy(nodes: any[]): any[] {
  const flat: any[] = [];
  function walk(node: any) {
    flat.push(node);
    if (Array.isArray(node.children)) {
      for (const child of node.children) walk(child);
    }
  }
  for (const root of nodes) walk(root);
  return flat;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function OrganisationPage() {
  const router = useRouter();
  const [flowNodes, setFlowNodes] = useState<any[]>([]);
  const [flowEdges, setFlowEdges] = useState<any[]>([]);

  const { data: hierarchy, isLoading, error } = trpc.organisation.getHierarchy.useQuery(undefined, {
    staleTime: 30_000,
  });

  useEffect(() => {
    if (!hierarchy) return;

    const flat = flattenHierarchy(hierarchy);
    const positions = layoutTree(flat);
    const posMap = new Map(positions.map((p) => [p.id, p]));

    const rfNodes = flat.map((node) => {
      const pos = posMap.get(node.id) ?? { x: 0, y: 0 };
      const color = LEVEL_COLORS[node.level] ?? "#64748b";
      return {
        id: node.id,
        type: "default",
        position: { x: pos.x, y: pos.y },
        data: {
          label: (
            <div className="text-center p-1" onClick={() => router.push(`/dashboard/organisation/${node.id}`)}>
              <div className="font-semibold text-white text-xs leading-tight">{node.name}</div>
              <div className="text-xs opacity-80 mt-0.5">{LEVEL_LABELS[node.level] ?? node.level}</div>
              {!node.isActive && (
                <div className="text-xs text-yellow-300 mt-0.5">Inactive</div>
              )}
            </div>
          ),
        },
        style: {
          background: color,
          border: `2px solid ${node.isActive ? color : "#f59e0b"}`,
          borderRadius: 8,
          minWidth: 160,
          cursor: "pointer",
        },
      };
    });

    const rfEdges = flat
      .filter((n) => n.parentId)
      .map((n) => ({
        id: `e-${n.parentId}-${n.id}`,
        source: n.parentId,
        target: n.id,
        type: "smoothstep",
        style: { stroke: "#94a3b8" },
      }));

    setFlowNodes(rfNodes);
    setFlowEdges(rfEdges);
  }, [hierarchy, router]);

  const totalNodes = useMemo(() => (hierarchy ? flattenHierarchy(hierarchy).length : 0), [hierarchy]);
  const activeNodes = useMemo(
    () => (hierarchy ? flattenHierarchy(hierarchy).filter((n) => n.isActive).length : 0),
    [hierarchy]
  );

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building2 className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Organisation Hierarchy</h1>
            <p className="text-sm text-muted-foreground">
              Manage your corporate structure — from Group down to Cost Centre
            </p>
          </div>
        </div>
        <Button onClick={() => router.push("/dashboard/organisation/new")}>
          <Plus className="h-4 w-4 mr-2" /> Add Node
        </Button>
      </div>

      {/* Summary badges */}
      <div className="flex gap-3 flex-wrap">
        {Object.entries(LEVEL_LABELS).map(([level, label]) => (
          <Badge
            key={level}
            style={{ background: LEVEL_COLORS[level], color: "#fff" }}
          >
            {label}
          </Badge>
        ))}
        <Badge variant="outline">{totalNodes} total nodes</Badge>
        <Badge variant="outline" className="text-green-600">{activeNodes} active</Badge>
      </div>

      {/* Org chart */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <GitBranch className="h-4 w-4" />
            Chart View
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div style={{ height: 600, width: "100%" }}>
            {isLoading && (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Loading hierarchy…
              </div>
            )}
            {error && (
              <div className="flex items-center justify-center h-full text-destructive">
                Failed to load hierarchy
              </div>
            )}
            {!isLoading && !error && (
              <ReactFlow
                nodes={flowNodes}
                edges={flowEdges}
                fitView
                fitViewOptions={{ padding: 0.2 }}
                nodesDraggable={false}
                nodesConnectable={false}
                elementsSelectable={true}
                onNodeClick={(_evt, node) => router.push(`/dashboard/organisation/${node.id}`)}
              >
                <Background color="#e2e8f0" gap={20} />
                <Controls />
                <MiniMap
                  nodeColor={(node) => LEVEL_COLORS[node.data?.level as string] ?? "#94a3b8"}
                  style={{ background: "#f8fafc" }}
                />
              </ReactFlow>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
