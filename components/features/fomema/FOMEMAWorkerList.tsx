import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Worker {
  id: string;
  name: string;
  passport: string;
  status: "Active" | "Suspended" | "Inactive";
  lastExam: string;
  nextExam: string;
  healthStatus: "Fit" | "Unfit" | "Under Treatment";
}

interface FOMEMAWorkerListProps {
  workers: Worker[];
}

export function FOMEMAWorkerList({ workers }: FOMEMAWorkerListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Passport</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Last Exam</TableHead>
          <TableHead>Next Exam</TableHead>
          <TableHead>Health</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {workers.map((w) => (
          <TableRow key={w.id}>
            <TableCell>{w.name}</TableCell>
            <TableCell>{w.passport}</TableCell>
            <TableCell>
              <Badge variant={w.status === "Active" ? "success" : w.status === "Suspended" ? "warning" : "secondary"}>
                {w.status}
              </Badge>
            </TableCell>
            <TableCell>{w.lastExam ? new Date(w.lastExam).toLocaleDateString() : "-"}</TableCell>
            <TableCell>{w.nextExam ? new Date(w.nextExam).toLocaleDateString() : "-"}</TableCell>
            <TableCell>
              <Badge variant={w.healthStatus === "Fit" ? "success" : w.healthStatus === "Unfit" ? "destructive" : "warning"}>
                {w.healthStatus}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <Button variant="outline" size="sm">View</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
