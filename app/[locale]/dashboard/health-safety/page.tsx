"use client";
/**
 * Health & Safety Dashboard — Sprint 22
 * Incident reporting, OSHA tracking, status management.
 * Requirements: 22.1–22.6
 */
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShieldAlert, Plus, AlertTriangle } from "lucide-react";

const INJURY_TYPES = ["MINOR", "MAJOR", "FATAL", "NEAR_MISS", "PROPERTY_DAMAGE"] as const;
const STATUS_BADGE: Record<string, string> = {
  OPEN:          "bg-red-100 text-red-800",
  INVESTIGATING: "bg-yellow-100 text-yellow-800",
  CLOSED:        "bg-green-100 text-green-800",
};
const INJURY_BADGE: Record<string, string> = {
  FATAL:          "bg-red-600 text-white",
  MAJOR:          "bg-red-100 text-red-800",
  MINOR:          "bg-yellow-100 text-yellow-800",
  NEAR_MISS:      "bg-orange-100 text-orange-800",
  PROPERTY_DAMAGE:"bg-blue-100 text-blue-800",
};

export default function HealthSafetyPage() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    location: "", description: "", injuryType: "" as typeof INJURY_TYPES[number] | "",
    incidentDate: new Date().toISOString().slice(0, 10), oshaReportable: false,
  });

  const { data: summary }   = trpc.healthSafety.getSummary.useQuery({});
  const { data: incidents, refetch } = trpc.healthSafety.listIncidents.useQuery({ take: 50 });
  const report       = trpc.healthSafety.reportIncident.useMutation({ onSuccess: () => { refetch(); setShowForm(false); } });
  const updateStatus = trpc.healthSafety.updateStatus.useMutation({ onSuccess: () => refetch() });

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Health &amp; Safety</h1>
            <p className="text-sm text-muted-foreground">Incident reports · OSHA compliance · Investigation tracking</p>
          </div>
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Open",          value: summary.open,          color: "text-red-600" },
            { label: "Investigating", value: summary.investigating,  color: "text-yellow-600" },
            { label: "Closed",        value: summary.closed,         color: "text-green-600" },
            { label: "OSHA Reportable", value: summary.oshaReportable, color: "text-orange-600" },
          ].map(({ label, value, color }) => (
            <Card key={label} className="p-4">
              <div className={`text-2xl font-bold ${color}`}>{value}</div>
              <div className="text-xs text-muted-foreground">{label}</div>
            </Card>
          ))}
        </div>
      )}

      {showForm && (
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-orange-500" /> Report New Incident</CardTitle></CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            <Input type="date" value={form.incidentDate} onChange={e => setForm(f => ({ ...f, incidentDate: e.target.value }))} />
            <Input placeholder="Location" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
            <Select value={form.injuryType} onValueChange={v => setForm(f => ({ ...f, injuryType: v as any }))}>
              <SelectTrigger><SelectValue placeholder="Injury type" /></SelectTrigger>
              <SelectContent>{INJURY_TYPES.map(t => <SelectItem key={t} value={t}>{t.replace(/_/g, " ")}</SelectItem>)}</SelectContent>
            </Select>
            <div className="sm:col-span-2 md:col-span-3">
              <Input placeholder="Describe the incident (min 10 characters)" value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="osha" checked={form.oshaReportable}
                onChange={e => setForm(f => ({ ...f, oshaReportable: e.target.checked }))} />
              <label htmlFor="osha" className="text-sm">OSHA Reportable</label>
            </div>
            <div className="sm:col-span-2 flex gap-2">
              <Button onClick={() => report.mutate({
                location: form.location, description: form.description, injuryType: form.injuryType as any || undefined,
                incidentDate: new Date(form.incidentDate), oshaReportable: form.oshaReportable,
              })} disabled={form.description.length < 10 || !form.location || report.isPending}>
                {report.isPending ? "Submitting…" : "Submit Report"}
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle className="text-base">Incident Register</CardTitle></CardHeader>
        <CardContent>
          {!incidents?.length ? (
            <p className="text-sm text-muted-foreground text-center py-6">No incidents reported</p>
          ) : (
            <div className="space-y-3">
              {incidents.map((inc: { id: string; status: string; injuryType?: string; oshaReportable?: boolean; description: string; location?: string; incidentDate: string | Date }) => (
                <div key={inc.id} className="border rounded-lg p-3">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={STATUS_BADGE[inc.status]}>{inc.status}</Badge>
                        {inc.injuryType && <Badge className={INJURY_BADGE[inc.injuryType] ?? ""}>{inc.injuryType.replace(/_/g, " ")}</Badge>}
                        {inc.oshaReportable && <Badge className="bg-orange-500 text-white text-xs">OSHA</Badge>}
                      </div>
                      <p className="text-sm mt-1">{inc.description.slice(0, 120)}{inc.description.length > 120 && "…"}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{inc.location} · {new Date(inc.incidentDate).toLocaleDateString()}</p>
                    </div>
                    {inc.status !== "CLOSED" && (
                      <div className="flex gap-1">
                        {inc.status === "OPEN" && (
                          <Button size="sm" variant="outline" onClick={() => updateStatus.mutate({ id: inc.id, status: "INVESTIGATING" })}>
                            Investigate
                          </Button>
                        )}
                        <Button size="sm" variant="outline" className="text-green-700" onClick={() => updateStatus.mutate({ id: inc.id, status: "CLOSED" })}>
                          Close
                        </Button>
                      </div>
                    )}
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
