import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ZakatRecord {
  id: string;
  employee: string;
  amount: number;
  date: string;
  status: "Paid" | "Pending" | "Verified";
  method: "Cash" | "Bank Transfer" | "Deduction";
}

interface ZakatRecordsProps {
  records: ZakatRecord[];
  onDelete?: (id: string) => void;
  onVerify?: (id: string) => void;
}

export function ZakatRecords({ records, onDelete, onVerify }: ZakatRecordsProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Employee</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Method</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {records.map((r) => (
          <TableRow key={r.id}>
            <TableCell>{r.employee}</TableCell>
            <TableCell>RM {r.amount}</TableCell>
            <TableCell>{new Date(r.date).toLocaleDateString()}</TableCell>
            <TableCell>{r.method}</TableCell>
            <TableCell>
              <Badge variant={r.status === "Paid" ? "success" : r.status === "Pending" ? "warning" : "secondary"}>
                {r.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right space-x-2">
              {r.status === "Pending" && onVerify && (
                <Button size="sm" onClick={() => onVerify(r.id)}>Verify</Button>
              )}
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
