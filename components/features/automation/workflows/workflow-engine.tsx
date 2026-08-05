"use client";

import { useState, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";

interface WorkflowTask {
  id: string;
  name: string;
  status: "pending" | "running" | "completed" | "failed";
  assignee?: string;
}

interface WorkflowExecution {
  id: string;
  name: string;
  tasks: WorkflowTask[];
  status: "idle" | "running" | "paused" | "completed" | "failed";
}

export function useWorkflowEngine() {
  const { toast } = useToast();
  const [executions, setExecutions] = useState<WorkflowExecution[]>([]);

  const startWorkflow = useCallback((name: string, tasks: Omit<WorkflowTask, "status">[]) => {
    const execution: WorkflowExecution = {
      id: Date.now().toString(),
      name,
      tasks: tasks.map((t) => ({ ...t, status: "pending" as const })),
      status: "running",
    };
    setExecutions((prev) => [...prev, execution]);
    toast({ title: `Workflow "${name}" started` });
    return execution.id;
  }, [toast]);

  const completeTask = useCallback((executionId: string, taskId: string) => {
    setExecutions((prev) =>
      prev.map((ex) => {
        if (ex.id !== executionId) return ex;
        const tasks = ex.tasks.map((t) =>
          t.id === taskId ? { ...t, status: "completed" as const } : t
        );
        // Check if all tasks completed
        const allCompleted = tasks.every((t) => t.status === "completed");
        return {
          ...ex,
          tasks,
          status: allCompleted ? "completed" : ex.status,
        };
      })
    );
    toast({ title: "Task completed" });
  }, [toast]);

  const failTask = useCallback((executionId: string, taskId: string) => {
    setExecutions((prev) =>
      prev.map((ex) => {
        if (ex.id !== executionId) return ex;
        const tasks = ex.tasks.map((t) =>
          t.id === taskId ? { ...t, status: "failed" as const } : t
        );
        return { ...ex, tasks, status: "failed" };
      })
    );
    toast({ title: "Task failed", variant: "destructive" });
  }, [toast]);

  const pauseWorkflow = useCallback((executionId: string) => {
    setExecutions((prev) =>
      prev.map((ex) => (ex.id === executionId ? { ...ex, status: "paused" } : ex))
    );
    toast({ title: "Workflow paused" });
  }, [toast]);

  const resumeWorkflow = useCallback((executionId: string) => {
    setExecutions((prev) =>
      prev.map((ex) => (ex.id === executionId ? { ...ex, status: "running" } : ex))
    );
    toast({ title: "Workflow resumed" });
  }, [toast]);

  return {
    executions,
    startWorkflow,
    completeTask,
    failTask,
    pauseWorkflow,
    resumeWorkflow,
  };
}

// Export a component wrapper for the engine if needed
export function WorkflowEngineProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
