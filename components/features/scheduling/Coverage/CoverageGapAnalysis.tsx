"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface CoverageGapAnalysisProps {
  gaps: { date: string; role: string; required: number; actual: number; gap: number }[];
}

export function CoverageGapAnalysis({ gaps }: CoverageGapAnalysisProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Required</TableHead>
          <TableHead>Actual</TableHead>
          <TableHead>Gap</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {gaps.map((g, i) => (
          <TableRow key={i}>
            <TableCell>{new Date(g.date).toLocaleDateString()}</TableCell>
            <TableCell>{g.role}</TableCell>
            <TableCell>{g.required}</TableCell>
            <TableCell>{g.actual}</TableCell>
            <TableCell>
              <Badge variant={g.gap > 0 ? "destructive" : "success"}>
                {g.gap > 0 ? `-${g.gap}` : "✓"}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
