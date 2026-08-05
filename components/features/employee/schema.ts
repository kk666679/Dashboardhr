import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

export const ExpatStatusSchema = z.enum([
  "ONBOARDING",
  "ACTIVE",
  "RELOCATION",
  "RENEWAL_PENDING",
  "TERMINATING",
  "TERMINATED",
]);

export const ExpatriateAllowanceSchema = z.object({
  type: z.string(),
  amount: z.number(),
  currency: z.string().default("MYR"),
  description: z.string().optional(),
});

export const RelocationInfoSchema = z.object({
  originCountry: z.string(),
  arrivalDate: z.string(),
  orientationCompleted: z.boolean(),
});

export const TaxInfoSchema = z.object({
  taxResidency: z.enum(["Malaysia", "HomeCountry", "None"]),
  pcbBracket: z.string().optional().default(""),
  epfEligible: z.boolean(),
});

export const ExpatriateEmployeeSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  position: z.string().nullable().optional(),
  department: z.string().nullable().optional(),
  nationality: z.string().nullable().optional(),
  visas: z
    .array(
      z.object({
        number: z.string(),
        expiryDate: z.string().nullable(),
      }),
    )
    .default([]),
});

export const ExpatriateSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  employeeId: z.string(),
  status: ExpatStatusSchema,
  relocationInfo: RelocationInfoSchema.optional(),
  taxInfo: TaxInfoSchema.optional(),
  allowances: z.array(ExpatriateAllowanceSchema).default([]),
  workflows: z.array(z.string()).default([]),
  notes: z.string().nullable().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  employee: ExpatriateEmployeeSchema.optional(),
});

export const ExpatStatsSchema = z.object({
  total: z.number().int().nonnegative(),
  byStatus: z.record(z.string(), z.number().int().nonnegative()),
  criticalRenewals: z.number().int().nonnegative(),
});

export const ExpatriatesDashboardSchema = z.object({
  expatriates: z.array(ExpatriateSchema),
  stats: ExpatStatsSchema,
});

export const expatriateJsonSchemas = {
  expatriate: zodToJsonSchema(ExpatriateSchema as any, {
    name: "Expatriate",
  }),
  expatriatesDashboard: zodToJsonSchema(ExpatriatesDashboardSchema as any, {
    name: "ExpatriatesDashboard",
  }),
};
