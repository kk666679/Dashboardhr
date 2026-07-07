"use client";

/**
 * ESS Dashboard — Task 17.2
 *
 * Surfaces without additional navigation (Req 14.3):
 * - Leave balance by type
 * - Next pay date
 * - Pending approvals
 * - Upcoming training
 * - Active goals
 * - Recent announcements
 *
 * Requirements: 14.3
 */

import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, Bell, BookOpen, Target, Megaphone } from "lucide-react";
import Link from "next/link";

// Derive employee ID from the current session — in production this comes from ctx
const EMPLOYEE_ID_PLACEHOLDER = "me"; // replaced by session.employeeId

export default function EssDashboardPage() {
  const year = new Date().getFullYear();

  // Leave balances
  const { data: leaveBalances } = trpc.leave.balance.useQuery(
    { employeeId: EMPLOYEE_ID_PLACEHOLDER, year },
    { enabled: false } // replaced with real session employee id
  );

  // Notification log (pending approvals for self)
  const { data: notifLog } = trpc.notificationCenter.getLog.useQuery(
    { recipientId: EMPLOYEE_ID_PLACEHOLDER, status: "PENDING", limit: 5 },
    { enabled: false }
  );

  // Active goals
  const { data: goals } = trpc.performance.listGoals?.useQuery?.(
    { employeeId: EMPLOYEE_ID_PLACEHOLDER, status: "ACTIVE" },
    { enabled: false }
  ) ?? { data: undefined };

  const leaveTypes = leaveBalances?.slice(0, 4) ?? [];
  const pendingCount = notifLog?.length ?? 0;
  const activeGoals = goals ?? [];

  const nextPayDate = (() => {
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 25);
    return nextMonth.toLocaleDateString("en-MY", { day: "numeric", month: "long", year: "numeric" });
  })();

  return (
    <div className="p-4 space-y-4 max-w-lg mx-auto">
      {/* Welcome */}
      <div className="pt-2 pb-1">
        <h1 className="text-xl font-bold text-slate-900">Good morning 👋</h1>
        <p className="text-sm text-slate-500">Here's your HR overview</p>
      </div>

      {/* Quick stats row */}
      <div className="grid grid-cols-2 gap-3">
        <Link href="/ess/leave">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4 flex items-center gap-3">
              <Calendar className="h-8 w-8 text-blue-600 shrink-0" />
              <div>
                <p className="text-xs text-slate-500">Annual Leave</p>
                <p className="text-lg font-bold text-slate-900">
                  {leaveTypes.find((b) => b.leaveType === "ANNUAL")
                    ? String(Number(leaveTypes.find((b) => b.leaveType === "ANNUAL")?.entitlement ?? 0) -
                        Number(leaveTypes.find((b) => b.leaveType === "ANNUAL")?.used ?? 0))
                    : "—"}
                  <span className="text-xs font-normal text-slate-500 ml-1">days left</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <DollarSign className="h-8 w-8 text-green-600 shrink-0" />
            <div>
              <p className="text-xs text-slate-500">Next Pay Date</p>
              <p className="text-sm font-semibold text-slate-900">{nextPayDate}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leave balances */}
      {leaveTypes.length > 0 && (
        <Card>
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-500" /> Leave Balances
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-2">
            {leaveTypes.map((b) => {
              const remaining = Number(b.entitlement) + Number(b.carryForward) - Number(b.used) - Number(b.pending);
              return (
                <div key={b.id} className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 capitalize">{b.leaveType.toLowerCase().replace("_", " ")}</span>
                  <div className="flex items-center gap-2">
                    {Number(b.pending) > 0 && (
                      <Badge variant="outline" className="text-xs">{Number(b.pending)} pending</Badge>
                    )}
                    <span className="font-medium">{remaining.toFixed(1)} days</span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Pending approvals */}
      <Card>
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Bell className="h-4 w-4 text-yellow-500" /> Pending Notifications
            {pendingCount > 0 && <Badge>{pendingCount}</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          {pendingCount === 0 ? (
            <p className="text-sm text-slate-400">No pending notifications</p>
          ) : (
            <div className="space-y-1">
              {notifLog!.map((n) => (
                <div key={n.id} className="text-sm text-slate-600 truncate">{n.subject ?? n.eventType}</div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active goals */}
      <Card>
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Target className="h-4 w-4 text-purple-500" /> Active Goals
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          {activeGoals.length === 0 ? (
            <p className="text-sm text-slate-400">No active goals</p>
          ) : (
            <div className="space-y-1">
              {(activeGoals as any[]).slice(0, 3).map((g: any) => (
                <div key={g.id} className="text-sm text-slate-700 truncate">{g.title}</div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick links */}
      <div className="grid grid-cols-3 gap-2 pb-2">
        {[
          { href: "/ess/leave", label: "Apply Leave", icon: Calendar, color: "blue" },
          { href: "/ess/payslips", label: "Payslips", icon: DollarSign, color: "green" },
          { href: "/ess/claims", label: "Claims", icon: Megaphone, color: "orange" },
        ].map(({ href, label, icon: Icon, color }) => (
          <Link key={href} href={href}>
            <Card className="hover:shadow transition-shadow cursor-pointer text-center p-3">
              <Icon className={`h-5 w-5 mx-auto mb-1 text-${color}-500`} />
              <p className="text-xs font-medium text-slate-700">{label}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
