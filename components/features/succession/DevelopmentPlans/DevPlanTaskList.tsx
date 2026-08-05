import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface DevPlanTask {
  description: string;
  dueDate?: string;
  assignedTo?: string;
  progress?: number;
  completed?: boolean;
}

interface DevPlanTaskListProps {
  tasks: DevPlanTask[];
}

export function DevPlanTaskList({ tasks }: DevPlanTaskListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Description</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead>Assigned To</TableHead>
          <TableHead>Progress</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.map((t, i) => (
          <TableRow key={i}>
            <TableCell>{t.description}</TableCell>
            <TableCell>{t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "-"}</TableCell>
            <TableCell>{t.assignedTo || "-"}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Progress value={t.progress || 0} className="w-20" />
                <span className="text-sm">{t.progress || 0}%</span>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant={t.completed ? "success" : "secondary"}>
                {t.completed ? "Done" : "Pending"}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
