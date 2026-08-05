"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface ChecklistItem {
  id: string;
  requirement: string;
  status: "compliant" | "non-compliant" | "partial" | "not-applicable";
  evidence?: string;
  notes?: string;
}

interface ComplianceChecklistProps {
  items: ChecklistItem[];
  regulationId: string;
  onUpdate?: (id: string, status: string) => void;
  onAddEvidence?: (id: string) => void;
}

export function ComplianceChecklist({ items, regulationId, onUpdate, onAddEvidence }: ComplianceChecklistProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Requirement</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Evidence</TableHead>
          <TableHead>Notes</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.requirement}</TableCell>
            <TableCell>
              <Badge variant={item.status === "compliant" ? "success" : item.status === "non-compliant" ? "destructive" : item.status === "partial" ? "warning" : "secondary"}>
                {item.status}
              </Badge>
            </TableCell>
            <TableCell>{item.evidence || "-"}</TableCell>
            <TableCell>{item.notes || "-"}</TableCell>
            <TableCell className="text-right space-x-1">
              {onUpdate && (
                <>
                  <Button variant="ghost" size="sm" onClick={() => onUpdate(item.id, "compliant")}>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onUpdate(item.id, "non-compliant")}>
                    <XCircle className="h-4 w-4 text-red-500" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onUpdate(item.id, "partial")}>
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                  </Button>
                </>
              )}
              {onAddEvidence && (
                <Button variant="outline" size="sm" onClick={() => onAddEvidence(item.id)}>
                  Evidence
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

