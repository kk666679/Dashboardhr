import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface MedicalCheckup {
  id: string;
  worker: string;
  checkupDate: string;
  nextDue: string;
  status: "Cleared" | "Pending" | "Due" | "Failed";
  facility: string;
}

interface MedicalCheckupListProps {
  records: MedicalCheckup[];
  onDelete?: (id: string) => void;
}

export function MedicalCheckupList({ records, onDelete }: MedicalCheckupListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Worker</TableHead>
          <TableHead>Checkup Date</TableHead>
          <TableHead>Next Due</TableHead>
          <TableHead>Facility</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {records.map((r) => (
          <TableRow key={r.id}>
            <TableCell>{r.worker}</TableCell>
            <TableCell>{new Date(r.checkupDate).toLocaleDateString()}</TableCell>
            <TableCell>{new Date(r.nextDue).toLocaleDateString()}</TableCell>
            <TableCell>{r.facility}</TableCell>
            <TableCell>
              <Badge variant={r.status === "Cleared" ? "success" : r.status === "Failed" ? "destructive" : "warning"}>
                {r.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right space-x-2">
              <Button variant="outline" size="sm">View</Button>
              {onDelete && (
                <Button variant="destructive" size="sm" onClick={() => onDelete(r.id)}>Delete</Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
