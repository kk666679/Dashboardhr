import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TrialBalanceEntry {
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
}

interface TrialBalanceProps {
  entries: TrialBalanceEntry[];
  asOf: string;
}

export function TrialBalance({ entries, asOf }: TrialBalanceProps) {
  const totalDebit = entries.reduce((sum, e) => sum + e.debit, 0);
  const totalCredit = entries.reduce((sum, e) => sum + e.credit, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trial Balance</CardTitle>
        <p className="text-sm text-muted-foreground">As of {new Date(asOf).toLocaleDateString()}</p>
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
            {entries.map((e) => (
              <TableRow key={e.accountCode}>
                <TableCell>{e.accountCode} - {e.accountName}</TableCell>
                <TableCell className="text-right">{e.debit ? e.debit : "-"}</TableCell>
                <TableCell className="text-right">{e.credit ? e.credit : "-"}</TableCell>
              </TableRow>
            ))}
            <TableRow className="font-bold border-t-2">
              <TableCell>TOTAL</TableCell>
              <TableCell className="text-right">{totalDebit}</TableCell>
              <TableCell className="text-right">{totalCredit}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
