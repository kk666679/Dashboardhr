import { z } from "zod";
import type { DeliveryOrderPDFData } from "@/utils/pdf/delivery-order-pdf";

// AI Document Types (matches PDF generator)
export const AIDocType = z.enum([
  "invoice",
  "payslip",
  "permit",
  "report",
  "delivery-order",
  "handbook",
]);

// Context Data (from dashboard/worker data)
export const AIContextData = z.object({
  workerId: z.string().optional(),
  workerName: z.string().optional(),
  employerName: z.string().optional(),
  department: z.string().optional(),
  period: z.string().optional(),
  currency: z.enum(["MYR"]).default("MYR"),
  data: z.record(z.string(), z.any()).optional(), // Raw dashboard data
});

// AI Request Schema
export const AIDocRequestSchema = z.object({
  docType: AIDocType,
  context: AIContextData,
  instructions: z
    .string()
    .optional()
    .default("Generate compliant Malaysian HR document"),
  provider: z.enum(["claude", "openai"]).optional().default("openai"),
});

// Invoice Data
const InvoiceDataSchema = z.object({
  invoiceNumber: z.string(),
  customerName: z.string(),
  customerAddress: z.string().optional(),
  customerEmail: z.string().optional(),
  issueDate: z.string().optional(),
  dueDate: z.string().optional(),
  total: z.number(),
  items: z
    .array(
      z.object({
        description: z.string(),
        quantity: z.number(),
        unitPrice: z.number(),
        total: z.number(),
      }),
    )
    .optional(),
});

// Payslip Data
const PayslipDataSchema = z.object({
  workerName: z.string(),
  workerId: z.string().optional(),
  payPeriod: z.string(),
  basicSalary: z.number(),
  overtimePay: z.number().optional(),
  allowances: z.number().optional(),
  netPay: z.number(),
});

// Permit Data
const PermitDataSchema = z.object({
  permitNumber: z.string(),
  workerName: z.string(),
  employerName: z.string(),
  expiryDate: z.string().optional(),
});

// Report Data
const ReportDataSchema = z.object({
  reportType: z.string(),
  period: z.string(),
  totalRecords: z.number().optional(),
});

// Handbook Data
const HandbookDataSchema = z.object({
  companyName: z.string(),
  employeeName: z.string().optional(),
  sections: z.array(z.object({
    title: z.string(),
    content: z.string(),
  })).optional(),
  effectiveDate: z.string().optional(),
});

// AI Response Data Union
const AIDocDataSchema = z.discriminatedUnion("docType", [
  z.object({ docType: z.literal("invoice"), data: InvoiceDataSchema }),
  z.object({ docType: z.literal("payslip"), data: PayslipDataSchema }),
  z.object({ docType: z.literal("permit"), data: PermitDataSchema }),
  z.object({ docType: z.literal("report"), data: ReportDataSchema }),
  z.object({
    docType: z.literal("delivery-order"),
    data: z.object({}).passthrough(),
  }),
  z.object({ docType: z.literal("handbook"), data: HandbookDataSchema }),
]);

// AI Response Schema
export const AIDocResponseSchema = AIDocRequestSchema.and(
  z.object({
    data: AIDocDataSchema,
    options: z
      .object({
        format: z.enum(["A4", "Letter"]).optional(),
        orientation: z.enum(["portrait", "landscape"]).optional(),
      })
      .optional(),
    metadata: z.object({
      complianceChecked: z.boolean().default(true),
      generatedAt: z.string(),
    }),
  }),
);

export type AIDocType = z.infer<typeof AIDocType>;
export type AIContextData = z.infer<typeof AIContextData>;
export type AIDocRequest = z.infer<typeof AIDocRequestSchema>;
export type AIDocResponse = z.infer<typeof AIDocResponseSchema>;

// Helpers
export const isValidDocData = (
  data: unknown,
  docType: AIDocType,
): data is any => {
  return typeof data === "object" && data !== null;
};

export const parseAIDocResponse = (response: unknown): AIDocResponse => {
  return AIDocResponseSchema.parse(response);
};
