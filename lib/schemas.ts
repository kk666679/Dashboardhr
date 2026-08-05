import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import type { z as Z } from "zod";

// ── Agent Types (simple, non-discriminated) ─────────────────────────────────────

export const AgentOutputSchema = z.object({
  type: z.string(),
  message: z.string(),
  source: z.string().optional(),
});

export type AgentOutput = z.infer<typeof AgentOutputSchema>;

export const HRAgentResultSchema = z.object({
  raw: z.array(AgentOutputSchema),
  final: z.string(),
});

export type HRAgentResult = z.infer<typeof HRAgentResultSchema>;

// ── Accounting Enhanced ────────────────────────────────────────────────────────

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

// ── Accounting Core ────────────────────────────────────────────────────────────

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
    lineItems: z.array(z.any()).optional(), // Legacy
    taxDetails: z.record(z.string(), z.any()).optional(), // Legacy
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

// ── FWMS Core (extend existing) ────────────────────────────────────────────────

export const PersonalInfoSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  address: z.string().optional(),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  nationality: z.string().optional(),
  country: z.string().optional(),
});

export const EmploymentInfoSchema = z.object({
  position: z.string().optional(),
  department: z.string().optional(),
  hireDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  isForeign: z.boolean().default(false),
});

export const CreateEmployeeSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  address: z.string().optional(),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  nationality: z.string().optional(),
  country: z.string().optional(),
  position: z.string().optional(),
  department: z.string().optional(),
  hireDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  isForeign: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
});

export const EmployeeFiltersSchema = z.object({
  department: z.string().optional(),
  isForeign: z.boolean().optional(),
  position: z.string().optional(),
});

export const EmployeeRowSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  phone: z.string().optional(),
  position: z.string().optional(),
  department: z.string().optional(),
  isForeign: z.boolean(),
  hireDate: z.string().optional(),
  createdAt: z.string(),
});

export const WorkerSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  name: z.string(),
  email: z.string(),
  phone: z.string().optional(),
  address: z.string().optional(),
  dateOfBirth: z.string().optional(),
  nationality: z.string().optional(),
  country: z.string().optional(),
  isForeign: z.boolean(),
  position: z.string().optional(),
  department: z.string().optional(),
  hireDate: z.string().optional(),
  tags: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const WorkerCreateSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  address: z.string().optional(),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  nationality: z.string().optional(),
  country: z.string().optional(),
  position: z.string().optional(),
  department: z.string().optional(),
  hireDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  isForeign: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
});

export const WorkerStatusSchema = z.enum(["ACTIVE", "INACTIVE", "TERMINATED"]);

export const PermitSchema = z.object({
  id: z.string(),
  workerId: z.string(),
  type: z.string(),
  number: z.string(),
  issueDate: z.string(),
  expiryDate: z.string(),
  status: z.string(),
});

export const PermitTypeSchema = z.enum(["PLKS", "MMP", "EP", "DP", "VP", "PVP"]);

export const PermitStatusSchema = z.enum(["ACTIVE", "EXPIRED", "PENDING", "REJECTED"]);

export const MedicalRecordSchema = z.object({
  id: z.string(),
  workerId: z.string(),
  examinationDate: z.string(),
  doctorName: z.string(),
  hospitalName: z.string(),
  result: z.enum(["PASS", "FAIL", "PENDING"]),
  notes: z.string().optional(),
});

export const ComplianceAlertSchema = z.object({
  id: z.string(),
  workerId: z.string(),
  type: z.enum(["VISA_EXPIRING", "MEDICAL_DUE", "PERMIT_RENEWAL"]),
  message: z.string(),
  severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  dueDate: z.string(),
  resolved: z.boolean().default(false),
});

export const TerminationCreateSchema = z.object({
  employeeId: z.string(),
  terminationType: z.enum(["RESIGNATION", "VOLUNTARY", "REDUNDANCY", "DISCIPLINARY", "RETIREMENT", "CONTRACT_END"]),
  lastWorkingDay: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  reason: z.string(),
  noticePeriodServed: z.boolean().default(false),
  finalSalaryAmount: z.number().default(0),
  pendingLeave: z.number().optional(),
  otherPayments: z.number().optional(),
  exitInterviewNotes: z.string().optional(),
  handoverStatus: z.enum(["COMPLETE", "IN_PROGRESS", "PENDING"]).default("PENDING"),
});

export const TerminationFiltersSchema = z.object({
  status: z.string().optional(),
});

export type TerminationCreate = z.infer<typeof TerminationCreateSchema>;
export type TerminationFilters = z.infer<typeof TerminationFiltersSchema>;

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

export const EmergencyContactSchema = z.object({
  name: z.string(),
  relationship: z.string(),
  phoneNumber: z.string(),
  address: z.string(),
});

export const WorkerDocumentSchema = z.object({
  id: z.string(),
  type: z.union([
    z.literal("passport"),
    z.literal("work_permit"),
    z.literal("visa"),
    z.literal("employment_contract"),
    z.literal("medical_certificate"),
    z.literal("insurance_policy"),
    z.literal("training_certificate"),
    z.literal("police_clearance"),
    z.literal("educational_certificate"),
    z.literal("other"),
  ]),
  documentNumber: z.string(),
  issueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  expiryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  issuingAuthority: z.string(),
  filePath: z.string(),
  status: z.enum(["valid", "expired", "expiring_soon", "pending_renewal"]),
  verificationStatus: z.enum(["verified", "pending", "rejected"]),
  notes: z.string().optional(),
  uploadedAt: z.string(),
  verifiedBy: z.string().optional(),
  verifiedAt: z.string().optional(),
});

export const BiometricDataSchema = z.object({
  fingerprintHash: z.string().optional(),
  faceRecognitionHash: z.string().optional(),
  enrollmentDate: z.string(),
  lastVerificationDate: z.string().optional(),
  verificationCount: z.number().int().nonnegative(),
});

export const PerformanceCategorySchema = z.object({
  name: z.string(),
  rating: z.number().min(0).max(5),
  weight: z.number().positive(),
  comments: z.string().optional(),
});

export const PerformanceRecordSchema = z.object({
  id: z.string(),
  evaluationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  evaluatorId: z.string(),
  evaluatorName: z.string(),
  period: z.string(),
  overallRating: z.number().min(0).max(5),
  categories: z.array(PerformanceCategorySchema),
  strengths: z.array(z.string()),
  areasForImprovement: z.array(z.string()),
  goals: z.array(z.string()),
  comments: z.string(),
  status: z.enum(["draft", "completed", "acknowledged"]),
  workerAcknowledgment: z.string().optional(),
  acknowledgedAt: z.string().optional(),
  createdAt: z.string(),
});

export const AttendanceRecordSchema = z.object({
  id: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
  breakStart: z.string().optional(),
  breakEnd: z.string().optional(),
  totalHours: z.number().nonnegative(),
  overtimeHours: z.number().nonnegative(),
  status: z.enum([
    "present",
    "absent",
    "late",
    "half_day",
    "sick_leave",
    "annual_leave",
  ]),
  location: z.string().optional(),
  notes: z.string().optional(),
  approvedBy: z.string().optional(),
  createdAt: z.string(),
});

export const InspectionFindingSchema = z.object({
  category: z.string(),
  description: z.string(),
  severity: z.enum(["low", "medium", "high", "critical"]),
  status: z.enum(["open", "resolved", "in_progress"]),
  resolvedDate: z.string().optional(),
  photos: z.array(z.string()).optional(),
});

export const InspectionReportSchema = z.object({
  id: z.string(),
  inspectionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  inspectorName: z.string(),
  inspectorId: z.string().optional(),
  type: z.enum(["routine", "complaint", "compliance", "safety"]),
  overallRating: z.number().min(0).max(5),
  findings: z.array(InspectionFindingSchema),
  recommendations: z.array(z.string()),
  followUpRequired: z.boolean(),
  followUpDate: z.string().optional(),
  status: z.enum(["pending", "completed", "follow_up_required"]),
  filePath: z.string().optional(),
  createdAt: z.string(),
});

export const UtilityInfoSchema = z.object({
  type: z.enum(["electricity", "water", "gas", "internet", "maintenance"]),
  provider: z.string(),
  accountNumber: z.string(),
  monthlyAmount: z.number().nonnegative(),
  includedInRent: z.boolean(),
});

export const AddressSchema = z.object({
  street: z.string(),
  city: z.string(),
  state: z.string(),
  postalCode: z.string(),
  country: z.string(),
});

export const AccommodationSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["hostel", "apartment", "house", "dormitory"]),
  address: AddressSchema,

  capacity: z.number().positive(),
  currentOccupancy: z.number().int().min(0),
  facilities: z.array(z.string()),
  safetyFeatures: z.array(z.string()),
  complianceStatus: z.enum([
    "compliant",
    "non_compliant",
    "pending_review",
    "requires_action",
  ]),
  lastInspectionDate: z.string().optional(),
  nextInspectionDue: z.string().optional(),
  inspectionReports: z.array(InspectionReportSchema),
  monthlyRent: z.number().nonnegative(),
  utilities: z.array(UtilityInfoSchema),
  managerId: z.string().optional(),
  rules: z.array(z.string()),
  emergencyContacts: z.array(EmergencyContactSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const GovernmentSubmissionFwmsSchema = z.object({
  id: z.string(),
  type: z.enum(["immigration", "jtk", "fomema", "myeg", "kwsp", "perkeso"]),
  workerId: z.string(),
  submissionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  status: z.enum([
    "pending",
    "submitted",
    "approved",
    "rejected",
    "processing",
  ]),
  referenceNumber: z.string().optional(),
  responseData: z.record(z.string(), z.any()).optional(),
  errorMessage: z.string().optional(),
  retryCount: z.number().int().nonnegative(),
  nextRetryDate: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const LevyPaymentSchema = z.object({
  id: z.string(),
  workerId: z.string(),
  permitId: z.string(),
  amount: z.number().positive(),
  currency: z.literal("MYR"),
  paymentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  status: z.enum(["pending", "paid", "overdue", "cancelled"]),
  paymentMethod: z.string().optional(),
  transactionId: z.string().optional(),
  receiptNumber: z.string().optional(),
  notes: z.string().optional(),
  createdAt: z.string(),
});

// ── Geolocation ────────────────────────────────────────────────────────────────

export const GeofenceCoordinateSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export const LocationDataSchema = z.object({
  id: z.string(),
  workerId: z.string(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  accuracy: z.number().positive(),
  timestamp: z.string(),
  address: z.string().optional(),
  source: z.enum(["gps", "network", "manual"]),
  batteryLevel: z.number().min(0).max(1).optional(),
});

export const GeofenceSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["worksite", "accommodation", "restricted", "safe_zone"]),
  coordinates: z.array(GeofenceCoordinateSchema),
  radius: z.number().positive().optional(),
  isActive: z.boolean(),
  alertOnEntry: z.boolean(),
  alertOnExit: z.boolean(),
  workingHours: z
    .object({
      start: z.string(),
      end: z.string(),
      days: z.array(z.number().int().min(0).max(6)),
    })
    .optional(),
});

export const LocationAlertSchema = z.object({
  id: z.string(),
  workerId: z.string(),
  type: z.enum([
    "unauthorized_exit",
    "restricted_entry",
    "sos",
    "offline",
    "geofence_violation",
  ]),
  severity: z.enum(["low", "medium", "high", "critical"]),
  location: LocationDataSchema,
  geofenceId: z.string().optional(),
  message: z.string(),
  isResolved: z.boolean(),
  createdAt: z.string(),
  resolvedAt: z.string().optional(),
});

export const AttendanceLocationSchema = z.object({
  id: z.string(),
  workerId: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  checkIn: z
    .object({
      time: z.string(),
      location: LocationDataSchema,
      geofenceId: z.string(),
    })
    .optional(),
  checkOut: z
    .object({
      time: z.string(),
      location: LocationDataSchema,
      geofenceId: z.string(),
    })
    .optional(),
  totalHours: z.number().nonnegative(),
  isValid: z.boolean(),
});

export const WorkerLocationSettingsSchema = z.object({
  workerId: z.string(),
  trackingEnabled: z.boolean(),
  updateFrequency: z.number().positive(), // minutes
  consentGiven: z.boolean(),
  consentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  emergencyContactsEnabled: z.boolean(),
  privacyLevel: z.enum(["minimal", "standard", "detailed"]),
});

export const EmergencyAlertSchema = z.object({
  id: z.string(),
  workerId: z.string(),
  location: LocationDataSchema,
  type: z.enum(["sos", "panic", "medical", "accident"]),
  status: z.enum(["active", "acknowledged", "resolved"]),
  message: z.string().optional(),
  responderId: z.string().optional(),
  responseTime: z.string().optional(),
  createdAt: z.string(),
});

// ── HR Integration ─────────────────────────────────────────────────────────────

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

// ── Worker (self-contained; legacy types/worker.ts was removed as dead code) ──

export const WorkerSimpleSchema = z.object({
  id: z.string(),
  name: z.string(),
  nationality: z.string(),
  passportNo: z.string(),
  permitNo: z.string(),
  permitStatus: z.enum([
    "active",
    "pending",
    "expiring",
    "expired",
    "suspended",
  ]),
  medicalStatus: z.enum(["valid", "pending", "expired"]),
  employer: z.string(),
  position: z.string(),
  joinDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  permitExpiry: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  contactInfo: z.object({
    phone: z.string().optional(),
    email: z.string().email().optional(),
    address: z.string().optional(),
  }),
  documents: z.object({
    passport: z.boolean(),
    visa: z.boolean(),
    workPermit: z.boolean(),
    medicalCert: z.boolean(),
  }),
  personalInfo: z.object({
    dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    gender: z.enum(["male", "female"]),
    maritalStatus: z.enum(["single", "married", "divorced", "widowed"]),
    religion: z.string().optional(),
    emergencyContact: EmergencyContactSchema.optional(),
  }),
  employmentInfo: z.object({
    sector: z.string(),
    skillLevel: z.enum(["skilled", "semiskilled", "unskilled"]),
    salary: z.number().positive(),
    contractStartDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    contractEndDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    workLocation: z.string(),
  }),
  accommodationInfo: z
    .object({
      type: z.enum(["company_provided", "own_arrangement"]),
      address: z.string().optional(),
      monthlyRent: z.number().optional(),
      facilities: z.array(z.string()).optional(),
    })
    .optional(),
});

export const WorkerStatsSchema = z.object({
  total: z.number().int().nonnegative(),
  active: z.number().int().nonnegative(),
  pending: z.number().int().nonnegative(),
  expiring: z.number().int().nonnegative(),
  expired: z.number().int().nonnegative(),
  byNationality: z.record(z.string(), z.number().int().nonnegative()),
  bySector: z.record(z.string(), z.number().int().nonnegative()),
  bySkillLevel: z.record(z.string(), z.number().int().nonnegative()),
});

export const PermitApplicationSchema = z.object({
  id: z.string(),
  workerId: z.string(),
  applicationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  status: z.enum([
    "submitted",
    "under_review",
    "approved",
    "rejected",
    "pending_documents",
  ]),
  permitType: z.enum(["new", "renewal", "replacement"]),
  documents: z.object({
    form8: z.boolean(),
    passportCopy: z.boolean(),
    photo: z.boolean(),
    medicalReport: z.boolean(),
    insuranceCert: z.boolean(),
  }),
  fees: z.object({
    levy: z.number().nonnegative(),
    processingFee: z.number().nonnegative(),
    serviceFee: z.number().nonnegative(),
    total: z.number().nonnegative(),
  }),
  approvalDate: z.string().optional(),
  rejectionReason: z.string().optional(),
  notes: z.string().optional(),
});

// ── Workflow ───────────────────────────────────────────────────────────────────

export const WorkflowTypeSchema = z.enum([
  "ONBOARDING",
  "VISA_RENEWAL",
  "CONTRACT_RENEWAL",
  "LEAVE_REQUEST",
  "DOCUMENT_SUBMISSION",
  "REPATRIATION",
  "EXPAT_ONBOARDING",
  "EXPAT_RELOCATION",
  "EXPAT_RENEWAL",
]);

export const WorkflowStepStatusSchema = z.enum([
  "PENDING",
  "ACTIVE",
  "COMPLETED",
  "SKIPPED",
]);

export type WorkflowStepStatus = z.infer<typeof WorkflowStepStatusSchema>;

export interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  status: WorkflowStepStatus;
  assignedTo?: string;
  dueDate?: Date;
  completedAt?: Date;
  notes?: string;
}

export const WorkflowStepSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  status: WorkflowStepStatusSchema,
  assignedTo: z.string().optional(),
  dueDate: z.coerce.date().optional(),
  completedAt: z.coerce.date().optional(),
  notes: z.string().optional(),
});

export const WorkflowDefinitionSchema = z.object({
  type: WorkflowTypeSchema,
  steps: z.array(WorkflowStepSchema),
  metadata: z.record(z.string(), z.any()).optional(),
});

export const WORKFLOW_DEFINITIONS: Record<
  z.infer<typeof WorkflowTypeSchema>,
  z.infer<typeof WorkflowDefinitionSchema>
> = {
  // Full WORKFLOW_DEFINITIONS from types/workflow.ts
  ONBOARDING: {
    type: "ONBOARDING" as const,
    steps: [
      {
        id: "step_1",
        name: "Pre-Arrival Preparation",
        description:
          "Prepare offer letter, employment contract, and documentation",
        status: "PENDING" as const,
      },
      {
        id: "step_2",
        name: "Document Collection",
        description: "Collect passport, visa, medical examination results",
        status: "PENDING" as const,
      },
      {
        id: "step_3",
        name: "Customs Clearance",
        description: "Complete customs entry procedures",
        status: "PENDING" as const,
      },
      {
        id: "step_4",
        name: "Accommodation Setup",
        description:
          "Arrange accommodation and register with local authorities",
        status: "PENDING" as const,
      },
      {
        id: "step_5",
        name: "Banking & Tax Registration",
        description: "Open bank account and register for tax ID",
        status: "PENDING" as const,
      },
      {
        id: "step_6",
        name: "Workplace Orientation",
        description: "Complete orientation and safety training",
        status: "PENDING" as const,
      },
    ],
  },
  VISA_RENEWAL: {
    type: "VISA_RENEWAL" as const,
    steps: [
      {
        id: "step_1",
        name: "Request Initiation",
        description: "Employee or HR initiates visa renewal request",
        status: "PENDING" as const,
      },
      {
        id: "step_2",
        name: "Document Review",
        description: "HR reviews and verifies required documents",
        status: "PENDING" as const,
      },
      {
        id: "step_3",
        name: "Government Submission",
        description: "Submit application to immigration authority",
        status: "PENDING" as const,
      },
      {
        id: "step_4",
        name: "Processing & Approval",
        description: "Wait for government processing and approval",
        status: "PENDING" as const,
      },
      {
        id: "step_5",
        name: "Visa Issuance",
        description: "Receive and verify visa issuance",
        status: "PENDING" as const,
      },
    ],
  },
  CONTRACT_RENEWAL: {
    type: "CONTRACT_RENEWAL" as const,
    steps: [
      {
        id: "step_1",
        name: "Renewal Notice",
        description: "Send renewal notice to employee",
        status: "PENDING" as const,
      },
      {
        id: "step_2",
        name: "Negotiation",
        description: "Employee and employer negotiate terms",
        status: "PENDING" as const,
      },
      {
        id: "step_3",
        name: "Contract Preparation",
        description: "Prepare new contract with agreed terms",
        status: "PENDING" as const,
      },
      {
        id: "step_4",
        name: "E-Signature",
        description: "Employee signs contract electronically",
        status: "PENDING" as const,
      },
      {
        id: "step_5",
        name: "Verification",
        description: "HR verifies and stores contract",
        status: "PENDING" as const,
      },
    ],
  },
  LEAVE_REQUEST: {
    type: "LEAVE_REQUEST" as const,
    steps: [
      {
        id: "step_1",
        name: "Request Submission",
        description: "Employee submits leave request",
        status: "PENDING" as const,
      },
      {
        id: "step_2",
        name: "Department Approval",
        description: "Department head approves request",
        status: "PENDING" as const,
      },
      {
        id: "step_3",
        name: "HR Verification",
        description: "HR verifies leave balance",
        status: "PENDING" as const,
      },
      {
        id: "step_4",
        name: "Final Approval",
        description: "HR manager final approval",
        status: "PENDING" as const,
      },
    ],
  },
  DOCUMENT_SUBMISSION: {
    type: "DOCUMENT_SUBMISSION" as const,
    steps: [
      {
        id: "step_1",
        name: "Document Upload",
        description: "Employee uploads required documents",
        status: "PENDING" as const,
      },
      {
        id: "step_2",
        name: "Initial Verification",
        description: "Check document completeness and format",
        status: "PENDING" as const,
      },
      {
        id: "step_3",
        name: "Compliance Review",
        description: "Review against compliance requirements",
        status: "PENDING" as const,
      },
      {
        id: "step_4",
        name: "Approval",
        description: "Final approval and archival",
        status: "PENDING" as const,
      },
    ],
  },
  REPATRIATION: {
    type: "REPATRIATION" as const,
    steps: [
      {
        id: "step_1",
        name: "Exit Notice",
        description: "Issue exit notice and initiate repatriation",
        status: "PENDING" as const,
      },
      {
        id: "step_2",
        name: "Exit Permit Application",
        description: "Apply for exit permit and clearance",
        status: "PENDING" as const,
      },
    ],
  },
  EXPAT_ONBOARDING: {
    type: "EXPAT_ONBOARDING" as const,
    steps: [
      {
        id: "step_1",
        name: "Visa & Permit Processing",
        description: "Complete immigration processing (PLKS/MMP)",
        status: "PENDING" as const,
      },
      {
        id: "step_2",
        name: "Pre-Departure Briefing",
        description: "Cultural/HR orientation for Malaysia",
        status: "PENDING" as const,
      },
      {
        id: "step_3",
        name: "Travel & Insurance",
        description: "Book flights and medical insurance",
        status: "PENDING" as const,
      },
      {
        id: "step_4",
        name: "Arrival Clearance",
        description: "Quarantine and entry procedures",
        status: "PENDING" as const,
      },
      {
        id: "step_5",
        name: "Local Setup",
        description: "Bank account, tax reg, FOMEMA medical",
        status: "PENDING" as const,
      },
    ],
  },
  EXPAT_RELOCATION: {
    type: "EXPAT_RELOCATION" as const,
    steps: [
      {
        id: "step_1",
        name: "Relocation Planning",
        description: "Logistics and family support",
        status: "PENDING" as const,
      },
      {
        id: "step_2",
        name: "Housing Assignment",
        description: "Company accommodation setup",
        status: "PENDING" as const,
      },
      {
        id: "step_3",
        name: "Work Permit Update",
        description: "Update worksite if internal transfer",
        status: "PENDING" as const,
      },
      {
        id: "step_4",
        name: "Orientation",
        description: "New site orientation and training",
        status: "PENDING" as const,
      },
    ],
  },
  EXPAT_RENEWAL: {
    type: "EXPAT_RENEWAL" as const,
    steps: [
      {
        id: "step_1",
        name: "Eligibility Check",
        description: "Review performance and compliance",
        status: "PENDING" as const,
      },
      {
        id: "step_2",
        name: "Document Renewal",
        description: "Visa/permit/medical renewal",
        status: "PENDING" as const,
      },
      {
        id: "step_3",
        name: "Tax Update",
        description: "Update tax residency status",
        status: "PENDING" as const,
      },
      {
        id: "step_4",
        name: "Contract Extension",
        description: "New terms negotiation",
        status: "PENDING" as const,
      },
      {
        id: "step_5",
        name: "Levy Payment",
        description: "Pay renewal levy",
        status: "PENDING" as const,
      },
    ],
  },
};

// ── JSON Schemas ──────────────────────────────────────────────────────────────

/* eslint-disable @typescript-eslint/no-explicit-any */
export const jsonSchemas = {
  AgentOutput: zodToJsonSchema(AgentOutputSchema as any),

  PayrollRecord: zodToJsonSchema(PayrollRecordSchema as any, "PayrollRecord"),
  MalaysianTaxRates: zodToJsonSchema(
    MalaysianTaxRatesSchema as any,
    "MalaysianTaxRates",
  ),
  Invoice: zodToJsonSchema(InvoiceSchema as any, "Invoice"),
  DeliveryOrder: zodToJsonSchema(DeliveryOrderSchema as any, "DeliveryOrder"),
  LocationData: zodToJsonSchema(LocationDataSchema as any, "LocationData"),
  Geofence: zodToJsonSchema(GeofenceSchema as any, "Geofence"),
  HRSystemConfig: zodToJsonSchema(
    HRSystemConfigSchema as any,
    "HRSystemConfig",
  ),
  ComplianceSync: zodToJsonSchema(
    ComplianceSyncSchema as any,
    "ComplianceSync",
  ),
  WorkerSimple: zodToJsonSchema(WorkerSimpleSchema as any, "WorkerSimple"),
  WorkflowDefinition: zodToJsonSchema(
    WorkflowDefinitionSchema as any,
    "WorkflowDefinition",
  ),
  // Add all others...
};
/* eslint-enable @typescript-eslint/no-explicit-any */
