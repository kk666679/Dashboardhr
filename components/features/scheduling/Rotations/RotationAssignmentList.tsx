"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface AssignmentData {
  id: string;
  employee?: { name: string } | null;
  employeeId: string;
  date: string | Date;
  shiftStart: string | Date;
  shiftEnd: string | Date;
  [key: string]: unknown;
}

interface RotationAssignmentListProps {
  assignments: AssignmentData[];
}

export function RotationAssignmentList({ assignments }: RotationAssignmentListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Employee</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Shift Start</TableHead>
          <TableHead>Shift End</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {assignments.map((a) => (
          <TableRow key={a.id}>
            <TableCell>{a.employee?.name || a.employeeId}</TableCell>
            <TableCell>{new Date(a.date).toLocaleDateString()}</TableCell>
            <TableCell>{new Date(a.shiftStart).toLocaleTimeString()}</TableCell>
            <TableCell>{new Date(a.shiftEnd).toLocaleTimeString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

