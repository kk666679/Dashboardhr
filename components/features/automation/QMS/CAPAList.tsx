"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface CAPA {
  id: string;
  reference: string;
  title: string;
  type: "Corrective" | "Preventive";
  source: string;
  owner: string;
  dueDate: string;
  status: "Open" | "In Progress" | "Review" | "Closed" | "Rejected";
  priority: "Low" | "Medium" | "High" | "Critical";
}

interface CAPAListProps {
  capas: CAPA[];
  onDelete?: (id: string) => void;
}

export function CAPAList({ capas, onDelete }: CAPAListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Reference</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Owner</TableHead>
          <TableHead>Due</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {capas.map((c) => (
          <TableRow key={c.id}>
            <TableCell className="font-mono text-xs">{c.reference}</TableCell>
            <TableCell>{c.title}</TableCell>
            <TableCell>
              <Badge variant={c.type === "Corrective" ? "warning" : "secondary"}>
                {c.type}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant={c.priority === "Critical" ? "destructive" : c.priority === "High" ? "warning" : "secondary"}>
                {c.priority}
              </Badge>
            </TableCell>
            <TableCell>{c.owner}</TableCell>
            <TableCell>{new Date(c.dueDate).toLocaleDateString()}</TableCell>
            <TableCell>
              <Badge variant={c.status === "Closed" ? "success" : c.status === "In Progress" ? "warning" : c.status === "Open" ? "secondary" : "destructive"}>
                {c.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right space-x-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/dashboard/automation/qms?tab=capa&capaId=${c.id}`}>View</Link>
              </Button>
              {onDelete && (
                <Button variant="destructive" size="sm" onClick={() => onDelete(c.id)}>
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
