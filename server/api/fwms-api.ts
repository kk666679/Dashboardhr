import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  Worker,
  Permit,
  MedicalRecord,
  Accommodation,
  ComplianceAlert,
  GovernmentSubmission,
  LevyPayment,
  ComplianceReport,
  WorkerAnalytics,
  PerformanceRecord,
  AttendanceRecord,
} from "@/types/fwms";

export const fwmsApi = createApi({
  reducerPath: "fwmsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/fwms",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth?.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    "Worker",
    "Permit",
    "MedicalRecord",
    "Accommodation",
    "ComplianceAlert",
    "GovernmentSubmission",
    "LevyPayment",
    "ComplianceReport",
    "Analytics",
    "Performance",
    "Attendance",
  ],
  endpoints: (builder) => ({
    // Worker Management
    getWorkers: builder.query<{ workers: Worker[]; total: number }, any>({
      query: (params) => ({ url: "/workers", params }),
      providesTags: ["Worker"],
    }),
    getWorkerById: builder.query<Worker, string>({
      query: (id) => `/workers/${id}`,
      providesTags: (result, error, id) => [{ type: "Worker", id }],
    }),
    createWorker: builder.mutation<Worker, Partial<Worker>>({
      query: (worker) => ({
        url: "/workers",
        method: "POST",
        body: worker,
      }),
      invalidatesTags: ["Worker", "Analytics"],
    }),
    updateWorker: builder.mutation<
      Worker,
      { id: string; worker: Partial<Worker> }
    >({
      query: ({ id, worker }) => ({
        url: `/workers/${id}`,
        method: "PUT",
        body: worker,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Worker", id },
        "Analytics",
      ],
    }),
    deleteWorker: builder.mutation<void, string>({
      query: (id) => ({
        url: `/workers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Worker", "Analytics"],
    }),
    updateWorkerStatus: builder.mutation<
      Worker,
      { id: string; status: string; reason?: string }
    >({
      query: ({ id, status, reason }) => ({
        url: `/workers/${id}/status`,
        method: "PATCH",
        body: { status, reason },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Worker", id },
        "Analytics",
      ],
    }),

    // Document Management
    uploadWorkerDocument: builder.mutation<
      any,
      { workerId: string; file: File; documentType: string }
    >({
      query: ({ workerId, file, documentType }) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("documentType", documentType);
        return {
          url: `/workers/${workerId}/documents`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: (result, error, { workerId }) => [
        { type: "Worker", id: workerId },
      ],
    }),
    verifyDocument: builder.mutation<
      any,
      { workerId: string; documentId: string; status: string; notes?: string }
    >({
      query: ({ workerId, documentId, status, notes }) => ({
        url: `/workers/${workerId}/documents/${documentId}/verify`,
        method: "PATCH",
        body: { status, notes },
      }),
      invalidatesTags: (result, error, { workerId }) => [
        { type: "Worker", id: workerId },
      ],
    }),

    // Permit Management
    getPermits: builder.query<{ permits: Permit[]; total: number }, any>({
      query: (params) => ({ url: "/permits", params }),
      providesTags: ["Permit"],
    }),
    getPermitById: builder.query<Permit, string>({
      query: (id) => `/permits/${id}`,
      providesTags: (result, error, id) => [{ type: "Permit", id }],
    }),
    createPermit: builder.mutation<Permit, Partial<Permit>>({
      query: (permit) => ({
        url: "/permits",
        method: "POST",
        body: permit,
      }),
      invalidatesTags: ["Permit", "Worker"],
    }),
    updatePermit: builder.mutation<
      Permit,
      { id: string; permit: Partial<Permit> }
    >({
      query: ({ id, permit }) => ({
        url: `/permits/${id}`,
        method: "PUT",
        body: permit,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Permit", id },
        "Worker",
      ],
    }),
    renewPermit: builder.mutation<Permit, { id: string; renewalData: any }>({
      query: ({ id, renewalData }) => ({
        url: `/permits/${id}/renew`,
        method: "POST",
        body: renewalData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Permit", id },
        "Worker",
      ],
    }),
    calculateLevy: builder.query<
      { amount: number; breakdown: any },
      { permitType: string; duration: number; sector: string }
    >({
      query: (params) => ({ url: "/permits/calculate-levy", params }),
    }),

    // Medical Records
    getMedicalRecords: builder.query<
      { records: MedicalRecord[]; total: number },
      any
    >({
      query: (params) => ({ url: "/medical-records", params }),
      providesTags: ["MedicalRecord"],
    }),
    getMedicalRecordById: builder.query<MedicalRecord, string>({
      query: (id) => `/medical-records/${id}`,
      providesTags: (result, error, id) => [{ type: "MedicalRecord", id }],
    }),
    createMedicalRecord: builder.mutation<
      MedicalRecord,
      Partial<MedicalRecord>
    >({
      query: (record) => ({
        url: "/medical-records",
        method: "POST",
        body: record,
      }),
      invalidatesTags: ["MedicalRecord", "Worker"],
    }),
    updateMedicalRecord: builder.mutation<
      MedicalRecord,
      { id: string; record: Partial<MedicalRecord> }
    >({
      query: ({ id, record }) => ({
        url: `/medical-records/${id}`,
        method: "PUT",
        body: record,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "MedicalRecord", id },
        "Worker",
      ],
    }),
    syncFomemaStatus: builder.mutation<
      any,
      { workerId: string; transactionId?: string }
    >({
      query: ({ workerId, transactionId }) => ({
        url: `/medical-records/sync-fomema`,
        method: "POST",
        body: { workerId, transactionId },
      }),
      invalidatesTags: ["MedicalRecord", "Worker"],
    }),
    scheduleMedicalExam: builder.mutation<
      any,
      {
        workerId: string;
        examType: string;
        clinicId: string;
        preferredDate: string;
      }
    >({
      query: (data) => ({
        url: "/medical-records/schedule-exam",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["MedicalRecord", "Worker"],
    }),

    // Accommodation Management
    getAccommodations: builder.query<
      { accommodations: Accommodation[]; total: number },
      any
    >({
      query: (params) => ({ url: "/accommodations", params }),
      providesTags: ["Accommodation"],
    }),
    getAccommodationById: builder.query<Accommodation, string>({
      query: (id) => `/accommodations/${id}`,
      providesTags: (result, error, id) => [{ type: "Accommodation", id }],
    }),
    createAccommodation: builder.mutation<
      Accommodation,
      Partial<Accommodation>
    >({
      query: (accommodation) => ({
        url: "/accommodations",
        method: "POST",
        body: accommodation,
      }),
      invalidatesTags: ["Accommodation"],
    }),
    updateAccommodation: builder.mutation<
      Accommodation,
      { id: string; accommodation: Partial<Accommodation> }
    >({
      query: ({ id, accommodation }) => ({
        url: `/accommodations/${id}`,
        method: "PUT",
        body: accommodation,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Accommodation", id },
      ],
    }),
    assignWorkerToAccommodation: builder.mutation<
      any,
      { workerId: string; accommodationId: string }
    >({
      query: ({ workerId, accommodationId }) => ({
        url: `/accommodations/${accommodationId}/assign-worker`,
        method: "POST",
        body: { workerId },
      }),
      invalidatesTags: ["Accommodation", "Worker"],
    }),
    createInspectionReport: builder.mutation<
      any,
      { accommodationId: string; report: any }
    >({
      query: ({ accommodationId, report }) => ({
        url: `/accommodations/${accommodationId}/inspections`,
        method: "POST",
        body: report,
      }),
      invalidatesTags: (result, error, { accommodationId }) => [
        { type: "Accommodation", id: accommodationId },
      ],
    }),

    // Compliance Alerts
    getComplianceAlerts: builder.query<
      { alerts: ComplianceAlert[]; total: number },
      any
    >({
      query: (params) => ({ url: "/compliance-alerts", params }),
      providesTags: ["ComplianceAlert"],
    }),
    createComplianceAlert: builder.mutation<
      ComplianceAlert,
      Partial<ComplianceAlert>
    >({
      query: (alert) => ({
        url: "/compliance-alerts",
        method: "POST",
        body: alert,
      }),
      invalidatesTags: ["ComplianceAlert"],
    }),
    updateComplianceAlert: builder.mutation<
      ComplianceAlert,
      { id: string; alert: Partial<ComplianceAlert> }
    >({
      query: ({ id, alert }) => ({
        url: `/compliance-alerts/${id}`,
        method: "PUT",
        body: alert,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "ComplianceAlert", id },
      ],
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
      invalidatesTags: (result, error, { id }) => [
        { type: "ComplianceAlert", id },
      ],
    }),

    // Government Submissions
    getGovernmentSubmissions: builder.query<
      { submissions: GovernmentSubmission[]; total: number },
      any
    >({
      query: (params) => ({ url: "/government-submissions", params }),
      providesTags: ["GovernmentSubmission"],
    }),
    submitToGovernment: builder.mutation<
      GovernmentSubmission,
      { type: string; workerId: string; data: any }
    >({
      query: (submission) => ({
        url: "/government-submissions",
        method: "POST",
        body: submission,
      }),
      invalidatesTags: ["GovernmentSubmission"],
    }),
    checkSubmissionStatus: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `/government-submissions/${id}/check-status`,
        method: "POST",
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "GovernmentSubmission", id },
      ],
    }),

    // Levy Payments
    getLevyPayments: builder.query<
      { payments: LevyPayment[]; total: number },
      any
    >({
      query: (params) => ({ url: "/levy-payments", params }),
      providesTags: ["LevyPayment"],
    }),
    createLevyPayment: builder.mutation<LevyPayment, Partial<LevyPayment>>({
      query: (payment) => ({
        url: "/levy-payments",
        method: "POST",
        body: payment,
      }),
      invalidatesTags: ["LevyPayment", "Worker"],
    }),
    processLevyPayment: builder.mutation<any, { id: string; paymentData: any }>(
      {
        query: ({ id, paymentData }) => ({
          url: `/levy-payments/${id}/process`,
          method: "POST",
          body: paymentData,
        }),
        invalidatesTags: (result, error, { id }) => [
          { type: "LevyPayment", id },
          "Worker",
        ],
      },
    ),

    // Performance Management
    getPerformanceRecords: builder.query<
      { records: PerformanceRecord[]; total: number },
      any
    >({
      query: (params) => ({ url: "/performance-records", params }),
      providesTags: ["Performance"],
    }),
    createPerformanceRecord: builder.mutation<
      PerformanceRecord,
      Partial<PerformanceRecord>
    >({
      query: (record) => ({
        url: "/performance-records",
        method: "POST",
        body: record,
      }),
      invalidatesTags: ["Performance", "Worker"],
    }),
    updatePerformanceRecord: builder.mutation<
      PerformanceRecord,
      { id: string; record: Partial<PerformanceRecord> }
    >({
      query: ({ id, record }) => ({
        url: `/performance-records/${id}`,
        method: "PUT",
        body: record,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Performance", id },
        "Worker",
      ],
    }),

    // Attendance Management
    getAttendanceRecords: builder.query<
      { records: AttendanceRecord[]; total: number },
      any
    >({
      query: (params) => ({ url: "/attendance-records", params }),
      providesTags: ["Attendance"],
    }),
    recordAttendance: builder.mutation<
      AttendanceRecord,
      Partial<AttendanceRecord>
    >({
      query: (record) => ({
        url: "/attendance-records",
        method: "POST",
        body: record,
      }),
      invalidatesTags: ["Attendance", "Worker"],
    }),
    bulkAttendanceImport: builder.mutation<any, { file: File }>({
      query: ({ file }) => {
        const formData = new FormData();
        formData.append("file", file);
        return {
          url: "/attendance-records/bulk-import",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Attendance", "Worker"],
    }),

    // Reports and Analytics
    getWorkerAnalytics: builder.query<WorkerAnalytics, { period?: string }>({
      query: (params) => ({ url: "/analytics/workers", params }),
      providesTags: ["Analytics"],
    }),
    getComplianceReports: builder.query<
      { reports: ComplianceReport[]; total: number },
      any
    >({
      query: (params) => ({ url: "/reports/compliance", params }),
      providesTags: ["ComplianceReport"],
    }),
    generateComplianceReport: builder.mutation<
      ComplianceReport,
      { type: string; period: string; filters?: any }
    >({
      query: (data) => ({
        url: "/reports/compliance/generate",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["ComplianceReport"],
    }),
    exportWorkerData: builder.mutation<
      { url: string },
      { format: "csv" | "excel"; filters?: any }
    >({
      query: (data) => ({
        url: "/workers/export",
        method: "POST",
        body: data,
      }),
    }),
    generateGovernmentReport: builder.mutation<
      { url: string },
      { authority: string; reportType: string; period: string }
    >({
      query: (data) => ({
        url: "/reports/government",
        method: "POST",
        body: data,
      }),
    }),

    // Biometric Integration
    enrollBiometric: builder.mutation<
      any,
      { workerId: string; biometricData: any }
    >({
      query: ({ workerId, biometricData }) => ({
        url: `/workers/${workerId}/biometric/enroll`,
        method: "POST",
        body: biometricData,
      }),
      invalidatesTags: (result, error, { workerId }) => [
        { type: "Worker", id: workerId },
      ],
    }),
    verifyBiometric: builder.mutation<
      any,
      { workerId: string; biometricData: any }
    >({
      query: ({ workerId, biometricData }) => ({
        url: `/workers/${workerId}/biometric/verify`,
        method: "POST",
        body: biometricData,
      }),
    }),

    // AI-Powered Predictions
    getPredictiveAlerts: builder.query<any, { workerId?: string }>({
      query: (params) => ({ url: "/ai/predictive-alerts", params }),
    }),
    getRiskAssessment: builder.query<any, { workerId: string }>({
      query: ({ workerId }) => ({ url: `/ai/risk-assessment/${workerId}` }),
    }),

    // Mobile Worker Portal
    getWorkerProfile: builder.query<Worker, { workerId: string }>({
      query: ({ workerId }) => `/workers/${workerId}/profile`,
      providesTags: (result, error, { workerId }) => [
        { type: "Worker", id: workerId },
      ],
    }),
    updateWorkerProfile: builder.mutation<
      Worker,
      { workerId: string; updates: any }
    >({
      query: ({ workerId, updates }) => ({
        url: `/workers/${workerId}/profile`,
        method: "PATCH",
        body: updates,
      }),
      invalidatesTags: (result, error, { workerId }) => [
        { type: "Worker", id: workerId },
      ],
    }),
    submitWorkerComplaint: builder.mutation<
      any,
      { workerId: string; complaint: any }
    >({
      query: ({ workerId, complaint }) => ({
        url: `/workers/${workerId}/complaints`,
        method: "POST",
        body: complaint,
      }),
    }),
  }),
});

export const {
  // Worker Management
  useGetWorkersQuery,
  useGetWorkerByIdQuery,
  useCreateWorkerMutation,
  useUpdateWorkerMutation,
  useDeleteWorkerMutation,
  useUpdateWorkerStatusMutation,

  // Document Management
  useUploadWorkerDocumentMutation,
  useVerifyDocumentMutation,

  // Permit Management
  useGetPermitsQuery,
  useGetPermitByIdQuery,
  useCreatePermitMutation,
  useUpdatePermitMutation,
  useRenewPermitMutation,
  useCalculateLevyQuery,

  // Medical Records
  useGetMedicalRecordsQuery,
  useGetMedicalRecordByIdQuery,
  useCreateMedicalRecordMutation,
  useUpdateMedicalRecordMutation,
  useSyncFomemaStatusMutation,
  useScheduleMedicalExamMutation,

  // Accommodation Management
  useGetAccommodationsQuery,
  useGetAccommodationByIdQuery,
  useCreateAccommodationMutation,
  useUpdateAccommodationMutation,
  useAssignWorkerToAccommodationMutation,
  useCreateInspectionReportMutation,

  // Compliance Alerts
  useGetComplianceAlertsQuery,
  useCreateComplianceAlertMutation,
  useUpdateComplianceAlertMutation,
  useResolveComplianceAlertMutation,

  // Government Submissions
  useGetGovernmentSubmissionsQuery,
  useSubmitToGovernmentMutation,
  useCheckSubmissionStatusMutation,

  // Levy Payments
  useGetLevyPaymentsQuery,
  useCreateLevyPaymentMutation,
  useProcessLevyPaymentMutation,

  // Performance Management
  useGetPerformanceRecordsQuery,
  useCreatePerformanceRecordMutation,
  useUpdatePerformanceRecordMutation,

  // Attendance Management
  useGetAttendanceRecordsQuery,
  useRecordAttendanceMutation,
  useBulkAttendanceImportMutation,

  // Reports and Analytics
  useGetWorkerAnalyticsQuery,
  useGetComplianceReportsQuery,
  useGenerateComplianceReportMutation,
  useExportWorkerDataMutation,
  useGenerateGovernmentReportMutation,

  // Biometric Integration
  useEnrollBiometricMutation,
  useVerifyBiometricMutation,

  // AI-Powered Predictions
  useGetPredictiveAlertsQuery,
  useGetRiskAssessmentQuery,

  // Mobile Worker Portal
  useGetWorkerProfileQuery,
  useUpdateWorkerProfileMutation,
  useSubmitWorkerComplaintMutation,
} = fwmsApi;
