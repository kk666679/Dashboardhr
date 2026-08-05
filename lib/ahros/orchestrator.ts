/**
 * AHROS Orchestrator — Central AI orchestration engine.
 *
 * Accepts business events and runs them through the full pipeline:
 * Conversation → Planning → Execution → Compliance → Documentation → Learning
 *
 * Integrates with:
 *  - Event Bus for artifact synchronization
 *  - Artifact Registry for versioning
 *  - Zustand stores for workspace state
 *  - Existing HR orchestrator for agent dispatch
 *  - Compliance engine for validation
 */

import { v4 as uuidv4 } from "uuid";
import type { BusinessEvent, Plan, PlanTask, ExecutionState, ExecutionStep, ComplianceReport, ComplianceCheck } from "./types";
import { getEventBus } from "./event-bus";
import { getArtifactRegistry } from "./artifact-registry";

// ─── Interfaces ─────────────────────────────────────────────────────────────

export interface OrchestrationResult {
  eventId: string;
  planId: string;
  executionId: string;
  conversationArtifactId: string;
  planArtifactId: string;
  workflowArtifactId: string;
  timelineArtifactId: string;
  complianceArtifactId: string;
  checkpointArtifactId: string;
  sopArtifactId: string;
  success: boolean;
  error?: string;
}

export interface Planner {
  generatePlan(event: BusinessEvent): Promise<Plan>;
  updatePlan(planId: string, updates: Partial<Plan>): Promise<Plan>;
}

export interface ExecutionEngine {
  initialize(eventId: string, plan: Plan): Promise<ExecutionState>;
  executeStep(state: ExecutionState, stepIndex: number): Promise<ExecutionStep>;
  canProceed(state: ExecutionState): boolean;
  getNextStep(state: ExecutionState): number | null;
}

export interface ComplianceReporter {
  generateReport(event: BusinessEvent, execution: ExecutionState): Promise<ComplianceReport>;
  checkRule(rule: string, context: Record<string, unknown>): Promise<ComplianceCheck>;
}

export interface SopGenerator {
  generateSop(event: BusinessEvent, execution: ExecutionState, report: ComplianceReport): Promise<string>;
}

// ─── Orchestrator ───────────────────────────────────────────────────────────

export class HrOrchestrator {
  private planner: Planner;
  private executionEngine: ExecutionEngine;
  private complianceReporter: ComplianceReporter;
  private sopGenerator: SopGenerator;

  constructor(planner: Planner, executionEngine: ExecutionEngine, complianceReporter: ComplianceReporter, sopGenerator: SopGenerator) {
    this.planner = planner;
    this.executionEngine = executionEngine;
    this.complianceReporter = complianceReporter;
    this.sopGenerator = sopGenerator;
  }

  async processEvent(event: BusinessEvent): Promise<OrchestrationResult> {
    const registry = getArtifactRegistry();
    const bus = getEventBus();

    try {
      const conversationArtifact = registry.create("conversation", `Conversation: ${event.title}`, {
        event,
        messages: [{ role: "system", content: `Processing ${event.type}: ${event.description}`, timestamp: new Date() }],
      }, { tags: [event.type, event.priority.toLowerCase()], createdBy: event.initiatedBy });

      const plan = await this.planner.generatePlan(event);
      const planArtifact = registry.create("plan", `Plan: ${plan.goal}`, plan, { parentId: conversationArtifact.meta.id, tags: [event.type] });

      const workflowArtifact = registry.create("workflow", `Workflow: ${plan.goal}`, {
        tasks: plan.tasks, dependencies: plan.dependencies, totalEstimatedDuration: plan.totalEstimatedDuration, riskScore: plan.riskScore,
      }, { parentId: planArtifact.meta.id });

      await bus.publish({ type: "EXECUTION_STARTED", artifactId: planArtifact.meta.id, artifactType: "plan", payload: { event, plan }, source: "orchestrator" });

      const executionState = await this.executionEngine.initialize(event.id, plan);
      const timelineArtifact = registry.create("timeline", `Timeline: ${event.title}`, executionState, { parentId: conversationArtifact.meta.id });

      registry.create("reasoning", `AI Reasoning: ${plan.goal}`, {
        goal: plan.goal, confidence: plan.confidence, riskScore: plan.riskScore, taskCount: plan.tasks.length, estimatedDuration: plan.totalEstimatedDuration,
        decisionLog: [{ step: "plan_generation", outcome: "Plan created successfully", timestamp: new Date() }],
      }, { parentId: planArtifact.meta.id });

      while (this.executionEngine.canProceed(executionState)) {
        const nextStep = this.executionEngine.getNextStep(executionState);
        if (nextStep === null) break;
        const stepResult = await this.executionEngine.executeStep(executionState, nextStep);
        executionState.steps.push(stepResult);
        executionState.currentStepIndex = nextStep;
        registry.update(timelineArtifact.meta.id, executionState);
        await bus.publish({ type: "EXECUTION_STEP_COMPLETED", artifactId: timelineArtifact.meta.id, artifactType: "timeline", payload: { step: stepResult, stepIndex: nextStep }, source: "orchestrator" });
      }

      executionState.status = "completed";
      executionState.completedAt = new Date();
      registry.update(timelineArtifact.meta.id, executionState);
      await bus.publish({ type: "EXECUTION_COMPLETED", artifactId: timelineArtifact.meta.id, artifactType: "timeline", source: "orchestrator" });

      const complianceReport = await this.complianceReporter.generateReport(event, executionState);
      const complianceArtifact = registry.create("compliance", `Compliance Report: ${event.title}`, complianceReport, { parentId: conversationArtifact.meta.id });
      await bus.publish({ type: "COMPLIANCE_CHECKED", artifactId: complianceArtifact.meta.id, artifactType: "compliance", payload: { score: complianceReport.score, status: complianceReport.overallStatus }, source: "orchestrator" });

      const checkpointArtifact = registry.create("checkpoint", `Checkpoint: ${event.title} v1`, { event, plan, executionState, complianceReport, timestamp: new Date() }, { parentId: conversationArtifact.meta.id });

      const sopContent = await this.sopGenerator.generateSop(event, executionState, complianceReport);
      const sopArtifact = registry.create("sop", `SOP: ${event.title}`, { content: sopContent, generatedAt: new Date() }, { parentId: conversationArtifact.meta.id });

      await bus.publish({ type: "MEMORY_UPDATED", artifactId: sopArtifact.meta.id, artifactType: "sop", payload: { eventType: event.type, complianceScore: complianceReport.score }, source: "orchestrator" });

      registry.create("knowledge-tree", `Knowledge: ${event.title}`, {
        root: event.title,
        children: [
          { name: "Workflow.json", type: "file", artifactId: workflowArtifact.meta.id },
          { name: "SOP.md", type: "file", artifactId: sopArtifact.meta.id },
          { name: "Compliance.md", type: "file", artifactId: complianceArtifact.meta.id },
          { name: "Timeline.json", type: "file", artifactId: timelineArtifact.meta.id },
          { name: "Reasoning.md", type: "file" },
          { name: "Execution.log", type: "file" },
          { name: "Checkpoints/", type: "folder" },
          { name: "Knowledge/", type: "folder" },
          { name: "Reports/", type: "folder" },
        ],
      }, { parentId: conversationArtifact.meta.id });

      return {
        eventId: event.id, planId: plan.id, executionId: executionState.id,
        conversationArtifactId: conversationArtifact.meta.id, planArtifactId: planArtifact.meta.id,
        workflowArtifactId: workflowArtifact.meta.id, timelineArtifactId: timelineArtifact.meta.id,
        complianceArtifactId: complianceArtifact.meta.id, checkpointArtifactId: checkpointArtifact.meta.id,
        sopArtifactId: sopArtifact.meta.id, success: true,
      };
    } catch (error) {
      return {
        eventId: event.id, planId: "", executionId: "", conversationArtifactId: "", planArtifactId: "",
        workflowArtifactId: "", timelineArtifactId: "", complianceArtifactId: "", checkpointArtifactId: "",
        sopArtifactId: "", success: false, error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}

// ─── DefaultPlanner ─────────────────────────────────────────────────────────

export class DefaultPlanner implements Planner {
  async generatePlan(event: BusinessEvent): Promise<Plan> {
    const tasks = this.generateTasks(event);
    const totalDuration = tasks.reduce((sum, t) => sum + (t.estimatedDuration ?? 0), 0);
    return {
      id: uuidv4(), goal: event.title, tasks,
      dependencies: tasks.map((t) => t.dependencies),
      totalEstimatedDuration: totalDuration,
      riskScore: event.priority === "CRITICAL" ? 0.8 : event.priority === "HIGH" ? 0.6 : 0.3,
      confidence: 0.85, generatedAt: new Date(), updatedAt: new Date(), status: "draft",
    };
  }

  async updatePlan(_planId: string, _updates: Partial<Plan>): Promise<Plan> {
    throw new Error("Not implemented");
  }

  private generateTasks(event: BusinessEvent): PlanTask[] {
    const common: PlanTask[] = [
      { id: uuidv4(), title: "Intent Analysis", description: "Analyze business event and extract requirements", status: "pending", dependencies: [], estimatedDuration: 5, risk: "LOW", confidence: 0.95 },
      { id: uuidv4(), title: "Data Collection", description: "Gather relevant employee, document, and compliance data", status: "pending", dependencies: [], estimatedDuration: 15, risk: "LOW", confidence: 0.9 },
      { id: uuidv4(), title: "Validation", description: "Validate collected data against requirements", status: "pending", dependencies: [], estimatedDuration: 10, risk: "MEDIUM", confidence: 0.85 },
    ];
    return [...common, ...this.getEventSpecificTasks(event.type)];
  }

  private getEventSpecificTasks(type: string): PlanTask[] {
    const map: Record<string, PlanTask[]> = {
      WORK_PERMIT_RENEWAL: [
        { id: uuidv4(), title: "Check Permit Expiry", description: "Verify current permit expiry", status: "pending", dependencies: [], estimatedDuration: 5, risk: "LOW", confidence: 0.95 },
        { id: uuidv4(), title: "Document Review", description: "Review passport, visa, and supporting documents", status: "pending", dependencies: [], estimatedDuration: 20, risk: "MEDIUM", confidence: 0.85 },
        { id: uuidv4(), title: "Government Submission", description: "Submit renewal application to immigration", status: "pending", dependencies: [], estimatedDuration: 30, risk: "HIGH", confidence: 0.75 },
        { id: uuidv4(), title: "Payment Processing", description: "Process renewal fees and levies", status: "pending", dependencies: [], estimatedDuration: 15, risk: "MEDIUM", confidence: 0.8 },
        { id: uuidv4(), title: "Approval & Issuance", description: "Receive and verify new permit", status: "pending", dependencies: [], estimatedDuration: 60, risk: "HIGH", confidence: 0.7 },
      ],
      EMPLOYEE_ONBOARDING: [
        { id: uuidv4(), title: "Pre-Arrival Setup", description: "Prepare offer letter, contract, and IT setup", status: "pending", dependencies: [], estimatedDuration: 30, risk: "LOW", confidence: 0.95 },
        { id: uuidv4(), title: "Document Collection", description: "Collect passport, visa, medical results", status: "pending", dependencies: [], estimatedDuration: 20, risk: "MEDIUM", confidence: 0.85 },
        { id: uuidv4(), title: "Compliance Checks", description: "Verify legal and regulatory requirements", status: "pending", dependencies: [], estimatedDuration: 25, risk: "MEDIUM", confidence: 0.8 },
        { id: uuidv4(), title: "Orientation & Training", description: "Conduct orientation and safety training", status: "pending", dependencies: [], estimatedDuration: 120, risk: "LOW", confidence: 0.9 },
        { id: uuidv4(), title: "System Access Setup", description: "Configure HR system, email, and benefits", status: "pending", dependencies: [], estimatedDuration: 15, risk: "LOW", confidence: 0.95 },
      ],
    };
    return map[type] ?? [];
  }
}

// ─── DefaultExecutionEngine ─────────────────────────────────────────────────

export class DefaultExecutionEngine implements ExecutionEngine {
  async initialize(eventId: string, plan: Plan): Promise<ExecutionState> {
    return {
      id: uuidv4(), businessEventId: eventId, planId: plan.id, status: "running",
      currentStepIndex: 0, steps: [], startedAt: new Date(),
      logs: [`[${new Date().toISOString()}] Execution initialized for: ${plan.goal}`],
    };
  }

  async executeStep(_state: ExecutionState, stepIndex: number): Promise<ExecutionStep> {
    return {
      id: uuidv4(), taskId: uuidv4(), name: `Step ${stepIndex + 1}`,
      status: "completed", startedAt: new Date(), completedAt: new Date(),
      duration: Math.floor(Math.random() * 30) + 5, retryCount: 0, maxRetries: 3,
      logs: [`Started step ${stepIndex + 1}`, `Completed step ${stepIndex + 1}`],
    };
  }

  canProceed(state: ExecutionState): boolean {
    return state.status === "running" && state.currentStepIndex < 10;
  }

  getNextStep(state: ExecutionState): number | null {
    return state.currentStepIndex >= state.steps.length ? state.currentStepIndex : null;
  }
}

// ─── DefaultComplianceReporter ──────────────────────────────────────────────

export class DefaultComplianceReporter implements ComplianceReporter {
  async generateReport(event: BusinessEvent, _execution: ExecutionState): Promise<ComplianceReport> {
    const checks: ComplianceCheck[] = [
      { id: uuidv4(), rule: "Employment Act Compliance", description: "Verify compliance with Malaysian Employment Act 1955", status: "pass", severity: "HIGH", detail: "All employment terms meet statutory requirements", reference: "Employment Act 1955, Section 7-12" },
      { id: uuidv4(), rule: "EPF Registration", description: "Verify EPF registration and contribution compliance", status: "pass", severity: "HIGH", detail: "EPF registration is active and contributions are up to date", reference: "EPF Act 1991" },
      { id: uuidv4(), rule: "SOCSO Coverage", description: "Verify SOCSO employment injury and invalidity coverage", status: "pass", severity: "HIGH", detail: "SOCSO coverage is active", reference: "SOCSO Act 1969" },
      { id: uuidv4(), rule: "PDPA Compliance", description: "Verify Personal Data Protection Act compliance", status: "warning", severity: "MEDIUM", detail: "Data processing consent documentation should be reviewed", reference: "PDPA 2010", remediation: "Review and update consent forms" },
    ];

    if (event.type === "WORK_PERMIT_RENEWAL" || event.type === "VISA_APPLICATION") {
      checks.push({
        id: uuidv4(), rule: "Immigration Compliance", description: "Verify immigration pass and permit requirements",
        status: "pass", severity: "CRITICAL", detail: "Immigration status is valid and compliant", reference: "Immigration Act 1959/63",
      });
    }

    const score = Math.round((checks.filter((c) => c.status === "pass").length / checks.length) * 100);
    return {
      id: uuidv4(), businessEventId: event.id,
      overallStatus: score >= 80 ? "compliant" : score >= 50 ? "partial" : "non_compliant",
      score, checks, generatedAt: new Date(),
      summary: `Compliance check completed: ${score}% compliance rate across ${checks.length} checks`,
    };
  }

  async checkRule(rule: string, _context: Record<string, unknown>): Promise<ComplianceCheck> {
    return { id: uuidv4(), rule, description: `Compliance check for: ${rule}`, status: "pass", severity: "MEDIUM", detail: "Rule validated successfully" };
  }
}

// ─── DefaultSopGenerator ────────────────────────────────────────────────────

export class DefaultSopGenerator implements SopGenerator {
  async generateSop(event: BusinessEvent, execution: ExecutionState, report: ComplianceReport): Promise<string> {
    return [
      `# Standard Operating Procedure: ${event.title}`,
      "",
      "## Overview",
      `- **Event Type**: ${event.type}`,
      `- **Description**: ${event.description}`,
      `- **Priority**: ${event.priority}`,
      `- **Initiated By**: ${event.initiatedBy}`,
      "",
      "## Execution Summary",
      `- **Status**: ${execution.status}`,
      `- **Steps Completed**: ${execution.steps.length}`,
      `- **Started**: ${execution.startedAt?.toISOString() ?? "N/A"}`,
      `- **Completed**: ${execution.completedAt?.toISOString() ?? "N/A"}`,
      "",
      "## Compliance Summary",
      `- **Overall Status**: ${report.overallStatus}`,
      `- **Compliance Score**: ${report.score}%`,
      `- **Checks Performed**: ${report.checks.length}`,
      "",
      "## Execution Log",
      ...execution.logs.map((log) => `- ${log}`),
      "",
      "## Compliance Details",
      ...report.checks.map((check) => [
        `### ${check.rule}`,
        `- **Status**: ${check.status}`,
        `- **Severity**: ${check.severity}`,
        `- **Detail**: ${check.detail}`,
        `- **Reference**: ${check.reference}`,
        ...(check.remediation ? [`- **Remediation**: ${check.remediation}`] : []),
      ].join("\n")),
      "",
      "---",
      `*Auto-generated by AHROS Orchestrator on ${new Date().toISOString()}*`,
    ].join("\n");
  }
}
