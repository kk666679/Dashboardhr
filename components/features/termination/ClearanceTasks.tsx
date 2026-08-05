import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface ClearanceTask {
  id: string;
  name: string;
  assignedTo: string;
  dueDate: string;
  status: "Pending" | "In Progress" | "Completed" | "Skipped";
  department: string;
}

interface ClearanceTasksProps {
  tasks: ClearanceTask[];
  onComplete?: (id: string) => void;
  onSkip?: (id: string) => void;
}

export function ClearanceTasks({ tasks, onComplete, onSkip }: ClearanceTasksProps) {
  const completed = tasks.filter(t => t.status === "Completed").length;
  const total = tasks.length;
  const progress = total ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">Progress:</span>
          <div className="flex items-center gap-2">
            <Progress value={progress} className="w-48" />
            <span className="text-sm">{progress}%</span>
          </div>
        </div>
        <span className="text-sm text-muted-foreground">{completed} of {total} tasks</span>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Task</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((t) => (
            <TableRow key={t.id}>
              <TableCell>{t.name}</TableCell>
              <TableCell>{t.assignedTo}</TableCell>
              <TableCell>{t.department}</TableCell>
              <TableCell>{new Date(t.dueDate).toLocaleDateString()}</TableCell>
              <TableCell>
                <Badge variant={t.status === "Completed" ? "success" : t.status === "In Progress" ? "warning" : "secondary"}>
                  {t.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right space-x-2">
                {t.status !== "Completed" && (
                  <>
                    <Button size="sm" onClick={() => onComplete?.(t.id)}>Complete</Button>
                    <Button size="sm" variant="outline" onClick={() => onSkip?.(t.id)}>Skip</Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
