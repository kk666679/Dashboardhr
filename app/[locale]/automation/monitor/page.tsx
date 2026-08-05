"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Activity,
  CheckCircle2,
  XCircle,
  Clock,
  PauseCircle,
  PlayCircle,
  StopCircle,
  Search,
  RefreshCw,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { WorkflowExecutionMonitor } from "@/components/features/automation/WorkflowExecutionMonitor";
import { useToast } from "@/components/ui/use-toast";

// ─── Types ───────────────────────────────────────────────────────────────────

type ExecStatus = "running" | "completed" | "failed" | "paused" | "cancelled";

interface ExecStep {
  name: string;
  status: "pending" | "running" | "completed" | "failed" | "skipped";
  duration?: string;
  assignee?: string;
}

interface Execution {
  id: string;
  workflowName: string;
  module: string;
  status: ExecStatus;
  progress: number;
  startedAt: string;
  duration: string;
  triggeredBy: string;
  slaMinutes: number;
  elapsedMinutes: number;
  steps: ExecStep[];
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_EXECUTIONS: Execution[] = [
  {
    id: "EX-001",
    workflowName: "Leave Approval — Ahmad Rahman",
    module: "HR",
    status: "running",
    progress: 60,
    startedAt: new Date(Date.now() - 8 * 60000).toISOString(),
    duration: "8m 12s",
    triggeredBy: "Employee Portal",
    slaMinutes: 60,
    elapsedMinutes: 8,
    steps: [
      { name: "Submit Request",      status: "completed", duration: "0s" },
      { name: "Line Manager Review", status: "running",   assignee: "Siti Norhaliza" },
      { name: "HR Verification",     status: "pending" },
      { name: "Notify Employee",     status: "pending" },
    ],
  },
  {
    id: "EX-002",
    workflowName: "Onboarding — New Hire Batch #12",
    module: "Onboarding",
    status: "running",
    progress: 35,
    startedAt: new Date(Date.now() - 22 * 60000).toISOString(),
    duration: "22m 5s",
    triggeredBy: "HR Manager",
    slaMinutes: 120,
    elapsedMinutes: 22,
    steps: [
      { name: "Welcome Email",     status: "completed", duration: "1m" },
      { name: "IT Account Setup",  status: "completed", duration: "8m" },
      { name: "Document Upload",   status: "running",   assignee: "New Hire" },
      { name: "Manager Meeting",   status: "pending" },
      { name: "Policy Acknowledgment", status: "pending" },
    ],
  },
  {
    id: "EX-003",
    workflowName: "Payroll Run — May 2025",
    module: "Payroll",
    status: "paused",
    progress: 72,
    startedAt: new Date(Date.now() - 45 * 60000).toISOString(),
    duration: "45m 0s",
    triggeredBy: "Scheduler",
    slaMinutes: 90,
    elapsedMinutes: 45,
    steps: [
      { name: "Fetch Attendance",      status: "completed", duration: "3m" },
      { name: "Calculate Gross Pay",   status: "completed", duration: "12m" },
      { name: "EPF/SOCSO/PCB Calc",    status: "completed", duration: "8m" },
      { name: "Director Approval",     status: "running",   assignee: "CFO" },
      { name: "Generate Payslips",     status: "pending" },
      { name: "Bank File Upload",      status: "pending" },
    ],
  },
  {
    id: "EX-004",
    workflowName: "Permit Renewal — Nguyen Van Thanh",
    module: "Compliance",
    status: "failed",
    progress: 40,
    startedAt: new Date(Date.now() - 90 * 60000).toISOString(),
    duration: "1m 30s",
    triggeredBy: "Expiry Alert",
    slaMinutes: 30,
    elapsedMinutes: 90,
    steps: [
      { name: "Document Check",    status: "completed", duration: "30s" },
      { name: "FWCMS Submission",  status: "failed" },
      { name: "JTK Approval",      status: "pending" },
    ],
  },
  {
    id: "EX-005",
    workflowName: "Performance Review — Q2 Cycle",
    module: "Performance",
    status: "completed",
    progress: 100,
    startedAt: new Date(Date.now() - 3 * 3600000).toISOString(),
    duration: "2h 14m",
    triggeredBy: "HR Manager",
    slaMinutes: 180,
    elapsedMinutes: 134,
    steps: [
      { name: "Self Assessment",     status: "completed", duration: "22m" },
      { name: "Manager Assessment",  status: "completed", duration: "48m" },
      { name: "Calibration Review",  status: "completed", duration: "35m" },
      { name: "Final Rating",        status: "completed", duration: "9m" },
    ],
  },
];

// ─── Status helpers ───────────────────────────────────────────────────────────

const STATUS_ICON: Record<ExecStatus, React.ElementType> = {
  running:   Activity,
  completed: CheckCircle2,
  failed:    XCircle,
  paused:    PauseCircle,
  cancelled: StopCircle,
};

const STATUS_COLOR: Record<ExecStatus, string> = {
  running:   "text-blue-500",
  completed: "text-green-500",
  failed:    "text-red-500",
  paused:    "text-yellow-500",
  cancelled: "text-muted-foreground",
};

const STATUS_BADGE: Record<ExecStatus, string> = {
  running:   "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  completed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  failed:    "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  paused:    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  cancelled: "bg-muted text-muted-foreground",
};

const STEP_ICON: Record<ExecStep["status"], React.ElementType> = {
  completed: CheckCircle2,
  running:   Activity,
  failed:    XCircle,
  pending:   Clock,
  skipped:   StopCircle,
};

const STEP_COLOR: Record<ExecStep["status"], string> = {
  completed: "text-green-500",
  running:   "text-blue-500 animate-pulse",
  failed:    "text-red-500",
  pending:   "text-muted-foreground",
  skipped:   "text-muted-foreground",
};

// ─── Execution row ────────────────────────────────────────────────────────────

function ExecutionRow({ exec, onAction }: {
  exec: Execution;
  onAction: (id: string, action: "pause" | "resume" | "cancel" | "retry") => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const StatusIcon = STATUS_ICON[exec.status];
  const slaUsed = Math.min(100, Math.round((exec.elapsedMinutes / exec.slaMinutes) * 100));
  const slaColor = slaUsed >= 90 ? "bg-red-500" : slaUsed >= 70 ? "bg-yellow-500" : "bg-green-500";
  const slaWarning = slaUsed >= 80;

  return (
    <>
      <TableRow className="cursor-pointer hover:bg-muted/40" onClick={() => setExpanded((v) => !v)}>
        <TableCell>
          <div className="flex items-center gap-2">
            {expanded ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
            <StatusIcon className={cn("h-4 w-4 shrink-0", STATUS_COLOR[exec.status], exec.status === "running" && "animate-pulse")} />
            <div>
              <p className="font-medium text-sm">{exec.workflowName}</p>
              <p className="text-xs text-muted-foreground">by {exec.triggeredBy}</p>
            </div>
          </div>
        </TableCell>
        <TableCell>
          <Badge variant="outline" className="text-xs">{exec.module}</Badge>
        </TableCell>
        <TableCell>
          <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", STATUS_BADGE[exec.status])}>
            {exec.status}
          </span>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <Progress value={exec.progress} className="w-20 h-1.5" />
            <span className="text-xs text-muted-foreground">{exec.progress}%</span>
          </div>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-1 text-xs">
            <div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden">
              <div className={cn("h-full rounded-full", slaColor)} style={{ width: `${slaUsed}%` }} />
            </div>
            {slaWarning && <AlertTriangle className="h-3 w-3 text-yellow-500" />}
            <span className="text-muted-foreground">{exec.elapsedMinutes}m/{exec.slaMinutes}m</span>
          </div>
        </TableCell>
        <TableCell className="text-xs text-muted-foreground">{exec.duration}</TableCell>
        <TableCell onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-1">
            {exec.status === "running" && (
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => onAction(exec.id, "pause")} title="Pause">
                <PauseCircle className="h-3.5 w-3.5" />
              </Button>
            )}
            {exec.status === "paused" && (
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => onAction(exec.id, "resume")} title="Resume">
                <PlayCircle className="h-3.5 w-3.5 text-blue-500" />
              </Button>
            )}
            {exec.status === "failed" && (
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => onAction(exec.id, "retry")} title="Retry">
                <RefreshCw className="h-3.5 w-3.5 text-orange-500" />
              </Button>
            )}
            {(exec.status === "running" || exec.status === "paused") && (
              <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => onAction(exec.id, "cancel")} title="Cancel">
                <StopCircle className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </TableCell>
      </TableRow>

      {/* Expanded steps */}
      {expanded && (
        <TableRow>
          <TableCell colSpan={7} className="bg-muted/20 py-3 px-6">
            <div className="flex flex-wrap gap-2">
              {exec.steps.map((step, i) => {
                const StepIcon = STEP_ICON[step.status];
                return (
                  <div key={i} className="flex items-center gap-1.5 rounded-full border bg-background px-3 py-1 text-xs">
                    <StepIcon className={cn("h-3 w-3", STEP_COLOR[step.status])} />
                    <span className="font-medium">{step.name}</span>
                    {step.assignee && <span className="text-muted-foreground">({step.assignee})</span>}
                    {step.duration && <span className="text-muted-foreground">· {step.duration}</span>}
                  </div>
                );
              })}
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AutomationMonitorPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ExecStatus | "all">("all");

  const filtered = MOCK_EXECUTIONS.filter((e) => {
    const matchSearch = e.workflowName.toLowerCase().includes(search.toLowerCase()) ||
      e.module.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || e.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleAction = (id: string, action: "pause" | "resume" | "cancel" | "retry") => {
    const labels: Record<string, string> = {
      pause: "Paused", resume: "Resumed", cancel: "Cancelled", retry: "Retrying",
    };
    toast({ title: `${labels[action]} execution ${id}` });
  };

  const counts = {
    running:   MOCK_EXECUTIONS.filter((e) => e.status === "running").length,
    paused:    MOCK_EXECUTIONS.filter((e) => e.status === "paused").length,
    failed:    MOCK_EXECUTIONS.filter((e) => e.status === "failed").length,
    completed: MOCK_EXECUTIONS.filter((e) => e.status === "completed").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Execution Monitor</h1>
        <p className="text-muted-foreground text-sm">Real-time tracking with step-level visibility and SLA alerts</p>
      </div>

      {/* Status KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Running",   value: counts.running,   color: "text-blue-600",  icon: Activity,     filter: "running"   },
          { label: "Paused",    value: counts.paused,    color: "text-yellow-600",icon: PauseCircle,  filter: "paused"    },
          { label: "Failed",    value: counts.failed,    color: "text-red-600",   icon: XCircle,      filter: "failed"    },
          { label: "Completed", value: counts.completed, color: "text-green-600", icon: CheckCircle2, filter: "completed" },
        ].map((k) => {
          const Icon = k.icon;
          return (
            <Card
              key={k.label}
              className={cn("p-4 cursor-pointer transition-all", statusFilter === k.filter && "ring-2 ring-primary")}
              onClick={() => setStatusFilter(statusFilter === k.filter ? "all" : k.filter as ExecStatus)}
            >
              <div className="flex items-center justify-between">
                <Icon className={cn("h-5 w-5", k.color, k.filter === "running" && "animate-pulse")} />
                <span className={cn("text-2xl font-bold", k.color)}>{k.value}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{k.label}</p>
            </Card>
          );
        })}
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3 flex-wrap">
            <CardTitle className="text-base">Executions</CardTitle>
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search workflow or module…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 pl-8 text-sm"
              />
            </div>
            {statusFilter !== "all" && (
              <Button size="sm" variant="outline" onClick={() => setStatusFilter("all")}>
                Clear filter
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Workflow</TableHead>
                <TableHead>Module</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>SLA</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    No executions match your filters
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((exec) => (
                  <ExecutionRow key={exec.id} exec={exec} onAction={handleAction} />
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
