"use client";

import Link from "next/link";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { UserPlus, CheckCircle, Clock, AlertCircle, ArrowRight } from "lucide-react";

const STATUS_CONFIG = {
  COMPLETED: {
    label: "Completed",
    className: "bg-green-100 text-green-800",
    icon: CheckCircle,
  },
  IN_PROGRESS: {
    label: "In Progress",
    className: "bg-yellow-100 text-yellow-800",
    icon: Clock,
  },
  PENDING: {
    label: "Pending",
    className: "bg-slate-100 text-slate-700",
    icon: Clock,
  },
  OVERDUE: {
    label: "Overdue",
    className: "bg-red-100 text-red-800",
    icon: AlertCircle,
  },
} as const;

export default function OnboardingListPage() {
  type OnboardingChecklist = {
    id: string;
    employeeId: string;
    status: string;
    completionPct: number;
    dueDate?: string;
  };

  const { data: checklists, isLoading } = trpc.onboarding.listChecklists.useQuery({});

  const totalCount = checklists?.length ?? 0;
  const completedCount =
    checklists?.filter((c: OnboardingChecklist) => c.completionPct === 100).length ?? 0;
  const inProgressCount =
    checklists?.filter(
      (c: OnboardingChecklist) => c.completionPct > 0 && c.completionPct < 100
    ).length ?? 0;
  const pendingCount =
    checklists?.filter((c: OnboardingChecklist) => c.completionPct === 0).length ?? 0;

  return (
    <div className="flex-1 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <UserPlus className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Onboarding</h1>
            <p className="text-sm text-muted-foreground">
              Track new hire onboarding progress across all employees
            </p>
          </div>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total", value: totalCount, color: "text-slate-700" },
          { label: "Completed", value: completedCount, color: "text-green-600" },
          { label: "In Progress", value: inProgressCount, color: "text-yellow-600" },
          { label: "Not Started", value: pendingCount, color: "text-slate-500" },
        ].map(({ label, value, color }) => (
          <Card key={label} className="p-4">
            <div className={`text-2xl font-bold ${color}`}>{value}</div>
            <div className="text-xs text-muted-foreground">{label}</div>
          </Card>
        ))}
      </div>

      {/* Checklists */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Onboarding Checklists</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : !checklists?.length ? (
            <div className="text-center py-10 text-muted-foreground">
              <UserPlus className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No onboarding records found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {checklists.map((checklist: OnboardingChecklist) => {
                const pct: number = checklist.completionPct ?? 0;
                const statusKey =
                  pct === 100
                    ? "COMPLETED"
                    : pct > 0
                    ? "IN_PROGRESS"
                    : "PENDING";
                const config = STATUS_CONFIG[statusKey];
                const StatusIcon = config.icon;

                return (
                  <div
                    key={checklist.id}
                    className="flex items-center justify-between border rounded-lg p-3 gap-3 flex-wrap"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <StatusIcon
                        className={`h-4 w-4 shrink-0 ${
                          statusKey === "COMPLETED"
                            ? "text-green-600"
                            : statusKey === "IN_PROGRESS"
                            ? "text-yellow-600"
                            : "text-slate-400"
                        }`}
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">
                          Employee:{" "}
                          <span className="font-mono">
                            {checklist.employeeId?.slice(0, 16)}…
                          </span>
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="h-1.5 w-32 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {pct}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge className={config.className}>
                        {config.label}
                      </Badge>
                      <Button size="sm" variant="outline" asChild>
                        <Link
                          href={`/dashboard/onboarding/${checklist.employeeId}`}
                        >
                          View
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
