"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface CompensationCycle {
  id: string;
  name: string;
  startDate: string | Date;
  endDate: string | Date;
  status: string;
  [key: string]: unknown;
}

interface CycleListProps {
  cycles: CompensationCycle[];
}

export function CycleList({ cycles }: CycleListProps) {
  const router = useRouter();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Start Date</TableHead>
          <TableHead>End Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {cycles.map((cycle) => (
          <TableRow key={cycle.id}>
            <TableCell>{cycle.name}</TableCell>
            <TableCell>{new Date(cycle.startDate).toLocaleDateString()}</TableCell>
            <TableCell>{new Date(cycle.endDate).toLocaleDateString()}</TableCell>
            <TableCell>
              <Badge variant={cycle.status === "ACTIVE" ? "success" : cycle.status === "OPEN" ? "warning" : "secondary"}>
                {cycle.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/compensation/cycles/${cycle.id}`)}
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
