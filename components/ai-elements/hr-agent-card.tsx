"use client";

/**
 * HRAgentCard — Domain-aware agent card for Malaysian HR / FWMS
 *
 * Wraps the base Agent components with HR-specific metadata display:
 * domain badge, compliance tags, quick-action suggestions, and live
 * cost/token counter.
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  BriefcaseIcon,
  ShieldCheckIcon,
  CoinsIcon,
  ZapIcon,
  RefreshCwIcon,
  MaximizeIcon,
} from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { memo, useState } from "react";

import { Agent, AgentHeader, AgentStatusDot, type AgentStatus } from "./agent";

// ─── Domain config ────────────────────────────────────────────────────────────

export type HRDomain =
  | "payroll"
  | "employee"
  | "recruitment"
  | "compliance"
  | "leave"
  | "performance"
  | "learning"
  | "succession"
  | "foreign-worker"
  | "health-safety"
  | "general";

const DOMAIN_CONFIG: Record<
  HRDomain,
  { label: string; color: string; bg: string }
> = {
  payroll:        { label: "Payroll",         color: "text-green-700",  bg: "bg-green-100 dark:bg-green-900/30" },
  employee:       { label: "Employee",        color: "text-purple-700", bg: "bg-purple-100 dark:bg-purple-900/30" },
  recruitment:    { label: "Recruitment",     color: "text-blue-700",   bg: "bg-blue-100 dark:bg-blue-900/30" },
  compliance:     { label: "Compliance",      color: "text-orange-700", bg: "bg-orange-100 dark:bg-orange-900/30" },
  leave:          { label: "Leave",           color: "text-cyan-700",   bg: "bg-cyan-100 dark:bg-cyan-900/30" },
  performance:    { label: "Performance",     color: "text-yellow-700", bg: "bg-yellow-100 dark:bg-yellow-900/30" },
  learning:       { label: "L&D",             color: "text-indigo-700", bg: "bg-indigo-100 dark:bg-indigo-900/30" },
  succession:     { label: "Succession",      color: "text-rose-700",   bg: "bg-rose-100 dark:bg-rose-900/30" },
  "foreign-worker": { label: "Foreign Worker", color: "text-teal-700", bg: "bg-teal-100 dark:bg-teal-900/30" },
  "health-safety":  { label: "H&S",           color: "text-red-700",   bg: "bg-red-100 dark:bg-red-900/30" },
  general:        { label: "HR",              color: "text-slate-700",  bg: "bg-slate-100 dark:bg-slate-900/30" },
};

// ─── Props ────────────────────────────────────────────────────────────────────

export interface HRAgentCardProps extends ComponentProps<"div"> {
  /** Agent display name */
  name: string;
  /** HR domain this agent specialises in */
  domain?: HRDomain;
  /** Short description shown under the name */
  description?: string;
  /** Live operational status */
  status?: AgentStatus;
  /** Compliance standards this agent is aware of (e.g. ["EPF", "SOCSO", "PCB"]) */
  complianceTags?: string[];
  /** Estimated tokens used — shown in footer */
  tokensUsed?: number;
  /** Max token budget */
  tokenBudget?: number;
  /** Called when user clicks "Expand" */
  onExpand?: () => void;
  /** Called when user clicks "Reset" */
  onReset?: () => void;
  /** Content inside the card (conversation, form, etc.) */
  children?: ReactNode;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const HRAgentCard = memo(function HRAgentCard({
  name,
  domain = "general",
  description,
  status = "idle",
  complianceTags = [],
  tokensUsed,
  tokenBudget,
  onExpand,
  onReset,
  children,
  className,
  ...props
}: HRAgentCardProps) {
  const [collapsed, setCollapsed] = useState(false);
  const domainCfg = DOMAIN_CONFIG[domain];

  const tokenPct =
    tokensUsed != null && tokenBudget
      ? Math.min(100, Math.round((tokensUsed / tokenBudget) * 100))
      : null;

  const tokenColor =
    tokenPct == null
      ? "bg-muted-foreground/30"
      : tokenPct > 85
      ? "bg-destructive"
      : tokenPct > 60
      ? "bg-amber-500"
      : "bg-green-500";

  return (
    <Agent
      className={cn(
        "flex flex-col overflow-hidden transition-all duration-200",
        collapsed && "max-h-14",
        className,
      )}
      {...props}
    >
      {/* Header */}
      <AgentHeader
        name={name}
        status={status}
        actions={
          <TooltipProvider>
            <div className="flex items-center gap-1">
              {onReset && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-7"
                      onClick={onReset}
                      aria-label="Reset conversation"
                    >
                      <RefreshCwIcon className="size-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Reset</TooltipContent>
                </Tooltip>
              )}
              {onExpand && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-7"
                      onClick={onExpand}
                      aria-label="Expand agent"
                    >
                      <MaximizeIcon className="size-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Expand</TooltipContent>
                </Tooltip>
              )}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-7"
                    onClick={() => setCollapsed((v) => !v)}
                    aria-label={collapsed ? "Expand card" : "Collapse card"}
                  >
                    <ZapIcon className="size-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{collapsed ? "Expand" : "Collapse"}</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        }
      >
        {/* Domain + compliance badges */}
        <div className="flex flex-wrap items-center gap-1">
          <Badge
            className={cn(
              "text-xs font-medium px-2 py-0 border-0",
              domainCfg.bg,
              domainCfg.color,
            )}
          >
            <BriefcaseIcon className="size-2.5 mr-1" />
            {domainCfg.label}
          </Badge>
          {complianceTags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="text-xs px-1.5 py-0"
            >
              <ShieldCheckIcon className="size-2.5 mr-1 text-blue-500" />
              {tag}
            </Badge>
          ))}
        </div>
      </AgentHeader>

      {/* Description */}
      {description && !collapsed && (
        <p className="px-3 pb-1 pt-2 text-xs text-muted-foreground">
          {description}
        </p>
      )}

      {/* Main content */}
      {!collapsed && (
        <div className="flex flex-1 flex-col overflow-hidden">
          {children}
        </div>
      )}

      {/* Token footer */}
      {tokensUsed != null && !collapsed && (
        <div className="border-t px-3 py-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <CoinsIcon className="size-3" />
              {tokensUsed.toLocaleString()} tokens
              {tokenBudget ? ` / ${tokenBudget.toLocaleString()}` : ""}
            </span>
            {tokenPct != null && (
              <span
                className={cn(
                  "font-medium",
                  tokenPct > 85 ? "text-destructive" : tokenPct > 60 ? "text-amber-500" : "text-green-600",
                )}
              >
                {tokenPct}%
              </span>
            )}
          </div>
          {tokenPct != null && (
            <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={cn("h-full rounded-full transition-all duration-500", tokenColor)}
                style={{ width: `${tokenPct}%` }}
                role="progressbar"
                aria-valuenow={tokenPct}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          )}
        </div>
      )}
    </Agent>
  );
});

HRAgentCard.displayName = "HRAgentCard";

// ─── HRAgentStatusBar ────────────────────────────────────────────────────────

export interface HRAgentStatusBarProps extends ComponentProps<"div"> {
  agents: Array<{
    name: string;
    domain: HRDomain;
    status: AgentStatus;
  }>;
}

/**
 * Compact horizontal bar showing status of multiple HR agents at a glance.
 * Useful in dashboard headers.
 */
export const HRAgentStatusBar = memo(function HRAgentStatusBar({
  agents,
  className,
  ...props
}: HRAgentStatusBarProps) {
  return (
    <div
      className={cn("flex flex-wrap items-center gap-3", className)}
      {...props}
    >
      {agents.map(({ name, domain, status }) => {
        const cfg = DOMAIN_CONFIG[domain];
        return (
          <div key={name} className="flex items-center gap-1.5 text-xs">
            <AgentStatusDot status={status} />
            <span className={cn("font-medium", cfg.color)}>{name}</span>
          </div>
        );
      })}
    </div>
  );
});

HRAgentStatusBar.displayName = "HRAgentStatusBar";
