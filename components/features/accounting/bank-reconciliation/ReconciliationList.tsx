import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Reconciliation {
  id: string;
  account: string;
  statementDate: string;
  bankBalance: number;
  bookBalance: number;
  difference: number;
  status: "Pending" | "In Progress" | "Completed";
}

interface ReconciliationListProps {
  reconciliations: Reconciliation[];
  onDelete?: (id: string) => void;
}

export function ReconciliationList({ reconciliations, onDelete }: ReconciliationListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Account</TableHead>
          <TableHead>Statement Date</TableHead>
          <TableHead>Bank Balance</TableHead>
          <TableHead>Book Balance</TableHead>
          <TableHead>Difference</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reconciliations.map((r) => (
          <TableRow key={r.id}>
            <TableCell>{r.account}</TableCell>
            <TableCell>{new Date(r.statementDate).toLocaleDateString()}</TableCell>
            <TableCell>{r.bankBalance}</TableCell>
            <TableCell>{r.bookBalance}</TableCell>
            <TableCell className={r.difference === 0 ? "text-green-600" : "text-red-600"}>
              {r.difference}
            </TableCell>
            <TableCell>
              <Badge variant={r.status === "Completed" ? "success" : r.status === "In Progress" ? "warning" : "secondary"}>
                {r.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right space-x-2">
              <Button variant="outline" size="sm">View</Button>
              {onDelete && (
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
