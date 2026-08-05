import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Eligibility {
  id: string;
  employee: string;
  income: number;
  savings: number;
  eligible: boolean;
  calculatedAmount: number;
}

interface ZakatEligibilityProps {
  employees: Eligibility[];
  onRecalculate?: (id: string) => void;
}

export function ZakatEligibility({ employees, onRecalculate }: ZakatEligibilityProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Employee</TableHead>
          <TableHead>Annual Income</TableHead>
          <TableHead>Savings</TableHead>
          <TableHead>Zakat Amount</TableHead>
          <TableHead>Eligible</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {employees.map((e) => (
          <TableRow key={e.id}>
            <TableCell>{e.employee}</TableCell>
            <TableCell>RM {e.income}</TableCell>
            <TableCell>RM {e.savings}</TableCell>
            <TableCell>RM {e.calculatedAmount}</TableCell>
            <TableCell>
              <Badge variant={e.eligible ? "success" : "secondary"}>
                {e.eligible ? "Eligible" : "Not Eligible"}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <Button variant="outline" size="sm" onClick={() => onRecalculate?.(e.id)}>
                Recalculate
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
