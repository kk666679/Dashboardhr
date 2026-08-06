"use client";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Calendar, CheckSquare, TrendingDown, TrendingUp, Loader2, Zap, Brain, Lightbulb, Heart, GraduationCap, Target } from "lucide-react";
import Link from "next/link";

export default function MssDashboardPage() {
  const { data: headcount, isLoading: isLoadingHeadcount } = trpc.analytics.getHeadcountSummary.useQuery({}, { enabled: true });
  const { data: turnover, isLoading: isLoadingTurnover } = trpc.analytics.getTurnoverRate.useQuery({ months: 12 }, { enabled: true });
  const { data: attendance, isLoading: isLoadingAttendance } = trpc.attendance.getDailySummary.useQuery({ date: new Date() }, { enabled: true });
  const { data: activeWorkflows, isLoading: isLoadingWorkflows } = trpc.workflowEngine.getActiveWorkflows.useQuery({}, { enabled: true });

  const isLoading = isLoadingHeadcount || isLoadingTurnover || isLoadingAttendance || isLoadingWorkflows;
  const pendingApprovals = activeWorkflows?.filter((w: any) => w.status === "ACTIVE").length ?? 0;

  const attendanceData = {
    present: attendance?.present ?? 0,
    absent: attendance?.absent ?? 0,
    late: attendance?.late ?? 0,
    onLeave: attendance?.onLeave ?? 0,
    overtime: attendance?.overtime ?? 0,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manager Self-Service</h1>
          <p className="text-sm text-muted-foreground mt-0.5">2026 Workforce Command Center · {new Date().toLocaleDateString("en-MY", { weekday: "long", day: "numeric", month: "long" })}</p>
        </div>
        <Link href="/mss/command-center">
          <Button size="sm" className="bg-violet-600 hover:bg-violet-700 text-xs">
            <Zap className="h-3.5 w-3.5 mr-1.5" /> Command Center
          </Button>
        </Link>
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
          <div className="text-2xl font-bold">{attendanceData.present}</div>
          <div className="text-xs text-muted-foreground">
            {attendanceData.late ? `${attendanceData.late} late` : "on time"}
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
          <div className="text-xs text-muted-foreground">{turnover?.separations ?? 0} separations</div>
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
            {activeWorkflows?.slice(0, 5).map((wf: any) => (
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
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Today's Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { label: "Present", value: attendanceData.present, color: "text-green-600" },
              { label: "Absent", value: attendanceData.absent, color: "text-red-600" },
              { label: "Late", value: attendanceData.late, color: "text-yellow-600" },
              { label: "On Leave", value: attendanceData.onLeave, color: "text-blue-600" },
              { label: "Overtime", value: attendanceData.overtime, color: "text-purple-600" },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-muted/40 rounded-lg p-2">
                <div className={`text-xl font-bold ${color}`}>{value}</div>
                <div className="text-xs text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick links — 2026 expanded */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Quick Access</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { href: "/mss/command-center", label: "Command Center", icon: Zap, color: "text-violet-600", badge: "AI" },
            { href: "/mss/ai-assistant", label: "AI Assistant", icon: Brain, color: "text-indigo-600", badge: "New" },
            { href: "/mss/team", label: "My Team", icon: Users, color: "text-blue-600" },
            { href: "/mss/approvals", label: "Approvals", icon: CheckSquare, color: "text-orange-600" },
            { href: "/mss/workforce-planning", label: "Workforce Planning", icon: Lightbulb, color: "text-amber-600" },
            { href: "/mss/analytics", label: "Analytics", icon: TrendingUp, color: "text-emerald-600" },
            { href: "/mss/experience", label: "Experience", icon: Heart, color: "text-rose-600" },
            { href: "/mss/talent", label: "Talent & Growth", icon: GraduationCap, color: "text-teal-600" },
            { href: "/mss/feedback", label: "Feedback", icon: Target, color: "text-cyan-600" },
            { href: "/mss/attendance", label: "Attendance", icon: Calendar, color: "text-green-600" },
          ].map(({ href, label, icon: Icon, color, badge }) => (
            <Link key={href} href={href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full p-3 flex items-center gap-2.5">
                <Icon className={`h-4 w-4 flex-shrink-0 ${color}`} />
                <span className="text-sm font-medium flex-1">{label}</span>
                {badge && <Badge className="text-[9px] h-4 px-1 bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300 border-0">{badge}</Badge>}
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
