"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface TrainingRecord {
  id: string;
  employee: string;
  course: string;
  date: string;
  expiry: string | null;
  status: "Completed" | "In Progress" | "Overdue" | "Expired";
  score: number;
  provider: string;
}

interface TrainingRecordListProps {
  records: TrainingRecord[];
  onDelete?: (id: string) => void;
}

export function TrainingRecordList({ records, onDelete }: TrainingRecordListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Employee</TableHead>
          <TableHead>Course</TableHead>
          <TableHead>Provider</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Expiry</TableHead>
          <TableHead>Score</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {records.map((r) => (
          <TableRow key={r.id}>
            <TableCell>{r.employee}</TableCell>
            <TableCell>{r.course}</TableCell>
            <TableCell>{r.provider}</TableCell>
            <TableCell>{new Date(r.date).toLocaleDateString()}</TableCell>
            <TableCell>{r.expiry ? new Date(r.expiry).toLocaleDateString() : "N/A"}</TableCell>
            <TableCell>{r.score}%</TableCell>
            <TableCell>
              <Badge variant={r.status === "Completed" ? "success" : r.status === "Overdue" ? "destructive" : r.status === "Expired" ? "warning" : "secondary"}>
                {r.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right space-x-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/dashboard/automation/qms?tab=training&recordId=${r.id}`}>View</Link>
              </Button>
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
