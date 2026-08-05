"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  TrendingUpIcon,
  TrendingDownIcon,
  MinusIcon,
  DownloadIcon,
  SparklesIcon,
} from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { memo, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ChartTrend = "up" | "down" | "neutral";

export interface ChartCardProps extends ComponentProps<"div"> {
  title: string;
  description?: string;
  /** Optional KPI value shown prominently below the title */
  kpi?: string | number;
  /** Trend indicator */
  trend?: ChartTrend;
  trendLabel?: string;
  /** Green badge shown on AI-enriched charts */
  aiInsight?: string;
  /** Show full-card loading skeleton */
  loading?: boolean;
  /** Raw CSV/JSON data to download */
  downloadData?: Record<string, unknown>[];
  downloadFilename?: string;
  className?: string;
  children?: ReactNode;
}

const TREND_ICON: Record<ChartTrend, ReactNode> = {
  up:      <TrendingUpIcon  className="size-3.5 text-green-500" />,
  down:    <TrendingDownIcon className="size-3.5 text-red-500" />,
  neutral: <MinusIcon className="size-3.5 text-muted-foreground" />,
};

const TREND_COLOR: Record<ChartTrend, string> = {
  up:      "text-green-600",
  down:    "text-red-500",
  neutral: "text-muted-foreground",
};

// ─── ChartCard ────────────────────────────────────────────────────────────────

export const ChartCard = memo(function ChartCard({
  title,
  description,
  kpi,
  trend,
  trendLabel,
  aiInsight,
  loading = false,
  downloadData,
  downloadFilename = "chart-data.csv",
  className,
  children,
  ...props
}: ChartCardProps) {
  const handleDownload = useCallback(() => {
    if (!downloadData?.length) return;
    const keys = Object.keys(downloadData[0]);
    const csv = [
      keys.join(","),
      ...downloadData.map((row) =>
        keys.map((k) => JSON.stringify(row[k] ?? "")).join(","),
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = downloadFilename;
    a.click();
    URL.revokeObjectURL(url);
  }, [downloadData, downloadFilename]);

  if (loading) {
    return (
      <Card className={cn("overflow-hidden", className)} {...props}>
        <CardHeader className="pb-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-48 mt-1" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-40 w-full rounded-md" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("overflow-hidden", className)} {...props}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          {/* Left: title + KPI + description */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <CardTitle className="text-sm font-semibold">{title}</CardTitle>
              {aiInsight && (
                <Badge
                  className="gap-1 border-0 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-[10px] px-1.5 py-0"
                >
                  <SparklesIcon className="size-2.5" />
                  {aiInsight}
                </Badge>
              )}
            </div>

            {/* KPI + trend row */}
            {kpi != null && (
              <div className="mt-1 flex items-center gap-2">
                <span className="text-2xl font-bold tabular-nums">{kpi}</span>
                {trend && trendLabel && (
                  <span className={cn("flex items-center gap-0.5 text-xs font-medium", TREND_COLOR[trend])}>
                    {TREND_ICON[trend]}
                    {trendLabel}
                  </span>
                )}
              </div>
            )}

            {description && (
              <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
            )}
          </div>

          {/* Right: download button */}
          {downloadData && (
            <Button
              size="icon"
              variant="ghost"
              className="size-7 shrink-0 text-muted-foreground hover:text-foreground"
              onClick={handleDownload}
              aria-label="Download chart data"
            >
              <DownloadIcon className="size-3.5" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">{children}</CardContent>
    </Card>
  );
});

ChartCard.displayName = "ChartCard";
