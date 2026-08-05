"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  CheckCircleIcon, ClockIcon, Loader2Icon, XCircleIcon,
  AlertTriangleIcon, PauseCircleIcon, RotateCcwIcon, UserCheckIcon,
} from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { memo } from "react";

export type TimelineEventStatus =
  | "pending" | "running" | "completed" | "failed"
  | "warning" | "paused" | "retrying" | "waiting_approval";

export interface TimelineEvent {
  id: string;
  status: TimelineEventStatus;
  title: string;
  description?: string;
  timestamp?: Date;
  duration?: number;
  error?: string;
  metadata?: Record<string, unknown>;
}

const ICONS: Record<TimelineEventStatus, ReactNode> = {
  pending: <ClockIcon className="size-4 text-muted-foreground/60" />,
  running: <Loader2Icon className="size-4 animate-spin text-blue-500" />,
  completed: <CheckCircleIcon className="size-4 text-green-500" />,
  failed: <XCircleIcon className="size-4 text-red-500" />,
  warning: <AlertTriangleIcon className="size-4 text-amber-500" />,
  paused: <PauseCircleIcon className="size-4 text-yellow-500" />,
  retrying: <RotateCcwIcon className="size-4 animate-spin text-orange-500" />,
  waiting_approval: <UserCheckIcon className="size-4 text-purple-500" />,
};

const COLORS: Record<TimelineEventStatus, string> = {
  pending: "border-l-muted-foreground/20",
  running: "border-l-blue-500",
  completed: "border-l-green-500",
  failed: "border-l-red-500",
  warning: "border-l-amber-500",
  paused: "border-l-yellow-500",
  retrying: "border-l-orange-500",
  waiting_approval: "border-l-purple-500",
};

const BADGES: Record<TimelineEventStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "Pending", variant: "outline" },
  running: { label: "Running", variant: "default" },
  completed: { label: "Completed", variant: "secondary" },
  failed: { label: "Failed", variant: "destructive" },
  warning: { label: "Warning", variant: "outline" },
  paused: { label: "Paused", variant: "outline" },
  retrying: { label: "Retrying", variant: "outline" },
  waiting_approval: { label: "Awaiting Approval", variant: "outline" },
};

function fmtDate(d: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit",
  }).format(d);
}

function fmtDur(s: number): string {
  if (s < 60) return s + "s";
  return Math.floor(s / 60) + "m " + (s % 60) + "s";
}

export type TimelineProps = ComponentProps<"div"> & {
  children?: ReactNode;
};

export const Timeline = memo(({ className, children, ...props }: TimelineProps) => {
  return (
    <div className={cn("flex flex-col gap-0", className)} role="log" aria-label="Execution timeline" {...props}>
      {children}
    </div>
  );
});
Timeline.displayName = "Timeline";

export type TimelineEventItemProps = ComponentProps<"div"> & {
  event: TimelineEvent;
  showTimestamp?: boolean;
  showDuration?: boolean;
  isLast?: boolean;
  children?: ReactNode;
};

export const TimelineEventItem = memo(({ 
  className, 
  event, 
  showTimestamp = false, 
  showDuration = false, 
  isLast = false, 
  children, 
  ...rest 
}: TimelineEventItemProps) => {
  const badge = BADGES[event.status];
  return (
    <div
      className={cn(
        "relative flex gap-3 pb-4 pl-6",
        !isLast && "border-l-2",
        COLORS[event.status],
        className,
      )}
      {...rest}
    >
      <div className="absolute -left-3 top-0 flex size-6 items-center justify-center rounded-full bg-background">
        {ICONS[event.status]}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1 pt-0.5">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">{event.title}</span>
          <Badge variant={badge.variant} className="text-[10px] px-1.5 py-0">
            {badge.label}
          </Badge>
        </div>
        {event.description ? (
          <p className="text-muted-foreground text-xs">{event.description}</p>
        ) : null}
        {event.error ? (
          <p className="text-destructive text-xs">{event.error}</p>
        ) : null}
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground/70">
          {showTimestamp && event.timestamp ? (
            <span>{fmtDate(event.timestamp)}</span>
          ) : null}
          {showDuration && event.duration !== undefined ? (
            <span>Duration: {fmtDur(event.duration)}</span>
          ) : null}
        </div>
        {children ? (
          <div className="mt-1">{children}</div>
        ) : null}
      </div>
    </div>
  );
});
TimelineEventItem.displayName = "TimelineEventItem";

export type TimelineHeaderProps = ComponentProps<"div"> & {
  title?: string;
  eventCount?: number;
  status?: TimelineEventStatus;
  actions?: ReactNode;
};

export const TimelineHeader = memo(({ className, title, eventCount, status, actions, ...rest }: TimelineHeaderProps) => {
  return (
    <div className={cn("flex items-center justify-between border-b px-4 py-2", className)} {...rest}>
      <div className="flex items-center gap-2">
        {status ? (
          <span className="flex items-center">{ICONS[status]}</span>
        ) : null}
        <span className="font-medium text-sm">{title ?? "Execution Timeline"}</span>
        {eventCount != null ? (
          <Badge variant="secondary" className="text-[10px]">
            {eventCount} events
          </Badge>
        ) : null}
      </div>
      {actions ? (
        <div className="flex items-center gap-1">{actions}</div>
      ) : null}
    </div>
  );
});
TimelineHeader.displayName = "TimelineHeader";

export type TimelineEmptyStateProps = ComponentProps<"div"> & {
  title?: string;
  description?: string;
};

export const TimelineEmptyState = memo(({ className, title, description, ...rest }: TimelineEmptyStateProps) => {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-2 py-12 text-center", className)} {...rest}>
      <ClockIcon className="size-8 text-muted-foreground/30" />
      <p className="font-medium text-sm text-muted-foreground">
        {title ?? "No events yet"}
      </p>
      <p className="text-xs text-muted-foreground/60 max-w-[200px]">
        {description ?? "Execution timeline will appear here once the workflow starts"}
      </p>
    </div>
  );
});
TimelineEmptyState.displayName = "TimelineEmptyState";