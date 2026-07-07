// Core Accounting Types for FWMS Accounting Module

export interface Transaction {
  id: string;
  type: "invoice" | "payment" | "credit_note" | "debit_note" | "delivery_order";
  reference: string;
  description: string;
  amount: number;
  date: string;
  status: string;
  customerId: string;
  customerName: string;
}

export interface Invoice extends Transaction {
  type: "invoice";
  transactionNumber: string;
  invoiceNumber: string;
  transactionDate: string;
  customerId: string;
  customerName: string;
  customerEmail?: string;
  customerAddress: string;
  customerTaxId?: string;
  billingAddress?: string;
  paymentTerms?: number;
  issueDate?: string;
  dueDate: string;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  paymentStatus?: string;
  totalAmount?: number;
  netAmount?: number;
  lineItems?: any[];
  taxDetails?: any;
  supplierTin?: string;
  buyerTin?: string;
  createdBy?: string;
  lastModifiedBy?: string;
  items?: InvoiceItem[];
  subtotal?: number;
  taxAmount: number;
  taxRate?: number;
  discount?: number;
  total?: number;
  currency: "MYR" | "USD" | "SGD";
  notes?: string;
  terms?: string;
  paymentMethod?: string;
  paidDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  taxable: boolean;
  category?: string;
}

export interface DeliveryOrder extends Transaction {
  type: "delivery_order";
  doNumber: string;
  customerId: string;
  customerName: string;
  customerAddress: string;
  deliveryAddress: string;
  orderDate: string;
  deliveryDate?: string;
  status: "pending" | "in_transit" | "delivered" | "cancelled";
  items: DeliveryOrderItem[];
  assignedWorkers: string[];
  driverName?: string;
  vehicleNumber?: string;
  notes?: string;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeliveryOrderItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  weight?: number;
  dimensions?: string;
  specialInstructions?: string;
}

export interface CreditNote extends Transaction {
  type: "credit_note";
  creditNoteNumber: string;
  invoiceId?: string;
  customerId: string;
  customerName: string;
  issueDate: string;
  status: "pending" | "approved" | "rejected" | "processed";
  reason: "return" | "discount" | "error" | "cancellation" | "other";
  reasonDescription: string;
  items: CreditNoteItem[];
  subtotal: number;
  taxAmount: number;
  total: number;
  refundAmount: number;
  refundMethod?: "bank_transfer" | "cash" | "credit_adjustment";
  approvedBy?: string;
  approvedDate?: string;
  processedDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreditNoteItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  originalInvoiceItemId?: string;
}

export interface DebitNote extends Transaction {
  type: "debit_note";
  debitNoteNumber: string;
  customerId: string;
  customerName: string;
  issueDate: string;
  dueDate: string;
  status: "pending" | "sent" | "paid" | "overdue";
  typeNote: "penalty" | "additional_charge" | "late_fee" | "compliance_fee";
  description: string;
  amount: number;
  penaltyRate?: number;
  basedOnAmount?: number;
  daysOverdue?: number;
  complianceReference?: string;
  paymentDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaxCalculation {
  subtotal: number;
  taxableAmount: number;
  exemptAmount: number;
  sstRate: number;
  sstAmount: number;
  serviceTaxRate: number;
  serviceTaxAmount: number;
  totalTax: number;
  grandTotal: number;
}

export interface AccountingSummary {
  totalInvoices: number;
  totalRevenue: number;
  outstandingAmount: number;
  overdueAmount: number;
  paidInvoices: number;
  pendingInvoices: number;
  deliveryOrders: number;
  creditNotes: number;
  debitNotes: number;
  monthlyRevenue: number[];
  recentTransactions: Transaction[];
}

export interface PaymentRecord {
  id: string;
  invoiceId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: "bank_transfer" | "cash" | "cheque" | "credit_card" | "online";
  reference: string;
  notes?: string;
  createdAt: string;
}

export interface MalaysianTaxConfig {
  sstRate: number;
  serviceTaxRate: number;
  exemptCategories: string[];
  taxRegistrationNumber: string;
  businessRegistrationNumber: string;
  companyName: string;
  companyAddress: string;
}

// Zakat Management Types - Islamic Finance Compliance
export interface ZakatRecord {
  employeeId: string;
  name: string;
  month: string;
  zakatableIncome: number;
  zakatRate: number;
  zakatAmount: number;
  state: string;
  institution: string;
  status: 'Paid' | 'Pending' | 'Calculated' | 'Failed';
  paidDate: string | null;
  receiptNo: string | null;
}

