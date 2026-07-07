"use client";

import { motion } from "framer-motion";
import {
  Users,
  ShieldCheck,
  DollarSign,
  Activity,
  BarChart3,
  Bell,
  FileCheck,
  UserPlus,
  ClipboardCheck,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { ActivityChart } from "@/components/ActivityChart";
import { cn } from "@/lib/utils";
import { trpc } from "@/hooks/client/trpc";

const quickActions = [
  {
    label: "Add Worker",
    icon: UserPlus,
  },
  {
    label: "Run Audit",
    icon: ClipboardCheck,
  },
  {
    label: "Generate Report",
    icon: FileCheck,
  },
];

// -----------------------------------------------------------------------------
// Dashboard Page
// -----------------------------------------------------------------------------

export default function DashboardPage() {
  const { data, isLoading, error } = trpc.dashboard.getData.useQuery();

  const statCards = (() => {
    if (!data) {
      return [];
    }

    const total = data.stats.total;
    const active = data.stats.active;
    const foreign = data.stats.foreign;
    const recentCount = Math.min(data.employees.length, 8);
    const complianceScore = Math.min(100, Math.max(0, Math.round((active / Math.max(total, 1)) * 100)));

    return [
      {
        title: "Total Employees",
        value: total.toLocaleString(),
        change: "+0.0%",
        positive: true,
        description: "Employees currently tracked in the system",
        icon: Users,
      },
      {
        title: "Foreign Workers",
        value: foreign.toLocaleString(),
        change: "+0.0%",
        positive: true,
        description: "Foreign worker and expatriate records",
        icon: ShieldCheck,
      },
      {
        title: "Active Records",
        value: active.toLocaleString(),
        change: "+0.0%",
        positive: true,
        description: "Records available for operations and payroll",
        icon: Activity,
      },
      {
        title: "Compliance Score",
        value: `${complianceScore}%`,
        change: "+1.2%",
        positive: true,
        description: "Operational readiness across current workforce records",
        icon: DollarSign,
      },
    ];
  })();

  const recentActivities = (data?.employees ?? []).slice(0, 4).map((employee) => ({
    title: `${employee.name} ${employee.position ? `• ${employee.position}` : ""}`.trim(),
    time: employee.createdAt
      ? new Date(employee.createdAt).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        })
      : "Recently added",
  }));

  const aiInsights = data
    ? [
        `${data.stats.foreign} foreign worker records are available for review`,
        `${data.employees.length} recent employee profiles are ready for HR workflows`,
        `${data.stats.total} total employees are currently in the tenant workspace`,
      ]
    : [];

  const notifications = data
    ? [
        {
          text: `${data.stats.foreign} foreign worker records need permit review`,
          color: "bg-yellow-500",
        },
        {
          text: `${data.employees.length} employee dossiers are ready for onboarding`,
          color: "bg-blue-500",
        },
        {
          text: "Tenant data sync completed successfully",
          color: "bg-green-500",
        },
      ]
    : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        {/* ------------------------------------------------------------------ */}
        {/* Header */}
        {/* ------------------------------------------------------------------ */}

        <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
              Workforce Dashboard
            </h1>

            <p className="text-muted-foreground text-base lg:text-lg">
              Real-time operational insights for workforce, compliance,
              payroll, and risk monitoring.
            </p>
          </div>

          <div className="flex gap-3">
            <Button variant="outline">Export Report</Button>

            <Button className="shadow-lg">
              <UserPlus className="mr-2 h-4 w-4" />
              Add Worker
            </Button>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* Stats Grid */}
        {/* ------------------------------------------------------------------ */}

        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <Card
                key={index}
                className="border-border/50 bg-background/60 backdrop-blur-xl"
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 w-24 rounded bg-muted" />
                      <div className="h-6 w-20 rounded bg-muted" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : error ? (
            <Card className="border-border/50 bg-background/60 backdrop-blur-xl sm:col-span-2 xl:col-span-4">
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">
                  Unable to load dashboard data right now. Please try again after the API is available.
                </p>
              </CardContent>
            </Card>
          ) : (
            statCards.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.08,
                }}
              >
                <Card
                  className={cn(
                    "group border-border/50",
                    "bg-background/60 backdrop-blur-xl",
                    "transition-all duration-300",
                    "hover:-translate-y-1 hover:shadow-2xl"
                  )}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-4">
                        <div
                          className={cn(
                            "flex h-12 w-12 items-center justify-center rounded-2xl",
                            "bg-primary/10 text-primary"
                          )}
                        >
                          <Icon className="h-6 w-6" />
                        </div>

                        <div>
                          <p className="text-sm text-muted-foreground">
                            {stat.title}
                          </p>

                          <div className="mt-1 flex items-center gap-2">
                            <h2 className="text-3xl font-bold tracking-tight">
                              {stat.value}
                            </h2>

                            <div
                              className={cn(
                                "flex items-center rounded-full px-2 py-1 text-xs font-medium",
                                stat.positive
                                  ? "bg-green-500/10 text-green-500"
                                  : "bg-red-500/10 text-red-500"
                              )}
                            >
                              {stat.positive ? (
                                <ArrowUpRight className="mr-1 h-3 w-3" />
                              ) : (
                                <ArrowDownRight className="mr-1 h-3 w-3" />
                              )}

                              {stat.change}
                            </div>
                          </div>

                          <p className="mt-2 text-sm text-muted-foreground">
                            {stat.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
          )}
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* Main Layout */}
        {/* ------------------------------------------------------------------ */}

        <section className="grid gap-6 xl:grid-cols-12">
          {/* Left Side */}
          <div className="space-y-6 xl:col-span-8">
            {/* Activity Chart */}

            <Card
              className={cn(
                "border-border/50",
                "bg-background/60 backdrop-blur-xl",
                "shadow-sm"
              )}
            >
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Workforce Analytics
                  </CardTitle>

                  <CardDescription>
                    Daily activity, workforce trends, and operational metrics
                  </CardDescription>
                </div>

                <Button variant="outline" size="sm">
                  Last 30 Days
                </Button>
              </CardHeader>

              <CardContent className="h-[340px]">
                <ActivityChart />
              </CardContent>
            </Card>

            {/* Recent Activity */}

            <Card
              className={cn(
                "border-border/50",
                "bg-background/60 backdrop-blur-xl"
              )}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activity
                </CardTitle>

                <CardDescription>
                  Latest operational updates across the platform
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3">
                {recentActivities.length > 0 ? (
                  recentActivities.map((item, index) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: index * 0.06,
                      }}
                      className={cn(
                        "flex items-center gap-4 rounded-xl border p-4",
                        "bg-muted/30 transition-colors",
                        "hover:bg-muted/50"
                      )}
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10">
                        <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                      </div>

                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.title}</p>

                        <p className="text-xs text-muted-foreground">{item.time}</p>
                      </div>
                    </motion.div>
                  ))
                ) : null}
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}

          <div className="space-y-6 xl:col-span-4">
            {/* AI Insights */}

            <Card
              className={cn(
                "border-border/50",
                "bg-background/60 backdrop-blur-xl",
                "overflow-hidden"
              )}
            >
              <div className="h-1 bg-gradient-to-r from-violet-500 via-cyan-500 to-blue-500" />

              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-violet-500" />
                  AI Insights
                </CardTitle>

                <CardDescription>
                  Intelligent workforce recommendations
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3">
                {aiInsights.map((insight) => (
                  <div
                    key={insight}
                    className="rounded-xl border bg-muted/30 p-3 text-sm"
                  >
                    {insight}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}

            <Card
              className={cn(
                "border-border/50",
                "bg-background/60 backdrop-blur-xl"
              )}
            >
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>

                <CardDescription>
                  Frequently used operational tools
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-2">
                {quickActions.map((action) => {
                  const Icon = action.icon;

                  return (
                    <Button
                      key={action.label}
                      variant="ghost"
                      className={cn(
                        "h-12 w-full justify-start rounded-xl",
                        "transition-all duration-200",
                        "hover:bg-primary/10 hover:text-primary"
                      )}
                    >
                      <Icon className="mr-3 h-4 w-4" />
                      {action.label}
                    </Button>
                  );
                })}
              </CardContent>
            </Card>

            {/* Notifications */}

            <Card
              className={cn(
                "border-border/50",
                "bg-background/60 backdrop-blur-xl"
              )}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications
                </CardTitle>

                <CardDescription>
                  Important alerts and reminders
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3">
                {notifications.map((notification) => (
                  <div
                    key={notification.text}
                    className="flex items-center gap-3 rounded-xl border bg-muted/30 p-3"
                  >
                    <span
                      className={cn(
                        "h-2.5 w-2.5 rounded-full",
                        notification.color
                      )}
                    />

                    <span className="text-sm">
                      {notification.text}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>
      </motion.div>
    </div>
  );
}