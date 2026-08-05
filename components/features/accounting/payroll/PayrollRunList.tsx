import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface PayrollRun {
  id: string;
  period: string;
  employees: number;
  grossPay: number;
  deductions: number;
  netPay: number;
  status: "Draft" | "Processed" | "Approved" | "Paid";
  processedBy: string;
  processedDate: string;
}

interface PayrollRunListProps {
  runs: PayrollRun[];
  onDelete?: (id: string) => void;
}

export function PayrollRunList({ runs, onDelete }: PayrollRunListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Period</TableHead>
          <TableHead>Employees</TableHead>
          <TableHead>Gross Pay</TableHead>
          <TableHead>Deductions</TableHead>
          <TableHead>Net Pay</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Processed</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {runs.map((r) => (
          <TableRow key={r.id}>
            <TableCell>{r.period}</TableCell>
            <TableCell>{r.employees}</TableCell>
            <TableCell>{r.grossPay}</TableCell>
            <TableCell>{r.deductions}</TableCell>
            <TableCell>{r.netPay}</TableCell>
            <TableCell>
              <Badge variant={r.status === "Paid" ? "success" : r.status === "Draft" ? "secondary" : "warning"}>
                {r.status}
              </Badge>
            </TableCell>
            <TableCell>{r.processedDate ? new Date(r.processedDate).toLocaleDateString() : "-"}</TableCell>
            <TableCell className="text-right space-x-2">
              <Button variant="outline" size="sm">View</Button>
              {r.status === "Draft" && onDelete && (
                <Button variant="destructive" size="sm" onClick={() => onDelete(r.id)}>
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
