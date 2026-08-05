"use client";

import { cn } from "@/lib/utils";
import { CheckIcon, CircleIcon, Loader2Icon } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { memo } from "react";

export type StepStatus = "pending" | "active" | "completed" | "failed" | "skipped";

export interface Step {
  id: string;
  label: string;
  description?: string;
  status: StepStatus;
}

const STATUS_BG: Record<StepStatus, string> = {
  pending: "bg-muted-foreground/20 text-muted-foreground/60",
  active: "bg-blue-500 text-white",
  completed: "bg-green-500 text-white",
  failed: "bg-red-500 text-white",
  skipped: "bg-muted text-muted-foreground",
};

const STATUS_TEXT: Record<StepStatus, string> = {
  pending: "text-muted-foreground/60",
  active: "text-blue-500",
  completed: "text-green-500",
  failed: "text-red-500",
  skipped: "text-muted-foreground",
};

const STATUS_LINE: Record<StepStatus, string> = {
  pending: "bg-muted-foreground/10",
  active: "bg-blue-200",
  completed: "bg-green-300",
  failed: "bg-red-200",
  skipped: "bg-muted",
};

export type StepsProps = ComponentProps<"div"> & {
  orientation?: "horizontal" | "vertical";
  children?: ReactNode;
};

export const Steps = memo((props: StepsProps) => {
  const { className, orientation = "vertical", children, ...rest } = props;
  return (
    <div
      className={cn(
        orientation === "horizontal" ? "flex items-start gap-0" : "flex flex-col gap-0",
        className,
      )}
      role="list"
      aria-label="Steps"
      {...rest}
    >
      {children}
    </div>
  );
});
Steps.displayName = "Steps";

export type StepItemProps = ComponentProps<"div"> & {
  step: Step;
  isLast?: boolean;
  orientation?: "horizontal" | "vertical";
};

const StepIcon = memo(({ status }: { status: StepStatus }) => {
  if (status === "active") return <Loader2Icon className="size-3 animate-spin" />;
  if (status === "completed") return <CheckIcon className="size-3" />;
  return <CircleIcon className="size-3" />;
});
StepIcon.displayName = "StepIcon";

const HorizontalStep = memo(({ step, isLast, className, orientation, ...rest }: StepItemProps) => (
  <div className={cn("flex flex-1 flex-col items-center gap-2", className)} {...rest}>
    <div className="relative flex w-full items-center justify-center">
      <div className={cn("flex size-7 items-center justify-center rounded-full text-xs font-medium", STATUS_BG[step.status])}>
        <StepIcon status={step.status} />
      </div>
      {!isLast ? (
        <div className={cn("absolute left-[60%] right-0 top-1/2 h-0.5 -translate-y-1/2", STATUS_LINE[step.status])} />
      ) : null}
    </div>
    <div className="text-center">
      <p className={cn("text-xs font-medium", STATUS_TEXT[step.status])}>{step.label}</p>
      {step.description ? (
        <p className="text-[10px] text-muted-foreground/60 mt-0.5">{step.description}</p>
      ) : null}
    </div>
  </div>
));
HorizontalStep.displayName = "HorizontalStep";

const VerticalStep = memo(({ step, isLast, className, orientation, ...rest }: StepItemProps) => (
  <div className={cn("relative flex gap-3 pb-6", className)} {...rest}>
    <div className="flex flex-col items-center">
      <div className={cn("flex size-7 items-center justify-center rounded-full text-xs font-medium", STATUS_BG[step.status])}>
        <StepIcon status={step.status} />
      </div>
      {!isLast ? (
        <div className={cn("mt-1 w-0.5 flex-1", STATUS_LINE[step.status])} />
      ) : null}
    </div>
    <div className="flex-1 pt-1">
      <p className={cn("text-sm font-medium", STATUS_TEXT[step.status])}>{step.label}</p>
      {step.description ? (
        <p className="text-xs text-muted-foreground/70 mt-0.5">{step.description}</p>
      ) : null}
    </div>
  </div>
));
VerticalStep.displayName = "VerticalStep";

export const StepItem = memo((props: StepItemProps) => {
  const { orientation = "vertical" } = props;
  if (orientation === "horizontal") return <HorizontalStep {...props} />;
  return <VerticalStep {...props} />;
});
StepItem.displayName = "StepItem";

export type StepsEmptyStateProps = ComponentProps<"div"> & {
  title?: string;
  description?: string;
};

export const StepsEmptyState = memo((props: StepsEmptyStateProps) => {
  const { className, title = "No steps defined", description = "Plan steps will appear here once generated", ...rest } = props;
  return (
    <div className={cn("flex flex-col items-center justify-center gap-2 py-8 text-center", className)} {...rest}>
      <CircleIcon className="size-6 text-muted-foreground/30" />
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="text-xs text-muted-foreground/60">{description}</p>
    </div>
  );
});
StepsEmptyState.displayName = "StepsEmptyState";