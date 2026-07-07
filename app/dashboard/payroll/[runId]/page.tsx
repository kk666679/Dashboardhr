"use client";
/**
 * Payroll Run Detail + Variance Flags — Task 8.5
 * Requirements: 8.5, 8.6
 */
import { use } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, DollarSign, FileText } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PayrollRunDetailPage({ params }: { params: Promise<{ runId: string }> }) {
  const { runId } = use(params);
  const router = useRouter();

  const { data: run, isLoading } = trpc.payrollHcm.getRunById.useQuery({ id: runId });
  const { data: variance }       = trpc.payrollHcm.getVarianceReport.useQuery({ runId });
  const finalizeRun = trpc.payrollHcm.finalizeRun.useMutation({
    onSuccess: () => router.refresh(),
  });

  if (isLoading) return <div className="p-8 text-center text-muted-foreground">Loading…</div>;
  if (!run)      return <div className="p-8 text-center text-destructive">Run not found</div>;

  // Group line items by employee
  const byEmployee = (run.lineItems ?? []).reduce<Record<string, typeof run.lineItems>>((acc, li) => {
    (acc[li.employeeId] ??= []).push(li);
    return acc;
  }, {});

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Payroll Run — {new Date(run.periodStart).toLocaleDateString()} to {new Date(run.periodEnd).toLocaleDateString()}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Legal Entity: {run.legalEntityId} · Status: {run.status}</p>
        </div>
        {run.status === "PENDING_REVIEW" && (
          <Button
            onClick={() => finalizeRun.mutate({ runId })}
            disabled={finalizeRun.isPending || (variance?.flags?.length ?? 0) > 0}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Finalize Run
          </Button>
        )}
      </div>

      {/* Variance flags */}
      {(variance?.flags?.length ?? 0) > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-orange-700 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" /> Variance Flags — Resolve Before Finalizing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-muted-foreground border-b">
                  <th className="pb-1">Employee</th>
                  <th className="pb-1">Current Net</th>
                  <th className="pb-1">Prior Net</th>
                  <th className="pb-1">Variance %</th>
                </tr>
              </thead>
              <tbody>
                {variance!.flags.map(f => (
                  <tr key={f.employeeId} className="border-b last:border-0">
                    <td className="py-1.5 font-mono text-xs">{f.employeeId.slice(0, 12)}…</td>
                    <td className="py-1.5">MYR {parseFloat(f.currentNet).toLocaleString()}</td>
                    <td className="py-1.5">MYR {parseFloat(f.priorNet).toLocaleString()}</td>
                    <td className="py-1.5 font-semibold text-orange-700">{f.variancePct}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* Run metadata */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Status",      value: run.status },
          { label: "Employees",   value: Object.keys(byEmployee).length },
          { label: "Checksum",    value: run.checksum ? run.checksum.slice(0, 12) + "…" : "Pending" },
          { label: "Line Items",  value: run.lineItems?.length ?? 0 },
        ].map(({ label, value }) => (
          <Card key={label} className="p-4">
            <div className="text-xs text-muted-foreground">{label}</div>
            <div className="text-lg font-semibold mt-1">{value}</div>
          </Card>
        ))}
      </div>

      {/* Line items by employee */}
      <Card>
        <CardHeader><CardTitle className="text-base">Line Items</CardTitle></CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                {["Employee", "Component", "Amount (MYR)", "Currency", "Taxable"].map(h => (
                  <th key={h} className="text-left px-4 py-2 font-medium text-muted-foreground text-xs">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(run.lineItems ?? []).map(li => (
                <tr key={li.id} className="border-b hover:bg-muted/20">
                  <td className="px-4 py-2 font-mono text-xs">{li.employeeId.slice(0, 10)}…</td>
                  <td className="px-4 py-2">
                    <Badge variant="outline" className="text-xs">{li.componentType}</Badge>
                  </td>
                  <td className="px-4 py-2 font-mono">{parseFloat(li.amount.toString()).toFixed(2)}</td>
                  <td className="px-4 py-2 text-muted-foreground text-xs">{li.currency}</td>
                  <td className="px-4 py-2 text-xs">{li.isTaxable ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
