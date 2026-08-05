/**
 * AHROS Learning Engine — Continuous learning from execution patterns.
 *
 * Captures:
 *  - Successful execution patterns
 *  - Failures and recovery strategies
 *  - Human corrections and feedback
 *  - Policy and workflow updates
 *  - Generates recommendations for future executions
 */

import { v4 as uuidv4 } from "uuid";
import type { BusinessEvent, ExecutionState, ComplianceReport, LearningEvent, MemoryEntry } from "./types";
import { getEventBus } from "./event-bus";

export interface LearningContext {
  event: BusinessEvent;
  execution: ExecutionState;
  complianceReport?: ComplianceReport;
  humanFeedback?: string;
  corrections?: Record<string, unknown>;
}

export interface LearningInsight {
  id: string;
  type: "optimization" | "warning" | "improvement" | "pattern";
  title: string;
  description: string;
  confidence: number;
  context: string;
  recommendation?: string;
}

export class AhrosLearningEngine {
  private insights: LearningInsight[] = [];

  /**
   * Process a completed execution and capture learning.
   */
  async processExecution(context: LearningContext): Promise<LearningInsight[]> {
    const newInsights: LearningInsight[] = [];
    const bus = getEventBus();

    // 1. Analyze execution success/failure
    if (context.execution.status === "completed") {
      const insight = await this.captureSuccessPattern(context);
      if (insight) {
        newInsights.push(insight);
        this.insights.push(insight);
      }
    } else if (context.execution.status === "failed") {
      const insight = await this.captureFailurePattern(context);
      if (insight) {
        newInsights.push(insight);
        this.insights.push(insight);
      }
    }

    // 2. Analyze compliance gaps
    if (context.complianceReport && context.complianceReport.score < 80) {
      const insight = await this.captureComplianceGap(context);
      if (insight) {
        newInsights.push(insight);
        this.insights.push(insight);
      }
    }

    // 3. Generate optimization recommendations
    const optimizationInsight = await this.generateOptimization(context);
    if (optimizationInsight) {
      newInsights.push(optimizationInsight);
      this.insights.push(optimizationInsight);
    }

    // 4. Publish learning events
    for (const insight of newInsights) {
      await bus.publish({
        type: "LEARNING_CAPTURED",
        payload: {
          type: insight.type,
          title: insight.title,
          confidence: insight.confidence,
          context: insight.context,
        },
        source: "learning-engine",
      });
    }

    return newInsights;
  }

  /**
   * Capture a successful execution pattern.
   */
  private async captureSuccessPattern(context: LearningContext): Promise<LearningInsight | null> {
    const { event, execution } = context;

    return {
      id: uuidv4(),
      type: "pattern",
      title: `Successful ${event.type} execution pattern`,
      description: `Execution completed successfully with ${execution.steps.length} steps in ${this.calculateDuration(execution)}`,
      confidence: 0.9,
      context: `event:${event.type}`,
      recommendation: `This pattern can be reused for future ${event.type} events`,
    };
  }

  /**
   * Capture a failure pattern.
   */
  private async captureFailurePattern(context: LearningContext): Promise<LearningInsight | null> {
    const { event, execution } = context;

    const failedSteps = execution.steps.filter((s) => s.status === "failed");
    const failedReasons = failedSteps.map((s) => s.error).filter(Boolean).join("; ");

    return {
      id: uuidv4(),
      type: "warning",
      title: `Failure pattern in ${event.type}`,
      description: `Execution failed at step ${execution.currentStepIndex}. Reasons: ${failedReasons || "Unknown"}`,
      confidence: 0.75,
      context: `event:${event.type}:failure`,
      recommendation: "Review the failed steps and consider adding validation before execution",
    };
  }

  /**
   * Capture a compliance gap insight.
   */
  private async captureComplianceGap(context: LearningContext): Promise<LearningInsight | null> {
    const { complianceReport, event } = context;
    if (!complianceReport) return null;

    const failedChecks = complianceReport.checks.filter(
      (c) => c.status === "fail" || c.status === "warning",
    );

    return {
      id: uuidv4(),
      type: "improvement",
      title: `Compliance improvement needed for ${event.type}`,
      description: `${failedChecks.length} compliance checks need attention. Score: ${complianceReport.score}%`,
      confidence: 0.85,
      context: `event:${event.type}:compliance`,
      recommendation: failedChecks.map((c) => c.remediation).filter(Boolean).join("; "),
    };
  }

  /**
   * Generate optimization recommendations.
   */
  private async generateOptimization(context: LearningContext): Promise<LearningInsight | null> {
    const { execution, event } = context;

    // Check for retries that could have been avoided
    const retriesCount = execution.steps.reduce((sum, s) => sum + s.retryCount, 0);
    if (retriesCount > 2) {
      return {
        id: uuidv4(),
        type: "optimization",
        title: `Reduce retries in ${event.type} workflow`,
        description: `${retriesCount} total retries occurred. Consider adding input validation to reduce failures.`,
        confidence: 0.7,
        context: `event:${event.type}:optimization`,
        recommendation: "Add pre-validation step before executing high-risk tasks",
      };
    }

    // Check for steps waiting for human approval
    const approvalSteps = execution.steps.filter((s) => s.status === "waiting_approval");
    if (approvalSteps.length > 0) {
      return {
        id: uuidv4(),
        type: "optimization",
        title: `Streamline approval process for ${event.type}`,
        description: `${approvalSteps.length} steps required human approval. Consider auto-approval for low-risk items.`,
        confidence: 0.6,
        context: `event:${event.type}:approval`,
        recommendation: "Review approval matrix and auto-approve low-risk, routine tasks",
      };
    }

    return null;
  }

  /**
   * Process human feedback for continuous learning.
   */
  async processHumanFeedback(
    event: BusinessEvent,
    feedback: string,
    corrections?: Record<string, unknown>,
  ): Promise<LearningInsight> {
    const insight: LearningInsight = {
      id: uuidv4(),
      type: "improvement",
      title: `Human feedback: ${event.type}`,
      description: feedback,
      confidence: 0.95,
      context: `event:${event.type}:feedback`,
      recommendation: corrections
        ? "Corrections applied. Update workflow template accordingly."
        : undefined,
    };

    this.insights.push(insight);

    const bus = getEventBus();
    await bus.publish({
      type: "LEARNING_CAPTURED",
      payload: { type: "human_correction", feedback, corrections },
      source: "learning-engine",
    });

    return insight;
  }

  /**
   * Get insights for a specific context.
   */
  getInsights(context?: string, minConfidence = 0.5): LearningInsight[] {
    let filtered = this.insights;
    if (context) {
      filtered = filtered.filter((i) => i.context.includes(context));
    }
    return filtered
      .filter((i) => i.confidence >= minConfidence)
      .sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Generate a recommendation for a new business event based on past learnings.
   */
  async generateRecommendation(event: BusinessEvent): Promise<LearningInsight | null> {
    const relevantInsights = this.getInsights(`event:${event.type}`, 0.7);

    if (relevantInsights.length === 0) return null;

    const topInsight = relevantInsights[0];

    return {
      id: uuidv4(),
      type: "pattern",
      title: `Recommendation for ${event.type}`,
      description: `Based on ${relevantInsights.length} previous executions: ${topInsight.recommendation ?? topInsight.description}`,
      confidence: topInsight.confidence,
      context: `event:${event.type}:recommendation`,
      recommendation: topInsight.recommendation,
    };
  }

  /**
   * Calculate execution duration in minutes.
   */
  private calculateDuration(execution: ExecutionState): string {
    if (!execution.startedAt) return "N/A";
    const end = execution.completedAt ?? new Date();
    const minutes = Math.round((end.getTime() - execution.startedAt.getTime()) / 60000);
    return `${minutes} minutes`;
  }

  /**
   * Get all stored insights.
   */
  getAllInsights(): LearningInsight[] {
    return [...this.insights];
  }

  /**
   * Clear stored insights.
   */
  clearInsights(): void {
    this.insights = [];
  }
}
