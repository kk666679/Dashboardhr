"use client";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Lock, Eye, Loader2 } from "lucide-react";

export default function EssPayslipsPage() {
  const { data: runs, isLoading } = trpc.payrollHcm.listRuns.useQuery({ status: "FINALIZED" }, { enabled: true });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-xl font-bold flex items-center gap-2">
        <FileText className="h-5 w-5 text-green-600" /> My Payslips
      </h1>
      <p className="text-xs text-muted-foreground flex items-center gap-1">
        <Lock className="h-3.5 w-3.5" /> All payslips are AES-256 encrypted. Downloads are logged in the audit trail.
      </p>

      <Card>
        <CardContent className="p-0">
          {!runs?.length ? (
            <div className="p-8 text-center text-muted-foreground text-sm">No payslips available yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs">Pay Period</th>
                    <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs">Status</th>
                    <th className="text-right px-4 py-2.5 font-medium text-muted-foreground text-xs">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {runs.map((run) => (
                    <tr key={run.id} className="border-b hover:bg-muted/20">
                      <td className="px-4 py-3 font-medium">
                        {new Date(run.periodStart).toLocaleDateString("en-MY", { month: "long", year: "numeric" })}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium">{run.status}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex gap-2 justify-end">
                          <Button size="sm" variant="ghost">
                            <Eye className="h-3.5 w-3.5 mr-1" /> View
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-3.5 w-3.5 mr-1" /> PDF
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
