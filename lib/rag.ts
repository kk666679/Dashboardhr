// lib/rag.ts

import { embed } from "@/lib/embeddings";
import { reasonWithOllama } from "@/server/agents/ollama";
import { prisma } from "@/lib/prisma";
import type { AgentPersona } from "@/server/agents/prompts";
import { getPgVectorClient, type VectorRecord } from "@/lib/pgvector-client";

const TOP_K = 5;
const VECTOR_DIM = 384; // xenova/all-MiniLM-L6-v2

export interface RagChunk {
  id: string;
  source: string;
  text: string;
  score: number;
  metadata?: Record<string, any>;
}

/**
 * Retrieve relevant chunks from pgvector using cosine similarity.
 * Uses the 'embeddings' table with 384‑dim vectors.
 */
async function retrieveVectorChunks(query: string, tenantId?: string): Promise<RagChunk[]> {
  try {
    const client = getPgVectorClient();
    // Ensure table exists with correct dimension
    await client.initialize('embeddings', VECTOR_DIM);

    const queryVector = await embed(query);
    const results = await client.similaritySearch(
      'embeddings',
      queryVector,
      TOP_K,
      'cosine',
      tenantId ? `metadata->>'tenantId' = '${tenantId}'` : undefined
    );

    return results.map((row: VectorRecord & { distance: number }) => ({
      id: row.id,
      source: row.metadata?.source || `embedding:${row.id.slice(0, 8)}`,
      text: row.metadata?.content || '[No content stored]',
      score: 1 - row.distance, // convert distance to similarity
      metadata: row.metadata,
    }));
  } catch (error) {
    console.warn('pgvector search failed, falling back to legacy:', error);
    return [];
  }
}

/**
 * Legacy fallback: search using prisma + manual embedding similarity
 * (simplified placeholder; implement as needed)
 */
async function retrieveLegacyChunks(query: string, tenantId?: string): Promise<RagChunk[]> {
  // Example: search employee records
  const employees = await prisma.employee.findMany({
    where: tenantId ? { tenantId } : undefined,
    take: TOP_K,
    select: { id: true, name: true, position: true, department: true },
  });
  return employees.map(emp => ({
    id: `emp-${emp.id}`,
    source: 'Employee',
    text: `${emp.name} - ${emp.position} (${emp.department})`,
    score: 0.5,
  }));
}

function buildContext(chunks: RagChunk[]): string {
  if (!chunks.length) return "No relevant HR records found.";
  return chunks
    .map((c, i) => `[${i+1}] (${c.source}, score=${c.score.toFixed(3)})\n${c.text}`)
    .join("\n\n");
}

export interface RagResult {
  answer: string;
  chunks: RagChunk[];
  context: string;
  provider: "ollama";
}

export async function ragQuery(
  query: string,
  options: { tenantId?: string; persona?: AgentPersona } = {},
): Promise<RagResult> {
  const { tenantId, persona = "orchestrator" } = options;

  let chunks = await retrieveVectorChunks(query, tenantId);
  if (chunks.length === 0) {
    chunks = await retrieveLegacyChunks(query, tenantId);
  }

  const context = buildContext(chunks);
  const answer = await reasonWithOllama(query, context, persona);

  return { answer, chunks, context, provider: "ollama" };
}
