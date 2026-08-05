/**
 * lib/schemas/index.ts
 * Barrel re-export — preserves all existing import paths:
 *   import { ... } from "@/lib/schemas"
 *
 * Domain-specific imports are also available directly:
 *   import { AgentOutputSchema } from "@/lib/schemas/agent"
 *   import { PayrollRecordSchema } from "@/lib/schemas/payroll"
 *   import { CreateEmployeeSchema } from "@/lib/schemas/employee"
 *   import { GeofenceSchema } from "@/lib/schemas/geolocation"
 *   import { HRSystemConfigSchema } from "@/lib/schemas/hr-integration"
 *   import { WorkflowDefinitionSchema } from "@/lib/schemas/workflow"
 */

export * from "./agent";
export * from "./payroll";
export * from "./employee";
export * from "./geolocation";
export * from "./hr-integration";
export * from "./workflow";

// Re-export zodToJsonSchema-derived json schemas object
// (kept here rather than in a sub-module since it depends on all others)
import { zodToJsonSchema } from "zod-to-json-schema";
import { AgentOutputSchema } from "./agent";
import {
  PayrollRecordSchema,
  MalaysianTaxRatesSchema,
  InvoiceSchema,
  DeliveryOrderSchema,
} from "./payroll";
import { LocationDataSchema, GeofenceSchema } from "./geolocation";
import { HRSystemConfigSchema, ComplianceSyncSchema } from "./hr-integration";
import { WorkerSimpleSchema } from "./employee";
import { WorkflowDefinitionSchema } from "./workflow";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const jsonSchemas = {
  AgentOutput: zodToJsonSchema(AgentOutputSchema as any),
  PayrollRecord: zodToJsonSchema(PayrollRecordSchema as any, "PayrollRecord"),
  MalaysianTaxRates: zodToJsonSchema(MalaysianTaxRatesSchema as any, "MalaysianTaxRates"),
  Invoice: zodToJsonSchema(InvoiceSchema as any, "Invoice"),
  DeliveryOrder: zodToJsonSchema(DeliveryOrderSchema as any, "DeliveryOrder"),
  LocationData: zodToJsonSchema(LocationDataSchema as any, "LocationData"),
  Geofence: zodToJsonSchema(GeofenceSchema as any, "Geofence"),
  HRSystemConfig: zodToJsonSchema(HRSystemConfigSchema as any, "HRSystemConfig"),
  ComplianceSync: zodToJsonSchema(ComplianceSyncSchema as any, "ComplianceSync"),
  WorkerSimple: zodToJsonSchema(WorkerSimpleSchema as any, "WorkerSimple"),
  WorkflowDefinition: zodToJsonSchema(WorkflowDefinitionSchema as any, "WorkflowDefinition"),
};
/* eslint-enable @typescript-eslint/no-explicit-any */
