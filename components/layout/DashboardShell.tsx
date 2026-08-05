"use client";

import { AppShell } from "@/components/platform/AppShell";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return <AppShell productId="dashboard">{children}</AppShell>;
}
