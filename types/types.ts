import type { z } from "zod";
import type {
  DashboardChartDatumSchema,
  DashboardDataSchema,
  DashboardViewModelSchema,
  EmployeeRowSchema,
  ExpiryStatsSchema,
} from "../lib/schema";

export type DashboardData = z.infer<typeof DashboardDataSchema>;
export type DashboardChartDatum = z.infer<typeof DashboardChartDatumSchema>;
export type DashboardViewModel = z.infer<typeof DashboardViewModelSchema>;
export type DashboardEmployeeRow = z.infer<typeof EmployeeRowSchema>;
export type DashboardExpiryStats = z.infer<typeof ExpiryStatsSchema>;
