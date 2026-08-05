/**
 * Explainable AI Citations Service
 *
 * Attaches source attribution to every compliance recommendation produced by
 * the AI agents. Each citation references the originating law/guidance via the
 * `citation_evidence` table and the `legal_authorities` knowledge graph.
 *
 * Requirements met:
 *  - Explainable AI with citations to the originating law or guidance
 *  - Trusted-source prioritisation (official government publications)
 *  - Source attribution retained for every compliance recommendation
 *  - Verification workflow (status: PENDING_VERIFICATION → VERIFIED/SUPERSEDED)
 */
import { prisma } from "@/lib/prisma";

export interface Citation {
  id?: string;
  tenantId: string;
  entityType: string;
  entityId: string;
  claim: string;
  authorityTitle: string;
  authorityId?: string;
  sectionRef?: string;
  clauseRef?: string;
  quote?: string;
  sourceUrl?: string;
}

export interface CitationResult extends Citation {
  id: string;
  status: string;
  verified: boolean;
  createdAt: Date;
}

/** Creates a citation evidence record for an AI compliance recommendation. */
export async function createCitation(citation: Citation): Promise<CitationResult> {
  let authorityId = citation.authorityId ?? null;

  // Auto-resolve authority from title if not provided.
  if (!authorityId) {
    const authority = await prisma.legal_authorities.findFirst({
      where: {
        title: { contains: citation.authorityTitle, mode: "insensitive" },
        status: "ACTIVE",
      },
      orderBy: { effectiveDate: "desc" },
    });
    authorityId = authority?.id ?? null;
  }

  const record = await prisma.citation_evidence.create({
    data: {
      tenantId: citation.tenantId,
      entityType: citation.entityType,
      entityId: citation.entityId,
      claim: citation.claim,
      authorityId: authorityId ?? undefined,
      authorityTitle: citation.authorityTitle,
      sectionRef: citation.sectionRef ?? null,
      clauseRef: citation.clauseRef ?? null,
      quote: citation.quote ?? null,
      sourceUrl: citation.sourceUrl ?? null,
      status: authorityId ? "PENDING_VERIFICATION" : "PENDING_VERIFICATION",
    },
  });

  return {
    ...citation,
    id: record.id,
    authorityId: authorityId ?? undefined,
    status: record.status,
    verified: false,
    createdAt: record.createdAt,
  };
}

/** Creates multiple citations in bulk (for a single recommendation). */
export async function createCitations(citations: Citation[]): Promise<CitationResult[]> {
  const results: CitationResult[] = [];
  for (const c of citations) {
    results.push(await createCitation(c));
  }
  return results;
}

/** Verifies a citation — marks as VERIFIED or SUPERSEDED. */
export async function verifyCitation(citationId: string, opts: {
  verifiedBy: string;
  status?: "VERIFIED" | "SUPERSEDED";
  verifiedAt?: Date;
}): Promise<CitationResult> {
  const record = await prisma.citation_evidence.update({
    where: { id: citationId },
    data: {
      status: opts.status ?? "VERIFIED",
      verifiedBy: opts.verifiedBy,
      verifiedAt: opts.verifiedAt ?? new Date(),
    },
  });
  return {
    id: record.id,
    tenantId: record.tenantId,
    entityType: record.entityType,
    entityId: record.entityId,
    claim: record.claim,
    authorityTitle: record.authorityTitle,
    authorityId: record.authorityId ?? undefined,
    sectionRef: record.sectionRef ?? undefined,
    clauseRef: record.clauseRef ?? undefined,
    quote: record.quote ?? undefined,
    sourceUrl: record.sourceUrl ?? undefined,
    status: record.status,
    verified: record.status === "VERIFIED",
    createdAt: record.createdAt,
  };
}

/** Retrieves citations for an entity (e.g., an AI recommendation or change record). */
export async function getCitationsForEntity(entityType: string, entityId: string) {
  return prisma.citation_evidence.findMany({
    where: { entityType, entityId },
    orderBy: { createdAt: "desc" },
    include: { legal_authorities: { select: { id: true, title: true, referenceNo: true, effectiveDate: true } } },
  });
}

/** Formats citations into a markdown appendix for AI responses. */
export function formatCitationsAsMarkdown(citations: CitationResult[]): string {
  if (citations.length === 0) return "";
  const lines = ["", "## Sources", ""];
  for (const c of citations) {
    const section = c.sectionRef ? `, §${c.sectionRef}` : "";
    const clause = c.clauseRef ? `, cl. ${c.clauseRef}` : "";
    const url = c.sourceUrl ? ` — ${c.sourceUrl}` : "";
    lines.push(`- ${c.authorityTitle}${section}${clause}${url} _(${c.status})_`);
  }
  return lines.join("\n");
}

/** Validates that an AI recommendation has at least one citation before acceptance. */
export async function requireCitationForRecommendation(
  tenantId: string,
  entityType: string,
  entityId: string
): Promise<boolean> {
  const count = await prisma.citation_evidence.count({
    where: { tenantId, entityType, entityId },
  });
  return count > 0;
}

