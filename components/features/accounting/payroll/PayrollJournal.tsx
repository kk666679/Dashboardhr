import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PayrollJournalEntry {
  account: string;
  debit: number;
  credit: number;
}

interface PayrollJournalProps {
  entries: PayrollJournalEntry[];
  runId: string;
}

export function PayrollJournal({ entries, runId }: PayrollJournalProps) {
  const totalDebit = entries.reduce((sum, e) => sum + e.debit, 0);
  const totalCredit = entries.reduce((sum, e) => sum + e.credit, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payroll Journal</CardTitle>
        <p className="text-sm text-muted-foreground">Run ID: {runId}</p>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Account</TableHead>
              <TableHead className="text-right">Debit</TableHead>
              <TableHead className="text-right">Credit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((e, i) => (
              <TableRow key={i}>
                <TableCell>{e.account}</TableCell>
                <TableCell className="text-right">{e.debit ? e.debit : "-"}</TableCell>
                <TableCell className="text-right">{e.credit ? e.credit : "-"}</TableCell>
              </TableRow>
            ))}
            <TableRow className="font-bold border-t-2">
              <TableCell>Total</TableCell>
              <TableCell className="text-right">{totalDebit}</TableCell>
              <TableCell className="text-right">{totalCredit}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
