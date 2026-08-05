"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow, TableEmpty,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { PageShell, PageHeader } from "@/components/layout/page-shell";
import { DollarSign, Plus, Eye } from "lucide-react";

/* ── Status → badge variant map ── */
const STATUS_VARIANT: Record<string, "default" | "info" | "warning" | "success" | "destructive" | "secondary"> = {
  DRAFT:          "secondary",
  LOCKED:         "info",
  CALCULATING:    "warning",
  PENDING_REVIEW: "warning",
  FINALIZED:      "success",
  CANCELLED:      "destructive",
};

export default function PayrollPage() {
  const router = useRouter();

  const [legalEntityId] = useState("");
  const { data: runs, isLoading } = trpc.payrollHcm.listRuns.useQuery({
    legalEntityId: legalEntityId || undefined,
  });
  const initiateRun = trpc.payrollHcm.initiateRun.useMutation();

  const [showForm, setShowForm] = useState(false);
  const [periodStart, setPeriodStart] = useState("");
  const [periodEnd,   setPeriodEnd]   = useState("");
  const [entity,      setEntity]      = useState("");
  const [initiating,  setInitiating]  = useState(false);

  async function handleInitiate() {
    if (!periodStart || !periodEnd || !entity) return;
    setInitiating(true);
    try {
      const run = await initiateRun.mutateAsync({
        legalEntityId: entity,
        periodStart:   new Date(periodStart),
        periodEnd:     new Date(periodEnd),
      });
      router.push(`/dashboard/payroll/${run.id}`);
    } finally {
      setInitiating(false);
      setShowForm(false);
    }
  }

  return (
    <PageShell>
      <PageHeader
        title="Payroll Runs"
        description="Multi-entity payroll management"
        actions={
          <Button onClick={() => setShowForm(true)} size="sm">
            <Plus className="size-3.5" />
            Initiate Run
          </Button>
        }
      />

      {/* New run form */}
      {showForm && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">New Payroll Run</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[var(--foreground-muted)]">
                  Legal Entity ID
                </label>
                <Input
                  value={entity}
                  onChange={(e) => setEntity(e.target.value)}
                  placeholder="legal-entity-id"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[var(--foreground-muted)]">
                  Period Start
                </label>
                <Input
                  type="date"
                  value={periodStart}
                  onChange={(e) => setPeriodStart(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[var(--foreground-muted)]">
                  Period End
                </label>
                <Input
                  type="date"
                  value={periodEnd}
                  onChange={(e) => setPeriodEnd(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleInitiate}
                loading={initiating}
                disabled={!periodStart || !periodEnd || !entity || initiating}
              >
                {initiating ? "Initiating…" : "Start Run"}
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Runs table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Legal Entity</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Checksum</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {!runs?.length ? (
                  <TableEmpty>
                    No payroll runs yet. Click "Initiate Run" to start.
                  </TableEmpty>
                ) : (
                  runs.map((run) => (
                    <TableRow key={run.id}>
                      <TableCell className="font-mono text-xs">
                        {run.legalEntityId.slice(0, 12)}…
                      </TableCell>
                      <TableCell className="text-xs">
                        {new Date(run.periodStart).toLocaleDateString()} –{" "}
                        {new Date(run.periodEnd).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={STATUS_VARIANT[run.status] ?? "secondary"} size="sm">
                          {run.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-[var(--foreground-muted)]">
                        {run.checksum ? `${run.checksum.slice(0, 8)}…` : "—"}
                      </TableCell>
                      <TableCell className="text-xs">
                        {new Date(run.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => router.push(`/dashboard/payroll/${run.id}`)}
                        >
                          <Eye className="size-3.5" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </PageShell>
  );
}
