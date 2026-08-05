"use client";

import { useQuery, useMutation, buildQs } from "./_hooks";
import type {
  Invoice,
  DeliveryOrder,
  CreditNote,
  DebitNote,
  AccountingSummary,
  PaymentRecord,
  TaxCalculation,
} from "@/types/accounting";

const BASE = "/api/accounting";

// Invoice
export function useGetInvoicesQuery(params?: Record<string, unknown>) {
  return useQuery<{ invoices: Invoice[]; total: number }>(`${BASE}/invoices${buildQs(params ?? {})}`);
}
export function useGetInvoiceByIdQuery(id: string) {
  return useQuery<Invoice>(`${BASE}/invoices/${id}`);
}
export function useCreateInvoiceMutation() {
  return useMutation<Invoice, Partial<Invoice>>((body) => ({ url: `${BASE}/invoices`, method: "POST", body }));
}
export function useUpdateInvoiceMutation() {
  return useMutation<Invoice, { id: string; invoice: Partial<Invoice> }>(({ id, invoice }) => ({ url: `${BASE}/invoices/${id}`, method: "PUT", body: invoice }));
}
export function useDeleteInvoiceMutation() {
  return useMutation<void, string>((id) => ({ url: `${BASE}/invoices/${id}`, method: "DELETE" }));
}
export function useSendInvoiceMutation() {
  return useMutation<void, { id: string; email: string }>(({ id, email }) => ({ url: `${BASE}/invoices/${id}/send`, method: "POST", body: { email } }));
}

// Delivery Order
export function useGetDeliveryOrdersQuery(params?: Record<string, unknown>) {
  return useQuery<{ orders: DeliveryOrder[]; total: number }>(`${BASE}/delivery-orders${buildQs(params ?? {})}`);
}
export function useGetDeliveryOrderByIdQuery(id: string) {
  return useQuery<DeliveryOrder>(`${BASE}/delivery-orders/${id}`);
}
export function useCreateDeliveryOrderMutation() {
  return useMutation<DeliveryOrder, Partial<DeliveryOrder>>((body) => ({ url: `${BASE}/delivery-orders`, method: "POST", body }));
}
export function useUpdateDeliveryOrderMutation() {
  return useMutation<DeliveryOrder, { id: string; order: Partial<DeliveryOrder> }>(({ id, order }) => ({ url: `${BASE}/delivery-orders/${id}`, method: "PUT", body: order }));
}
export function useUpdateDeliveryStatusMutation() {
  return useMutation<DeliveryOrder, { id: string; status: string; notes?: string }>(({ id, ...body }) => ({ url: `${BASE}/delivery-orders/${id}/status`, method: "PATCH", body }));
}

// Credit Note
export function useGetCreditNotesQuery(params?: Record<string, unknown>) {
  return useQuery<{ creditNotes: CreditNote[]; total: number }>(`${BASE}/credit-notes${buildQs(params ?? {})}`);
}
export function useGetCreditNoteByIdQuery(id: string) {
  return useQuery<CreditNote>(`${BASE}/credit-notes/${id}`);
}
export function useCreateCreditNoteMutation() {
  return useMutation<CreditNote, Partial<CreditNote>>((body) => ({ url: `${BASE}/credit-notes`, method: "POST", body }));
}
export function useApproveCreditNoteMutation() {
  return useMutation<CreditNote, { id: string; approvedBy: string; notes?: string }>(({ id, ...body }) => ({ url: `${BASE}/credit-notes/${id}/approve`, method: "PATCH", body }));
}
export function useRejectCreditNoteMutation() {
  return useMutation<CreditNote, { id: string; rejectedBy: string; reason: string }>(({ id, ...body }) => ({ url: `${BASE}/credit-notes/${id}/reject`, method: "PATCH", body }));
}

// Debit Note
export function useGetDebitNotesQuery(params?: Record<string, unknown>) {
  return useQuery<{ debitNotes: DebitNote[]; total: number }>(`${BASE}/debit-notes${buildQs(params ?? {})}`);
}
export function useGetDebitNoteByIdQuery(id: string) {
  return useQuery<DebitNote>(`${BASE}/debit-notes/${id}`);
}
export function useCreateDebitNoteMutation() {
  return useMutation<DebitNote, Partial<DebitNote>>((body) => ({ url: `${BASE}/debit-notes`, method: "POST", body }));
}
export function useUpdateDebitNoteMutation() {
  return useMutation<DebitNote, { id: string; debitNote: Partial<DebitNote> }>(({ id, debitNote }) => ({ url: `${BASE}/debit-notes/${id}`, method: "PUT", body: debitNote }));
}

// Payment
export function useRecordPaymentMutation() {
  return useMutation<PaymentRecord, Partial<PaymentRecord>>((body) => ({ url: `${BASE}/payments`, method: "POST", body }));
}
export function useGetPaymentsQuery(params?: Record<string, unknown>) {
  return useQuery<{ payments: PaymentRecord[]; total: number }>(`${BASE}/payments${buildQs(params ?? {})}`);
}

// Tax & Summary
export function useCalculateTaxMutation() {
  return useMutation<TaxCalculation, { items: unknown[]; customerType: string }>((body) => ({ url: `${BASE}/tax/calculate`, method: "POST", body }));
}
export function useGetAccountingSummaryQuery(params?: { period?: string }) {
  return useQuery<AccountingSummary>(`${BASE}/summary${buildQs((params ?? {}) as Record<string, unknown>)}`);
}
export function useGetFinancialReportsQuery(params?: { period?: string; type?: string }) {
  return useQuery<unknown>(`${BASE}/reports/financial${buildQs((params ?? {}) as Record<string, unknown>)}`);
}

// PDF Generation
export function useGenerateInvoicePDFMutation() {
  return useMutation<{ url: string }, string>((id) => ({ url: `${BASE}/invoices/${id}/pdf`, method: "POST" }));
}
export function useGenerateDeliveryOrderPDFMutation() {
  return useMutation<{ url: string }, string>((id) => ({ url: `${BASE}/delivery-orders/${id}/pdf`, method: "POST" }));
}
export function useGenerateCreditNotePDFMutation() {
  return useMutation<{ url: string }, string>((id) => ({ url: `${BASE}/credit-notes/${id}/pdf`, method: "POST" }));
}
export function useGenerateDebitNotePDFMutation() {
  return useMutation<{ url: string }, string>((id) => ({ url: `${BASE}/debit-notes/${id}/pdf`, method: "POST" }));
}

// Bulk Operations
export function useBulkUpdateInvoicesMutation() {
  return useMutation<void, { ids: string[]; updates: Partial<Invoice> }>((body) => ({ url: `${BASE}/invoices/bulk-update`, method: "PATCH", body }));
}
export function useBulkDeleteInvoicesMutation() {
  return useMutation<void, string[]>((ids) => ({ url: `${BASE}/invoices/bulk-delete`, method: "DELETE", body: { ids } }));
}

// Export
export function useExportInvoicesMutation() {
  return useMutation<{ url: string }, { format: "csv" | "excel"; filters?: unknown }>((body) => ({ url: `${BASE}/invoices/export`, method: "POST", body }));
}
export function useExportDeliveryOrdersMutation() {
  return useMutation<{ url: string }, { format: "csv" | "excel"; filters?: unknown }>((body) => ({ url: `${BASE}/delivery-orders/export`, method: "POST", body }));
}
