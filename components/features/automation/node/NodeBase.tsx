"use client";

import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface NodeBaseProps {
  icon: ReactNode;
  label: string;
  description?: string;
  status?: "pending" | "running" | "completed" | "failed" | "idle" | string;
  selected?: boolean;
  className?: string;
  children?: ReactNode;
  badge?: string;
  variant?: "default" | "start" | "end" | "decision" | "action" | "workflow" | "communication" | "integration" | "custom";
  /** Touch-friendly mode: larger hit targets + handles */
  touchOptimized?: boolean;
}

const variantStyles: Record<NonNullable<NodeBaseProps["variant"]>, string> = {
  default: "border-slate-200 dark:border-slate-800",
  start: "border-green-500/50 bg-green-50 dark:bg-green-950/30",
  end: "border-red-500/50 bg-red-50 dark:bg-red-950/30",
  decision: "border-yellow-500/50 bg-yellow-50 dark:bg-yellow-950/30",
  action: "border-blue-500/50 bg-blue-50 dark:bg-blue-950/30",
  workflow: "border-purple-500/50 bg-purple-50 dark:bg-purple-950/30",
  communication: "border-pink-500/50 bg-pink-50 dark:bg-pink-950/30",
  integration: "border-cyan-500/50 bg-cyan-50 dark:bg-cyan-950/30",
  custom: "border-orange-500/50 bg-orange-50 dark:bg-orange-950/30",
};

const statusColors: Record<string, string> = {
  idle: "bg-gray-400",
  pending: "bg-yellow-400",
  running: "bg-blue-500 animate-pulse",
  completed: "bg-green-500",
  failed: "bg-red-500",
  active: "bg-green-500",
  waiting: "bg-orange-400",
  triggered: "bg-purple-500",
  timeout: "bg-red-400",
  inactive: "bg-gray-300",
};

export function NodeBase({
  icon,
  label,
  description,
  status,
  selected,
  className,
  children,
  badge,
  variant = "default",
  touchOptimized = false,
}: NodeBaseProps) {
  return (
    <Card
      data-touch-optimized={touchOptimized || undefined}
      className={cn(
        // Responsive sizing: 160px+ desktop, 120px+ mobile (via touch-optimized)
        "min-w-[120px] sm:min-w-[160px] shadow-md hover:shadow-lg transition-all border-2",
        // Touch-friendly: larger hit area for dragging/selection
        touchOptimized && "min-w-[120px] sm:min-w-[150px] touch-action-none",
        variantStyles[variant],
        selected && "ring-2 ring-primary ring-offset-2",
        className
      )}
    >
      <CardHeader
        className={cn(
          "pb-1 flex flex-row items-center gap-2",
          touchOptimized && "min-h-[44px]"
        )}
      >
        <span className={cn("text-lg", touchOptimized && "min-h-[44px] min-w-[44px] flex items-center justify-center")}>
          {icon}
        </span>
        <CardTitle className={cn("text-sm flex-1", touchOptimized && "text-[13px]")}>{label}</CardTitle>
        {badge && <Badge variant="secondary" className="text-xs">{badge}</Badge>}
        {status && (
          <span className={cn("h-2 w-2 rounded-full", statusColors[status] ?? "bg-gray-400")} />
        )}
      </CardHeader>
      <CardContent className="text-xs text-muted-foreground space-y-1">
        {description && <p>{description}</p>}
        {children}
      </CardContent>
    </Card>
  );
}

/**
 * CSS helper for touch-friendly connection handles.
 * Apply via a style tag or global CSS to ensure minimum 44px hit targets.
 */
export const NODE_TOUCH_HANDLE_CSS = `
  .react-flow__handle {
    min-width: 12px;
    min-height: 12px;
  }
  [data-touch-optimized] .react-flow__handle {
    min-width: 20px;
    min-height: 20px;
  }
  [data-touch-optimized="true"] .react-flow__handle {
    min-width: 44px;
    min-height: 44px;
    opacity: 0.6;
  }
`;
