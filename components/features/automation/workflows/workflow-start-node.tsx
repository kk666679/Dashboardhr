"use client";

import { NodeProps } from "@xyflow/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type WFData = Record<string, unknown>;

export function WorkflowStartNode({ data: rawData }: NodeProps) {
  const data = rawData as WFData;
  return (
    <Card className="min-w-[140px] border-2 border-green-500/50 bg-green-50 dark:bg-green-950/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-green-700 dark:text-green-300">
          🚀 {String(data?.label ?? "Start")}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-xs text-green-600 dark:text-green-400">
        {String(data?.trigger ?? "Begin workflow")}
      </CardContent>
    </Card>
  );
}
