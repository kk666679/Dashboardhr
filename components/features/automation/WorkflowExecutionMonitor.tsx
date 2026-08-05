"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";

interface Execution {
  id: string;
  workflowName: string;
  status: "running" | "completed" | "failed" | "paused";
  startTime: string;
  endTime?: string;
  progress: number;
  steps: { name: string; status: "pending" | "running" | "completed" | "failed" }[];
}

export function WorkflowExecutionMonitor() {
  const { toast } = useToast();
  const [executions, setExecutions] = useState<Execution[]>([
    {
      id: "1",
      workflowName: "Approval Flow",
      status: "running",
      startTime: new Date().toISOString(),
      progress: 60,
      steps: [
        { name: "Start", status: "completed" },
        { name: "Approval", status: "running" },
        { name: "Notify", status: "pending" },
        { name: "Complete", status: "pending" },
      ],
    },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate progress updates
      setExecutions((prev) =>
        prev.map((e) => {
          if (e.status === "running") {
            const newProgress = Math.min(e.progress + 5, 100);
            if (newProgress === 100) {
              return { ...e, status: "completed", progress: 100 };
            }
            return { ...e, progress: newProgress };
          }
          return e;
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Workflow Execution Monitor</h2>
      <Card>
        <CardHeader>
          <CardTitle>Active Executions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Workflow</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Started</TableHead>
                <TableHead>Steps</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {executions.map((e) => (
                <TableRow key={e.id}>
                  <TableCell>{e.workflowName}</TableCell>
                  <TableCell>
                    <Badge variant={e.status === "running" ? "warning" : e.status === "completed" ? "success" : "destructive"}>
                      {e.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={e.progress} className="w-32" />
                      <span className="text-sm">{e.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(e.startTime).toLocaleTimeString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {e.steps.map((s, i) => (
                        <Badge key={i} variant={s.status === "completed" ? "success" : s.status === "running" ? "warning" : "secondary"}>
                          {s.name}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
