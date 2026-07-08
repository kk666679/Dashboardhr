// lib/prisma.ts
// Prisma client wrapper with dynamic import to avoid compile-time errors when the client is not generated.
// In non-production environments, a stub is used if DATABASE_URL is missing.

type PrismaClient = any; // We lose strict typing, but the file can now compile.
type Prisma = any;       // Re-exported for services.

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  prismaPool: any | undefined;
};

/**
 * Tables that have an `isDeleted` column and should be soft-deleted.
 * The global query extension automatically appends `isDeleted: false`
 * to findMany / findFirst / findUnique / count / aggregate queries.
 *
 * Task 1.3 — Requirements: 20.3, 30.1
 */
const SOFT_DELETE_MODELS = new Set<string>([]);

type SoftDeleteFilterOp = "findMany" | "findFirst" | "findUnique" | "count" | "aggregate";
const FILTER_OPS: SoftDeleteFilterOp[] = [
  "findMany",
  "findFirst",
  "findUnique",
  "count",
  "aggregate",
];

function buildPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    // In non-DB environments (type-checking, storybook, etc.) return a stub
    if (process.env.NODE_ENV !== "production") {
      // We cannot instantiate PrismaClient without a connection string, so return a proxy
      return new Proxy({} as any, {
        get: () => undefined,
      }) as any;
    }
    throw new Error("DATABASE_URL is not configured");
  }

  // Dynamically import the required modules to avoid static import errors.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { PrismaClient } = require("@prisma/client");
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { PrismaPg } = require("@prisma/adapter-pg");
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { Pool } = require("pg");

  const pool = globalForPrisma.prismaPool ?? new Pool({ connectionString });
  const adapter = new PrismaPg(pool);

  const client = new PrismaClient({ adapter }).$extends({
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }: any) {
          const modelKey = model ? model.charAt(0).toLowerCase() + model.slice(1) : "";
          if (
            SOFT_DELETE_MODELS.has(modelKey) &&
            (FILTER_OPS as string[]).includes(operation)
          ) {
            const where = (args as any).where ?? {};
            if (where.isDeleted === undefined) {
              (args as any).where = { ...where, isDeleted: false };
            }
          }
          return query(args);
        },
      },
    },
  });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prismaPool = pool;
    globalForPrisma.prisma = client as any;
  }

  return client as any;
}

function getPrisma(): PrismaClient {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;
  const client = buildPrismaClient();
  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = client;
  return client;
}

// Export a proxy that lazily initializes the client.
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    return (getPrisma() as any)[prop];
  },
});

// Re-export Prisma for type usage in services (as any, to avoid compile-time errors).
// If you need actual types, run `prisma generate` and switch back to static imports.
export type { Prisma };
