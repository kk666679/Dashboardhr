import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Customer {
  id: string;
  code: string;
  name: string;
  contact: string;
  email: string;
  balance: number;
  status: "Active" | "Inactive";
}

interface CustomerListProps {
  customers: Customer[];
  onDelete?: (id: string) => void;
}

export function CustomerList({ customers, onDelete }: CustomerListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Code</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Balance</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {customers.map((c) => (
          <TableRow key={c.id}>
            <TableCell className="font-mono text-xs">{c.code}</TableCell>
            <TableCell>{c.name}</TableCell>
            <TableCell>{c.contact}</TableCell>
            <TableCell>{c.email}</TableCell>
            <TableCell>{c.balance}</TableCell>
            <TableCell>
              <Badge variant={c.status === "Active" ? "success" : "secondary"}>
                {c.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right space-x-2">
              <Button variant="outline" size="sm">View</Button>
              <Button variant="outline" size="sm">Edit</Button>
              {onDelete && (
                <Button variant="destructive" size="sm" onClick={() => onDelete(c.id)}>
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
