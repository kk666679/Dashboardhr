import { z } from "zod";
import { router, protectedProcedure, abacProcedure } from "@/server/trpc";
import { prisma } from "@/lib/prisma";
import { TRPCError } from "@trpc/server";

// ─── Zod Schemas ─────────────────────────────────────────────────────────────

const locationSourceEnum = z.enum(["GPS", "NETWORK", "MANUAL"]).default("GPS");
const alertSeverityEnum = z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]);
const alertTypeEnum = z.enum(["UNAUTHORIZED_EXIT", "RESTRICTED_ENTRY", "SOS", "OFFLINE", "GEO_FENCE_VIOLATION"]);
const emergencyTypeEnum = z.enum(["SOS", "PANIC", "MEDICAL", "ACCIDENT"]);
const geofenceTypeEnum = z.enum(["worksite", "restricted", "accommodation", "custom"]);

const coordinateSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

const locationUpdateSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  accuracy: z.number().positive().optional(),
  altitude: z.number().optional(),
  speed: z.number().min(0).optional(),
  heading: z.number().min(0).max(360).optional(),
  source: locationSourceEnum.optional(),
  batteryLevel: z.number().min(0).max(100).optional(),
  address: z.string().optional(),
  isEmergency: z.boolean().optional(),
});

const locationHistoryFilterSchema = z.object({
  employeeId: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  limit: z.number().int().min(1).max(1000).default(100),
  offset: z.number().int().min(0).default(0),
});

const geofenceCreateSchema = z.object({
  name: z.string().min(1).max(200),
  type: geofenceTypeEnum.default("worksite"),
  coordinates: z.array(z.tuple([z.number(), z.number()])).min(3),
  radius: z.number().positive().optional(),
  alertOnEntry: z.boolean().default(false),
  alertOnExit: z.boolean().default(true),
});

const geofenceUpdateSchema = geofenceCreateSchema.partial().extend({
  isActive: z.boolean().optional(),
});

const alertFilterSchema = z.object({
  employeeId: z.string().optional(),
  isResolved: z.boolean().optional(),
  severity: alertSeverityEnum.optional(),
  type: alertTypeEnum.optional(),
  limit: z.number().int().min(1).max(500).default(50),
  offset: z.number().int().min(0).default(0),
});

const emergencyCreateSchema = z.object({
  type: emergencyTypeEnum,
  message: z.string().max(500).optional(),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
    accuracy: z.number().optional(),
  }),
});

// ─── Router ──────────────────────────────────────────────────────────────────

export const geolocationRouter = router({
  // ── Location ──────────────────────────────────────────────────────────
  location: router({
    /** Get the latest location for the current user or a specified employee */
    getCurrent: abacProcedure("geolocation", "read").input(
      z.object({ employeeId: z.string().optional() }).optional()
    ).query(async ({ ctx, input }) => {
      const employeeId = input?.employeeId ?? ctx.session?.employeeId;
      if (!employeeId) throw new TRPCError({ code: "BAD_REQUEST", message: "No employeeId provided" });

      const record = await prisma.locationRecord.findFirst({
        where: { employeeId },
        orderBy: { timestamp: "desc" },
      });
      return record ?? null;
    }),

    /** Get location history with filters */
    getHistory: abacProcedure("geolocation", "read").input(locationHistoryFilterSchema).query(async ({ ctx, input }) => {
      const employeeId = input.employeeId ?? ctx.session?.employeeId;
      if (!employeeId) return [];

      const where: any = { employeeId };
      if (input.startDate) where.timestamp = { ...where.timestamp, gte: new Date(input.startDate) };
      if (input.endDate) where.timestamp = { ...where.timestamp, lte: new Date(input.endDate) };

      const [records, total] = await Promise.all([
        prisma.locationRecord.findMany({
          where,
          orderBy: { timestamp: "desc" },
          take: input.limit,
          skip: input.offset,
        }),
        prisma.locationRecord.count({ where }),
      ]);

      return { records, total, hasMore: input.offset + input.limit < total };
    }),

    /** Update location (used by tracker) */
    update: abacProcedure("geolocation", "write").input(locationUpdateSchema).mutation(async ({ ctx, input }) => {
      const employeeId = ctx.session?.employeeId;
      if (!employeeId) throw new TRPCError({ code: "BAD_REQUEST", message: "No employee session" });

      const record = await prisma.locationRecord.create({
        data: {
          employeeId,
          latitude: input.latitude,
          longitude: input.longitude,
          accuracy: input.accuracy,
          source: input.source ?? "GPS",
          batteryLevel: input.batteryLevel,
          address: input.address,
          timestamp: new Date(),
        },
      });

      // Check geofence violations
      if (!input.isEmergency) {
        checkGeofenceViolations(employeeId, input.latitude, input.longitude).catch(() => {});
      }

      return record;
    }),
  }),

  // ── Geofence ──────────────────────────────────────────────────────────
  geofence: router({
    /** Get all geofences for the tenant */
    getAll: abacProcedure("geolocation", "read").input(
      z.object({ isActive: z.boolean().optional() }).optional()
    ).query(async ({ ctx, input }) => {
      return prisma.geofence.findMany({
        where: {
          tenantId: ctx.tenantId,
          ...(input?.isActive !== undefined ? { isActive: input.isActive } : {}),
        },
        orderBy: { id: "asc" },
      });
    }),

    /** Create a new geofence */
    create: abacProcedure("geolocation", "write").input(geofenceCreateSchema).mutation(async ({ ctx, input }) => {
      return prisma.geofence.create({
        data: {
          tenantId: ctx.tenantId,
          name: input.name,
          type: input.type,
          coordinates: input.coordinates,
          radius: input.radius,
          alertOnEntry: input.alertOnEntry,
          alertOnExit: input.alertOnExit,
        },
      });
    }),

    /** Update a geofence */
    update: abacProcedure("geolocation", "write").input(
      z.object({ id: z.string(), data: geofenceUpdateSchema })
    ).mutation(async ({ ctx, input }) => {
      const existing = await prisma.geofence.findFirst({
        where: { id: input.id, tenantId: ctx.tenantId },
      });
      if (!existing) throw new TRPCError({ code: "NOT_FOUND", message: "Geofence not found" });

      return prisma.geofence.update({
        where: { id: input.id },
        data: input.data,
      });
    }),

    /** Delete a geofence */
    delete: abacProcedure("geolocation", "delete").input(
      z.object({ id: z.string() })
    ).mutation(async ({ ctx, input }) => {
      const existing = await prisma.geofence.findFirst({
        where: { id: input.id, tenantId: ctx.tenantId },
      });
      if (!existing) throw new TRPCError({ code: "NOT_FOUND", message: "Geofence not found" });

      await prisma.geofence.delete({ where: { id: input.id } });
      return { success: true };
    }),

    /** Toggle geofence active/inactive */
    toggle: abacProcedure("geolocation", "write").input(
      z.object({ id: z.string() })
    ).mutation(async ({ ctx, input }) => {
      const existing = await prisma.geofence.findFirst({
        where: { id: input.id, tenantId: ctx.tenantId },
      });
      if (!existing) throw new TRPCError({ code: "NOT_FOUND", message: "Geofence not found" });

      return prisma.geofence.update({
        where: { id: input.id },
        data: { isActive: !existing.isActive },
      });
    }),
  }),

  // ── Alerts ────────────────────────────────────────────────────────────
  alert: router({
    /** Get all alerts with filters */
    getAll: abacProcedure("geolocation", "read").input(alertFilterSchema.optional()).query(async ({ ctx, input }) => {
      const where: any = {};

      if (input?.employeeId) where.employeeId = input.employeeId;
      if (input?.isResolved !== undefined) where.isResolved = input.isResolved;
      if (input?.severity) where.severity = input.severity;
      if (input?.type) where.type = input.type;

      // If user is not admin, only see their own alerts
      if (ctx.userRole !== "ADMIN" && ctx.session?.employeeId) {
        where.employeeId = ctx.session.employeeId;
      }

      const [alerts, total] = await Promise.all([
        prisma.locationAlert.findMany({
          where,
          orderBy: { createdAt: "desc" },
          take: input?.limit ?? 50,
          skip: input?.offset ?? 0,
          include: { employee: { select: { name: true } } },
        }),
        prisma.locationAlert.count({ where }),
      ]);

      return { alerts, total, hasMore: (input?.offset ?? 0) + (input?.limit ?? 50) < total };
    }),

    /** Acknowledge an alert */
    acknowledge: abacProcedure("geolocation", "write").input(
      z.object({ id: z.string() })
    ).mutation(async ({ ctx, input }) => {
      const alert = await prisma.locationAlert.findUnique({ where: { id: input.id } });
      if (!alert) throw new TRPCError({ code: "NOT_FOUND", message: "Alert not found" });

      return prisma.locationAlert.update({
        where: { id: input.id },
        data: { isResolved: true, resolvedAt: new Date() },
      });
    }),

    /** Resolve an alert with optional notes */
    resolve: abacProcedure("geolocation", "write").input(
      z.object({ id: z.string(), notes: z.string().optional() })
    ).mutation(async ({ ctx, input }) => {
      const alert = await prisma.locationAlert.findUnique({ where: { id: input.id } });
      if (!alert) throw new TRPCError({ code: "NOT_FOUND", message: "Alert not found" });

      return prisma.locationAlert.update({
        where: { id: input.id },
        data: { isResolved: true, resolvedAt: new Date(), message: input.notes ?? alert.message },
      });
    }),
  }),

  // ── Tracking ──────────────────────────────────────────────────────────
  tracking: router({
    /** Get currently active users (with location updates in last 5 min) */
    getActiveUsers: abacProcedure("geolocation", "read").query(async ({ ctx }) => {
      const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);

      const records = await prisma.locationRecord.findMany({
        where: { timestamp: { gte: fiveMinAgo } },
        orderBy: { timestamp: "desc" },
        distinct: ["employeeId"],
        include: { employee: { select: { name: true, department: true } } },
      });

      return (records as any[]).map((r: any) => ({
        userId: r.employeeId,
        userName: r.employee?.name ?? "Unknown",
        latitude: r.latitude,
        longitude: r.longitude,
        accuracy: r.accuracy,
        batteryLevel: r.batteryLevel,
        lastUpdate: r.timestamp,
        isOnline: true,
      }));
    }),

    /** Get live location for a specific user */
    getLiveLocation: abacProcedure("geolocation", "read").input(
      z.object({ employeeId: z.string() })
    ).query(async ({ ctx, input }) => {
      const record = await prisma.locationRecord.findFirst({
        where: { employeeId: input.employeeId },
        orderBy: { timestamp: "desc" },
        include: { employee: { select: { name: true } } },
      });

      if (!record) return null;

      return {
        userId: record.employeeId,
        userName: record.employee?.name ?? "Unknown",
        latitude: record.latitude,
        longitude: record.longitude,
        accuracy: record.accuracy,
        batteryLevel: record.batteryLevel,
        timestamp: record.timestamp,
        isMoving: false, // Would need velocity calculation
      };
    }),

    /** Get online status for multiple users */
    getOnlineStatus: abacProcedure("geolocation", "read").input(
      z.object({ employeeIds: z.array(z.string()) })
    ).query(async ({ ctx, input }) => {
      const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);

      const records = await prisma.locationRecord.findMany({
        where: {
          employeeId: { in: input.employeeIds },
          timestamp: { gte: fiveMinAgo },
        },
        orderBy: { timestamp: "desc" },
        distinct: ["employeeId"],
      });

      const onlineMap = new Map((records as any[]).map((r: any) => [r.employeeId, true]));
      return input.employeeIds.map((id) => ({
        employeeId: id,
        isOnline: onlineMap.has(id),
      }));
    }),
  }),

  // ── Settings ──────────────────────────────────────────────────────────
  settings: router({
    /** Get location settings for current user */
    getMy: abacProcedure("geolocation", "read").query(async ({ ctx }) => {
      const employeeId = ctx.session?.employeeId;
      if (!employeeId) return null;

      return prisma.workerLocationSettings.findUnique({
        where: { employeeId },
      });
    }),

    /** Update location settings */
    update: abacProcedure("geolocation", "write").input(
      z.object({
        trackingEnabled: z.boolean().optional(),
        consentGiven: z.boolean().optional(),
        updateFrequency: z.number().int().min(1).max(60).optional(),
        privacyLevel: z.enum(["standard", "high", "maximum"]).optional(),
        emergencyContactsEnabled: z.boolean().optional(),
      })
    ).mutation(async ({ ctx, input }) => {
      const employeeId = ctx.session?.employeeId;
      if (!employeeId) throw new TRPCError({ code: "BAD_REQUEST", message: "No employee session" });

      return prisma.workerLocationSettings.upsert({
        where: { employeeId },
        create: { employeeId, ...input, consentDate: input.consentGiven ? new Date() : undefined },
        update: { ...input, consentDate: input.consentGiven ? new Date() : undefined },
      });
    }),
  }),

  // ── Emergency ─────────────────────────────────────────────────────────
  emergency: router({
    /** Trigger an emergency alert */
    trigger: abacProcedure("geolocation", "write").input(emergencyCreateSchema).mutation(async ({ ctx, input }) => {
      const employeeId = ctx.session?.employeeId;
      if (!employeeId) throw new TRPCError({ code: "BAD_REQUEST", message: "No employee session" });

      return prisma.emergencyAlert.create({
        data: {
          employeeId,
          type: input.type,
          status: "active",
          message: input.message,
          location: input.location,
        },
      });
    }),

    /** Get emergency alerts */
    getAll: abacProcedure("geolocation", "read").input(
      z.object({ status: z.string().optional(), limit: z.number().int().default(50) }).optional()
    ).query(async ({ ctx, input }) => {
      const where: any = {};
      if (input?.status) where.status = input.status;
      if (ctx.userRole !== "ADMIN" && ctx.session?.employeeId) {
        where.employeeId = ctx.session.employeeId;
      }

      return prisma.emergencyAlert.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: input?.limit ?? 50,
        include: { employee: { select: { name: true } } },
      });
    }),

    /** Acknowledge an emergency alert */
    acknowledge: abacProcedure("geolocation", "write").input(
      z.object({ id: z.string() })
    ).mutation(async ({ ctx, input }) => {
      const alert = await prisma.emergencyAlert.findUnique({ where: { id: input.id } });
      if (!alert) throw new TRPCError({ code: "NOT_FOUND", message: "Emergency alert not found" });

      return prisma.emergencyAlert.update({
        where: { id: input.id },
        data: { status: "acknowledged", responderId: ctx.userId },
      });
    }),
  }),

  // ── Analytics ─────────────────────────────────────────────────────────
  analytics: router({
    /** Get location statistics for dashboard */
    getStats: abacProcedure("geolocation", "read").query(async ({ ctx }) => {
      const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);

      const [activeTrackers, recentAlerts, totalGeofences, onlineUsers] = await Promise.all([
        prisma.locationRecord.count({
          where: { timestamp: { gte: fiveMinAgo } },
        }),
        prisma.locationAlert.count({
          where: { isResolved: false },
        }),
        prisma.geofence.count({
          where: { tenantId: ctx.tenantId, isActive: true },
        }),
        prisma.locationRecord.findMany({
          where: { timestamp: { gte: fiveMinAgo } },
          distinct: ["employeeId"],
          select: { employeeId: true },
        }),
      ]);

      // Get unique online employee count
      const uniqueOnlineUsers = new Set((onlineUsers as any[]).map((r: any) => r.employeeId)).size;

      return {
        activeTrackers: uniqueOnlineUsers,
        totalLocationUpdates: activeTrackers,
        pendingAlerts: recentAlerts,
        activeGeofences: totalGeofences,
        timestamp: new Date().toISOString(),
      };
    }),
  }),
});

// ─── Helper: Check geofence violations ─────────────────────────────────────

async function checkGeofenceViolations(employeeId: string, latitude: number, longitude: number) {
  try {
    const activeGeofences = await prisma.geofence.findMany({
      where: { isActive: true },
    });

    for (const geofence of activeGeofences) {
      const coords = geofence.coordinates as Array<[number, number]>;
      const inside = pointInPolygon([longitude, latitude], coords);

      // If worker is outside a geofence that alerts on exit, or inside one that alerts on entry
      if ((!inside && geofence.alertOnExit) || (inside && geofence.alertOnEntry)) {
        await prisma.locationAlert.create({
          data: {
            employeeId,
            type: !inside ? "UNAUTHORIZED_EXIT" : "RESTRICTED_ENTRY",
            severity: "MEDIUM",
            message: !inside
              ? `Worker exited geofence: ${geofence.name}`
              : `Worker entered restricted zone: ${geofence.name}`,
            location: { latitude, longitude },
            geofenceId: geofence.id,
          },
        });
      }
    }
  } catch (error) {
    console.error("Geofence check error:", error);
  }
}

/** Ray-casting point-in-polygon check */
function pointInPolygon(point: [number, number], polygon: Array<[number, number]>): boolean {
  const [x, y] = point;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}
