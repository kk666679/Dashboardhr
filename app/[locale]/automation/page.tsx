"use client";

import { useState } from "react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Workflow,
  Zap,
  Play,
  BarChart3,
  FileText,
  Shield,
  GitBranch,
  ArrowRight,
  Activity,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  RefreshCw,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { WorkflowExecutionMonitor } from "@/components/features/automation/WorkflowExecutionMonitor";
import { QMSDashboard } from "@/components/features/automation/QMS/QMSDashboard";
import { SOPWorkflowDashboard } from "@/components/features/automation/sop-workflow/SOPWorkflowDashboard";
import { ComplianceAudit } from "@/components/features/compliance/ComplianceAudit";
import { PolicyList } from "@/components/features/compliance/PolicyList";
import { RegulationList } from "@/components/features/compliance/RegulationList";

// ─── Module cards ─────────────────────────────────────────────────────────────

const AUTOMATION_MODULES = [
  {
    title: "Flow Designer",
    description: "Visual drag-and-drop workflow builder with 30+ node types, AI assistance, and real-time collaboration",
    href: "/automation/designer",
    icon: Workflow,
    badge: "Canvas",
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    stats: { label: "Active flows", value: "12" },
  },
  {
    title: "Execution Monitor",
    description: "Real-time tracking of running workflow instances with SLA alerts and step-level visibility",
    href: "/automation/monitor",
    icon: Play,
    badge: "Live",
    color: "bg-green-500/10 text-green-600 dark:text-green-400",
    stats: { label: "Running now", value: "3" },
  },
  {
    title: "QMS / Quality",
    description: "Audits, CAPAs, non-conformances, ISO compliance checking, and document control",
    href: "/automation/qms",
    icon: Shield,
    badge: "ISO",
    color: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    stats: { label: "Open CAPAs", value: "23" },
  },
  {
    title: "SOP Workflows",
    description: "Full SOP lifecycle — draft, review, approve, publish, and retire with AI generation",
    href: "/automation/sops",
    icon: FileText,
    badge: "SOPs",
    color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    stats: { label: "Published", value: "12" },
  },
  {
    title: "Analytics",
    description: "Workflow performance metrics, throughput trends, and bottleneck analysis",
    href: "/automation/analytics",
    icon: BarChart3,
    badge: "Reports",
    color: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
    stats: { label: "Success rate", value: "97.2%" },
  },
  {
    title: "Templates",
    description: "Pre-built HR workflow templates — leave, onboarding, payroll, permits, and more",
    href: "/automation/templates",
    icon: GitBranch,
    badge: "Library",
    color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
    stats: { label: "Templates", value: "18" },
  },
] as const;

// ─── KPIs ─────────────────────────────────────────────────────────────────────

const KPI_DATA = [
  { label: "Active Flows",     value: "12",     delta: "+2",     positive: true,  icon: Activity },
  { label: "Completed Today",  value: "47",     delta: "+8",     positive: true,  icon: CheckCircle2 },
  { label: "Failed",           value: "2",      delta: "-1",     positive: true,  icon: XCircle },
  { label: "Avg. Duration",    value: "4.2 min",delta: "-0.9 min",positive: true, icon: Clock },
  { label: "SLA Breaches",     value: "4",      delta: "-2",     positive: true,  icon: AlertTriangle },
  { label: "Success Rate",     value: "97.2%",  delta: "+0.8%",  positive: true,  icon: TrendingUp },
];

// ─── Recent executions ────────────────────────────────────────────────────────

const RECENT_EXECUTIONS = [
  { id: "EX-001", workflow: "Leave Approval",    status: "completed", duration: "3m 12s", module: "HR",         ts: "2 min ago" },
  { id: "EX-002", workflow: "Onboarding Flow",   status: "running",   duration: "8m 44s", module: "Onboarding", ts: "5 min ago" },
  { id: "EX-003", workflow: "Payroll Run",        status: "completed", duration: "12m 5s", module: "Payroll",    ts: "18 min ago" },
  { id: "EX-004", workflow: "Permit Renewal",     status: "failed",    duration: "1m 30s", module: "Compliance", ts: "34 min ago" },
  { id: "EX-005", workflow: "Performance Review", status: "paused",    duration: "22m 0s", module: "Performance",ts: "1h ago" },
] as const;

const STATUS_STYLES: Record<string, { badge: string; icon: React.ElementType }> = {
  completed: { badge: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400", icon: CheckCircle2 },
  running:   { badge: "bg-blue-100  text-blue-800  dark:bg-blue-900/30  dark:text-blue-400",  icon: Activity },
  failed:    { badge: "bg-red-100   text-red-800   dark:bg-red-900/30   dark:text-red-400",   icon: XCircle },
  paused:    { badge: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400", icon: Clock },
};

// ─── Compliance summary ───────────────────────────────────────────────────────

const COMPLIANCE_DOMAINS = [
  { name: "GDPR",      passing: 10, total: 12 },
  { name: "PDPA",      passing: 8,  total: 8  },
  { name: "ISO 27001", passing: 17, total: 20 },
  { name: "ISO 9001",  passing: 22, total: 25 },
  { name: "SOC 2",     passing: 13, total: 15 },
  { name: "ISO 45001", passing: 18, total: 20 },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function AutomationPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const { data: automationFlows } = trpc.automation.getAll.useQuery(undefined, { retry: false });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Automation Hub</h1>
          <p className="text-muted-foreground">
            Design, execute, and monitor HR workflows end-to-end
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/automation/designer">
              <Workflow className="h-4 w-4 mr-2" />
              Open Designer
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/automation/templates">
              <Zap className="h-4 w-4 mr-2" />
              Quick Start
            </Link>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="monitor">Live Monitor</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="qms">QMS</TabsTrigger>
          <TabsTrigger value="sop">SOP Workflows</TabsTrigger>
        </TabsList>

        {/* ── Overview ── */}
        <TabsContent value="overview" className="space-y-6 mt-4">

          {/* KPI strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
            {KPI_DATA.map((kpi) => {
              const Icon = kpi.icon;
              return (
                <Card key={kpi.label} className="p-4">
                  <div className="flex items-start justify-between">
                    <Icon className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span className={`text-xs font-medium flex items-center gap-0.5 ${kpi.positive ? "text-green-600" : "text-red-600"}`}>
                      {kpi.positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {kpi.delta}
                    </span>
                  </div>
                  <div className="text-2xl font-bold mt-2">{kpi.value}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{kpi.label}</div>
                </Card>
              );
            })}
          </div>

          {/* Main grid: modules + recent executions */}
          <div className="grid gap-6 lg:grid-cols-3">

            {/* Module cards — 2 cols */}
            <div className="lg:col-span-2 grid gap-4 sm:grid-cols-2">
              {AUTOMATION_MODULES.map((mod) => {
                const Icon = mod.icon;
                return (
                  <Card key={mod.href} className="hover:shadow-md transition-shadow group">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg shrink-0 ${mod.color}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-sm truncate">{mod.title}</CardTitle>
                          <p className="text-xs text-muted-foreground">{mod.stats.label}: <span className="font-semibold">{mod.stats.value}</span></p>
                        </div>
                        <Badge variant="secondary" className="shrink-0 text-xs">
                          {mod.badge}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <CardDescription className="text-xs">{mod.description}</CardDescription>
                      <Button variant="outline" size="sm" className="w-full group-hover:bg-accent" asChild>
                        <Link href={mod.href}>
                          Open <ArrowRight className="ml-1 h-3 w-3" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Recent executions */}
            <Card className="h-fit">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-base">Recent Executions</CardTitle>
<Button variant="ghost" size="sm" asChild>
                  <Link href="/automation/monitor">
                    View all <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {RECENT_EXECUTIONS.map((ex) => {
                  const st = STATUS_STYLES[ex.status];
                  const StatusIcon = st.icon;
                  return (
                    <div key={ex.id} className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0">
                      <StatusIcon className={`h-4 w-4 mt-0.5 shrink-0 ${ex.status === "running" ? "animate-pulse text-blue-500" : ex.status === "completed" ? "text-green-500" : ex.status === "failed" ? "text-red-500" : "text-yellow-500"}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{ex.workflow}</p>
                        <p className="text-xs text-muted-foreground">{ex.duration} · {ex.ts}</p>
                      </div>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${st.badge}`}>
                        {ex.status}
                      </span>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Compliance posture strip */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Compliance Posture</CardTitle>
                <Button variant="ghost" size="sm" asChild>
<Link href="/automation?tab=compliance" onClick={() => setActiveTab("compliance")}>
                    Details <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {COMPLIANCE_DOMAINS.map((d) => {
                  const pct = Math.round((d.passing / d.total) * 100);
                  const color = pct >= 90 ? "text-green-600" : pct >= 70 ? "text-yellow-600" : "text-red-600";
                  const bar   = pct >= 90 ? "bg-green-500" : pct >= 70 ? "bg-yellow-500" : "bg-red-500";
                  return (
                    <div key={d.name} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium">{d.name}</span>
                        <span className={`font-semibold ${color}`}>{pct}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${bar}`} style={{ width: `${pct}%` }} />
                      </div>
                      <p className="text-[10px] text-muted-foreground">{d.passing}/{d.total} controls</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

        </TabsContent>

        {/* ── Live Monitor ── */}
        <TabsContent value="monitor" className="mt-4">
          <WorkflowExecutionMonitor />
        </TabsContent>

        {/* ── Compliance ── */}
        <TabsContent value="compliance" className="space-y-6 mt-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-xl font-semibold">Compliance Management</h2>
              <p className="text-sm text-muted-foreground">Policies, regulations, audit findings</p>
            </div>
          </div>
          <Tabs defaultValue="findings">
            <TabsList>
              <TabsTrigger value="findings">Audit Findings</TabsTrigger>
              <TabsTrigger value="policies">Policies</TabsTrigger>
              <TabsTrigger value="regulations">Regulations</TabsTrigger>
            </TabsList>
            <TabsContent value="findings" className="mt-4">
              <ComplianceAudit findings={[]} />
            </TabsContent>
            <TabsContent value="policies" className="mt-4">
              <PolicyList policies={[]} />
            </TabsContent>
            <TabsContent value="regulations" className="mt-4">
              <RegulationList regulations={[]} />
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* ── QMS ── */}
        <TabsContent value="qms" className="mt-4">
          <QMSDashboard />
        </TabsContent>

        {/* ── SOP Workflows ── */}
        <TabsContent value="sop" className="mt-4">
          <SOPWorkflowDashboard />
        </TabsContent>

      </Tabs>
    </div>
  );
}
