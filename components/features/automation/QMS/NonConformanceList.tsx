"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface NonConformance {
  id: string;
  reference: string;
  title: string;
  category: string;
  severity: "Minor" | "Major" | "Critical";
  origin: string;
  date: string;
  status: "Open" | "Investigation" | "Action" | "Closed" | "Rejected";
  owner: string;
}

interface NonConformanceListProps {
  items: NonConformance[];
  onDelete?: (id: string) => void;
}

export function NonConformanceList({ items, onDelete }: NonConformanceListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Reference</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Severity</TableHead>
          <TableHead>Origin</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Owner</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((n) => (
          <TableRow key={n.id}>
            <TableCell className="font-mono text-xs">{n.reference}</TableCell>
            <TableCell>{n.title}</TableCell>
            <TableCell>{n.category}</TableCell>
            <TableCell>
              <Badge variant={n.severity === "Critical" ? "destructive" : n.severity === "Major" ? "warning" : "secondary"}>
                {n.severity}
              </Badge>
            </TableCell>
            <TableCell>{n.origin}</TableCell>
            <TableCell>
              <Badge variant={n.status === "Closed" ? "success" : n.status === "Action" ? "warning" : "secondary"}>
                {n.status}
              </Badge>
            </TableCell>
            <TableCell>{n.owner}</TableCell>
            <TableCell className="text-right space-x-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/dashboard/automation/qms?tab=nonconformance&nonConformanceId=${n.id}`}>View</Link>
              </Button>
              {onDelete && (
                <Button variant="destructive" size="sm" onClick={() => onDelete(n.id)}>
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
