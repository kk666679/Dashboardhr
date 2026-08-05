import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface IRCase {
  id: string;
  title: string;
  type: "Grievance" | "Discipline" | "Dispute" | "Compliance" | "Others";
  status: "Open" | "Pending" | "Resolved" | "Closed";
  priority: "Low" | "Medium" | "High" | "Critical";
  filedDate: string;
  employee: string;
}

interface CaseListProps {
  cases: IRCase[];
  onDelete?: (id: string) => void;
}

export function CaseList({ cases, onDelete }: CaseListProps) {
  const router = useRouter();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Filed</TableHead>
          <TableHead>Employee</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {cases.map((c) => (
          <TableRow key={c.id}>
            <TableCell>{c.title}</TableCell>
            <TableCell>
              <Badge variant="secondary">{c.type}</Badge>
            </TableCell>
            <TableCell>
              <Badge variant={c.priority === "Critical" ? "destructive" : c.priority === "High" ? "warning" : "secondary"}>
                {c.priority}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant={c.status === "Resolved" || c.status === "Closed" ? "success" : c.status === "Pending" ? "warning" : "secondary"}>
                {c.status}
              </Badge>
            </TableCell>
            <TableCell>{new Date(c.filedDate).toLocaleDateString()}</TableCell>
            <TableCell>{c.employee}</TableCell>
            <TableCell className="text-right space-x-2">
              <Button variant="outline" size="sm" onClick={() => router.push(`/industrial-relations/cases/${c.id}`)}>
                View
              </Button>
              <Button variant="outline" size="sm" onClick={() => router.push(`/industrial-relations/cases/${c.id}/edit`)}>
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
