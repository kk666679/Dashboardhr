"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
interface ClearanceTaskData {
  id: string;
  tenantId: string;
  instanceId: string;
  itemId: string;
  assignedToId: string | null;
  status: string;
  remarks: string | null;
  completedAt: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

interface ClearanceInstanceData {
  id: string;
  tenantId: string;
  terminationId: string;
  checklistId: string;
  completed: boolean;
  completedAt: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  status?: string;
  tasks: ClearanceTaskData[];
}

interface ClearanceChecklistProps {
  instance: ClearanceInstanceData;
}

export function ClearanceChecklist({ instance }: ClearanceChecklistProps) {
  const total = instance.tasks.length;
  const completed = instance.tasks.filter((t) => t.status === "COMPLETED").length;
  const progress = total ? (completed / total) * 100 : 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Clearance Progress</CardTitle>
        <Badge variant={(instance as any).status === "COMPLETED" ? "success" as "default" : "warning" as "default"}>
          {(instance as any).status || (instance.completed ? "COMPLETED" : "IN_PROGRESS")}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{completed} of {total} tasks</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}
