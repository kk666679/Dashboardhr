"use client";

import { NodeProps } from "@xyflow/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type WFData = Record<string, unknown>;

export function WorkflowDecisionNode({ data: rawData }: NodeProps) {
  const data = rawData as WFData;
  return (
    <Card className="min-w-[160px] border-2 border-yellow-500/50 bg-yellow-50 dark:bg-yellow-950/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-yellow-700 dark:text-yellow-300 flex items-center gap-2">
          🔀 {String(data?.label ?? "Decision")}
          <Badge variant="secondary">{String(data?.condition ?? "if")}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-xs space-y-1">
        <p className="text-muted-foreground">{String(data?.description ?? "Branch condition")}</p>
        {data?.yes ? <p className="text-green-600">Yes → {String(data.yes)}</p> : null}
        {data?.no ? <p className="text-red-600">No → {String(data.no)}</p> : null}
      </CardContent>
    </Card>
  );
}
