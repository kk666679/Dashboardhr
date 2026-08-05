import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface Payslip {
  id: string;
  employee: string;
  period: string;
  gross: number;
  deductions: number;
  net: number;
  paidDate: string;
}

interface PayslipListProps {
  payslips: Payslip[];
}

export function PayslipList({ payslips }: PayslipListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Employee</TableHead>
          <TableHead>Period</TableHead>
          <TableHead>Gross</TableHead>
          <TableHead>Deductions</TableHead>
          <TableHead>Net</TableHead>
          <TableHead>Paid Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payslips.map((p) => (
          <TableRow key={p.id}>
            <TableCell>{p.employee}</TableCell>
            <TableCell>{p.period}</TableCell>
            <TableCell>{p.gross}</TableCell>
            <TableCell>{p.deductions}</TableCell>
            <TableCell>{p.net}</TableCell>
            <TableCell>{new Date(p.paidDate).toLocaleDateString()}</TableCell>
            <TableCell className="text-right">
              <Button variant="outline" size="sm">View</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
