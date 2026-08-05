import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Enrollment {
  id: string;
  employee: string;
  course: string;
  enrolledDate: string;
  status: "In Progress" | "Completed" | "Dropped";
  progress: number;
}

interface EnrollmentListProps {
  enrollments: Enrollment[];
  onDrop?: (id: string) => void;
}

export function EnrollmentList({ enrollments, onDrop }: EnrollmentListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Employee</TableHead>
          <TableHead>Course</TableHead>
          <TableHead>Enrolled</TableHead>
          <TableHead>Progress</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {enrollments.map((e) => (
          <TableRow key={e.id}>
            <TableCell>{e.employee}</TableCell>
            <TableCell>{e.course}</TableCell>
            <TableCell>{new Date(e.enrolledDate).toLocaleDateString()}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <span className="text-sm">{e.progress}%</span>
                <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${e.progress}%` }} />
                </div>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant={e.status === "Completed" ? "success" : e.status === "In Progress" ? "warning" : "destructive"}>
                {e.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              {e.status === "In Progress" && onDrop && (
                <Button variant="destructive" size="sm" onClick={() => onDrop(e.id)}>
                  Drop
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
