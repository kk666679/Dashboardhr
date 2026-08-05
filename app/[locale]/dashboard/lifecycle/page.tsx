"use client";
/**
 * Lifecycle Events Dashboard — Sprint 5
 * View and create employee lifecycle events (hire, promotion, transfer, etc.)
 * Requirements: 5.1–5.9
 */
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { UserCheck, ArrowUpRight, ArrowDownRight, RefreshCw, Plus } from "lucide-react";

const EVENT_TYPES = [
  "HIRE", "PROBATION_START", "PROBATION_PASS", "PROBATION_FAIL",
  "PROMOTION", "DEMOTION", "TRANSFER", "CONFIRMATION",
  "SALARY_REVISION", "RESIGNATION", "TERMINATION", "RETIREMENT", "REHIRE",
];

const EVENT_ICONS: Record<string, React.ReactNode> = {
  PROMOTION:       <ArrowUpRight className="h-4 w-4 text-green-600" />,
  DEMOTION:        <ArrowDownRight className="h-4 w-4 text-red-600" />,
  TRANSFER:        <RefreshCw className="h-4 w-4 text-blue-600" />,
  HIRE:            <UserCheck className="h-4 w-4 text-emerald-600" />,
  PROBATION_PASS:  <UserCheck className="h-4 w-4 text-green-500" />,
};

const EVENT_COLORS: Record<string, string> = {
  HIRE:            "bg-emerald-100 text-emerald-800",
  PROBATION_PASS:  "bg-green-100 text-green-800",
  PROBATION_FAIL:  "bg-red-100 text-red-800",
  PROMOTION:       "bg-blue-100 text-blue-800",
  DEMOTION:        "bg-orange-100 text-orange-800",
  TRANSFER:        "bg-purple-100 text-purple-800",
  TERMINATION:     "bg-red-100 text-red-800",
  RESIGNATION:     "bg-rose-100 text-rose-800",
  RETIREMENT:      "bg-slate-100 text-slate-800",
};

export default function LifecyclePage() {
  const [employeeId, setEmployeeId] = useState("");
  const [showForm, setShowForm]     = useState(false);
  const [form, setForm] = useState({
    employeeId:    "",
    eventType:     "HIRE",
    effectiveDate: new Date().toISOString().slice(0, 10),
    reason:        "",
  });

  const { data: events, refetch } = trpc.lifecycle.list.useQuery({
    employeeId: employeeId || undefined,
    take: 50,
  });

  const createEvent = trpc.lifecycle.create.useMutation({
    onSuccess: () => { refetch(); setShowForm(false); },
  });

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Lifecycle Events</h1>
          <p className="text-sm text-muted-foreground">Track employment history: hire, promotions, transfers &amp; exits</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" /> Record Event
        </Button>
      </div>

      {/* Create form */}
      {showForm && (
        <Card>
          <CardHeader><CardTitle className="text-base">Record Lifecycle Event</CardTitle></CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
            <Input placeholder="Employee ID" value={form.employeeId}
              onChange={e => setForm(f => ({ ...f, employeeId: e.target.value }))} />
            <Select value={form.eventType} onValueChange={v => setForm(f => ({ ...f, eventType: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {EVENT_TYPES.map(t => <SelectItem key={t} value={t}>{t.replace(/_/g, " ")}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input type="date" value={form.effectiveDate}
              onChange={e => setForm(f => ({ ...f, effectiveDate: e.target.value }))} />
            <Input placeholder="Reason (optional)" value={form.reason}
              onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} />
            <div className="sm:col-span-2 md:col-span-4 flex gap-2">
              <Button
                onClick={() => createEvent.mutate({
                  employeeId:    form.employeeId,
                  eventType:     form.eventType as any,
                  effectiveDate: new Date(form.effectiveDate),
                  reason:        form.reason || undefined,
                })}
                disabled={!form.employeeId || createEvent.isPending}
              >
                {createEvent.isPending ? "Saving…" : "Save Event"}
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filter */}
      <div className="flex gap-3 flex-wrap">
        <Input
          placeholder="Filter by Employee ID…"
          value={employeeId}
          onChange={e => setEmployeeId(e.target.value)}
          className="max-w-xs"
        />
        <Button variant="outline" onClick={() => setEmployeeId("")}>Clear</Button>
      </div>

      {/* Events list */}
      <Card>
        <CardContent className="pt-4">
          {!events?.length ? (
            <p className="text-sm text-muted-foreground text-center py-8">No lifecycle events found</p>
          ) : (
            <div className="space-y-2">
              {events.map((evt: any) => (
                <div key={evt.id} className="flex items-start gap-3 border-b pb-3 last:border-0">
                  <div className="mt-0.5">{EVENT_ICONS[evt.eventType] ?? <UserCheck className="h-4 w-4 text-slate-400" />}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={EVENT_COLORS[evt.eventType] ?? "bg-slate-100 text-slate-700"}>
                        {evt.eventType.replace(/_/g, " ")}
                      </Badge>
                      <span className="text-sm font-medium truncate">Employee: {evt.employeeId.slice(0, 12)}…</span>
                    </div>
                    {evt.reason && <p className="text-sm text-muted-foreground mt-0.5">{evt.reason}</p>}
                  </div>
                  <div className="text-xs text-muted-foreground shrink-0">
                    {new Date(evt.effectiveDate).toLocaleDateString()}
                    {evt.isBackdated && <Badge variant="outline" className="ml-2 text-xs">Backdated</Badge>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
