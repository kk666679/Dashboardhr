/**
 * Notification Centre tRPC Router — Sprint 4 / Task 4.8
 *
 * Manages notification logs, templates, and preferences.
 * Channel delivery is handled by the BullMQ notification worker.
 *
 * Requirements: 25.1–25.6
 */

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { guardedProcedure, router } from "../trpc";
import { prisma } from "@/lib/prisma";
import { dispatchNotification } from "@/lib/notification-dispatch";

const ChannelSchema = z.enum(["EMAIL", "SMS", "PUSH", "TEAMS", "SLACK", "WHATSAPP", "IN_APP"]);

// ─── Raw SQL helpers for tables not yet in Prisma schema ──────────────────────

const NOTIF_LOG_TABLE = "notification_logs";
const NOTIF_TEMPLATE_TABLE = "notification_templates";

async function queryLogs(tenantId: string, filters: {
  recipientId?: string;
  status?: string;
  channel?: string;
  from?: Date;
  to?: Date;
  take?: number;
  skip?: number;
}) {
  try {
    let sql = `SELECT * FROM "${NOTIF_LOG_TABLE}" WHERE tenant_id = $1`;
    const params: any[] = [tenantId];
    let idx = 2;
    if (filters.recipientId) { sql += ` AND recipient_id = $${idx}`; params.push(filters.recipientId); idx++; }
    if (filters.status) { sql += ` AND status = $${idx}`; params.push(filters.status); idx++; }
    if (filters.channel) { sql += ` AND channel = $${idx}`; params.push(filters.channel); idx++; }
    if (filters.from) { sql += ` AND created_at >= $${idx}`; params.push(filters.from); idx++; }
    if (filters.to) { sql += ` AND created_at <= $${idx}`; params.push(filters.to); idx++; }
    sql += " ORDER BY created_at DESC";
    if (filters.take) sql += ` LIMIT ${filters.take}`;
    if (filters.skip) sql += ` OFFSET ${filters.skip}`;
    return await prisma.$queryRawUnsafe(sql, ...params) as any[];
  } catch { return []; }
}

async function queryFirstLog(tenantId: string, id: string) {
  try {
    const rows = await prisma.$queryRawUnsafe(`SELECT * FROM "${NOTIF_LOG_TABLE}" WHERE id = $1::text AND tenant_id = $2 LIMIT 1`, id, tenantId) as any[];
    return rows[0] ?? null;
  } catch { return null; }
}

async function queryTemplates(tenantId: string, filters: {
  module?: string;
  eventType?: string;
  channel?: string;
  language?: string;
}) {
  try {
    let sql = `SELECT * FROM "${NOTIF_TEMPLATE_TABLE}" WHERE tenant_id = $1 AND is_active = true`;
    const params: any[] = [tenantId];
    let idx = 2;
    if (filters.module) { sql += ` AND module = $${idx}`; params.push(filters.module); idx++; }
    if (filters.eventType) { sql += ` AND event_type = $${idx}`; params.push(filters.eventType); idx++; }
    if (filters.channel) { sql += ` AND channel = $${idx}`; params.push(filters.channel); idx++; }
    if (filters.language) { sql += ` AND language = $${idx}`; params.push(filters.language); idx++; }
    sql += " ORDER BY event_type ASC, channel ASC";
    return await prisma.$queryRawUnsafe(sql, ...params) as any[];
  } catch { return []; }
}

async function queryFirstTemplate(tenantId: string, eventType: string, channel: string, language: string) {
  try {
    const rows = await prisma.$queryRawUnsafe(`SELECT * FROM "${NOTIF_TEMPLATE_TABLE}" WHERE tenant_id = $1 AND event_type = $2 AND channel = $3 AND language = $4 ORDER BY version DESC LIMIT 1`, tenantId, eventType, channel, language) as any[];
    return rows[0] ?? null;
  } catch { return null; }
}

export const notificationCenterRouter = router({

  // ── Notification Log ─────────────────────────────────────────────────────────

  listLogs: guardedProcedure
    .input(z.object({
      recipientId: z.string().optional(),
      status:      z.string().optional(),
      channel:     ChannelSchema.optional(),
      from:        z.coerce.date().optional(),
      to:          z.coerce.date().optional(),
      take:        z.number().int().min(1).max(200).default(50),
      skip:        z.number().int().min(0).default(0),
    }).optional())
    .query(async ({ ctx, input }) => {
      return queryLogs(ctx.tenantId, {
        recipientId: input?.recipientId,
        status:      input?.status,
        channel:     input?.channel,
        from:        input?.from,
        to:          input?.to,
        take:        input?.take ?? 50,
        skip:        input?.skip ?? 0,
      });
    }),

  getLog: guardedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const log = await queryFirstLog(ctx.tenantId, input.id);
      if (!log) throw new TRPCError({ code: "NOT_FOUND" });
      return log;
    }),

  // DLQ review — list all failed notifications
  listDlq: guardedProcedure
    .input(z.object({}).optional())
    .query(async ({ ctx }) => {
      try {
        return await prisma.$queryRawUnsafe(`SELECT * FROM "${NOTIF_LOG_TABLE}" WHERE tenant_id = $1 AND status = 'DLQ' ORDER BY created_at DESC LIMIT 200`, ctx.tenantId) as any[];
      } catch { return []; }
    }),

  // Retry a DLQ entry
  retryNotification: guardedProcedure
    .input(z.object({ logId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const log = await queryFirstLog(ctx.tenantId, input.logId);
      if (!log) throw new TRPCError({ code: "NOT_FOUND" });

      // Reset status and re-enqueue
      try {
        await prisma.$queryRawUnsafe(`UPDATE "${NOTIF_LOG_TABLE}" SET status = 'PENDING', attempts = 0, last_error = NULL WHERE id = $1::text AND tenant_id = $2`, input.logId, ctx.tenantId);
      } catch { /* table may not exist */ }

      await dispatchNotification({
        tenantId:    ctx.tenantId,
        recipientId: log.recipient_id ?? log.recipientId,
        eventType:   log.event_type ?? log.eventType,
        channel:     log.channel,
        subject:     log.subject,
        body:        log.body ?? "",
      });

      return { success: true };
    }),

  // ── Templates ────────────────────────────────────────────────────────────────

  listTemplates: guardedProcedure
    .input(z.object({
      module:    z.string().optional(),
      eventType: z.string().optional(),
      channel:   ChannelSchema.optional(),
      language:  z.string().optional(),
    }).optional())
    .query(async ({ ctx, input }) => {
      return queryTemplates(ctx.tenantId, {
        module:    input?.module,
        eventType: input?.eventType,
        channel:   input?.channel,
        language:  input?.language,
      });
    }),

  upsertTemplate: guardedProcedure
    .input(z.object({
      id:           z.string().optional(),
      name:         z.string().min(1),
      module:       z.string().min(1),
      eventType:    z.string().min(1),
      channel:      ChannelSchema,
      language:     z.string().default("en"),
      subject:      z.string().optional(),
      bodyTemplate: z.string().min(1),
      isActive:     z.boolean().default(true),
    }))
    .mutation(async ({ ctx, input }) => {
      if (input.id) {
        try {
          await prisma.$queryRawUnsafe(
            `UPDATE "${NOTIF_TEMPLATE_TABLE}" SET name = $1, module = $2, event_type = $3, channel = $4, language = $5, subject = $6, body_template = $7, is_active = $8 WHERE id = $9::text AND tenant_id = $10`,
            input.name, input.module, input.eventType, input.channel, input.language, input.subject ?? null, input.bodyTemplate, input.isActive, input.id, ctx.tenantId
          );
        } catch { /* table may not exist */ }
        return { id: input.id, ...input };
      }

      // Get next version
      const latest = await queryFirstTemplate(ctx.tenantId, input.eventType, input.channel, input.language);
      const version = (latest?.version ?? 0) + 1;

      const id = crypto.randomUUID();
      try {
        await prisma.$queryRawUnsafe(
          `INSERT INTO "${NOTIF_TEMPLATE_TABLE}" (id, tenant_id, name, module, event_type, channel, language, subject, body_template, is_active, version) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
          id, ctx.tenantId, input.name, input.module, input.eventType, input.channel, input.language, input.subject ?? null, input.bodyTemplate, input.isActive, version
        );
      } catch { /* table may not exist */ }
      return { id, ...input, version };
    }),

  // ── Preferences ──────────────────────────────────────────────────────────────

  getPreferences: guardedProcedure
    .input(z.object({ userId: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const userId = input.userId ?? ctx.userId;
      return prisma.notificationPreference.findMany({
        where: { tenantId: ctx.tenantId, userId },
        orderBy: [{ eventType: "asc" }, { channel: "asc" }],
      });
    }),

  setPreference: guardedProcedure
    .input(z.object({
      channel:   ChannelSchema,
      eventType: z.string().min(1),
      enabled:   z.boolean(),
    }))
    .mutation(async ({ ctx, input }) => {
      return prisma.notificationPreference.upsert({
        where: {
          tenantId_userId_channel_eventType: {
            tenantId:  ctx.tenantId,
            userId:    ctx.userId,
            channel:   input.channel,
            eventType: input.eventType,
          },
        },
        create: {
          tenantId:  ctx.tenantId,
          userId:    ctx.userId,
          channel:   input.channel,
          eventType: input.eventType,
          enabled:   input.enabled,
        },
        update: { enabled: input.enabled },
      });
    }),

  // ── Send ad-hoc ──────────────────────────────────────────────────────────────

  send: guardedProcedure
    .input(z.object({
      recipientId: z.string().min(1),
      channel:     ChannelSchema.default("IN_APP"),
      eventType:   z.string().default("manual"),
      subject:     z.string().optional(),
      body:        z.string().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      const logId = await dispatchNotification({
        tenantId:    ctx.tenantId,
        recipientId: input.recipientId,
        eventType:   input.eventType,
        channel:     input.channel,
        subject:     input.subject,
        body:        input.body,
      });
      return { logId };
    }),
});
