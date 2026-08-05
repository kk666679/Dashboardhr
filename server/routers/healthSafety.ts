/**
 * Health & Safety tRPC Router — Sprint 22
 *
 * Incident reporting, OSHA workflow triggers, medical checkup tracking.
 *
 * Requirements: 22.1–22.6
 */

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { guardedProcedure, router } from "../trpc";
import { prisma } from "@/lib/prisma";
import { writeAuditEntry } from "@/lib/shared-kernel/audit/audit-middleware";
import { dispatchNotification } from "@/lib/notification-dispatch";

const InjuryTypeSchema = z.enum(["MINOR", "MAJOR", "FATAL", "NEAR_MISS", "PROPERTY_DAMAGE"]);

export const healthSafetyRouter = router({

  // ── Incident Reports ──────────────────────────────────────────────────────────

  listIncidents: guardedProcedure
    .input(z.object({
      status:         z.string().optional(),
      oshaReportable: z.boolean().optional(),
      from:           z.coerce.date().optional(),
      take:           z.number().int().min(1).max(200).default(50),
      skip:           z.number().int().min(0).default(0),
    }).optional())
    .query(async ({ ctx, input }) => {
      return (prisma as any).incidentReport.findMany({
        where: {
          tenantId: ctx.tenantId,
          ...(input?.status         ? { status:         input.status         } : {}),
          ...(input?.oshaReportable !== undefined ? { oshaReportable: input.oshaReportable } : {}),
          ...(input?.from ? { incidentDate: { gte: input.from } } : {}),
        },
        orderBy: { incidentDate: "desc" },
        take: input?.take ?? 50,
        skip: input?.skip ?? 0,
      });
    }),

  getIncident: guardedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const incident = await (prisma as any).incidentReport.findFirst({
        where: { id: input.id, tenantId: ctx.tenantId },
      });
      if (!incident) throw new TRPCError({ code: "NOT_FOUND" });
      return incident;
    }),

  reportIncident: guardedProcedure
    .input(z.object({
      employeeId:     z.string().optional(),
      incidentDate:   z.coerce.date(),
      location:       z.string().min(1),
      description:    z.string().min(10),
      injuryType:     InjuryTypeSchema.optional(),
      oshaReportable: z.boolean().default(false),
    }))
    .mutation(async ({ ctx, input }) => {
      const incident = await (prisma as any).incidentReport.create({
        data: {
          ...input,
          tenantId:   ctx.tenantId,
          reportedBy: ctx.userId,
          status:     "OPEN",
        },
      });

      await writeAuditEntry({
        tenantId:   ctx.tenantId,
        module:     "health_safety",
        entityType: "IncidentReport",
        entityId:   incident.id,
        action:     "CREATE",
        actorId:    ctx.userId,
        actorRole:  ctx.userRole,
        newValue:   { incidentDate: incident.incidentDate, injuryType: incident.injuryType, oshaReportable: incident.oshaReportable },
      });

      // Notify HR manager for OSHA-reportable or FATAL incidents
      if (incident.oshaReportable || input.injuryType === "FATAL" || input.injuryType === "MAJOR") {
        await dispatchNotification({
          tenantId:    ctx.tenantId,
          recipientId: ctx.userId, // Notify reporter's manager; in prod resolve manager ID
          eventType:   "hs.incident.critical",
          channel:     "EMAIL",
          subject:     `[URGENT] Incident Report: ${input.injuryType ?? "Incident"} at ${input.location}`,
          body:        `A ${input.injuryType ?? "safety"} incident occurred on ${input.incidentDate.toDateString()} at ${input.location}. OSHA Reportable: ${input.oshaReportable}. Description: ${input.description}`,
        });
      }

      return incident;
    }),

  closeIncident: guardedProcedure
    .input(z.object({
      id:          z.string(),
      resolution:  z.string().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      const incident = await (prisma as any).incidentReport.findFirst({
        where: { id: input.id, tenantId: ctx.tenantId },
      });
      if (!incident) throw new TRPCError({ code: "NOT_FOUND" });

      return (prisma as any).incidentReport.update({
        where: { id: input.id },
        data: {
          status:   "CLOSED",
          closedAt: new Date(),
        },
      });
    }),

  updateStatus: guardedProcedure
    .input(z.object({
      id:     z.string(),
      status: z.enum(["OPEN", "INVESTIGATING", "CLOSED"]),
    }))
    .mutation(async ({ ctx, input }) => {
      const incident = await (prisma as any).incidentReport.findFirst({
        where: { id: input.id, tenantId: ctx.tenantId },
      });
      if (!incident) throw new TRPCError({ code: "NOT_FOUND" });

      return (prisma as any).incidentReport.update({
        where: { id: input.id },
        data: {
          status:   input.status,
          closedAt: input.status === "CLOSED" ? new Date() : undefined,
        },
      });
    }),

  // Summary stats for H&S dashboard
  getSummary: guardedProcedure
    .input(z.object({}).optional())
    .query(async ({ ctx }) => {
      const [open, investigating, closed, oshaReportable] = await Promise.all([
        (prisma as any).incidentReport.count({ where: { tenantId: ctx.tenantId, status: "OPEN" } }),
        (prisma as any).incidentReport.count({ where: { tenantId: ctx.tenantId, status: "INVESTIGATING" } }),
        (prisma as any).incidentReport.count({ where: { tenantId: ctx.tenantId, status: "CLOSED" } }),
        (prisma as any).incidentReport.count({ where: { tenantId: ctx.tenantId, oshaReportable: true } }),
      ]);
      return { open, investigating, closed, oshaReportable };
    }),
});
