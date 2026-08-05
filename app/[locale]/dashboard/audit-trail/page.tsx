"use client";
/**
 * Audit Trail Dashboard
 * Immutable, append-only audit trail viewer with filtering.
 * Property 5: Audit Trail Completeness
 * Requirements: 1.7, 2.4, 20.1
 */
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { History, Download } from "lucide-react";

const ACTION_BADGE: Record<string, string> = {
  CREATE: "bg-green-100 text-green-800",
  UPDATE: "bg-blue-100 text-blue-800",
  DELETE: "bg-red-100 text-red-800",
  READ:   "bg-slate-100 text-slate-700",
};

const MODULES = ["", "payroll", "leave", "lifecycle", "workflow", "onboarding", "attendance", "compliance", "security", "org", "benefits", "compensation"];

export default function AuditTrailPage() {
  const [filters, setFilters] = useState({
    entityType: "", actorId: "", module: "", action: "" as "" | "CREATE" | "UPDATE" | "DELETE" | "READ",
    from: "", to: "", take: 100, skip: 0,
  });

  const { data, refetch } = trpc.auditTrail.list.useQuery({
    entityType: filters.entityType || undefined,
    actorId:    filters.actorId    || undefined,
    module:     filters.module     || undefined,
    action:     filters.action     || undefined,
    from:       filters.from ? new Date(filters.from) : undefined,
    to:         filters.to   ? new Date(filters.to)   : undefined,
    take:       filters.take,
    skip:       filters.skip,
  });

  const { data: summary } = trpc.auditTrail.getSummary.useQuery({ days: 30 });

  const setFilter = (key: keyof typeof filters, value: unknown) =>
    setFilters(f => ({ ...f, [key]: value, skip: 0 }));

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <History className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Audit Trail</h1>
            <p className="text-sm text-muted-foreground">Immutable record of all data changes — read-only</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <Download className="h-4 w-4 mr-2" /> Refresh
        </Button>
      </div>

      {/* Summary by action */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <Card className="p-3">
            <div className="text-xl font-bold">{summary.total}</div>
            <div className="text-xs text-muted-foreground">Events (30d)</div>
          </Card>
          {summary.byAction.map((a: { action: string; count: number }) => (
            <Card key={a.action} className="p-3">
              <div className="text-xl font-bold">{a.count}</div>
              <div className="text-xs text-muted-foreground">{a.action}</div>
            </Card>
          ))}
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="pt-4 grid gap-2 sm:grid-cols-3 md:grid-cols-6">
          <Input placeholder="Entity type" value={filters.entityType} onChange={e => setFilter("entityType", e.target.value)} />
          <Input placeholder="Actor ID" value={filters.actorId} onChange={e => setFilter("actorId", e.target.value)} />
          <Select value={filters.module} onValueChange={v => setFilter("module", v)}>
            <SelectTrigger><SelectValue placeholder="Module" /></SelectTrigger>
            <SelectContent>{MODULES.map(m => <SelectItem key={m || "_all"} value={m}>{m || "All modules"}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={filters.action} onValueChange={v => setFilter("action", v as any)}>
            <SelectTrigger><SelectValue placeholder="Action" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">All</SelectItem>
              {["CREATE","UPDATE","DELETE","READ"].map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
            </SelectContent>
          </Select>
          <Input type="date" value={filters.from} onChange={e => setFilter("from", e.target.value)} />
          <Input type="date" value={filters.to}   onChange={e => setFilter("to",   e.target.value)} />
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Audit Records {data && <span className="text-muted-foreground font-normal text-sm ml-2">({data.total} total)</span>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!data?.records.length ? (
            <p className="text-sm text-muted-foreground text-center py-6">No audit records match your filters</p>
          ) : (
            <>
              <div className="space-y-1">
                {data.records.map((record: any) => (
                  <div key={record.id} className="flex items-start gap-3 border-b pb-2 last:border-0 text-sm">
                    <Badge className={`${ACTION_BADGE[record.action]} shrink-0 text-xs mt-0.5`}>{record.action}</Badge>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium">{record.entityType}</span>
                        <span className="font-mono text-xs text-muted-foreground">{record.entityId.slice(0, 12)}…</span>
                        {(record as any).module && <Badge variant="outline" className="text-xs">{(record as any).module}</Badge>}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Actor: {record.actorId?.slice(0, 12) ?? "system"} · Role: {(record as any).actorRole ?? "—"}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground shrink-0">
                      {new Date(record.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
              {/* Pagination */}
              <div className="flex items-center justify-between pt-3">
                <Button variant="outline" size="sm" disabled={filters.skip === 0}
                  onClick={() => setFilter("skip", Math.max(0, filters.skip - filters.take))}>
                  ← Previous
                </Button>
                <span className="text-xs text-muted-foreground">
                  {filters.skip + 1}–{Math.min(filters.skip + filters.take, data.total)} of {data.total}
                </span>
                <Button variant="outline" size="sm" disabled={filters.skip + filters.take >= data.total}
                  onClick={() => setFilter("skip", filters.skip + filters.take)}>
                  Next →
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
