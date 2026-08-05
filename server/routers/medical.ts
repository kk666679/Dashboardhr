import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "@/server/trpc";
import { prisma } from "@/lib/prisma";

export const medicalRouter = router({
  getFOMEMASchedule: protectedProcedure
    .input(z.object({ take: z.number().int().min(1).max(200).default(50) }).optional())
    .query(async ({ ctx, input }) => {
      return prisma.fOMEMA.findMany({
        where: {
          tenantId: ctx.tenantId,
          deletedAt: null,
          status: { in: ["SCHEDULED", "IN_PROGRESS"] },
        },
        include: { employee: { select: { id: true, name: true, email: true } } },
        orderBy: { examinationDate: "asc" },
        take: input?.take ?? 50,
      });
    }),

  getMedicalRecords: protectedProcedure
    .input(z.object({ employeeId: z.string().optional(), take: z.number().int().min(1).max(200).default(50) }).optional())
    .query(async ({ ctx, input }) => {
      return prisma.document.findMany({
        where: {
          tenantId: ctx.tenantId,
          deletedAt: null,
          ...(input?.employeeId ? { employeeId: input.employeeId } : {}),
          type: { in: ["CERTIFICATE"] },
          OR: [
            { contentText: { contains: "medical", mode: "insensitive" } },
            { tags: { hasSome: ["medical", "fomema", "health"] } },
          ],
        },
        include: { employee: { select: { id: true, name: true, email: true } } },
        orderBy: { createdAt: "desc" },
        take: input?.take ?? 50,
      });
    }),

  getFomemaRecords: protectedProcedure
    .input(z.object({ take: z.number().int().min(1).max(200).default(50) }).optional())
    .query(async ({ ctx, input }) => {
      return prisma.fOMEMA.findMany({
        where: { tenantId: ctx.tenantId, deletedAt: null },
        include: { employee: { select: { id: true, name: true, email: true } } },
        orderBy: { examinationDate: "desc" },
        take: input?.take ?? 50,
      });
    }),
});
