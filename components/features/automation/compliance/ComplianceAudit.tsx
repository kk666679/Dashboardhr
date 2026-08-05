"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface AuditFinding {
  id: string;
  regulation: string;
  description: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  status: "Open" | "In Progress" | "Closed" | "Accepted";
  assignedTo: string;
  dueDate: string;
}

interface ComplianceAuditProps {
  findings: AuditFinding[];
  onUpdate?: (id: string, status: string) => void;
}

export function ComplianceAudit({ findings, onUpdate }: ComplianceAuditProps) {
  const openCount = findings.filter(f => f.status !== "Closed").length;
  const total = findings.length;
  const progress = total ? Math.round(((total - openCount) / total) * 100) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Compliance Audit Findings
          <div className="flex items-center gap-2">
            <span className="text-sm font-normal">Progress</span>
            <Progress value={progress} className="w-24 h-2" />
            <span className="text-sm font-normal">{progress}%</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Regulation</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Due</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {findings.map((f) => (
              <TableRow key={f.id}>
                <TableCell>{f.regulation}</TableCell>
                <TableCell>{f.description}</TableCell>
                <TableCell>
                  <Badge variant={f.severity === "Critical" ? "destructive" : f.severity === "High" ? "warning" : "secondary"}>
                    {f.severity}
                  </Badge>
                </TableCell>
                <TableCell>{f.assignedTo}</TableCell>
                <TableCell>{new Date(f.dueDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge variant={f.status === "Closed" ? "success" : f.status === "In Progress" ? "warning" : "secondary"}>
                    {f.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {onUpdate && f.status !== "Closed" && (
                    <Button size="sm" variant="outline" onClick={() => onUpdate(f.id, "Closed")}>
                      Close
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}