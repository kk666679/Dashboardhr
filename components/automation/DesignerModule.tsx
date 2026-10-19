"use client";

import { MarkerType } from "@xyflow/react";
import {
  WorkflowDesigner,
  type WorkflowNode,
  type WorkflowEdge,
} from "./WorkflowDesigner";

const seedNodes: WorkflowNode[] = [
  {
    id: "trigger",
    type: "trigger",
    position: { x: 0, y: 160 },
    data: {
      label: "Worker intake",
      description: "Create worker profile",
      kind: "trigger",
      owner: "HR Ops",
      slaHours: 2,
    },
  },
  {
    id: "docs",
    type: "documents",
    position: { x: 280, y: 160 },
    data: {
      label: "Documents & KYC",
      description: "Collect passport, photos",
      kind: "documents",
      owner: "HR Ops",
      slaHours: 24,
    },
  },
  {
    id: "permit",
    type: "permit",
    position: { x: 560, y: 160 },
    data: {
      label: "Permit & visa",
      description: "Track application stages",
      kind: "permit",
      owner: "Immigration",
      slaHours: 72,
    },
  },
  {
    id: "review",
    type: "human-review",
    position: { x: 840, y: 160 },
    data: {
      label: "Exception review",
      description: "Route to HR for action",
      kind: "human-review",
      owner: "HR Lead",
      slaHours: 8,
    },
  },
];

const seedEdges: WorkflowEdge[] = [
  { id: "e1", source: "trigger", target: "docs", type: "smoothstep", markerEnd: { type: MarkerType.ArrowClosed } },
  { id: "e2", source: "docs", target: "permit", type: "smoothstep", markerEnd: { type: MarkerType.ArrowClosed } },
  { id: "e3", source: "permit", target: "review", type: "smoothstep", markerEnd: { type: MarkerType.ArrowClosed } },
];

export function DesignerModule() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10">
      <header className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Automation
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
          Workflow designer
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Drag blocks onto the canvas, connect them, then validate before publishing.
        </p>
      </header>
      <WorkflowDesigner initialNodes={seedNodes} initialEdges={seedEdges} />
    </section>
  );
}
