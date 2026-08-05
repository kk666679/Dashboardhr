"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Tool } from "ai";
import {
  BotIcon,
  CircleIcon,
  Loader2Icon,
  CheckCircle2Icon,
  XCircleIcon,
} from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { memo } from "react";

import { CodeBlock } from "./code-block";

// ─── Agent status ─────────────────────────────────────────────────────────────

export type AgentStatus = "idle" | "thinking" | "streaming" | "done" | "error";

const STATUS_CONFIG: Record<
  AgentStatus,
  { label: string; icon: ReactNode; className: string }
> = {
  idle: {
    label: "Ready",
    icon: <CircleIcon className="size-2 fill-current" />,
    className: "text-muted-foreground",
  },
  thinking: {
    label: "Thinking…",
    icon: <Loader2Icon className="size-3 animate-spin" />,
    className: "text-amber-500",
  },
  streaming: {
    label: "Responding…",
    icon: <Loader2Icon className="size-3 animate-spin" />,
    className: "text-blue-500",
  },
  done: {
    label: "Done",
    icon: <CheckCircle2Icon className="size-3" />,
    className: "text-green-500",
  },
  error: {
    label: "Error",
    icon: <XCircleIcon className="size-3" />,
    className: "text-destructive",
  },
};

// ─── Agent ────────────────────────────────────────────────────────────────────

export type AgentProps = ComponentProps<"div">;

export const Agent = memo(({ className, ...props }: AgentProps) => (
  <div
    className={cn("not-prose w-full rounded-md border", className)}
    {...props}
  />
));

// ─── AgentHeader ─────────────────────────────────────────────────────────────

export type AgentHeaderProps = ComponentProps<"div"> & {
  name: string;
  model?: string;
  /** Live status badge rendered inline with the name */
  status?: AgentStatus;
  /** Extra actions rendered on the trailing side */
  actions?: ReactNode;
};

export const AgentHeader = memo(
  ({
    className,
    name,
    model,
    status,
    actions,
    children,
    ...props
  }: AgentHeaderProps) => {
    const statusCfg = status ? STATUS_CONFIG[status] : null;

    return (
      <div
        className={cn(
          "flex w-full items-center justify-between gap-4 border-b p-3",
          className,
        )}
        {...props}
      >
        {/* Leading: icon + name + model + status */}
        <div className="flex min-w-0 items-center gap-2">
          <BotIcon className="size-4 shrink-0 text-muted-foreground" />
          <span className="truncate font-medium text-sm">{name}</span>
          {model && (
            <Badge className="shrink-0 font-mono text-xs" variant="secondary">
              {model}
            </Badge>
          )}
          {statusCfg && (
            <span
              className={cn(
                "flex shrink-0 items-center gap-1 text-xs",
                statusCfg.className,
              )}
            >
              {statusCfg.icon}
              {statusCfg.label}
            </span>
          )}
        </div>
        {/* Trailing: slot for badges / actions */}
        <div className="flex shrink-0 items-center gap-2">
          {children}
          {actions && (
            <div className="flex items-center gap-1">{actions}</div>
          )}
        </div>
      </div>
    );
  },
);

// ─── AgentStatusDot ──────────────────────────────────────────────────────────

export type AgentStatusDotProps = ComponentProps<"span"> & {
  status: AgentStatus;
};

const STATUS_DOT_COLORS: Record<AgentStatus, string> = {
  idle: "bg-muted-foreground/40",
  thinking: "bg-amber-400",
  streaming: "bg-blue-400",
  done: "bg-green-400",
  error: "bg-destructive",
};

export const AgentStatusDot = memo(
  ({ status, className, ...props }: AgentStatusDotProps) => (
    <span
      aria-label={STATUS_CONFIG[status].label}
      className={cn(
        "inline-block size-2 rounded-full",
        STATUS_DOT_COLORS[status],
        (status === "thinking" || status === "streaming") && "animate-pulse",
        className,
      )}
      {...props}
    />
  ),
);

// ─── AgentContent ────────────────────────────────────────────────────────────

export type AgentContentProps = ComponentProps<"div">;

export const AgentContent = memo(
  ({ className, ...props }: AgentContentProps) => (
    <div className={cn("space-y-4 p-4 pt-0", className)} {...props} />
  ),
);

// ─── AgentInstructions ───────────────────────────────────────────────────────

export type AgentInstructionsProps = ComponentProps<"div"> & {
  children:
    | ReactNode
    | ((options: {
        context: unknown;
        experimental_sandbox?: unknown;
      }) => ReactNode);
};

export const AgentInstructions = memo(
  ({ className, children, ...props }: AgentInstructionsProps) => {
    const rendered =
      typeof children === "function"
        ? children({ context: {}, experimental_sandbox: undefined })
        : children;

    return (
      <div className={cn("space-y-2", className)} {...props}>
        <span className="font-medium text-muted-foreground text-sm">
          Instructions
        </span>
        <div className="rounded-md bg-muted/50 p-3 text-muted-foreground text-sm">
          <p>{rendered}</p>
        </div>
      </div>
    );
  },
);

// ─── AgentTools ──────────────────────────────────────────────────────────────

export type AgentToolsProps = ComponentProps<typeof Accordion>;

export const AgentTools = memo(
  ({ className, ...props }: AgentToolsProps) => (
    <div className={cn("space-y-2", className)}>
      <span className="font-medium text-muted-foreground text-sm">Tools</span>
      <Accordion className="rounded-md border" {...props} />
    </div>
  ),
);

// ─── AgentTool ───────────────────────────────────────────────────────────────

export type AgentToolProps = ComponentProps<typeof AccordionItem> & {
  tool: Tool;
};

export const AgentTool = memo(
  ({ className, tool, value, ...props }: AgentToolProps) => {
    const t = tool as Record<string, unknown>;
    const schema =
      "jsonSchema" in tool && t.jsonSchema
        ? t.jsonSchema
        : t.inputSchema ?? t.parameters;

    return (
      <AccordionItem
        className={cn("border-b last:border-b-0", className)}
        value={value}
        {...props}
      >
        <AccordionTrigger className="px-3 py-2 text-sm hover:no-underline">
          {typeof t.description === "function"
            ? (t.description as (o: { context: unknown }) => string)({
                context: {},
              })
            : String(t.description ?? "No description")}
        </AccordionTrigger>
        <AccordionContent className="px-3 pb-3">
          <div className="rounded-md bg-muted/50">
            <CodeBlock
              code={JSON.stringify(schema, null, 2)}
              language="json"
            />
          </div>
        </AccordionContent>
      </AccordionItem>
    );
  },
);

// ─── AgentOutput ─────────────────────────────────────────────────────────────

export type AgentOutputProps = ComponentProps<"div"> & {
  schema: string;
};

export const AgentOutput = memo(
  ({ className, schema, ...props }: AgentOutputProps) => (
    <div className={cn("space-y-2", className)} {...props}>
      <span className="font-medium text-muted-foreground text-sm">
        Output Schema
      </span>
      <div className="rounded-md bg-muted/50">
        <CodeBlock code={schema} language="typescript" />
      </div>
    </div>
  ),
);

// ─── AgentMetrics ────────────────────────────────────────────────────────────

export type AgentMetric = { label: string; value: string | number };

export type AgentMetricsProps = ComponentProps<"div"> & {
  metrics: AgentMetric[];
};

export const AgentMetrics = memo(
  ({ metrics, className, ...props }: AgentMetricsProps) => (
    <div
      className={cn(
        "grid grid-cols-2 gap-2 text-xs sm:grid-cols-4",
        className,
      )}
      {...props}
    >
      {metrics.map(({ label, value }) => (
        <div
          key={label}
          className="rounded-md bg-muted/50 p-2 text-center"
        >
          <div className="font-semibold text-sm">{value}</div>
          <div className="text-muted-foreground">{label}</div>
        </div>
      ))}
    </div>
  ),
);

// ─── AgentActions ────────────────────────────────────────────────────────────

export type AgentActionsProps = ComponentProps<"div">;

export const AgentActions = memo(
  ({ className, children, ...props }: AgentActionsProps) => (
    <div
      className={cn("flex items-center gap-2 p-3 pt-0", className)}
      {...props}
    >
      {children}
    </div>
  ),
);

// ─── AgentAction ─────────────────────────────────────────────────────────────

export type AgentActionProps = ComponentProps<typeof Button>;

export const AgentAction = memo((props: AgentActionProps) => (
  <Button size="sm" variant="outline" {...props} />
));

// ─── Display names ────────────────────────────────────────────────────────────

Agent.displayName = "Agent";
AgentHeader.displayName = "AgentHeader";
AgentStatusDot.displayName = "AgentStatusDot";
AgentContent.displayName = "AgentContent";
AgentInstructions.displayName = "AgentInstructions";
AgentTools.displayName = "AgentTools";
AgentTool.displayName = "AgentTool";
AgentOutput.displayName = "AgentOutput";
AgentMetrics.displayName = "AgentMetrics";
AgentActions.displayName = "AgentActions";
AgentAction.displayName = "AgentAction";
