"use client";

import { useState } from "react";
import {
  Task,
  TaskTrigger,
  TaskContent,
  TaskItem,
  Timeline,
  TimelineEventItem,
  Checkpoint,
  CheckpointIcon,
  CheckpointTrigger,
  Agent,
  AgentHeader,
  AgentStatusDot,
  Suggestion,
  Suggestions,
  Sources,
  SourcesTrigger,
  SourcesContent,
  Source,
} from "../../ai-elements";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  Flag,
  Users,
  Calendar,
} from "lucide-react";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------
interface PilotTask {
  id: string;
  description: string;
  completed: boolean;
  dueDate: string;
  assignee: string;
}

interface Milestone {
  id: string;
  date: string;
  label: string;
  status: "completed" | "running" | "pending" | "warning";
  description?: string;
}

// -----------------------------------------------------------------------------
// Mock Data
// -----------------------------------------------------------------------------
const initialTasks: PilotTask[] = [
  { id: "t1", description: "Install sensors on production line", completed: true, dueDate: "2026-07-20", assignee: "Tom B" },
  { id: "t2", description: "Configure data acquisition system", completed: true, dueDate: "2026-07-22", assignee: "Aiko T" },
  { id: "t3", description: "Train operators on new dashboard", completed: false, dueDate: "2026-07-25", assignee: "Maria S" },
  { id: "t4", description: "Run initial 24-hour pilot test", completed: false, dueDate: "2026-07-27", assignee: "James O" },
  { id: "t5", description: "Collect and analyze pilot data", completed: false, dueDate: "2026-07-30", assignee: "Liu W" },
];

const initialMilestones: Milestone[] = [
  { id: "m1", date: "2026-07-18", label: "Pilot kickoff", status: "completed", description: "Team assembled and objectives defined" },
  { id: "m2", date: "2026-07-23", label: "Infrastructure ready", status: "completed", description: "Sensors and network installed" },
  { id: "m3", date: "2026-07-26", label: "Start pilot data collection", status: "running", description: "Initial data stream active" },
  { id: "m4", date: "2026-07-31", label: "Mid-pilot review", status: "pending", description: "Assess preliminary results" },
  { id: "m5", date: "2026-08-05", label: "Pilot completion & evaluation", status: "pending", description: "Final go/no-go decision" },
];

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------
export default function PilotTracker() {
  const [tasks, setTasks] = useState<PilotTask[]>(initialTasks);
  const [milestones, setMilestones] = useState<Milestone[]>(initialMilestones);
  const [checkpointPassed, setCheckpointPassed] = useState<boolean | null>(null);
  const [pilotStatus, setPilotStatus] = useState<"planning" | "active" | "reviewing" | "completed">("active");

  // Toggle task completion
  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  // Total tasks and completion
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Determine suggestion based on progress
  const getSuggestions = () => {
    if (completedTasks === totalTasks) {
      return [
        "All tasks complete. Schedule the go/no-go checkpoint.",
        "Prepare final pilot report and recommendation.",
      ];
    } else if (completionRate > 60) {
      return [
        "Good progress. Focus on remaining tasks.",
        "Consider starting the mid-pilot review early.",
      ];
    } else {
      return [
        "Tasks behind schedule. Prioritize critical path items.",
        "Identify blockers and escalate if necessary.",
      ];
    }
  };

  return (
    <div className="space-y-4 p-4">
      {/* Header with Agent */}
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold">Pilot Tracker</h2>
          <p className="text-sm text-muted-foreground">
            Monitor implementation progress and readiness for go/no-go.
          </p>
        </div>
        <Agent>
          <AgentHeader
            name="Pilot Monitor"
            model="pilot-v1"
            status={pilotStatus === "active" ? "streaming" : "idle"}
            actions={
              <span className="flex items-center gap-1 text-xs">
                <AgentStatusDot
                  status={pilotStatus === "active" ? "streaming" : "idle"}
                />
                {pilotStatus === "active" ? "Monitoring" : "Idle"}
              </span>
            }
          />
        </Agent>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {completedTasks}/{totalTasks}
            </div>
            <p className="text-xs text-muted-foreground">
              {completionRate.toFixed(0)}% complete
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Milestones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {milestones.filter((m) => m.status === "completed").length}/
              {milestones.length}
            </div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pilot Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge
              variant={
                pilotStatus === "active"
                  ? "default"
                  : pilotStatus === "completed"
                  ? "secondary"
                  : "outline"
              }
            >
              {pilotStatus.toUpperCase()}
            </Badge>
            <p className="text-xs text-muted-foreground mt-1">
              {pilotStatus === "active" ? "Data collection in progress" : ""}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Checkpoint</CardTitle>
          </CardHeader>
          <CardContent>
            {checkpointPassed === null ? (
              <span className="text-sm text-muted-foreground">Pending</span>
            ) : checkpointPassed ? (
              <span className="flex items-center gap-1 text-green-500">
                <CheckCircle className="size-4" /> Go
              </span>
            ) : (
              <span className="flex items-center gap-1 text-red-500">
                <AlertCircle className="size-4" /> No-Go
              </span>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tasks */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Pilot Implementation Tasks</CardTitle>
          <CardDescription>Track completion of key action items.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[30px]">Done</TableHead>
                <TableHead>Task</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead>Due Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => toggleTask(task.id)}
                    />
                  </TableCell>
                  <TableCell
                    className={task.completed ? "line-through text-muted-foreground" : ""}
                  >
                    {task.description}
                  </TableCell>
                  <TableCell>{task.assignee}</TableCell>
                  <TableCell>{task.dueDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Timeline</CardTitle>
          <CardDescription>Key milestones and progress.</CardDescription>
        </CardHeader>
        <CardContent>
          <Timeline>
            {milestones.map((milestone, index) => (
              <TimelineEventItem
                key={milestone.id}
                event={{
                  id: milestone.id,
                  title: milestone.label,
                  description: milestone.description,
                  status: milestone.status,
                  timestamp: new Date(milestone.date),
                }}
                showTimestamp
                isLast={index === milestones.length - 1}
              />
            ))}
          </Timeline>
        </CardContent>
      </Card>

      {/* Checkpoint */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Go/No-Go Checkpoint</CardTitle>
          <CardDescription>Decision point after pilot completion.</CardDescription>
        </CardHeader>
        <CardContent>
          <Checkpoint>
            <CheckpointIcon />
            <CheckpointTrigger tooltip="Evaluate pilot results and decide next steps">
              <span className="text-sm font-medium">Pilot Evaluation</span>
            </CheckpointTrigger>
          </Checkpoint>
          <div className="mt-4 flex gap-2">
            <Button
              variant={checkpointPassed === true ? "default" : "outline"}
              onClick={() => setCheckpointPassed(true)}
            >
              <CheckCircle className="mr-2 size-4" /> Go
            </Button>
            <Button
              variant={checkpointPassed === false ? "destructive" : "outline"}
              onClick={() => setCheckpointPassed(false)}
            >
              <AlertCircle className="mr-2 size-4" /> No-Go
            </Button>
            {checkpointPassed !== null && (
              <Button variant="ghost" onClick={() => setCheckpointPassed(null)}>
                Reset
              </Button>
            )}
          </div>
          {checkpointPassed === true && (
            <div className="mt-2 rounded-lg bg-green-50 p-2 text-sm text-green-700 dark:bg-green-950 dark:text-green-300">
              ✅ Go decision recorded. Proceed with full-scale implementation.
            </div>
          )}
          {checkpointPassed === false && (
            <div className="mt-2 rounded-lg bg-red-50 p-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
              ❌ No-Go decision. Revise pilot plan or escalate.
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">AI Insights</CardTitle>
          <CardDescription>Real-time recommendations.</CardDescription>
        </CardHeader>
        <CardContent>
          <Suggestions>
            {getSuggestions().map((s, i) => (
              <Suggestion key={i} suggestion={s} variant="outline" className="text-xs" />
            ))}
          </Suggestions>
        </CardContent>
      </Card>

      {/* Task list as collapsible Task component (optional) */}
      <Task defaultOpen={false}>
        <TaskTrigger title="Detailed Action Items" />
        <TaskContent>
          {tasks.map((task) => (
            <TaskItem key={task.id}>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => toggleTask(task.id)}
                />
                <span className={task.completed ? "line-through text-muted-foreground" : ""}>
                  {task.description}
                </span>
                <Badge variant="outline" className="ml-auto">
                  {task.assignee}
                </Badge>
              </div>
            </TaskItem>
          ))}
        </TaskContent>
      </Task>

      {/* Sources */}
      <Sources>
        <SourcesTrigger count={2} />
        <SourcesContent>
          <Source title="Pilot Implementation Plan" href="/dashboard/documents/templates" />
          <Source title="Data Collection Guidelines" href="/dashboard/documents/repository" />
        </SourcesContent>
      </Sources>
    </div>
  );
}