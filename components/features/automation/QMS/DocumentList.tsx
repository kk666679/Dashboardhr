"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface QMSDocument {
  id: string;
  code: string;
  title: string;
  version: string;
  status: "Draft" | "Review" | "Approved" | "Archived" | "Obsolete";
  category: string;
  owner: string;
  updated: string;
}

interface DocumentListProps {
  documents: QMSDocument[];
  onDelete?: (id: string) => void;
}

export function DocumentList({ documents, onDelete }: DocumentListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Code</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Version</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Owner</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {documents.map((d) => (
          <TableRow key={d.id}>
            <TableCell className="font-mono text-xs">{d.code}</TableCell>
            <TableCell>{d.title}</TableCell>
            <TableCell>v{d.version}</TableCell>
            <TableCell>{d.category}</TableCell>
            <TableCell>{d.owner}</TableCell>
            <TableCell>
              <Badge variant={d.status === "Approved" ? "success" : d.status === "Review" ? "warning" : d.status === "Obsolete" ? "destructive" : "secondary"}>
                {d.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right space-x-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/dashboard/automation/qms?tab=documents&documentId=${d.id}`}>View</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/dashboard/automation/qms?tab=documents&documentId=${d.id}&mode=edit`}>Edit</Link>
              </Button>
              {onDelete && (
                <Button variant="destructive" size="sm" onClick={() => onDelete(d.id)}>
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
