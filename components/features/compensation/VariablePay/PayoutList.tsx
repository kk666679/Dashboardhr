"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface Payout {
  id: string;
  employeeId: string;
  totalAmount: number;
  status: "DRAFT" | "APPROVED" | "PAID";
}

interface PayoutListProps {
  payouts: Payout[];
  onApprove?: (id: string) => void;
  onPay?: (id: string) => void;
}

export function PayoutList({ payouts, onApprove, onPay }: PayoutListProps) {
  const statusVariant: Record<Payout["status"], "default" | "secondary" | "success"> = {
    DRAFT: "default",
    APPROVED: "secondary",
    PAID: "success",
  };

  if (payouts.length === 0) {
    return <div className="text-center py-8 text-gray-500">No payouts found.</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Employee</TableHead>
          <TableHead>Total Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payouts.map((payout) => (
          <TableRow key={payout.id}>
            <TableCell>{payout.employeeId}</TableCell>
            <TableCell>${payout.totalAmount.toFixed(2)}</TableCell>
            <TableCell>
              <Badge variant={statusVariant[payout.status]}>
                {payout.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right space-x-2">
              {payout.status === "DRAFT" && onApprove && (
                <Button size="sm" onClick={() => onApprove(payout.id)}>
                  Approve
                </Button>
              )}
              {payout.status === "APPROVED" && onPay && (
                <Button size="sm" onClick={() => onPay(payout.id)}>
                  Pay
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
