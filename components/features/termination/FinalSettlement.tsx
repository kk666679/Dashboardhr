import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SettlementLineItem {
  id: string;
  description: string;
  category: string;
  amount: number;
}

interface FinalSettlementProps {
  lineItems: SettlementLineItem[];
  totalAmount: number;
  status: "Draft" | "Review" | "Approved" | "Paid";
  onApprove?: () => void;
  onPay?: () => void;
  onUpdateItem?: (id: string, amount: number) => void;
}

export function FinalSettlement({
  lineItems,
  totalAmount,
  status,
  onApprove,
  onPay,
  onUpdateItem,
}: FinalSettlementProps) {
  const isLocked = status === "Approved" || status === "Paid";

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Final Settlement</CardTitle>
          <Badge variant={status === "Paid" ? "success" : status === "Approved" ? "warning" : "secondary"}>
            {status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lineItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell className="text-right">
                  {isLocked ? (
                    item.amount
                  ) : (
                    <Input
                      type="number"
                      value={item.amount}
                      onChange={(e) => onUpdateItem?.(item.id, parseFloat(e.target.value))}
                      className="w-32 ml-auto text-right"
                    />
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {!isLocked && (
                    <Button variant="ghost" size="sm">Remove</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            <TableRow className="font-bold border-t-2">
              <TableCell colSpan={2}>Total</TableCell>
              <TableCell className="text-right">{totalAmount}</TableCell>
              <TableCell />
            </TableRow>
          </TableBody>
        </Table>

        <div className="flex justify-end gap-2">
          {status === "Draft" && !isLocked && (
            <Button variant="outline" onClick={onApprove}>Submit for Review</Button>
          )}
          {status === "Review" && (
            <Button onClick={onApprove}>Approve</Button>
          )}
          {status === "Approved" && (
            <Button onClick={onPay}>Mark as Paid</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
