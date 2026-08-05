/**
 * Employee Relations (ER) tRPC Router
 * Handles complaints, grievances, disciplinary cases, and investigations.
 */
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { guardedProcedure, router } from "../trpc";
import { prisma } from "@/lib/prisma";

const CaseStatusSchema = z.enum(["OPEN", "UNDER_REVIEW", "RESOLVED", "CLOSED", "ESCALATED"]);
const SeveritySchema   = z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]);

export const employeeRelationsRouter = router({
  // ─── Generic case list ────────────────────────────────────────────────────
  listCases: guardedProcedure
    .input(z.object({
      type:       z.string().optional(),
      status:     CaseStatusSchema.optional(),
      employeeId: z.string().optional(),
    }).optional())
    .query(async ({ ctx, input }) => {
      return (prisma as any).erCase.findMany({
        where: {
          tenantId: ctx.tenantId,
          ...(input?.type       ? { type:     input.type }       : {}),
          ...(input?.status     ? { status:   input.status }     : {}),
          ...(input?.employeeId ? { subjectId: input.employeeId } : {}),
        },
        orderBy: { createdAt: "desc" },
      });
    }),

  getCase: guardedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const c = await (prisma as any).erCase.findFirst({
        where:   { id: input.id, tenantId: ctx.tenantId },
        include: { actions: true },
      });
      if (!c) throw new TRPCError({ code: "NOT_FOUND" });
      return c;
    }),

  // ─── Complaint ────────────────────────────────────────────────────────────
  createComplaint: guardedProcedure
    .input(z.object({
      subjectId:   z.string(),
      complainant: z.string().optional(),
      description: z.string().min(1),
      severity:    SeveritySchema.default("LOW"),
      anonymous:   z.boolean().default(false),
    }))
    .mutation(async ({ ctx, input }) => {
      return (prisma as any).erCase.create({
        data: { tenantId: ctx.tenantId, type: "COMPLAINT", status: "OPEN", ...input, reportedById: ctx.userId },
      });
    }),

  // ─── Grievance ────────────────────────────────────────────────────────────
  createGrievance: guardedProcedure
    .input(z.object({
      subjectId:   z.string(),
      description: z.string().min(1),
      category:    z.string().default("GENERAL"),
    }))
    .mutation(async ({ ctx, input }) => {
      return (prisma as any).erCase.create({
        data: { tenantId: ctx.tenantId, type: "GRIEVANCE", status: "OPEN", ...input, reportedById: ctx.userId },
      });
    }),

  // ─── Disciplinary ─────────────────────────────────────────────────────────
  createDisciplinary: guardedProcedure
    .input(z.object({
      subjectId:   z.string(),
      description: z.string().min(1),
      severity:    SeveritySchema.default("MEDIUM"),
      action:      z.string().default("VERBAL_WARNING"),
    }))
    .mutation(async ({ ctx, input }) => {
      return (prisma as any).erCase.create({
        data: { tenantId: ctx.tenantId, type: "DISCIPLINARY", status: "OPEN", ...input, reportedById: ctx.userId },
      });
    }),

  // ─── Investigation ────────────────────────────────────────────────────────
  createInvestigation: guardedProcedure
    .input(z.object({
      caseId:      z.string(),
      leadId:      z.string().optional(),
      description: z.string().min(1),
      dueDate:     z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const c = await (prisma as any).erCase.findFirst({ where: { id: input.caseId, tenantId: ctx.tenantId } });
      if (!c) throw new TRPCError({ code: "NOT_FOUND" });
      return (prisma as any).erInvestigation.create({
        data: {
          tenantId:    ctx.tenantId,
          caseId:      input.caseId,
          leadId:      input.leadId ?? ctx.userId,
          description: input.description,
          dueDate:     input.dueDate ? new Date(input.dueDate) : null,
          status:      "OPEN",
        },
      });
    }),

  updateStatus: guardedProcedure
    .input(z.object({ id: z.string(), status: CaseStatusSchema, resolution: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      await (prisma as any).erCase.updateMany({
        where: { id: input.id, tenantId: ctx.tenantId },
        data:  { status: input.status, resolution: input.resolution, resolvedAt: input.status === "RESOLVED" ? new Date() : undefined },
      });
      return { ok: true };
    }),
});
