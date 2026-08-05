"use client";

import type { Node, NodeProps } from "@xyflow/react";
import type { AutomationNodeData } from "./types";
import { NodeBase } from "./NodeBase";
import { Layers } from "lucide-react";

export function GroupNode({ data, selected }: NodeProps<Node<AutomationNodeData, string | undefined>>) {
  const groupType = data?.groupType || "sequential";
  const collapsed = data?.collapsed || false;

  const typeLabel = {
    parallel: "Parallel",
    sequential: "Sequential",
    conditional: "Conditional",
  };

  return (
    <NodeBase
      icon={<Layers className="h-5 w-5 text-indigo-600" />}
      label={data?.label || "Group"}
      description={data?.description || "Container for sub‑workflow"}
      selected={selected}
      variant="workflow"
      badge={typeLabel[groupType]}
    >
      <div className="space-y-1 text-[11px]">
        <div>🧩 {data?.children?.length || 0} nodes</div>
        {collapsed && <div className="text-muted-foreground">Collapsed</div>}
      </div>
    </NodeBase>
  );
}