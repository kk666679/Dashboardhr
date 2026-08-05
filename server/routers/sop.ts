import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  SopGenerationInputSchema,
  SopGenerationOutputSchema,
  SopStructureSchema,
  type SopStructure,
} from "@/lib/sop-schemas";
import { generateSop } from "@/lib/sop/generationPipeline";
import {
  exportSopToHtml as exportSopContentToHtml,
  exportSopToMarkdown as exportSopContentToMarkdown,
} from "@/lib/sop/export";
import { protectedProcedure, router } from "../trpc";


// ─── Type definitions ────────────────────────────────────────────────────────

type TxClient = Omit<
  typeof prisma,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;

interface SOP {
  id: string;
  tenantId: string;
  department: string;
  code: string;
  name: string;
  title?: string;
  category: "POLICY" | "OPERATIONAL" | "COMPLIANCE" | "EMERGENCY";
  status: "DRAFT" | "IN_REVIEW" | "PUBLISHED" | "ARCHIVED";
  currentVersion: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  versions: SOPVersion[];
}

interface SOPVersion {
  id: string;
  sopId: string;
  version: number;
  status: "DRAFT" | "IN_REVIEW" | "PUBLISHED" | "ARCHIVED";
  changes: string;
  content: SopStructure;
  outline: SopStructure;
  sla: unknown;
  complianceFindings: unknown;
  riskFindings: unknown;
  auditFindings: unknown;
  complianceScore: number | null;
  riskScore: number | null;
  auditReadinessScore: number | null;
  approvedBy: string | null;
  approvedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  sop: SOP;
  approvals: SOPApproval[];
  artifacts: SOPArtifact[];
  risks: SOPRiskItem[];
  complianceItems: SOPComplianceItem[];
  auditEvents: SOPAuditEvent[];
}

interface SOPApproval {
  id: string;
  versionId: string;
  approverRole: string;
  approverName: string | null;
  order: number;
  status: "PENDING" | "APPROVED" | "REJECTED" | "VOID";
  comment: string | null;
  decidedBy: string | null;
  decidedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  version: SOPVersion;
}

interface SOPArtifact {
  id: string;
  versionId: string;
  type: "MARKDOWN" | "HTML" | "PDF" | "MERMAID";
  name: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

interface SOPRiskItem {
  id: string;
  versionId: string;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  risk: string;
  likelihood: string | null;
  impact: string | null;
  mitigation: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface SOPComplianceItem {
  id: string;
  versionId: string;
  requirement: string;
  regulation: string;
  control: string | null;
  status: "PENDING" | "COMPLIANT" | "NON_COMPLIANT" | "PARTIAL";
  createdAt: Date;
  updatedAt: Date;
}

interface SOPAuditEvent {
  id: string;
  versionId: string;
  actor: string;
  action: string;
  evidence: unknown;
  createdAt: Date;
  updatedAt: Date;
}

interface ApprovalInput {
  required: boolean;
  approverRole?: string;
  order?: number;
  [key: string]: unknown;
}

interface ProcessFlowItem {
  step: string;
  [key: string]: unknown;
}

interface ComplianceRequirement {
  requirement: string;
  regulation: string;
  control?: string;
  status: "PENDING" | "COMPLIANT" | "NON_COMPLIANT" | "PARTIAL";
  [key: string]: unknown;
}

interface RiskControl {
  risk: string;
  likelihood?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  impact?: string;
  mitigation?: string;
  [key: string]: unknown;
}

// ─── Type aliases for schema inference ──────────────────────────────────────

type SopStatus = z.infer<typeof sopStatusSchema>;
type ApprovalDecision = z.infer<typeof approvalDecisionSchema>;
type ExportFormat = z.infer<typeof exportFormatSchema>;
type SopCategory = "POLICY" | "OPERATIONAL" | "COMPLIANCE" | "EMERGENCY";

// ─── Schemas ──────────────────────────────────────────────────────────────────

const sopStatusSchema = z.enum(["DRAFT", "IN_REVIEW", "PUBLISHED", "ARCHIVED"]);
const approvalDecisionSchema = z.enum(["APPROVED", "REJECTED"]);
const exportFormatSchema = z.enum(["MARKDOWN", "HTML", "PDF"]);

const listInputSchema = z.object({
  limit: z.number().int().min(1).max(50).default(20),
  cursor: z.string().optional(),
  query: z.string().optional(),
  department: z.string().optional(),
  category: z.enum(["POLICY", "OPERATIONAL", "COMPLIANCE", "EMERGENCY"]).optional(),
  status: sopStatusSchema.optional(),
});

const getByIdInputSchema = z.object({ id: z.string().min(1) });

const searchInputSchema = z.object({
  query: z.string().min(1),
  limit: z.number().int().min(1).max(20).default(10),
  department: z.string().optional(),
  category: z.enum(["POLICY", "OPERATIONAL", "COMPLIANCE", "EMERGENCY"]).optional(),
  status: sopStatusSchema.optional(),
});

const relatedInputSchema = z.object({
  id: z.string().min(1),
  limit: z.number().int().min(1).max(10).default(5),
});

const updateContentInputSchema = z.object({
  versionId: z.string().min(1),
  content: SopStructureSchema,
});

const transitionStatusInputSchema = z.object({
  id: z.string().min(1),
  to: sopStatusSchema,
});

const recordApprovalInputSchema = z.object({
  approvalId: z.string().min(1),
  decision: approvalDecisionSchema,
  comment: z.string().max(1000).optional(),
});

const exportInputSchema = z.object({
  id: z.string().min(1),
  version: z.number().int().positive().optional(),
  format: exportFormatSchema,
  refresh: z.boolean().default(false),
});

const createVersionInputSchema = z.object({
  id: z.string().min(1),
  changes: z.string().max(1000).default("New draft version"),
});

// ─── Helper functions ────────────────────────────────────────────────────────

function toError(code: TRPCError["code"], message: string): TRPCError {
  return new TRPCError({ code, message });
}

function hasLlmKey(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY?.trim() || process.env.OPENAI_API_KEY?.trim());
}

function slug(value: string, maxLength = 50): string {
  return value
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, maxLength);
}

function generateMermaid(processFlow: ProcessFlowItem[] | undefined): string | null {
  if (!processFlow || !processFlow.length) return null;

  const nodes = processFlow
    .map((item: ProcessFlowItem, index: number) => {
      const safeLabel = item.step.replace(/[\[\]"]/g, "").trim() || `Step ${index + 1}`;
      return `  S${index + 1}["${safeLabel}"]`;
    })
    .join("\n");
  const edges = processFlow
    .slice(1)
    .map((_: ProcessFlowItem, index: number) => `  S${index + 1} --> S${index + 2}`)
    .join("\n");

  return ["flowchart TD", nodes, edges].filter(Boolean).join("\n");
}

async function nextGeneratedCode(
  tx: TxClient, 
  tenantId: string, 
  category: string, 
  department: string
): Promise<string> {
  const prefix = `${slug(category)}-${slug(department, 20)}`;
  const existing = await tx.sop.findMany({
    where: { tenantId, code: { startsWith: `${prefix}-` } },
    select: { code: true },
  });
  const used = new Set(existing.map((item: { code: string }) => item.code));

  for (let index = 1; index <= 999; index += 1) {
    const code = `${prefix}-${String(index).padStart(3, "0")}`;
    if (!used.has(code)) return code;
  }

  throw toError("BAD_REQUEST", `No SOP codes are available for ${prefix}`);
}

async function resolveCode(
  tx: TxClient, 
  tenantId: string, 
  input: z.infer<typeof SopGenerationInputSchema>
): Promise<string> {
  if (!input.code?.trim()) {
    return nextGeneratedCode(tx, tenantId, input.category, input.department);
  }

  const code = slug(input.code, 80);
  const existing = await tx.sop.findFirst({ 
    where: { tenantId, code }, 
    select: { id: true } 
  });
  if (!existing) return code;

  const suggestion = await nextGeneratedCode(tx, tenantId, input.category, input.department);
  throw toError("BAD_REQUEST", `SOP code ${code} already exists. Next available code: ${suggestion}`);
}

function artifactContentType(format: ExportFormat): string {
  if (format === "HTML") return "text/html";
  if (format === "PDF") return "application/pdf";
  return "text/markdown";
}

// ─── Router ──────────────────────────────────────────────────────────────────

export const sopRouter = router({
  generate: protectedProcedure
    .input(SopGenerationInputSchema)
    .mutation(async ({ ctx, input }) => {
      const output = SopGenerationOutputSchema.parse(await generateSop(input));
      const title = input.title?.trim() || output.title || `${input.category} SOP`;

      try {
        return await prisma.$transaction(async (tx: TxClient) => {
          const code = await resolveCode(tx, ctx.tenantId, input);
          const sop = await tx.sop.create({
            data: {
              tenantId: ctx.tenantId,
              department: input.department,
              code,
              title,
              category: input.category as SopCategory,
              status: "DRAFT",
              currentVersion: 1,
              createdBy: ctx.userId,
            },
          });

          const version = await tx.sopVersion.create({
            data: {
              sopId: sop.id,
              version: 1,
              status: "DRAFT",
              changes: "Initial AI-generated draft",
              content: output.structure as any,
              outline: output.structure as any,
              sla: output.structure.sla as any,
              complianceFindings: output.agentFindings as any,
              riskFindings: output.agentFindings as any,
              auditFindings: output.agentFindings as any,
              complianceScore: output.agentFindings.complianceScore,
              riskScore: output.agentFindings.riskScore,
              auditReadinessScore: output.agentFindings.auditReadinessScore,
              approvedBy: null,
              approvedAt: null,
            },
          });

          const mermaid = output.artifacts.mermaid ?? generateMermaid(output.structure.processFlow);
          const artifacts = [
            { versionId: version.id, type: "MARKDOWN" as const, name: "Markdown", content: output.artifacts.markdown ?? "" },
            { versionId: version.id, type: "HTML" as const, name: "HTML", content: output.artifacts.html ?? "" },
            { versionId: version.id, type: "MERMAID" as const, name: "Mermaid", content: mermaid ?? "" },
          ].filter((artifact) => artifact.content.length > 0);

          if (artifacts.length) {
            await tx.sopArtifact.createMany({ 
              data: artifacts as any[] 
            });
          }

          const complianceItems = output.structure.complianceRequirements.map((item: any) => ({
            versionId: version.id,
            requirement: item.requirement,
            regulation: item.regulation,
            control: item.control ?? null,
            status: item.status,
          }));
          if (complianceItems.length) {
            await tx.sopComplianceItem.createMany({ 
              data: complianceItems as any[]
            });
          }

          const riskItems = (output.structure.riskControls as any[]).map((item: any) => ({
            versionId: version.id,
            riskLevel: item.likelihood ?? "MEDIUM",
            risk: item.risk,
            likelihood: item.likelihood ?? null,
            impact: item.impact ?? null,
            mitigation: item.mitigation ?? null,
          }));
          if (riskItems.length) {
            await tx.sopRiskItem.createMany({ 
              data: riskItems as any[]
            });
          }

          const approvals = output.structure.approvals
            .filter((approval: ApprovalInput) => approval.required)
            .sort((left: ApprovalInput, right: ApprovalInput) => 
              ((left.order ?? 1) - (right.order ?? 1))
            )
            .map((approval: ApprovalInput, index: number) => ({
              versionId: version.id,
              approverRole: approval.approverRole ?? "DEFAULT",
              approverName: null,
              order: approval.order ?? index + 1,
              status: "PENDING" as const,
              comment: null,
              decidedBy: null,
              decidedAt: null,
            }));
          if (approvals.length) {
            await tx.sopApproval.createMany({ 
              data: approvals as any[]
            });
          }

          await tx.sopAuditEvent.createMany({
            data: [
              {
                versionId: version.id,
                actor: ctx.userId,
                action: "sop_created",
                evidence: { code, title, department: input.department, category: input.category },
              },
              {
                versionId: version.id,
                actor: ctx.userId,
                action: "version_created",
                evidence: { version: 1, source: "generation" },
              },
            ],
          });

          return { 
            id: sop.id, 
            versionId: version.id, 
            sopCode: code, 
            title, 
            version: 1 
          };
        });
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error("SOP generation persistence failed", error);
        throw toError("INTERNAL_SERVER_ERROR", "SOP generation failed");
      }
    }),

  list: protectedProcedure
    .input(listInputSchema.optional())
    .query(async ({ ctx, input }) => {
      const limit = input?.limit ?? 20;
      const query = input?.query?.trim();
      const items = await prisma.sop.findMany({
        where: {
          tenantId: ctx.tenantId,
          ...(input?.department ? { department: input.department } : {}),
          ...(input?.category ? { category: input.category as SopCategory } : {}),
          ...(input?.status ? { status: input.status as SopStatus } : {}),
          ...(query
            ? {
                OR: [
                  { name: { contains: query, mode: "insensitive" as const } },
                  { department: { contains: query, mode: "insensitive" as const } },
                  { code: { contains: query, mode: "insensitive" as const } },
                ],
              }
            : {}),
        },
        take: limit + 1,
        ...(input?.cursor ? { cursor: { id: input.cursor }, skip: 1 } : {}),
        orderBy: { updatedAt: "desc" },
        include: {
          versions: {
            orderBy: { version: "desc" },
            take: 1,
            include: { artifacts: true },
          },
        },
      });

      return {
        items: items.slice(0, limit),
        nextCursor: items.length > limit ? items[limit].id : null,
      };
    }),

  getById: protectedProcedure
    .input(getByIdInputSchema)
    .query(async ({ ctx, input }) => {
      const sop = await prisma.sop.findFirst({
        where: { id: input.id, tenantId: ctx.tenantId },
        include: {
          versions: {
            include: {
              approvals: { 
                orderBy: [{ order: "asc" }, { createdAt: "asc" }] 
              },
              risks: true,
              complianceItems: true,
              artifacts: true,
              auditEvents: { orderBy: { createdAt: "desc" } },
            },
            orderBy: { version: "desc" },
          },
        },
      });

      if (!sop) throw toError("NOT_FOUND", "SOP not found");
      return sop;
    }),

  search: protectedProcedure
    .input(searchInputSchema)
    .query(async ({ ctx, input }) => {
      const query = input.query.trim();
      return prisma.sop.findMany({
        where: {
          tenantId: ctx.tenantId,
          ...(input.department ? { department: input.department } : {}),
          ...(input.category ? { category: input.category as SopCategory } : {}),
          ...(input.status ? { status: input.status as SopStatus } : {}),
          OR: [
            { name: { contains: query, mode: "insensitive" as const } },
            { department: { contains: query, mode: "insensitive" as const } },
            { code: { contains: query, mode: "insensitive" as const } },
          ],
        },
        take: input.limit,
        orderBy: { updatedAt: "desc" },
        select: { 
          id: true, 
          code: true, 
          name: true, 
          department: true, 
          category: true, 
          status: true 
        },
      });
    }),

  related: protectedProcedure
    .input(relatedInputSchema)
    .query(async ({ ctx, input }) => {
      const base = await prisma.sop.findFirst({
        where: { id: input.id, tenantId: ctx.tenantId },
        select: { id: true, department: true, category: true },
      });
      if (!base) throw toError("NOT_FOUND", "SOP not found");

      return prisma.sop.findMany({
        where: {
          tenantId: ctx.tenantId,
          id: { not: input.id },
          OR: [{ department: base.department }, { category: base.category }],
        },
        take: input.limit,
        orderBy: { updatedAt: "desc" },
        select: { 
          id: true, 
          code: true, 
          name: true, 
          department: true, 
          category: true, 
          status: true 
        },
      });
    }),

  updateContent: protectedProcedure
    .input(updateContentInputSchema)
    .mutation(async ({ ctx, input }) => {
      const version = await prisma.sopVersion.findFirst({
        where: { id: input.versionId, sop: { tenantId: ctx.tenantId } },
        include: { sop: true },
      });
      if (!version) throw toError("NOT_FOUND", "SOP version not found");
      if (version.status !== "DRAFT") {
        throw toError(
          "BAD_REQUEST", 
          "Published or review-locked SOP content cannot be edited. Create a new draft version first."
        );
      }

      const mermaid = generateMermaid(input.content.processFlow);
      return prisma.$transaction(async (tx: TxClient) => {
        const updated = await tx.sopVersion.update({
          where: { id: version.id },
          data: {
            content: input.content as any,
            outline: input.content as any,
            sla: input.content.sla as any,
            changes: "Draft content edited",
          },
        });

        const existingMermaid = await tx.sopArtifact.findFirst({
          where: { versionId: version.id, type: "MERMAID" },
          select: { id: true },
        });

        if (mermaid && existingMermaid) {
          await tx.sopArtifact.update({ 
            where: { id: existingMermaid.id }, 
            data: { content: mermaid } 
          });
        } else if (mermaid) {
          await tx.sopArtifact.create({
            data: { 
              versionId: version.id, 
              type: "MERMAID", 
              name: "Mermaid", 
              content: mermaid 
            },
          });
        }

        await tx.sopAuditEvent.create({
          data: {
            versionId: version.id,
            actor: ctx.userId,
            action: "content_edited",
            evidence: { sopId: version.sopId, version: version.version },
          },
        });

        return updated;
      });
    }),

  createVersion: protectedProcedure
    .input(createVersionInputSchema)
    .mutation(async ({ ctx, input }) => {
      const sop = await prisma.sop.findFirst({
        where: { id: input.id, tenantId: ctx.tenantId },
      });
      if (!sop) throw toError("NOT_FOUND", "SOP not found");
      if (sop.status !== "PUBLISHED") {
        throw toError(
          "BAD_REQUEST", 
          "Only published SOPs can be copied into a new draft version"
        );
      }

      const currentVersion = await prisma.sopVersion.findFirst({
        where: { sopId: sop.id, version: sop.currentVersion },
        include: { approvals: true, artifacts: true },
      });
      if (!currentVersion) throw toError("NOT_FOUND", "Current SOP version not found");

      return prisma.$transaction(async (tx: TxClient) => {
        const nextVersion = sop.currentVersion + 1;
        const draft = await tx.sopVersion.create({
          data: {
            sopId: sop.id,
            version: nextVersion,
            status: "DRAFT",
            changes: input.changes,
            content: currentVersion.content as any,
            outline: currentVersion.outline as any,
            sla: currentVersion.sla as any,
            complianceFindings: currentVersion.complianceFindings as any,
            riskFindings: currentVersion.riskFindings as any,
            auditFindings: currentVersion.auditFindings as any,
            complianceScore: currentVersion.complianceScore,
            riskScore: currentVersion.riskScore,
            auditReadinessScore: currentVersion.auditReadinessScore,
            approvedBy: null,
            approvedAt: null,
          },
        });

        const approvals = currentVersion.approvals
          .sort((left: SOPApproval, right: SOPApproval) => 
            (left.order ?? 1) - (right.order ?? 1)
          )
          .map((approval: SOPApproval) => ({
            versionId: draft.id,
            approverRole: approval.approverRole,
            approverName: approval.approverName,
            order: approval.order ?? 1,
            status: "PENDING" as const,
            comment: null,
            decidedBy: null,
            decidedAt: null,
          }));
          if (approvals.length) {
            await tx.sopApproval.createMany({ 
              data: approvals as any[]
            });
          }

        const mermaid = currentVersion.artifacts.find(
          (artifact: SOPArtifact) => artifact.type === "MERMAID"
        );
        if (mermaid) {
          await tx.sopArtifact.create({
            data: { 
              versionId: draft.id, 
              type: "MERMAID", 
              name: mermaid.name, 
              content: mermaid.content 
            },
          });
        }

        await tx.sop.update({
          where: { id: sop.id },
          data: { currentVersion: nextVersion, status: "DRAFT" },
        });
        await tx.sopAuditEvent.create({
          data: {
            versionId: draft.id,
            actor: ctx.userId,
            action: "version_created",
            evidence: { 
              fromVersion: currentVersion.version, 
              version: nextVersion, 
              changes: input.changes 
            },
          },
        });

        return { id: sop.id, versionId: draft.id, version: nextVersion };
      });
    }),

  transitionStatus: protectedProcedure
    .input(transitionStatusInputSchema)
    .mutation(async ({ ctx, input }) => {
      const sop = await prisma.sop.findFirst({
        where: { id: input.id, tenantId: ctx.tenantId },
      });
      if (!sop) throw toError("NOT_FOUND", "SOP not found");

      const currentVersion = await prisma.sopVersion.findFirst({
        where: { sopId: sop.id, version: sop.currentVersion },
      });
      if (!currentVersion) throw toError("NOT_FOUND", "Current SOP version not found");

      const from = sop.status as SopStatus;
      const to = input.to;
      const directAllowed =
        (from === "DRAFT" && to === "IN_REVIEW") ||
        (from === "IN_REVIEW" && to === "DRAFT") ||
        (from === "PUBLISHED" && to === "ARCHIVED");

      if (!directAllowed) {
        throw toError(
          "BAD_REQUEST", 
          `${from} -> ${to} is not a permitted transition`
        );
      }

      return prisma.$transaction(async (tx: TxClient) => {
        await tx.sop.update({ 
          where: { id: sop.id }, 
          data: { status: to as SopStatus } 
        });
        if (to !== "ARCHIVED") {
          await tx.sopVersion.update({ 
            where: { id: currentVersion.id }, 
            data: { status: to as SopStatus } 
          });
        }
        await tx.sopAuditEvent.create({
          data: {
            versionId: currentVersion.id,
            actor: ctx.userId,
            action: "status_transitioned",
            evidence: { from, to, timestamp: new Date().toISOString() },
          },
        });
        return { id: sop.id, from, to };
      });
    }),

  recordApproval: protectedProcedure
    .input(recordApprovalInputSchema)
    .mutation(async ({ ctx, input }) => {
      const approval = await prisma.sopApproval.findFirst({
        where: { 
          id: input.approvalId, 
          version: { sop: { tenantId: ctx.tenantId } } 
        },
        include: { version: { include: { sop: true } } },
      });
      if (!approval) throw toError("NOT_FOUND", "SOP approval not found");
      if (approval.version.status !== "IN_REVIEW") {
        throw toError(
          "BAD_REQUEST", 
          "Approval decisions can only be recorded while the SOP is in review"
        );
      }
      if (approval.status !== "PENDING") {
        throw toError("BAD_REQUEST", "This approval has already been decided");
      }
      if (approval.approverRole !== (ctx as { userRole?: string }).userRole) {
        throw toError(
          "UNAUTHORIZED", 
          `Approval requires role ${approval.approverRole}`
        );
      }

      const blockingApprovals = await prisma.sopApproval.count({
        where: {
          versionId: approval.versionId,
          status: { not: "APPROVED" },
          order: { lt: approval.order ?? 1 },
        },
      });
      if (blockingApprovals > 0) {
        throw toError(
          "BAD_REQUEST", 
          "Earlier approval steps must be approved first"
        );
      }

      return prisma.$transaction(async (tx: TxClient) => {
        const decidedAt = new Date();
        await tx.sopApproval.update({
          where: { id: approval.id },
          data: {
            status: input.decision as SOPApproval["status"],
            comment: input.comment,
            decidedBy: ctx.userId,
            decidedAt,
          },
        });

        if (input.decision === "REJECTED") {
          await tx.sopApproval.updateMany({
            where: { versionId: approval.versionId, status: "PENDING" },
            data: { status: "VOID" },
          });
          await tx.sopVersion.update({ 
            where: { id: approval.versionId }, 
            data: { status: "DRAFT" } 
          });
          await tx.sop.update({ 
            where: { id: approval.version.sopId }, 
            data: { status: "DRAFT" } 
          });
          await tx.sopAuditEvent.createMany({
            data: [
              {
                versionId: approval.versionId,
                actor: ctx.userId,
                action: "approval_decision",
                evidence: { 
                  decision: input.decision, 
                  comment: input.comment, 
                  approvalId: approval.id 
                },
              },
              {
                versionId: approval.versionId,
                actor: ctx.userId,
                action: "approval_rejected",
                evidence: { reason: input.comment },
              },
            ],
          });
          return { versionId: approval.versionId, status: "DRAFT" };
        }

        const remainingPending = await tx.sopApproval.count({
          where: { 
            versionId: approval.versionId, 
            status: { not: "APPROVED" } 
          },
        });
        if (remainingPending === 0) {
          await tx.sopVersion.update({
            where: { id: approval.versionId },
            data: { 
              status: "PUBLISHED", 
              approvedBy: ctx.userId, 
              approvedAt: decidedAt 
            },
          });
          await tx.sop.update({ 
            where: { id: approval.version.sopId }, 
            data: { status: "PUBLISHED" } 
          });
          await tx.sopAuditEvent.createMany({
            data: [
              {
                versionId: approval.versionId,
                actor: ctx.userId,
                action: "approval_decision",
                evidence: { 
                  decision: input.decision, 
                  comment: input.comment, 
                  approvalId: approval.id 
                },
              },
              {
                versionId: approval.versionId,
                actor: ctx.userId,
                action: "all_approvals_granted",
                evidence: { approvalId: approval.id },
              },
              {
                versionId: approval.versionId,
                actor: "system",
                action: "auto_published",
                evidence: { timestamp: decidedAt.toISOString() },
              },
            ],
          });
          return { versionId: approval.versionId, status: "PUBLISHED" };
        }

        await tx.sopAuditEvent.create({
          data: {
            versionId: approval.versionId,
            actor: ctx.userId,
            action: "approval_decision",
            evidence: { 
              decision: input.decision, 
              comment: input.comment, 
              approvalId: approval.id 
            },
          },
        });
        return { versionId: approval.versionId, status: "IN_REVIEW" };
      });
    }),

  export: protectedProcedure
    .input(exportInputSchema)
    .mutation(async ({ ctx, input }) => {
      const sop = await prisma.sop.findFirst({
        where: { id: input.id, tenantId: ctx.tenantId },
      });
      if (!sop) throw toError("NOT_FOUND", "SOP not found");

      const version = await prisma.sopVersion.findFirst({
        where: { sopId: sop.id, version: input.version ?? sop.currentVersion },
      });
      if (!version) throw toError("NOT_FOUND", "SOP version not found");

      const cached = !input.refresh
        ? await prisma.sopArtifact.findFirst({ 
            where: { versionId: version.id, type: input.format as any } 
          })
        : null;
      if (cached) {
        return { 
          artifactId: cached.id, 
          format: input.format, 
          content: cached.content, 
          contentType: artifactContentType(input.format) 
        };
      }

      const structure = SopStructureSchema.parse(version.content);
      const content =
        input.format === "HTML"
          ? exportSopContentToHtml(structure)
          : input.format === "PDF"
            ? await exportSopContentToPdf(structure)
            : exportSopContentToMarkdown(structure);

      const artifact = await prisma.$transaction(async (tx: TxClient) => {
        const created = await tx.sopArtifact.create({
          data: {
            versionId: version.id,
            type: input.format as any,
            name: input.format,
            content,
          },
        });
        await tx.sopAuditEvent.create({
          data: {
            versionId: version.id,
            actor: ctx.userId,
            action: "export_generated",
            evidence: { format: input.format, artifactId: created.id },
          },
        });
        return created;
      });

      return { 
        artifactId: artifact.id, 
        format: input.format, 
        content, 
        contentType: artifactContentType(input.format) 
      };
    }),

  getMetrics: protectedProcedure.query(async ({ ctx }) => {
    const [sops, publishedVersions] = await Promise.all([
      prisma.sop.findMany({
        where: { tenantId: ctx.tenantId },
        select: { status: true, department: true, category: true },
      }),
      prisma.sopVersion.findMany({
        where: { status: "PUBLISHED", sop: { tenantId: ctx.tenantId } },
        select: { complianceScore: true, riskScore: true, auditReadinessScore: true },
      }),
    ]);

    const countBy = <T extends string>(items: T[]): Record<string, number> =>
      items.reduce<Record<string, number>>((acc, item) => {
        acc[item] = (acc[item] ?? 0) + 1;
        return acc;
      }, {});

    const average = (values: Array<number | null | undefined>): number => {
      const valid = values.filter((value): value is number => typeof value === "number");
      if (!valid.length) return 0;
      return Math.round(valid.reduce((sum, value) => sum + value, 0) / valid.length);
    };

    const statusCounts = countBy(sops.map((sop: { status: string }) => sop.status));
    const departmentCounts = countBy(sops.map((sop: { department: string }) => sop.department));
    const categoryCounts = countBy(sops.map((sop: { category: string }) => sop.category));

    return {
      status: Object.entries(statusCounts).map(([name, value]) => ({ name, value })),
      departments: Object.entries(departmentCounts).map(([name, value]) => ({ name, value })),
      categories: Object.entries(categoryCounts).map(([name, value]) => ({ name, value })),
      averages: {
        complianceScore: average(publishedVersions.map((version: { complianceScore: number | null }) => version.complianceScore)),
        riskScore: average(publishedVersions.map((version: { riskScore: number | null }) => version.riskScore)),
        auditReadinessScore: average(publishedVersions.map((version: { auditReadinessScore: number | null }) => version.auditReadinessScore)),
      },
    };
  }),

  getSystemMode: protectedProcedure.query(() => ({
    mode: hasLlmKey() ? "online" : "offline",
  })),
});

// ─── Helper function for PDF export ─────────────────────────────────────────

async function exportSopContentToPdf(structure: SopStructure): Promise<string> {
  return exportSopContentToMarkdown(structure);
}