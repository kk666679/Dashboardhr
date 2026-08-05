"use client";

import { trpc } from "@/lib/trpc";
import { useMemo, useCallback } from "react";
import { safeQuery, safeQueryArray, safeMutation } from "./safe";

// ─── Type Definitions ────────────────────────────────────────────────────────

// Workflow types
interface Workflow {
  id: string;
  name: string;
  description: string | null;
  version: number;
  isActive: boolean;
  module: string;
  graphJson: WorkflowGraph;
  slaConfig: Record<string, WorkflowSLAConfig> | null;
  createdAt: Date;
  updatedAt: Date;
}

interface WorkflowGraph {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

interface WorkflowNode {
  id: string;
  type: "start" | "approval" | "parallel" | "condition" | "action" | "end";
  data: {
    label: string;
    assigneeRole?: string;
    assigneeId?: string;
    slaMinutes?: number;
    fallbackAssigneeId?: string;
    conditionExpression?: string;
    actionType?: string;
    quorum?: number;
  };
  position: { x: number; y: number };
}

interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  label?: "approved" | "rejected" | "true" | "false";
}

interface WorkflowSLAConfig {
  durationMinutes: number;
  fallbackAssigneeId?: string;
}

// Workflow Instance types
interface WorkflowInstance {
  id: string;
  workflowId: string;
  entityType: string;
  entityId: string;
  status: "ACTIVE" | "COMPLETED" | "REJECTED" | "ESCALATED";
  currentStepId: string | null;
  context: Record<string, unknown>;
  startedAt: Date;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  workflow: Workflow;
  steps: WorkflowInstanceStep[];
}

interface WorkflowInstanceStep {
  id: string;
  instanceId: string;
  stepId: string;
  stepName: string;
  assigneeId: string | null;
  assigneeRole: string | null;
  status: "ACTIVE" | "COMPLETED" | "REJECTED" | "ESCALATED" | "DONE";
  slaDeadline: Date | null;
  quorum: number;
  decidedBy: string | null;
  decision: "APPROVED" | "REJECTED" | null;
  comment: string | null;
  decidedAt: Date | null;
  createdAt: Date;
}

// Workflow Task types
interface WorkflowTask {
  id: string;
  instanceId: string;
  stepId: string;
  title: string;
  description: string | null;
  assigneeId: string | null;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "REJECTED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// Query and Mutation types
interface WorkflowFilters {
  module?: string;
  isActive?: boolean;
  search?: string;
}

interface WorkflowCreateInput {
  name: string;
  module: string;
  graphJson: WorkflowGraph;
  slaConfig?: Record<string, WorkflowSLAConfig>;
  isActive?: boolean;
}

interface WorkflowUpdateInput {
  id: string;
  name?: string;
  graphJson?: WorkflowGraph;
  slaConfig?: Record<string, WorkflowSLAConfig>;
  isActive?: boolean;
}

interface InstanceFilters {
  status?: "ACTIVE" | "COMPLETED" | "REJECTED" | "ESCALATED";
  entityType?: string;
  entityId?: string;
}

interface InstanceStartInput {
  workflowId: string;
  entityType: string;
  entityId: string;
  context?: Record<string, unknown>;
}

interface TaskCompleteInput {
  taskId: string;
  decision?: "APPROVED" | "REJECTED";
  comment?: string;
}

interface TaskAssignInput {
  taskId: string;
  assigneeId: string;
}

// ─── Hook ──────────────────────────────────────────────────────────────────

export function useWorkflow() {
  const workflow = trpc.workflowEngine as any;
  const utils = trpc.useUtils();

  // Helper functions for invalidation
  const invalidate = {
    workflows: () => {
      utils.workflowEngine.listDefinitions.invalidate();
    },
    workflow: (id: string) => {
      utils.workflowEngine.getDefinition.invalidate({ id });
    },
    instances: () => {
      utils.workflowEngine.getActiveWorkflows.invalidate({});
    },
    all: async () => {
      await Promise.all([
        utils.workflowEngine.listDefinitions.invalidate(),
      ]);
    },
  };

  // Helper functions for prefetching
  const prefetch = {
    workflows: (filters?: WorkflowFilters) => {
      return utils.workflowEngine.listDefinitions.prefetch(filters ?? {});
    },
    workflow: (id: string) => {
      return utils.workflowEngine.getDefinition.prefetch({ id });
    },
    instances: () => {
      return utils.workflowEngine.getActiveWorkflows.prefetch({});
    },
  };

  // Helper function to set workflow data in cache
  const setCache = {
    workflow: (id: string, data: Workflow) => {
      utils.workflowEngine.getDefinition.setData({ id }, data);
    },
    workflows: (data: Workflow[]) => {
      utils.workflowEngine.listDefinitions.setData(undefined, data);
    },
    instances: (data: WorkflowInstance[]) => {
      utils.workflowEngine.getActiveWorkflows.setData({}, data as any);
    },
  };

  const workflows = useMemo(() => ({
    getAll: safeQueryArray(workflow?.listDefinitions?.useQuery),
    getById: safeQuery(workflow?.getDefinition?.useQuery),
    create: safeMutation(workflow?.saveDefinition?.useMutation),
  }), [workflow]);

  const instances = useMemo(() => ({
    getActive: safeQueryArray(workflow?.getActiveWorkflows?.useQuery),
    start: safeMutation(workflow?.triggerWorkflow?.useMutation),
    getById: safeQuery(workflow?.getInstance?.useQuery),
    listAll: safeQueryArray(workflow?.listInstances?.useQuery),
  }), [workflow]);

  const tasks = useMemo(() => ({
    submitDecision: safeMutation(workflow?.submitDecision?.useMutation),
  }), [workflow]);

  // High-level workflow operations with error handling
  const startWorkflow = useCallback(async (input: InstanceStartInput) => {
    try {
      const result = await instances.start.mutateAsync(input as any);
      await invalidate.instances();
      return result;
    } catch (error) {
      console.error("Failed to start workflow:", error);
      throw error;
    }
  }, [instances, invalidate]);

  const completeTask = useCallback(async (input: TaskCompleteInput) => {
    try {
      const result = await tasks.submitDecision.mutateAsync(input as any);
      await invalidate.instances();
      return result;
    } catch (error) {
      console.error("Failed to complete task:", error);
      throw error;
    }
  }, [tasks, invalidate]);

  // Utility to check if a workflow is running
  const isWorkflowActive = useCallback((status: string): boolean => {
    return status === "ACTIVE";
  }, []);

  // Utility to get the current step of an instance
  const getCurrentStep = useCallback((instance: WorkflowInstance): WorkflowInstanceStep | null => {
    if (!instance.currentStepId || !instance.steps) return null;
    return instance.steps.find((step: WorkflowInstanceStep) => step.stepId === instance.currentStepId) || null;
  }, []);

  return {
    // Core query/mutation objects
    workflows,
    instances,
    tasks,
    
    // Utility functions
    invalidate,
    prefetch,
    setCache,
    
    // High-level operations
    startWorkflow,
    completeTask,
    
    // Utility helpers
    isWorkflowActive,
    getCurrentStep,
    
    // Raw utils for advanced use
    utils,
  };
}

// ─── Type Exports ────────────────────────────────────────────────────────────

export type {
  Workflow,
  WorkflowGraph,
  WorkflowNode,
  WorkflowEdge,
  WorkflowSLAConfig,
  WorkflowInstance,
  WorkflowInstanceStep,
  WorkflowTask,
  WorkflowFilters,
  WorkflowCreateInput,
  WorkflowUpdateInput,
  InstanceFilters,
  InstanceStartInput,
  TaskCompleteInput,
  TaskAssignInput,
};

