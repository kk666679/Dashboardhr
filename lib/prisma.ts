// lib/prisma.ts
// Prisma client wrapper with Prisma Client extensions (Prisma 7 compatible).
// In non-production environments, a stub is used if DATABASE_URL is missing.

import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { AsyncLocalStorage } from 'async_hooks';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyPrisma = any;

// Dynamic require so TypeScript doesn't error before `prisma generate`
// eslint-disable-next-line @typescript-eslint/no-require-imports
const prismaClientModule = require('@prisma/client') as {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  PrismaClient?: new (opts?: any) => any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Prisma?: { defineExtension: (ext: any) => any };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PrismaClientCtor: new (opts?: any) => any =
  prismaClientModule.PrismaClient ??
  // Fallback no-op constructor when client is not yet generated
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (class { constructor(_opts?: any) {} } as any);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Prisma: { defineExtension: (ext: any) => any } = prismaClientModule.Prisma ?? {
  defineExtension: (ext: AnyPrisma) => ext,
};

// Re-export Prisma namespace type for consumers (e.g. levy.ts)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type { AnyPrisma as Prisma };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PrismaClientType = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PrismaClientCtor = any;

// ============================================================================
// Global state (for development hot-reloading)
// ============================================================================

const globalForPrisma = globalThis as unknown as {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prisma: any;
  prismaPool: Pool | undefined;
};

// ============================================================================
// Tenant isolation context (AsyncLocalStorage)
// ============================================================================

export const tenantContext = new AsyncLocalStorage<{ tenantId: string }>();

// ============================================================================
// Configuration constants
// ============================================================================

/**
 * Models that have a `deletedAt` column and should be soft-deleted.
 * The global query extension automatically appends `deletedAt: null`
 * to findMany / findFirst / findUnique / count / aggregate queries.
 */
const SOFT_DELETE_MODELS = new Set<string>([
  'vectorDocument', 'tenant', 'complianceRule', 'user', 'featureFlag',
  'orgNode', 'employee', 'document', 'visa', 'expatriate', 'contract',
  'payroll', 'payrollRun', 'payrollLineItem', 'leavePolicy', 'leaveBalance',
  'workflowDefinition', 'workflowInstance', 'workflowInstanceStep',
  'notificationPreference', 'notification', 'attendance', 'termination',
  'geofence', 'sop', 'candidate', 'exitInterview', 'clearanceChecklist',
  'clearanceItem', 'clearanceInstance', 'clearanceTask', 'knowledgeTransfer',
  'assetReturn', 'assetReturnItem', 'finalSettlement', 'finalSettlementLineItem',
  'accessRevocation', 'accessRevocationRequest', 'alumniProfile',
  'union', 'collectiveBargaining', 'dispute', 'grievance', 'conductIssue',
  'disciplinaryAction', 'travelRequest', 'travelExpense', 'travelPolicy',
  'incident', 'inspection', 'safetyTraining', 'dataPolicy', 'dataClassification',
  'complianceCheck', 'headcountPlan', 'workforceBudget', 'workforceForecast',
  'course', 'learningPath', 'courseAssignment', 'assessment', 'certification',
  'compensationCycle', 'bonusPlan', 'incentivePlan', 'equityAwardDefinition',
  'equityGrant', 'meritIncrease', 'payout', 'payoutLineItem',
  'salaryBenchmarkSource', 'salaryBenchmarkRun', 'salaryReviewDraft',
  'employeeProfile', 'employeeLifecycle', 'employeeOnboarding', 'accommodation',
  'claim', 'claimItem', 'asset', 'fomema', 'mssDelegation', 'flag',
  'leaveApplication', 'onboardingChecklist', 'onboardingTask',
]);

type SoftDeleteFilterOp = 'findMany' | 'findFirst' | 'findUnique' | 'count' | 'aggregate';
const FILTER_OPS: SoftDeleteFilterOp[] = ['findMany', 'findFirst', 'findUnique', 'count', 'aggregate'];

/**
 * Models that should NEVER be updated/deleted (append-only).
 * CRITICAL-3: SOC 2 / ISO 27001 — Audit log immutability
 */
const APPEND_ONLY_MODELS = new Set<string>(['AuditTrail']);

// ============================================================================
// Client factory
// ============================================================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildPrismaClient(): any {
  const connectionString = process.env.ORM_PRISMA_URL ?? process.env.DATABASE_URL;
  if (!connectionString) {
    // In non-DB environments (type-checking, storybook, etc.) return a stub
    if (process.env.NODE_ENV !== 'production') {
      return new Proxy({}, {
        get: () => () => undefined,
      });
    }
    throw new Error('DATABASE_URL is not configured');
  }

  // Reuse pool across hot-reloads in development
  const pool = globalForPrisma.prismaPool ?? new Pool({ connectionString });
  globalForPrisma.prismaPool = pool;
  const adapter = new PrismaPg(pool);

  const client = new PrismaClientCtor({ adapter });

  // ==========================================================================
  // AUDIT TRAIL IMMUTABILITY EXTENSION
  // ==========================================================================
  // Rejects any UPDATE or DELETE on append-only models using query extension.
  const immutable = Prisma.defineExtension({
    name: 'auditTrailImmutability',
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }: {
          model: string | undefined;
          operation: string;
          args: Record<string, unknown>;
          query: (args: Record<string, unknown>) => Promise<unknown>;
        }) {
          if (
            model &&
            APPEND_ONLY_MODELS.has(model) &&
            (operation.startsWith('update') || operation.startsWith('delete'))
          ) {
            throw new Error(
              `[IMMUTABLE] ${model} is append-only (SOC 2 / ISO 27001). ` +
                `Operation "${operation}" is not permitted. ` +
                `Only CREATE and SELECT operations are allowed.`,
            );
          }
          return query(args);
        },
      },
    },
  });

  // ==========================================================================
  // SOFT-DELETE FILTER EXTENSION
  // ==========================================================================
  const softDelete = Prisma.defineExtension({
    name: 'softDeleteFilter',
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }: {
          model: string | undefined;
          operation: string;
          args: Record<string, unknown>;
          query: (args: Record<string, unknown>) => Promise<unknown>;
        }) {
          const modelKey = model
            ? model.charAt(0).toLowerCase() + model.slice(1)
            : '';
          if (
            SOFT_DELETE_MODELS.has(modelKey) &&
            FILTER_OPS.includes(operation as SoftDeleteFilterOp)
          ) {
            if (!args) args = {};
            if (!args.where) args.where = {};
            const where = args.where as Record<string, unknown>;
            if (where.deletedAt === undefined) {
              where.deletedAt = null;
            }
          }
          return query(args);
        },
      },
    },
  });

  // ==========================================================================
  // TENANT ISOLATION EXTENSION
  // ==========================================================================
  // Automatically injects `tenantId` from AsyncLocalStorage into all queries.
  const tenantIsolation = Prisma.defineExtension({
    name: 'tenantIsolation',
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }: {
          model: string | undefined;
          operation: string;
          args: Record<string, unknown>;
          query: (args: Record<string, unknown>) => Promise<unknown>;
        }) {
          const store = tenantContext.getStore();
          if (store?.tenantId && model) {
            if (operation === 'create' || operation === 'createMany') {
              if (!args) args = {};
              if (!args.data) args.data = {};
              const data = args.data as Record<string, unknown>;
              if (data.tenantId === undefined) {
                data.tenantId = store.tenantId;
              }
            } else if (
              operation.startsWith('find') ||
              operation.startsWith('update') ||
              operation.startsWith('delete') ||
              operation === 'count' ||
              operation === 'aggregate'
            ) {
              if (!args) args = {};
              if (!args.where) args.where = {};
              const where = args.where as Record<string, unknown>;
              if (where.tenantId === undefined) {
                where.tenantId = store.tenantId;
              }
            }
          }
          return query(args);
        },
      },
    },
  });

  // Compose all extensions
  const extendedClient = client
    .$extends(immutable)
    .$extends(softDelete)
    .$extends(tenantIsolation);

  // Store the client in global for development hot-reload
  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = extendedClient as unknown as any;
  }

  return extendedClient as unknown as any;
}

// ============================================================================
// Lazy singleton client
// ============================================================================

let cachedClient: any | null = null;

function getPrisma(): any {
  if (cachedClient) return cachedClient;
  cachedClient = buildPrismaClient();
  return cachedClient;
}

// ============================================================================
// Exported client (proxy to lazily initialize)
// ============================================================================

/**
 * The Prisma client instance. It is lazily initialized on first access.
 * Use this in your application code.
 */
export const prisma = new Proxy({} as any, {
  get(_target, prop, _receiver) {
    const client = getPrisma();
    const value = (client as any)[prop];
    if (typeof value === 'function') {
      return value.bind(client);
    }
    return value;
  },
});

// ============================================================================
// Utility to run a function within a tenant context
// ============================================================================

/**
 * Run an operation within a specific tenant context.
 * All Prisma queries inside the callback will automatically be scoped to the given tenantId.
 */
export async function withTenant<T>(tenantId: string, fn: () => Promise<T>): Promise<T> {
  return tenantContext.run({ tenantId }, fn);
}

// ============================================================================
// Utility for graceful shutdown
// ============================================================================

export async function shutdownPrisma(): Promise<void> {
  if (globalForPrisma.prismaPool) {
    await globalForPrisma.prismaPool.end();
  }
}

// ============================================================================
// Re-export Prisma types for convenience
// ============================================================================

// PrismaClient and Prisma types are exported at the top of this file.
// PrismaClientType = any until prisma generate has run.
