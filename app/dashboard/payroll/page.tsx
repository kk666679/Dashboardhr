"use client";
/**
 * Payroll Run List page — Task 8.5
 * Requirements: 8.6
 */
import { useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Plus, Eye, AlertTriangle } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  DRAFT:          "bg-gray-100 text-gray-700",
  LOCKED:         "bg-blue-100 text-blue-700",
  CALCULATING:    "bg-yellow-100 text-yellow-700",
  PENDING_REVIEW: "bg-orange-100 text-orange-700",
  FINALIZED:      "bg-green-100 text-green-700",
  CANCELLED:      "bg-red-100 text-red-700",
};

export default function PayrollPage() {
  const router = useRouter();
  const [legalEntityId, setLegalEntityId] = useState("");
  const { data: runs, isLoading } = trpc.payrollHcm.listRuns.useQuery({ legalEntityId: legalEntityId || undefined });
  const initiateRun = trpc.payrollHcm.initiateRun.useMutation();

  const [showForm, setShowForm] = useState(false);
  const [periodStart, setPeriodStart] = useState("");
  const [periodEnd, setPeriodEnd]     = useState("");
  const [entity, setEntity]           = useState("");
  const [initiating, setInitiating]   = useState(false);

  async function handleInitiate() {
    if (!periodStart || !periodEnd || !entity) return;
    setInitiating(true);
    try {
      const run = await initiateRun.mutateAsync({
        legalEntityId: entity,
        periodStart: new Date(periodStart),
        periodEnd:   new Date(periodEnd),
      });
      router.push(`/dashboard/payroll/${run.id}`);
    } finally {
      setInitiating(false);
      setShowForm(false);
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DollarSign className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Payroll Runs</h1>
            <p className="text-sm text-muted-foreground">Multi-entity payroll management</p>
          </div>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" /> Initiate Run
        </Button>
      </div>

      {showForm && (
        <Card className="border-primary/30">
          <CardHeader><CardTitle className="text-base">New Payroll Run</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Legal Entity ID</label>
                <input className="mt-1 w-full border rounded px-2 py-1.5 text-sm" value={entity} onChange={e => setEntity(e.target.value)} placeholder="legal-entity-id" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Period Start</label>
                <input type="date" className="mt-1 w-full border rounded px-2 py-1.5 text-sm" value={periodStart} onChange={e => setPeriodStart(e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Period End</label>
                <input type="date" className="mt-1 w-full border rounded px-2 py-1.5 text-sm" value={periodEnd} onChange={e => setPeriodEnd(e.target.value)} />
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleInitiate} disabled={initiating}>{initiating ? "Initiating…" : "Start Run"}</Button>
              <Button size="sm" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Loading runs…</div>
          ) : !runs?.length ? (
            <div className="p-8 text-center text-muted-foreground">No payroll runs yet. Click "Initiate Run" to start.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  {["Legal Entity", "Period", "Status", "Checksum", "Created", ""].map(h => (
                    <th key={h} className="text-left px-4 py-2.5 font-medium text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {runs.map(run => (
                  <tr key={run.id} className="border-b hover:bg-muted/30">
                    <td className="px-4 py-2.5 font-mono text-xs">{run.legalEntityId.slice(0, 12)}…</td>
                    <td className="px-4 py-2.5 text-xs">{new Date(run.periodStart).toLocaleDateString()} – {new Date(run.periodEnd).toLocaleDateString()}</td>
                    <td className="px-4 py-2.5">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[run.status] ?? "bg-gray-100"}`}>{run.status}</span>
                    </td>
                    <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{run.checksum ? run.checksum.slice(0, 8) + "…" : "—"}</td>
                    <td className="px-4 py-2.5 text-xs">{new Date(run.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-2.5">
                      <Button size="sm" variant="ghost" onClick={() => router.push(`/dashboard/payroll/${run.id}`)}>
                        <Eye className="h-3.5 w-3.5 mr-1" /> View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
