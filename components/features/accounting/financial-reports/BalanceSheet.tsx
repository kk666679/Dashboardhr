import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface BalanceSheetItem {
  account: string;
  amount: number;
}

interface BalanceSheetProps {
  assets: BalanceSheetItem[];
  liabilities: BalanceSheetItem[];
  equity: BalanceSheetItem[];
  asOf: string;
}

export function BalanceSheet({ assets, liabilities, equity, asOf }: BalanceSheetProps) {
  const totalAssets = assets.reduce((sum, a) => sum + a.amount, 0);
  const totalLiabilities = liabilities.reduce((sum, a) => sum + a.amount, 0);
  const totalEquity = equity.reduce((sum, a) => sum + a.amount, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Balance Sheet</CardTitle>
        <p className="text-sm text-muted-foreground">As of {new Date(asOf).toLocaleDateString()}</p>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-4">
        <div>
          <h4 className="font-semibold mb-2">Assets</h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Account</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assets.map((a, i) => (
                <TableRow key={i}>
                  <TableCell>{a.account}</TableCell>
                  <TableCell className="text-right">{a.amount}</TableCell>
                </TableRow>
              ))}
              <TableRow className="font-bold border-t-2">
                <TableCell>Total</TableCell>
                <TableCell className="text-right">{totalAssets}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Liabilities</h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Account</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {liabilities.map((l, i) => (
                <TableRow key={i}>
                  <TableCell>{l.account}</TableCell>
                  <TableCell className="text-right">{l.amount}</TableCell>
                </TableRow>
              ))}
              <TableRow className="font-bold border-t-2">
                <TableCell>Total</TableCell>
                <TableCell className="text-right">{totalLiabilities}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Equity</h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Account</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {equity.map((e, i) => (
                <TableRow key={i}>
                  <TableCell>{e.account}</TableCell>
                  <TableCell className="text-right">{e.amount}</TableCell>
                </TableRow>
              ))}
              <TableRow className="font-bold border-t-2">
                <TableCell>Total</TableCell>
                <TableCell className="text-right">{totalEquity}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div className="col-span-3 pt-4 border-t font-bold text-right">
          Liabilities + Equity = {totalLiabilities + totalEquity}
        </div>
      </CardContent>
    </Card>
  );
}
