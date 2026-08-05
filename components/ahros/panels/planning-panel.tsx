/**
 * PlanningPanel — AI-generated execution plan.
 *
 * Uses the Plan component from ai-elements to display the
 * AI-generated strategy for a business event.
 */

"use client";

import { useMemo } from "react";
import {
  Plan,
  PlanHeader,
  PlanTitle,
  PlanDescription,
  PlanContent,
  PlanTrigger,
} from "@/components/ai-elements/plan";
import { Badge } from "@/components/ui/badge";
import { useAhrosStore } from "@/lib/zustand/ahros-store";
import {
  ClockIcon,
  AlertTriangleIcon,
  CheckCircle2Icon,
  TargetIcon,
} from "lucide-react";

export function PlanningPanel() {
  const plan = useAhrosStore((s) => s.currentPlan);
  const status = useAhrosStore((s) => s.status);

  if (!plan) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <TargetIcon className="size-8 text-muted-foreground/30 mb-2" />
        <p className="text-sm text-muted-foreground">No plan yet</p>
        <p className="text-xs text-muted-foreground/60 mt-1">
          Start a conversation to generate an execution plan
        </p>
      </div>
    );
  }

  return (
    <div className="p-3">
      <Plan defaultOpen>
        <PlanHeader>
          <PlanTitle>{plan.goal}</PlanTitle>
          <PlanDescription>
            {`${String(plan.tasks.length)} tasks · ${String(plan.totalEstimatedDuration)} min estimated`}
          </PlanDescription>
          <div className="flex items-center gap-2 mt-2">
            <Badge
              variant={plan.riskScore > 0.5 ? "destructive" : "secondary"}
              className="text-[10px]"
            >
              <AlertTriangleIcon className="size-3 mr-1" />
              Risk: {Math.round(plan.riskScore * 100)}%
            </Badge>
            <Badge variant="default" className="text-[10px]">
              <CheckCircle2Icon className="size-3 mr-1" />
              Confidence: {Math.round(plan.confidence * 100)}%
            </Badge>
          </div>
        </PlanHeader>
        <PlanContent>
          <div className="space-y-2 mt-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Tasks
            </p>
            {plan.tasks.map((task, index) => (
              <div
                key={task.id}
                className="flex items-start gap-2 rounded-md border p-2 text-sm"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-xs">{index + 1}.</span>
                    <span className="text-xs font-medium">{task.title}</span>
                    <Badge
                      variant={
                        task.risk === "HIGH"
                          ? "destructive"
                          : task.risk === "MEDIUM"
                            ? "outline"
                            : "secondary"
                      }
                      className="text-[9px] px-1 py-0"
                    >
                      {task.risk}
                    </Badge>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {task.description}
                  </p>
                  <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <ClockIcon className="size-3" />
                      {task.estimatedDuration} min
                    </span>
                    <span>
                      Confidence: {Math.round(task.confidence * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </PlanContent>
      </Plan>
    </div>
  );
}

