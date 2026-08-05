import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { guardedProcedure, router } from "../trpc";

const flagInput = z.object({
  key: z.string().trim().min(2).max(100).regex(/^[a-z0-9][a-z0-9._-]*$/, "Use lowercase letters, numbers, dots, underscores, or hyphens"),
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().max(1_000).optional(),
  enabled: z.boolean().default(false),
  rolloutPercentage: z.number().int().min(0).max(100).default(100),
});

function requireAdmin(role: string) {
  if (role !== "ADMIN") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Feature flags can only be managed by administrators" });
  }
}

function rolloutBucket(key: string, userId: string) {
  let hash = 0;
  for (const char of `${key}:${userId}`) hash = ((hash << 5) - hash + char.charCodeAt(0)) | 0;
  return Math.abs(hash) % 100;
}

export const featureFlagsRouter = router({
  list: guardedProcedure.query(async ({ ctx }) => {
    requireAdmin(ctx.userRole);
    return prisma.featureFlag.findMany({
      where: { tenantId: ctx.tenantId },
      orderBy: { key: "asc" },
    });
  }),

  evaluate: guardedProcedure
    .input(z.object({ key: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const flag = await prisma.featureFlag.findUnique({
        where: { tenantId_key: { tenantId: ctx.tenantId, key: input.key } },
        select: { enabled: true, rolloutPercentage: true },
      });
      return Boolean(flag?.enabled && rolloutBucket(input.key, ctx.userId) < flag.rolloutPercentage);
    }),

  upsert: guardedProcedure.input(flagInput).mutation(async ({ ctx, input }) => {
    requireAdmin(ctx.userRole);
    return prisma.featureFlag.upsert({
      where: { tenantId_key: { tenantId: ctx.tenantId, key: input.key } },
      create: { ...input, tenantId: ctx.tenantId, createdBy: ctx.userId, updatedBy: ctx.userId },
      update: { ...input, updatedBy: ctx.userId },
    });
  }),

  setEnabled: guardedProcedure
    .input(z.object({ key: z.string().min(1), enabled: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      requireAdmin(ctx.userRole);
      const result = await prisma.featureFlag.updateMany({
        where: { tenantId: ctx.tenantId, key: input.key },
        data: { enabled: input.enabled, updatedBy: ctx.userId },
      });
      if (!result.count) throw new TRPCError({ code: "NOT_FOUND", message: "Feature flag not found" });
      return { key: input.key, enabled: input.enabled };
    }),
});
