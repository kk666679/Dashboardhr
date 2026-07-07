-- Enable pgvector if not already (already in datasource)
-- CREATE EXTENSION IF NOT EXISTS vector;

-- Documents table for RAG chunks
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id TEXT REFERENCES tenants(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    embedding vector(384),
    metadata JSONB DEFAULT '{}',
    content_hash TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- FTS tsvector
ALTER TABLE documents 
ADD COLUMN search_vector tsvector 
GENERATED ALWAYS AS (to_tsvector('english', content)) STORED;

-- Indexes
CREATE INDEX documents_hnsw_idx ON documents USING hnsw (embedding vector_cosine_ops);
CREATE INDEX documents_fts_idx ON documents USING GIN(search_vector);
CREATE INDEX documents_hash_idx ON documents (content_hash);
CREATE INDEX documents_tenant_idx ON documents (tenant_id);

-- Function for hybrid RRF search (used from TS)
CREATE OR REPLACE FUNCTION hybrid_search(
  query_embedding vector(384),
  query_text TEXT,
  tenant_filter TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  content TEXT,
  metadata JSONB,
  vector_rank INTEGER,
  fts_rank INTEGER,
  rrf_score DOUBLE PRECISION
) AS $$
BEGIN
  RETURN QUERY
  WITH vector_search AS (
    SELECT 
      id, content, metadata,
      ROW_NUMBER() OVER (ORDER BY embedding <=> query_embedding) AS rank
    FROM documents
    WHERE (tenant_filter IS NULL OR tenant_id = tenant_filter)
    ORDER BY embedding <=> query_embedding
    LIMIT 100
  ),
  keyword_search AS (
    SELECT 
      id, content, metadata,
      ROW_NUMBER() OVER (ORDER BY ts_rank_cd(search_vector, plainto_tsquery('english', query_text)) DESC) AS rank
    FROM documents
    WHERE search_vector @@ plainto_tsquery('english', query_text)
      AND (tenant_filter IS NULL OR tenant_id = tenant_filter)
    LIMIT 100
  )
  SELECT
    COALESCE(v.id, k.id) AS id,
    COALESCE(v.content, k.content) AS content,
    COALESCE(v.metadata, k.metadata) AS metadata,
    v.rank AS vector_rank,
    k.rank AS fts_rank,
    (COALESCE(1.0/(60 + v.rank), 0) + COALESCE(1.0/(60 + k.rank), 0)) AS rrf_score
  FROM vector_search v FULL OUTER JOIN keyword_search k ON v.id = k.id
  ORDER BY rrf_score DESC;
END;
$$ LANGUAGE plpgsql;

