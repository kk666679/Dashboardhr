import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface Signer {
  id: string;
  name: string;
  email: string;
  status: "Pending" | "Signed" | "Declined" | "Expired";
  signedAt?: string;
}

interface DocumentSigningProps {
  signers: Signer[];
  onSign?: (id: string) => void;
  onSendReminder?: (id: string) => void;
}

export function DocumentSigning({ signers, onSign, onSendReminder }: DocumentSigningProps) {
  const allSigned = signers.every(s => s.status === "Signed");

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Signatures</h3>
        {allSigned ? (
          <Badge variant="success">All Signed</Badge>
        ) : (
          <Badge variant="warning">{signers.filter(s => s.status === "Pending").length} Pending</Badge>
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Signed At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {signers.map((s) => (
            <TableRow key={s.id}>
              <TableCell>{s.name}</TableCell>
              <TableCell>{s.email}</TableCell>
              <TableCell>
                <Badge variant={s.status === "Signed" ? "success" : s.status === "Declined" ? "destructive" : s.status === "Expired" ? "secondary" : "warning"}>
                  {s.status}
                </Badge>
              </TableCell>
              <TableCell>{s.signedAt ? new Date(s.signedAt).toLocaleDateString() : "-"}</TableCell>
              <TableCell className="text-right space-x-2">
                {s.status === "Pending" && (
                  <>
                    <Button size="sm" onClick={() => onSign?.(s.id)}>Sign</Button>
                    <Button size="sm" variant="outline" onClick={() => onSendReminder?.(s.id)}>Remind</Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
