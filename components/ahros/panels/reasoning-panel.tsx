/**
 * ReasoningPanel — AI decision explanation panel.
 *
 * Uses the Reasoning component from ai-elements to display
 * every AI decision with confidence, evidence, policy references,
 * alternative paths, and risk assessment.
 * Collapsible and auditable.
 */

"use client";

import { useMemo } from "react";
import {
  Reasoning,
  ReasoningTrigger,
  ReasoningContent,
} from "@/components/ai-elements/reasoning";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAhrosStore } from "@/lib/zustand/ahros-store";
import {
  BrainIcon,
  AlertTriangleIcon,
  CheckCircle2Icon,
  FileTextIcon,
  GitBranchIcon,
  TargetIcon,
} from "lucide-react";

interface DecisionNode {
  id: string;
  title: string;
  decision: string;
  confidence: number;
  evidence: string[];
  policyReferences: string[];
  alternatives: string[];
  risk: "LOW" | "MEDIUM" | "HIGH";
  timestamp: Date;
}

export function ReasoningPanel() {
  const plan = useAhrosStore((s) => s.currentPlan);
  const execution = useAhrosStore((s) => s.execution);
  const status = useAhrosStore((s) => s.status);

  // Generate decision nodes from plan and execution state
  const decisionNodes: DecisionNode[] = useMemo(() => {
    const nodes: DecisionNode[] = [];

    if (plan) {
      nodes.push({
        id: "plan-generation",
        title: "Plan Generation",
        decision: `Generated execution plan for: ${plan.goal}`,
        confidence: plan.confidence,
        evidence: [
          `Business event type interpreted`,
          `${plan.tasks.length} tasks identified`,
          `Dependencies mapped across tasks`,
          `Risk score calculated: ${Math.round(plan.riskScore * 100)}%`,
        ],
        policyReferences: [
          "Standard operating procedure for event type",
          "Risk assessment framework v2.1",
        ],
        alternatives: [
          "Manual processing via HR admin",
          "Partial automation with human approval gates",
        ],
        risk: plan.riskScore > 0.5 ? "HIGH" : plan.riskScore > 0.3 ? "MEDIUM" : "LOW",
        timestamp: plan.generatedAt,
      });

      plan.tasks.forEach((task, index) => {
        nodes.push({
          id: `task-${task.id}`,
          title: `Task: ${task.title}`,
          decision: task.description,
          confidence: task.confidence,
          evidence: [
            `Task #${index + 1} in execution sequence`,
            `${task.dependencies.length} dependencies`,
            `Estimated duration: ${task.estimatedDuration} min`,
          ],
          policyReferences: [
            `Task type: ${task.risk} risk`,
            ...(task.requiredApprovals?.map(
              (a) => `Approval required: ${a}`
            ) ?? []),
          ],
          alternatives: [
            "Skip if pre-validated",
            "Delegate to sub-agent",
          ],
          risk: task.risk,
          timestamp: plan.updatedAt,
        });
      });
    }

    if (execution) {
      execution.steps.forEach((step) => {
        if (step.status === "failed" || step.retryCount > 0) {
          nodes.push({
            id: `step-${step.id}`,
            title: `Execution: ${step.name}`,
            decision:
              step.status === "failed"
                ? `Failed after ${step.retryCount} retries`
                : `Completed with ${step.retryCount} retries`,
            confidence:
              step.status === "failed" ? 0.2 : Math.max(0.5, 1 - step.retryCount * 0.15),
            evidence: [
              `Status: ${step.status}`,
              `Duration: ${step.duration ?? "N/A"}s`,
              step.error ? `Error: ${step.error}` : "No errors",
              ...step.logs.slice(-3),
            ],
            policyReferences: [
              "Retry policy: max 3 attempts",
              "Exponential backoff: 1s, 2s, 4s",
            ],
            alternatives: [
              "Switch to fallback provider",
              "Escalate to human operator",
            ],
            risk: step.status === "failed" ? "HIGH" : "MEDIUM",
            timestamp: step.completedAt ?? step.startedAt ?? new Date(),
          });
        }
      });
    }

    return nodes;
  }, [plan, execution]);

  if (decisionNodes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <BrainIcon className="size-8 text-muted-foreground/30 mb-2" />
        <p className="text-sm text-muted-foreground">No decisions yet</p>
        <p className="text-xs text-muted-foreground/60 mt-1">
          AI reasoning will appear here as decisions are made
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full p-3">
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <BrainIcon className="size-4 text-primary" />
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Decision Log
          </span>
          <Badge variant="outline" className="text-[9px]">
            {decisionNodes.length} decisions
          </Badge>
        </div>

        {decisionNodes.map((node) => (
          <Reasoning
            key={node.id}
            defaultOpen={node.risk === "HIGH" || node.confidence < 0.5}
          >
            <ReasoningTrigger>
              <div className="flex items-center gap-2 w-full">
                <span className="text-xs font-medium flex-1 text-left">
                  {node.title}
                </span>
                <div className="flex items-center gap-1.5">
                  <Badge
                    variant={
                      node.risk === "HIGH"
                        ? "destructive"
                        : node.risk === "MEDIUM"
                          ? "outline"
                          : "secondary"
                    }
                    className="text-[9px] px-1 py-0"
                  >
                    {node.risk}
                  </Badge>
                  <span
                    className={`text-[10px] ${
                      node.confidence >= 0.7
                        ? "text-green-500"
                        : node.confidence >= 0.4
                          ? "text-amber-500"
                          : "text-red-500"
                    }`}
                  >
                    {Math.round(node.confidence * 100)}%
                  </span>
                </div>
              </div>
            </ReasoningTrigger>
            <ReasoningContent>
              {`## ${node.decision}

**Risk:** ${node.risk} | **Confidence:** ${Math.round(node.confidence * 100)}%

**Evidence:**
${node.evidence.map((e) => `- ${e}`).join("\n")}

${node.policyReferences.length > 0 ? `**Policy References:**\n${node.policyReferences.map((r) => `- ${r}`).join("\n")}` : ""}

${node.alternatives.length > 0 ? `**Alternative Paths:**\n${node.alternatives.map((a) => `- ${a}`).join("\n")}` : ""}`}
            </ReasoningContent>
          </Reasoning>
        ))}
      </div>
    </ScrollArea>
  );
}

