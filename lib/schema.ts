import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { EmployeeRowSchema } from "@/lib/schemas";

export { EmployeeRowSchema };

// Dashboard schemas
export const DashboardDataSchema = z.object({
  employees: z.array(EmployeeRowSchema),
  stats: z.object({
    total: z.number(),
    active: z.number(),
    foreign: z.number(),
  }),
});

export const ExpiryStatsSchema = z.object({
  imminent: z.number(),
  upcoming: z.number(),
  overdue: z.number(),
});

export const DashboardChartDatumSchema = z.object({
  category: z.string(),
  value: z.number().int().nonnegative(),
  fill: z.string(),
});

export const DashboardViewModelSchema = DashboardDataSchema.extend({
  chartData: z.array(DashboardChartDatumSchema),
  complianceScore: z.number().int().min(0).max(100),
});

export const dashboardJsonSchemas = {
  dashboardData: zodToJsonSchema(DashboardDataSchema as any, {
    name: "DashboardData",
  }),
  dashboardViewModel: zodToJsonSchema(DashboardViewModelSchema as any, {
    name: "DashboardViewModel",
  }),
};
