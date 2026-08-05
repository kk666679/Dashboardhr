import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface IncomeStatementProps {
  revenue: { account: string; amount: number }[];
  expenses: { account: string; amount: number }[];
  period: string;
}

export function IncomeStatement({ revenue, expenses, period }: IncomeStatementProps) {
  const totalRevenue = revenue.reduce((sum, r) => sum + r.amount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netIncome = totalRevenue - totalExpenses;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Income Statement</CardTitle>
        <p className="text-sm text-muted-foreground">Period: {period}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold mb-2">Revenue</h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Account</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {revenue.map((r, i) => (
                <TableRow key={i}>
                  <TableCell>{r.account}</TableCell>
                  <TableCell className="text-right">{r.amount}</TableCell>
                </TableRow>
              ))}
              <TableRow className="font-bold border-t-2">
                <TableCell>Total Revenue</TableCell>
                <TableCell className="text-right">{totalRevenue}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Expenses</h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Account</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((e, i) => (
                <TableRow key={i}>
                  <TableCell>{e.account}</TableCell>
                  <TableCell className="text-right">{e.amount}</TableCell>
                </TableRow>
              ))}
              <TableRow className="font-bold border-t-2">
                <TableCell>Total Expenses</TableCell>
                <TableCell className="text-right">{totalExpenses}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div className="border-t-2 pt-4 text-right font-bold">
          Net Income: {netIncome}
        </div>
      </CardContent>
    </Card>
  );
}
