"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ROUTE } from "./route-mapping";
import {
  LayoutDashboard,
  BarChart3,
  Users,
  CreditCard,
  Shield,
  Settings,
  HeartPulse,
  Briefcase,
  Workflow,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/useTranslation";


/* ── Top-level quick-nav items (subset of full sidebar) ── */

export function Navbar() {
  const pathname = usePathname();
  const { currentLanguage } = useTranslation();

  const topNavItems = [
    {
      title: "Overview",
      href: ROUTE.dashboard.withLocale(currentLanguage, ROUTE.dashboard.root),
      icon: LayoutDashboard,
    },
    { title: "Analytics", href: ROUTE.dashboard.withLocale(currentLanguage, ROUTE.dashboard.analytics), icon: BarChart3 },
    { title: "People", href: ROUTE.dashboard.withLocale(currentLanguage, ROUTE.dashboard.workers.root), icon: Users },
    { title: "Payroll", href: ROUTE.dashboard.withLocale(currentLanguage, ROUTE.dashboard.payroll.root), icon: CreditCard },
    { title: "Compliance", href: ROUTE.dashboard.withLocale(currentLanguage, ROUTE.dashboard.compliance.root), icon: Shield },
    { title: "Medical", href: ROUTE.dashboard.withLocale(currentLanguage, ROUTE.dashboard.medical.root), icon: HeartPulse },
    { title: "Talent", href: ROUTE.dashboard.withLocale(currentLanguage, ROUTE.dashboard.recruitment.root), icon: Briefcase },
    { title: "Automation", href: ROUTE.dashboard.withLocale(currentLanguage, ROUTE.dashboard.automation.root), icon: Workflow },
    { title: "Settings", href: ROUTE.dashboard.withLocale(currentLanguage, ROUTE.dashboard.settings.root), icon: Settings },
  ] as const;

  return (
    <div className="border-b border-[var(--border)] bg-[var(--background-subtle)]">
      <ScrollArea className="w-full">
        <nav
          className="flex h-10 items-center gap-0.5 px-3"
          aria-label="Quick navigation"
        >
          {topNavItems.map((item) => {
            const isActive =
              pathname === item.href || pathname?.startsWith(item.href + "/");

            return (
              <Link
                key={item.title}
                href={item.href}
                className={cn(
                  "group relative flex items-center gap-1.5 px-2.5 h-7 rounded-[var(--radius-md)]",
                  "text-xs font-medium whitespace-nowrap",
                  "transition-all duration-150 ease-out",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
                  isActive
                    ? [
                        "bg-[var(--brand-muted)] text-[var(--brand)]",
                      ].join(" ")
                    : [
                        "text-[var(--foreground-muted)]",
                        "hover:bg-[var(--surface-1)] hover:text-[var(--foreground)]",
                      ].join(" "),
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <item.icon
                  className={cn(
                    "size-3.5 shrink-0",
                    isActive
                      ? "text-[var(--brand)]"
                      : "text-[var(--foreground-subtle)] group-hover:text-[var(--foreground)]",
                    "transition-colors duration-150",
                  )}
                  aria-hidden="true"
                />
                {item.title}
              </Link>
            );
          })}
        </nav>
        <ScrollBar orientation="horizontal" className="h-1" />
      </ScrollArea>
    </div>
  );
}
