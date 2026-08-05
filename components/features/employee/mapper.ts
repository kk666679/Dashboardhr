import { ExpatStatusSchema, ExpatriatesDashboardSchema } from "./schema";
import type { ExpatStats, Expatriate, ExpatriatesDashboard } from "./types";

const DEFAULT_STATUS_COUNTS = Object.fromEntries(
  ExpatStatusSchema.options.map((status) => [status, 0]),
) as Record<string, number>;

export function buildExpatStats(expatriates: Expatriate[]): ExpatStats {
  const byStatus = { ...DEFAULT_STATUS_COUNTS };

  for (const expatriate of expatriates) {
    byStatus[expatriate.status] = (byStatus[expatriate.status] ?? 0) + 1;
  }

  return {
    total: expatriates.length,
    byStatus,
    criticalRenewals: expatriates.filter(
      (expatriate) => expatriate.status === "RENEWAL_PENDING",
    ).length,
  };
}

export function buildExpatriatesDashboard(
  expatriates: Expatriate[],
): ExpatriatesDashboard {
  return ExpatriatesDashboardSchema.parse({
    expatriates,
    stats: buildExpatStats(expatriates),
  });
}
