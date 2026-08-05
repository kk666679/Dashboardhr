"use client";

import { useQuery, useMutation, buildQs } from "./_hooks";
import type {
  PayrollRecord,
  MalaysianTaxRates,
  ChartOfAccounts,
  GeneralLedger,
  BankReconciliation,
  GovernmentSubmission,
  EInvoice,
  FinancialReport,
  ComplianceAlert,
} from "@/types/accounting-enhanced";

const BASE = "/api/accounting-enhanced";

// Payroll
export function useGetPayrollRecordsQuery(params?: Record<string, unknown>) {
  return useQuery<{ records: PayrollRecord[]; total: number }>(`${BASE}/payroll${buildQs(params ?? {})}`);
}
export function useCreatePayrollRecordMutation() {
  return useMutation<PayrollRecord, Partial<PayrollRecord>>((body) => ({ url: `${BASE}/payroll`, method: "POST", body }));
}
export function useCalculatePayrollMutation() {
  return useMutation<PayrollRecord, { workerId: string; payPeriod: string }>((body) => ({ url: `${BASE}/payroll/calculate`, method: "POST", body }));
}
export function useApprovePayrollMutation() {
  return useMutation<PayrollRecord, { id: string; approvedBy: string }>(({ id, approvedBy }) => ({ url: `${BASE}/payroll/${id}/approve`, method: "PATCH", body: { approvedBy } }));
}
export function useProcessPayrollPaymentMutation() {
  return useMutation<unknown, { ids: string[]; paymentMethod: string }>((body) => ({ url: `${BASE}/payroll/process-payment`, method: "POST", body }));
}

// Tax Rates
export function useGetTaxRatesQuery() {
  return useQuery<MalaysianTaxRates>(`${BASE}/tax-rates`);
}
export function useUpdateTaxRatesMutation() {
  return useMutation<MalaysianTaxRates, Partial<MalaysianTaxRates>>((body) => ({ url: `${BASE}/tax-rates`, method: "PUT", body }));
}

// Chart of Accounts
export function useGetChartOfAccountsQuery() {
  return useQuery<ChartOfAccounts[]>(`${BASE}/chart-of-accounts`);
}
export function useCreateAccountMutation() {
  return useMutation<ChartOfAccounts, Partial<ChartOfAccounts>>((body) => ({ url: `${BASE}/chart-of-accounts`, method: "POST", body }));
}
export function useUpdateAccountMutation() {
  return useMutation<ChartOfAccounts, { id: string; account: Partial<ChartOfAccounts> }>(({ id, account }) => ({ url: `${BASE}/chart-of-accounts/${id}`, method: "PUT", body: account }));
}

// General Ledger
export function useGetGeneralLedgerQuery(params?: Record<string, unknown>) {
  return useQuery<{ entries: GeneralLedger[]; total: number }>(`${BASE}/general-ledger${buildQs(params ?? {})}`);
}
export function useCreateJournalEntryMutation() {
  return useMutation<GeneralLedger, Partial<GeneralLedger>>((body) => ({ url: `${BASE}/general-ledger`, method: "POST", body }));
}
export function usePostJournalEntryMutation() {
  return useMutation<GeneralLedger, { id: string; approvedBy: string }>(({ id, approvedBy }) => ({ url: `${BASE}/general-ledger/${id}/post`, method: "PATCH", body: { approvedBy } }));
}

// Bank Reconciliation
export function useGetBankReconciliationsQuery(params?: Record<string, unknown>) {
  return useQuery<{ reconciliations: BankReconciliation[]; total: number }>(`${BASE}/bank-reconciliation${buildQs(params ?? {})}`);
}
export function useImportBankStatementMutation() {
  return useMutation<unknown, { bankAccount: string; file: File }>(({ bankAccount, file }) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("bankAccount", bankAccount);
    return { url: `${BASE}/bank-reconciliation/import`, method: "POST", body: formData };
  });
}
export function useMatchTransactionsMutation() {
  return useMutation<unknown, { reconciliationId: string; matches: unknown[] }>(({ reconciliationId, matches }) => ({ url: `${BASE}/bank-reconciliation/${reconciliationId}/match`, method: "POST", body: { matches } }));
}

// Government Submissions
export function useGetGovernmentSubmissionsQuery(params?: Record<string, unknown>) {
  return useQuery<{ submissions: GovernmentSubmission[]; total: number }>(`${BASE}/government-submissions${buildQs(params ?? {})}`);
}
export function useSubmitToGovernmentMutation() {
  return useMutation<GovernmentSubmission, { type: string; period: string; data: unknown }>((body) => ({ url: `${BASE}/government-submissions`, method: "POST", body }));
}
export function useGenerateEPFFormMutation() {
  return useMutation<unknown, { period: string }>((body) => ({ url: `${BASE}/government-submissions/epf-form`, method: "POST", body }));
}
export function useGenerateSOCSOMutation() {
  return useMutation<unknown, { period: string }>((body) => ({ url: `${BASE}/government-submissions/socso`, method: "POST", body }));
}
export function useGeneratePCBFormMutation() {
  return useMutation<unknown, { period: string }>((body) => ({ url: `${BASE}/government-submissions/pcb`, method: "POST", body }));
}

// E-Invoice
export function useGetEInvoicesQuery(params?: Record<string, unknown>) {
  return useQuery<{ einvoices: EInvoice[]; total: number }>(`${BASE}/einvoice${buildQs(params ?? {})}`);
}
export function useSubmitEInvoiceMutation() {
  return useMutation<EInvoice, { invoiceId: string }>((body) => ({ url: `${BASE}/einvoice/submit`, method: "POST", body }));
}
export function useValidateEInvoiceMutation() {
  return useMutation<unknown, { id: string }>(({ id }) => ({ url: `${BASE}/einvoice/${id}/validate`, method: "POST" }));
}
export function useCancelEInvoiceMutation() {
  return useMutation<EInvoice, { id: string; reason: string }>(({ id, reason }) => ({ url: `${BASE}/einvoice/${id}/cancel`, method: "POST", body: { reason } }));
}

// Financial Reports
export function useGetFinancialReportsQuery(params?: Record<string, unknown>) {
  return useQuery<{ reports: FinancialReport[]; total: number }>(`${BASE}/reports${buildQs(params ?? {})}`);
}
export function useGenerateProfitLossMutation() {
  return useMutation<FinancialReport, { startDate: string; endDate: string; filters?: unknown }>((body) => ({ url: `${BASE}/reports/profit-loss`, method: "POST", body }));
}
export function useGenerateBalanceSheetMutation() {
  return useMutation<FinancialReport, { asOfDate: string; filters?: unknown }>((body) => ({ url: `${BASE}/reports/balance-sheet`, method: "POST", body }));
}
export function useGenerateCashFlowMutation() {
  return useMutation<FinancialReport, { startDate: string; endDate: string; method: "direct" | "indirect" }>((body) => ({ url: `${BASE}/reports/cash-flow`, method: "POST", body }));
}
export function useGenerateTrialBalanceMutation() {
  return useMutation<FinancialReport, { asOfDate: string }>((body) => ({ url: `${BASE}/reports/trial-balance`, method: "POST", body }));
}

// Compliance
export function useGetComplianceAlertsQuery(params?: Record<string, unknown>) {
  return useQuery<{ alerts: ComplianceAlert[]; total: number }>(`${BASE}/compliance-alerts${buildQs(params ?? {})}`);
}
export function useResolveComplianceAlertMutation() {
  return useMutation<ComplianceAlert, { id: string; resolution: string }>(({ id, resolution }) => ({ url: `${BASE}/compliance-alerts/${id}/resolve`, method: "PATCH", body: { resolution } }));
}
export function useRunComplianceCheckMutation() {
  return useMutation<unknown, void>(() => ({ url: `${BASE}/compliance-alerts/check`, method: "POST" }));
}

// Exchange Rates
export function useGetExchangeRatesQuery(params: { baseCurrency: string; targetCurrencies: string[] }) {
  return useQuery<unknown>(`${BASE}/exchange-rates${buildQs(params as unknown as Record<string, unknown>)}`);
}
export function useUpdateExchangeRatesMutation() {
  return useMutation<unknown, void>(() => ({ url: `${BASE}/exchange-rates/update`, method: "POST" }));
}

// Audit Trail
export function useGetAuditTrailQuery(params: { entityType: string; entityId?: string; startDate?: string; endDate?: string }) {
  return useQuery<unknown>(`${BASE}/audit-trail${buildQs(params as Record<string, unknown>)}`);
}

// Dashboard
export function useGetAccountingDashboardQuery(params?: { period?: string }) {
  return useQuery<unknown>(`${BASE}/dashboard${buildQs((params ?? {}) as Record<string, unknown>)}`);
}
