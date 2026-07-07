// Enhanced Accounting Types for Malaysian Compliance

export interface PayrollRecord {
  id: string;
  workerId: string;
  workerName: string;
  payPeriod: string;
  basicSalary: number;
  overtimeHours: number;
  overtimeRate: number;
  overtimePay: number;
  allowances: PayrollAllowance[];
  deductions: PayrollDeduction[];
  grossPay: number;
  netPay: number;
  epfEmployee: number;
  epfEmployer: number;
  socsoEmployee: number;
  socsoEmployer: number;
  eisEmployee: number;
  eisEmployer: number;
  pcbTax: number;
  levyAmount: number;
  paymentDate: string;
  status: "draft" | "approved" | "paid";
  bankAccount?: string;
  paymentReference?: string;
}

export interface PayrollAllowance {
  type: "transport" | "meal" | "housing" | "overtime" | "bonus" | "other";
  description: string;
  amount: number;
  taxable: boolean;
}

export interface PayrollDeduction {
  type: "epf" | "socso" | "eis" | "pcb" | "levy" | "advance" | "loan" | "other";
  description: string;
  amount: number;
  reference?: string;
}

export interface MalaysianTaxRates {
  epf: {
    employeeRate: number;
    employerRate: number;
    ceiling: number;
  };
  socso: {
    employeeRate: number;
    employerRate: number;
    ceiling: number;
  };
  eis: {
    employeeRate: number;
    employerRate: number;
    ceiling: number;
  };
  pcb: PCBBracket[];
  sst: {
    standardRate: number;
    serviceRate: number;
    exemptThreshold: number;
  };
}

export interface PCBBracket {
  min: number;
  max: number;
  rate: number;
  cumulativeTax: number;
}

export interface ChartOfAccounts {
  id: string;
  code: string;
  name: string;
  type: "asset" | "liability" | "equity" | "revenue" | "expense";
  category: string;
  parentId?: string;
  isActive: boolean;
  balance: number;
  currency: string;
}

export interface GeneralLedger {
  id: string;
  date: string;
  reference: string;
  description: string;
  entries: JournalEntry[];
  totalDebit: number;
  totalCredit: number;
  status: "draft" | "posted" | "reversed";
  createdBy: string;
  approvedBy?: string;
}

export interface JournalEntry {
  accountId: string;
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
  description: string;
  workerId?: string;
  projectId?: string;
}

export interface BankReconciliation {
  id: string;
  bankAccount: string;
  statementDate: string;
  statementBalance: number;
  bookBalance: number;
  reconciledItems: ReconciledItem[];
  outstandingItems: OutstandingItem[];
  adjustments: BankAdjustment[];
  status: "pending" | "completed" | "reviewed";
  reconciledBy?: string;
  reviewedBy?: string;
}

export interface ReconciledItem {
  transactionId: string;
  bankReference: string;
  amount: number;
  date: string;
  description: string;
  matched: boolean;
}

export interface OutstandingItem {
  type: "deposit_in_transit" | "outstanding_check" | "bank_charge" | "interest";
  reference: string;
  amount: number;
  date: string;
  description: string;
}

export interface BankAdjustment {
  type: "bank_charge" | "interest_earned" | "error_correction";
  amount: number;
  description: string;
  accountId: string;
}

export interface GovernmentSubmission {
  id: string;
  type: "epf" | "socso" | "eis" | "pcb" | "levy" | "sst" | "einvoice";
  period: string;
  status: "draft" | "submitted" | "accepted" | "rejected";
  submissionDate?: string;
  referenceNumber?: string;
  amount: number;
  data: any;
  errorMessage?: string;
  retryCount: number;
}

export interface EInvoice {
  id: string;
  invoiceId: string;
  uuid: string;
  submissionUid?: string;
  status: "draft" | "submitted" | "validated" | "cancelled";
  validationResults?: any;
  submittedAt?: string;
  validatedAt?: string;
  lhdnResponse?: any;
}

export interface FinancialReport {
  id: string;
  type: "profit_loss" | "balance_sheet" | "cash_flow" | "trial_balance";
  period: string;
  data: any;
  generatedAt: string;
  generatedBy: string;
}

export interface ComplianceAlert {
  id: string;
  type: "tax_due" | "levy_overdue" | "epf_submission" | "audit_required";
  severity: "low" | "medium" | "high" | "critical";
  message: string;
  dueDate?: string;
  amount?: number;
  reference?: string;
  isResolved: boolean;
  resolvedAt?: string;
}
