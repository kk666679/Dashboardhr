import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  HRSystemConfig,
  HRWorkerData,
  PayrollIntegration,
  ComplianceSync,
} from "@/types/hr-integration";

export const hrIntegrationApi = createApi({
  reducerPath: "hrIntegrationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/hr-integration",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth?.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["HRConfig", "HRWorker", "Payroll", "Compliance"],
  endpoints: (builder) => ({
    // HR System Configuration
    getHRConfigs: builder.query<HRSystemConfig[], void>({
      query: () => "/configs",
      providesTags: ["HRConfig"],
    }),
    createHRConfig: builder.mutation<HRSystemConfig, Partial<HRSystemConfig>>({
      query: (config) => ({
        url: "/configs",
        method: "POST",
        body: config,
      }),
      invalidatesTags: ["HRConfig"],
    }),
    testHRConnection: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (configId) => ({
        url: `/configs/${configId}/test`,
        method: "POST",
      }),
    }),

    // Worker Data Sync
    syncWorkerData: builder.mutation<
      { synced: number; errors: string[] },
      string
    >({
      query: (configId) => ({
        url: `/sync/workers/${configId}`,
        method: "POST",
      }),
      invalidatesTags: ["HRWorker"],
    }),
    getHRWorkers: builder.query<HRWorkerData[], void>({
      query: () => "/workers",
      providesTags: ["HRWorker"],
    }),

    // Payroll Integration
    syncAttendanceToPayroll: builder.mutation<
      PayrollIntegration,
      { workerId: string; startDate: string; endDate: string }
    >({
      query: (data) => ({
        url: "/payroll/sync-attendance",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Payroll"],
    }),
    getPayrollData: builder.query<
      PayrollIntegration[],
      { month: string; year: string }
    >({
      query: ({ month, year }) => `/payroll?month=${month}&year=${year}`,
      providesTags: ["Payroll"],
    }),

    // Compliance Sync
    syncComplianceData: builder.mutation<ComplianceSync[], void>({
      query: () => ({
        url: "/compliance/sync",
        method: "POST",
      }),
      invalidatesTags: ["Compliance"],
    }),
    getComplianceStatus: builder.query<ComplianceSync[], void>({
      query: () => "/compliance",
      providesTags: ["Compliance"],
    }),
  }),
});

export const {
  useGetHRConfigsQuery,
  useCreateHRConfigMutation,
  useTestHRConnectionMutation,
  useSyncWorkerDataMutation,
  useGetHRWorkersQuery,
  useSyncAttendanceToPayrollMutation,
  useGetPayrollDataQuery,
  useSyncComplianceDataMutation,
  useGetComplianceStatusQuery,
} = hrIntegrationApi;
