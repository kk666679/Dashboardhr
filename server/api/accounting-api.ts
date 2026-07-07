import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  Invoice,
  DeliveryOrder,
  CreditNote,
  DebitNote,
  AccountingSummary,
  PaymentRecord,
  TaxCalculation,
} from "@/types/accounting";

export const accountingApi = createApi({
  reducerPath: "accountingApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/accounting",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth?.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    "Invoice",
    "DeliveryOrder",
    "CreditNote",
    "DebitNote",
    "AccountingSummary",
    "Payment",
    "TaxCalculation",
  ],
  endpoints: (builder) => ({
    // Invoice endpoints
    getInvoices: builder.query<{ invoices: Invoice[]; total: number }, any>({
      query: (params) => ({ url: "/invoices", params }),
      providesTags: ["Invoice"],
    }),
    getInvoiceById: builder.query<Invoice, string>({
      query: (id) => `/invoices/${id}`,
      providesTags: (result, error, id) => [{ type: "Invoice", id }],
    }),
    createInvoice: builder.mutation<Invoice, Partial<Invoice>>({
      query: (invoice) => ({
        url: "/invoices",
        method: "POST",
        body: invoice,
      }),
      invalidatesTags: ["Invoice", "AccountingSummary"],
    }),
    updateInvoice: builder.mutation<
      Invoice,
      { id: string; invoice: Partial<Invoice> }
    >({
      query: ({ id, invoice }) => ({
        url: `/invoices/${id}`,
        method: "PUT",
        body: invoice,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Invoice", id },
        "AccountingSummary",
      ],
    }),
    deleteInvoice: builder.mutation<void, string>({
      query: (id) => ({
        url: `/invoices/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Invoice", "AccountingSummary"],
    }),
    sendInvoice: builder.mutation<void, { id: string; email: string }>({
      query: ({ id, email }) => ({
        url: `/invoices/${id}/send`,
        method: "POST",
        body: { email },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Invoice", id }],
    }),

    // Delivery Order endpoints
    getDeliveryOrders: builder.query<
      { orders: DeliveryOrder[]; total: number },
      any
    >({
      query: (params) => ({ url: "/delivery-orders", params }),
      providesTags: ["DeliveryOrder"],
    }),
    getDeliveryOrderById: builder.query<DeliveryOrder, string>({
      query: (id) => `/delivery-orders/${id}`,
      providesTags: (result, error, id) => [{ type: "DeliveryOrder", id }],
    }),
    createDeliveryOrder: builder.mutation<
      DeliveryOrder,
      Partial<DeliveryOrder>
    >({
      query: (order) => ({
        url: "/delivery-orders",
        method: "POST",
        body: order,
      }),
      invalidatesTags: ["DeliveryOrder", "AccountingSummary"],
    }),
    updateDeliveryOrder: builder.mutation<
      DeliveryOrder,
      { id: string; order: Partial<DeliveryOrder> }
    >({
      query: ({ id, order }) => ({
        url: `/delivery-orders/${id}`,
        method: "PUT",
        body: order,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "DeliveryOrder", id },
      ],
    }),
    updateDeliveryStatus: builder.mutation<
      DeliveryOrder,
      { id: string; status: string; notes?: string }
    >({
      query: ({ id, status, notes }) => ({
        url: `/delivery-orders/${id}/status`,
        method: "PATCH",
        body: { status, notes },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "DeliveryOrder", id },
      ],
    }),

    // Credit Note endpoints
    getCreditNotes: builder.query<
      { creditNotes: CreditNote[]; total: number },
      any
    >({
      query: (params) => ({ url: "/credit-notes", params }),
      providesTags: ["CreditNote"],
    }),
    getCreditNoteById: builder.query<CreditNote, string>({
      query: (id) => `/credit-notes/${id}`,
      providesTags: (result, error, id) => [{ type: "CreditNote", id }],
    }),
    createCreditNote: builder.mutation<CreditNote, Partial<CreditNote>>({
      query: (creditNote) => ({
        url: "/credit-notes",
        method: "POST",
        body: creditNote,
      }),
      invalidatesTags: ["CreditNote", "AccountingSummary"],
    }),
    approveCreditNote: builder.mutation<
      CreditNote,
      { id: string; approvedBy: string; notes?: string }
    >({
      query: ({ id, approvedBy, notes }) => ({
        url: `/credit-notes/${id}/approve`,
        method: "PATCH",
        body: { approvedBy, notes },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "CreditNote", id }],
    }),
    rejectCreditNote: builder.mutation<
      CreditNote,
      { id: string; rejectedBy: string; reason: string }
    >({
      query: ({ id, rejectedBy, reason }) => ({
        url: `/credit-notes/${id}/reject`,
        method: "PATCH",
        body: { rejectedBy, reason },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "CreditNote", id }],
    }),

    // Debit Note endpoints
    getDebitNotes: builder.query<
      { debitNotes: DebitNote[]; total: number },
      any
    >({
      query: (params) => ({ url: "/debit-notes", params }),
      providesTags: ["DebitNote"],
    }),
    getDebitNoteById: builder.query<DebitNote, string>({
      query: (id) => `/debit-notes/${id}`,
      providesTags: (result, error, id) => [{ type: "DebitNote", id }],
    }),
    createDebitNote: builder.mutation<DebitNote, Partial<DebitNote>>({
      query: (debitNote) => ({
        url: "/debit-notes",
        method: "POST",
        body: debitNote,
      }),
      invalidatesTags: ["DebitNote", "AccountingSummary"],
    }),
    updateDebitNote: builder.mutation<
      DebitNote,
      { id: string; debitNote: Partial<DebitNote> }
    >({
      query: ({ id, debitNote }) => ({
        url: `/debit-notes/${id}`,
        method: "PUT",
        body: debitNote,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "DebitNote", id }],
    }),

    // Payment endpoints
    recordPayment: builder.mutation<PaymentRecord, Partial<PaymentRecord>>({
      query: (payment) => ({
        url: "/payments",
        method: "POST",
        body: payment,
      }),
      invalidatesTags: ["Invoice", "AccountingSummary", "Payment"],
    }),
    getPayments: builder.query<
      { payments: PaymentRecord[]; total: number },
      any
    >({
      query: (params) => ({ url: "/payments", params }),
      providesTags: ["Payment"],
    }),

    // Tax calculation
    calculateTax: builder.mutation<
      TaxCalculation,
      { items: any[]; customerType: string }
    >({
      query: (data) => ({
        url: "/tax/calculate",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["TaxCalculation"],
    }),

    // Summary and reports
    getAccountingSummary: builder.query<AccountingSummary, { period?: string }>(
      {
        query: (params) => ({ url: "/summary", params }),
        providesTags: ["AccountingSummary"],
      },
    ),

    // PDF generation
    generateInvoicePDF: builder.mutation<{ url: string }, string>({
      query: (id) => ({
        url: `/invoices/${id}/pdf`,
        method: "POST",
      }),
    }),
    generateDeliveryOrderPDF: builder.mutation<{ url: string }, string>({
      query: (id) => ({
        url: `/delivery-orders/${id}/pdf`,
        method: "POST",
      }),
    }),
    generateCreditNotePDF: builder.mutation<{ url: string }, string>({
      query: (id) => ({
        url: `/credit-notes/${id}/pdf`,
        method: "POST",
      }),
    }),
    generateDebitNotePDF: builder.mutation<{ url: string }, string>({
      query: (id) => ({
        url: `/debit-notes/${id}/pdf`,
        method: "POST",
      }),
    }),

    // Bulk operations
    bulkUpdateInvoices: builder.mutation<
      void,
      { ids: string[]; updates: Partial<Invoice> }
    >({
      query: (data) => ({
        url: "/invoices/bulk-update",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Invoice", "AccountingSummary"],
    }),
    bulkDeleteInvoices: builder.mutation<void, string[]>({
      query: (ids) => ({
        url: "/invoices/bulk-delete",
        method: "DELETE",
        body: { ids },
      }),
      invalidatesTags: ["Invoice", "AccountingSummary"],
    }),

    // Financial Reports
    getFinancialReports: builder.query<any, { period?: string; type?: string }>(
      {
        query: (params) => ({ url: "/reports/financial", params }),
        providesTags: ["AccountingSummary"],
      },
    ),

    // Export functions
    exportInvoices: builder.mutation<
      { url: string },
      { format: "csv" | "excel"; filters?: any }
    >({
      query: (data) => ({
        url: "/invoices/export",
        method: "POST",
        body: data,
      }),
    }),
    exportDeliveryOrders: builder.mutation<
      { url: string },
      { format: "csv" | "excel"; filters?: any }
    >({
      query: (data) => ({
        url: "/delivery-orders/export",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  // Invoice hooks
  useGetInvoicesQuery,
  useGetInvoiceByIdQuery,
  useCreateInvoiceMutation,
  useUpdateInvoiceMutation,
  useDeleteInvoiceMutation,
  useSendInvoiceMutation,

  // Delivery Order hooks
  useGetDeliveryOrdersQuery,
  useGetDeliveryOrderByIdQuery,
  useCreateDeliveryOrderMutation,
  useUpdateDeliveryOrderMutation,
  useUpdateDeliveryStatusMutation,

  // Credit Note hooks
  useGetCreditNotesQuery,
  useGetCreditNoteByIdQuery,
  useCreateCreditNoteMutation,
  useApproveCreditNoteMutation,
  useRejectCreditNoteMutation,

  // Debit Note hooks
  useGetDebitNotesQuery,
  useGetDebitNoteByIdQuery,
  useCreateDebitNoteMutation,
  useUpdateDebitNoteMutation,

  // Payment hooks
  useRecordPaymentMutation,
  useGetPaymentsQuery,

  // Tax and summary hooks
  useCalculateTaxMutation,
  useGetAccountingSummaryQuery,
  useGetFinancialReportsQuery,

  // PDF generation hooks
  useGenerateInvoicePDFMutation,
  useGenerateDeliveryOrderPDFMutation,
  useGenerateCreditNotePDFMutation,
  useGenerateDebitNotePDFMutation,

  // Bulk operation hooks
  useBulkUpdateInvoicesMutation,
  useBulkDeleteInvoicesMutation,

  // Export hooks
  useExportInvoicesMutation,
  useExportDeliveryOrdersMutation,
} = accountingApi;
