<<<<<<< HEAD
// lib/rag.ts
=======
﻿// lib/rag.ts
>>>>>>> 237f310 (Add libraries, services and application logic)

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
<<<<<<< HEAD
=======
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
>>>>>>> 237f310 (Add libraries, services and application logic)
  metadata?: Record<string, any>;
}

/**
 * Retrieve relevant chunks from pgvector using cosine similarity.
<<<<<<< HEAD
 * Uses the 'embeddings' table with 384‑dim vectors.
=======
>>>>>>> 237f310 (Add libraries, services and application logic)
 */
async function retrieveVectorChunks(query: string, tenantId?: string): Promise<RagChunk[]> {
  try {
    const client = getPgVectorClient();
<<<<<<< HEAD
    // Ensure table exists with correct dimension
=======
>>>>>>> 237f310 (Add libraries, services and application logic)
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
<<<<<<< HEAD
      score: 1 - row.distance, // convert distance to similarity
=======
      score: 1 - row.distance,
>>>>>>> 237f310 (Add libraries, services and application logic)
      metadata: row.metadata,
    }));
  } catch (error) {
    console.warn('pgvector search failed, falling back to legacy:', error);
    return [];
  }
}

/**
<<<<<<< HEAD
 * Legacy fallback: search using prisma + manual embedding similarity
 * (simplified placeholder; implement as needed)
 */
async function retrieveLegacyChunks(query: string, tenantId?: string): Promise<RagChunk[]> {
  // Example: search employee records
=======
 * Legacy fallback: search using prisma employee records.
 */
async function retrieveLegacyChunks(query: string, tenantId?: string): Promise<RagChunk[]> {
>>>>>>> 237f310 (Add libraries, services and application logic)
  const employees = await prisma.employee.findMany({
    where: tenantId ? { tenantId } : undefined,
    take: TOP_K,
    select: { id: true, name: true, position: true, department: true },
  });
<<<<<<< HEAD
  return employees.map(emp => ({
=======
  return (employees as any[]).map((emp: any) => ({
>>>>>>> 237f310 (Add libraries, services and application logic)
    id: `emp-${emp.id}`,
    source: 'Employee',
    text: `${emp.name} - ${emp.position} (${emp.department})`,
    score: 0.5,
  }));
}

function buildContext(chunks: RagChunk[]): string {
  if (!chunks.length) return "No relevant HR records found.";
  return chunks
<<<<<<< HEAD
    .map((c, i) => `[${i+1}] (${c.source}, score=${c.score.toFixed(3)})\n${c.text}`)
=======
    .map((c, i) => `[${i + 1}] (${c.source}, score=${c.score.toFixed(3)})\n${c.text}`)
>>>>>>> 237f310 (Add libraries, services and application logic)
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
