/**
 * lib/schemas/geolocation.ts
 * Geofence, location tracking, attendance-location, and emergency alert schemas.
 */
import { z } from "zod";

export const GeofenceCoordinateSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export const LocationDataSchema = z.object({
  id: z.string(),
  workerId: z.string(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  accuracy: z.number().positive(),
  timestamp: z.string(),
  address: z.string().optional(),
  source: z.enum(["gps", "network", "manual"]),
  batteryLevel: z.number().min(0).max(1).optional(),
});

export const GeofenceSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["worksite", "accommodation", "restricted", "safe_zone"]),
  coordinates: z.array(GeofenceCoordinateSchema),
  radius: z.number().positive().optional(),
  isActive: z.boolean(),
  alertOnEntry: z.boolean(),
  alertOnExit: z.boolean(),
  workingHours: z
    .object({
      start: z.string(),
      end: z.string(),
      days: z.array(z.number().int().min(0).max(6)),
    })
    .optional(),
});

export const LocationAlertSchema = z.object({
  id: z.string(),
  workerId: z.string(),
  type: z.enum([
    "unauthorized_exit",
    "restricted_entry",
    "sos",
    "offline",
    "geofence_violation",
  ]),
  severity: z.enum(["low", "medium", "high", "critical"]),
  location: LocationDataSchema,
  geofenceId: z.string().optional(),
  message: z.string(),
  isResolved: z.boolean(),
  createdAt: z.string(),
  resolvedAt: z.string().optional(),
});

export const AttendanceLocationSchema = z.object({
  id: z.string(),
  workerId: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  checkIn: z
    .object({
      time: z.string(),
      location: LocationDataSchema,
      geofenceId: z.string(),
    })
    .optional(),
  checkOut: z
    .object({
      time: z.string(),
      location: LocationDataSchema,
      geofenceId: z.string(),
    })
    .optional(),
  totalHours: z.number().nonnegative(),
  isValid: z.boolean(),
});

export const WorkerLocationSettingsSchema = z.object({
  workerId: z.string(),
  trackingEnabled: z.boolean(),
  updateFrequency: z.number().positive(), // minutes
  consentGiven: z.boolean(),
  consentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  emergencyContactsEnabled: z.boolean(),
  privacyLevel: z.enum(["minimal", "standard", "detailed"]),
});

export const EmergencyAlertSchema = z.object({
  id: z.string(),
  workerId: z.string(),
  location: LocationDataSchema,
  type: z.enum(["sos", "panic", "medical", "accident"]),
  status: z.enum(["active", "acknowledged", "resolved"]),
  message: z.string().optional(),
  responderId: z.string().optional(),
  responseTime: z.string().optional(),
  createdAt: z.string(),
});
