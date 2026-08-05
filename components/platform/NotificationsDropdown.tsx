"use client";

import { useState, useMemo, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Bell,
  CheckCheck,
  X,
  Trash2,
  Clock,
  Loader2,
  AlertCircle,
  CheckCircle,
  Info,
  AlertTriangle,
  Settings,
  ChevronRight,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

export type NotificationType = "info" | "success" | "warning" | "error";

export type NotificationSource =
  | "system"
  | "payroll"
  | "compliance"
  | "leave"
  | "onboarding"
  | "offboarding"
  | "recruitment"
  | "performance"
  | "workflow"
  | "ai"
  | "document";

export interface Notification {
  id: string;
  type: NotificationType;
  source: NotificationSource;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionable?: boolean;
  actionLabel?: string;
  actionHref?: string;
  groupKey?: string;
  iconUrl?: string;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const NOTIFICATION_ICONS: Record<NotificationType, React.ComponentType<{ className?: string }>> = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle,
};

const TYPE_STYLES: Record<NotificationType, string> = {
  info: "text-blue-500",
  success: "text-green-500",
  warning: "text-amber-500",
  error: "text-red-500",
};

const SOURCE_LABELS: Record<NotificationSource, string> = {
  system: "System",
  payroll: "Payroll",
  compliance: "Compliance",
  leave: "Leave",
  onboarding: "Onboarding",
  offboarding: "Offboarding",
  recruitment: "Recruitment",
  performance: "Performance",
  workflow: "Workflow",
  ai: "AI",
  document: "Document",
};

// ─── Props ────────────────────────────────────────────────────────────────────

export interface NotificationsDropdownProps {
  notifications?: Notification[];
  isLoading?: boolean;
  onMarkRead?: (id: string) => void;
  onMarkAllRead?: () => void;
  onDismiss?: (id: string) => void;
  onClearAll?: () => void;
  onAction?: (notification: Notification) => void;
  onViewAll?: () => void;
  maxVisible?: number;
  groupBySource?: boolean;
  className?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(date: Date): string {
  const now = Date.now();
  const diff = now - date.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ─── Notification Item ────────────────────────────────────────────────────────

function NotificationItem({
  notification,
  onMarkRead,
  onDismiss,
  onAction,
}: {
  notification: Notification;
  onMarkRead?: (id: string) => void;
  onDismiss?: (id: string) => void;
  onAction?: (notification: Notification) => void;
}) {
  const Icon = NOTIFICATION_ICONS[notification.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.15 }}
      className={cn(
        "group relative flex gap-3 px-4 py-3 transition-colors",
        "hover:bg-muted/50",
        !notification.read && "bg-primary/5"
      )}
    >
      {!notification.read && (
        <span className="absolute left-1.5 top-4 size-1.5 rounded-full bg-primary" aria-hidden="true" />
      )}

      <span
        className={cn(
          "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full",
          TYPE_STYLES[notification.type],
          !notification.read ? "bg-primary/10" : "bg-muted"
        )}
      >
        <Icon className="size-3.5" />
      </span>

      <div className="flex-1 min-w-0">
        <p className={cn("text-sm leading-tight", !notification.read ? "font-semibold" : "font-medium text-muted-foreground")}>
          {notification.title}
        </p>
        <p className="text-xs text-muted-foreground/70 mt-0.5 line-clamp-2">{notification.message}</p>

        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-[10px] text-muted-foreground/50 flex items-center gap-1">
            <Clock className="size-2.5" />
            {formatTime(notification.timestamp)}
          </span>
          <Badge variant="secondary" className="text-[9px] px-1 py-0 font-normal">
            {SOURCE_LABELS[notification.source]}
          </Badge>
          {notification.actionable && (
            <Button variant="ghost" size="sm" className="ml-auto h-5 px-1.5 text-[10px] text-primary" onClick={() => onAction?.(notification)}>
              {notification.actionLabel || "View"} <ChevronRight className="size-2.5 ml-0.5" />
            </Button>
          )}
        </div>
      </div>

      <div className="absolute right-2 top-2 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        {!notification.read && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button onClick={() => onMarkRead?.(notification.id)} className="flex size-6 items-center justify-center rounded-md text-muted-foreground/50 hover:text-foreground hover:bg-muted" aria-label="Mark as read">
                  <CheckCheck className="size-3" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Mark as read</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button onClick={() => onDismiss?.(notification.id)} className="flex size-6 items-center justify-center rounded-md text-muted-foreground/50 hover:text-foreground hover:bg-muted" aria-label="Dismiss">
                <X className="size-3" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Dismiss</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </motion.div>
  );
}

// ─── States ───────────────────────────────────────────────────────────────────

function NotificationsEmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 py-12 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-muted">
        <Bell className="size-6 text-muted-foreground/40" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">No notifications</p>
        <p className="text-xs text-muted-foreground/60 max-w-[200px]">You&apos;re all caught up!</p>
      </div>
    </div>
  );
}

function NotificationsLoading() {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="size-5 animate-spin text-muted-foreground/50" />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function NotificationsDropdown({
  notifications = [],
  isLoading = false,
  onMarkRead,
  onMarkAllRead,
  onDismiss,
  onClearAll,
  onAction,
  onViewAll,
  maxVisible = 10,
  groupBySource = false,
  className,
}: NotificationsDropdownProps) {
  const [open, setOpen] = useState(false);
  const visibleNotifications = notifications.slice(0, maxVisible);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const grouped = useMemo(() => {
    if (!groupBySource) return null;
    const groups = new Map<NotificationSource, Notification[]>();
    visibleNotifications.forEach((n) => {
      const existing = groups.get(n.source) || [];
      existing.push(n);
      groups.set(n.source, existing);
    });
    return Array.from(groups.entries());
  }, [visibleNotifications, groupBySource]);

  const hasMore = notifications.length > maxVisible;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("relative text-muted-foreground hover:text-foreground", unreadCount > 0 && "text-foreground", className)}
          aria-label={`Notifications (${unreadCount} unread)`}
        >
          <Bell className="size-[1.1rem]" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground ring-2 ring-background">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" sideOffset={8} className="w-[380px] p-0 shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold">Notifications</h3>
            {unreadCount > 0 && <Badge variant="default" className="text-[10px] px-1.5 py-0">{unreadCount} new</Badge>}
          </div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon-sm" className="size-7" onClick={() => onMarkAllRead?.()} aria-label="Mark all as read">
                      <CheckCheck className="size-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Mark all as read</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon-sm" className="size-7" onClick={() => onClearAll?.()} aria-label="Clear all">
                    <Trash2 className="size-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Clear all</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="max-h-[400px]">
          {isLoading ? (
            <NotificationsLoading />
          ) : notifications.length === 0 ? (
            <NotificationsEmptyState />
          ) : grouped ? (
            grouped.map(([source, items]) => (
              <div key={source}>
                <div className="px-4 py-2 bg-muted/30">
                  <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">{SOURCE_LABELS[source]}</span>
                </div>
                <AnimatePresence>
                  {items.map((n) => (
                    <NotificationItem key={n.id} notification={n} onMarkRead={onMarkRead} onDismiss={onDismiss} onAction={onAction} />
                  ))}
                </AnimatePresence>
              </div>
            ))
          ) : (
            <AnimatePresence>
              {visibleNotifications.map((n) => (
                <NotificationItem key={n.id} notification={n} onMarkRead={onMarkRead} onDismiss={onDismiss} onAction={onAction} />
              ))}
            </AnimatePresence>
          )}
        </ScrollArea>

        {/* Footer */}
        <div className="border-t px-4 py-2.5 flex items-center justify-between">
          <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => onViewAll?.()}>
            View all
            {hasMore && <span className="ml-1 text-muted-foreground">({notifications.length - maxVisible} more)</span>}
          </Button>
          <Button variant="ghost" size="icon-sm" className="size-7" aria-label="Notification settings">
            <Settings className="size-3.5" />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

