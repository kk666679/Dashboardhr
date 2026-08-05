import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface IRCase {
  id: string;
  title: string;
  type: "Grievance" | "Dispute" | "Union" | "Other";
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  priority: "Low" | "Medium" | "High";
  filedDate: string;
  employee: string;
}

interface IndustrialRelationsListProps {
  cases: IRCase[];
  onDelete?: (id: string) => void;
}

export function IndustrialRelationsList({ cases, onDelete }: IndustrialRelationsListProps) {
  const router = useRouter();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Employee</TableHead>
          <TableHead>Filed</TableHead>
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
              <Badge variant={c.status === "Resolved" || c.status === "Closed" ? "success" : c.status === "In Progress" ? "warning" : "secondary"}>
                {c.status}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant={c.priority === "High" ? "destructive" : c.priority === "Medium" ? "warning" : "secondary"}>
                {c.priority}
              </Badge>
            </TableCell>
            <TableCell>{c.employee}</TableCell>
            <TableCell>{new Date(c.filedDate).toLocaleDateString()}</TableCell>
            <TableCell className="text-right space-x-2">
              <Button variant="outline" size="sm" onClick={() => router.push(`/industrial-relations/${c.id}`)}>
                View
              </Button>
              <Button variant="outline" size="sm" onClick={() => router.push(`/industrial-relations/${c.id}/edit`)}>
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
