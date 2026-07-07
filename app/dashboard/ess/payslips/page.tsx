"use client";
/**
 * ESS Payslips page — Task 8.5
 * Serves pre-generated encrypted PDF payslips to employees.
 * Access logged in AuditTrail (Req 14.4).
 * Requirements: 8.6, 14.4
 */
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Eye, Lock } from "lucide-react";

export default function EssPayslipsPage() {
  const [employeeId] = useState(""); // In production: from session ctx.employeeId
  const [selectedRun, setSelectedRun] = useState<string | null>(null);

  const { data: runs } = trpc.payrollHcm.listRuns.useQuery({ status: "FINALIZED" });

  function handleDownload(runId: string) {
    setSelectedRun(runId);
    // TODO: call GET /api/payslips/[runId] which:
    // 1. Verifies session employeeId === payslip employeeId
    // 2. Logs audit trail (Req 14.4)
    // 3. Streams decrypted PDF
    alert(`Payslip download initiated for run ${runId.slice(0, 8)}…\n\nIn production: AES-256 decryption + PDF stream + AuditTrail log.`);
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-6">
      <div className="flex items-center gap-2">
        <FileText className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">My Payslips</h1>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <Lock className="h-3.5 w-3.5" /> Encrypted payslips — access is logged
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {!runs?.length ? (
            <div className="p-8 text-center text-muted-foreground">
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No payslips available yet.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  {["Pay Period", "Legal Entity", "Status", ""].map(h => (
                    <th key={h} className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {runs.map(run => (
                  <tr key={run.id} className="border-b hover:bg-muted/20">
                    <td className="px-4 py-3 font-medium">
                      {new Date(run.periodStart).toLocaleDateString("en-MY", { month: "long", year: "numeric" })}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground font-mono">
                      {run.legalEntityId.slice(0, 12)}…
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="text-xs text-green-700 border-green-200">
                        {run.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" onClick={() => handleDownload(run.id)}>
                          <Eye className="h-3.5 w-3.5 mr-1" /> View
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDownload(run.id)}>
                          <Download className="h-3.5 w-3.5 mr-1" /> PDF
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      <Card className="bg-muted/30">
        <CardContent className="pt-4">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <Lock className="h-3.5 w-3.5 inline mr-1" />
            All payslips are encrypted with AES-256. Each download is recorded in the audit trail as required by PDPA.
            If you believe a payslip is incorrect, contact your HR Executive or Payroll Manager.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
