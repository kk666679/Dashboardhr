/**
 * Redis-backed rate limiting middleware for Next.js Route Handlers.
 *
 * Usage:
 *   const { allowed, headers } = await rateLimit(request, { key: "login", limit: 5, windowSec: 900 });
 *   if (!allowed) return NextResponse.json({ error: "Too many requests" }, { status: 429, headers });
 *   // ...proceed with handler, then attach headers to the response:
 *   return NextResponse.json(data, { headers });
 *
 * Missing API M17 from docs/api-analysis/10-missing-apis.md
 */

import type { NextRequest } from "next/server";

interface RateLimitOptions {
  /** Unique key prefix, e.g. "login" or "mfa" */
  key: string;
  /** Maximum requests allowed in the window */
  limit: number;
  /** Window duration in seconds */
  windowSec: number;
  /** Optional: per-identifier suffix — defaults to client IP */
  identifier?: string;
}

interface RateLimitResult {
  allowed:   boolean;
  remaining: number;
  reset:     number;   // Unix timestamp when the window resets
  headers:   Record<string, string>;
}

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}

export async function rateLimit(
  request: NextRequest,
  options: RateLimitOptions,
): Promise<RateLimitResult> {
  const identifier = options.identifier ?? getClientIp(request);
  const redisKey   = `rl:${options.key}:${identifier}`;
  const reset      = Math.floor(Date.now() / 1000) + options.windowSec;

  let count = 0;

  try {
    const { default: Redis } = await import("ioredis");
    const redis = new Redis(process.env.REDIS_URL ?? "redis://localhost:6379", {
      lazyConnect:   true,
      retryStrategy: () => null, // fail fast in middleware
    });

    const multi = redis.multi();
    multi.incr(redisKey);
    multi.expire(redisKey, options.windowSec);
    const results = await multi.exec();
    count = (results?.[0]?.[1] as number) ?? 1;
    await redis.quit();
  } catch {
    // Redis unavailable — fail open (allow request, no headers)
    return {
      allowed: true, remaining: options.limit - 1, reset,
      headers: {
        "X-RateLimit-Limit":     String(options.limit),
        "X-RateLimit-Remaining": String(options.limit - 1),
        "X-RateLimit-Reset":     String(reset),
      },
    };
  }

  const remaining = Math.max(0, options.limit - count);
  const allowed   = count <= options.limit;

  const headers: Record<string, string> = {
    "X-RateLimit-Limit":     String(options.limit),
    "X-RateLimit-Remaining": String(remaining),
    "X-RateLimit-Reset":     String(reset),
  };

  if (!allowed) {
    headers["Retry-After"] = String(options.windowSec);
  }

  return { allowed, remaining, reset, headers };
}
