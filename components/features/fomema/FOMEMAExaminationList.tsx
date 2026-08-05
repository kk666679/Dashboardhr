import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Examination {
  id: string;
  workerName: string;
  workerId: string;
  date: string;
  location: string;
  status: "Scheduled" | "Completed" | "Pending" | "Failed" | "Cancelled";
  result?: string;
}

interface FOMEMAExaminationListProps {
  exams: Examination[];
  onDelete?: (id: string) => void;
}

export function FOMEMAExaminationList({ exams, onDelete }: FOMEMAExaminationListProps) {
  const router = useRouter();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Worker</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Result</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {exams.map((e) => (
          <TableRow key={e.id}>
            <TableCell>{e.workerName}</TableCell>
            <TableCell>{new Date(e.date).toLocaleDateString()}</TableCell>
            <TableCell>{e.location}</TableCell>
            <TableCell>
              <Badge variant={e.status === "Completed" ? "success" : e.status === "Scheduled" ? "warning" : e.status === "Failed" ? "destructive" : "secondary"}>
                {e.status}
              </Badge>
            </TableCell>
            <TableCell>{e.result || "-"}</TableCell>
            <TableCell className="text-right space-x-2">
              <Button variant="outline" size="sm" onClick={() => router.push(`/fomema/exams/${e.id}`)}>
                View
              </Button>
              <Button variant="outline" size="sm" onClick={() => router.push(`/fomema/exams/${e.id}/edit`)}>
                Edit
              </Button>
              {onDelete && (
                <Button variant="destructive" size="sm" onClick={() => onDelete(e.id)}>
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
