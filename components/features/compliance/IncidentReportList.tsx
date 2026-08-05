import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Incident {
  id: string;
  title: string;
  type: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  status: "Open" | "Investigation" | "Resolved" | "Closed";
  reportedDate: string;
  assignedTo: string;
}

interface IncidentReportListProps {
  incidents: Incident[];
  onDelete?: (id: string) => void;
}

export function IncidentReportList({ incidents, onDelete }: IncidentReportListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Severity</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Reported</TableHead>
          <TableHead>Assigned To</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {incidents.map((i) => (
          <TableRow key={i.id}>
            <TableCell>{i.title}</TableCell>
            <TableCell>{i.type}</TableCell>
            <TableCell>
              <Badge variant={i.severity === "Critical" ? "destructive" : i.severity === "High" ? "warning" : "secondary"}>
                {i.severity}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant={i.status === "Resolved" || i.status === "Closed" ? "success" : i.status === "Open" ? "secondary" : "warning"}>
                {i.status}
              </Badge>
            </TableCell>
            <TableCell>{new Date(i.reportedDate).toLocaleDateString()}</TableCell>
            <TableCell>{i.assignedTo}</TableCell>
            <TableCell className="text-right space-x-2">
              <Button variant="outline" size="sm">View</Button>
              <Button variant="outline" size="sm">Edit</Button>
              {onDelete && (
                <Button variant="destructive" size="sm" onClick={() => onDelete(i.id)}>Delete</Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
