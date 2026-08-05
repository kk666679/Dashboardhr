"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  Info,
  X,
  BellOff,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Notification, NotificationType } from "./notification-service";

const priorityConfig = {
  URGENT: {
    color: "text-red-600",
    bg: "bg-red-50 border-l-red-500",
    icon: AlertTriangle,
  },
  HIGH: {
    color: "text-orange-600",
    bg: "bg-orange-50 border-l-orange-400",
    icon: AlertTriangle,
  },
  MEDIUM: {
    color: "text-blue-600",
    bg: "bg-blue-50 border-l-blue-400",
    icon: Info,
  },
  LOW: {
    color: "text-gray-500",
    bg: "bg-gray-50 border-l-gray-300",
    icon: Info,
  },
};

interface NotificationItemProps {
  notification: Notification;
  onMarkRead?: (id: string) => void;
  onDismiss?: (id: string) => void;
}

export function NotificationItem({
  notification,
  onMarkRead,
  onDismiss,
}: NotificationItemProps) {
  const cfg = priorityConfig[notification.priority];
  const Icon = cfg.icon;

  return (
    <div
      className={`flex gap-3 p-3 border-l-4 rounded-r-lg ${cfg.bg} ${!notification.read ? "opacity-100" : "opacity-60"}`}
    >
      <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${cfg.color}`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p
            className={`text-sm font-medium ${!notification.read ? "text-foreground" : "text-muted-foreground"}`}
          >
            {notification.title}
          </p>
          <div className="flex items-center gap-1 shrink-0">
            {!notification.read && (
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5"
                onClick={() => onMarkRead?.(notification.id)}
              >
                <CheckCircle className="h-3 w-3" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5"
              onClick={() => onDismiss?.(notification.id)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          {notification.message}
        </p>
        <div className="flex items-center gap-2 mt-1.5">
          <Badge variant="outline" className="text-[10px] h-4 px-1">
            {notification.type.replace(/_/g, " ")}
          </Badge>
          <span className="text-[10px] text-muted-foreground">
            {new Date(notification.createdAt).toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>
  );
}

interface NotificationPanelProps {
  notifications?: Notification[];
  loading?: boolean;
  onMarkRead?: (id: string) => void;
  onMarkAllRead?: () => void;
  onDismiss?: (id: string) => void;
}

export function NotificationPanel({
  notifications = [],
  loading,
  onMarkRead,
  onMarkAllRead,
  onDismiss,
}: NotificationPanelProps) {
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const unread = notifications.filter((n) => !n.read);
  const displayed = filter === "unread" ? unread : notifications;

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Bell className="h-4 w-4" />
            Notifications
            {unread.length > 0 && (
              <Badge variant="destructive" className="h-5 px-1.5 text-xs">
                {unread.length}
              </Badge>
            )}
          </CardTitle>
          {unread.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={onMarkAllRead}
            >
              Mark all read
            </Button>
          )}
        </div>
      </CardHeader>

      <Tabs
        value={filter}
        onValueChange={(v) => setFilter(v as "all" | "unread")}
      >
        <div className="px-4">
          <TabsList className="w-full h-8">
            <TabsTrigger value="all" className="flex-1 text-xs">
              All ({notifications.length})
            </TabsTrigger>
            <TabsTrigger value="unread" className="flex-1 text-xs">
              Unread ({unread.length})
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={filter} className="mt-0">
          <CardContent className="pt-3 px-3">
            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 rounded-lg" />
                ))}
              </div>
            ) : displayed.length > 0 ? (
              <ScrollArea className="h-80">
                <div className="space-y-2 pr-2">
                  {displayed.map((n, i) => (
                    <div key={n.id}>
                      <NotificationItem
                        notification={n}
                        onMarkRead={onMarkRead}
                        onDismiss={onDismiss}
                      />
                      {i < displayed.length - 1 && (
                        <Separator className="my-1" />
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                <BellOff className="h-8 w-8 mb-2 opacity-40" />
                <p className="text-sm">
                  {filter === "unread"
                    ? "No unread notifications"
                    : "No notifications"}
                </p>
              </div>
            )}
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
