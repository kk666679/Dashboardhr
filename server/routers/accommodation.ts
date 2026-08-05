/**
 * Accommodation Digital Twin Safety & Well-being Router
 */

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, guardedProcedure } from "../trpc";
import { prisma } from "@/lib/prisma";
import { writeAuditEntry } from "@/lib/shared-kernel/audit/audit-middleware";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { dispatchNotification } from "@/lib/notification-dispatch";
import { scoreAccommodationTwin } from "@/services/accommodation/scoring";

const SensorTypeSchema = z.enum([
  "OCCUPANCY",
  "AIR_QUALITY",
  "TEMPERATURE",
  "HUMIDITY",
  "FIRE_SAFETY",
  "ACCESS_CONTROL",
  "EMERGENCY_EGRESS",
]);

const IngestReadingInputSchema = z.object({
  externalSensorId: z.string().min(1),
  sensorType: SensorTypeSchema,
  value: z.number(),
  unit: z.string().optional(),
  sourceAt: z.coerce.date().optional(),
  metadata: z.any().optional(),
});
const BulkIngestReadingsInputSchema = z.object({ readings: z.array(IngestReadingInputSchema).min(1) });
const ReportSafetyIssueInputSchema = z.object({
  twinId: z.string(), type: z.string().min(1), severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  message: z.string().min(10), occurredAt: z.coerce.date().optional(), metadata: z.any().optional(),
});
const UpdateTwinInputSchema = z.object({ twinId: z.string(), name: z.string().min(1).optional(), capacity: z.number().int().positive().optional(), status: z.string().optional(), address: z.string().optional(), metadata: z.any().optional() });
const ResolveIncidentInputSchema = z.object({ incidentId: z.string(), resolution: z.string().min(1), metadata: z.any().optional() });
const GetTwinMetricsInputSchema = z.object({ twinId: z.string(), startDate: z.coerce.date(), endDate: z.coerce.date() });
const AssignSensorToTwinInputSchema = z.object({ twinId: z.string(), sensorId: z.string() });

export const accommodationRouter = router({
  listTwinsSummary: guardedProcedure
    .input(
      z
        .object({
          take: z.number().int().min(1).max(200).default(20),
          skip: z.number().int().min(0).default(0),
          riskLevel: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const take = input?.take ?? 20;
      const skip = input?.skip ?? 0;

      const where: any = { tenantId: ctx.tenantId };
      if (input?.riskLevel) where.riskLevel = input.riskLevel;

      const twins = await (prisma as any).accommodationTwin.findMany({
        where,
        orderBy: [{ riskLevel: "desc" }, { lastScoredAt: "desc" }],
        take,
        skip,
        select: {
          id: true,
          name: true,
          type: true,
          address: true,
          capacity: true,
          status: true,
          baselineSafetyScore: true,
          safetyScore: true,
          wellbeingScore: true,
          riskLevel: true,
          lastScoredAt: true,
          nextInspectionDue: true,
          lastInspectionDate: true,
        },
      });

      const twinIds = twins.map((t: any) => t.id);
      if (twinIds.length === 0) return [];

      const latestReadings = await (prisma as any).accommodationSensorReading.findMany({
        where: { tenantId: ctx.tenantId, twinId: { in: twinIds } },
        orderBy: { sourceAt: "desc" },
        take: 200,
      });

      const openIncidents = await (prisma as any).accommodationSafetyIncident.groupBy({
        by: ["twinId"],
        where: { tenantId: ctx.tenantId, status: "OPEN", twinId: { in: twinIds } },
        _count: { _all: true },
      });

      const openIncidentCountByTwin = new Map<string, number>();
      for (const row of openIncidents) openIncidentCountByTwin.set(row.twinId, row._count._all);

      return twins.map((t: any) => {
        const readingsForTwin = latestReadings.filter((r: any) => r.twinId === t.id);
        const latestOccupancy = readingsForTwin
          .filter((r: any) => r.type === "OCCUPANCY")
          .sort((a: any, b: any) => +b.sourceAt - +a.sourceAt)[0];

        const occupancyValue = typeof latestOccupancy?.value === "number" ? latestOccupancy.value : null;
        const currentOccupancy =
          occupancyValue === null ? null : Math.max(0, Math.min(t.capacity, Math.round(occupancyValue)));

        return {
          ...t,
          openIncidents: openIncidentCountByTwin.get(t.id) ?? 0,
          latestReadingAt: readingsForTwin[0]?.sourceAt ?? null,
          currentOccupancy,
        };
      });
    }),

  getTwinDetail: guardedProcedure
    .input(z.object({ twinId: z.string() }))
    .query(async ({ ctx, input }) => {
      const twin = await (prisma as any).accommodationTwin.findFirst({
        where: { id: input.twinId, tenantId: ctx.tenantId },
      });
      if (!twin) throw new TRPCError({ code: "NOT_FOUND", message: "Accommodation twin not found" });

      const sensors = await (prisma as any).accommodationSensor.findMany({
        where: { tenantId: ctx.tenantId, twinId: input.twinId },
        select: { id: true, name: true, type: true, isActive: true, metadata: true },
      });

      const readings = await (prisma as any).accommodationSensorReading.findMany({
        where: { tenantId: ctx.tenantId, twinId: input.twinId },
        orderBy: { sourceAt: "desc" },
        take: 30,
      });

      const incidents = await (prisma as any).accommodationSafetyIncident.findMany({
        where: { tenantId: ctx.tenantId, twinId: input.twinId },
        orderBy: { occurredAt: "desc" },
        take: 20,
      });

      const computed = scoreAccommodationTwin({
        baselineSafetyScore: twin.baselineSafetyScore,
        latestReadings: readings.map((r: any) => ({ type: r.type, value: r.value })),
        openIncidents: incidents.filter((i: any) => i.status === "OPEN").map((i: any) => ({ severity: i.severity })),
        now: new Date(),
      });

      return { twin, sensors, readings, incidents, computed };
    }),

  ingestReading: guardedProcedure
    .input(
      z.object({
        externalSensorId: z.string().min(1),
        sensorType: SensorTypeSchema,
        value: z.number(),
        unit: z.string().optional(),
        sourceAt: z.coerce.date().optional(),
        metadata: z.any().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const sensor = await (prisma as any).accommodationSensor.findFirst({
        where: { tenantId: ctx.tenantId, externalId: input.externalSensorId },
      });
      if (!sensor) throw new TRPCError({ code: "BAD_REQUEST", message: "Unknown sensor externalId" });

      const twinId = sensor.twinId as string;

      const created = await (prisma as any).accommodationSensorReading.create({
        data: {
          tenantId: ctx.tenantId,
          sensorId: sensor.id,
          twinId,
          type: input.sensorType,
          value: input.value,
          unit: input.unit ?? null,
          sourceAt: input.sourceAt ?? new Date(),
          metadata: input.metadata ?? null,
        },
      });

      const twin = await (prisma as any).accommodationTwin.findFirst({ where: { id: twinId, tenantId: ctx.tenantId } });
      if (!twin) throw new TRPCError({ code: "NOT_FOUND" });

      const latestReadings = await (prisma as any).accommodationSensorReading.findMany({
        where: { tenantId: ctx.tenantId, twinId },
        orderBy: { sourceAt: "desc" },
        take: 50,
      });

      const openIncidents = await (prisma as any).accommodationSafetyIncident.findMany({
        where: { tenantId: ctx.tenantId, twinId, status: "OPEN" },
      });

      const computed = scoreAccommodationTwin({
        baselineSafetyScore: twin.baselineSafetyScore,
        latestReadings: latestReadings.map((r: any) => ({ type: r.type, value: r.value })),
        openIncidents: openIncidents.map((i: any) => ({ severity: i.severity })),
        now: new Date(),
      });

      const updatedTwin = await (prisma as any).accommodationTwin.update({
        where: { id: twinId, tenantId: ctx.tenantId },
        data: {
          safetyScore: computed.safetyScore,
          wellbeingScore: computed.wellbeingScore,
          riskLevel: computed.riskLevel,
          lastScoredAt: new Date(),
        },
      });

      await writeAuditEntry({
        tenantId: ctx.tenantId,
        module: "accommodation_twin",
        entityType: "AccommodationSensorReading",
        entityId: created.id,
        action: "CREATE",
        actorId: ctx.userId,
        actorRole: ctx.userRole,
        newValue: { sensorType: input.sensorType, value: input.value, sourceAt: created.sourceAt },
      });

      return { created, updatedTwin, computed };
    }),

  /**
   * Bulk ingest multiple sensor readings
   */
  bulkIngestReadings: guardedProcedure
    .input(BulkIngestReadingsInputSchema)
    .mutation(async ({ ctx, input }) => {
      const results: Array<{ id: string; sensorId: string; twinId: string; type: string; value: number }> = [];
      const errors: Array<{ externalSensorId: string; error: string }> = [];
      const twinIds = new Set<string>();

      // Process readings in a transaction
      const result = await prisma.$transaction(async (tx: any) => {
        for (const reading of input.readings) {
          try {
            // Find sensor
            const sensor = await tx.accommodationSensor.findFirst({
              where: { 
                tenantId: ctx.tenantId, 
                externalId: reading.externalSensorId,
                isActive: true,
              },
            });

            if (!sensor || !sensor.twinId) {
              errors.push({
                externalSensorId: reading.externalSensorId,
                error: "Sensor not found or not assigned to twin",
              });
              continue;
            }

            // Validate value
            validateSensorValue(reading.sensorType, reading.value);

            const twinId = sensor.twinId;
            twinIds.add(twinId);

            // Create reading
            const created = await tx.accommodationSensorReading.create({
              data: {
                tenantId: ctx.tenantId,
                sensorId: sensor.id,
                twinId,
                type: reading.sensorType,
                value: reading.value,
                unit: reading.unit ?? null,
                sourceAt: reading.sourceAt ?? new Date(),
                metadata: reading.metadata ?? null,
              },
            });

            results.push({
              id: created.id,
              sensorId: sensor.id,
              twinId,
              type: reading.sensorType,
              value: reading.value,
            });

          } catch (error) {
            errors.push({
              externalSensorId: reading.externalSensorId,
              error: error instanceof Error ? error.message : "Unknown error",
            });
          }
        }

        // Update scores for all affected twins
        const updatedTwins = [];
        for (const twinId of twinIds) {
          const updated = await updateTwinScoresTx(tx, twinId, ctx.tenantId);
          if (updated) {
            updatedTwins.push({
              twinId: updated.id,
              safetyScore: updated.safetyScore,
              wellbeingScore: updated.wellbeingScore,
              riskLevel: updated.riskLevel,
            });
          }
        }

        return { results, errors, updatedTwins };
      });

      // Write audit entry
      await writeAuditEntry({
        tenantId: ctx.tenantId,
        module: "accommodation_twin",
        entityType: "AccommodationSensorReading",
        entityId: "bulk",
        action: "CREATE",
        actorId: ctx.userId,
        actorRole: ctx.userRole,
        newValue: { 
          count: results.length,
          errors: errors.length,
          twinIds: Array.from(twinIds),
        },
      });

      return {
        success: results.length > 0,
        created: results.length,
        failed: errors.length,
        results,
        errors: errors.length > 0 ? errors : undefined,
        updatedTwins: result.updatedTwins,
      };
    }),

  /**
   * Report a safety issue/incident
   */
  reportSafetyIssue: guardedProcedure
    .input(ReportSafetyIssueInputSchema)
    .mutation(async ({ ctx, input }) => {
      const twin = await prisma.accommodationTwin.findFirst({
        where: { id: input.twinId, tenantId: ctx.tenantId },
      });

      if (!twin) {
        throw new TRPCError({ 
          code: "NOT_FOUND", 
          message: "Accommodation twin not found" 
        });
      }

      // Check for duplicate open incidents
      const existingIncident = await prisma.accommodationSafetyIncident.findFirst({
        where: {
          tenantId: ctx.tenantId,
          twinId: input.twinId,
          type: input.type,
          status: { in: ["OPEN", "IN_PROGRESS"] },
          message: input.message,
          createdAt: {
            gte: new Date(Date.now() - 60 * 60 * 1000), // Within last hour
          },
        },
      });

      if (existingIncident) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Duplicate incident reported recently",
        });
      }

      // Create incident
      const incident = await prisma.accommodationSafetyIncident.create({
        data: {
          tenantId: ctx.tenantId,
          twinId: input.twinId,
          type: input.type,
          severity: input.severity,
          status: "OPEN",
          message: input.message,
          occurredAt: input.occurredAt ?? new Date(),
          metadata: input.metadata ?? null,
        },
      });

      // Update twin scores
      const updatedTwin = await updateTwinScores(input.twinId, ctx.tenantId);

      // Write audit entry
      await writeAuditEntry({
        tenantId: ctx.tenantId,
        module: "accommodation_twin",
        entityType: "AccommodationSafetyIncident",
        entityId: incident.id,
        action: "CREATE",
        actorId: ctx.userId,
        actorRole: ctx.userRole,
        newValue: { 
          type: input.type, 
          severity: input.severity, 
          message: input.message,
          occurredAt: incident.occurredAt,
        },
      });

      // Send notifications based on severity
      const notificationPriority = input.severity === "CRITICAL" ? "URGENT" : "HIGH";
      
      if (input.severity === "HIGH" || input.severity === "CRITICAL") {
        await dispatchNotification({
          tenantId: ctx.tenantId,
          recipientId: ctx.userId,
          eventType: "SAFETY_ALERT",
          subject: `${input.severity} Safety Issue: ${input.type}`,
          body: `${input.message.substring(0, 200)}${input.message.length > 200 ? '...' : ''}`,
        });

        // If CRITICAL, send to all admins
        if (input.severity === "CRITICAL") {
          // This would typically fetch all admin users and notify them
          // Implementation depends on your user management system
        }
      }

      return { 
        incident, 
        updatedTwin,
        computed: {
          safetyScore: updatedTwin.safetyScore,
          wellbeingScore: updatedTwin.wellbeingScore,
          riskLevel: updatedTwin.riskLevel,
        },
      };
    }),

  /**
   * Update twin metadata
   */
  updateTwin: guardedProcedure
    .input(UpdateTwinInputSchema)
    .mutation(async ({ ctx, input }) => {
      const twin = await prisma.accommodationTwin.findFirst({
        where: { id: input.twinId, tenantId: ctx.tenantId },
      });

      if (!twin) {
        throw new TRPCError({ 
          code: "NOT_FOUND", 
          message: "Accommodation twin not found" 
        });
      }

      const updated = await prisma.accommodationTwin.update({
        where: { id: input.twinId, tenantId: ctx.tenantId },
        data: {
          ...(input.name && { name: input.name }),
          ...(input.capacity && { capacity: input.capacity }),
          ...(input.status && { status: input.status }),
          ...(input.address && { address: input.address }),
          ...(input.metadata && { metadata: input.metadata }),
          updatedAt: new Date(),
        },
      });

      await writeAuditEntry({
        tenantId: ctx.tenantId,
        module: "accommodation_twin",
        entityType: "AccommodationTwin",
        entityId: updated.id,
        action: "UPDATE",
        actorId: ctx.userId,
        actorRole: ctx.userRole,
        newValue: {
          name: updated.name,
          capacity: updated.capacity,
          status: updated.status,
        },
      });

      return updated;
    }),

  /**
   * Resolve a safety incident
   */
  resolveSafetyIncident: guardedProcedure
    .input(ResolveIncidentInputSchema)
    .mutation(async ({ ctx, input }) => {
      const incident = await prisma.accommodationSafetyIncident.findFirst({
        where: { id: input.incidentId, tenantId: ctx.tenantId },
        include: {
          twin: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!incident) {
        throw new TRPCError({ 
          code: "NOT_FOUND", 
          message: "Safety incident not found" 
        });
      }

      if (incident.status === "RESOLVED" || incident.status === "DISMISSED") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Incident already resolved or dismissed",
        });
      }

      const updated = await prisma.accommodationSafetyIncident.update({
        where: { id: input.incidentId, tenantId: ctx.tenantId },
        data: {
          status: "RESOLVED",
          resolvedAt: new Date(),
          resolution: input.resolution,
          metadata: input.metadata ?? incident.metadata,
        },
      });

      // Update twin scores (should improve after resolution)
      const updatedTwin = await updateTwinScores(incident.twinId, ctx.tenantId);

      await writeAuditEntry({
        tenantId: ctx.tenantId,
        module: "accommodation_twin",
        entityType: "AccommodationSafetyIncident",
        entityId: updated.id,
        action: "UPDATE",
        actorId: ctx.userId,
        actorRole: ctx.userRole,
        newValue: { status: "RESOLVED", resolution: input.resolution },
      });

      await dispatchNotification({
        tenantId: ctx.tenantId,
        recipientId: ctx.userId,
        eventType: "INCIDENT_RESOLVED",
        subject: `Safety Issue Resolved: ${incident.type}`,
        body: `The safety issue has been resolved. ${input.resolution.substring(0, 100)}...`,
      });

      return { 
        incident: updated, 
        updatedTwin,
        computed: {
          safetyScore: updatedTwin.safetyScore,
          wellbeingScore: updatedTwin.wellbeingScore,
          riskLevel: updatedTwin.riskLevel,
        },
      };
    }),

  /**
   * Get twin metrics for a date range
   */
  getTwinMetrics: guardedProcedure
    .input(GetTwinMetricsInputSchema)
    .query(async ({ ctx, input }) => {
      const twin = await prisma.accommodationTwin.findFirst({
        where: { id: input.twinId, tenantId: ctx.tenantId },
      });

      if (!twin) {
        throw new TRPCError({ 
          code: "NOT_FOUND", 
          message: "Accommodation twin not found" 
        });
      }

      const { startDate, endDate } = input;

      // Get readings in time range
      const readings = await prisma.accommodationSensorReading.findMany({
        where: {
          tenantId: ctx.tenantId,
          twinId: input.twinId,
          sourceAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        orderBy: { sourceAt: 'asc' },
      });

      // Get incidents in time range
      const incidents = await prisma.accommodationSafetyIncident.findMany({
        where: {
          tenantId: ctx.tenantId,
          twinId: input.twinId,
          occurredAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        orderBy: { occurredAt: 'asc' },
      });

      // Group readings by type
      const readingsByType = (readings as any[]).reduce((acc: Record<string, Array<{ timestamp: Date; value: number }>>, reading: any) => {
        if (!acc[reading.type]) {
          acc[reading.type] = [];
        }
        acc[reading.type].push({
          timestamp: reading.sourceAt,
          value: reading.value,
        });
        return acc;
      }, {} as Record<string, Array<{ timestamp: Date; value: number }>>);

      // Calculate metrics for each type
      const metrics = (Object.entries(readingsByType) as [string, Array<{ timestamp: Date; value: number }>][]).map(([type, values]) => {
        const numericValues = values.map(v => v.value);
        return {
          type,
          count: values.length,
          average: numericValues.length > 0 
            ? numericValues.reduce((a, b) => a + b, 0) / numericValues.length 
            : null,
          min: numericValues.length > 0 ? Math.min(...numericValues) : null,
          max: numericValues.length > 0 ? Math.max(...numericValues) : null,
          dataPoints: values,
        };
      });

      // Incident statistics
      const incidentStats = {
        total: incidents.length,
        bySeverity: {
          CRITICAL: (incidents as any[]).filter((i: any) => i.severity === 'CRITICAL').length,
          HIGH: (incidents as any[]).filter((i: any) => i.severity === 'HIGH').length,
          MEDIUM: (incidents as any[]).filter((i: any) => i.severity === 'MEDIUM').length,
          LOW: (incidents as any[]).filter((i: any) => i.severity === 'LOW').length,
        },
        byStatus: {
          OPEN: (incidents as any[]).filter((i: any) => i.status === 'OPEN').length,
          IN_PROGRESS: (incidents as any[]).filter((i: any) => i.status === 'IN_PROGRESS').length,
          RESOLVED: (incidents as any[]).filter((i: any) => i.status === 'RESOLVED').length,
          DISMISSED: (incidents as any[]).filter((i: any) => i.status === 'DISMISSED').length,
        },
        averageResolutionTime: calculateAverageResolutionTime(incidents),
      };

      return {
        twinId: input.twinId,
        twinName: twin.name,
        dateRange: { startDate, endDate },
        metrics,
        incidentStats,
        totalReadings: readings.length,
      };
    }),

  /**
   * Assign sensor to twin
   */
  assignSensorToTwin: guardedProcedure
    .input(AssignSensorToTwinInputSchema)
    .mutation(async ({ ctx, input }) => {
      const twin = await prisma.accommodationTwin.findFirst({
        where: { id: input.twinId, tenantId: ctx.tenantId },
      });

      if (!twin) {
        throw new TRPCError({ 
          code: "NOT_FOUND", 
          message: "Twin not found" 
        });
      }

      const sensor = await prisma.accommodationSensor.findFirst({
        where: { 
          id: input.sensorId, 
          tenantId: ctx.tenantId,
          isActive: true,
        },
      });

      if (!sensor) {
        throw new TRPCError({ 
          code: "NOT_FOUND", 
          message: "Sensor not found or inactive" 
        });
      }

      if (sensor.twinId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Sensor already assigned to a twin",
        });
      }

      const updated = await prisma.accommodationSensor.update({
        where: { id: input.sensorId },
        data: { twinId: input.twinId },
      });

      await writeAuditEntry({
        tenantId: ctx.tenantId,
        module: "accommodation_twin",
        entityType: "AccommodationSensor",
        entityId: updated.id,
        action: "UPDATE",
        actorId: ctx.userId,
        actorRole: ctx.userRole,
        newValue: { twinId: input.twinId },
      });

      return updated;
    }),
});

// ============================================================
// Helper Functions
// ============================================================

/**
 * Update twin scores based on latest readings and open incidents
 */
async function updateTwinScores(twinId: string, tenantId: string) {
  return await prisma.$transaction(async (tx: any) => {
    return await updateTwinScoresTx(tx, twinId, tenantId);
  });
}

async function updateTwinScoresTx(
  tx: any, 
  twinId: string, 
  tenantId: string
) {
  const twin = await tx.accommodationTwin.findFirst({
    where: { id: twinId, tenantId },
  });

  if (!twin) return null;

  const [latestReadings, openIncidents] = await Promise.all([
    tx.accommodationSensorReading.findMany({
      where: { tenantId, twinId },
      orderBy: { sourceAt: 'desc' },
      take: 50,
    }),
    tx.accommodationSafetyIncident.findMany({
      where: { tenantId, twinId, status: 'OPEN' },
    }),
  ]);

  const computed = scoreAccommodationTwin({
    baselineSafetyScore: twin.baselineSafetyScore,
    latestReadings,
    openIncidents,
    now: new Date(),
  });

  return await tx.accommodationTwin.update({
    where: { id: twinId, tenantId },
    data: {
      safetyScore: computed.safetyScore,
      wellbeingScore: computed.wellbeingScore,
      riskLevel: computed.riskLevel,
      lastScoredAt: new Date(),
    },
  });
}

/**
 * Validate sensor value based on type
 */
function validateSensorValue(type: string, value: number): void {
  const validations: Record<string, { min: number; max: number; unit?: string }> = {
    TEMPERATURE: { min: -40, max: 100, unit: '°C' },
    HUMIDITY: { min: 0, max: 100, unit: '%' },
    OCCUPANCY: { min: 0, max: 10000, unit: 'people' },
    AIR_QUALITY: { min: 0, max: 500, unit: 'ppm' },
    FIRE_SAFETY: { min: 0, max: 1, unit: 'probability' },
    ACCESS_CONTROL: { min: 0, max: 1, unit: 'boolean' },
    EMERGENCY_EGRESS: { min: 0, max: 1, unit: 'boolean' },
  };

  const validation = validations[type];
  if (!validation) return; // Unknown type, skip validation

  const { min, max } = validation;
  if (value < min || value > max) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Invalid value for ${type}. Must be between ${min} and ${max}`,
    });
  }
}

/**
 * Calculate average resolution time for incidents
 */
function calculateAverageResolutionTime(incidents: any[]): number | null {
  const resolved = incidents.filter(i => i.status === 'RESOLVED' && i.resolvedAt);
  if (resolved.length === 0) return null;

  const totalTime = resolved.reduce((sum, incident) => {
    const resolutionTime = incident.resolvedAt.getTime() - incident.occurredAt.getTime();
    return sum + resolutionTime;
  }, 0);

  return totalTime / resolved.length;
}

// Export types for use in other modules
export type AccommodationRouter = typeof accommodationRouter;
