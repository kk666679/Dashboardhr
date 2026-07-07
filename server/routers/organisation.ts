import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { prisma } from "@/lib/prisma";
import { writeAuditEntry } from "@/src/shared-kernel/audit/audit-middleware";

const nodeSchema = z.object({
  name: z.string(),
  level: z.enum(["GROUP", "LEGAL_ENTITY", "BUSINESS_UNIT", "DEPARTMENT", "BRANCH", "COST_CENTER"]),
  parentId: z.string().optional(),
  country: z.string().optional(),
  currency: z.string().optional(),
  locale: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const organisationRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return prisma.orgNode.findMany({
      where: { tenantId: ctx.tenantId, isActive: true },
      orderBy: { createdAt: "desc" },
    });
  }),

  createNode: protectedProcedure.input(nodeSchema).mutation(async ({ ctx, input }) => {
    const node = await prisma.orgNode.create({
      data: {
        tenantId: ctx.tenantId,
        name: input.name,
        level: input.level as any,
        parentId: input.parentId,
        country: input.country,
        currency: input.currency,
        locale: input.locale,
        isActive: input.isActive ?? true,
      },
    });

    await writeAuditEntry({
      tenantId: ctx.tenantId,
      entityType: "OrgNode",
      entityId: node.id,
      action: "CREATE",
      actorId: ctx.userId,
      actorRole: ctx.userRole,
      metadata: { level: input.level },
    });

    return node;
  }),

  deactivateNode: protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
    const node = await prisma.orgNode.update({
      where: { id: input.id },
      data: { isActive: false },
    });

    await writeAuditEntry({
      tenantId: ctx.tenantId,
      entityType: "OrgNode",
      entityId: node.id,
      action: "UPDATE",
      actorId: ctx.userId,
      actorRole: ctx.userRole,
      metadata: { isActive: false },
    });

    return node;
  }),

  getHierarchy: protectedProcedure.query(async ({ ctx }) => {
    return prisma.orgNode.findMany({
      where: { tenantId: ctx.tenantId },
      include: { children: true },
    });
  }),
});
