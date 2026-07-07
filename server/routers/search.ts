/**
 * server/api/routers/search.ts
 *
 * Semantic search over HR data using @xenova/transformers embeddings.
 * Exposed via tRPC so the client never calls embeddings directly.
 */

import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { semanticRank } from "@/lib/embeddings";
import { prisma } from "@/lib/prisma";

const SearchKindSchema = z.enum(["employees", "documents", "rules", "all"]);

export const searchRouter = router({
  /**
   * Semantic search across HR entities.
   * Returns ranked results with similarity scores.
   */
  query: protectedProcedure
    .input(
      z.object({
        query: z.string().min(1).max(500),
        kind: SearchKindSchema.default("all"),
        topK: z.number().int().min(1).max(20).default(8),
        minScore: z.number().min(0).max(1).default(0.25),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { tenantId } = ctx;
      const { query, kind, topK, minScore } = input;
      const where = { tenantId };

      const [employees, documents, rules] = await Promise.all([
        kind === "documents" || kind === "rules"
          ? ([] as Awaited<ReturnType<typeof prisma.employee.findMany>>)
          : prisma.employee.findMany({
              where,
              select: {
                id: true,
                name: true,
                position: true,
                department: true,
                nationality: true,
                email: true,
              },
              take: 200,
            }),
        kind === "employees" || kind === "rules"
          ? ([] as Awaited<ReturnType<typeof prisma.document.findMany>>)
          : prisma.document.findMany({
              where: { ...where, contentText: { not: null } },
              select: {
                id: true,
                type: true,
                contentText: true,
                status: true,
                employeeId: true,
                expiryDate: true,
              },
              take: 200,
            }),
        kind === "employees" || kind === "documents"
          ? ([] as Awaited<ReturnType<typeof prisma.complianceRule.findMany>>)
          : prisma.complianceRule.findMany({
              where: { ...where, active: true },
              select: {
                id: true,
                ruleType: true,
                country: true,
                description: true,
                validityMonths: true,
                alertDays: true,
              },
              take: 100,
            }),
      ]);

      const candidates = [
        ...employees.map((e: (typeof employees)[number]) => ({
          id: e.id,
          kind: "employee" as const,
          text: [e.name, e.position, e.department, e.nationality, e.email]
            .filter(Boolean)
            .join(" "),
          meta: {
            name: e.name,
            position: e.position,
            department: e.department,
            nationality: e.nationality,
          },
        })),
        ...documents
          .filter((d: (typeof documents)[number]) => d.contentText)
          .map((d: (typeof documents)[number]) => ({
            id: d.id,
            kind: "document" as const,
            text: d.contentText!,
            meta: {
              type: d.type,
              status: d.status,
              employeeId: d.employeeId,
              expiryDate: d.expiryDate,
            },
          })),
        ...rules
          .filter((r: (typeof rules)[number]) => r.description)
          .map((r: (typeof rules)[number]) => ({
            id: r.id,
            kind: "rule" as const,
            text: r.description!,
            meta: {
              ruleType: r.ruleType,
              country: r.country,
              validityMonths: r.validityMonths,
              alertDays: r.alertDays,
            },
          })),
      ];

      if (!candidates.length) return { results: [], query };

      const ranked = await semanticRank(query, candidates, topK);

      return {
        query,
        results: ranked
          .filter((r) => r.score >= minScore)
          .map((r) => ({
            id: (r as any).id,
            kind: (r as any).kind,
            meta: (r as any).meta,
            score: r.score,
          })),
      };
    }),

  /**
   * Find employees semantically similar to a given employee (by name/role).
   * Useful for succession planning and team composition.
   */
  similarEmployees: protectedProcedure
    .input(
      z.object({
        employeeId: z.string(),
        topK: z.number().int().min(1).max(10).default(5),
      }),
    )
    .query(async ({ ctx, input }) => {
      const anchor = await prisma.employee.findFirst({
        where: { id: input.employeeId, tenantId: ctx.tenantId },
        select: {
          name: true,
          position: true,
          department: true,
          nationality: true,
        },
      });
      if (!anchor) return { results: [] };

      const anchorText = [
        anchor.name,
        anchor.position,
        anchor.department,
        anchor.nationality,
      ]
        .filter(Boolean)
        .join(" ");

      const others = await prisma.employee.findMany({
        where: { tenantId: ctx.tenantId, id: { not: input.employeeId } },
        select: {
          id: true,
          name: true,
          position: true,
          department: true,
          nationality: true,
        },
        take: 200,
      });

      const candidates = others.map((e: (typeof others)[number]) => ({
        id: e.id,
        text: [e.name, e.position, e.department, e.nationality]
          .filter(Boolean)
          .join(" "),
        meta: { name: e.name, position: e.position, department: e.department },
      }));

      const ranked = await semanticRank(anchorText, candidates, input.topK);
      return {
        results: ranked.map((r) => ({
          id: (r as any).id,
          meta: (r as any).meta,
          score: r.score,
        })),
      };
    }),
});
