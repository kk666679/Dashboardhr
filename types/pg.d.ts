// Ambient declaration for the `pg` (node-postgres) module.
// `pg` ships CommonJS/ESM JavaScript without bundled type declarations.
// This covers the subset of the API used by lib/pgvector-client.ts and lib/prisma.ts.

declare module "pg" {
  export interface PoolConfig {
    connectionString?: string;
    host?: string;
    port?: number;
    user?: string;
    password?: string;
    database?: string;
    ssl?: boolean | Record<string, unknown> | { rejectUnauthorized: boolean };
    max?: number;
    idleTimeoutMillis?: number;
    connectionTimeoutMillis?: number;
    application_name?: string;
    [key: string]: unknown;
  }

  export interface QueryResult<R extends Record<string, any> = Record<string, any>> {
    command: string;
    rowCount: number | null;
    oid: number;
    rows: R[];
    fields: Array<{ name: string; tableID: number; columnID: number; dataTypeID: number; dataTypeSize: number; dataTypeModifier: number; format: string }>;
    [key: string]: unknown;
  }

  export interface QueryConfig {
    text: string;
    values?: unknown[];
    name?: string;
    rowMode?: "array";
  }

  export interface PoolClient {
    query<R extends Record<string, any> = Record<string, any>>(
      queryTextOrConfig: string | QueryConfig,
      values?: unknown[],
    ): Promise<QueryResult<R>>;
    release(err?: Error | boolean): void;
    connect(): Promise<PoolClient>;
    on(event: string, listener: (...args: any[]) => void): this;
    once(event: string, listener: (...args: any[]) => void): this;
    removeListener(event: string, listener: (...args: any[]) => void): this;
    end(): Promise<void>;
    escapeIdentifier(str: string): string;
    escapeLiteral(str: string): string;
  }

  export class Pool {
    constructor(config?: PoolConfig);
    connect(): Promise<PoolClient>;
    query<R extends Record<string, any> = Record<string, any>>(
      queryTextOrConfig: string | QueryConfig,
      values?: unknown[],
    ): Promise<QueryResult<R>>;
    on(event: string, listener: (...args: any[]) => void): this;
    once(event: string, listener: (...args: any[]) => void): this;
    removeListener(event: string, listener: (...args: any[]) => void): this;
    end(): Promise<void>;
    totalCount: number;
    idleCount: number;
    waitingCount: number;
  }
}

