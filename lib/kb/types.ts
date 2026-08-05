type TenantId = string;

/**
 * KB Document structure - chunked, embedded ISO clauses + ingested docs.
 * SERVER + CLIENT compatible.
 */
export interface KbDocument {
  id: string;
  content: string;
  metadata: {
    source?: string;
    standard?: string;
    clause?: string;
    title?: string;
    tenantId?: TenantId;
    createdAt: Date;
  };
  embedding: number[];
}

/**
 * KB Search Query/Result
 */
export interface KbSearchQuery {
  query: string;
  topK?: number;
  minScore?: number;
  tenantId?: TenantId;
}

export interface KbSearchResult extends KbDocument {
  score: number;
}

export type KbStore = Map<string, KbDocument>;

