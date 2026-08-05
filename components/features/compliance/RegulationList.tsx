"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Regulation {
  id: string;
  name: string;
  description: string;
  jurisdiction: string;
  status: "Active" | "Draft" | "Archived";
  complianceDeadline: string;
  owner: string;
}

interface RegulationListProps {
  regulations: Regulation[];
  onDelete?: (id: string) => void;
}

export function RegulationList({ regulations, onDelete }: RegulationListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Jurisdiction</TableHead>
          <TableHead>Deadline</TableHead>
          <TableHead>Owner</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {regulations.map((r) => (
          <TableRow key={r.id}>
            <TableCell>{r.name}</TableCell>
            <TableCell>{r.description}</TableCell>
            <TableCell>{r.jurisdiction}</TableCell>
            <TableCell>{new Date(r.complianceDeadline).toLocaleDateString()}</TableCell>
            <TableCell>{r.owner}</TableCell>
            <TableCell>
              <Badge variant={r.status === "Active" ? "success" : r.status === "Draft" ? "warning" : "secondary"}>
                {r.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right space-x-2">
              <Button variant="outline" size="sm">View</Button>
              {onDelete && (
                <Button variant="destructive" size="sm" onClick={() => onDelete(r.id)}>
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

