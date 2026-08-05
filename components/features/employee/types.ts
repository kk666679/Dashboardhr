import type { z } from "zod";
import type {
  ExpatriateSchema,
  ExpatriatesDashboardSchema,
  ExpatStatsSchema,
  ExpatStatusSchema,
} from "./schema";

export type ExpatStatus = z.infer<typeof ExpatStatusSchema>;
export type Expatriate = z.infer<typeof ExpatriateSchema>;
export type ExpatStats = z.infer<typeof ExpatStatsSchema>;
export type ExpatriatesDashboard = z.infer<typeof ExpatriatesDashboardSchema>;
