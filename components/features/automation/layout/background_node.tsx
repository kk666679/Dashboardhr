"use client";

import type { Node, NodeProps } from "@xyflow/react";
import type { AutomationNodeData } from "../node/types";
import { cn } from "@/lib/utils";

export function BackgroundNode({ data, selected }: NodeProps<Node<AutomationNodeData, string | undefined>>) {
  return (
    <div
      className={cn(
        "p-4 min-w-[150px] min-h-[60px] rounded-lg border-2 border-dashed border-muted-foreground/20 bg-muted/5",
        selected && "border-primary/50 bg-primary/5"
      )}
    >
      <div className="text-center text-sm text-muted-foreground">
        {data?.label || "Background"}
        {data?.description && (
          <div className="text-xs text-muted-foreground/60 mt-1">
            {data.description}
          </div>
        )}
      </div>
    </div>
  );
}
