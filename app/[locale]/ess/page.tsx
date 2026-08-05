"use client";

/**
 * ESS Dashboard
 *
 * Surfaces without additional navigation:
 * - Leave balance by type
 * - Next pay date
 * - Pending approvals
 * - Upcoming training
 * - Active goals
 */

import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, Bell, Target, Megaphone, Loader2 } from "lucide-react";
import Link from "next/link";
import { ESSDashboard } from "@/components/features/ess";

export default function EssDashboardPage() {
  const year = new Date().getFullYear();
  const today = new Date();

  // Fetch leave balances
  const { data: leaveBalances, isLoading: isLoadingLeave } = trpc.leave.balance.useQuery(
    { employeeId: "me", year },
    { enabled: true }
  );

  // Fetch notifications
  const { data: notifLog, isLoading: isLoadingNotif } = trpc.notifications.list.useQuery(
    { unreadOnly: false, limit: 5 },
    { enabled: true }
  );

  const isLoading = isLoadingLeave || isLoadingNotif;
  const leaveTypes = leaveBalances?.slice(0, 4) ?? [];
  const pendingCount = notifLog?.length ?? 0;

  const annualLeave = leaveTypes.find((b: any) => b.leaveType === "ANNUAL");
  const availableLeave = annualLeave ? Number(annualLeave.available) : 0;

  const nextPayDate = (() => {
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 25);
    return nextMonth.toLocaleDateString("en-MY", { day: "numeric", month: "long", year: "numeric" });
  })();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

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
                  {availableLeave}
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
            {leaveTypes.map((b: any) => {
              const remaining = Number(b.available);
              return (
                <div key={`${b.employeeId}-${b.leaveType}-${b.year}`} className="flex items-center justify-between text-sm">
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

      {/* Pending notifications */}
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
                <div key={n.id} className="text-sm text-slate-600 truncate">
                  {(n as any).subject ?? (n as any).eventType ?? (n as any).title}
                </div>
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
          <p className="text-sm text-slate-400">No active goals</p>
        </CardContent>
      </Card>

      {/* Quick links */}
      <div className="grid grid-cols-3 gap-2 pb-2">
        {[
          { href: "/ess/leave", label: "Apply Leave", icon: Calendar },
          { href: "/ess/payslips", label: "Payslips", icon: DollarSign },
          { href: "/ess/claims", label: "Claims", icon: Megaphone },
        ].map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href}>
            <Card className="hover:shadow transition-shadow cursor-pointer text-center p-3">
              <Icon className="h-5 w-5 mx-auto mb-1 text-blue-500" />
              <p className="text-xs font-medium text-slate-700">{label}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
