"use client";

import { useQuery, useMutation, buildQs } from "./_hooks";
import type {
  LocationData,
  Geofence,
  GeofenceAlert,
  AttendanceLocation,
} from "@/types/geolocation";

type LocationAlert = GeofenceAlert;
interface WorkerLocationSettings {
  workerId: string;
  trackingEnabled: boolean;
  geofenceAlerts: boolean;
  updateInterval: number;
  consentGiven?: boolean;
  consentDate?: string;
  emergencyContactsEnabled?: boolean;
  privacyLevel?: string;
}
interface EmergencyAlert extends LocationData {
  type: string;
  message?: string;
  status: string;
  responderId?: string;
}

const BASE = "/api/geolocation";

export function useUpdateLocationMutation() {
  return useMutation<LocationData, Partial<LocationData>>((body) => ({ url: `${BASE}/location`, method: "POST", body }));
}
export function useGetWorkerLocationQuery(workerId: string) {
  return useQuery<LocationData>(`${BASE}/location/${workerId}`);
}
export function useGetLocationHistoryQuery(p: { workerId: string; startDate: string; endDate: string }) {
  return useQuery<LocationData[]>(`${BASE}/location/${p.workerId}/history?start=${p.startDate}&end=${p.endDate}`);
}
export function useGetGeofencesQuery() {
  return useQuery<Geofence[]>(`${BASE}/geofences`);
}
export function useCreateGeofenceMutation() {
  return useMutation<Geofence, Partial<Geofence>>((body) => ({ url: `${BASE}/geofences`, method: "POST", body }));
}
export function useUpdateGeofenceMutation() {
  return useMutation<Geofence, { id: string; geofence: Partial<Geofence> }>(({ id, geofence }) => ({ url: `${BASE}/geofences/${id}`, method: "PUT", body: geofence }));
}
export function useGetLocationAlertsQuery(params: { workerId?: string; status?: string }) {
  return useQuery<LocationAlert[]>(`${BASE}/alerts${buildQs(params as Record<string, unknown>)}`);
}
export function useResolveAlertMutation() {
  return useMutation<LocationAlert, { id: string; resolution: string }>(({ id, resolution }) => ({ url: `${BASE}/alerts/${id}/resolve`, method: "PATCH", body: { resolution } }));
}
export function useGetLocationAttendanceQuery(p: { workerId: string; date: string }) {
  return useQuery<AttendanceLocation[]>(`${BASE}/attendance/${p.workerId}?date=${p.date}`);
}
export function useRecordLocationAttendanceMutation() {
  return useMutation<AttendanceLocation, { workerId: string; location: LocationData }>((body) => ({ url: `${BASE}/attendance`, method: "POST", body }));
}
export function useGetWorkerLocationSettingsQuery(workerId: string) {
  return useQuery<WorkerLocationSettings>(`${BASE}/settings/${workerId}`);
}
export function useUpdateLocationSettingsMutation() {
  return useMutation<WorkerLocationSettings, { workerId: string; settings: Partial<WorkerLocationSettings> }>(({ workerId, settings }) => ({ url: `${BASE}/settings/${workerId}`, method: "PUT", body: settings }));
}
export function useTriggerEmergencyAlertMutation() {
  return useMutation<EmergencyAlert, { workerId: string; type: string; location: LocationData; message?: string }>((body) => ({ url: `${BASE}/emergency`, method: "POST", body }));
}
export function useGetEmergencyAlertsQuery(params: { status?: string }) {
  return useQuery<EmergencyAlert[]>(`${BASE}/emergency${buildQs(params as Record<string, unknown>)}`);
}
export function useAcknowledgeEmergencyMutation() {
  return useMutation<EmergencyAlert, { id: string; responderId: string }>(({ id, responderId }) => ({ url: `${BASE}/emergency/${id}/acknowledge`, method: "PATCH", body: { responderId } }));
}
