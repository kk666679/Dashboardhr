"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";
import { ROUTE } from "@/components/dashboard-sidebar/route-mapping";
import {
  Bell,
  Calendar,
  Clock,
  Users,
  AlertCircle,
  ArrowRight,
  Zap,
  UserPlus,
  CreditCard,
  BarChart3,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* ─── Types ──────────────────────────────────────────────────────────────── */
interface CalEvent {
  title: string;
  time: string;
  type: "meeting" | "deadline" | "holiday";
}

interface NotifItem {
  title: string;
  count: number;
  icon: React.ElementType;
  variant: "default" | "warning" | "destructive";
}

interface QuickAction {
  label: string;
  href: string;
  icon: React.ElementType;
  description: string;
}

/* ─── Data ───────────────────────────────────────────────────────────────── */
const upcomingEvents: CalEvent[] = [
  { title: "Team Stand-Up", time: "Today, 2:00 PM", type: "meeting" },
  { title: "Payroll Review Deadline", time: "Tomorrow, 5:00 PM", type: "deadline" },
  { title: "Public Holiday – Malaysia", time: "15 Mar 2025", type: "holiday" },
];

const notifications: NotifItem[] = [
  { title: "New hire requests", count: 3, icon: Users, variant: "default" },
  { title: "Pending approvals", count: 5, icon: Clock, variant: "warning" },
  { title: "System alerts", count: 2, icon: AlertCircle, variant: "destructive" },
];

const quickActions: QuickAction[] = [
  {
    label: "Add Employee",
    href: "/employees/new",
    icon: UserPlus,
    description: "Onboard a new team member",
  },
  {
    label: "Run Payroll",
    href: "/dashboard/payroll",
    icon: CreditCard,
    description: "Process monthly payroll run",
  },
  {
    label: "View Reports",
    href: "/dashboard/analytics",
    icon: BarChart3,
    description: "HR analytics & insights",
  },
];

/* ─── Event type config ──────────────────────────────────────────────────── */
const eventConfig: Record<
  CalEvent["type"],
  { dotColor: string; badgeVariant: "info" | "destructive" | "success" }
> = {
  meeting:  { dotColor: "var(--info)",        badgeVariant: "info" },
  deadline: { dotColor: "var(--destructive)",  badgeVariant: "destructive" },
  holiday:  { dotColor: "var(--success)",      badgeVariant: "success" },
};

/* ─── Widget shell ───────────────────────────────────────────────────────── */
function Widget({
  title,
  icon: Icon,
  action,
  children,
  delay = 0,
  reduced,
}: {
  title: string;
  icon: React.ElementType;
  action?: React.ReactNode;
  children: React.ReactNode;
  delay?: number;
  reduced: boolean;
}) {
  return (
    <motion.div
      initial={reduced ? undefined : { opacity: 0, y: 12 }}
      animate={reduced ? undefined : { opacity: 1, y: 0 }}
      transition={
        reduced
          ? undefined
          : { duration: 0.4, delay, type: "spring", stiffness: 300, damping: 28 }
      }
      className={cn(
        "bg-[var(--surface-1)] border border-[var(--border)]",
        "rounded-[var(--radius-lg)] shadow-[var(--shadow-xs)] overflow-hidden",
        "transition-[box-shadow,border-color] duration-200 ease-out",
        "hover:shadow-[var(--shadow-md)] hover:border-[var(--border-strong)]",
      )}
    >
      {/* Widget header */}
      <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <div
            className="flex size-6 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--brand-muted)] text-[var(--brand)]"
            aria-hidden="true"
          >
            <Icon className="size-3.5" />
          </div>
          <h3 className="text-xs font-semibold text-[var(--foreground)] tracking-[-0.01em]">
            {title}
          </h3>
        </div>
        {action}
      </div>

      {/* Widget content */}
      <div className="p-3">{children}</div>
    </motion.div>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────── */
export function RightRail() {
  const { t, currentLanguage } = useTranslation();
  const reduced = useReducedMotion() ?? false;

  return (
    <div className="space-y-3">
      {/* ── Upcoming Events ── */}
      <Widget
        title={(t("dashboard.upcomingEvents") as string) || "Upcoming Events"}
        icon={Calendar}
        delay={0}
        reduced={reduced}
        action={
          <Button
            variant="ghost"
            size="xs"
            className="text-[var(--foreground-subtle)] hover:text-[var(--brand)]"
            asChild
          >
            <Link href={ROUTE.dashboard.withLocale(currentLanguage, ROUTE.dashboard.scheduling.root)}>View all</Link>
          </Button>
        }
      >
        <div className="space-y-1.5">
          {upcomingEvents.map((event, i) => {
            const cfg = eventConfig[event.type];
            return (
              <motion.div
                key={i}
                initial={reduced ? undefined : { opacity: 0, x: 6 }}
                animate={reduced ? undefined : { opacity: 1, x: 0 }}
                transition={
                  reduced ? undefined : { duration: 0.25, delay: 0.06 + i * 0.05 }
                }
                className={cn(
                  "group flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5",
                  "bg-[var(--surface-0)] border border-[var(--border)]",
                  "transition-colors duration-150 hover:bg-[var(--surface-2)] hover:border-[var(--border-strong)]",
                  "cursor-default",
                )}
              >
                {/* Dot */}
                <span
                  className="size-2 shrink-0 rounded-full"
                  style={{ background: cfg.dotColor }}
                  aria-hidden="true"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium leading-tight truncate">
                    {event.title}
                  </p>
                  <p className="text-[11px] text-[var(--foreground-muted)] mt-0.5">
                    {event.time}
                  </p>
                </div>
                <Badge variant={cfg.badgeVariant} size="xs" className="shrink-0 capitalize">
                  {event.type}
                </Badge>
              </motion.div>
            );
          })}
        </div>
      </Widget>

      {/* ── Notifications ── */}
      <Widget
        title={(t("dashboard.notifications") as string) || "Notifications"}
        icon={Bell}
        delay={0.06}
        reduced={reduced}
        action={
          <Button
            variant="ghost"
            size="xs"
            className="text-[var(--foreground-subtle)] hover:text-[var(--brand)]"
            asChild
          >
            <Link href={ROUTE.dashboard.withLocale(currentLanguage, ROUTE.dashboard.notifications.root)}>View all</Link>
          </Button>
        }
      >
        <div className="space-y-1.5">
          {notifications.map((item, i) => (
            <motion.div
              key={i}
              initial={reduced ? undefined : { opacity: 0, x: 6 }}
              animate={reduced ? undefined : { opacity: 1, x: 0 }}
              transition={
                reduced ? undefined : { duration: 0.25, delay: 0.1 + i * 0.05 }
              }
              className={cn(
                "flex items-center justify-between gap-2 rounded-[var(--radius-md)] px-3 py-2",
                "bg-[var(--surface-0)] border border-[var(--border)]",
                "transition-colors duration-150 hover:bg-[var(--surface-2)]",
                "cursor-default",
              )}
            >
              <div className="flex items-center gap-2 min-w-0">
                <item.icon
                  className="size-3.5 shrink-0 text-[var(--foreground-muted)]"
                  aria-hidden="true"
                />
                <span className="text-xs text-[var(--foreground)] truncate">
                  {item.title}
                </span>
              </div>
              <Badge variant={item.variant} size="xs" className="shrink-0 tabular-nums">
                {item.count}
              </Badge>
            </motion.div>
          ))}
        </div>
      </Widget>

      {/* ── Quick Actions ── */}
      <Widget
        title="Quick Actions"
        icon={Zap}
        delay={0.12}
        reduced={reduced}
      >
        <div className="space-y-1.5">
          {quickActions.map((action, i) => (
            <motion.div
              key={i}
              initial={reduced ? undefined : { opacity: 0, x: 6 }}
              animate={reduced ? undefined : { opacity: 1, x: 0 }}
              transition={
                reduced ? undefined : { duration: 0.25, delay: 0.16 + i * 0.05 }
              }
            >
              <Link
                href={action.href}
                className={cn(
                  "group flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5",
                  "bg-[var(--surface-0)] border border-[var(--border)]",
                  "transition-all duration-150",
                  "hover:bg-[var(--brand-muted)] hover:border-[oklch(from_var(--brand)_l_c_h_/_0.25)]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
                )}
              >
                <div
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-[var(--radius-sm)]",
                    "bg-[var(--surface-2)] text-[var(--foreground-muted)]",
                    "group-hover:bg-[var(--brand-subtle)] group-hover:text-[var(--brand)]",
                    "transition-colors duration-150",
                  )}
                  aria-hidden="true"
                >
                  <action.icon className="size-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium leading-tight text-[var(--foreground)] group-hover:text-[var(--brand)] transition-colors duration-150">
                    {action.label}
                  </p>
                  <p className="text-[11px] text-[var(--foreground-muted)] mt-0.5 truncate">
                    {action.description}
                  </p>
                </div>
                <ArrowRight
                  className="size-3.5 shrink-0 text-[var(--foreground-subtle)] group-hover:text-[var(--brand)] group-hover:translate-x-0.5 transition-[color,transform] duration-150"
                  aria-hidden="true"
                />
              </Link>
            </motion.div>
          ))}
        </div>
      </Widget>
    </div>
  );
}
