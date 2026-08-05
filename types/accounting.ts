/**
 * Accounting type definitions used by dashboard pages and RTK Query API.
 * These match the shapes returned by the accounting tRPC router procedures
 * and the REST accounting API routes.
 */

export interface AdjustmentNote {
  id: string;
  customer: string;
  amount: number;
  status: "PENDING" | "PROCESSED" | "CANCELLED";
  reason: string;
  originalInvoice?: string;
  date: string;
  [key: string]: unknown;
}

export interface DeliveryOrder {
  id: string;
  customer: string;
  recipient: string;
  items: number;
  totalAmount: number;
  deliveryDate: string;
  status: "draft" | "pending" | "confirmed" | "completed";
  deliveryStatus: "pending" | "scheduled" | "in_transit" | "delivered" | "failed";
  [key: string]: unknown;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerTaxId?: string;
  amount: number;
  totalAmount?: number;
  status: string;
  paymentStatus?: string;
  transactionDate: string;
  dueDate: string;
  currency?: string;
  [key: string]: unknown;
}

export interface CreditNote {
  id: string;
  customer: string;
  amount: number;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
  reason: string;
  originalInvoiceId?: string;
  date: string;
  approvedBy?: string;
  rejectedBy?: string;
  notes?: string;
  [key: string]: unknown;
}

export interface DebitNote {
  id: string;
  customer: string;
  amount: number;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
  reason: string;
  originalInvoiceId?: string;
  date: string;
  [key: string]: unknown;
}

export interface AccountingSummary {
  totalRevenue: number;
  totalOutstanding: number;
  totalOverdue: number;
  invoiceCount: number;
  paidCount: number;
  overdueCount: number;
  period?: string;
  [key: string]: unknown;
}

export interface PaymentRecord {
  id: string;
  invoiceId: string;
  amount: number;
  currency: string;
  paymentDate: string;
  paymentMethod: string;
  reference?: string;
  status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
  [key: string]: unknown;
}

export interface TaxCalculation {
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  taxBreakdown?: Array<{ type: string; rate: number; amount: number }>;
  [key: string]: unknown;
}
