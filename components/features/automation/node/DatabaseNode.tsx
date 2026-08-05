"use client";

import { NodeProps } from "@xyflow/react";
import type { AutomationNode } from "./types";
import { NodeBase } from "./NodeBase";
import { Database } from "lucide-react";

export function DatabaseNode({ data, selected }: NodeProps<AutomationNode>) {
  return (
    <NodeBase
      icon={<Database className="h-5 w-5 text-sky-600" />}
      label={data?.label || "Database"}
      description={data?.description || "Query a database"}
      status={data?.status}
      selected={selected}
      variant="integration"
    >
      {data?.connection && <div>Connection: {data.connection}</div>}
      {data?.query && <div className="truncate">Query: {data.query}</div>}
    </NodeBase>
  );
}
