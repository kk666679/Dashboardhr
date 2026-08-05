import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Account {
  id: string;
  code: string;
  name: string;
  type: "Asset" | "Liability" | "Equity" | "Revenue" | "Expense";
  balance: number;
  currency: string;
  status: "Active" | "Inactive";
}

interface ChartOfAccountsProps {
  accounts: Account[];
  onDelete?: (id: string) => void;
}

export function ChartOfAccounts({ accounts, onDelete }: ChartOfAccountsProps) {
  const router = useRouter();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Code</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Balance</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {accounts.map((a) => (
          <TableRow key={a.id}>
            <TableCell className="font-mono text-xs">{a.code}</TableCell>
            <TableCell>{a.name}</TableCell>
            <TableCell>
              <Badge variant="secondary">{a.type}</Badge>
            </TableCell>
            <TableCell>{a.balance} {a.currency}</TableCell>
            <TableCell>
              <Badge variant={a.status === "Active" ? "success" : "secondary"}>
                {a.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right space-x-2">
              <Button variant="outline" size="sm" onClick={() => router.push(`/accounting/accounts/${a.id}`)}>
                View
              </Button>
              <Button variant="outline" size="sm" onClick={() => router.push(`/accounting/accounts/${a.id}/edit`)}>
                Edit
              </Button>
              {onDelete && (
                <Button variant="destructive" size="sm" onClick={() => onDelete(a.id)}>
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
