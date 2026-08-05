"use client";

import { useQuery, useMutation } from "./_hooks";
import type {
  HRSystemConfig,
  HRWorkerData,
  PayrollIntegration,
  ComplianceSync,
} from "@/types/hr-integration";

const BASE = "/api/hr-integration";

export function useGetHRConfigsQuery() {
  return useQuery<HRSystemConfig[]>(`${BASE}/configs`);
}
export function useCreateHRConfigMutation() {
  return useMutation<HRSystemConfig, Partial<HRSystemConfig>>((body) => ({ url: `${BASE}/configs`, method: "POST", body }));
}
export function useTestHRConnectionMutation() {
  return useMutation<{ success: boolean; message: string }, string>((configId) => ({ url: `${BASE}/configs/${configId}/test`, method: "POST" }));
}
export function useSyncWorkerDataMutation() {
  return useMutation<{ synced: number; errors: string[] }, string>((configId) => ({ url: `${BASE}/sync/workers/${configId}`, method: "POST" }));
}
export function useGetHRWorkersQuery() {
  return useQuery<HRWorkerData[]>(`${BASE}/workers`);
}
export function useSyncAttendanceToPayrollMutation() {
  return useMutation<PayrollIntegration, { workerId: string; startDate: string; endDate: string }>((body) => ({ url: `${BASE}/payroll/sync-attendance`, method: "POST", body }));
}
export function useGetPayrollDataQuery(params: { month: string; year: string }) {
  return useQuery<PayrollIntegration[]>(`${BASE}/payroll?month=${params.month}&year=${params.year}`);
}
export function useSyncComplianceDataMutation() {
  return useMutation<ComplianceSync[], void>(() => ({ url: `${BASE}/compliance/sync`, method: "POST" }));
}
export function useGetComplianceStatusQuery() {
  return useQuery<ComplianceSync[]>(`${BASE}/compliance`);
}
