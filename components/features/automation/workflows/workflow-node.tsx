"use client";

import { NodeProps } from "@xyflow/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type WFData = Record<string, unknown>;

export function WorkflowNode({ data: rawData }: NodeProps) {
  const data = rawData as WFData;
  const status = data?.status as string | undefined;
  const dueDate = data?.dueDate as string | undefined;

  return (
    <Card className="min-w-[180px] border-2 border-slate-200 dark:border-slate-800 hover:border-primary transition-colors">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex justify-between items-center">
          {String(data?.label ?? "Workflow")}
          {status && (
            <Badge variant={status === "running" ? "default" : status === "failed" ? "destructive" : "secondary"}>
              {status}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-xs space-y-1">
        <p className="text-muted-foreground">{String(data?.description ?? "Workflow step")}</p>
        {data?.assignee ? (
          <p className="text-muted-foreground">Assigned: {String(data.assignee)}</p>
        ) : null}
        {dueDate && (
          <p className="text-muted-foreground">Due: {new Date(dueDate).toLocaleDateString()}</p>
        )}
      </CardContent>
    </Card>
  );
}
