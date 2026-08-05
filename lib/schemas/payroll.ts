/**
 * lib/schemas/payroll.ts
 * Payroll, accounting, tax, financial reporting and e-invoice schemas.
 */
import { z } from "zod";

// ── Payroll ────────────────────────────────────────────────────────────────────

export const PayrollAllowanceSchema = z.object({
  type: z.enum(["transport", "meal", "housing", "overtime", "bonus", "other"]),
  description: z.string(),
  amount: z.number().nonnegative(),
  taxable: z.boolean(),
});

export const PayrollDeductionSchema = z.object({
  type: z.enum([
    "epf",
    "socso",
    "eis",
    "pcb",
    "levy",
    "advance",
    "loan",
    "other",
  ]),
  description: z.string(),
  amount: z.number().nonnegative(),
  reference: z.string().optional(),
});

export const PayrollRecordSchema = z.object({
  id: z.string(),
  workerId: z.string(),
  workerName: z.string(),
  payPeriod: z.string().regex(/^\d{4}-\d{2}$/),
  basicSalary: z.number().positive(),
  overtimeHours: z.number().nonnegative(),
  overtimeRate: z.number().positive(),
  overtimePay: z.number().nonnegative(),
  allowances: z.array(PayrollAllowanceSchema),
  deductions: z.array(PayrollDeductionSchema),
  grossPay: z.number().positive(),
  netPay: z.number().nonnegative(),
  epfEmployee: z.number().nonnegative(),
  epfEmployer: z.number().nonnegative(),
  socsoEmployee: z.number().nonnegative(),
  socsoEmployer: z.number().nonnegative(),
  eisEmployee: z.number().nonnegative(),
  eisEmployer: z.number().nonnegative(),
  pcbTax: z.number().nonnegative(),
  levyAmount: z.number().nonnegative(),
  paymentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  status: z.enum(["draft", "approved", "paid"]),
  bankAccount: z.string().optional(),
  paymentReference: z.string().optional(),
});

export const PCBBracketSchema = z.object({
  min: z.number().nonnegative(),
  max: z.number().nonnegative(),
  rate: z.number().positive(),
  cumulativeTax: z.number().nonnegative(),
});

export const MalaysianTaxRatesSchema = z.object({
  epf: z.object({
    employeeRate: z.number().positive(),
    employerRate: z.number().positive(),
    ceiling: z.number().positive(),
  }),
  socso: z.object({
    employeeRate: z.number().positive(),
    employerRate: z.number().positive(),
    ceiling: z.number().positive(),
  }),
  eis: z.object({
    employeeRate: z.number().positive(),
    employerRate: z.number().positive(),
    ceiling: z.number().positive(),
  }),
  pcb: z.array(PCBBracketSchema),
  sst: z.object({
    standardRate: z.number().positive(),
    serviceRate: z.number().positive(),
    exemptThreshold: z.number().nonnegative(),
  }),
});

export const CreatePayrollSchema = z.object({
  workerId: z.string(),
  payPeriod: z.string().regex(/^\d{4}-\d{2}$/),
  basicSalary: z.number().positive(),
  overtimeHours: z.number().nonnegative(),
  overtimeRate: z.number().positive(),
  overtimePay: z.number().nonnegative(),
  allowances: z.array(PayrollAllowanceSchema),
  deductions: z.array(PayrollDeductionSchema),
  grossPay: z.number().positive(),
  netPay: z.number().nonnegative(),
  epfEmployee: z.number().nonnegative(),
  epfEmployer: z.number().nonnegative(),
  socsoEmployee: z.number().nonnegative(),
  socsoEmployer: z.number().nonnegative(),
  eisEmployee: z.number().nonnegative(),
  eisEmployer: z.number().nonnegative(),
  pcbTax: z.number().nonnegative(),
  levyAmount: z.number().nonnegative(),
  paymentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  status: z.enum(["draft", "approved", "paid"]),
  bankAccount: z.string().optional(),
  paymentReference: z.string().optional(),
});

export const PayrollStatusSchema = z.enum(["PENDING", "PROCESSED", "PAID"]);

// ── Accounting Core ────────────────────────────────────────────────────────────

export const ChartOfAccountsSchema = z.object({
  id: z.string(),
  code: z.string(),
  name: z.string(),
  type: z.enum(["asset", "liability", "equity", "revenue", "expense"]),
  category: z.string(),
  parentId: z.string().optional(),
  isActive: z.boolean(),
  balance: z.number(),
  currency: z.string(),
});

export const JournalEntrySchema = z.object({
  accountId: z.string(),
  accountCode: z.string(),
  accountName: z.string(),
  debit: z.number().nonnegative(),
  credit: z.number().nonnegative(),
  description: z.string(),
  workerId: z.string().optional(),
  projectId: z.string().optional(),
});

export const GeneralLedgerSchema = z.object({
  id: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  reference: z.string(),
  description: z.string(),
  entries: z.array(JournalEntrySchema),
  totalDebit: z.number().nonnegative(),
  totalCredit: z.number().nonnegative(),
  status: z.enum(["draft", "posted", "reversed"]),
  createdBy: z.string(),
  approvedBy: z.string().optional(),
});

export const ReconciledItemSchema = z.object({
  transactionId: z.string(),
  bankReference: z.string(),
  amount: z.number(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  description: z.string(),
  matched: z.boolean(),
});

export const OutstandingItemSchema = z.object({
  type: z.enum([
    "deposit_in_transit",
    "outstanding_check",
    "bank_charge",
    "interest",
  ]),
  reference: z.string(),
  amount: z.number(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  description: z.string(),
});

export const BankAdjustmentSchema = z.object({
  type: z.enum(["bank_charge", "interest_earned", "error_correction"]),
  amount: z.number(),
  description: z.string(),
  accountId: z.string(),
});

export const BankReconciliationSchema = z.object({
  id: z.string(),
  bankAccount: z.string(),
  statementDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  statementBalance: z.number(),
  bookBalance: z.number(),
  reconciledItems: z.array(ReconciledItemSchema),
  outstandingItems: z.array(OutstandingItemSchema),
  adjustments: z.array(BankAdjustmentSchema),
  status: z.enum(["pending", "completed", "reviewed"]),
  reconciledBy: z.string().optional(),
  reviewedBy: z.string().optional(),
});

export const GovernmentSubmissionSchema = z.object({
  id: z.string(),
  type: z.enum(["epf", "socso", "eis", "pcb", "levy", "sst", "einvoice"]),
  period: z.string(),
  status: z.enum(["draft", "submitted", "accepted", "rejected"]),
  submissionDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  referenceNumber: z.string().optional(),
  amount: z.number().nonnegative(),
  data: z.record(z.string(), z.any()),
  errorMessage: z.string().optional(),
  retryCount: z.number().int().nonnegative(),
});

export const EInvoiceSchema = z.object({
  id: z.string(),
  invoiceId: z.string(),
  uuid: z.string(),
  submissionUid: z.string().optional(),
  status: z.enum(["draft", "submitted", "validated", "cancelled"]),
  validationResults: z.record(z.string(), z.any()).optional(),
  submittedAt: z.string().optional(),
  validatedAt: z.string().optional(),
  lhdnResponse: z.record(z.string(), z.any()).optional(),
});

export const FinancialReportSchema = z.object({
  id: z.string(),
  type: z.enum(["profit_loss", "balance_sheet", "cash_flow", "trial_balance"]),
  period: z.string(),
  data: z.record(z.string(), z.any()),
  generatedAt: z.string(),
  generatedBy: z.string(),
});

export const AccountingComplianceAlertSchema = z.object({
  id: z.string(),
  type: z.enum(["tax_due", "levy_overdue", "epf_submission", "audit_required"]),
  severity: z.enum(["low", "medium", "high", "critical"]),
  message: z.string(),
  dueDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  amount: z.number().optional(),
  reference: z.string().optional(),
  isResolved: z.boolean(),
  resolvedAt: z.string().optional(),
});

export const InvoiceItemSchema = z.object({
  id: z.string(),
  description: z.string(),
  quantity: z.number().positive(),
  unitPrice: z.number().positive(),
  total: z.number().nonnegative(),
  taxable: z.boolean(),
  category: z.string().optional(),
});

export const DeliveryOrderItemSchema = z.object({
  id: z.string(),
  description: z.string(),
  quantity: z.number().positive(),
  unit: z.string(),
  weight: z.number().optional(),
  dimensions: z.string().optional(),
  specialInstructions: z.string().optional(),
});

export const DeliveryOrderSchema = z.object({
  type: z.literal("delivery_order"),
  doNumber: z.string(),
  customerId: z.string(),
  customerName: z.string(),
  customerAddress: z.string(),
  deliveryAddress: z.string(),
  orderDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  deliveryDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  status: z.enum(["pending", "in_transit", "delivered", "cancelled"]),
  items: z.array(DeliveryOrderItemSchema),
  assignedWorkers: z.array(z.string()),
  driverName: z.string().optional(),
  vehicleNumber: z.string().optional(),
  notes: z.string().optional(),
  trackingNumber: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const CreditNoteItemSchema = z.object({
  id: z.string(),
  description: z.string(),
  quantity: z.number().positive(),
  unitPrice: z.number().positive(),
  total: z.number().nonnegative(),
  originalInvoiceItemId: z.string().optional(),
});

export const CreditNoteSchema = z.object({
  type: z.literal("credit_note"),
  creditNoteNumber: z.string(),
  invoiceId: z.string().optional(),
  customerId: z.string(),
  customerName: z.string(),
  issueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  status: z.enum(["pending", "approved", "rejected", "processed"]),
  reason: z.enum(["return", "discount", "error", "cancellation", "other"]),
  reasonDescription: z.string(),
  items: z.array(CreditNoteItemSchema),
  subtotal: z.number().nonnegative(),
  taxAmount: z.number().nonnegative(),
  total: z.number().nonnegative(),
  refundAmount: z.number().nonnegative(),
  refundMethod: z
    .enum(["bank_transfer", "cash", "credit_adjustment"])
    .optional(),
  approvedBy: z.string().optional(),
  approvedDate: z.string().optional(),
  processedDate: z.string().optional(),
  notes: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const DebitNoteSchema = z.object({
  type: z.literal("debit_note"),
  debitNoteNumber: z.string(),
  customerId: z.string(),
  customerName: z.string(),
  issueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  status: z.enum(["pending", "sent", "paid", "overdue"]),
  typeNote: z.enum([
    "penalty",
    "additional_charge",
    "late_fee",
    "compliance_fee",
  ]),
  description: z.string(),
  amount: z.number().positive(),
  penaltyRate: z.number().optional(),
  basedOnAmount: z.number().optional(),
  daysOverdue: z.number().optional(),
  complianceReference: z.string().optional(),
  paymentDate: z.string().optional(),
  notes: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const InvoiceSchema = z.intersection(
  z.object({
    type: z.literal("invoice"),
    transactionNumber: z.string(),
    invoiceNumber: z.string(),
    transactionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    customerId: z.string(),
    customerName: z.string(),
    customerEmail: z.string().email().optional(),
    customerAddress: z.string(),
    customerTaxId: z.string().optional(),
    billingAddress: z.string().optional(),
    paymentTerms: z.number().int().optional(),
    issueDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional(),
    dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    status: z.enum(["draft", "sent", "paid", "overdue", "cancelled"]),
    paymentStatus: z.string().optional(),
    totalAmount: z.number().nonnegative().optional(),
    netAmount: z.number().nonnegative().optional(),
    supplierTin: z.string().optional(),
    buyerTin: z.string().optional(),
  }),
  z.object({
    items: z.array(InvoiceItemSchema).optional(),
    subtotal: z.number().nonnegative().optional(),
    taxAmount: z.number().nonnegative(),
    taxRate: z.number().optional(),
    discount: z.number().nonnegative().optional(),
    total: z.number().nonnegative().optional(),
    currency: z.enum(["MYR", "USD", "SGD"]),
    notes: z.string().optional(),
    terms: z.string().optional(),
    paymentMethod: z.string().optional(),
    paidDate: z.string().optional(),
    createdBy: z.string().optional(),
    lastModifiedBy: z.string().optional(),
    lineItems: z.array(z.any()).optional(),
    taxDetails: z.record(z.string(), z.any()).optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),
);

export const TaxCalculationSchema = z.object({
  subtotal: z.number().nonnegative(),
  taxableAmount: z.number().nonnegative(),
  exemptAmount: z.number().nonnegative(),
  sstRate: z.number().positive(),
  sstAmount: z.number().nonnegative(),
  serviceTaxRate: z.number().positive(),
  serviceTaxAmount: z.number().nonnegative(),
  totalTax: z.number().nonnegative(),
  grandTotal: z.number().nonnegative(),
});

export const AccountingSummarySchema = z.object({
  totalInvoices: z.number().int().nonnegative(),
  totalRevenue: z.number().nonnegative(),
  outstandingAmount: z.number().nonnegative(),
  overdueAmount: z.number().nonnegative(),
  paidInvoices: z.number().int().nonnegative(),
  pendingInvoices: z.number().int().nonnegative(),
  deliveryOrders: z.number().int().nonnegative(),
  creditNotes: z.number().int().nonnegative(),
  debitNotes: z.number().int().nonnegative(),
  monthlyRevenue: z.array(z.number().nonnegative()),
  recentTransactions: z.array(z.record(z.string(), z.any())),
});

export const PaymentRecordSchema = z.object({
  id: z.string(),
  invoiceId: z.string(),
  amount: z.number().positive(),
  paymentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  paymentMethod: z.enum([
    "bank_transfer",
    "cash",
    "cheque",
    "credit_card",
    "online",
  ]),
  reference: z.string(),
  notes: z.string().optional(),
  createdAt: z.string(),
});

export const MalaysianTaxConfigSchema = z.object({
  sstRate: z.number().positive(),
  serviceTaxRate: z.number().positive(),
  exemptCategories: z.array(z.string()),
  taxRegistrationNumber: z.string(),
  businessRegistrationNumber: z.string(),
  companyName: z.string(),
  companyAddress: z.string(),
});
