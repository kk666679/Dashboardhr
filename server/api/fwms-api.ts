"use client";

import { useQuery, useMutation, buildQs } from "./_hooks";
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

const BASE = "/api/fwms";

// Worker Management
export function useGetWorkersQuery(params?: Record<string, unknown>) {
  return useQuery<{ workers: Worker[]; total: number }>(`${BASE}/workers${buildQs(params ?? {})}`);
}
export function useGetWorkerByIdQuery(id: string) {
  return useQuery<Worker>(`${BASE}/workers/${id}`);
}
export function useCreateWorkerMutation() {
  return useMutation<Worker, Partial<Worker>>((body) => ({ url: `${BASE}/workers`, method: "POST", body }));
}
export function useUpdateWorkerMutation() {
  return useMutation<Worker, { id: string; worker: Partial<Worker> }>(({ id, worker }) => ({ url: `${BASE}/workers/${id}`, method: "PUT", body: worker }));
}
export function useDeleteWorkerMutation() {
  return useMutation<void, string>((id) => ({ url: `${BASE}/workers/${id}`, method: "DELETE" }));
}
export function useUpdateWorkerStatusMutation() {
  return useMutation<Worker, { id: string; status: string; reason?: string }>(({ id, ...body }) => ({ url: `${BASE}/workers/${id}/status`, method: "PATCH", body }));
}

// Document Management
export function useUploadWorkerDocumentMutation() {
  return useMutation<unknown, { workerId: string; file: File; documentType: string }>(({ workerId, file, documentType }) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("documentType", documentType);
    return { url: `${BASE}/workers/${workerId}/documents`, method: "POST", body: formData };
  });
}
export function useVerifyDocumentMutation() {
  return useMutation<unknown, { workerId: string; documentId: string; status: string; notes?: string }>(({ workerId, documentId, ...body }) => ({ url: `${BASE}/workers/${workerId}/documents/${documentId}/verify`, method: "PATCH", body }));
}

// Permit Management
export function useGetPermitsQuery(params?: Record<string, unknown>) {
  return useQuery<{ permits: Permit[]; total: number }>(`${BASE}/permits${buildQs(params ?? {})}`);
}
export function useGetPermitByIdQuery(id: string) {
  return useQuery<Permit>(`${BASE}/permits/${id}`);
}
export function useCreatePermitMutation() {
  return useMutation<Permit, Partial<Permit>>((body) => ({ url: `${BASE}/permits`, method: "POST", body }));
}
export function useUpdatePermitMutation() {
  return useMutation<Permit, { id: string; permit: Partial<Permit> }>(({ id, permit }) => ({ url: `${BASE}/permits/${id}`, method: "PUT", body: permit }));
}
export function useRenewPermitMutation() {
  return useMutation<Permit, { id: string; renewalData: unknown }>(({ id, renewalData }) => ({ url: `${BASE}/permits/${id}/renew`, method: "POST", body: renewalData }));
}
export function useCalculateLevyQuery(params: { permitType: string; duration: number; sector: string }) {
  return useQuery<{ amount: number; breakdown: unknown }>(`${BASE}/permits/calculate-levy${buildQs(params as unknown as Record<string, unknown>)}`);
}

// Medical Records
export function useGetMedicalRecordsQuery(params?: Record<string, unknown>) {
  return useQuery<{ records: MedicalRecord[]; total: number }>(`${BASE}/medical-records${buildQs(params ?? {})}`);
}
export function useGetMedicalRecordByIdQuery(id: string) {
  return useQuery<MedicalRecord>(`${BASE}/medical-records/${id}`);
}
export function useCreateMedicalRecordMutation() {
  return useMutation<MedicalRecord, Partial<MedicalRecord>>((body) => ({ url: `${BASE}/medical-records`, method: "POST", body }));
}
export function useUpdateMedicalRecordMutation() {
  return useMutation<MedicalRecord, { id: string; record: Partial<MedicalRecord> }>(({ id, record }) => ({ url: `${BASE}/medical-records/${id}`, method: "PUT", body: record }));
}
export function useSyncFomemaStatusMutation() {
  return useMutation<unknown, { workerId: string; transactionId?: string }>((body) => ({ url: `${BASE}/medical-records/sync-fomema`, method: "POST", body }));
}
export function useScheduleMedicalExamMutation() {
  return useMutation<unknown, { workerId: string; examType: string; clinicId: string; preferredDate: string }>((body) => ({ url: `${BASE}/medical-records/schedule-exam`, method: "POST", body }));
}

// Accommodation Management
export function useGetAccommodationsQuery(params?: Record<string, unknown>) {
  return useQuery<{ accommodations: Accommodation[]; total: number }>(`${BASE}/accommodations${buildQs(params ?? {})}`);
}
export function useGetAccommodationByIdQuery(id: string) {
  return useQuery<Accommodation>(`${BASE}/accommodations/${id}`);
}
export function useCreateAccommodationMutation() {
  return useMutation<Accommodation, Partial<Accommodation>>((body) => ({ url: `${BASE}/accommodations`, method: "POST", body }));
}
export function useUpdateAccommodationMutation() {
  return useMutation<Accommodation, { id: string; accommodation: Partial<Accommodation> }>(({ id, accommodation }) => ({ url: `${BASE}/accommodations/${id}`, method: "PUT", body: accommodation }));
}
export function useAssignWorkerToAccommodationMutation() {
  return useMutation<unknown, { workerId: string; accommodationId: string }>(({ workerId, accommodationId }) => ({ url: `${BASE}/accommodations/${accommodationId}/assign-worker`, method: "POST", body: { workerId } }));
}
export function useCreateInspectionReportMutation() {
  return useMutation<unknown, { accommodationId: string; report: unknown }>(({ accommodationId, report }) => ({ url: `${BASE}/accommodations/${accommodationId}/inspections`, method: "POST", body: report }));
}

// Compliance Alerts
export function useGetComplianceAlertsQuery(params?: Record<string, unknown>) {
  return useQuery<{ alerts: ComplianceAlert[]; total: number }>(`${BASE}/compliance-alerts${buildQs(params ?? {})}`);
}
export function useCreateComplianceAlertMutation() {
  return useMutation<ComplianceAlert, Partial<ComplianceAlert>>((body) => ({ url: `${BASE}/compliance-alerts`, method: "POST", body }));
}
export function useUpdateComplianceAlertMutation() {
  return useMutation<ComplianceAlert, { id: string; alert: Partial<ComplianceAlert> }>(({ id, alert }) => ({ url: `${BASE}/compliance-alerts/${id}`, method: "PUT", body: alert }));
}
export function useResolveComplianceAlertMutation() {
  return useMutation<ComplianceAlert, { id: string; resolution: string }>(({ id, resolution }) => ({ url: `${BASE}/compliance-alerts/${id}/resolve`, method: "PATCH", body: { resolution } }));
}

// Government Submissions
export function useGetGovernmentSubmissionsQuery(params?: Record<string, unknown>) {
  return useQuery<{ submissions: GovernmentSubmission[]; total: number }>(`${BASE}/government-submissions${buildQs(params ?? {})}`);
}
export function useSubmitToGovernmentMutation() {
  return useMutation<GovernmentSubmission, { type: string; workerId: string; data: unknown }>((body) => ({ url: `${BASE}/government-submissions`, method: "POST", body }));
}
export function useCheckSubmissionStatusMutation() {
  return useMutation<unknown, { id: string }>(({ id }) => ({ url: `${BASE}/government-submissions/${id}/check-status`, method: "POST" }));
}

// Levy Payments
export function useGetLevyPaymentsQuery(params?: Record<string, unknown>) {
  return useQuery<{ payments: LevyPayment[]; total: number }>(`${BASE}/levy-payments${buildQs(params ?? {})}`);
}
export function useCreateLevyPaymentMutation() {
  return useMutation<LevyPayment, Partial<LevyPayment>>((body) => ({ url: `${BASE}/levy-payments`, method: "POST", body }));
}
export function useProcessLevyPaymentMutation() {
  return useMutation<unknown, { id: string; paymentData: unknown }>(({ id, paymentData }) => ({ url: `${BASE}/levy-payments/${id}/process`, method: "POST", body: paymentData }));
}

// Performance Management
export function useGetPerformanceRecordsQuery(params?: Record<string, unknown>) {
  return useQuery<{ records: PerformanceRecord[]; total: number }>(`${BASE}/performance-records${buildQs(params ?? {})}`);
}
export function useCreatePerformanceRecordMutation() {
  return useMutation<PerformanceRecord, Partial<PerformanceRecord>>((body) => ({ url: `${BASE}/performance-records`, method: "POST", body }));
}
export function useUpdatePerformanceRecordMutation() {
  return useMutation<PerformanceRecord, { id: string; record: Partial<PerformanceRecord> }>(({ id, record }) => ({ url: `${BASE}/performance-records/${id}`, method: "PUT", body: record }));
}

// Attendance Management
export function useGetAttendanceRecordsQuery(params?: Record<string, unknown>) {
  return useQuery<{ records: AttendanceRecord[]; total: number }>(`${BASE}/attendance-records${buildQs(params ?? {})}`);
}
export function useRecordAttendanceMutation() {
  return useMutation<AttendanceRecord, Partial<AttendanceRecord>>((body) => ({ url: `${BASE}/attendance-records`, method: "POST", body }));
}
export function useBulkAttendanceImportMutation() {
  return useMutation<unknown, { file: File }>(({ file }) => {
    const formData = new FormData();
    formData.append("file", file);
    return { url: `${BASE}/attendance-records/bulk-import`, method: "POST", body: formData };
  });
}

// Reports and Analytics
export function useGetWorkerAnalyticsQuery(params?: { period?: string }) {
  return useQuery<WorkerAnalytics>(`${BASE}/analytics/workers${buildQs((params ?? {}) as Record<string, unknown>)}`);
}
export function useGetComplianceReportsQuery(params?: Record<string, unknown>) {
  return useQuery<{ reports: ComplianceReport[]; total: number }>(`${BASE}/reports/compliance${buildQs(params ?? {})}`);
}
export function useGenerateComplianceReportMutation() {
  return useMutation<ComplianceReport, { type: string; period: string; filters?: unknown }>((body) => ({ url: `${BASE}/reports/compliance/generate`, method: "POST", body }));
}
export function useExportWorkerDataMutation() {
  return useMutation<{ url: string }, { format: "csv" | "excel"; filters?: unknown }>((body) => ({ url: `${BASE}/workers/export`, method: "POST", body }));
}
export function useGenerateGovernmentReportMutation() {
  return useMutation<{ url: string }, { authority: string; reportType: string; period: string }>((body) => ({ url: `${BASE}/reports/government`, method: "POST", body }));
}

// Biometric Integration
export function useEnrollBiometricMutation() {
  return useMutation<unknown, { workerId: string; biometricData: unknown }>(({ workerId, biometricData }) => ({ url: `${BASE}/workers/${workerId}/biometric/enroll`, method: "POST", body: biometricData }));
}
export function useVerifyBiometricMutation() {
  return useMutation<unknown, { workerId: string; biometricData: unknown }>(({ workerId, biometricData }) => ({ url: `${BASE}/workers/${workerId}/biometric/verify`, method: "POST", body: biometricData }));
}

// AI-Powered Predictions
export function useGetPredictiveAlertsQuery(params?: { workerId?: string }) {
  return useQuery<unknown>(`${BASE}/ai/predictive-alerts${buildQs((params ?? {}) as Record<string, unknown>)}`);
}
export function useGetRiskAssessmentQuery(params: { workerId: string }) {
  return useQuery<unknown>(`${BASE}/ai/risk-assessment/${params.workerId}`);
}

// Mobile Worker Portal
export function useGetWorkerProfileQuery(params: { workerId: string }) {
  return useQuery<Worker>(`${BASE}/workers/${params.workerId}/profile`);
}
export function useUpdateWorkerProfileMutation() {
  return useMutation<Worker, { workerId: string; updates: unknown }>(({ workerId, updates }) => ({ url: `${BASE}/workers/${workerId}/profile`, method: "PATCH", body: updates }));
}
export function useSubmitWorkerComplaintMutation() {
  return useMutation<unknown, { workerId: string; complaint: unknown }>(({ workerId, complaint }) => ({ url: `${BASE}/workers/${workerId}/complaints`, method: "POST", body: complaint }));
}
