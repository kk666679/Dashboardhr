/**
 * ConfirmationDialog — Interactive human-in-the-loop approval artifact.
 *
 * Represents confirmation points in AHROS workflows where human
 * intervention is required for high-risk or sensitive operations.
 *
 * Examples:
 *  - Salary approval
 *  - Contract approval
 *  - Passport upload
 *  - Identity verification
 *  - High-risk compliance exceptions
 *
 * Integrates with the EventBus to notify the execution engine
 * of the human's decision.
 */

"use client";

import { useState, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { getEventBus } from "@/lib/ahros/event-bus";
import { useAhrosStore } from "@/lib/zustand/ahros-store";
import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  XCircleIcon,
  ShieldCheckIcon,
  UserCheckIcon,
  FileTextIcon,
  ClockIcon,
  InfoIcon,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

export type ConfirmationSeverity = "info" | "warning" | "critical";

export interface ConfirmationAction {
  id: string;
  label: string;
  description: string;
  severity: ConfirmationSeverity;
  /** Whether this action requires explicit justification */
  requiresJustification?: boolean;
  /** Whether this action auto-approves after timeout */
  autoApproveAfter?: number; // seconds
}

export interface ConfirmationDialogProps {
  /** Dialog title */
  title: string;
  /** Description of what needs approval */
  description: string;
  /** Available actions the user can take */
  actions: ConfirmationAction[];
  /** Additional context details */
  details?: { label: string; value: string }[];
  /** Related artifact IDs */
  relatedArtifactIds?: string[];
  /** Callback when an action is selected */
  onAction?: (actionId: string, justification?: string) => void;
  /** Additional CSS classes */
  className?: string;
  /** Whether to show this dialog as a modal overlay */
  modal?: boolean;
}

// ─── Severity Config ─────────────────────────────────────────────────────────

const SEVERITY_CONFIG: Record<
  ConfirmationSeverity,
  {
    icon: React.ReactNode;
    color: string;
    bgColor: string;
    borderColor: string;
  }
> = {
  info: {
    icon: <InfoIcon className="size-5 text-blue-500" />,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    borderColor: "border-blue-200 dark:border-blue-800",
  },
  warning: {
    icon: <AlertTriangleIcon className="size-5 text-amber-500" />,
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-950/20",
    borderColor: "border-amber-200 dark:border-amber-800",
  },
  critical: {
    icon: <ShieldCheckIcon className="size-5 text-red-500" />,
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-950/20",
    borderColor: "border-red-200 dark:border-red-800",
  },
};

// ─── Component ───────────────────────────────────────────────────────────────

export function ConfirmationDialog({
  title,
  description,
  actions,
  details,
  relatedArtifactIds,
  onAction,
  className,
  modal = false,
}: ConfirmationDialogProps) {
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [justification, setJustification] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Determine overall severity from actions
  const overallSeverity = useMemo((): ConfirmationSeverity => {
    if (actions.some((a) => a.severity === "critical")) return "critical";
    if (actions.some((a) => a.severity === "warning")) return "warning";
    return "info";
  }, [actions]);

  const severityConfig = SEVERITY_CONFIG[overallSeverity];

  // Find the selected action config
  const selectedActionConfig = useMemo(
    () => actions.find((a) => a.id === selectedAction),
    [actions, selectedAction],
  );

  const handleConfirm = useCallback(async () => {
    if (!selectedAction) return;

    setIsSubmitting(true);

    try {
      // Publish decision to event bus
      const bus = getEventBus();
      await bus.publish({
        type: "EXECUTION_STEP_COMPLETED", // Reuse for approval events
        artifactType: "checkpoint",
        payload: {
          actionId: selectedAction,
          justification: justification.trim() || undefined,
          approved: selectedActionConfig?.severity !== "critical",
          timestamp: new Date(),
        },
        source: "confirmation-dialog",
      });

      // Call the action callback
      onAction?.(selectedAction, justification.trim() || undefined);

      // Update store
      const store = useAhrosStore.getState();
      if (selectedActionConfig?.severity === "critical") {
        // Escalate — pause execution
        store.pauseExecution();
      } else {
        // Approve — resume execution
        store.resumeExecution();
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedAction, justification, selectedActionConfig, onAction]);

  const content = (
    <Card
      className={cn(
        "shadow-lg border-2",
        severityConfig.borderColor,
        className,
      )}
    >
      <CardHeader className={cn("pb-3", severityConfig.bgColor)}>
        <div className="flex items-start gap-3">
          <div className="mt-0.5">{severityConfig.icon}</div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-sm">{title}</CardTitle>
            <CardDescription className="text-xs mt-1">
              {description}
            </CardDescription>
          </div>
          <Badge
            variant={
              overallSeverity === "critical"
                ? "destructive"
                : overallSeverity === "warning"
                  ? "secondary"
                  : "outline"
            }
            className="text-[9px] shrink-0"
          >
            {overallSeverity.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-3 pb-2 space-y-3">
        {/* Details */}
        {details && details.length > 0 && (
          <div className="space-y-1">
            {details.map((detail, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-xs"
              >
                <span className="text-muted-foreground">{detail.label}</span>
                <span className="font-medium">{detail.value}</span>
              </div>
            ))}
          </div>
        )}

        <Separator />

        {/* Actions */}
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">
            Select an action:
          </p>
          <div className="space-y-1.5">
            {actions.map((action) => {
              const isSelected = selectedAction === action.id;
              const actionSeverity = SEVERITY_CONFIG[action.severity];

              return (
                <button
                  key={action.id}
                  type="button"
                  className={cn(
                    "w-full flex items-center gap-3 rounded-md border p-2.5 text-left transition-all",
                    isSelected
                      ? `${actionSeverity.borderColor} ${actionSeverity.bgColor} ring-1 ring-offset-1`
                      : "border-border hover:bg-muted/50",
                  )}
                  onClick={() => {
                    setSelectedAction(action.id);
                    if (!action.requiresJustification) {
                      setJustification("");
                    }
                  }}
                >
                  <div className="flex items-center justify-center size-8 rounded-full border shrink-0">
                    {action.severity === "info" && (
                      <CheckCircle2Icon className="size-4 text-green-500" />
                    )}
                    {action.severity === "warning" && (
                      <AlertTriangleIcon className="size-4 text-amber-500" />
                    )}
                    {action.severity === "critical" && (
                      <XCircleIcon className="size-4 text-red-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium">{action.label}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {action.description}
                    </p>
                  </div>
                  {action.autoApproveAfter && (
                    <Badge variant="outline" className="text-[8px] px-1 py-0 shrink-0">
                      <ClockIcon className="size-2 mr-0.5" />
                      {action.autoApproveAfter}s
                    </Badge>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Justification */}
        {selectedActionConfig?.requiresJustification && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">
              Justification (required):
            </p>
            <Textarea
              placeholder="Explain why this action is being taken..."
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              className="min-h-[60px] text-xs"
            />
          </div>
        )}

        {/* Related artifacts */}
        {relatedArtifactIds && relatedArtifactIds.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
              <FileTextIcon className="size-3" />
              Related Artifacts
            </p>
            <div className="flex flex-wrap gap-1">
              {relatedArtifactIds.map((id) => (
                <Badge
                  key={id}
                  variant="outline"
                  className="text-[9px] px-1.5 py-0"
                >
                  {id.slice(0, 8)}...
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t px-4 py-3">
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <UserCheckIcon className="size-3" />
          Human-in-the-loop required
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="h-7 px-3 text-xs"
            onClick={() => {
              setSelectedAction(null);
              setJustification("");
            }}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            variant={
              selectedActionConfig?.severity === "critical"
                ? "destructive"
                : "default"
            }
            className="h-7 px-3 text-xs"
            disabled={!selectedAction || isSubmitting}
            onClick={handleConfirm}
          >
            {isSubmitting ? "Submitting..." : "Confirm"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );

  if (modal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <div className="w-full max-w-lg mx-4">{content}</div>
      </div>
    );
  }

  return content;
}

