/**
 * Lifecycle Events tRPC Router — Sprint 5
 *
 * Tracks 13 employee lifecycle event types with versioned history,
 * backdated event support, and audit trail.
 *
 * Requirements: 5.1–5.9
 */

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { guardedProcedure, router } from "../trpc";
import { prisma } from "@/lib/prisma";
import { writeAuditEntry } from "@/lib/shared-kernel/audit/audit-middleware";
import { dispatchNotification } from "@/lib/notification-dispatch";

const LifecycleEventTypeSchema = z.enum([
  "HIRE",
  "PROBATION_START",
  "PROBATION_PASS",
  "PROBATION_FAIL",
  "PROMOTION",
  "DEMOTION",
  "TRANSFER",
  "CONFIRMATION",
  "SALARY_REVISION",
  "RESIGNATION",
  "TERMINATION",
  "RETIREMENT",
  "REHIRE",
]);

export const lifecycleRouter = router({
  list: guardedProcedure
    .input(
      z
        .object({
          employeeId: z.string().optional(),
          eventType: LifecycleEventTypeSchema.optional(),
          from: z.coerce.date().optional(),
          to: z.coerce.date().optional(),
          take: z.number().int().min(1).max(200).default(50),
          skip: z.number().int().min(0).default(0),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      return prisma.lifecycleEvent.findMany({
        where: {
          tenantId: ctx.tenantId,
          ...(input?.employeeId ? { employeeId: input.employeeId } : {}),
          ...(input?.eventType ? { eventType: input.eventType } : {}),
          ...(input?.from || input?.to
            ? {
                effectiveDate: {
                  ...(input?.from ? { gte: input.from } : {}),
                  ...(input?.to ? { lte: input.to } : {}),
                },
              }
            : {}),
        },
        orderBy: { effectiveDate: "desc" },
        take: input?.take ?? 50,
        skip: input?.skip ?? 0,
      });
    }),

  getByEmployee: guardedProcedure
    .input(z.object({ employeeId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      return prisma.lifecycleEvent.findMany({
        where: { tenantId: ctx.tenantId, employeeId: input.employeeId },
        orderBy: { effectiveDate: "desc" },
      });
    }),

  create: guardedProcedure
    .input(
      z.object({
        employeeId: z.string().min(1),
        eventType: LifecycleEventTypeSchema,
        effectiveDate: z.coerce.date(),
        previousData: z.record(z.string(), z.any()).optional(),
        newData: z.record(z.string(), z.any()).optional(),
        reason: z.string().optional(),
        authorisedBy: z.string().optional(),
        isBackdated: z.boolean().default(false),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Verify employee belongs to tenant
      const employee = await prisma.employee.findFirst({
        where: { id: input.employeeId, tenantId: ctx.tenantId },
        select: { id: true, name: true },
      });
      if (!employee)
        throw new TRPCError({ code: "NOT_FOUND", message: "Employee not found" });

      const event = await prisma.lifecycleEvent.create({
        data: {
          tenantId: ctx.tenantId,
          employeeId: input.employeeId,
          eventType: input.eventType,
          effectiveDate: input.effectiveDate,
          previousData: input.previousData as any,
          newData: input.newData as any,
          reason: input.reason,
          authorisedBy: input.authorisedBy ?? ctx.userId,
          isBackdated: input.isBackdated,
        },
      });

      // Apply side-effects for specific event types
      if (["PROBATION_PASS", "CONFIRMATION"].includes(input.eventType)) {
        await prisma.employeeProfile.upsert({
          where: { employeeId: input.employeeId },
          create: {
            employeeId: input.employeeId,
            employmentStatus: "ACTIVE",
            confirmationDate: input.effectiveDate,
          },
          update: { employmentStatus: "ACTIVE", confirmationDate: input.effectiveDate },
        });
      }
      if (input.eventType === "PROBATION_START") {
        await prisma.employeeProfile.upsert({
          where: { employeeId: input.employeeId },
          create: {
            employeeId: input.employeeId,
            employmentStatus: "PROBATION",
          },
          update: { employmentStatus: "PROBATION" },
        });
      }

      // Write audit entry (single argument)
      await writeAuditEntry({
        tenantId: ctx.tenantId,
        module: "lifecycle",
        entityType: "LifecycleEvent",
        entityId: event.id,
        action: "CREATE",
        actorId: ctx.userId,
        actorRole: ctx.userRole,
        newValue: {
          eventType: event.eventType,
          employeeId: event.employeeId,
          effectiveDate: event.effectiveDate,
        },
      });

      // Notify employee of probation outcome / confirmation
      if (
        ["PROBATION_PASS", "PROBATION_FAIL", "CONFIRMATION", "PROMOTION"].includes(
          input.eventType,
        )
      ) {
        await dispatchNotification({
          tenantId: ctx.tenantId,
          recipientId: input.employeeId,
          eventType: `lifecycle.${input.eventType.toLowerCase()}`,
          channel: "IN_APP",
          subject: `Your employment status has been updated: ${input.eventType.replace(/_/g, " ")}`,
          body: `Effective ${input.effectiveDate.toDateString()}: ${input.reason ?? input.eventType}`,
        });
      }

      return event;
    }),

  // Backdated event — same as create but flagged; requires senior role authorisation
  createBackdated: guardedProcedure
    .input(
      z.object({
        employeeId: z.string().min(1),
        eventType: LifecycleEventTypeSchema,
        effectiveDate: z.coerce.date(),
        newData: z.record(z.string(), z.any()).optional(),
        reason: z.string().min(1),
        authorisedBy: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const BACKDATED_ROLES = ["Super_Admin", "HR_Director", "HR_Manager", "ADMIN"];
      if (!BACKDATED_ROLES.includes(ctx.userRole)) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only HR Director/Manager can create backdated events",
        });
      }

      const event = await prisma.lifecycleEvent.create({
        data: {
          tenantId: ctx.tenantId,
          employeeId: input.employeeId,
          eventType: input.eventType,
          effectiveDate: input.effectiveDate,
          newData: input.newData as any,
          reason: input.reason,
          authorisedBy: input.authorisedBy,
          isBackdated: true,
        },
      });

      // Write audit entry for backdated event creation (single argument)
      await writeAuditEntry({
        tenantId: ctx.tenantId,
        module: "lifecycle",
        entityType: "LifecycleEvent",
        entityId: event.id,
        action: "CREATE_BACKDATED",
        actorId: ctx.userId,
        actorRole: ctx.userRole,
        newValue: {
          eventType: event.eventType,
          employeeId: event.employeeId,
          effectiveDate: event.effectiveDate,
          reason: input.reason,
          authorisedBy: input.authorisedBy,
        },
      });

      return event;
    }),
});