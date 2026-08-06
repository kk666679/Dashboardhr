"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc";
import {
  Brain, TrendingDown, Flame, AlertCircle, Star, Zap,
  Users, Clock, Target, ChevronRight, Sparkles, RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

type AlertSeverity = "critical" | "warning" | "info";

interface PredictiveAlert {
  id: string;
  type: "turnover" | "burnout" | "attendance" | "performance" | "skills" | "engagement";
  employeeName: string;
  message: string;
  severity: AlertSeverity;
  score: number;
  recommendedAction: string;
}

interface AIInsight {
  id: string;
  category: string;
  summary: string;
  priority: "high" | "medium" | "low";
  actionLabel: string;
}

const MOCK_ALERTS: PredictiveAlert[] = [
  { id: "1", type: "turnover", employeeName: "Ahmad Razif", message: "High flight risk — 3 missed 1:1s, salary below market", severity: "critical", score: 87, recommendedAction: "Schedule retention conversation" },
  { id: "2", type: "burnout", employeeName: "Siti Norzahra", message: "Logged 62h/week for 4 consecutive weeks", severity: "critical", score: 79, recommendedAction: "Redistribute workload immediately" },
  { id: "3", type: "attendance", employeeName: "Ravi Kumar", message: "5 late arrivals this month — pattern detected", severity: "warning", score: 61, recommendedAction: "Check-in on personal wellbeing" },
  { id: "4", type: "skills", employeeName: "Team — Engineering", message: "Cloud architecture skill gap widening vs. roadmap", severity: "warning", score: 55, recommendedAction: "Approve pending AWS training request" },
  { id: "5", type: "engagement", employeeName: "Nurul Ain", message: "Pulse score dropped 18pts since last quarter", severity: "warning", score: 48, recommendedAction: "Offer stretch assignment or recognition" },
];

const MOCK_INSIGHTS: AIInsight[] = [
  { id: "1", category: "Capacity", summary: "Team is at 94% utilisation — 2 projects at risk if Q3 hiring delayed", priority: "high", actionLabel: "Review headcount plan" },
  { id: "2", category: "Recognition", summary: "4 employees haven't received recognition in 90+ days", priority: "medium", actionLabel: "Send recognition" },
  { id: "3", category: "Performance", summary: "Q2 review cycle closes in 6 days — 3 reviews still pending", priority: "high", actionLabel: "Complete reviews" },
  { id: "4", category: "Compliance", summary: "2 work permit renewals due within 30 days", priority: "high", actionLabel: "Initiate renewal" },
];

const ALERT_ICONS = {
  turnover: TrendingDown,
  burnout: Flame,
  attendance: Clock,
  performance: Target,
  skills: Brain,
  engagement: Star,
};

const SEVERITY_STYLES: Record<AlertSeverity, string> = {
  critical: "border-red-200 bg-red-50 dark:bg-red-950/20",
  warning: "border-amber-200 bg-amber-50 dark:bg-amber-950/20",
  info: "border-blue-200 bg-blue-50 dark:bg-blue-950/20",
};

const SEVERITY_BADGE: Record<AlertSeverity, string> = {
  critical: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  warning: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  info: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
};

export function CommandCenter() {
  const [refreshing, setRefreshing] = useState(false);
  const { data: dashboard } = trpc.mss.getTeamDashboard.useQuery();

  function handleRefresh() {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  }

  const teamHealthScore = 72;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Command Center</h1>
          <p className="text-sm text-muted-foreground mt-0.5">AI-powered workforce intelligence · Updated just now</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
          <RefreshCw className={cn("h-3.5 w-3.5 mr-1.5", refreshing && "animate-spin")} />
          Refresh
        </Button>
      </div>

      {/* Team Health Score */}
      <Card className="border-0 bg-gradient-to-br from-indigo-600 to-violet-700 text-white shadow-lg">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-200" />
              <span className="font-semibold text-indigo-100">Team Health Score</span>
            </div>
            <Badge className="bg-white/20 text-white border-0 text-xs">AI Generated</Badge>
          </div>
          <div className="flex items-end gap-4">
            <div className="text-5xl font-bold">{teamHealthScore}</div>
            <div className="pb-1 text-indigo-200 text-sm">/ 100 · <span className="text-yellow-300 font-medium">Moderate</span></div>
          </div>
          <Progress value={teamHealthScore} className="mt-3 h-2 bg-white/20 [&>div]:bg-white" />
          <div className="grid grid-cols-4 gap-3 mt-4 text-center">
            {[
              { label: "Engagement", val: 78 },
              { label: "Productivity", val: 81 },
              { label: "Wellbeing", val: 65 },
              { label: "Retention", val: 70 },
            ].map(({ label, val }) => (
              <div key={label} className="bg-white/10 rounded-lg p-2">
                <div className="text-lg font-bold">{val}</div>
                <div className="text-[10px] text-indigo-200">{label}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Team Size", value: dashboard?.teamSize ?? "—", sub: `${dashboard?.activeCount ?? 0} active`, icon: Users, color: "text-blue-600" },
          { label: "Pending Actions", value: (dashboard?.pendingLeaves ?? 0), sub: "require attention", icon: AlertCircle, color: "text-orange-600" },
          { label: "Present Today", value: dashboard?.presentToday ?? "—", sub: "in office / remote", icon: Clock, color: "text-green-600" },
          { label: "AI Alerts", value: MOCK_ALERTS.filter(a => a.severity === "critical").length, sub: "critical signals", icon: Zap, color: "text-red-600" },
        ].map(({ label, value, sub, icon: Icon, color }) => (
          <Card key={label} className="p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <Icon className={cn("h-4 w-4", color)} />
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
            <div className={cn("text-2xl font-bold", color)}>{value}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>
          </Card>
        ))}
      </div>

      {/* AI Insights */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Brain className="h-4 w-4 text-violet-600" />
            AI Insights & Recommended Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 pt-0">
          {MOCK_INSIGHTS.map((insight) => (
            <div key={insight.id} className="flex items-center justify-between rounded-lg border px-3 py-2.5 hover:bg-muted/40 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <Badge variant="outline" className={cn("text-[10px] shrink-0", insight.priority === "high" ? "border-red-300 text-red-600" : "border-amber-300 text-amber-600")}>
                  {insight.priority.toUpperCase()}
                </Badge>
                <div className="min-w-0">
                  <span className="text-xs font-semibold text-muted-foreground">{insight.category} · </span>
                  <span className="text-sm">{insight.summary}</span>
                </div>
              </div>
              <Button size="sm" variant="ghost" className="shrink-0 text-xs h-7 ml-2">
                {insight.actionLabel} <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Predictive Alerts */}
      <div>
        <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Zap className="h-4 w-4 text-amber-500" /> Predictive Alerts
          <Badge className="bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 text-[10px]">
            {MOCK_ALERTS.filter(a => a.severity === "critical").length} critical
          </Badge>
        </h2>
        <div className="space-y-2">
          {MOCK_ALERTS.map((alert) => {
            const Icon = ALERT_ICONS[alert.type];
            return (
              <div key={alert.id} className={cn("rounded-lg border p-3 flex items-start gap-3", SEVERITY_STYLES[alert.severity])}>
                <Icon className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-semibold">{alert.employeeName}</span>
                    <Badge className={cn("text-[10px] h-4 border-0", SEVERITY_BADGE[alert.severity])}>
                      {alert.severity}
                    </Badge>
                    <span className="ml-auto text-xs text-muted-foreground">Risk {alert.score}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{alert.message}</p>
                  <p className="text-xs font-medium mt-1 text-foreground">→ {alert.recommendedAction}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
