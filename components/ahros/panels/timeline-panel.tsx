/**
 * TimelinePanel — Live execution stream panel.
 *
 * Uses Timeline + TimelineEventItem from ai-elements to display
 * a real-time execution stream with timestamps, status badges,
 * and step details. Supports retrying, waiting, approval, etc.
 */

"use client";

import { useMemo } from "react";
import {
  Timeline,
  TimelineEventItem,
  TimelineHeader,
  TimelineEmptyState,
  type TimelineEvent,
} from "@/components/ai-elements/timeline";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useAhrosStore } from "@/lib/zustand/ahros-store";
import {
  ActivityIcon,
  ClockIcon,
  PlayIcon,
  PauseIcon,
  CheckCircle2Icon,
  XCircleIcon,
} from "lucide-react";

function mapStepStatusToTimelineStatus(
  status: string,
): TimelineEvent["status"] {
  switch (status) {
    case "pending":
      return "pending";
    case "running":
      return "running";
    case "completed":
      return "completed";
    case "failed":
      return "failed";
    case "retrying":
      return "retrying";
    case "waiting_approval":
      return "waiting_approval";
    case "approved":
      return "completed";
    case "skipped":
      return "warning";
    default:
      return "pending";
  }
}

export function TimelinePanel() {
  const execution = useAhrosStore((s) => s.execution);
  const status = useAhrosStore((s) => s.status);

  const events: TimelineEvent[] = useMemo(() => {
    const items: TimelineEvent[] = [];

    if (execution) {
      // Add execution start event
      if (execution.startedAt) {
        items.push({
          id: "execution-start",
          status: execution.status === "failed" ? "failed" : "completed",
          title: "Execution Started",
          description: `Business event: ${execution.businessEventId.slice(0, 8)}...`,
          timestamp: execution.startedAt,
        });
      }

      // Add step events
      execution.steps.forEach((step) => {
        items.push({
          id: step.id,
          status: mapStepStatusToTimelineStatus(step.status),
          title: step.name,
          description:
            step.status === "failed"
              ? step.error
              : step.status === "waiting_approval"
                ? "Awaiting human approval"
                : `Step completed in ${step.duration ?? "?"}s`,
          timestamp: step.completedAt ?? step.startedAt,
          duration: step.duration,
          error: step.error,
        });

        // Add retry events
        if (step.retryCount > 0) {
          for (let i = 0; i < step.retryCount; i++) {
            items.push({
              id: `${step.id}-retry-${i}`,
              status: "retrying",
              title: `Retry #${i + 1}: ${step.name}`,
              description: `Attempt ${i + 2} of ${step.maxRetries + 1}`,
              timestamp: step.startedAt
                ? new Date(step.startedAt.getTime() + (i + 1) * 1000)
                : undefined,
            });
          }
        }
      });

      // Add completion event
      if (execution.completedAt) {
        items.push({
          id: "execution-end",
          status:
            execution.status === "completed"
              ? "completed"
              : execution.status === "failed"
                ? "failed"
                : execution.status === "paused"
                  ? "paused"
                  : "running",
          title:
            execution.status === "completed"
              ? "Execution Completed"
              : execution.status === "failed"
                ? "Execution Failed"
                : execution.status === "paused"
                  ? "Execution Paused"
                  : "Execution In Progress",
          description:
            execution.status === "completed"
              ? `All ${execution.steps.length} steps completed`
              : execution.status === "failed"
                ? `Failed at step ${execution.currentStepIndex + 1}`
                : `${execution.steps.length} steps executed`,
          timestamp: execution.completedAt,
        });
      }
    }

    // Add log entries as events
    if (execution) {
      execution.logs.slice(-10).forEach((log, i) => {
        const match = log.match(/\[(.*?)\]\s*(.*)/);
        if (match) {
          items.push({
            id: `log-${i}`,
            status: "pending",
            title: match[2].slice(0, 60),
            description: match[2].length > 60 ? match[2].slice(60) : undefined,
            timestamp: new Date(match[1]),
          });
        }
      });
    }

    return items.sort(
      (a, b) =>
        (b.timestamp?.getTime() ?? 0) - (a.timestamp?.getTime() ?? 0),
    );
  }, [execution]);

  if (events.length === 0) {
    return (
      <TimelineEmptyState
        title="No execution events yet"
        description="The execution timeline will appear here once a workflow starts running"
      />
    );
  }

  return (
    <div className="flex flex-col h-full">
      <TimelineHeader
        title="Execution Timeline"
        eventCount={events.length}
        status={mapStepStatusToTimelineStatus(
          execution?.status ?? "pending",
        )}
      />
      <ScrollArea className="flex-1">
        <div className="p-4">
          <Timeline>
            {events.map((event, index) => (
              <TimelineEventItem
                key={event.id}
                event={event}
                showTimestamp
                showDuration
                isLast={index === events.length - 1}
              />
            ))}
          </Timeline>
        </div>
      </ScrollArea>
    </div>
  );
}

