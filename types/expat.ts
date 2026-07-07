import { z } from "zod";

export const ExpatStatusSchema = z.enum([
  "ONBOARDING",
  "ACTIVE",
  "RELOCATION",
  "RENEWAL_PENDING",
  "TERMINATING",
  "TERMINATED",
]);

export const EmploymentPassTypeSchema = z.enum(["EP1", "EP2", "EP3"]);
export const EPStatusSchema = z.enum(["Active", "Expiring Soon", "Renewal Required"]);

export const ExpatriateAllowanceSchema = z.object({
  id: z.string().optional(),
  type: z.string(),
  amount: z.number(),
  currency: z.string().default("MYR"),
  description: z.string().optional(),
});

export const ExpatriateSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  employeeId: z.string(),
  status: ExpatStatusSchema,
  employmentPassType: EmploymentPassTypeSchema.optional(),
  epStatus: EPStatusSchema.optional(),
  epExpiry: z.string().optional(),
  relocationInfo: z.record(z.string(), z.any()).nullable().optional(),
  taxInfo: z.record(z.string(), z.any()).nullable().optional(),
  allowances: z.array(ExpatriateAllowanceSchema),
  workflows: z.array(z.string()),
  notes: z.string().nullable().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  employee: z
    .object({
      id: z.string(),
      name: z.string(),
      nationality: z.string().nullable().optional(),
      position: z.string().nullable().optional(),
      department: z.string().optional().nullable(),
      visas: z.array(
        z.object({
          number: z.string(),
          expiryDate: z.string().nullable().optional(),
        }),
      ),
    })
    .optional(),
});

export const ExpatStatsSchema = z.object({
  total: z.number(),
  active: z.number(),
  onboarding: z.number(),
  renewalPending: z.number(),
});

export const ExpatStatus = {
  ONBOARDING: "ONBOARDING",
  ACTIVE: "ACTIVE",
  RELOCATION: "RELOCATION",
  RENEWAL_PENDING: "RENEWAL_PENDING",
  TERMINATING: "TERMINATING",
  TERMINATED: "TERMINATED",
} as const;

export type ExpatStatus = z.infer<typeof ExpatStatusSchema>;
export type ExpatriateAllowance = z.infer<typeof ExpatriateAllowanceSchema>;
export type Expatriate = z.infer<typeof ExpatriateSchema>;
export type ExpatStats = z.infer<typeof ExpatStatsSchema>;
