import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  LocationData,
  Geofence,
  LocationAlert,
  AttendanceLocation,
  WorkerLocationSettings,
  EmergencyAlert,
} from "@/types/geolocation";

export const geolocationApi = createApi({
  reducerPath: "geolocationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/geolocation",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth?.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    "Location",
    "Geofence",
    "Alert",
    "Attendance",
    "Settings",
    "Emergency",
  ],
  endpoints: (builder) => ({
    // Location Tracking
    updateLocation: builder.mutation<LocationData, Partial<LocationData>>({
      query: (location) => ({
        url: "/location",
        method: "POST",
        body: location,
      }),
      invalidatesTags: ["Location"],
    }),
    getWorkerLocation: builder.query<LocationData, string>({
      query: (workerId) => `/location/${workerId}`,
      providesTags: (result, error, workerId) => [
        { type: "Location", id: workerId },
      ],
    }),
    getLocationHistory: builder.query<
      LocationData[],
      { workerId: string; startDate: string; endDate: string }
    >({
      query: ({ workerId, startDate, endDate }) =>
        `/location/${workerId}/history?start=${startDate}&end=${endDate}`,
      providesTags: ["Location"],
    }),

    // Geofencing
    getGeofences: builder.query<Geofence[], void>({
      query: () => "/geofences",
      providesTags: ["Geofence"],
    }),
    createGeofence: builder.mutation<Geofence, Partial<Geofence>>({
      query: (geofence) => ({
        url: "/geofences",
        method: "POST",
        body: geofence,
      }),
      invalidatesTags: ["Geofence"],
    }),
    updateGeofence: builder.mutation<
      Geofence,
      { id: string; geofence: Partial<Geofence> }
    >({
      query: ({ id, geofence }) => ({
        url: `/geofences/${id}`,
        method: "PUT",
        body: geofence,
      }),
      invalidatesTags: ["Geofence"],
    }),

    // Alerts
    getLocationAlerts: builder.query<
      LocationAlert[],
      { workerId?: string; status?: string }
    >({
      query: (params) => ({ url: "/alerts", params }),
      providesTags: ["Alert"],
    }),
    resolveAlert: builder.mutation<
      LocationAlert,
      { id: string; resolution: string }
    >({
      query: ({ id, resolution }) => ({
        url: `/alerts/${id}/resolve`,
        method: "PATCH",
        body: { resolution },
      }),
      invalidatesTags: ["Alert"],
    }),

    // Attendance
    getLocationAttendance: builder.query<
      AttendanceLocation[],
      { workerId: string; date: string }
    >({
      query: ({ workerId, date }) => `/attendance/${workerId}?date=${date}`,
      providesTags: ["Attendance"],
    }),
    recordLocationAttendance: builder.mutation<
      AttendanceLocation,
      {
        workerId: string;
        type: "check_in" | "check_out";
        location: LocationData;
      }
    >({
      query: (data) => ({
        url: "/attendance",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Attendance"],
    }),

    // Settings
    getWorkerLocationSettings: builder.query<WorkerLocationSettings, string>({
      query: (workerId) => `/settings/${workerId}`,
      providesTags: (result, error, workerId) => [
        { type: "Settings", id: workerId },
      ],
    }),
    updateLocationSettings: builder.mutation<
      WorkerLocationSettings,
      { workerId: string; settings: Partial<WorkerLocationSettings> }
    >({
      query: ({ workerId, settings }) => ({
        url: `/settings/${workerId}`,
        method: "PUT",
        body: settings,
      }),
      invalidatesTags: (result, error, { workerId }) => [
        { type: "Settings", id: workerId },
      ],
    }),

    // Emergency
    triggerEmergencyAlert: builder.mutation<
      EmergencyAlert,
      {
        workerId: string;
        type: string;
        location: LocationData;
        message?: string;
      }
    >({
      query: (data) => ({
        url: "/emergency",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Emergency", "Alert"],
    }),
    getEmergencyAlerts: builder.query<EmergencyAlert[], { status?: string }>({
      query: (params) => ({ url: "/emergency", params }),
      providesTags: ["Emergency"],
    }),
    acknowledgeEmergency: builder.mutation<
      EmergencyAlert,
      { id: string; responderId: string }
    >({
      query: ({ id, responderId }) => ({
        url: `/emergency/${id}/acknowledge`,
        method: "PATCH",
        body: { responderId },
      }),
      invalidatesTags: ["Emergency"],
    }),
  }),
});

export const {
  useUpdateLocationMutation,
  useGetWorkerLocationQuery,
  useGetLocationHistoryQuery,
  useGetGeofencesQuery,
  useCreateGeofenceMutation,
  useUpdateGeofenceMutation,
  useGetLocationAlertsQuery,
  useResolveAlertMutation,
  useGetLocationAttendanceQuery,
  useRecordLocationAttendanceMutation,
  useGetWorkerLocationSettingsQuery,
  useUpdateLocationSettingsMutation,
  useTriggerEmergencyAlertMutation,
  useGetEmergencyAlertsQuery,
  useAcknowledgeEmergencyMutation,
} = geolocationApi;
