"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { useToast } from "@/components/ui/use-toast";

interface ClearanceTaskData {
  id: string;
  tenantId: string;
  instanceId: string;
  itemId: string;
  assignedToId: string | null;
  assignedTo?: { name: string } | null;
  status: string;
  remarks: string | null;
  completedAt: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

interface ClearanceTaskListProps {
  tasks: ClearanceTaskData[] | undefined;
  instanceId: string;
  onTaskCompleted?: () => void;
}

export function ClearanceTaskList({ tasks, instanceId, onTaskCompleted }: ClearanceTaskListProps) {
  const { toast } = useToast();
  const utils = trpc.useUtils();
const { mutate: updateTask, isPending } = trpc.clearance.updateTask.useMutation({
    onSuccess: () => {
      toast({ title: "Task completed" });
      utils.clearance.getByTermination.invalidate({ terminationId: instanceId });
      onTaskCompleted?.();
    },
    onError: (err: { message: string }) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  if (!tasks || tasks.length === 0) {
    return <p className="text-center text-muted-foreground py-4">No tasks available.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Task</TableHead>
          <TableHead>Assigned To</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-24">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.map((task) => (
          <TableRow key={task.id}>
            <TableCell>{task.itemId}</TableCell>
            <TableCell>{task.assignedTo?.name ?? task.assignedToId ?? "-"}</TableCell>
            <TableCell>
              <Badge variant={task.status === "COMPLETED" ? "success" as "default" : "secondary"}>
                {task.status}
              </Badge>
            </TableCell>
            <TableCell>
              {task.status !== "COMPLETED" && (
<Button
                  size="sm"
                  onClick={() => updateTask({ taskId: task.id, status: "COMPLETED" })}
                  disabled={isPending}
                >
                  Complete
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

