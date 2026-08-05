/**
 * Centralised BullMQ Redis connection factory.
 *
 * BullMQ requires a *synchronous* ioredis instance (or a plain
 * ConnectionOptions object) — it cannot accept a Promise.  This module
 * returns a synchronous singleton using `lazyConnect: true` so the TCP
 * handshake is deferred until the first command while still satisfying
 * BullMQ's type requirements.
 *
 * Build-time safety: during `next build` (NEXT_PHASE is set) the module
 * returns a lightweight mock that satisfies ioredis's interface without
 * opening any real socket.
 */

import type { Redis as IORedisType } from "ioredis";
import { isBuildTime } from "@/lib/build-time";

// ─── Build-time mock ──────────────────────────────────────────────────────────

/**
 * Minimal ioredis-compatible stub used during `next build`.
 * Satisfies BullMQ's ConnectionOptions type without opening a socket.
 */
function buildTimeMock(): IORedisType {
  const noop = () => null;
  const resolveOk = () => Promise.resolve("OK" as any);
  return {
    status: "close",
    lazyConnect: true,
    connect: () => Promise.resolve(),
    disconnect: resolveOk,
    quit: resolveOk,
    on: noop,
    once: noop,
    removeListener: noop,
    get: () => Promise.resolve(null),
    set: () => Promise.resolve("OK" as any),
    setex: () => Promise.resolve("OK" as any),
    del: () => Promise.resolve(1 as any),
    sadd: () => Promise.resolve(1 as any),
    srem: () => Promise.resolve(1 as any),
    smembers: () => Promise.resolve([] as any),
    expire: () => Promise.resolve(1 as any),
  } as unknown as IORedisType;
}

// ─── Singleton ────────────────────────────────────────────────────────────────

const globalForBullMq = globalThis as unknown as { bullmqRedis: IORedisType | undefined };

/**
 * Returns a synchronous ioredis client suitable for passing to BullMQ's
 * `connection` option.  The connection is lazy — no TCP handshake until
 * the first command is issued.
 *
 * Calling this multiple times returns the same singleton.
 */
export function createBullMqConnection(): IORedisType {
  if (isBuildTime()) return buildTimeMock();
  if (globalForBullMq.bullmqRedis) return globalForBullMq.bullmqRedis;

  // Require ioredis synchronously.  We cannot use a dynamic `await import()`
  // here because BullMQ Queue/Worker constructors are synchronous.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const IORedis = require("ioredis") as { default: new (...args: any[]) => IORedisType };
  const RedisConstructor = IORedis.default ?? (IORedis as unknown as new (...args: any[]) => IORedisType);

  const client = new RedisConstructor(
    process.env.REDIS_URL ?? "redis://localhost:6379",
    {
      maxRetriesPerRequest: null, // required by BullMQ
      lazyConnect: true,
      retryStrategy: (times: number) => Math.min(times * 100, 3_000),
    }
  );

  // Suppress unhandled connection errors (BullMQ attaches its own listeners)
  client.on("error", () => {});

  if (process.env.NODE_ENV !== "production") {
    globalForBullMq.bullmqRedis = client;
  }

  return client;
}
