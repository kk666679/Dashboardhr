import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Complaint {
  id: string;
  employee: string;
  category: string;
  date: string;
  status: "New" | "Under Review" | "Resolved" | "Dismissed";
  isAnonymous: boolean;
}

interface ComplaintListProps {
  complaints: Complaint[];
  onDelete?: (id: string) => void;
}

export function ComplaintList({ complaints, onDelete }: ComplaintListProps) {
  const router = useRouter();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Employee</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Anonymous</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {complaints.map((c) => (
          <TableRow key={c.id}>
            <TableCell>{c.isAnonymous ? "Anonymous" : c.employee}</TableCell>
            <TableCell>{c.category}</TableCell>
            <TableCell>{new Date(c.date).toLocaleDateString()}</TableCell>
            <TableCell>
              <Badge variant={c.isAnonymous ? "outline" : "secondary"}>
                {c.isAnonymous ? "Yes" : "No"}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant={c.status === "Resolved" ? "success" : c.status === "Under Review" ? "warning" : "secondary"}>
                {c.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right space-x-2">
              <Button variant="outline" size="sm" onClick={() => router.push(`/employee-relations/complaints/${c.id}`)}>
                View
              </Button>
              <Button variant="outline" size="sm" onClick={() => router.push(`/employee-relations/complaints/${c.id}/edit`)}>
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
