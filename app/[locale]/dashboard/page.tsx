"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";
import { ExecutiveOverview } from "@/components/features/dashboard/ExecutiveOverview";
import { RecentActivity } from "@/components/features/dashboard/RecentActivity";
import { DashboardAnalytics } from "@/components/features/dashboard/DashboardAnalytics";
import { RightRail } from "@/components/features/dashboard/RightRail";
import { motion, useReducedMotion } from "framer-motion";
import { CalendarDays, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LOCALE_BCP47 } from "@/i18n/config";
import { DashboardAIInsights } from "@/components/features/dashboard/DashboardAIInsights";

/* ── Main page ── */
export default function LocaleDashboardPage() {
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => { setMounted(true); }, []);

  const formattedDate = useMemo(() => {
    if (!mounted) return "";
    return new Date().toLocaleDateString((LOCALE_BCP47 as Record<string, string>)[locale] ?? "en-US", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
    });
  }, [locale, mounted]);

  if (!mounted) return null;

  return (
    <motion.div
      key="dashboard-content"
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 8 }}
      animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
    >

              {/* ── Page header ── */}
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-[var(--foreground)] sm:text-2xl">
                    {(t("dashboard.title") as string) || "HR Dashboard"}
                  </h1>
                  <p className="mt-0.5 text-sm text-[var(--foreground-muted)]">
                    {(t("dashboard.overview") as string) || "Welcome back — here's what's happening today."}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center gap-1.5 text-xs text-[var(--foreground-subtle)]">
                    <CalendarDays className="size-3.5" aria-hidden="true" />
                    <span>{formattedDate}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-xs"
                    aria-label="Refresh dashboard data"
                  >
                    <RefreshCw className="size-3.5" aria-hidden="true" />
                    Refresh
                  </Button>
                </div>
              </div>

              {/* ── KPI tiles ── */}
              <section aria-label="Key performance indicators" className="mb-5">
                <ExecutiveOverview />
              </section>

              <section aria-label="AI dashboard insights" className="mb-5">
                <DashboardAIInsights />
              </section>

              {/* ── Main grid: charts (3 cols) + right rail (1 col) ── */}
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 mb-4">
                <section
                  className="lg:col-span-3"
                  aria-label="Analytics charts"
                >
                  <DashboardAnalytics />
                </section>
                <section
                  className="lg:col-span-1"
                  aria-label="Events and quick actions"
                >
                  <RightRail />
                </section>
              </div>

              {/* ── Recent activity ── */}
              <section aria-label="Recent HR activity">
                <RecentActivity />
              </section>

    </motion.div>
  );
}
