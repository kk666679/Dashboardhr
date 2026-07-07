"use client";
/**
 * MSS Dashboard — Sprint 18
 * Team summary: headcount, attendance, pending approvals, attrition risks.
 * Requirements: 15.2, 15.3
 */
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Calendar, AlertTriangle, CheckSquare, TrendingDown, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function MssDashboardPage() {
  const { data: headcount } = trpc.analytics.getHeadcountSummary.useQuery({});
  const { data: turnover }  = trpc.analytics.getTurnoverRate.useQuery({ months: 12 });
  const { data: attendance } = trpc.attendance.getDailySummary.useQuery({ date: new Date() });
  const { data: activeWorkflows } = trpc.workflowEngine.getActiveWorkflows.useQuery({});

  const pendingApprovals = activeWorkflows?.filter(w => w.status === "ACTIVE").length ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Manager Dashboard</h1>
        <p className="text-sm text-muted-foreground">Your team overview for today</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-blue-600" />
            <span className="text-xs text-muted-foreground">Team Size</span>
          </div>
          <div className="text-2xl font-bold">{headcount?.active ?? "—"}</div>
          <div className="text-xs text-muted-foreground">active employees</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-green-600" />
            <span className="text-xs text-muted-foreground">Present Today</span>
          </div>
          <div className="text-2xl font-bold">{attendance?.present ?? "—"}</div>
          <div className="text-xs text-muted-foreground">
            {attendance?.late ? `${attendance.late} late` : "on time"}
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckSquare className="h-4 w-4 text-orange-600" />
            <span className="text-xs text-muted-foreground">Pending Actions</span>
          </div>
          <div className="text-2xl font-bold text-orange-600">{pendingApprovals}</div>
          <div className="text-xs text-muted-foreground">require approval</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="h-4 w-4 text-red-600" />
            <span className="text-xs text-muted-foreground">Turnover (12M)</span>
          </div>
          <div className="text-2xl font-bold">{turnover?.turnoverRatePct ?? "—"}%</div>
          <div className="text-xs text-muted-foreground">{turnover?.separations} separations</div>
        </Card>
      </div>

      {/* Pending approvals */}
      {pendingApprovals > 0 && (
        <Card className="border-orange-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <CheckSquare className="h-4 w-4 text-orange-600" /> Pending Approvals
              <Badge className="ml-auto bg-orange-500 text-white">{pendingApprovals}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {activeWorkflows?.slice(0, 5).map(wf => (
              <div key={wf.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                <div>
                  <div className="text-sm font-medium">{wf.entityType}</div>
                  <div className="text-xs text-muted-foreground font-mono">{wf.entityId.slice(0, 12)}…</div>
                </div>
                <Link href="/mss/approvals">
                  <Button size="sm" variant="outline">Review</Button>
                </Link>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Today's attendance */}
      {attendance && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Today's Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { label: "Present", value: attendance.present, color: "text-green-600" },
                { label: "Absent",  value: attendance.absent,  color: "text-red-600" },
                { label: "Late",    value: attendance.late,    color: "text-yellow-600" },
                { label: "On Leave",value: attendance.onLeave, color: "text-blue-600" },
                { label: "Overtime",value: attendance.overtime,color: "text-purple-600" },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-muted/40 rounded-lg p-2">
                  <div className={`text-xl font-bold ${color}`}>{value}</div>
                  <div className="text-xs text-muted-foreground">{label}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { href: "/mss/team",        label: "View Team",         icon: Users },
          { href: "/mss/performance", label: "Performance",       icon: TrendingUp },
          { href: "/dashboard/payroll", label: "Payroll",         icon: CheckSquare },
          { href: "/mss/incidents",   label: "Report Incident",   icon: AlertTriangle },
        ].map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full p-3 flex items-center gap-3">
              <Icon className="h-5 w-5 text-primary flex-shrink-0" />
              <span className="text-sm font-medium">{label}</span>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
