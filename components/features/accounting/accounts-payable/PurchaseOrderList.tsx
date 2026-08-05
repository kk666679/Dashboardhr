import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface PurchaseOrder {
  id: string;
  poNumber: string;
  vendor: string;
  date: string;
  amount: number;
  status: "Draft" | "Sent" | "Received" | "Invoiced" | "Closed";
}

interface PurchaseOrderListProps {
  orders: PurchaseOrder[];
  onDelete?: (id: string) => void;
}

export function PurchaseOrderList({ orders, onDelete }: PurchaseOrderListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>PO Number</TableHead>
          <TableHead>Vendor</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((o) => (
          <TableRow key={o.id}>
            <TableCell className="font-mono text-xs">{o.poNumber}</TableCell>
            <TableCell>{o.vendor}</TableCell>
            <TableCell>{new Date(o.date).toLocaleDateString()}</TableCell>
            <TableCell>{o.amount}</TableCell>
            <TableCell>
              <Badge variant={o.status === "Closed" ? "success" : o.status === "Draft" ? "secondary" : "warning"}>
                {o.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right space-x-2">
              <Button variant="outline" size="sm">View</Button>
              {onDelete && (
                <Button variant="destructive" size="sm" onClick={() => onDelete(o.id)}>
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
