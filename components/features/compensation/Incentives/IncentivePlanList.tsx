"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface IncentivePlan {
  id: string;
  name: string;
  description?: string | null;
  metrics?: unknown[] | string | null;
  [key: string]: unknown;
}

interface IncentivePlanListProps {
  plans: IncentivePlan[];
}

export function IncentivePlanList({ plans }: IncentivePlanListProps) {
  const router = useRouter();

  const getMetricsCount = (metrics: unknown[] | string | null | undefined): number => {
    if (!metrics) return 0;
    if (Array.isArray(metrics)) return metrics.length;
    if (typeof metrics === "string") {
      try {
        const parsed = JSON.parse(metrics);
        return Array.isArray(parsed) ? parsed.length : 0;
      } catch {
        return 0;
      }
    }
    return 0;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Metrics</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {plans.map((plan) => (
          <TableRow key={plan.id}>
            <TableCell>{plan.name}</TableCell>
            <TableCell>{plan.description ?? "-"}</TableCell>
            <TableCell>{getMetricsCount(plan.metrics as any)}</TableCell>
            <TableCell className="text-right">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/compensation/incentives/${plan.id}`)}
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
