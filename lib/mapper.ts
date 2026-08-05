import { DashboardViewModelSchema } from "@/lib/schema";
import type { z } from "zod";

type DashboardViewModel = z.infer<typeof DashboardViewModelSchema>;

interface DashboardData {
  employees: DashboardViewModel["employees"];
  stats: DashboardViewModel["stats"];
  expiryStats?: { total: number; safe: number; imminent: number; soon: number };
}

export function buildDashboardViewModel(data: DashboardData): DashboardViewModel {
  const total = data.expiryStats?.total ?? 0;
  const safe = data.expiryStats?.safe ?? 0;
  const complianceScore = total > 0 ? Math.round((safe / total) * 100) : 100;

  return DashboardViewModelSchema.parse({
    employees: data.employees,
    stats: data.stats,
    chartData: [
      {
        category: "Critical (<30d)",
        value: data.expiryStats?.imminent ?? 0,
        fill: "#ef4444",
      },
      {
        category: "Soon (30-60d)",
        value: data.expiryStats?.soon ?? 0,
        fill: "#f59e0b",
      },
      {
        category: "Safe (>60d)",
        value: safe,
        fill: "#10b981",
      },
    ],
    complianceScore,
  });
}
