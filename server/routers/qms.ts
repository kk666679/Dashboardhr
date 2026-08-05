/**
 * QMS (Quality Management System) tRPC router.
 * Covers: Audit, CAPA, Document, Non-Conformance, Training Record.
 * Used by components/features/automation/QMS/*.
 */
import { z } from "zod";
import { router, protectedProcedure } from "@/server/trpc";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";

// ─── Audit ────────────────────────────────────────────────────────────────────
const AuditSaveSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  type: z.enum(["Internal", "External", "Supplier", "Regulatory"]),
  scope: z.string().min(1),
  auditor: z.string().min(1),
  scheduled: z.string().min(1),
  status: z.enum(["Scheduled", "In Progress", "Completed", "Overdue"]),
  description: z.string().optional(),
});

const auditRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return (prisma as any).qmsAudit?.findMany({ where: { tenantId: ctx.tenantId } }) ?? [];
  }),
  getById: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    return (prisma as any).qmsAudit?.findFirst({ where: { id: input.id, tenantId: ctx.tenantId } }) ?? null;
  }),
  save: protectedProcedure.input(AuditSaveSchema).mutation(async ({ ctx, input }) => {
    const { id, ...data } = input;
    const record = { ...data, tenantId: ctx.tenantId };
    if (id) {
      return (prisma as any).qmsAudit?.update({ where: { id }, data: record }) ?? { id, ...record };
    }
    return (prisma as any).qmsAudit?.create({ data: { id: nanoid(), ...record } }) ?? { id: nanoid(), ...record };
  }),
});

// ─── CAPA ─────────────────────────────────────────────────────────────────────
const CapaSaveSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  type: z.enum(["Corrective", "Preventive"]),
  source: z.string().min(1),
  description: z.string().min(1),
  actionPlan: z.string().optional(),
  owner: z.string().min(1),
  dueDate: z.string().min(1),
  priority: z.enum(["Low", "Medium", "High", "Critical"]),
  status: z.enum(["Open", "In Progress", "Review", "Closed", "Rejected"]),
});

const capaRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return (prisma as any).qmsCapa?.findMany({ where: { tenantId: ctx.tenantId } }) ?? [];
  }),
  getById: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    return (prisma as any).qmsCapa?.findFirst({ where: { id: input.id, tenantId: ctx.tenantId } }) ?? null;
  }),
  save: protectedProcedure.input(CapaSaveSchema).mutation(async ({ ctx, input }) => {
    const { id, ...data } = input;
    const record = { ...data, tenantId: ctx.tenantId };
    if (id) {
      return (prisma as any).qmsCapa?.update({ where: { id }, data: record }) ?? { id, ...record };
    }
    return (prisma as any).qmsCapa?.create({ data: { id: nanoid(), ...record } }) ?? { id: nanoid(), ...record };
  }),
});

// ─── Document ─────────────────────────────────────────────────────────────────
const DocumentSaveSchema = z.object({
  id: z.string().optional(),
  code: z.string().min(1),
  title: z.string().min(1),
  version: z.string().min(1),
  status: z.enum(["Draft", "Review", "Approved", "Archived", "Obsolete"]),
  category: z.string().min(1),
  owner: z.string().min(1),
  description: z.string().optional(),
  keywords: z.string().optional(),
});

const qmsDocumentRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return (prisma as any).qmsDocument?.findMany({ where: { tenantId: ctx.tenantId } }) ?? [];
  }),
  getById: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    return (prisma as any).qmsDocument?.findFirst({ where: { id: input.id, tenantId: ctx.tenantId } }) ?? null;
  }),
  save: protectedProcedure.input(DocumentSaveSchema).mutation(async ({ ctx, input }) => {
    const { id, ...data } = input;
    const record = { ...data, tenantId: ctx.tenantId };
    if (id) {
      return (prisma as any).qmsDocument?.update({ where: { id }, data: record }) ?? { id, ...record };
    }
    return (prisma as any).qmsDocument?.create({ data: { id: nanoid(), ...record } }) ?? { id: nanoid(), ...record };
  }),
});

// ─── Non-Conformance ──────────────────────────────────────────────────────────
const NCSaveSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  type: z.enum(["Minor", "Major", "Critical", "Observation"]),
  source: z.string().min(1),
  description: z.string().min(1),
  detectedBy: z.string().min(1),
  detectedDate: z.string().min(1),
  area: z.string().min(1),
  status: z.enum(["Open", "Under Review", "Resolved", "Closed"]),
  severity: z.enum(["Low", "Medium", "High", "Critical"]),
});

const nonConformanceRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return (prisma as any).qmsNonConformance?.findMany({ where: { tenantId: ctx.tenantId } }) ?? [];
  }),
  getById: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    return (prisma as any).qmsNonConformance?.findFirst({ where: { id: input.id, tenantId: ctx.tenantId } }) ?? null;
  }),
  save: protectedProcedure.input(NCSaveSchema).mutation(async ({ ctx, input }) => {
    const { id, ...data } = input;
    const record = { ...data, tenantId: ctx.tenantId };
    if (id) {
      return (prisma as any).qmsNonConformance?.update({ where: { id }, data: record }) ?? { id, ...record };
    }
    return (prisma as any).qmsNonConformance?.create({ data: { id: nanoid(), ...record } }) ?? { id: nanoid(), ...record };
  }),
});

// ─── Training Record ──────────────────────────────────────────────────────────
const TrainingSaveSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  type: z.enum(["Internal", "External", "Online", "On-the-Job"]),
  trainer: z.string().min(1),
  trainees: z.array(z.string()).default([]),
  scheduledDate: z.string().min(1),
  duration: z.number().min(0),
  status: z.enum(["Planned", "In Progress", "Completed", "Cancelled"]),
  description: z.string().optional(),
});

const trainingRecordRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return (prisma as any).qmsTrainingRecord?.findMany({ where: { tenantId: ctx.tenantId } }) ?? [];
  }),
  getById: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    return (prisma as any).qmsTrainingRecord?.findFirst({ where: { id: input.id, tenantId: ctx.tenantId } }) ?? null;
  }),
  save: protectedProcedure.input(TrainingSaveSchema).mutation(async ({ ctx, input }) => {
    const { id, ...data } = input;
    const record = { ...data, tenantId: ctx.tenantId };
    if (id) {
      return (prisma as any).qmsTrainingRecord?.update({ where: { id }, data: record }) ?? { id, ...record };
    }
    return (prisma as any).qmsTrainingRecord?.create({ data: { id: nanoid(), ...record } }) ?? { id: nanoid(), ...record };
  }),
});

// ─── Root QMS router ──────────────────────────────────────────────────────────
export const qmsRouter = router({
  audit:           auditRouter,
  capa:            capaRouter,
  document:        qmsDocumentRouter,
  nonConformance:  nonConformanceRouter,
  trainingRecord:  trainingRecordRouter,
});
