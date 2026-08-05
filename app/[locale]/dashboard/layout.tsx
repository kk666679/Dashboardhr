import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { LOCALES } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import { DashboardShell } from "@/components/layout/DashboardShell";

interface LocaleDashboardLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleDashboardLayout({
  children,
  params,
}: LocaleDashboardLayoutProps) {
  const { locale } = await params;

  if (!LOCALES.includes(locale as Locale)) {
    notFound();
  }

  return <DashboardShell>{children}</DashboardShell>;
}
