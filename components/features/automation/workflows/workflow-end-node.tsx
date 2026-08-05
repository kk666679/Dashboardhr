"use client";

import { NodeProps } from "@xyflow/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type WFData = Record<string, unknown>;

export function WorkflowEndNode({ data: rawData }: NodeProps) {
  const data = rawData as WFData;
  return (
    <Card className="min-w-[140px] border-2 border-red-500/50 bg-red-50 dark:bg-red-950/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-red-700 dark:text-red-300">
          🏁 {String(data?.label ?? "End")}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-xs text-red-600 dark:text-red-400">
        {String(data?.result ?? "Workflow complete")}
      </CardContent>
    </Card>
  );
}
