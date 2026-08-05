import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface MeritIncrease {
  id: string;
  employeeId: string;
  currentSalary: number;
  proposedSalary: number;
  increasePercent?: number | null;
  effectiveDate?: string | Date;
  approved?: boolean;
  status?: string;
  [key: string]: unknown;
}

interface MeritListProps {
  merits: MeritIncrease[];
  onApprove?: (id: string) => void;
}

export function MeritList({ merits, onApprove }: MeritListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Employee</TableHead>
          <TableHead>Current Salary</TableHead>
          <TableHead>Proposed Salary</TableHead>
          <TableHead>Increase %</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {merits.map((m) => (
          <TableRow key={m.id}>
            <TableCell>{m.employeeId}</TableCell>
            <TableCell>${m.currentSalary}</TableCell>
            <TableCell>${m.proposedSalary}</TableCell>
            <TableCell>{m.increasePercent ?? "-"}%</TableCell>
            <TableCell>
              <Badge variant={m.status === "APPROVED" || m.approved ? "default" : "secondary"}>
                {m.status ?? (m.approved ? "Approved" : "Pending")}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              {!m.approved && onApprove && (
                <Button size="sm" onClick={() => onApprove(m.id)}>
                  Approve
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
