"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface LineItem {
  description: string;
  category: string;
  amount: number;
  [key: string]: unknown;
}

interface SettlementLineItemsProps {
  items: LineItem[];
  total: number;
}

export function SettlementLineItems({ items, total }: SettlementLineItemsProps) {
  return (
    <div className="space-y-2">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, i) => (
            <TableRow key={i}>
              <TableCell>{item.description}</TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell className="text-right">{item.amount}</TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={2} className="font-bold">Total</TableCell>
            <TableCell className="text-right font-bold">{total}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

