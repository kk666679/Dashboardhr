"use client";

import { NotificationCenter } from "@/components/features/notifications/notification-center";
import { PageShell, PageHeader } from "@/components/layout/page-shell";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotificationsPage() {
  return (
    <PageShell>
      <PageHeader
        title="Notifications"
        description="Stay on top of alerts, approvals, and system events."
        actions={
          <Button variant="outline" size="sm">
            Mark all as read
          </Button>
        }
        badge={
          <div className="flex size-5 items-center justify-center rounded-full bg-[var(--brand)] text-[10px] font-bold text-[var(--brand-foreground)]">
            3
          </div>
        }
      />
      <NotificationCenter />
    </PageShell>
  );
}
