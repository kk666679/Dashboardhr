"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface BonusPlan {
  id: string;
  name: string;
  description?: string | null;
  tiers?: string | null;
  [key: string]: unknown;
}

interface BonusPlanListProps {
  plans: BonusPlan[];
}

export function BonusPlanList({ plans }: BonusPlanListProps) {
  const router = useRouter();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Tiers</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {plans.map((plan) => (
          <TableRow key={plan.id}>
            <TableCell>{plan.name}</TableCell>
            <TableCell>{plan.description || "-"}</TableCell>
            <TableCell>{plan.tiers ? JSON.parse(plan.tiers).length : 0}</TableCell>
            <TableCell className="text-right">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/compensation/bonus-plans/${plan.id}`)}
              >
                Edit
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
