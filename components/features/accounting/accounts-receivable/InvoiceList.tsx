import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Invoice {
  id: string;
  invoiceNumber: string;
  customer: string;
  date: string;
  dueDate: string;
  amount: number;
  status: "Draft" | "Sent" | "Paid" | "Overdue" | "Cancelled";
}

interface InvoiceListProps {
  invoices: Invoice[];
  onDelete?: (id: string) => void;
}

export function InvoiceList({ invoices, onDelete }: InvoiceListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice #</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Due</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((i) => (
          <TableRow key={i.id}>
            <TableCell className="font-mono text-xs">{i.invoiceNumber}</TableCell>
            <TableCell>{i.customer}</TableCell>
            <TableCell>{new Date(i.date).toLocaleDateString()}</TableCell>
            <TableCell>{new Date(i.dueDate).toLocaleDateString()}</TableCell>
            <TableCell>{i.amount}</TableCell>
            <TableCell>
              <Badge variant={i.status === "Paid" ? "success" : i.status === "Overdue" ? "destructive" : i.status === "Sent" ? "warning" : "secondary"}>
                {i.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right space-x-2">
              <Button variant="outline" size="sm">View</Button>
              {onDelete && (
                <Button variant="destructive" size="sm" onClick={() => onDelete(i.id)}>
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
