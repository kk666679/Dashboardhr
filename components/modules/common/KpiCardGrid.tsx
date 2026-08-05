"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export interface KpiItem {
  label: string;
  value: ReactNode;
  sub?: string;
  icon?: ReactNode;
  color?: string;
  trend?: "up" | "down" | "neutral";
  loading?: boolean;
}

interface KpiCardGridProps {
  items: KpiItem[];
  columns?: 2 | 3 | 4 | 5 | 6;
  className?: string;
}

const COLUMN_MAP: Record<number, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "md:grid-cols-2 lg:grid-cols-4",
  5: "md:grid-cols-3 lg:grid-cols-5",
  6: "md:grid-cols-3 xl:grid-cols-6",
};

const TREND_COLORS: Record<string, string> = {
  up: "text-green-600",
  down: "text-red-500",
  neutral: "text-muted-foreground",
};

export function KpiCardGrid({ items, columns = 4, className }: KpiCardGridProps) {
  return (
    <div className={cn("grid gap-4 grid-cols-1", COLUMN_MAP[columns] ?? COLUMN_MAP[4], className)}>
      {items.map((item, i) => (
        <Card key={`${item.label}-${i}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{item.label}</CardTitle>
            {item.icon && (
              <div className={item.color ?? "text-muted-foreground"}>
                {item.icon}
              </div>
            )}
          </CardHeader>
          <CardContent>
            {item.loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div
                className={cn(
                  "text-2xl font-bold tracking-tight",
                  item.color,
                  item.trend && TREND_COLORS[item.trend],
                )}
              >
                {item.value}
              </div>
            )}
            {item.sub && (
              <p className="text-xs text-muted-foreground mt-1">{item.sub}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
