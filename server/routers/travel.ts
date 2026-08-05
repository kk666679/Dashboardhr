/**
 * Travel Management tRPC Router — Sprint 20
 *
 * Handles travel request lifecycle: submit → approve → complete/cancel.
 *
 * Requirements: 20.1–20.6
 */

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { guardedProcedure, router } from "../trpc";
import { prisma } from "@/lib/prisma";
import { writeAuditEntry } from "@/lib/shared-kernel/audit/audit-middleware";
import { dispatchNotification } from "@/lib/notification-dispatch";

// Escape HTML special characters to prevent XSS in notification bodies (CWE-79/80)
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

export const travelRouter = router({

  list: guardedProcedure
    .input(z.object({
      employeeId: z.string().optional(),
      status:     z.string().optional(),
      take:       z.number().int().min(1).max(200).default(50),
      skip:       z.number().int().min(0).default(0),
    }).optional())
    .query(async ({ ctx, input }) => {
      return (prisma as any).travelRequest.findMany({
        where: {
          tenantId: ctx.tenantId,
          ...(input?.employeeId ? { employeeId: input.employeeId } : {}),
          ...(input?.status     ? { status:     input.status     } : {}),
        },
        orderBy: { createdAt: "desc" },
        take: input?.take ?? 50,
        skip: input?.skip ?? 0,
      });
    }),

  getById: guardedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const req = await (prisma as any).travelRequest.findFirst({
        where: { id: input.id, tenantId: ctx.tenantId },
      });
      if (!req) throw new TRPCError({ code: "NOT_FOUND" });
      return req;
    }),

  submit: guardedProcedure
    .input(z.object({
      employeeId:    z.string().min(1),
      destination:   z.string().min(1),
      purpose:       z.string().min(1),
      departureDate: z.coerce.date(),
      returnDate:    z.coerce.date(),
      estimatedCost: z.number().min(0).default(0),
      currency:      z.string().default("MYR"),
    }))
    .mutation(async ({ ctx, input }) => {
      if (input.returnDate < input.departureDate) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Return date must be after departure date" });
      }

      const req = await (prisma as any).travelRequest.create({
        data: { ...input, tenantId: ctx.tenantId, status: "PENDING" },
      });

      await writeAuditEntry({
        tenantId:   ctx.tenantId,
        module:     "travel",
        entityType: "TravelRequest",
        entityId:   req.id,
        action:     "CREATE",
        actorId:    ctx.userId,
        actorRole:  ctx.userRole,
        newValue:   { destination: req.destination, departureDate: req.departureDate },
      });

      return req;
    }),

  approve: guardedProcedure
    .input(z.object({ id: z.string(), comment: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const req = await (prisma as any).travelRequest.findFirst({
        where: { id: input.id, tenantId: ctx.tenantId, status: "PENDING" },
      });
      if (!req) throw new TRPCError({ code: "NOT_FOUND" });

      const updated = await (prisma as any).travelRequest.update({
        where: { id: input.id },
        data:  { status: "APPROVED", approvedBy: ctx.userId, approvedAt: new Date() },
      });

      await dispatchNotification({
        tenantId:    ctx.tenantId,
        recipientId: req.employeeId,
        eventType:   "travel.approved",
        channel:     "IN_APP",
        subject:     "Travel request approved",
        body:        `Your travel request to ${escapeHtml(String(req.destination))} has been approved.`,
      });

      return updated;
    }),

  reject: guardedProcedure
    .input(z.object({ id: z.string(), reason: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const req = await (prisma as any).travelRequest.findFirst({
        where: { id: input.id, tenantId: ctx.tenantId, status: "PENDING" },
      });
      if (!req) throw new TRPCError({ code: "NOT_FOUND" });

      const updated = await (prisma as any).travelRequest.update({
        where: { id: input.id },
        data:  { status: "REJECTED", approvedBy: ctx.userId, approvedAt: new Date() },
      });

      await dispatchNotification({
        tenantId:    ctx.tenantId,
        recipientId: req.employeeId,
        eventType:   "travel.rejected",
        channel:     "IN_APP",
        subject:     "Travel request rejected",
        body:        `Your travel request to ${escapeHtml(String(req.destination))} was rejected: ${escapeHtml(input.reason)}`,
      });

      return updated;
    }),

  cancel: guardedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const req = await (prisma as any).travelRequest.findFirst({
        where: { id: input.id, tenantId: ctx.tenantId },
      });
      if (!req) throw new TRPCError({ code: "NOT_FOUND" });
      if (!["PENDING", "APPROVED"].includes(req.status)) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Cannot cancel a completed or already-cancelled request" });
      }

      return (prisma as any).travelRequest.update({
        where: { id: input.id },
        data:  { status: "CANCELLED" },
      });
    }),
});
