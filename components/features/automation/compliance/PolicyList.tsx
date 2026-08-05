"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Policy {
  id: string;
  name: string;
  category: string;
  version: string;
  status: "Draft" | "Active" | "Archived" | "Review";
  owner: string;
  effectiveDate: string;
}

interface PolicyListProps {
  policies: Policy[];
  onDelete?: (id: string) => void;
}

export function PolicyList({ policies, onDelete }: PolicyListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Version</TableHead>
          <TableHead>Owner</TableHead>
          <TableHead>Effective</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {policies.map((p) => (
          <TableRow key={p.id}>
            <TableCell>{p.name}</TableCell>
            <TableCell>{p.category}</TableCell>
            <TableCell>v{p.version}</TableCell>
            <TableCell>{p.owner}</TableCell>
            <TableCell>{new Date(p.effectiveDate).toLocaleDateString()}</TableCell>
            <TableCell>
              <Badge variant={p.status === "Active" ? "success" : p.status === "Review" ? "warning" : p.status === "Draft" ? "secondary" : "destructive"}>
                {p.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right space-x-2">
              <Button variant="outline" size="sm">View</Button>
              {onDelete && (
                <Button variant="destructive" size="sm" onClick={() => onDelete(p.id)}>
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