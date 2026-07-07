// Geolocation Tracking Types for FWMS

export interface LocationData {
  id: string;
  workerId: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: string;
  address?: string;
  source: "gps" | "network" | "manual";
  batteryLevel?: number;
}

export interface Geofence {
  id: string;
  name: string;
  type: "worksite" | "accommodation" | "restricted" | "safe_zone";
  coordinates: GeofenceCoordinate[];
  radius?: number;
  isActive: boolean;
  alertOnEntry: boolean;
  alertOnExit: boolean;
  workingHours?: {
    start: string;
    end: string;
    days: number[];
  };
}

export interface GeofenceCoordinate {
  latitude: number;
  longitude: number;
}

export interface LocationAlert {
  id: string;
  workerId: string;
  type:
    | "unauthorized_exit"
    | "restricted_entry"
    | "sos"
    | "offline"
    | "geofence_violation";
  severity: "low" | "medium" | "high" | "critical";
  location: LocationData;
  geofenceId?: string;
  message: string;
  isResolved: boolean;
  createdAt: string;
  resolvedAt?: string;
}

export interface AttendanceLocation {
  id: string;
  workerId: string;
  date: string;
  checkIn?: {
    time: string;
    location: LocationData;
    geofenceId: string;
  };
  checkOut?: {
    time: string;
    location: LocationData;
    geofenceId: string;
  };
  totalHours: number;
  isValid: boolean;
}

export interface WorkerLocationSettings {
  workerId: string;
  trackingEnabled: boolean;
  updateFrequency: number; // minutes
  consentGiven: boolean;
  consentDate: string;
  emergencyContactsEnabled: boolean;
  privacyLevel: "minimal" | "standard" | "detailed";
}

export type HrGeoJsonProperties = {
  name: string;
  type?: string;
  workerCount?: number;
  status: string;
  popupContent?: string;
} & GeoJSON.GeoJsonProperties;

export interface EmergencyAlert {
  id: string;
  workerId: string;
  location: LocationData;
  type: "sos" | "panic" | "medical" | "accident";
  status: "active" | "acknowledged" | "resolved";
  message?: string;
  responderId?: string;
  responseTime?: string;
  createdAt: string;
}
