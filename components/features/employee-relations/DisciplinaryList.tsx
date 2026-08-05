import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Disciplinary {
  id: string;
  employee: string;
  type: string;
  date: string;
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  severity: "Minor" | "Major" | "Serious";
}

interface DisciplinaryListProps {
  cases: Disciplinary[];
  onDelete?: (id: string) => void;
}

export function DisciplinaryList({ cases, onDelete }: DisciplinaryListProps) {
  const router = useRouter();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Employee</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Severity</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {cases.map((c) => (
          <TableRow key={c.id}>
            <TableCell>{c.employee}</TableCell>
            <TableCell>{c.type}</TableCell>
            <TableCell>{new Date(c.date).toLocaleDateString()}</TableCell>
            <TableCell>
              <Badge variant={c.severity === "Serious" ? "destructive" : c.severity === "Major" ? "warning" : "secondary"}>
                {c.severity}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant={c.status === "Resolved" || c.status === "Closed" ? "success" : c.status === "In Progress" ? "warning" : "secondary"}>
                {c.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right space-x-2">
              <Button variant="outline" size="sm" onClick={() => router.push(`/employee-relations/disciplinary/${c.id}`)}>
                View
              </Button>
              <Button variant="outline" size="sm" onClick={() => router.push(`/employee-relations/disciplinary/${c.id}/edit`)}>
                Edit
              </Button>
              {onDelete && (
                <Button variant="destructive" size="sm" onClick={() => onDelete(c.id)}>
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
