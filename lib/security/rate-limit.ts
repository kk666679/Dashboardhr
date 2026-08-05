/**
 * Rate limiting with Redis-backed storage and per-tenant token budget tracking.
 *
 * Uses ioredis for distributed rate limiting across instances.
 * Falls back to in-memory LRU cache if Redis is unavailable.
 * Integrates with tokenlens for per-tenant token budget tracking.
 */

import { LRUCache } from 'lru-cache';
import type { UsageLike } from 'tokenlens';

// ─── Redis client (lazy singleton) ──────────────────────────────────────────

let redisClient: import('ioredis').Redis | null = null;
let redisAvailable = false;

async function getRedis(): Promise<import('ioredis').Redis | null> {
  if (redisClient) return redisClient;

  const url = process.env.REDIS_URL;
  if (!url) return null;

  try {
    const { default: Redis } = await import(/* webpackIgnore: true */ 'ioredis');
    redisClient = new Redis(url, {
      lazyConnect: true,
      enableOfflineQueue: false,
      maxRetriesPerRequest: 1,
      retryStrategy: () => null,
    });
    await redisClient.connect();
    redisAvailable = true;
    return redisClient;
  } catch {
    redisAvailable = false;
    return null;
  }
}

// ─── In-memory fallback (used when Redis is unavailable) ────────────────────

const fallbackCache = new LRUCache<string, number>({
  max: 10000,
  ttl: 60 * 1000,
});

const fallbackBlocked = new LRUCache<string, number>({
  max: 1000,
  ttl: 15 * 60 * 1000,
});

const fallbackTenantBudget = new LRUCache<string, number>({
  max: 5000,
  ttl: 60 * 60 * 1000,
});

// ─── Redis key helpers ─────────────────────────────────────────────────────

const RATE_KEY = (id: string) => `ratelimit:${id}`;
const BLOCK_KEY = (id: string) => `ratelimit:blocked:${id}`;
const TENANT_BUDGET_KEY = (tenantId: string) => `ratelimit:tenant:${tenantId}`;

const RATE_TTL = 60;
const BLOCK_TTL = 15 * 60;
const BUDGET_WINDOW = 3600;

// ─── Default token budget per tenant ───────────────────────────────────────

const DEFAULT_TENANT_BUDGET = Number(process.env.TOKEN_BUDGET_PER_TENANT) || 100000;

function estimateTokenUsage(cost: UsageLike): number {
  if (typeof cost === 'number') {
    return Math.max(1, Math.ceil(cost));
  }

  if (Array.isArray(cost)) {
    return cost.reduce((total, item) => total + estimateTokenUsage(item as UsageLike), 0);
  }

  if (cost && typeof cost === 'object') {
    return Object.values(cost).reduce((total: number, value: unknown) => {
      if (typeof value === 'number') return total + value;
      if (Array.isArray(value)) {
        return total + value.reduce((innerTotal, item) => innerTotal + estimateTokenUsage(item as UsageLike), 0);
      }
      if (value && typeof value === 'object') {
        return total + estimateTokenUsage(value as UsageLike);
      }
      return total;
    }, 0);
  }

  return 1;
}

export function resolveTokenBudgetCost(cost: number | UsageLike = 1): number {
  if (typeof cost === 'number') {
    return Math.max(1, Math.ceil(cost));
  }

  return Math.max(1, Math.ceil(estimateTokenUsage(cost)));
}

// ─── Public API ────────────────────────────────────────────────────────────

/**
 * Check if a request should be rate-limited.
 *
 * @param identifier  Unique key (e.g., "ip:/api/route" or "tenantId:userId")
 * @param limit       Max requests allowed in the 1-minute window (default 100)
 * @returns           true if allowed, false if rate-limited
 */
export async function checkRateLimit(
  identifier: string,
  limit: number = 100
): Promise<boolean> {
  const redis = await getRedis();

  if (redis && redisAvailable) {
    try {
      const blocked = await redis.get(BLOCK_KEY(identifier));
      if (blocked) return false;

      const current = await redis.incr(RATE_KEY(identifier));
      if (current === 1) {
        await redis.expire(RATE_KEY(identifier), RATE_TTL);
      }

      if (current > limit) {
        await redis.setex(BLOCK_KEY(identifier), BLOCK_TTL, '1');
        return false;
      }

      return true;
    } catch {
      redisAvailable = false;
    }
  }

  // In-memory fallback
  if (fallbackBlocked.has(identifier)) return false;

  const current = fallbackCache.get(identifier) || 0;
  if (current >= limit) {
    fallbackBlocked.set(identifier, 1);
    return false;
  }

  fallbackCache.set(identifier, current + 1);
  return true;
}

/**
 * Check per-tenant token budget.
 *
 * @param tenantId  The tenant identifier
 * @param cost      Token cost of the current request (default 1)
 * @returns         { allowed: boolean, remaining: number, resetAt: number }
 */
export async function checkTenantBudget(
  tenantId: string,
  cost: number | UsageLike = 1
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  const redis = await getRedis();
  const now = Math.floor(Date.now() / 1000);
  const windowStart = now - BUDGET_WINDOW;
  const key = TENANT_BUDGET_KEY(tenantId);
  const tokenCost = resolveTokenBudgetCost(cost);

  if (redis && redisAvailable) {
    try {
      const pipeline = redis.pipeline();
      pipeline.zremrangebyscore(key, 0, windowStart);
      pipeline.zrangebyscore(key, windowStart, '+inf');
      const results = await pipeline.exec();

      const entries = (results?.[1]?.[1] as string[]) ?? [];
      const used = entries.reduce((total, entry) => {
        const parsedCost = Number(entry.split(':').at(-1));
        return total + (Number.isFinite(parsedCost) ? parsedCost : 1);
      }, 0);
      const remaining = Math.max(0, DEFAULT_TENANT_BUDGET - used);

      if (used + tokenCost > DEFAULT_TENANT_BUDGET) {
        const earliest = await redis.zrangebyscore(key, '-inf', '+inf', 'LIMIT', 0, 1);
        const resetAt = earliest?.[0] ? Number(earliest[0].split(':')[0]) + BUDGET_WINDOW : now + BUDGET_WINDOW;
        return { allowed: false, remaining: 0, resetAt };
      }

      await redis.zadd(key, String(now), `${now}:${Math.random()}:${tokenCost}`);
      await redis.expire(key, BUDGET_WINDOW);

      return { allowed: true, remaining: remaining - tokenCost, resetAt: now + BUDGET_WINDOW };
    } catch {
      redisAvailable = false;
    }
  }

  // In-memory fallback
  const used = fallbackTenantBudget.get(key) || 0;
  if (used + tokenCost > DEFAULT_TENANT_BUDGET) {
    return { allowed: false, remaining: 0, resetAt: now + BUDGET_WINDOW };
  }

  fallbackTenantBudget.set(key, used + tokenCost);
  return {
    allowed: true,
    remaining: DEFAULT_TENANT_BUDGET - used - tokenCost,
    resetAt: now + BUDGET_WINDOW,
  };
}

/**
 * Get rate limit headers for the response.
 */
export async function getRateLimitHeaders(
  identifier: string,
  limit: number = 100
): Promise<{ [key: string]: string }> {
  const redis = await getRedis();
  let current = 0;

  if (redis && redisAvailable) {
    try {
      current = Number(await redis.get(RATE_KEY(identifier))) || 0;
    } catch {
      redisAvailable = false;
    }
  }

  if (!redisAvailable) {
    current = fallbackCache.get(identifier) || 0;
  }

  const remaining = Math.max(0, limit - current);

  return {
    'X-RateLimit-Limit': String(limit),
    'X-RateLimit-Remaining': String(remaining),
    'X-RateLimit-Reset': String(Math.floor(Date.now() / 1000) + 60),
  };
}

/**
 * Reset rate limit counter for a given identifier.
 */
export async function resetRateLimit(identifier: string): Promise<void> {
  const redis = await getRedis();
  if (redis && redisAvailable) {
    try {
      await redis.del(RATE_KEY(identifier));
      await redis.del(BLOCK_KEY(identifier));
      return;
    } catch {
      redisAvailable = false;
    }
  }
  fallbackCache.delete(identifier);
  fallbackBlocked.delete(identifier);
}

export async function resetTenantBudget(tenantId: string): Promise<void> {
  const redis = await getRedis();
  const key = TENANT_BUDGET_KEY(tenantId);
  if (redis && redisAvailable) {
    try {
      await redis.del(key);
      return;
    } catch {
      redisAvailable = false;
    }
  }
  fallbackTenantBudget.delete(key);
}
