import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
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

export const accountingEnhancedApi = createApi({
  reducerPath: "accountingEnhancedApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/accounting-enhanced",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth?.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    "Payroll",
    "ChartOfAccounts",
    "GeneralLedger",
    "BankRec",
    "GovSubmission",
    "EInvoice",
    "Report",
    "Compliance",
  ],
  endpoints: (builder) => ({
    // Payroll Management
    getPayrollRecords: builder.query<
      { records: PayrollRecord[]; total: number },
      any
    >({
      query: (params) => ({ url: "/payroll", params }),
      providesTags: ["Payroll"],
    }),
    createPayrollRecord: builder.mutation<
      PayrollRecord,
      Partial<PayrollRecord>
    >({
      query: (record) => ({
        url: "/payroll",
        method: "POST",
        body: record,
      }),
      invalidatesTags: ["Payroll"],
    }),
    calculatePayroll: builder.mutation<
      PayrollRecord,
      { workerId: string; payPeriod: string }
    >({
      query: (data) => ({
        url: "/payroll/calculate",
        method: "POST",
        body: data,
      }),
    }),
    approvePayroll: builder.mutation<
      PayrollRecord,
      { id: string; approvedBy: string }
    >({
      query: ({ id, approvedBy }) => ({
        url: `/payroll/${id}/approve`,
        method: "PATCH",
        body: { approvedBy },
      }),
      invalidatesTags: ["Payroll"],
    }),
    processPayrollPayment: builder.mutation<
      any,
      { ids: string[]; paymentMethod: string }
    >({
      query: (data) => ({
        url: "/payroll/process-payment",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Payroll"],
    }),

    // Malaysian Tax Rates
    getTaxRates: builder.query<MalaysianTaxRates, void>({
      query: () => "/tax-rates",
    }),
    updateTaxRates: builder.mutation<
      MalaysianTaxRates,
      Partial<MalaysianTaxRates>
    >({
      query: (rates) => ({
        url: "/tax-rates",
        method: "PUT",
        body: rates,
      }),
    }),

    // Chart of Accounts
    getChartOfAccounts: builder.query<ChartOfAccounts[], void>({
      query: () => "/chart-of-accounts",
      providesTags: ["ChartOfAccounts"],
    }),
    createAccount: builder.mutation<ChartOfAccounts, Partial<ChartOfAccounts>>({
      query: (account) => ({
        url: "/chart-of-accounts",
        method: "POST",
        body: account,
      }),
      invalidatesTags: ["ChartOfAccounts"],
    }),
    updateAccount: builder.mutation<
      ChartOfAccounts,
      { id: string; account: Partial<ChartOfAccounts> }
    >({
      query: ({ id, account }) => ({
        url: `/chart-of-accounts/${id}`,
        method: "PUT",
        body: account,
      }),
      invalidatesTags: ["ChartOfAccounts"],
    }),

    // General Ledger
    getGeneralLedger: builder.query<
      { entries: GeneralLedger[]; total: number },
      any
    >({
      query: (params) => ({ url: "/general-ledger", params }),
      providesTags: ["GeneralLedger"],
    }),
    createJournalEntry: builder.mutation<GeneralLedger, Partial<GeneralLedger>>(
      {
        query: (entry) => ({
          url: "/general-ledger",
          method: "POST",
          body: entry,
        }),
        invalidatesTags: ["GeneralLedger", "ChartOfAccounts"],
      },
    ),
    postJournalEntry: builder.mutation<
      GeneralLedger,
      { id: string; approvedBy: string }
    >({
      query: ({ id, approvedBy }) => ({
        url: `/general-ledger/${id}/post`,
        method: "PATCH",
        body: { approvedBy },
      }),
      invalidatesTags: ["GeneralLedger", "ChartOfAccounts"],
    }),

    // Bank Reconciliation
    getBankReconciliations: builder.query<
      { reconciliations: BankReconciliation[]; total: number },
      any
    >({
      query: (params) => ({ url: "/bank-reconciliation", params }),
      providesTags: ["BankRec"],
    }),
    importBankStatement: builder.mutation<
      any,
      { bankAccount: string; file: File }
    >({
      query: ({ bankAccount, file }) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("bankAccount", bankAccount);
        return {
          url: "/bank-reconciliation/import",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["BankRec"],
    }),
    matchTransactions: builder.mutation<
      any,
      { reconciliationId: string; matches: any[] }
    >({
      query: ({ reconciliationId, matches }) => ({
        url: `/bank-reconciliation/${reconciliationId}/match`,
        method: "POST",
        body: { matches },
      }),
      invalidatesTags: ["BankRec"],
    }),

    // Government Submissions
    getGovernmentSubmissions: builder.query<
      { submissions: GovernmentSubmission[]; total: number },
      any
    >({
      query: (params) => ({ url: "/government-submissions", params }),
      providesTags: ["GovSubmission"],
    }),
    submitToGovernment: builder.mutation<
      GovernmentSubmission,
      { type: string; period: string; data: any }
    >({
      query: (submission) => ({
        url: "/government-submissions",
        method: "POST",
        body: submission,
      }),
      invalidatesTags: ["GovSubmission"],
    }),
    generateEPFForm: builder.mutation<any, { period: string }>({
      query: ({ period }) => ({
        url: "/government-submissions/epf-form",
        method: "POST",
        body: { period },
      }),
    }),
    generateSOCSO: builder.mutation<any, { period: string }>({
      query: ({ period }) => ({
        url: "/government-submissions/socso",
        method: "POST",
        body: { period },
      }),
    }),
    generatePCBForm: builder.mutation<any, { period: string }>({
      query: ({ period }) => ({
        url: "/government-submissions/pcb",
        method: "POST",
        body: { period },
      }),
    }),

    // E-Invoice (MyInvois)
    getEInvoices: builder.query<{ einvoices: EInvoice[]; total: number }, any>({
      query: (params) => ({ url: "/einvoice", params }),
      providesTags: ["EInvoice"],
    }),
    submitEInvoice: builder.mutation<EInvoice, { invoiceId: string }>({
      query: ({ invoiceId }) => ({
        url: "/einvoice/submit",
        method: "POST",
        body: { invoiceId },
      }),
      invalidatesTags: ["EInvoice"],
    }),
    validateEInvoice: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `/einvoice/${id}/validate`,
        method: "POST",
      }),
      invalidatesTags: ["EInvoice"],
    }),
    cancelEInvoice: builder.mutation<EInvoice, { id: string; reason: string }>({
      query: ({ id, reason }) => ({
        url: `/einvoice/${id}/cancel`,
        method: "POST",
        body: { reason },
      }),
      invalidatesTags: ["EInvoice"],
    }),

    // Financial Reports
    getFinancialReports: builder.query<
      { reports: FinancialReport[]; total: number },
      any
    >({
      query: (params) => ({ url: "/reports", params }),
      providesTags: ["Report"],
    }),
    generateProfitLoss: builder.mutation<
      FinancialReport,
      { startDate: string; endDate: string; filters?: any }
    >({
      query: (data) => ({
        url: "/reports/profit-loss",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Report"],
    }),
    generateBalanceSheet: builder.mutation<
      FinancialReport,
      { asOfDate: string; filters?: any }
    >({
      query: (data) => ({
        url: "/reports/balance-sheet",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Report"],
    }),
    generateCashFlow: builder.mutation<
      FinancialReport,
      { startDate: string; endDate: string; method: "direct" | "indirect" }
    >({
      query: (data) => ({
        url: "/reports/cash-flow",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Report"],
    }),
    generateTrialBalance: builder.mutation<
      FinancialReport,
      { asOfDate: string }
    >({
      query: (data) => ({
        url: "/reports/trial-balance",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Report"],
    }),

    // Compliance Monitoring
    getComplianceAlerts: builder.query<
      { alerts: ComplianceAlert[]; total: number },
      any
    >({
      query: (params) => ({ url: "/compliance-alerts", params }),
      providesTags: ["Compliance"],
    }),
    resolveComplianceAlert: builder.mutation<
      ComplianceAlert,
      { id: string; resolution: string }
    >({
      query: ({ id, resolution }) => ({
        url: `/compliance-alerts/${id}/resolve`,
        method: "PATCH",
        body: { resolution },
      }),
      invalidatesTags: ["Compliance"],
    }),
    runComplianceCheck: builder.mutation<any, void>({
      query: () => ({
        url: "/compliance-alerts/check",
        method: "POST",
      }),
      invalidatesTags: ["Compliance"],
    }),

    // Multi-currency & Exchange Rates
    getExchangeRates: builder.query<
      any,
      { baseCurrency: string; targetCurrencies: string[] }
    >({
      query: (params) => ({ url: "/exchange-rates", params }),
    }),
    updateExchangeRates: builder.mutation<any, void>({
      query: () => ({
        url: "/exchange-rates/update",
        method: "POST",
      }),
    }),

    // Audit Trail
    getAuditTrail: builder.query<
      any,
      {
        entityType: string;
        entityId?: string;
        startDate?: string;
        endDate?: string;
      }
    >({
      query: (params) => ({ url: "/audit-trail", params }),
    }),

    // Dashboard Analytics
    getAccountingDashboard: builder.query<any, { period?: string }>({
      query: (params) => ({ url: "/dashboard", params }),
    }),
  }),
});

export const {
  // Payroll
  useGetPayrollRecordsQuery,
  useCreatePayrollRecordMutation,
  useCalculatePayrollMutation,
  useApprovePayrollMutation,
  useProcessPayrollPaymentMutation,

  // Tax Rates
  useGetTaxRatesQuery,
  useUpdateTaxRatesMutation,

  // Chart of Accounts
  useGetChartOfAccountsQuery,
  useCreateAccountMutation,
  useUpdateAccountMutation,

  // General Ledger
  useGetGeneralLedgerQuery,
  useCreateJournalEntryMutation,
  usePostJournalEntryMutation,

  // Bank Reconciliation
  useGetBankReconciliationsQuery,
  useImportBankStatementMutation,
  useMatchTransactionsMutation,

  // Government Submissions
  useGetGovernmentSubmissionsQuery,
  useSubmitToGovernmentMutation,
  useGenerateEPFFormMutation,
  useGenerateSOCSOMutation,
  useGeneratePCBFormMutation,

  // E-Invoice
  useGetEInvoicesQuery,
  useSubmitEInvoiceMutation,
  useValidateEInvoiceMutation,
  useCancelEInvoiceMutation,

  // Financial Reports
  useGetFinancialReportsQuery,
  useGenerateProfitLossMutation,
  useGenerateBalanceSheetMutation,
  useGenerateCashFlowMutation,
  useGenerateTrialBalanceMutation,

  // Compliance
  useGetComplianceAlertsQuery,
  useResolveComplianceAlertMutation,
  useRunComplianceCheckMutation,

  // Exchange Rates
  useGetExchangeRatesQuery,
  useUpdateExchangeRatesMutation,

  // Audit & Dashboard
  useGetAuditTrailQuery,
  useGetAccountingDashboardQuery,
} = accountingEnhancedApi;
