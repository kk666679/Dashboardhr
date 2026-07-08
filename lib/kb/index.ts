import { embed, cosineSimilarity } from '../embeddings';
import type { KbDocument, KbSearchQuery, KbSearchResult, KbStore } from './types';

type TenantId = string;

/**
 * Global KB Vector Store - in-memory singleton.
 * Loaded via loader.ts, upserted via ingest API.
 * SERVER-ONLY reads/writes; expose read-only search for client if needed.
 */
declare global {
  var __kbStore: KbStore | undefined;
}

const kbStore: KbStore = globalThis.__kbStore ??= new Map();

globalThis.__kbStore = kbStore;

/**
 * Upsert document to store (dedupe by ID).
 */
export async function upsertKbDocument(doc: Omit<KbDocument, 'embedding'> & { embedding?: number[] }): Promise<void> {
  const embedding = doc.embedding ?? await embed(doc.content);
  const fullDoc: KbDocument = {
    ...doc,
    embedding,
    metadata: {
      ...doc.metadata,
      createdAt: doc.metadata.createdAt ?? new Date(),
    },
  };
  kbStore.set(fullDoc.id, fullDoc);
}

/**
 * Delete document by ID.
 */
export function deleteKbDocument(id: string): boolean {
  return kbStore.delete(id);
}

/**
 * Semantic search: embed query → cosine top-K.
 */
export async function searchKb({ query, topK = 5, minScore = 0.3, tenantId }: KbSearchQuery): Promise<KbSearchResult[]> {
  if (kbStore.size === 0) {
    return [];
  }

  const queryEmbedding = await embed(query);
  const candidates = Array.from(kbStore.values())
    .filter(doc => !tenantId || doc.metadata.tenantId === tenantId);

  const scored = await Promise.all(
    candidates.map(async (doc): Promise<KbSearchResult> => ({
      ...doc,
      score: await cosineSimilarity(queryEmbedding, doc.embedding),
    })),
  );

  return scored
    .filter(r => r.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

/**
 * Get all docs (paginated, optional filter).
 */
export function getAllKbDocs(limit = 100, tenantId?: TenantId): KbDocument[] {
  return Array.from(kbStore.values())
    .filter(doc => !tenantId || doc.metadata.tenantId === tenantId)
    .slice(0, limit);
}

/**
 * Store stats.
 */
export function kbStats() {
  return {
    totalDocs: kbStore.size,
    avgEmbeddingDim: kbStore.size > 0 ? kbStore.values().next().value.embedding.length : 0,
  };
}

// Preload hook for API routes
export async function preloadKb() {
  // Loader will populate; this ensures store init
  return kbStats();
}

