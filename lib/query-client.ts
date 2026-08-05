/**
 * TanStack Query Client Configuration — centralized stale times, retry strategy,
 * and prefetch utilities.
 *
 * Stale times are tuned per data category to balance freshness vs. cache hits:
 *
 *   Employee list       → 30s   (may change, background refresh)
 *   Employee detail     → 5min  (infrequently changed)
 *   Departments/Lookup  → 10min (rarely changes)
 *   Dashboard metrics   → 30s   (near-real-time)
 *   Leave balances      → 1min  (balance updates common)
 *   Payroll             → 5min  (processed periodically)
 *
 * @see /docs/ARCHITECTURE.md
 */

import { QueryClient } from "@tanstack/react-query";

// ─── Default stale time by query key prefix ───────────────────────────────────

export const STALE_TIMES = {
  employee: {
    list: 30_000,        // 30 seconds
    byId: 5 * 60_000,    // 5 minutes
    detail: 5 * 60_000,  // 5 minutes
  },
  department: 10 * 60_000,   // 10 minutes
  position: 10 * 60_000,     // 10 minutes
  dashboard: 30_000,         // 30 seconds
  leave: {
    balance: 60_000,    // 1 minute
    list: 30_000,       // 30 seconds
    policy: 10 * 60_000, // 10 minutes
  },
  payroll: 5 * 60_000,      // 5 minutes
  attendance: 30_000,       // 30 seconds
  notification: 60_000,     // 1 minute
  analytics: 60_000,        // 1 minute
  admin: 5 * 60_000,        // 5 minutes
  default: 30_000,          // 30 seconds fallback
} as const;

// ─── Retry configuration ──────────────────────────────────────────────────────

const MAX_RETRIES = 2;
const RETRY_DELAY_BASE = 1_000; // 1s, then exponential backoff

function retryDelay(failureCount: number): number {
  return Math.min(RETRY_DELAY_BASE * 2 ** failureCount, 10_000);
}

// ─── Query client factory ─────────────────────────────────────────────────────

let globalQueryClient: QueryClient | null = null;

export function createQueryClient(): QueryClient {
  if (typeof window === "undefined") {
    // SSR: always create a new client
    return buildQueryClient();
  }

  if (!globalQueryClient) {
    globalQueryClient = buildQueryClient();
  }
  return globalQueryClient;
}

function buildQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: STALE_TIMES.default,
        retry: MAX_RETRIES,
        retryDelay,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        gcTime: 5 * 60_000, // garbage collection after 5 min
      },
      mutations: {
        retry: 0, // never retry mutations
      },
    },
  });
}

// ─── Prefetch helper (for RSC) ────────────────────────────────────────────────

/**
 * Prefetch a query on the server side and return dehydrated state.
 * Used in Server Components to eagerly populate the cache before
 * the Client Component hydrates.
 *
 * @example
 * ```tsx
 * // app/dashboard/page.tsx (Server Component)
 * import { createQueryClient, prefetchQuery } from '@/lib/query-client'
 * import { serverCaller } from '@/lib/trpc-server'
 * import { HydrationBoundary } from '@tanstack/react-query'
 *
 * export default async function Page() {
 *   const queryClient = createQueryClient()
 *   const caller = await serverCaller()
 *
 *   await prefetchQuery(queryClient, ['employee', 'list'], () => caller.employee.list())
 *
 *   return (
 *     <HydrationBoundary state={queryClient.getQueryData(['employee', 'list'])}>
 *       <EmployeeList />
 *     </HydrationBoundary>
 *   )
 * }
 * ```
 */
export async function prefetchQuery<T>(
  queryClient: QueryClient,
  queryKey: string[],
  fetcher: () => Promise<T>,
  staleTime: number = STALE_TIMES.default,
): Promise<void> {
  await queryClient.prefetchQuery({
    queryKey,
    queryFn: fetcher,
    staleTime,
  });
}

/**
 * Prefetch multiple queries in parallel (RSC pattern).
 */
export async function prefetchQueries(
  queryClient: QueryClient,
  prefetches: Array<{
    queryKey: string[];
    fetcher: () => Promise<unknown>;
    staleTime?: number;
  }>,
): Promise<void> {
  await Promise.all(
    prefetches.map(({ queryKey, fetcher, staleTime }) =>
      prefetchQuery(queryClient, queryKey, fetcher, staleTime),
    ),
  );
}

