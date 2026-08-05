import { embed } from './embedding';
import { z } from 'zod';

// ─── Types ─────────────────────────────────────────────────────────────

export interface KnowledgeDocument {
  id: string;
  tenantId: string;
  title: string;
  content: string;
  url?: string;
  metadata?: Record<string, unknown>;
}

export interface SearchResult {
  id: string;
  title: string;
  content: string;
  url?: string;
  score: number;
}

export interface SearchOptions {
  tenantId?: string;
  limit?: number;
  minScore?: number;
  filters?: Record<string, unknown>;
}

// ─── In‑memory store (replace with real vector DB) ──────────────────

// Example seed data – in production, this would be loaded from your database.
const seedDocuments: KnowledgeDocument[] = [
  {
    id: 'sop-001',
    tenantId: 'default',
    title: 'HR Policy: Leave Entitlement',
    content: 'All employees are entitled to 14 days of annual leave per year. Sick leave: 14 days. Public holidays: 11 days.',
    url: '/policies/leave',
  },
  {
    id: 'sop-002',
    tenantId: 'default',
    title: 'Payroll: Salary Calculation',
    content: 'Salary is calculated based on monthly basic pay, allowances, and deductions including EPF (11%), SOCSO, and PCB.',
    url: '/policies/payroll',
  },
  {
    id: 'sop-003',
    tenantId: 'default',
    title: 'Foreign Worker: Work Permit Renewal',
    content: 'Work permit renewal must be submitted to Immigration 60 days before expiry. Required documents: passport, medical check, insurance.',
    url: '/policies/foreign-worker',
  },
];

// In‑memory vector store: we'll store embeddings alongside documents.
// In production, use a real vector DB.
let documentStore: Array<{ doc: KnowledgeDocument; embedding: number[] }> = [];

// Initialize with seed data (async to allow embedding generation)
async function initializeStore() {
  if (documentStore.length > 0) return;
  for (const doc of seedDocuments) {
    const embedding = await embed(doc.content);
    documentStore.push({ doc, embedding });
  }
}

// ─── Public API ────────────────────────────────────────────────────────

/**
 * Search the knowledge base for documents relevant to the query.
 *
 * @param query – the user's search query
 * @param options – tenant ID, limit, minimum score, filters
 * @returns array of search results sorted by relevance
 */
export async function searchKnowledgeBase(
  query: string,
  options: SearchOptions = {}
): Promise<SearchResult[]> {
  const { tenantId, limit = 5, minScore = 0.3, filters } = options;

  await initializeStore();

  // Generate embedding for the query
  const queryEmbedding = await embed(query);

  // Compute cosine similarity against each document
  const results = documentStore
    .filter((item) => {
      // Tenant isolation: only include docs for the tenant (or global if no tenantId)
      if (tenantId && item.doc.tenantId !== tenantId) return false;
      // Apply additional filters if needed
      if (filters) {
        for (const [key, value] of Object.entries(filters)) {
          if (item.doc.metadata?.[key] !== value) return false;
        }
      }
      return true;
    })
    .map((item) => {
      const score = cosineSimilarity(queryEmbedding, item.embedding);
      return {
        ...item.doc,
        score,
      };
    })
    .filter((item) => item.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return results;
}

// ─── Helper: Cosine Similarity ────────────────────────────────────────

function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must have the same length');
  }
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

// ─── Admin: Add documents ─────────────────────────────────────────────

/**
 * Add a document to the knowledge base (for admin use).
 */
export async function addDocument(doc: KnowledgeDocument) {
  const embedding = await embed(doc.content);
  documentStore.push({ doc, embedding });
}

/**
 * Remove a document by ID.
 */
export function removeDocument(id: string) {
  documentStore = documentStore.filter((item) => item.doc.id !== id);
}

/**
 * List all documents (for debugging).
 */
export function listDocuments() {
  return documentStore.map((item) => item.doc);
}