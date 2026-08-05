/**
 * useBusinessEventPipeline — End-to-end pipeline hook for AHROS.
 *
 * Wires: Conversation → Planning → Execution → Compliance → Knowledge → Memory
 *
 * Accepts a business event and runs it through the full pipeline,
 * creating synchronized artifacts at each stage via the EventBus.
 *
 * Features:
 *  - Streaming plan generation
 *  - Incremental execution with step-by-step updates
 *  - Auto compliance checking on completion
 *  - Checkpoint creation at key moments
 *  - Learning capture for continuous improvement
 *  - Knowledge tree artifact generation
 */

"use client";

import { useCallback, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { useAhrosStore } from "@/lib/zustand/ahros-store";
import { useMemoryStore } from "@/lib/zustand/memory-store";
import { getEventBus } from "@/lib/ahros/event-bus";
import { getArtifactRegistry } from "@/lib/ahros/artifact-registry";
import {
  DefaultPlanner,
  DefaultExecutionEngine,
  DefaultComplianceReporter,
  DefaultSopGenerator,
} from "@/lib/ahros/orchestrator";
import type {
  BusinessEvent,
  BusinessEventType,
  Plan,
  PlanTask,
  ExecutionStep,
  ExecutionState,
  ComplianceReport,
  ComplianceCheck,
  SyncEventType,
  ArtifactType,
  ArtifactRecord,
} from "@/lib/ahros/types";

// ─── Pipeline Status ─────────────────────────────────────────────────────────

export type PipelineStage =
  | "idle"
  | "conversation"
  | "planning"
  | "workflow"
  | "reasoning"
  | "execution"
  | "compliance"
  | "checkpoint"
  | "sop"
  | "knowledge"
  | "memory"
  | "completed"
  | "error";

export interface PipelineState {
  stage: PipelineStage;
  conversationArtifactId: string | null;
  planArtifactId: string | null;
  workflowArtifactId: string | null;
  timelineArtifactId: string | null;
  complianceArtifactId: string | null;
  checkpointArtifactId: string | null;
  sopArtifactId: string | null;
  knowledgeArtifactId: string | null;
  error: string | null;
}

// ─── Pipeline Hook ───────────────────────────────────────────────────────────

export function useBusinessEventPipeline() {
  const store = useAhrosStore();
  const memory = useMemoryStore();
  const pipelineRef = useRef<PipelineState>({
    stage: "idle",
    conversationArtifactId: null,
    planArtifactId: null,
    workflowArtifactId: null,
    timelineArtifactId: null,
    complianceArtifactId: null,
    checkpointArtifactId: null,
    sopArtifactId: null,
    knowledgeArtifactId: null,
    error: null,
  });

  const planners = useRef({
    planner: new DefaultPlanner(),
    executionEngine: new DefaultExecutionEngine(),
    complianceReporter: new DefaultComplianceReporter(),
    sopGenerator: new DefaultSopGenerator(),
  });

  const updateStage = useCallback(
    (stage: PipelineStage) => {
      pipelineRef.current = { ...pipelineRef.current, stage };
      store.setStatus(
        stage === "execution"
          ? "executing"
          : stage === "completed"
            ? "completed"
            : stage === "error"
              ? "error"
              : "processing",
      );
    },
    [store],
  );

  const processEvent = useCallback(
    async (event: Omit<BusinessEvent, "id" | "timestamp">) => {
      const fullEvent: BusinessEvent = {
        ...event,
        id: uuidv4(),
        timestamp: new Date(),
      };

      const registry = getArtifactRegistry();
      const bus = getEventBus();
      const { planner, executionEngine, complianceReporter, sopGenerator } =
        planners.current;

      try {
        // ── 1. Conversation ──────────────────────────────────────────────
        updateStage("conversation");
        store.setActiveEvent(fullEvent);

        const conversationArtifact = registry.create(
          "conversation",
          `Conversation: ${fullEvent.title}`,
          {
            event: fullEvent,
            messages: [
              {
                role: "system",
                content: `Processing ${fullEvent.type}: ${fullEvent.description}`,
                timestamp: new Date(),
              },
            ],
          },
          {
            tags: [fullEvent.type, fullEvent.priority.toLowerCase()],
            createdBy: fullEvent.initiatedBy,
          },
        );
        store.registerArtifact(conversationArtifact.meta.id);
        pipelineRef.current.conversationArtifactId = conversationArtifact.meta.id;

        // ── 2. Planning ─────────────────────────────────────────────────
        updateStage("planning");
        const plan = await planner.generatePlan(fullEvent);
        store.setPlan(plan);

        const planArtifact = registry.create(
          "plan",
          `Plan: ${plan.goal}`,
          plan,
          {
            parentId: conversationArtifact.meta.id,
            tags: [fullEvent.type],
          },
        );
        store.registerArtifact(planArtifact.meta.id);
        pipelineRef.current.planArtifactId = planArtifact.meta.id;

        await bus.publish({
          type: "PLAN_GENERATED",
          artifactId: planArtifact.meta.id,
          artifactType: "plan",
          payload: {
            goal: plan.goal,
            taskCount: plan.tasks.length,
            confidence: plan.confidence,
          },
          source: "pipeline",
        });

        // ── 3. Workflow Blueprint ───────────────────────────────────────
        updateStage("workflow");
        const workflowArtifact = registry.create(
          "workflow",
          `Workflow: ${plan.goal}`,
          {
            tasks: plan.tasks,
            dependencies: plan.dependencies,
            totalEstimatedDuration: plan.totalEstimatedDuration,
            riskScore: plan.riskScore,
            mermaid: generateMermaidWorkflow(plan),
          },
          { parentId: planArtifact.meta.id },
        );
        store.registerArtifact(workflowArtifact.meta.id);
        pipelineRef.current.workflowArtifactId = workflowArtifact.meta.id;

        // ── 4. Reasoning ────────────────────────────────────────────────
        updateStage("reasoning");
        registry.create(
          "reasoning",
          `AI Reasoning: ${plan.goal}`,
          {
            goal: plan.goal,
            confidence: plan.confidence,
            riskScore: plan.riskScore,
            taskCount: plan.tasks.length,
            estimatedDuration: plan.totalEstimatedDuration,
            decisionLog: [
              {
                step: "plan_generation",
                outcome: `Plan created with ${plan.tasks.length} tasks`,
                confidence: plan.confidence,
                timestamp: new Date(),
              },
            ],
          },
          { parentId: planArtifact.meta.id },
        );

        // ── 5. Execution ────────────────────────────────────────────────
        updateStage("execution");
        store.initExecution(fullEvent.id, plan.id);
        store.startExecution();

        const executionState = await executionEngine.initialize(
          fullEvent.id,
          plan,
        );

        const timelineArtifact = registry.create(
          "timeline",
          `Timeline: ${fullEvent.title}`,
          executionState,
          { parentId: conversationArtifact.meta.id },
        );
        store.registerArtifact(timelineArtifact.meta.id);
        pipelineRef.current.timelineArtifactId = timelineArtifact.meta.id;

        // Execute steps with streaming updates
        while (executionEngine.canProceed(executionState)) {
          const nextStep = executionEngine.getNextStep(executionState);
          if (nextStep === null) break;

          await bus.publish({
            type: "EXECUTION_STEP_COMPLETED",
            artifactId: timelineArtifact.meta.id,
            artifactType: "timeline",
            payload: { stepIndex: nextStep, status: "running" },
            source: "pipeline",
          });

          const stepResult = await executionEngine.executeStep(
            executionState,
            nextStep,
          );
          store.addExecutionStep(stepResult);

          // Register human approval steps
          if (stepResult.status === "waiting_approval") {
            store.setStatus("paused");
            // Wait for human approval (simulated for now)
            await new Promise((resolve) => setTimeout(resolve, 2000));
            stepResult.status = "approved";
            store.updateExecutionStep(stepResult.id, { status: "approved" });
            store.setStatus("executing");
          }

          registry.update(timelineArtifact.meta.id, executionState);

          // Auto-checkpoint after every 3 steps
          if (executionState.steps.length % 3 === 0) {
            await createCheckpoint(
              registry,
              bus,
              fullEvent,
              plan,
              executionState,
            );
          }
        }

        // Complete execution
        store.completeExecution();
        executionState.status = "completed";
        executionState.completedAt = new Date();
        registry.update(timelineArtifact.meta.id, executionState);

        await bus.publish({
          type: "EXECUTION_COMPLETED",
          artifactId: timelineArtifact.meta.id,
          artifactType: "timeline",
          payload: {
            totalSteps: executionState.steps.length,
            totalDuration: executionState.completedAt
              ? Math.round(
                  (executionState.completedAt.getTime() -
                    (executionState.startedAt?.getTime() ?? Date.now())) /
                    1000,
                )
              : 0,
          },
          source: "pipeline",
        });

        // ── 6. Compliance ───────────────────────────────────────────────
        updateStage("compliance");
        const complianceReport = await complianceReporter.generateReport(
          fullEvent,
          executionState,
        );
        store.setComplianceReport(complianceReport);

        const complianceArtifact = registry.create(
          "compliance",
          `Compliance: ${fullEvent.title}`,
          complianceReport,
          { parentId: conversationArtifact.meta.id },
        );
        store.registerArtifact(complianceArtifact.meta.id);
        pipelineRef.current.complianceArtifactId = complianceArtifact.meta.id;

        await bus.publish({
          type: "COMPLIANCE_CHECKED",
          artifactId: complianceArtifact.meta.id,
          artifactType: "compliance",
          payload: {
            score: complianceReport.score,
            status: complianceReport.overallStatus,
          },
          source: "pipeline",
        });

        // ── 7. Checkpoint ───────────────────────────────────────────────
        updateStage("checkpoint");
        await createCheckpoint(
          registry,
          bus,
          fullEvent,
          plan,
          executionState,
          complianceReport,
        );

        // ── 8. SOP Generation ───────────────────────────────────────────
        updateStage("sop");
        const sopContent = await sopGenerator.generateSop(
          fullEvent,
          executionState,
          complianceReport,
        );

        const sopArtifact = registry.create(
          "sop",
          `SOP: ${fullEvent.title}`,
          { content: sopContent, generatedAt: new Date() },
          { parentId: conversationArtifact.meta.id },
        );
        store.registerArtifact(sopArtifact.meta.id);
        pipelineRef.current.sopArtifactId = sopArtifact.meta.id;

        // ── 9. Knowledge Tree ───────────────────────────────────────────
        updateStage("knowledge");
        const knowledgeArtifact = registry.create(
          "knowledge-tree",
          `Knowledge: ${fullEvent.title}`,
          buildKnowledgeTree(fullEvent, pipelineRef.current),
          { parentId: conversationArtifact.meta.id },
        );
        store.registerArtifact(knowledgeArtifact.meta.id);
        pipelineRef.current.knowledgeArtifactId = knowledgeArtifact.meta.id;

        // ── 10. Memory / Learning ───────────────────────────────────────
        updateStage("memory");

        // Capture learning event
        memory.addLearningEvent({
          type: "execution_success",
          source: "pipeline",
          context: `${fullEvent.type}:${fullEvent.title}`,
          outcome: `Completed ${executionState.steps.length} steps with ${complianceReport.score}% compliance`,
          recommendation:
            complianceReport.score < 80
              ? `Improve compliance: ${complianceReport.checks.filter((c) => c.status === "fail" || c.status === "warning").length} issues found`
              : "Standard workflow executed successfully",
          applied: false,
          tags: [fullEvent.type, `compliance:${complianceReport.score}`],
        });

        // Save to memory store for pattern recognition
        memory.setEntry(
          `workflow:${fullEvent.type}`,
          {
            eventType: fullEvent.type,
            steps: executionState.steps.length,
            complianceScore: complianceReport.score,
            duration: executionState.completedAt
              ? Math.round(
                  (executionState.completedAt.getTime() -
                    (executionState.startedAt?.getTime() ?? Date.now())) /
                    1000,
                )
              : 0,
          },
          { type: "pattern", confidence: 0.85 },
        );

        await bus.publish({
          type: "MEMORY_UPDATED",
          artifactId: sopArtifact.meta.id,
          artifactType: "sop",
          payload: {
            eventType: fullEvent.type,
            complianceScore: complianceReport.score,
          },
          source: "pipeline",
        });

        // ── Complete ────────────────────────────────────────────────────
        updateStage("completed");
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : "Unknown pipeline error";
        pipelineRef.current = { ...pipelineRef.current, error: errorMsg };
        store.setError(errorMsg);
        updateStage("error");
      }
    },
    [store, memory, updateStage],
  );

  const pipelineState = pipelineRef.current;

  return {
    processEvent,
    pipelineState,
    reset: useCallback(() => {
      pipelineRef.current = {
        stage: "idle",
        conversationArtifactId: null,
        planArtifactId: null,
        workflowArtifactId: null,
        timelineArtifactId: null,
        complianceArtifactId: null,
        checkpointArtifactId: null,
        sopArtifactId: null,
        knowledgeArtifactId: null,
        error: null,
      };
    }, []),
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function createCheckpoint(
  registry: ReturnType<typeof getArtifactRegistry>,
  bus: ReturnType<typeof getEventBus>,
  event: BusinessEvent,
  plan: Plan,
  executionState: ExecutionState,
  complianceReport?: ComplianceReport,
) {
  const version = executionState.steps.length + 1;
  registry.create(
    "checkpoint",
    `Checkpoint: ${event.title} v${version}`,
    {
      event,
      plan,
      executionState: { ...executionState },
      complianceReport,
      timestamp: new Date(),
      version,
    },
    { parentId: `event-${event.id}`, tags: ["auto-checkpoint"] },
  );

  await bus.publish({
    type: "CHECKPOINT_CREATED",
    artifactType: "checkpoint",
    payload: { version, stepCount: executionState.steps.length },
    source: "pipeline",
  });
}

function buildKnowledgeTree(
  event: BusinessEvent,
  state: PipelineState,
): Record<string, unknown> {
  return {
    root: event.title,
    type: event.type,
    priority: event.priority,
    generatedAt: new Date().toISOString(),
    artifacts: {
      conversation: state.conversationArtifactId,
      plan: state.planArtifactId,
      workflow: state.workflowArtifactId,
      timeline: state.timelineArtifactId,
      compliance: state.complianceArtifactId,
      checkpoint: state.checkpointArtifactId,
      sop: state.sopArtifactId,
      knowledge: state.knowledgeArtifactId,
    },
    children: [
      { name: "Workflow.json", type: "file", artifactType: "workflow" },
      { name: "SOP.md", type: "file", artifactType: "sop" },
      { name: "Audit.pdf", type: "file", artifactType: "audit" },
      { name: "Compliance.md", type: "file", artifactType: "compliance" },
      { name: "Timeline.json", type: "file", artifactType: "timeline" },
      { name: "Reasoning.md", type: "file", artifactType: "reasoning" },
      { name: "Execution.log", type: "file", artifactType: "timeline" },
      { name: "Checkpoints/", type: "folder", artifactType: "checkpoint" },
      { name: "Knowledge/", type: "folder" },
      { name: "Reports/", type: "folder" },
    ],
  };
}

function generateMermaidWorkflow(plan: Plan): string {
  const lines: string[] = ["graph TD"];

  plan.tasks.forEach((task, index) => {
    const nodeId = `T${index}`;
    const label = task.title.replace(/[^a-zA-Z0-9\s]/g, "").slice(0, 30);
    lines.push(`    ${nodeId}["${label}"]`);

    if (task.dependencies.length > 0) {
      task.dependencies.forEach((dep) => {
        const depIndex = plan.tasks.findIndex((t) => t.id === dep);
        if (depIndex >= 0) {
          lines.push(`    T${depIndex} --> ${nodeId}`);
        }
      });
    }
  });

  return lines.join("\n");
}

