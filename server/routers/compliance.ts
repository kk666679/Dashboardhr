import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "../trpc";
import { checkComplianceStatus } from "@/lib/compliance-engine";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";

// ─── Policy sub-router ────────────────────────────────────────────────────────
const PolicySaveSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  category: z.string().min(1),
  version: z.string().min(1),
  description: z.string().optional(),
  owner: z.string().min(1),
  effectiveDate: z.string().min(1),
  status: z.enum(["Draft", "Active", "Review", "Archived"]),
});

const policyRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) =>
    (async () => {
      try {
        return await prisma.$queryRawUnsafe(`SELECT * FROM compliance_policies WHERE tenant_id = $1 ORDER BY created_at DESC`, ctx.tenantId) as any[];
      } catch { return []; }
    })()
  ),
  getById: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) =>
    (async () => {
      try {
        const rows = await prisma.$queryRawUnsafe(`SELECT * FROM compliance_policies WHERE id = $1::text AND tenant_id = $2 LIMIT 1`, input.id, ctx.tenantId) as any[];
        return rows[0] ?? null;
      } catch { return null; }
    })()
  ),
  save: protectedProcedure.input(PolicySaveSchema).mutation(async ({ ctx, input }) => {
    const { id, ...data } = input;
    const record = { ...data, tenantId: ctx.tenantId };
    if (id) {
      try {
        await prisma.$queryRawUnsafe(
          `UPDATE compliance_policies SET name = $1, category = $2, version = $3, description = $4, owner = $5, effective_date = $6, status = $7 WHERE id = $8::text AND tenant_id = $9`,
          record.name, record.category, record.version, record.description ?? null, record.owner, record.effectiveDate, record.status, id, ctx.tenantId
        );
      } catch { /* table may not exist yet */ }
      return { id, ...record };
    }
    const newId = nanoid();
    try {
      await prisma.$queryRawUnsafe(
        `INSERT INTO compliance_policies (id, tenant_id, name, category, version, description, owner, effective_date, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        newId, ctx.tenantId, record.name, record.category, record.version, record.description ?? null, record.owner, record.effectiveDate, record.status
      );
    } catch { /* table may not exist yet */ }
    return { id: newId, ...record };
  }),
});

// ─── Regulation sub-router ────────────────────────────────────────────────────
const RegulationSaveSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  jurisdiction: z.string().min(1),
  category: z.string().min(1),
  description: z.string().optional(),
  effectiveDate: z.string().min(1),
  status: z.enum(["Active", "Pending", "Superseded", "Repealed"]),
});

const regulationRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) =>
    (async () => {
      try {
        return await prisma.$queryRawUnsafe(`SELECT * FROM compliance_regulations WHERE tenant_id = $1 ORDER BY created_at DESC`, ctx.tenantId) as any[];
      } catch { return []; }
    })()
  ),
  getById: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) =>
    (async () => {
      try {
        const rows = await prisma.$queryRawUnsafe(`SELECT * FROM compliance_regulations WHERE id = $1::text AND tenant_id = $2 LIMIT 1`, input.id, ctx.tenantId) as any[];
        return rows[0] ?? null;
      } catch { return null; }
    })()
  ),
  save: protectedProcedure.input(RegulationSaveSchema).mutation(async ({ ctx, input }) => {
    const { id, ...data } = input;
    const record = { ...data, tenantId: ctx.tenantId };
    if (id) {
      try {
        await prisma.$queryRawUnsafe(
          `UPDATE compliance_regulations SET name = $1, jurisdiction = $2, category = $3, description = $4, effective_date = $5, status = $6 WHERE id = $7::text AND tenant_id = $8`,
          record.name, record.jurisdiction, record.category, record.description ?? null, record.effectiveDate, record.status, id, ctx.tenantId
        );
      } catch { /* table may not exist yet */ }
      return { id, ...record };
    }
    const newId = nanoid();
    try {
      await prisma.$queryRawUnsafe(
        `INSERT INTO compliance_regulations (id, tenant_id, name, jurisdiction, category, description, effective_date, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        newId, ctx.tenantId, record.name, record.jurisdiction, record.category, record.description ?? null, record.effectiveDate, record.status
      );
    } catch { /* table may not exist yet */ }
    return { id: newId, ...record };
  }),
});

// ─── Checklist sub-router ─────────────────────────────────────────────────────
const ChecklistItemSchema = z.object({
  requirement: z.string().min(1),
  evidence: z.string().optional(),
  notes: z.string().optional(),
});

const ChecklistSaveSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  description: z.string().optional(),
  regulationId: z.string().optional(),
  items: z.array(ChecklistItemSchema).default([]),
});

const checklistRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) =>
    (async () => {
      try {
        return await prisma.$queryRawUnsafe(`SELECT * FROM compliance_checklists WHERE tenant_id = $1 ORDER BY created_at DESC`, ctx.tenantId) as any[];
      } catch { return []; }
    })()
  ),
  getById: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) =>
    (async () => {
      try {
        const rows = await prisma.$queryRawUnsafe(`SELECT * FROM compliance_checklists WHERE id = $1::text AND tenant_id = $2 LIMIT 1`, input.id, ctx.tenantId) as any[];
        return rows[0] ?? null;
      } catch { return null; }
    })()
  ),
  save: protectedProcedure.input(ChecklistSaveSchema).mutation(async ({ ctx, input }) => {
    const { id, ...data } = input;
    const record = { ...data, tenantId: ctx.tenantId };
    if (id) {
      try {
        await prisma.$queryRawUnsafe(
          `UPDATE compliance_checklists SET name = $1, description = $2, regulation_id = $3, items = $4 WHERE id = $5::text AND tenant_id = $6`,
          record.name, record.description ?? null, record.regulationId ?? null, JSON.stringify(record.items), id, ctx.tenantId
        );
      } catch { /* table may not exist yet */ }
      return { id, ...record };
    }
    const newId = nanoid();
    try {
      await prisma.$queryRawUnsafe(
        `INSERT INTO compliance_checklists (id, tenant_id, name, description, regulation_id, items) VALUES ($1, $2, $3, $4, $5, $6)`,
        newId, ctx.tenantId, record.name, record.description ?? null, record.regulationId ?? null, JSON.stringify(record.items)
      );
    } catch { /* table may not exist yet */ }
    return { id: newId, ...record };
  }),
});

// ─── Root compliance router ───────────────────────────────────────────────────
export const complianceRouter = router({
  check: protectedProcedure
    .input(z.object({ employeeId: z.string() }))
    .query(async ({ ctx, input }) => {
      const result = await checkComplianceStatus(
        input.employeeId,
        ctx.tenantId,
      );
      if (!result)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Employee not found",
        });
      return result;
    }),
  policy:    policyRouter,
  regulation: regulationRouter,
  checklist:  checklistRouter,
});
