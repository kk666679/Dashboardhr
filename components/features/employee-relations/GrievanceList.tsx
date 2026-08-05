import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Grievance {
  id: string;
  employee: string;
  type: string;
  date: string;
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  priority: "Low" | "Medium" | "High" | "Critical";
}

interface GrievanceListProps {
  grievances: Grievance[];
  onDelete?: (id: string) => void;
}

export function GrievanceList({ grievances, onDelete }: GrievanceListProps) {
  const router = useRouter();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Employee</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {grievances.map((g) => (
          <TableRow key={g.id}>
            <TableCell>{g.employee}</TableCell>
            <TableCell>{g.type}</TableCell>
            <TableCell>{new Date(g.date).toLocaleDateString()}</TableCell>
            <TableCell>
              <Badge variant={g.priority === "Critical" ? "destructive" : g.priority === "High" ? "warning" : "secondary"}>
                {g.priority}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant={g.status === "Resolved" || g.status === "Closed" ? "success" : g.status === "In Progress" ? "warning" : "secondary"}>
                {g.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right space-x-2">
              <Button variant="outline" size="sm" onClick={() => router.push(`/employee-relations/grievances/${g.id}`)}>
                View
              </Button>
              <Button variant="outline" size="sm" onClick={() => router.push(`/employee-relations/grievances/${g.id}/edit`)}>
                Edit
              </Button>
              {onDelete && (
                <Button variant="destructive" size="sm" onClick={() => onDelete(g.id)}>
                  Delete
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
