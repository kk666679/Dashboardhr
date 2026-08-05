// types/geolocation.ts

// ─── Core Location Types ─────────────────────────────────────────────────────

export interface GeolocationData {
  latitude: number;
  longitude: number;
  accuracy?: number; // in meters
  altitude?: number; // in meters
  speed?: number; // in meters/second
  heading?: number; // degrees from north
  timestamp: Date | string;
}

export interface LocationData extends GeolocationData {
  id: string;
  userId: string;

  /** Worker ID alias used by some geolocation API routes */
  workerId?: string;

  deviceId?: string;
  isEmergency?: boolean;
  state?: string;
  sector?: string;
  placeName?: string;
  address?: string;

  /** Battery level (0-100) */
  batteryLevel?: number;

  /** GPS source (e.g. gps, network, gps+wifi) */
  source?: string;

  createdAt: Date;
  updatedAt: Date;
}

export interface LocationUpdateInput {
  userId: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number;
  speed?: number;
  heading?: number;
  isEmergency?: boolean;
  deviceId?: string;
}

export interface LocationHistoryFilters {
  userId?: string;
  startDate?: Date | string;
  endDate?: Date | string;
  limit?: number;
  offset?: number;
}

export interface LocationHistoryResponse {
  locations: LocationData[];
  total: number;
  hasMore: boolean;
}

// ─── Geofence Types ─────────────────────────────────────────────────────────

export type GeofenceType = "CIRCLE" | "POLYGON" | "RECTANGLE";
export type GeofenceStatus = "ACTIVE" | "INACTIVE" | "ARCHIVED";

export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface Geofence {
  id: string;
  name: string;
  description: string | null;
  type: GeofenceType;
  centerLatitude?: number;
  centerLongitude?: number;
  radius?: number; // in meters
  coordinates?: Coordinate[];
  isActive: boolean;
  isRestricted: boolean;
  organizationId?: string;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, unknown>;
}

export interface GeofenceCreateInput {
  name: string;
  description?: string;
  type: GeofenceType;
  centerLatitude?: number;
  centerLongitude?: number;
  radius?: number;
  coordinates?: Coordinate[];
  isRestricted?: boolean;
  organizationId?: string;
  metadata?: Record<string, unknown>;
}

export interface GeofenceUpdateInput {
  id: string;
  name?: string;
  description?: string;
  type?: GeofenceType;
  centerLatitude?: number;
  centerLongitude?: number;
  radius?: number;
  coordinates?: Coordinate[];
  isActive?: boolean;
  isRestricted?: boolean;
  metadata?: Record<string, unknown>;
}

export interface GeofenceFilters {
  isActive?: boolean;
  isRestricted?: boolean;
  type?: GeofenceType;
  search?: string;
  organizationId?: string;
}

export interface GeofenceListResponse {
  geofences: Geofence[];
  total: number;
  page: number;
  limit: number;
}

// ─── Geofence Alert Types ──────────────────────────────────────────────────

export type AlertType = "ENTER" | "EXIT" | "DWELL";
export type AlertStatus = "PENDING" | "ACKNOWLEDGED" | "RESOLVED" | "EXPIRED";
export type AlertSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface GeofenceAlert {
  id: string;
  userId: string;
  geofenceId: string;
  type: AlertType;
  status: AlertStatus;
  severity: AlertSeverity;
  location: GeolocationData;
  timestamp: Date | string;
  acknowledgedAt: Date | string | null;
  resolvedAt: Date | string | null;
  acknowledgedBy: string | null;
  resolvedBy: string | null;
  dwellingTime?: number; // in seconds
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AlertFilters {
  userId?: string;
  status?: AlertStatus | AlertStatus[];
  severity?: AlertSeverity | AlertSeverity[];
  geofenceId?: string;
  type?: AlertType | AlertType[];
  startDate?: Date | string;
  endDate?: Date | string;
  limit?: number;
  offset?: number;
  orderBy?: "timestamp" | "severity" | "createdAt";
  orderDirection?: "asc" | "desc";
}

export interface AlertListResponse {
  alerts: GeofenceAlert[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface AlertAcknowledgeInput {
  alertId: string;
  notes?: string;
}

export interface AlertResolveInput {
  alertId: string;
  resolutionNotes?: string;
}

// ─── Tracking Types ────────────────────────────────────────────────────────

export interface ActiveUser {
  userId: string;
  userName: string;
  location: LocationData;
  lastUpdate: Date;
  isOnline: boolean;
  currentGeofence?: Geofence;
  deviceInfo?: {
    deviceId: string;
    platform?: string;
    appVersion?: string;
  };
}

export interface LiveLocation {
  userId: string;
  location: LocationData;
  timestamp: Date;
  speed?: number;
  heading?: number;
  isMoving: boolean;
  accuracy?: number;
}

export interface TrackingFilters {
  userId?: string | string[];
  isOnline?: boolean;
  sector?: string;
  geofenceId?: string;
  lastUpdateSince?: Date;
}

export interface TrackingResponse {
  users: ActiveUser[];
  total: number;
  timestamp: Date;
}

// ─── Query/Mutation Options ──────────────────────────────────────────────

export interface QueryOptions {
  enabled?: boolean;
  staleTime?: number;
  refetchOnWindowFocus?: boolean;
  refetchInterval?: number | false;
  refetchOnMount?: boolean;
  refetchOnReconnect?: boolean;
  retry?: number | boolean;
  retryDelay?: number | ((attempt: number) => number);
  onSuccess?: (data: unknown) => void;
  onError?: (error: Error) => void;
  onSettled?: (data: unknown, error: Error | null) => void;
}

export interface MutationOptions<TData = unknown, TVariables = unknown> {
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: Error, variables: TVariables) => void;
  onSettled?: (data: TData | null, error: Error | null, variables: TVariables) => void;
}

// ─── Pagination Types ─────────────────────────────────────────────────────

export interface PaginationOptions {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// ─── Geofence Event Types ─────────────────────────────────────────────────

export interface GeofenceEvent {
  id: string;
  userId: string;
  geofenceId: string;
  type: AlertType;
  location: GeolocationData;
  timestamp: Date;
  processed: boolean;
  processedAt?: Date;
  metadata?: Record<string, unknown>;
}

export interface GeofenceEventFilters {
  userId?: string;
  geofenceId?: string;
  type?: AlertType;
  startDate?: Date;
  endDate?: Date;
  processed?: boolean;
}

// ─── Distance/Proximity Types ─────────────────────────────────────────────

export interface DistanceCalculation {
  userId: string;
  geofenceId: string;
  distance: number; // in meters
  isInside: boolean;
  nearestPoint?: Coordinate;
  timestamp: Date;
}

export interface ProximityAlert {
  userId: string;
  geofenceId: string;
  distance: number;
  threshold: number;
  isApproaching: boolean;
  timestamp: Date;
}

// ─── Analytics Types ──────────────────────────────────────────────────────

export interface LocationAnalytics {
  userId: string;
  period: "hour" | "day" | "week" | "month";
  startDate: Date;
  endDate: Date;
  totalDistance: number; // in meters
  averageSpeed: number; // in meters/second
  maxSpeed: number;
  totalTime: number; // in seconds
  geofenceVisits: {
    geofenceId: string;
    name: string;
    visits: number;
    totalTime: number;
  }[];
  heatmapData: Coordinate[];
}

export interface GeofenceAnalytics {
  geofenceId: string;
  period: "day" | "week" | "month";
  entries: number;
  exits: number;
  peakOccupancy: number;
  averageOccupancy: number;
  dwellTime: {
    average: number;
    max: number;
    min: number;
  };
  alerts: {
    total: number;
    bySeverity: Record<AlertSeverity, number>;
    byStatus: Record<AlertStatus, number>;
  };
}

// ─── Configuration Types ──────────────────────────────────────────────────

export interface GeolocationConfig {
  updateInterval: number; // in milliseconds
  accuracyThreshold: number; // in meters
  speedThreshold: number; // in meters/second for movement detection
  geofenceCheckInterval: number; // in milliseconds
  alertCooldown: number; // in milliseconds
  maxHistoryDays: number;
  enableGeofencing: boolean;
  enableTracking: boolean;
  enableAlerting: boolean;
  privacyMode: "strict" | "moderate" | "relaxed";
  retentionPolicy: {
    locationHistory: number; // in days
    alerts: number; // in days
    events: number; // in days
  };
}

// ─── Attendance Location Types ────────────────────────────────────────────

export interface AttendanceCheckDetail {
  time: string;
  location: {
    address: string;
    coordinates?: GeolocationData;
    verified?: boolean;
  };
}

export interface AttendanceLocation {
  id: string;
  workerId: string;
  date: string;
  checkIn: AttendanceCheckDetail | null;
  checkOut: AttendanceCheckDetail | null;
  isValid: boolean;
  totalHours: number;
  status: string;
  notes?: string;
}

// ─── Error Types ─────────────────────────────────────────────────────────

export interface GeolocationError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: Date;
}

export enum GeolocationErrorCode {
  PERMISSION_DENIED = "PERMISSION_DENIED",
  POSITION_UNAVAILABLE = "POSITION_UNAVAILABLE",
  TIMEOUT = "TIMEOUT",
  INVALID_COORDINATES = "INVALID_COORDINATES",
  GEOFENCE_NOT_FOUND = "GEOFENCE_NOT_FOUND",
  GEOFENCE_ALREADY_EXISTS = "GEOFENCE_ALREADY_EXISTS",
  ALERT_NOT_FOUND = "ALERT_NOT_FOUND",
  TRACKING_NOT_ENABLED = "TRACKING_NOT_ENABLED",
  RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED",
  UNAUTHORIZED = "UNAUTHORIZED",
  INTERNAL_ERROR = "INTERNAL_ERROR",
}

// ─── WebSocket Event Types ──────────────────────────────────────────────

export interface GeolocationWebSocketEvent {
  type: "LOCATION_UPDATE" | "GEOFENCE_ALERT" | "USER_ONLINE" | "USER_OFFLINE" | "ERROR";
  userId: string;
  timestamp: Date;
  data: unknown;
}

export interface LocationUpdateEvent extends GeolocationWebSocketEvent {
  type: "LOCATION_UPDATE";
  data: LocationData;
}

export interface GeofenceAlertEvent extends GeolocationWebSocketEvent {
  type: "GEOFENCE_ALERT";
  data: GeofenceAlert;
}

export interface UserStatusEvent extends GeolocationWebSocketEvent {
  type: "USER_ONLINE" | "USER_OFFLINE";
  data: {
    userId: string;
    isOnline: boolean;
    lastLocation?: LocationData;
  };
}

// ─── API Response Types ──────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: GeolocationError;
  metadata?: {
    timestamp: Date;
    requestId: string;
    version: string;
  };
}

export interface BatchLocationResponse {
  results: {
    userId: string;
    success: boolean;
    location?: LocationData;
    error?: GeolocationError;
  }[];
  timestamp: Date;
}

// ─── Export All Types ────────────────────────────────────────────────────
// (nothing to export here; all interfaces/types above are exported inline)

