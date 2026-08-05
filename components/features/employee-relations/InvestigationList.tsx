import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Investigation {
  id: string;
  title: string;
  assignedTo: string;
  startDate: string;
  status: "Open" | "In Progress" | "Completed" | "Closed";
  priority: "Low" | "Medium" | "High";
}

interface InvestigationListProps {
  investigations: Investigation[];
  onDelete?: (id: string) => void;
}

export function InvestigationList({ investigations, onDelete }: InvestigationListProps) {
  const router = useRouter();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Assigned To</TableHead>
          <TableHead>Start Date</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {investigations.map((i) => (
          <TableRow key={i.id}>
            <TableCell>{i.title}</TableCell>
            <TableCell>{i.assignedTo}</TableCell>
            <TableCell>{new Date(i.startDate).toLocaleDateString()}</TableCell>
            <TableCell>
              <Badge variant={i.priority === "High" ? "destructive" : i.priority === "Medium" ? "warning" : "secondary"}>
                {i.priority}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant={i.status === "Completed" || i.status === "Closed" ? "success" : i.status === "In Progress" ? "warning" : "secondary"}>
                {i.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right space-x-2">
              <Button variant="outline" size="sm" onClick={() => router.push(`/employee-relations/investigations/${i.id}`)}>
                View
              </Button>
              <Button variant="outline" size="sm" onClick={() => router.push(`/employee-relations/investigations/${i.id}/edit`)}>
                Edit
              </Button>
              {onDelete && (
                <Button variant="destructive" size="sm" onClick={() => onDelete(i.id)}>
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
