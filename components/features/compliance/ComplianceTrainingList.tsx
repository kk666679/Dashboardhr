import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface TrainingRecord {
  id: string;
  employee: string;
  course: string;
  provider: string;
  completedDate: string;
  expiryDate: string | null;
  status: "Completed" | "Incomplete" | "Overdue";
}

interface ComplianceTrainingListProps {
  records: TrainingRecord[];
  onDelete?: (id: string) => void;
}

export function ComplianceTrainingList({ records, onDelete }: ComplianceTrainingListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Employee</TableHead>
          <TableHead>Course</TableHead>
          <TableHead>Provider</TableHead>
          <TableHead>Completed</TableHead>
          <TableHead>Expiry</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {records.map((r) => (
          <TableRow key={r.id}>
            <TableCell>{r.employee}</TableCell>
            <TableCell>{r.course}</TableCell>
            <TableCell>{r.provider}</TableCell>
            <TableCell>{new Date(r.completedDate).toLocaleDateString()}</TableCell>
            <TableCell>{r.expiryDate ? new Date(r.expiryDate).toLocaleDateString() : "N/A"}</TableCell>
            <TableCell>
              <Badge variant={r.status === "Completed" ? "success" : r.status === "Overdue" ? "destructive" : "warning"}>
                {r.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right space-x-2">
              <Button variant="outline" size="sm">View</Button>
              {onDelete && (
                <Button variant="destructive" size="sm" onClick={() => onDelete(r.id)}>Delete</Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
