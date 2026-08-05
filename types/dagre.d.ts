// Minimal ambient declaration for `dagre` (BSD-licensed graph layout library).
// The package ships plain JS without bundled types. This declaration covers
// the subset of the API used by the automation layout engine.

declare module "dagre" {
  export interface GraphLabel {
    rankdir?: "LR" | "TB" | "RL" | "BT" | string;
    nodesep?: number;
    edgesep?: number;
    ranksep?: number;
    marginx?: number;
    marginy?: number;
    acyclicer?: string;
    ranker?: string;
    [key: string]: unknown;
  }

  export interface NodeLabel {
    width?: number;
    height?: number;
    x?: number;
    y?: number;
    [key: string]: unknown;
  }

  export class Graph {
    setGraph(label: GraphLabel): this;
    setDefaultEdgeLabel(callback: () => unknown): this;
    setNode(name: string, label?: NodeLabel): this;
    setNodes(names: string[], label?: NodeLabel): this;
    setEdge(source: string, target: string, label?: unknown): this;
    node(name: string): NodeLabel;
    nodes(): string[];
    edge(source: string, target: string): Record<string, unknown> | undefined;
    edges(): Array<{ v: string; w: string; [key: string]: unknown }>;
    setParent(name: string, parent: string): this;
    children(name?: string): string[];
    predecessors(name: string): string[];
    successors(name: string): string[];
    neighbors(name: string): string[];
    hasNode(name: string): boolean;
    nodeCount(): number;
    edgeCount(): number;
    sources(): string[];
    sinks(): string[];
    on(event: string, callback: (...args: unknown[]) => void): this;
    removeNode(name: string): this;
  }

  export interface graphlib {
    Graph: typeof Graph;
  }

  export function layout(graph: Graph, options?: Record<string, unknown>): void;

  const dagre: {
    graphlib: graphlib;
    layout: typeof layout;
  };

  export default dagre;
}

