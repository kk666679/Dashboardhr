"use client";

import { useEffect, useState } from "react";
import { useWorkflowStore } from "@/lib/zustand/workflow-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  Play,
  Pause,
  Square,
  Loader2,
  CheckCircle2,
  XCircle,
  SkipForward,
  Circle,
  RotateCcw,
  Terminal,
} from "lucide-react";

type NodeRunState = "pending" | "running" | "success" | "failed" | "skipped";

interface FlowStudioExecutionPanelProps {
  onClose?: () => void;
  className?: string;
  /** When true, renders as a compact overlay (mobile bottom sheet style) */
  compact?: boolean;
}

/**
 * Live Execution Panel — integrated into the Studio.
 *
 * Shows:
 *  - Live node execution states (Pending / Running / Success / Failed / Skipped)
 *  - Animated progress indicators + status badges
 *  - Execution log stream
 *  - Controls (Run / Pause / Stop / Retry)
 */
export function FlowStudioExecutionPanel({ onClose, className, compact = false }: FlowStudioExecutionPanelProps) {
  const nodes = useWorkflowStore((s) => s.nodes);
  const executionStatus = useWorkflowStore((s) => s.executionStatus);
  const startExecution = useWorkflowStore((s) => s.startExecution);
  const pauseExecution = useWorkflowStore((s) => s.pauseExecution);
  const resumeExecution = useWorkflowStore((s) => s.resumeExecution);
  const completeExecution = useWorkflowStore((s) => s.completeExecution);
  const failExecution = useWorkflowStore((s) => s.failExecution);

  const [nodeStates, setNodeStates] = useState<Record<string, NodeRunState>>({});
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  const isRunning = executionStatus === "running";
  const isPaused = executionStatus === "paused";

  // Simulate execution by walking through nodes sequentially
  useEffect(() => {
    if (!isRunning) return;
    setNodeStates({});
    setProgress(0);
    setLogs(["Execution started"]);
    let current = 0;
    const timer = setInterval(() => {
      setNodeStates((prev) => {
        const next = { ...prev };
        // Complete previous
        if (current > 0) {
          const prevId = nodes[current - 1]?.id;
          if (prevId) next[prevId] = "success";
        }
        const node = nodes[current];
        if (!node) {
          clearInterval(timer);
          completeExecution();
          setLogs((l) => [...l, "Execution completed ✓"]);
          return next;
        }
        next[node.id] = "running";
        setLogs((l) => [...l, `▶ Running: ${node.data?.label ?? node.id}`]);
        setProgress(Math.round(((current + 1) / nodes.length) * 100));
        current += 1;
        return next;
      });
    }, 1200);
    return () => clearInterval(timer);
  }, [isRunning, nodes, completeExecution]);

  const handleRun = () => {
    if (executionStatus === "paused") {
      resumeExecution();
      setLogs((l) => [...l, "Resumed"]);
    } else {
      startExecution();
    }
  };

  const handleStop = () => {
    failExecution();
    setNodeStates((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((k) => {
        if (next[k] === "running") next[k] = "failed";
      });
      return next;
    });
    setLogs((l) => [...l, "Execution stopped ✕"]);
  };

  const handleReset = () => {
    setNodeStates({});
    setProgress(0);
    setLogs([]);
    completeExecution();
  };

  const statusBadge = {
    idle: <Badge variant="outline" className="text-[10px]">Idle</Badge>,
    running: <Badge variant="outline" className="text-[10px] text-green-600 border-green-500 animate-pulse">Running</Badge>,
    paused: <Badge variant="outline" className="text-[10px] text-yellow-600 border-yellow-500">Paused</Badge>,
    completed: <Badge variant="outline" className="text-[10px] text-green-600 border-green-500">Completed</Badge>,
    failed: <Badge variant="outline" className="text-[10px] text-red-600 border-red-500">Failed</Badge>,
  }[executionStatus];

  return (
    <div className={cn("flex flex-col h-full bg-background/95 backdrop-blur-md border rounded-xl shadow-lg", compact && "rounded-t-xl rounded-b-none border-b-0", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-slate-500" />
          <span className="text-sm font-semibold">Execution</span>
          {statusBadge}
        </div>
        <div className="flex items-center gap-1">
          {isRunning && (
            <Button variant="ghost" size="icon-sm" onClick={pauseExecution} title="Pause">
              <Pause className="h-3.5 w-3.5" />
            </Button>
          )}
          {isPaused && (
            <Button variant="ghost" size="icon-sm" onClick={resumeExecution} title="Resume">
              <Play className="h-3.5 w-3.5" />
            </Button>
          )}
          {(isRunning || isPaused) && (
            <Button variant="ghost" size="icon-sm" onClick={handleStop} title="Stop" className="text-red-600">
              <Square className="h-3.5 w-3.5" />
            </Button>
          )}
          {onClose && (
            <Button variant="ghost" size="icon-sm" onClick={onClose} title="Close">
              <XIcon />
            </Button>
          )}
        </div>
      </div>

      {/* Progress */}
      <div className="p-3 border-b">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-muted-foreground">Progress</span>
          <span className="text-xs font-medium">{progress}%</span>
        </div>
        <Progress value={progress} className="h-1.5" />
        <Button size="sm" variant="outline" className="w-full gap-1.5 mt-2" onClick={handleRun}>
          {isRunning ? (
            <><Pause className="h-3.5 w-3.5" /> Running…</>
          ) : isPaused ? (
            <><Play className="h-3.5 w-3.5" /> Resume</>
          ) : (
            <><Play className="h-3.5 w-3.5" /> Run Workflow</>
          )}
        </Button>
        {executionStatus === "failed" && (
          <Button size="sm" variant="ghost" className="w-full gap-1.5 mt-1.5" onClick={handleReset}>
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </Button>
        )}
      </div>

      {/* Node states */}
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-1.5">
          <div className="text-xs font-medium text-muted-foreground mb-2">Node States</div>
          {nodes.length === 0 && (
            <p className="text-xs text-muted-foreground p-2">No nodes on canvas yet.</p>
          )}
          {nodes.map((node) => {
            const state = nodeStates[node.id] ?? (executionStatus === "completed" ? "success" : "pending");
            return (
              <NodeStateRow key={node.id} label={node.data?.label ?? node.id} state={state} compact={compact} />
            );
          })}
        </div>
      </ScrollArea>

      {/* Logs */}
      {logs.length > 0 && (
        <div className="border-t p-3">
          <div className="text-xs font-medium text-muted-foreground mb-1.5">Logs</div>
          <div className="max-h-28 overflow-y-auto space-y-0.5 font-mono text-[10px]">
            {logs.map((log, i) => (
              <div key={i} className="text-muted-foreground">{log}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function XIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function NodeStateRow({ label, state, compact }: { label: string; state: NodeRunState; compact?: boolean }) {
  const meta = {
    pending: { icon: <Circle className="h-3.5 w-3.5 text-slate-400" />, label: "Pending", cls: "text-muted-foreground" },
    running: { icon: <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-500" />, label: "Running", cls: "text-blue-600" },
    success: { icon: <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />, label: "Success", cls: "text-green-600" },
    failed: { icon: <XCircle className="h-3.5 w-3.5 text-red-500" />, label: "Failed", cls: "text-red-600" },
    skipped: { icon: <SkipForward className="h-3.5 w-3.5 text-slate-400" />, label: "Skipped", cls: "text-slate-500" },
  }[state];

  return (
    <div className={cn("flex items-center gap-2 rounded-lg border bg-muted/30 px-2 py-1.5", state === "running" && "border-blue-300 bg-blue-50/50 dark:bg-blue-950/20")}>
      <span className={cn("shrink-0", meta.cls)}>{meta.icon}</span>
      <span className={cn("text-xs font-medium truncate flex-1", compact ? "text-[11px]" : "text-xs")}>{label}</span>
      <span className={cn("text-[10px] shrink-0", meta.cls)}>{meta.label}</span>
    </div>
  );
}
