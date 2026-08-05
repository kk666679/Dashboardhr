"use client";

import type { Node, NodeProps } from "@xyflow/react";
import type { AutomationNodeData } from "../node/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function CanvasNode({ data, selected }: NodeProps<Node<AutomationNodeData, string | undefined>>) {
  return (
    <Card
      className={cn(
        "min-w-[180px] shadow-md hover:shadow-lg transition-all",
        selected && "ring-2 ring-primary ring-offset-2"
      )}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">{data?.label || "Node"}</CardTitle>
      </CardHeader>
      <CardContent className="text-xs text-muted-foreground">
        {data?.description || "Drag to connect"}
      </CardContent>
    </Card>
  );
}
