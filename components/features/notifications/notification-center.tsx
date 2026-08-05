"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  FileText,
  Users,
  Heart,
  Building,
  X,
  BookMarkedIcon as MarkAsRead,
} from "lucide-react";

interface Notification {
  id: string;
  type: "success" | "warning" | "info" | "error";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  category: "permit" | "medical" | "worker" | "accommodation" | "system";
  actionUrl?: string;
}

const mockNotifications: Notification[] = [];

export function NotificationCenter() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const getNotificationIcon = (type: string, category: string) => {
    if (type === "success") return CheckCircle;
    if (type === "warning") return AlertTriangle;
    if (type === "error") return AlertTriangle;

    switch (category) {
      case "permit":
        return FileText;
      case "medical":
        return Heart;
      case "worker":
        return Users;
      case "accommodation":
        return Building;
      default:
        return Bell;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "success":
        return "text-green-600";
      case "warning":
        return "text-orange-600";
      case "error":
        return "text-red-600";
      default:
        return "text-blue-600";
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const dismissNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const filteredNotifications = notifications.filter(
    (n) => filter === "all" || !n.read,
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilter(filter === "all" ? "unread" : "all")}
            >
              {filter === "all" ? "Unread" : "All"}
            </Button>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                <MarkAsRead className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        <CardDescription>
          Stay updated with important system notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-96">
          <div className="space-y-1">
            {filteredNotifications.map((notification, index) => {
              const Icon = getNotificationIcon(
                notification.type,
                notification.category,
              );
              const iconColor = getNotificationColor(notification.type);

              return (
                <div key={notification.id}>
                  <div
                    className={`p-4 hover:bg-gray-50 transition-colors ${
                      !notification.read
                        ? "bg-blue-50 border-l-4 border-l-blue-500"
                        : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className={`h-5 w-5 mt-0.5 ${iconColor}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <h4 className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </h4>
                          <div className="flex items-center gap-1 ml-2">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => markAsRead(notification.id)}
                              >
                                <CheckCircle className="h-3 w-3" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() =>
                                dismissNotification(notification.id)
                              }
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">
                            {formatTimestamp(notification.timestamp)}
                          </span>
                          {notification.actionUrl && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs h-6"
                            >
                              View Details
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  {index < filteredNotifications.length - 1 && <Separator />}
                </div>
              );
            })}
          </div>

          {filteredNotifications.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">
                {filter === "unread"
                  ? "No unread notifications"
                  : "No notifications"}
              </p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
