-- Enable pgvector if not already (already done in migration, but safe)
CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================================================
-- Add RAG columns to the existing 'documents' table (from the migration)
-- ============================================================================

-- Add columns if they don't exist (idempotent)
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_name = 'documents'
  ) THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'documents' AND column_name = 'contentText') THEN
        ALTER TABLE documents ADD COLUMN "contentText" TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'documents' AND column_name = 'contentEmbedding') THEN
        ALTER TABLE documents ADD COLUMN "contentEmbedding" vector(1536);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'documents' AND column_name = 'metadata') THEN
        ALTER TABLE documents ADD COLUMN "metadata" JSONB DEFAULT '{}';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'documents' AND column_name = 'contentHash') THEN
        ALTER TABLE documents ADD COLUMN "contentHash" TEXT;
    END IF;
  END IF;
END $$;

-- Add FTS tsvector as a generated column (on "contentText")
-- and dependent indexes/functions.
-- Guard everything so this migration can be applied in Prisma shadow DB
-- even if the `documents` table doesn't exist in that shadow state.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_name = 'documents'
  ) THEN
    ALTER TABLE documents
      ADD COLUMN IF NOT EXISTS "searchVector" tsvector
      GENERATED ALWAYS AS (
        to_tsvector('english', COALESCE("contentText", ''))
      ) STORED;

    CREATE INDEX IF NOT EXISTS documents_hnsw_idx ON documents
      USING hnsw ("contentEmbedding" vector_cosine_ops);
    CREATE INDEX IF NOT EXISTS documents_fts_idx ON documents
      USING GIN ("searchVector");
    CREATE INDEX IF NOT EXISTS documents_hash_idx ON documents ("contentHash");
    CREATE INDEX IF NOT EXISTS documents_tenant_idx ON documents ("tenantId");

    -- ----------------------------------------------------------------------------
    -- Hybrid RRF search function (camelCase, vector(1536))
    -- ----------------------------------------------------------------------------
    CREATE OR REPLACE FUNCTION hybrid_search(
      query_embedding vector(1536),
      query_text TEXT,
      tenant_filter TEXT DEFAULT NULL
    )
    RETURNS TABLE (
      id TEXT,
      contentText TEXT,
      metadata JSONB,
      vector_rank INTEGER,
      fts_rank INTEGER,
      rrf_score DOUBLE PRECISION
    ) AS $BODY$
    BEGIN
      RETURN QUERY
      WITH vector_search AS (
        SELECT
          id, "contentText", "metadata",
          ROW_NUMBER() OVER (ORDER BY "contentEmbedding" <=> query_embedding) AS rank
        FROM documents
        WHERE (tenant_filter IS NULL OR "tenantId" = tenant_filter)
          AND "contentEmbedding" IS NOT NULL
        ORDER BY "contentEmbedding" <=> query_embedding
        LIMIT 100
      ),
      keyword_search AS (
        SELECT
          id, "contentText", "metadata",
          ROW_NUMBER() OVER (ORDER BY ts_rank_cd("searchVector", plainto_tsquery('english', query_text)) DESC) AS rank
        FROM documents
        WHERE "searchVector" @@ plainto_tsquery('english', query_text)
          AND (tenant_filter IS NULL OR "tenantId" = tenant_filter)
        LIMIT 100
      )
      SELECT
        COALESCE(v.id, k.id) AS id,
        COALESCE(v."contentText", k."contentText") AS "contentText",
        COALESCE(v."metadata", k."metadata") AS "metadata",
        v.rank AS vector_rank,
        k.rank AS fts_rank,
        (COALESCE(1.0/(60 + v.rank), 0) + COALESCE(1.0/(60 + k.rank), 0)) AS rrf_score
      FROM vector_search v FULL OUTER JOIN keyword_search k ON v.id = k.id
      ORDER BY rrf_score DESC;
    END;
    $BODY$ LANGUAGE plpgsql;
  END IF;
END $$;
