"use client";
/**
 * Succession Planning Dashboard — Sprint 14
 * 9-Box Grid, critical roles, readiness assessment.
 * Requirements: 14.1–14.6
 */
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Star } from "lucide-react";

const READINESS_COLORS: Record<string, string> = {
  READY_NOW:    "bg-green-100 text-green-800 border-green-300",
  READY_IN_1Y:  "bg-yellow-100 text-yellow-800 border-yellow-300",
  READY_IN_3Y:  "bg-orange-100 text-orange-800 border-orange-300",
};

// 9-Box cell labels: x=performance (1–3), y=potential (1–3)
const NINE_BOX_LABELS: Record<string, string> = {
  "1,1": "Risk",       "2,1": "Core",       "3,1": "Specialist",
  "1,2": "Developing", "2,2": "Core+",      "3,2": "High Performer",
  "1,3": "Enigma",     "2,3": "High Potential", "3,3": "Star",
};

type SuccessionPlan = {
  id: string;
  positionId?: string;
  criticalRole?: boolean;
  candidates?: Array<{ id: string; employeeId: string; readiness: string }>;
};

type NineBoxEntry = {
  employeeId: string;
  x: number;
  y: number;
  readiness: string;
};

export default function SuccessionPage() {
  const { data: plans }   = trpc.succession.listPlans.useQuery({});
  const { data: nineBox } = trpc.succession.getNineBoxGrid.useQuery({});

  const criticalCount = plans?.filter((p: SuccessionPlan) => p.criticalRole).length ?? 0;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-2">
        <Target className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Succession Planning</h1>
          <p className="text-sm text-muted-foreground">9-Box Grid · Critical Roles · Readiness Pipeline</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="text-2xl font-bold">{plans?.length ?? 0}</div>
          <div className="text-xs text-muted-foreground">Total Plans</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-red-600">{criticalCount}</div>
          <div className="text-xs text-muted-foreground">Critical Roles</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-green-600">
            {plans?.reduce((s: number, p: SuccessionPlan) => s + (p.candidates?.filter((c) => c.readiness === "READY_NOW").length ?? 0), 0)}
          </div>
          <div className="text-xs text-muted-foreground">Ready Now</div>
        </Card>
      </div>

      {/* 9-Box Grid */}
      {nineBox && nineBox.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Star className="h-4 w-4" /> 9-Box Grid</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-1 text-xs">
              {[3, 2, 1].map(y => [1, 2, 3].map(x => {
                const label = NINE_BOX_LABELS[`${x},${y}`] ?? `${x},${y}`;
                const inCell = nineBox.filter((c: NineBoxEntry) => c.x === x && c.y === y);
                const isHighlight = x === 3 && y === 3;
                return (
                  <div key={`${x},${y}`}
                    className={`border rounded p-2 min-h-16 ${isHighlight ? "bg-green-50 border-green-300" : "bg-muted/30"}`}
                  >
                    <div className="font-semibold text-muted-foreground mb-1">{label}</div>
                    {inCell.map((c: NineBoxEntry) => (
                      <div key={c.employeeId} className="text-xs truncate text-slate-700">
                        {c.employeeId.slice(0, 8)}…
                        <Badge variant="outline" className="ml-1 text-[9px]">{c.readiness.replace("READY_", "")}</Badge>
                      </div>
                    ))}
                  </div>
                );
              }))}
            </div>
            <div className="mt-2 flex gap-2 text-xs text-muted-foreground">
              <span>← Performance (1–3) →</span>
              <span className="ml-auto">↑ Potential (1–3) ↑</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plans list */}
      <Card>
        <CardHeader><CardTitle className="text-base">Succession Plans</CardTitle></CardHeader>
        <CardContent>
          {!plans?.length ? (
            <p className="text-sm text-muted-foreground text-center py-6">No succession plans yet</p>
          ) : (
            <div className="space-y-3">
              {plans.map((plan: SuccessionPlan) => (
                <div key={plan.id} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">Position: {(plan as any).positionId.slice(0, 12)}…</span>
                      {plan.criticalRole && <Badge className="bg-red-100 text-red-800 border-red-200">Critical</Badge>}
                    </div>
                    <span className="text-xs text-muted-foreground">{plan.candidates?.length ?? 0} candidate(s)</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {plan.candidates?.map((c: { id: string; employeeId: string; readiness: string }) => (
                      <div key={c.id} className={`text-xs border rounded px-2 py-1 ${READINESS_COLORS[c.readiness] ?? ""}`}>
                        {c.employeeId.slice(0, 8)}… · {c.readiness.replace("READY_", "")}
                      </div>
                    ))}
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
