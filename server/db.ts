/**
 * @deprecated  Use `lib/prisma.ts` instead.
 *
 * This singleton does NOT use the `@prisma/adapter-pg` connection-pool
 * adapter, so it creates a direct connection per request, which can exhaust
 * PostgreSQL's connection limit under load.
 *
 * The canonical Prisma singleton with pg-pool is at:
 *   import { prisma } from "@/lib/prisma"
 *
 * This file is kept to avoid breaking any existing imports, but new code
 * should always use `lib/prisma.ts`.
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require("@prisma/client") as { PrismaClient: new (...args: unknown[]) => unknown };

type PrismaClientType = InstanceType<typeof PrismaClient>;

// Define the global type safely
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClientType | undefined;
}

// Type-safe global reference
const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClientType;
};

// Create a singleton instance with proper logging based on environment
function createPrismaClient(): PrismaClientType {
  const isDevelopment = process.env.NODE_ENV === "development";
  const isTest = process.env.NODE_ENV === "test";

  const logOptions: Array<"query" | "info" | "warn" | "error"> = [];

  if (isDevelopment) {
    logOptions.push("query", "error", "warn");
  } else if (isTest) {
    logOptions.push("error");
  } else {
    logOptions.push("error");
  }

  return new (PrismaClient as any)({ log: logOptions });
}

// Export the singleton instance
export const prisma: PrismaClientType = globalForPrisma.prisma ?? createPrismaClient();

// In development, store in global to prevent multiple instances during hot reloading
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Default export for convenience
export default prisma;

// Optional: Add graceful shutdown
if (process.env.NODE_ENV === "production") {
  process.on("beforeExit", async () => {
    await (prisma as any).$disconnect();
  });

  process.on("SIGINT", async () => {
    await (prisma as any).$disconnect();
    process.exit(0);
  });

  process.on("SIGTERM", async () => {
    await (prisma as any).$disconnect();
    process.exit(0);
  });
}
