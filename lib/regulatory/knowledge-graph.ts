/**
 * Legal Knowledge Graph Engine
 *
 * Traverses the version-controlled legal knowledge graph stored in
 * `legal_authorities` + `knowledge_graph_edges`. Supports:
 *  - Node lookup (Acts, subsidiary legislation, circulars, guidelines)
 *  - Graph traversal (Act → subsidiary → guideline → procedure)
 *  - Effective-dating and superseded-version awareness
 *  - Authority hierarchy resolution
 */
import { prisma } from "@/lib/prisma";

export interface LegalGraphNode {
  id: string;
  authorityType: string;
  title: string;
  shortTitle?: string | null;
  referenceNo?: string | null;
  jurisdiction: string;
  country: string;
  status: string;
  effectiveDate?: Date | null;
  supersededById?: string | null;
  summary?: string | null;
  sourceUrl?: string | null;
}

export interface LegalGraphEdge {
  id: string;
  sourceId: string;
  targetId: string;
  edgeType: string;
  description?: string | null;
  weight: number;
}

export interface LegalGraphPath {
  nodes: LegalGraphNode[];
  edges: LegalGraphEdge[];
  /** Human-readable path description, e.g. Act → Regulation → Guideline */
  path: string;
}

/** Finds a legal authority by id, ref, or title. */
export async function findAuthority(params: {
  id?: string;
  referenceNo?: string;
  title?: string;
  country?: string;
}): Promise<LegalGraphNode | null> {
  const node = await prisma.legal_authorities.findFirst({
    where: {
      ...(params.id ? { id: params.id } : {}),
      ...(params.referenceNo ? { referenceNo: params.referenceNo } : {}),
      ...(params.title
        ? { title: { contains: params.title, mode: "insensitive" } }
        : {}),
      ...(params.country ? { country: params.country } : { country: "MY" }),
    },
    orderBy: { effectiveDate: "desc" },
  });
  return node ? toGraphNode(node) : null;
}

/** Returns the active (non-superseded, effective) authority at a point in time. */
export async function findEffectiveAuthority(
  authorityType: string,
  atDate: Date = new Date()
): Promise<LegalGraphNode[]> {
  const nodes = await prisma.legal_authorities.findMany({
    where: {
      authorityType: authorityType as any,
      status: "ACTIVE",
      OR: [
        { effectiveDate: { lte: atDate } },
        { effectiveDate: null },
      ],
    },
    orderBy: { effectiveDate: "desc" },
  });
  return nodes.map(toGraphNode);
}

/** Traverses the graph from a starting node following a given edge type. */
export async function traverseGraph(params: {
  startId: string;
  edgeType?: string;
  maxDepth?: number;
}): Promise<LegalGraphPath> {
  const { startId, edgeType, maxDepth = 5 } = params;
  const start = await prisma.legal_authorities.findUnique({ where: { id: startId } });
  if (!start) return { nodes: [], edges: [], path: "" };

  const nodes: LegalGraphNode[] = [toGraphNode(start)];
  const edges: LegalGraphEdge[] = [];
  const visited = new Set<string>([startId]);

  let frontier = [startId];
  for (let depth = 0; depth < maxDepth; depth++) {
    const nextFrontier: string[] = [];
    const foundEdges = await prisma.knowledge_graph_edges.findMany({
      where: {
        sourceId: { in: frontier },
        ...(edgeType ? { edgeType: edgeType as any } : {}),
        isActive: true,
      },
      orderBy: { weight: "desc" },
      take: 50,
    });

    for (const edge of foundEdges) {
      edges.push({
        id: edge.id,
        sourceId: edge.sourceId,
        targetId: edge.targetId,
        edgeType: edge.edgeType,
        description: edge.description,
        weight: edge.weight,
      });
      if (!visited.has(edge.targetId)) {
        visited.add(edge.targetId);
        const target = await prisma.legal_authorities.findUnique({
          where: { id: edge.targetId },
        });
        if (target) {
          nodes.push(toGraphNode(target));
          nextFrontier.push(edge.targetId);
        }
      }
    }
    frontier = nextFrontier;
  }

  const path = edges
    .map((e) => `${edgeLabel(e.edgeType)}`)
    .join(" → ");

  return { nodes, edges, path };
}

/** Resolves the full hierarchy chain for an authority (parent chain). */
export async function resolveHierarchy(authorityId: string): Promise<LegalGraphNode[]> {
  const chain: LegalGraphNode[] = [];
  const visited = new Set<string>();
  let current = await prisma.legal_authorities.findUnique({ where: { id: authorityId } });

  while (current && !visited.has(current.id)) {
    visited.add(current.id);
    chain.unshift(toGraphNode(current));
    if (!current.parentId) break;
    current = await prisma.legal_authorities.findUnique({ where: { id: current.parentId } });
  }
  return chain;
}

/** Returns the effective/superseded versions of an authority. */
export async function getVersionHistory(authorityId: string) {
  const current = await prisma.legal_authorities.findUnique({ where: { id: authorityId } });
  if (!current) return { current: null, supersededBy: null, previous: null };

  const supersededBy = current.supersededById
    ? await prisma.legal_authorities.findUnique({ where: { id: current.supersededById } })
    : null;

  const previous = await prisma.legal_authorities.findFirst({
    where: { supersededById: current.id },
  });

  return { current, supersededBy, previous };
}

function toGraphNode(node: any): LegalGraphNode {
  return {
    id: node.id,
    authorityType: node.authorityType,
    title: node.title,
    shortTitle: node.shortTitle,
    referenceNo: node.referenceNo,
    jurisdiction: node.jurisdiction,
    country: node.country,
    status: node.status,
    effectiveDate: node.effectiveDate,
    supersededById: node.supersededById,
    summary: node.summary,
    sourceUrl: node.sourceUrl,
  };
}

function edgeLabel(edgeType: string): string {
  const map: Record<string, string> = {
    AMENDS: "Amends",
    IMPLEMENTS: "Implements",
    GUIDED_BY: "Guided by",
    DERIVED_FROM: "Derived from",
    SUPERSEDES: "Supersedes",
    REFERENCES: "References",
    PROCEDURE_OF: "Procedure of",
  };
  return map[edgeType] ?? edgeType;
}

