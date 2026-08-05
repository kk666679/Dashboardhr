/**
 * Integrations tRPC Router — Sprint 27
 *
 * Manages integration configuration (AD/LDAP, M365, biometric, ERP, bank, SIEM).
 * Actual sync is delegated to BullMQ sync worker.
 *
 * Requirements: 27.1–27.6
 */

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { abacProcedure, router } from "../trpc";
import { prisma } from "@/lib/prisma";
import { writeAuditEntry } from "@/lib/shared-kernel/audit/audit-middleware";

const IntegrationNameSchema = z.enum([
  "AD_LDAP", "M365", "GOOGLE", "BIOMETRIC", "ERP", "BANK", "SIEM",
  "FOMEMA", "EPF", "SOCSO", "EIS", "LHDN",
]);

export const integrationsRouter = router({

  list: abacProcedure("config", "read")
    .input(z.object({}).optional())
    .query(async ({ ctx }) => {
      const configs = await (prisma as any).integrationConfig.findMany({
        where:   { tenantId: ctx.tenantId },
        select: {
          id:          true,
          name:        true,
          provider:    true,
          isActive:    true,
          lastSyncAt:  true,
          syncStatus:  true,
          createdAt:   true,
          updatedAt:   true,
          // Never return config blob (may contain secrets)
        },
        orderBy: { name: "asc" },
      });
      return configs;
    }),

  getConfig: abacProcedure("config", "read")
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const config = await (prisma as any).integrationConfig.findFirst({
        where:  { id: input.id, tenantId: ctx.tenantId },
        select: {
          id:          true,
          name:        true,
          provider:    true,
          isActive:    true,
          lastSyncAt:  true,
          syncStatus:  true,
          // config blob intentionally excluded from display
        },
      });
      if (!config) throw new TRPCError({ code: "NOT_FOUND" });
      return config;
    }),

  upsert: abacProcedure("config", "write")
    .input(z.object({
      name:     IntegrationNameSchema,
      provider: z.string().min(1),
      config:   z.record(z.string(), z.any()), // encrypted at rest; never logged
      isActive: z.boolean().default(false),
    }))
    .mutation(async ({ ctx, input }) => {
      const integration = await (prisma as any).integrationConfig.upsert({
        where:  { tenantId_name: { tenantId: ctx.tenantId, name: input.name } },
        create: { tenantId: ctx.tenantId, ...input },
        update: { provider: input.provider, config: input.config, isActive: input.isActive },
      });

      // Audit — do NOT log the config blob value
      await writeAuditEntry({
        tenantId:   ctx.tenantId,
        module:     "integrations",
        entityType: "IntegrationConfig",
        entityId:   integration.id,
        action:     "UPDATE",
        actorId:    ctx.userId,
        actorRole:  ctx.userRole,
        newValue:   { name: input.name, provider: input.provider, isActive: input.isActive },
      });

      return { id: integration.id, name: integration.name, isActive: integration.isActive };
    }),

  toggleActive: abacProcedure("config", "write")
    .input(z.object({ id: z.string(), isActive: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const config = await (prisma as any).integrationConfig.findFirst({
        where: { id: input.id, tenantId: ctx.tenantId },
      });
      if (!config) throw new TRPCError({ code: "NOT_FOUND" });

      return (prisma as any).integrationConfig.update({
        where: { id: input.id },
        data:  { isActive: input.isActive },
      });
    }),

  // Trigger a manual sync (enqueues BullMQ job)
  triggerSync: abacProcedure("config", "write")
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const config = await (prisma as any).integrationConfig.findFirst({
        where: { id: input.id, tenantId: ctx.tenantId, isActive: true },
      });
      if (!config) throw new TRPCError({ code: "NOT_FOUND", message: "Integration not found or inactive" });

      // Enqueue sync job
      try {
        const IORedis = (await import("ioredis")).default;
        const { Queue } = await import("bullmq");
        const connection = new IORedis(process.env.REDIS_URL ?? "redis://localhost:6379", { maxRetriesPerRequest: null }) as any;
        const syncQueue = new Queue("sync", { connection } as any);
        await syncQueue.add("sync", {
          integrationId: config.id,
          name:          config.name,
          tenantId:      ctx.tenantId,
        });
        await (prisma as any).integrationConfig.update({
          where: { id: input.id },
          data:  { syncStatus: "QUEUED" },
        });
      } catch (err) {
        console.warn("[integrations] Could not enqueue sync:", err);
      }

      return { queued: true };
    }),

  // Last sync status for dashboard
  getSyncStatus: abacProcedure("config", "read")
    .input(z.object({}).optional())
    .query(async ({ ctx }) => {
      return (prisma as any).integrationConfig.findMany({
        where:  { tenantId: ctx.tenantId },
        select: { id: true, name: true, isActive: true, lastSyncAt: true, syncStatus: true },
        orderBy: { name: "asc" },
      });
    }),
});
