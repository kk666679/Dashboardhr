"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Termination {
  id: string;
  employee: string;
  department: string;
  type: "Voluntary" | "Involuntary" | "Retirement" | "Mutual";
  effectiveDate: string;
  status: "Initiated" | "In Progress" | "Clearance" | "Completed" | "Cancelled";
  reason: string;
}

interface TerminationListProps {
  terminations: Termination[];
  onDelete?: (id: string) => void;
}

export function TerminationList({ terminations, onDelete }: TerminationListProps) {
  const router = useRouter();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Employee</TableHead>
          <TableHead>Department</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Effective Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Reason</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {terminations.map((t) => (
          <TableRow key={t.id}>
            <TableCell>{t.employee}</TableCell>
            <TableCell>{t.department}</TableCell>
            <TableCell>
              <Badge variant="secondary">{t.type}</Badge>
            </TableCell>
            <TableCell>{new Date(t.effectiveDate).toLocaleDateString()}</TableCell>
            <TableCell>
              <Badge variant={t.status === "Completed" ? "success" : t.status === "Initiated" ? "secondary" : t.status === "Cancelled" ? "destructive" : "warning"}>
                {t.status}
              </Badge>
            </TableCell>
            <TableCell className="max-w-xs truncate">{t.reason}</TableCell>
            <TableCell className="text-right space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/dashboard/termination/${t.id}`)}
              >View</Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/dashboard/termination/${t.id}/edit`)}
              >Edit</Button>
              {onDelete && (
                <Button variant="destructive" size="sm" onClick={() => onDelete(t.id)}>Delete</Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
