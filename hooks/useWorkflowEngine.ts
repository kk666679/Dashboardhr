import { useState, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from "uuid";

interface WorkflowTask {
  id: string;
  name: string;
  status: "pending" | "running" | "completed" | "failed" | "skipped";
  assignee?: string;
  dueDate?: Date;
}

interface WorkflowExecution {
  id: string;
  name: string;
  tasks: WorkflowTask[];
  status: "idle" | "running" | "paused" | "completed" | "failed" | "cancelled";
  startTime: Date;
  endTime?: Date;
  currentTaskIndex: number;
  logs: string[];
}

export function useWorkflowEngine() {
  const { toast } = useToast();
  const [executions, setExecutions] = useState<WorkflowExecution[]>([]);

  const startWorkflow = useCallback((name: string, tasks: Omit<WorkflowTask, "status">[]) => {
    const execution: WorkflowExecution = {
      id: uuidv4(),
      name,
      tasks: tasks.map((t) => ({ ...t, status: "pending" as const })),
      status: "running",
      startTime: new Date(),
      currentTaskIndex: 0,
      logs: [`[${new Date().toISOString()}] Workflow "${name}" started`],
    };
    setExecutions((prev) => [...prev, execution]);
    toast({ title: `Workflow "${name}" started` });
    return execution.id;
  }, [toast]);

  const completeTask = useCallback((executionId: string, taskId: string, result?: any) => {
    setExecutions((prev) =>
      prev.map((ex) => {
        if (ex.id !== executionId) return ex;
        const tasks = ex.tasks.map((t) =>
          t.id === taskId ? { ...t, status: "completed" as const } : t
        );
        const allCompleted = tasks.every((t) => t.status === "completed" || t.status === "skipped");
        const newLog = `[${new Date().toISOString()}] Task "${tasks.find(t => t.id === taskId)?.name}" completed`;
        return {
          ...ex,
          tasks,
          status: allCompleted ? "completed" : ex.status,
          logs: [...ex.logs, newLog],
          endTime: allCompleted ? new Date() : ex.endTime,
          currentTaskIndex: allCompleted ? ex.tasks.length : ex.currentTaskIndex + 1,
        };
      })
    );
    toast({ title: "Task completed" });
  }, [toast]);

  const failTask = useCallback((executionId: string, taskId: string, error?: string) => {
    setExecutions((prev) =>
      prev.map((ex) => {
        if (ex.id !== executionId) return ex;
        const tasks = ex.tasks.map((t) =>
          t.id === taskId ? { ...t, status: "failed" as const } : t
        );
        const newLog = `[${new Date().toISOString()}] Task "${tasks.find(t => t.id === taskId)?.name}" failed${error ? `: ${error}` : ""}`;
        return {
          ...ex,
          tasks,
          status: "failed",
          logs: [...ex.logs, newLog],
          endTime: new Date(),
        };
      })
    );
    toast({ title: "Task failed", variant: "destructive" });
  }, [toast]);

  const skipTask = useCallback((executionId: string, taskId: string) => {
    setExecutions((prev) =>
      prev.map((ex) => {
        if (ex.id !== executionId) return ex;
        const tasks = ex.tasks.map((t) =>
          t.id === taskId ? { ...t, status: "skipped" as const } : t
        );
        const allCompleted = tasks.every((t) => t.status === "completed" || t.status === "skipped");
        const newLog = `[${new Date().toISOString()}] Task "${tasks.find(t => t.id === taskId)?.name}" skipped`;
        return {
          ...ex,
          tasks,
          status: allCompleted ? "completed" : ex.status,
          logs: [...ex.logs, newLog],
          currentTaskIndex: allCompleted ? ex.tasks.length : ex.currentTaskIndex + 1,
        };
      })
    );
    toast({ title: "Task skipped" });
  }, [toast]);

  const pauseWorkflow = useCallback((executionId: string) => {
    setExecutions((prev) =>
      prev.map((ex) => {
        if (ex.id === executionId && ex.status === "running") {
          return { ...ex, status: "paused" };
        }
        return ex;
      })
    );
    toast({ title: "Workflow paused" });
  }, [toast]);

  const resumeWorkflow = useCallback((executionId: string) => {
    setExecutions((prev) =>
      prev.map((ex) => {
        if (ex.id === executionId && ex.status === "paused") {
          return { ...ex, status: "running" };
        }
        return ex;
      })
    );
    toast({ title: "Workflow resumed" });
  }, [toast]);

  const cancelWorkflow = useCallback((executionId: string) => {
    setExecutions((prev) =>
      prev.map((ex) => {
        if (ex.id === executionId) {
          return { ...ex, status: "cancelled", endTime: new Date() };
        }
        return ex;
      })
    );
    toast({ title: "Workflow cancelled" });
  }, [toast]);

  const getExecution = useCallback((id: string) => {
    return executions.find((ex) => ex.id === id);
  }, [executions]);

  const getLogs = useCallback((id: string) => {
    const ex = getExecution(id);
    return ex?.logs || [];
  }, [getExecution]);

  return {
    executions,
    startWorkflow,
    completeTask,
    failTask,
    skipTask,
    pauseWorkflow,
    resumeWorkflow,
    cancelWorkflow,
    getExecution,
    getLogs,
  };
}
