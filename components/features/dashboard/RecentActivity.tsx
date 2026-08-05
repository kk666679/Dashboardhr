"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Activity } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { ROUTE } from "@/components/dashboard-sidebar/route-mapping";
import { cn } from "@/lib/utils";

/* ─── Data ───────────────────────────────────────────────────────────────── */
const activities = [
  {
    id: 1,
    user: "Ahmad Faris",
    initials: "AF",
    action: "submitted a leave request",
    time: "5 min ago",
    type: "leave" as const,
  },
  {
    id: 2,
    user: "Nurul Ain",
    initials: "NA",
    action: "completed onboarding checklist",
    time: "18 min ago",
    type: "onboarding" as const,
  },
  {
    id: 3,
    user: "Raj Kumar",
    initials: "RK",
    action: "requested expense reimbursement",
    time: "1 hr ago",
    type: "expense" as const,
  },
  {
    id: 4,
    user: "Sarah Lim",
    initials: "SL",
    action: "updated employment profile",
    time: "3 hrs ago",
    type: "profile" as const,
  },
  {
    id: 5,
    user: "Wei Xin",
    initials: "WX",
    action: "submitted weekly timesheet",
    time: "5 hrs ago",
    type: "timesheet" as const,
  },
  {
    id: 6,
    user: "Priya Nair",
    initials: "PN",
    action: "approved contract renewal",
    time: "6 hrs ago",
    type: "contract" as const,
  },
  {
    id: 7,
    user: "Hassan Ali",
    initials: "HA",
    action: "completed FOMEMA examination",
    time: "8 hrs ago",
    type: "medical" as const,
  },
] as const;

type ActivityType = (typeof activities)[number]["type"];

const typeConfig: Record<
  ActivityType,
  { label: string; variant: "default" | "success" | "info" | "warning" | "secondary" | "destructive" }
> = {
  leave:      { label: "Leave",      variant: "warning" },
  onboarding: { label: "Onboarding", variant: "success" },
  expense:    { label: "Expense",    variant: "info" },
  profile:    { label: "Profile",    variant: "secondary" },
  timesheet:  { label: "Timesheet",  variant: "default" },
  contract:   { label: "Contract",   variant: "destructive" },
  medical:    { label: "Medical",    variant: "info" },
};

/* Avatar colors — stable by index */
const avatarColors = [
  { bg: "var(--brand-muted)",         color: "var(--brand)" },
  { bg: "var(--success-subtle)",      color: "var(--success-foreground)" },
  { bg: "var(--warning-subtle)",      color: "var(--warning-foreground)" },
  { bg: "var(--info-subtle)",         color: "var(--info-foreground)" },
  { bg: "var(--destructive-subtle)",  color: "var(--destructive-foreground)" },
  { bg: "var(--surface-3)",           color: "var(--foreground-muted)" },
  { bg: "var(--brand-subtle)",        color: "var(--brand)" },
];

const PREVIEW_COUNT = 4;

/* ─── Single activity row ────────────────────────────────────────────────── */
function ActivityRow({
  activity,
  index,
  reduced,
}: {
  activity: (typeof activities)[number];
  index: number;
  reduced: boolean;
}) {
  const cfg = typeConfig[activity.type];
  const avatarStyle = avatarColors[index % avatarColors.length];

  return (
    <motion.div
      layout
      initial={reduced ? undefined : { opacity: 0, y: 4 }}
      animate={reduced ? undefined : { opacity: 1, y: 0 }}
      exit={reduced ? undefined : { opacity: 0, y: -4 }}
      transition={
        reduced
          ? undefined
          : { duration: 0.22, delay: index * 0.04, type: "spring", stiffness: 360, damping: 32 }
      }
      className={cn(
        "group flex items-start gap-3 rounded-[var(--radius-md)] px-3 py-2.5",
        "transition-colors duration-150 hover:bg-[var(--surface-2)]",
      )}
    >
      {/* Avatar */}
      <Avatar className="size-8 shrink-0 ring-1 ring-[var(--border)]">
        <AvatarImage src="" alt={activity.user} />
        <AvatarFallback
          className="text-[11px] font-semibold"
          style={{ background: avatarStyle.bg, color: avatarStyle.color }}
        >
          {activity.initials}
        </AvatarFallback>
      </Avatar>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5 leading-tight">
          <span className="text-xs font-semibold text-[var(--foreground)]">
            {activity.user}
          </span>
          <span className="text-xs text-[var(--foreground-muted)]">{activity.action}</span>
        </div>
        <div className="mt-1.5 flex items-center gap-2 flex-wrap">
          <Badge variant={cfg.variant} size="xs">
            {cfg.label}
          </Badge>
          <span className="text-[11px] text-[var(--foreground-subtle)]">{activity.time}</span>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────── */
export function RecentActivity() {
  const { t, currentLanguage } = useTranslation();
  const reduced = useReducedMotion() ?? false;
  const [expanded, setExpanded] = useState(false);

  const visible = expanded
    ? (activities as unknown as (typeof activities)[number][])
    : (activities.slice(0, PREVIEW_COUNT) as unknown as (typeof activities)[number][]);
  const hasMore = activities.length > PREVIEW_COUNT;

  return (
    <motion.div
      initial={reduced ? undefined : { opacity: 0, y: 12 }}
      animate={reduced ? undefined : { opacity: 1, y: 0 }}
      transition={
        reduced
          ? undefined
          : { duration: 0.4, type: "spring", stiffness: 300, damping: 28 }
      }
      className={cn(
        "bg-[var(--surface-1)] border border-[var(--border)]",
        "rounded-[var(--radius-lg)] shadow-[var(--shadow-xs)] overflow-hidden",
        "transition-[box-shadow,border-color] duration-200 ease-out",
        "hover:shadow-[var(--shadow-md)] hover:border-[var(--border-strong)]",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-4 px-4 py-3 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <div
            className="flex size-6 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--brand-muted)] text-[var(--brand)]"
            aria-hidden="true"
          >
            <Activity className="size-3.5" />
          </div>
          <h3 className="text-xs font-semibold text-[var(--foreground)] tracking-[-0.01em]">
            {(t("dashboard.recentActivity") as string) || "Recent Activity"}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-[var(--foreground-subtle)] tabular-nums">
            {activities.length} events today
          </span>
          <Button
            variant="ghost"
            size="xs"
            className="text-[var(--foreground-subtle)] hover:text-[var(--brand)]"
            asChild
          >
            <Link href={ROUTE.dashboard.withLocale(currentLanguage, ROUTE.dashboard.auditTrail.root)}>View all</Link>
          </Button>
        </div>
      </div>

      {/* Activity list */}
      <div className="px-1 py-2" id="activity-list">
        <AnimatePresence initial={false}>
          {visible.map((activity, i) => (
            <ActivityRow
              key={activity.id}
              activity={activity}
              index={i}
              reduced={reduced}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Expand/collapse */}
      {hasMore && (
        <div className="border-t border-[var(--border)] px-4 py-2">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "w-full h-8 text-xs gap-1.5",
              "text-[var(--foreground-muted)] hover:text-[var(--foreground)]",
            )}
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            aria-controls="activity-list"
          >
            {expanded ? (
              <>
                <ChevronUp className="size-3.5" aria-hidden="true" />
                Show less
              </>
            ) : (
              <>
                <ChevronDown className="size-3.5" aria-hidden="true" />
                Show {activities.length - PREVIEW_COUNT} more
              </>
            )}
          </Button>
        </div>
      )}
    </motion.div>
  );
}
