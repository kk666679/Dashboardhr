/**
 * BullMQ Queue Registry
 *
 * Centralised queue definitions. All workers and routers import from here
 * rather than creating ad-hoc Queue instances, ensuring consistent naming
 * and a single Redis connection reference.
 */

import { isBuildTime } from "@/lib/build-time";
import type { Queue } from "bullmq";

// ─── Singleton Redis connection ───────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type IORedisClient = any;

const globalForQueues = globalThis as unknown as { queueRedis: IORedisClient | undefined };

async function getQueueRedis(): Promise<IORedisClient> {
  // During build, return a mock to avoid ECONNREFUSED
  if (isBuildTime()) {
    return {
      status: "close",
      connect: () => Promise.resolve(),
      disconnect: () => Promise.resolve(),
      on: () => null,
      once: () => null,
      removeListener: () => null,
    };
  }

  if (globalForQueues.queueRedis) return globalForQueues.queueRedis;

  // Dynamic import to avoid loading ioredis during build time
  const IORedis = (await import("ioredis")).default;

  const client = new IORedis(process.env.REDIS_URL ?? "redis://localhost:6379", {
    maxRetriesPerRequest: null,
    lazyConnect: true,
    retryStrategy: (times: number) => {
      if (isBuildTime()) return null;
      return Math.min(times * 100, 3000);
    },
  });

  // Suppress connection errors during build
  client.on("error", () => {});

  if (process.env.NODE_ENV !== "production") globalForQueues.queueRedis = client;
  return client;
}

// ─── Queue name constants ─────────────────────────────────────────────────────

export const QUEUE_NAMES = {
  PAYROLL: "payroll",
  NOTIFICATION: "notification",
  WORKFLOW: "workflow",
  OCR: "ocr",
  EMBEDDING: "embedding",
  SYNC: "sync",
  STATUTORY: "statutory",
  REPORTS: "reports",
  RETENTION: "retention",
  AI: "ai",
  WEBHOOKS: "webhooks",
  ATTENDANCE: "attendance",
  LEAVE: "leave",
  ONBOARDING: "onboarding",
} as const;

export type QueueName = (typeof QUEUE_NAMES)[keyof typeof QUEUE_NAMES];

// ─── Lazy queue factory ───────────────────────────────────────────────────────

const _queues = new Map<string, Queue>();

export async function getQueue(name: QueueName): Promise<Queue> {
  if (_queues.has(name)) return _queues.get(name)!;
  // Dynamic import so BullMQ / @valkey/valkey-glide native module is not
  // bundled by Turbopack during `next build` (avoid "non-ecmascript placeable
  // asset" error). At runtime this resolves normally.
  const { Queue: QueueCtor } = await import("bullmq");
  // BullMQ's ConnectionOptions type is sensitive to nested ioredis versions.
  // Runtime is fine; cast to unblock compilation.
  const q = new QueueCtor(name, { connection: (await getQueueRedis()) as any });
  _queues.set(name, q);
  return q;
}

// ─── Named exports for convenience ───────────────────────────────────────────

export const payrollQueue = () => getQueue(QUEUE_NAMES.PAYROLL);
export const notificationQueue = () => getQueue(QUEUE_NAMES.NOTIFICATION);
export const workflowQueue = () => getQueue(QUEUE_NAMES.WORKFLOW);
export const ocrQueue = () => getQueue(QUEUE_NAMES.OCR);
export const embeddingQueue = () => getQueue(QUEUE_NAMES.EMBEDDING);
export const syncQueue = () => getQueue(QUEUE_NAMES.SYNC);
export const statutoryQueue = () => getQueue(QUEUE_NAMES.STATUTORY);
export const reportsQueue = () => getQueue(QUEUE_NAMES.REPORTS);
export const retentionQueue = () => getQueue(QUEUE_NAMES.RETENTION);
export const aiQueue = () => getQueue(QUEUE_NAMES.AI);
export const webhooksQueue = () => getQueue(QUEUE_NAMES.WEBHOOKS);
export const attendanceQueue = () => getQueue(QUEUE_NAMES.ATTENDANCE);
export const leaveQueue = () => getQueue(QUEUE_NAMES.LEAVE);
export const onboardingQueue = () => getQueue(QUEUE_NAMES.ONBOARDING);
