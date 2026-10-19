"use client";

import * as React from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  Panel,
  useReactFlow,
  type Node,
  type Edge,
  type Connection,
  type NodeTypes,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  type IsValidConnection,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  MarkerType,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { create } from "zustand";
import { temporal } from "zundo";

/* ---------- Domain model ---------- */

export type NodeKind =
  | "trigger"
  | "human-review"
  | "automation"
  | "compliance"
  | "payroll"
  | "attendance"
  | "documents"
  | "permit"
  | "audit";

export type WorkflowNodeData = {
  label: string;
  description: string;
  kind: NodeKind;
  owner?: string;
  slaHours?: number;
};

export type WorkflowNode = Node<WorkflowNodeData, NodeKind>;
export type WorkflowEdge = Edge;

/* ---------- Zustand store with temporal (undo/redo) ---------- */

type WorkflowState = {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  selectedNodeId: string | null;
  setSelectedNode: (id: string | null) => void;
  onNodesChange: OnNodesChange<WorkflowNode>;
  onEdgesChange: OnEdgesChange<WorkflowEdge>;
  onConnect: OnConnect;
  addNode: (node: WorkflowNode) => void;
  updateNodeData: (id: string, patch: Partial<WorkflowNodeData>) => void;
  setCanvas: (nodes: WorkflowNode[], edges: WorkflowEdge[]) => void;
};

export const useWorkflowStore = create<WorkflowState>()(
  temporal(
    (set, get) => ({
      nodes: [],
      edges: [],
      selectedNodeId: null,
      setSelectedNode: (id) => set({ selectedNodeId: id }),
      onNodesChange: (changes) =>
        set({ nodes: applyNodeChanges(changes, get().nodes) }),
      onEdgesChange: (changes) =>
        set({ edges: applyEdgeChanges(changes, get().edges) }),
      onConnect: (connection) =>
        set({
          edges: addEdge(
            {
              ...connection,
              id: `e-${connection.source}-${connection.target}-${Date.now()}`,
              type: "smoothstep",
              markerEnd: { type: MarkerType.ArrowClosed },
            },
            get().edges,
          ),
        }),
      addNode: (node) => set({ nodes: [...get().nodes, node] }),
      updateNodeData: (id, patch) =>
        set({
          nodes: get().nodes.map((n) =>
            n.id === id ? { ...n, data: { ...n.data, ...patch } } : n,
          ),
        }),
      setCanvas: (nodes, edges) => set({ nodes, edges }),
    }),
    {
      limit: 50,
      partialize: (state) => ({ nodes: state.nodes, edges: state.edges }),
    },
  ),
);

export function useUndoRedo() {
  const undo = useWorkflowStore.temporal((s) => s.undo);
  const redo = useWorkflowStore.temporal((s) => s.redo);
  const canUndo = useWorkflowStore.temporal((s) => s.pastStates.length > 0);
  const canRedo = useWorkflowStore.temporal((s) => s.futureStates.length > 0);
  return { undo, redo, canUndo, canRedo };
}

/* ---------- Validation ---------- */

export type ValidationIssue = {
  level: "error" | "warning";
  nodeId?: string;
  edgeId?: string;
  message: string;
};

export function validateWorkflow(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  for (const node of nodes) {
    const isTrigger = node.data.kind === "trigger";
    const hasIncoming = edges.some((e) => e.target === node.id);
    const hasOutgoing = edges.some((e) => e.source === node.id);
    if (!isTrigger && !hasIncoming) {
      issues.push({
        level: "error",
        nodeId: node.id,
        message: `"${node.data.label}" has no incoming connection.`,
      });
    }
    if (!hasOutgoing) {
      issues.push({
        level: "warning",
        nodeId: node.id,
        message: `"${node.data.label}" is an orphan (no outgoing connection).`,
      });
    }
  }

  if (!nodes.some((n) => n.data.kind === "trigger")) {
    issues.push({ level: "error", message: "Workflow needs at least one trigger node." });
  }

  for (const edge of edges) {
    if (edge.source === edge.target) {
      issues.push({ level: "error", edgeId: edge.id, message: "Self-loop connections are not allowed." });
    }
  }

  const adjacency = new Map<string, string[]>();
  for (const e of edges) {
    adjacency.set(e.source, [...(adjacency.get(e.source) ?? []), e.target]);
  }
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const hasCycle = (id: string): boolean => {
    if (visiting.has(id)) return true;
    if (visited.has(id)) return false;
    visiting.add(id);
    for (const next of adjacency.get(id) ?? []) {
      if (hasCycle(next)) return true;
    }
    visiting.delete(id);
    visited.add(id);
    return false;
  };
  for (const node of nodes) {
    if (hasCycle(node.id)) {
      issues.push({
        level: "error",
        nodeId: node.id,
        message: "Workflow contains a cycle — this would loop forever.",
      });
      break;
    }
  }

  return issues;
}

/* ---------- Node card ---------- */

const KIND_STYLES: Record<NodeKind, { dot: string; ring: string; tag: string }> = {
  trigger:        { dot: "bg-blue-500",    ring: "ring-blue-200",    tag: "TRIGGER" },
  "human-review": { dot: "bg-amber-500",   ring: "ring-amber-200",   tag: "HUMAN REVIEW" },
  automation:     { dot: "bg-emerald-500", ring: "ring-emerald-200", tag: "AUTOMATION" },
  compliance:     { dot: "bg-violet-500",  ring: "ring-violet-200",  tag: "COMPLIANCE" },
  payroll:        { dot: "bg-emerald-500", ring: "ring-emerald-200", tag: "PAYROLL" },
  attendance:     { dot: "bg-violet-500",  ring: "ring-violet-200",  tag: "ATTENDANCE" },
  documents:      { dot: "bg-emerald-500", ring: "ring-emerald-200", tag: "DOCUMENTS" },
  permit:         { dot: "bg-amber-500",   ring: "ring-amber-200",   tag: "PERMIT" },
  audit:          { dot: "bg-violet-500",  ring: "ring-violet-200",  tag: "AUDIT" },
};

function WorkflowNodeCard({
  data,
  selected,
}: {
  data: WorkflowNodeData;
  selected: boolean;
}) {
  const s = KIND_STYLES[data.kind];
  return (
    <div
      className={[
        "w-[200px] rounded-xl border bg-white px-3.5 py-3 shadow-sm transition",
        selected ? `ring-2 ${s.ring} border-transparent` : "border-slate-200",
      ].join(" ")}
    >
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${s.dot}`} aria-hidden />
        <span className="text-[10px] font-semibold tracking-wide text-slate-500">
          {s.tag}
        </span>
      </div>
      <div className="mt-1.5 text-sm font-semibold leading-tight text-slate-800">
        {data.label}
      </div>
      <div className="mt-0.5 text-[11px] leading-snug text-slate-500">
        {data.description}
      </div>
      {data.slaHours != null && (
        <div className="mt-2 inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
          SLA {data.slaHours}h
        </div>
      )}
    </div>
  );
}

/* ---------- Palette ---------- */

const PALETTE: { kind: NodeKind; label: string; description: string }[] = [
  { kind: "trigger",        label: "Trigger",           description: "Start the workflow" },
  { kind: "human-review",   label: "Human review",      description: "Approve or reject" },
  { kind: "automation",     label: "Automation",        description: "Run rules & tasks" },
  { kind: "documents",      label: "Documents & KYC",   description: "Collect and verify" },
  { kind: "permit",         label: "Permit & visa",     description: "Track immigration" },
  { kind: "attendance",     label: "Attendance",        description: "GPS check-in" },
  { kind: "payroll",        label: "Payroll",           description: "Wages & payslips" },
  { kind: "compliance",     label: "Compliance",        description: "ISO / QMS checks" },
  { kind: "audit",          label: "Audit & reporting", description: "Evidence trail" },
];

function NodePalette({ onAdd }: { onAdd: (kind: NodeKind) => void }) {
  return (
    <aside
      aria-label="Node palette"
      className="flex w-56 shrink-0 flex-col gap-1.5 overflow-y-auto border-r border-slate-200 bg-white p-3"
    >
      <p className="px-1 pb-1 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
        Blocks
      </p>
      {PALETTE.map((item) => (
        <button
          key={item.kind}
          type="button"
          onClick={() => onAdd(item.kind)}
          className="group rounded-lg border border-transparent px-2.5 py-2 text-left hover:border-slate-200 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <span className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <span className={`h-1.5 w-1.5 rounded-full ${KIND_STYLES[item.kind].dot}`} />
            {item.label}
          </span>
          <span className="mt-0.5 block text-[10px] text-slate-400">
            {item.description}
          </span>
        </button>
      ))}
    </aside>
  );
}

/* ---------- Inspector ---------- */

function Inspector() {
  const node = useWorkflowStore((s) =>
    s.nodes.find((n) => n.id === s.selectedNodeId),
  );
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);

  if (!node) {
    return (
      <aside
        aria-label="Inspector"
        className="flex w-72 shrink-0 items-center justify-center border-l border-slate-200 bg-white p-6 text-center text-xs text-slate-400"
      >
        Select a node to edit its properties.
      </aside>
    );
  }

  return (
    <aside
      aria-label="Inspector"
      className="flex w-72 shrink-0 flex-col gap-4 overflow-y-auto border-l border-slate-200 bg-white p-4"
    >
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
          Node
        </p>
        <p className="mt-1 text-sm font-semibold text-slate-800">
          {node.data.label}
        </p>
      </div>

      <label className="block text-xs font-medium text-slate-600">
        Label
        <input
          className="mt-1 w-full rounded-md border border-slate-200 px-2.5 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={node.data.label}
          onChange={(e) => updateNodeData(node.id, { label: e.target.value })}
        />
      </label>

      <label className="block text-xs font-medium text-slate-600">
        Description
        <textarea
          rows={2}
          className="mt-1 w-full resize-none rounded-md border border-slate-200 px-2.5 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={node.data.description}
          onChange={(e) =>
            updateNodeData(node.id, { description: e.target.value })
          }
        />
      </label>

      <label className="block text-xs font-medium text-slate-600">
        Owner
        <input
          className="mt-1 w-full rounded-md border border-slate-200 px-2.5 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="e.g. HR Ops"
          value={node.data.owner ?? ""}
          onChange={(e) => updateNodeData(node.id, { owner: e.target.value })}
        />
      </label>

      <label className="block text-xs font-medium text-slate-600">
        SLA (hours)
        <input
          type="number"
          min={0}
          className="mt-1 w-full rounded-md border border-slate-200 px-2.5 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={node.data.slaHours ?? ""}
          onChange={(e) =>
            updateNodeData(node.id, {
              slaHours: e.target.value === "" ? undefined : Number(e.target.value),
            })
          }
        />
      </label>
    </aside>
  );
}

/* ---------- Node type map ---------- */

const nodeTypes: NodeTypes = {
  trigger: WorkflowNodeCard,
  "human-review": WorkflowNodeCard,
  automation: WorkflowNodeCard,
  compliance: WorkflowNodeCard,
  payroll: WorkflowNodeCard,
  attendance: WorkflowNodeCard,
  documents: WorkflowNodeCard,
  permit: WorkflowNodeCard,
  audit: WorkflowNodeCard,
};

/* ---------- Inner designer (uses useReactFlow) ---------- */

type DesignerProps = {
  initialNodes?: WorkflowNode[];
  initialEdges?: WorkflowEdge[];
};

function DesignerInner({ initialNodes = [], initialEdges = [] }: DesignerProps) {
  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);
  const onNodesChange = useWorkflowStore((s) => s.onNodesChange);
  const onEdgesChange = useWorkflowStore((s) => s.onEdgesChange);
  const onConnect = useWorkflowStore((s) => s.onConnect);
  const addNode = useWorkflowStore((s) => s.addNode);
  const setSelectedNode = useWorkflowStore((s) => s.setSelectedNode);
  const setCanvas = useWorkflowStore((s) => s.setCanvas);
  const { undo, redo, canUndo, canRedo } = useUndoRedo();
  const { fitView, screenToFlowPosition } = useReactFlow();
  const [issues, setIssues] = React.useState<ValidationIssue[]>([]);

  React.useEffect(() => {
    if (nodes.length === 0 && initialNodes.length > 0) {
      setCanvas(initialNodes, initialEdges);
      useWorkflowStore.temporal.getState().clear();
      requestAnimationFrame(() => fitView({ padding: 0.2 }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAdd = React.useCallback(
    (kind: NodeKind) => {
      const meta = PALETTE.find((p) => p.kind === kind);
      const position = screenToFlowPosition({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      });
      addNode({
        id: `${kind}-${Date.now()}`,
        type: kind,
        position,
        data: {
          label: meta?.label ?? "New node",
          description: meta?.description ?? "",
          kind,
        },
      });
    },
    [addNode, screenToFlowPosition],
  );

  const isValidConnection = React.useCallback<IsValidConnection>(
    (connection) => {
      if (connection.source === connection.target) return false;
      return !edges.some(
        (e) =>
          e.source === connection.source &&
          e.target === connection.target &&
          e.sourceHandle === connection.sourceHandle &&
          e.targetHandle === connection.targetHandle,
      );
    },
    [edges],
  );

  return (
    <div className="flex h-[720px] w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
      <NodePalette onAdd={handleAdd} />

      <div className="relative flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={(_, node) => setSelectedNode(node.id)}
          onPaneClick={() => setSelectedNode(null)}
          onNodeDragStart={() => useWorkflowStore.temporal.getState().pause()}
          onNodeDragStop={() => useWorkflowStore.temporal.getState().resume()}
          isValidConnection={isValidConnection}
          fitView
          minZoom={0.2}
          maxZoom={1.5}
          snapToGrid
          snapGrid={[16, 16]}
          nodesFocusable
          edgesFocusable
          disableKeyboardA11y={false}
          proOptions={{ hideAttribution: true }}
        >
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
          <Controls position="bottom-left" showInteractive={false} />
          <MiniMap position="bottom-right" pannable zoomable className="!bg-white" />

          <Panel position="top-left" className="!m-3 flex gap-1.5">
            <button
              type="button"
              onClick={undo}
              disabled={!canUndo}
              className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 disabled:opacity-40"
            >
              Undo
            </button>
            <button
              type="button"
              onClick={redo}
              disabled={!canRedo}
              className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 disabled:opacity-40"
            >
              Redo
            </button>
            <button
              type="button"
              onClick={() => setIssues(validateWorkflow(nodes, edges))}
              className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600"
            >
              Validate
            </button>
            <button
              type="button"
              onClick={() => fitView({ padding: 0.2 })}
              className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600"
            >
              Fit view
            </button>
          </Panel>

          {issues.length > 0 && (
            <Panel position="top-right" className="!m-3 w-64">
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-2.5 text-[11px] text-amber-800">
                <p className="mb-1 font-semibold">
                  {issues.filter((i) => i.level === "error").length} errors,{" "}
                  {issues.filter((i) => i.level === "warning").length} warnings
                </p>
                <ul className="list-inside list-disc space-y-0.5">
                  {issues.slice(0, 3).map((issue, i) => (
                    <li key={i}>{issue.message}</li>
                  ))}
                </ul>
              </div>
            </Panel>
          )}
        </ReactFlow>
      </div>

      <Inspector />
    </div>
  );
}

export function WorkflowDesigner(props: DesignerProps) {
  return (
    <ReactFlowProvider>
      <DesignerInner {...props} />
    </ReactFlowProvider>
  );
}
