/**
 * lib/schemas/hr-integration.ts
 * HR system integration, payroll integration, compliance sync, and SSO schemas.
 */
import { z } from "zod";

export const HRSystemConfigSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum([
    "bamboohr",
    "successfactors",
    "epf",
    "irelam",
    "autocount",
    "sql_payroll",
    "custom",
  ]),
  apiEndpoint: z.string().url(),
  authType: z.enum(["oauth", "api_key", "basic", "sso"]),
  credentials: z.record(z.string(), z.string()),
  syncEnabled: z.boolean(),
  lastSync: z.string().optional(),
  syncFrequency: z.number().positive(),
});

export const AttendanceDataEntrySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  checkIn: z.string(),
  checkOut: z.string(),
  totalHours: z.number().nonnegative(),
  overtimeHours: z.number().nonnegative(),
  location: z.string(),
  verified: z.boolean(),
});

export const PayrollIntegrationSchema = z.object({
  workerId: z.string(),
  hrId: z.string(),
  attendanceData: z.array(AttendanceDataEntrySchema),
  deductions: z.object({
    epf: z.number().nonnegative(),
    socso: z.number().nonnegative(),
    eis: z.number().nonnegative(),
    tax: z.number().nonnegative(),
    levy: z.number().nonnegative(),
  }),
  allowances: z.object({
    overtime: z.number().nonnegative(),
    transport: z.number().nonnegative(),
    meal: z.number().nonnegative(),
  }),
});

export const HRWorkerDataSchema = z.object({
  hrId: z.string(),
  employeeId: z.string(),
  name: z.string(),
  department: z.string(),
  position: z.string(),
  worksite: z.string(),
  permitStatus: z.string(),
  contractStart: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  contractEnd: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  salary: z.number().positive(),
  manager: z.string(),
  status: z.enum(["active", "inactive", "terminated"]),
});

export const PermitDataSchema = z.object({
  number: z.string(),
  type: z.string(),
  expiryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  status: z.string(),
  worksite: z.string(),
});

export const ComplianceSyncSchema = z.object({
  workerId: z.string(),
  permitData: PermitDataSchema,
  locationCompliance: z.object({
    authorizedLocations: z.array(z.string()),
    currentLocation: z.string(),
    violations: z.number().int().nonnegative(),
    lastViolation: z.string().optional(),
  }),
  medicalStatus: z.object({
    lastExam: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    nextDue: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    status: z.enum(["fit", "unfit", "pending"]),
  }),
});

export const SSOConfigSchema = z.object({
  provider: z.enum(["azure_ad", "google", "okta", "custom"]),
  clientId: z.string(),
  tenantId: z.string().optional(),
  domain: z.string().optional(),
  redirectUri: z.string().url(),
  scopes: z.array(z.string()),
});
