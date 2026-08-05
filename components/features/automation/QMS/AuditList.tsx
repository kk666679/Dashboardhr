"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar } from "lucide-react";

interface Audit {
  id: string;
  title: string;
  type: "Internal" | "External" | "Supplier" | "Regulatory";
  scope: string;
  auditor: string;
  scheduled: string;
  status: "Scheduled" | "In Progress" | "Completed" | "Overdue";
  findings: number;
  nonConformances: number;
}

interface AuditListProps {
  audits: Audit[];
  onDelete?: (id: string) => void;
}

export function AuditList({ audits, onDelete }: AuditListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Auditor</TableHead>
          <TableHead>Scheduled</TableHead>
          <TableHead>Findings</TableHead>
          <TableHead>NCs</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {audits.map((a) => (
          <TableRow key={a.id}>
            <TableCell>{a.title}</TableCell>
            <TableCell>
              <Badge variant="secondary">{a.type}</Badge>
            </TableCell>
            <TableCell>{a.auditor}</TableCell>
            <TableCell>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3 text-muted-foreground" />
                {new Date(a.scheduled).toLocaleDateString()}
              </div>
            </TableCell>
            <TableCell>{a.findings}</TableCell>
            <TableCell>
              {a.nonConformances > 0 ? (
                <Badge variant="destructive">{a.nonConformances}</Badge>
              ) : (
                <span className="text-green-600">✓</span>
              )}
            </TableCell>
            <TableCell>
              <Badge variant={a.status === "Completed" ? "success" : a.status === "Overdue" ? "destructive" : "warning"}>
                {a.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right space-x-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/dashboard/automation/qms?tab=audits&auditId=${a.id}`}>View</Link>
              </Button>
              {onDelete && (
                <Button variant="destructive" size="sm" onClick={() => onDelete(a.id)}>
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
