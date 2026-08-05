// lib/pgvector-client.ts
import { Pool, PoolClient, QueryResult } from 'pg';

/**
 * Configuration for the PgVector client.
 * Reads from environment variables by default.
 */
export interface PgVectorConfig {
  connectionString?: string;
  host?: string;
  port?: number;
  user?: string;
  password?: string;
  database?: string;
  ssl?: boolean | { rejectUnauthorized: boolean };
}

/**
 * Represents a stored vector record with optional metadata.
 */
export interface VectorRecord<TMetadata = Record<string, any>> {
  id: string;
  vector: number[];
  metadata?: TMetadata;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Distance metric options for similarity search.
 */
export type DistanceMetric = 'cosine' | 'l2' | 'ip'; // ip = inner product

/**
 * PgVectorClient - a robust client for PostgreSQL with pgvector extension.
 * Supports storing, updating, deleting, and similarity search of vector embeddings.
 */
export class PgVectorClient {
  private pool: Pool;
  private initialized = false;

  constructor(config?: PgVectorConfig) {
    // Use connection string if provided, otherwise build from individual params
    if (config?.connectionString) {
      this.pool = new Pool({ connectionString: config.connectionString });
    } else {
      this.pool = new Pool({
        host: config?.host || process.env.PGVECTOR_HOST || 'localhost',
        port: config?.port || parseInt(process.env.PGVECTOR_PORT || '5432'),
        user: config?.user || process.env.PGVECTOR_USER || 'postgres',
        password: config?.password || process.env.PGVECTOR_PASSWORD || '',
        database: config?.database || process.env.PGVECTOR_DATABASE || 'postgres',
        ssl: config?.ssl ?? (process.env.PGVECTOR_SSL === 'true' ? { rejectUnauthorized: false } : false),
      });
    }

    // Optional: handle pool errors
    this.pool.on('error', (err) => {
      console.error('Unexpected pg pool error:', err);
    });
  }

  /**
   * Ensures the pgvector extension is enabled and creates a default vector table
   * if it does not exist. Call this once during app initialization.
   * @param tableName Optional table name to create (default: 'embeddings')
   * @param vectorDimensions Number of dimensions for the vector column (default: 1536)
   */
  async initialize(tableName: string = 'embeddings', vectorDimensions: number = 384): Promise<void> {
    if (this.initialized) return;

    const client = await this.pool.connect();
    try {
      await client.query('CREATE EXTENSION IF NOT EXISTS vector');
      // Create table with a vector column, metadata JSONB, and timestamps
      await client.query(`
        CREATE TABLE IF NOT EXISTS ${this.quoteIdentifier(tableName)} (
          id TEXT PRIMARY KEY,
          vector VECTOR(${vectorDimensions}),
          metadata JSONB,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        )
      `);
      // Create an index on the vector column for approximate nearest neighbor (IVFFlat or HNSW)
      // Using IVFFlat for simplicity; adjust to HNSW if needed (requires pgvector 0.5.0+)
      await client.query(`
        CREATE INDEX IF NOT EXISTS ${this.quoteIdentifier(`${tableName}_vector_idx`)}
        ON ${this.quoteIdentifier(tableName)} USING ivfflat (vector vector_cosine_ops)
        WITH (lists = 100)
      `);
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize pgvector:', error);
      throw new Error(`PgVector initialization failed: ${(error as Error).message}`);
    } finally {
      client.release();
    }
  }

  /**
   * Store or replace a vector embedding.
   * @param tableName Target table
   * @param id Unique identifier for the vector
   * @param vector Array of numbers (must match vector dimension)
   * @param metadata Optional JSON-serializable metadata
   */
  async upsert(
    tableName: string,
    id: string,
    vector: number[],
    metadata?: Record<string, any>
  ): Promise<void> {
    const client = await this.pool.connect();
    try {
      const query = `
        INSERT INTO ${this.quoteIdentifier(tableName)} (id, vector, metadata, updated_at)
        VALUES ($1, $2::vector, $3, NOW())
        ON CONFLICT (id) DO UPDATE
        SET vector = EXCLUDED.vector,
            metadata = EXCLUDED.metadata,
            updated_at = NOW()
      `;
      await client.query(query, [id, this.toPgVector(vector), metadata ? JSON.stringify(metadata) : null]);
    } finally {
      client.release();
    }
  }

  /**
   * Retrieve a vector record by ID.
   */
  async get(tableName: string, id: string): Promise<VectorRecord | null> {
    const client = await this.pool.connect();
    try {
      const res = await client.query(
        `SELECT id, vector, metadata, created_at as "createdAt", updated_at as "updatedAt"
         FROM ${this.quoteIdentifier(tableName)} WHERE id = $1`,
        [id]
      );
      if (res.rows.length === 0) return null;
      const row = res.rows[0];
      return {
        id: row.id,
        vector: this.fromPgVector(row.vector),
        metadata: row.metadata,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      };
    } finally {
      client.release();
    }
  }

  /**
   * Delete a vector record by ID.
   */
  async delete(tableName: string, id: string): Promise<boolean> {
    const client = await this.pool.connect();
    try {
      const res = await client.query(
        `DELETE FROM ${this.quoteIdentifier(tableName)} WHERE id = $1 RETURNING id`,
        [id]
      );
      return res.rowCount !== null && res.rowCount > 0;
    } finally {
      client.release();
    }
  }

  /**
   * Perform similarity search.
   * @param tableName Table to search
   * @param queryVector The query embedding
   * @param limit Maximum number of results
   * @param metric Distance metric: 'cosine', 'l2', or 'ip' (inner product)
   * @param filter Optional SQL WHERE clause (e.g., "metadata->>'category' = 'article'")
   * @returns Array of records with an added 'distance' field
   */
  async similaritySearch(
    tableName: string,
    queryVector: number[],
    limit: number = 10,
    metric: DistanceMetric = 'cosine',
    filter?: string
  ): Promise<(VectorRecord & { distance: number })[]> {
    const client = await this.pool.connect();
    try {
      const operator = this.getDistanceOperator(metric);
      // The order by uses the distance operator; we select the vector and compute distance again for output
      let sql = `
        SELECT id, vector, metadata, created_at as "createdAt", updated_at as "updatedAt",
               vector ${operator} $1::vector AS distance
        FROM ${this.quoteIdentifier(tableName)}
      `;
      const params: unknown[] = [this.toPgVector(queryVector)];
      if (filter) {
        sql += ` WHERE ${filter}`;
      }
      sql += ` ORDER BY vector ${operator} $1::vector LIMIT $2`;
      params.push(limit);

      const res = await client.query(sql, params);
      return res.rows.map((row) => ({
        id: row.id,
        vector: this.fromPgVector(row.vector),
        metadata: row.metadata,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        distance: parseFloat(row.distance),
      }));
    } finally {
      client.release();
    }
  }

  /**
   * Get the total count of vectors in a table.
   */
  async count(tableName: string, filter?: string): Promise<number> {
    const client = await this.pool.connect();
    try {
      let sql = `SELECT COUNT(*) FROM ${this.quoteIdentifier(tableName)}`;
      if (filter) sql += ` WHERE ${filter}`;
      const res = await client.query(sql);
      return parseInt(res.rows[0].count, 10);
    } finally {
      client.release();
    }
  }

  /**
   * Execute a raw query (advanced usage). Use with caution.
   */
  async query(text: string, params?: any[]): Promise<QueryResult> {
    const client = await this.pool.connect();
    try {
      return await client.query(text, params);
    } finally {
      client.release();
    }
  }

  /**
   * Close the connection pool (call on app shutdown).
   */
  async close(): Promise<void> {
    await this.pool.end();
  }

  // ------------------------- Private Helpers -------------------------

  private quoteIdentifier(identifier: string): string {
    return `"${identifier.replace(/"/g, '""')}"`;
  }

  private toPgVector(vector: number[]): string {
    return `[${vector.join(',')}]`;
  }

  private fromPgVector(pgVector: string | { toString(): string }): number[] {
    // pgvector returns vectors as a string like '[0.1,0.2,0.3]'
    const str = pgVector.toString();
    if (str.startsWith('[') && str.endsWith(']')) {
      return str.slice(1, -1).split(',').map(Number);
    }
    throw new Error(`Invalid vector format: ${str}`);
  }

  private getDistanceOperator(metric: DistanceMetric): string {
    switch (metric) {
      case 'cosine':
        return '<=>';
      case 'l2':
        return '<->';
      case 'ip':
        return '<#>';
      default:
        return '<=>';
    }
  }
}

// ------------------------- Singleton instance (optional) -------------------------
let globalClient: PgVectorClient | null = null;

/**
 * Get a singleton instance of PgVectorClient using default environment variables.
 * Useful for simple use cases.
 */
export function getPgVectorClient(): PgVectorClient {
  if (!globalClient) {
    globalClient = new PgVectorClient();
  }
  return globalClient;
}