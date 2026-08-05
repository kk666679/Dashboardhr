"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface EquityAwardDefinition {
  id: string;
  name: string;
  type: string;
  vestingSchedule?: string | null;
  [key: string]: unknown;
}

interface EquityDefinitionListProps {
  definitions: EquityAwardDefinition[];
}

export function EquityDefinitionList({ definitions }: EquityDefinitionListProps) {
  const router = useRouter();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Vesting Schedule</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {definitions.map((def) => (
          <TableRow key={def.id}>
            <TableCell>{def.name}</TableCell>
            <TableCell>{def.type}</TableCell>
            <TableCell>{def.vestingSchedule ? "Configured" : "None"}</TableCell>
            <TableCell className="text-right">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/compensation/equity/definitions/${def.id}`)}
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
