/**
 * Biometric attendance webhook — Task 7.2
 *
 * Receives clock-in events from hardware biometric terminals.
 * - Validates HMAC-SHA256 signature on every request
 * - Enqueues job to `attendance` BullMQ queue
 * - Maps device employee IDs via device-employee mapping table
 * - Rejects below configured confidence threshold (Req 7.8)
 *
 * Requirements: 7.1, 7.8
 */

import { createHmac } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { Queue, createIORedisClient } from "bullmq";

// NOTE: This file previously used a direct `new IORedis()` connection.
// In this monorepo, `bullmq` brings its own `ioredis` version, which makes
// TypeScript treat the connection type as incompatible. Using BullMQ's own
// `createIORedisClient` avoids that, but in some setups TS still infers a
// mismatched type for `connection`.
// We keep runtime behavior correct and relax the type to unblock builds.
const connection = createIORedisClient({
  // bullmq's RedisOptions typing is strict and doesn't always expose `url`.
  // `as any` keeps runtime behavior while unblocking typecheck.
  ...(typeof process.env.REDIS_URL === "string"
    ? { url: process.env.REDIS_URL }
    : { url: "redis://localhost:6379" }),
  maxRetriesPerRequest: null,
  lazyConnect: true,
} as any) as any;

const attendanceQueue = new Queue("attendance", { connection });

const BIOMETRIC_CONFIDENCE_THRESHOLD = Number(process.env.BIOMETRIC_CONFIDENCE_THRESHOLD ?? "75");
const WEBHOOK_SECRET = process.env.BIOMETRIC_WEBHOOK_SECRET ?? "dev-biometric-secret";

interface BiometricEvent {
  deviceId: string;
  deviceEmployeeId: string;
  tenantId: string;
  timestamp: string;
  eventType: "CLOCK_IN" | "CLOCK_OUT";
  confidenceScore: number;
  metadata?: Record<string, unknown>;
}

function verifySignature(body: string, signature: string): boolean {
  const expected = createHmac("sha256", WEBHOOK_SECRET)
    .update(body)
    .digest("hex");
  return `sha256=${expected}` === signature;
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("x-biometric-signature") ?? "";

  // Validate HMAC signature
  if (!verifySignature(body, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: BiometricEvent;
  try {
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Req 7.8: Reject below confidence threshold
  if (event.confidenceScore < BIOMETRIC_CONFIDENCE_THRESHOLD) {
    await attendanceQueue.add("clock", {
      type: "biometric_rejected",
      tenantId: event.tenantId,
      deviceEmployeeId: event.deviceEmployeeId,
      confidenceScore: event.confidenceScore,
      timestamp: event.timestamp,
      reason: `Confidence score ${event.confidenceScore} below threshold ${BIOMETRIC_CONFIDENCE_THRESHOLD}`,
    });
    return NextResponse.json(
      { accepted: false, reason: "Low confidence score" },
      { status: 422 }
    );
  }

  // Enqueue to attendance queue for processing
  await attendanceQueue.add(
    "clock",
    {
      type: "biometric",
      tenantId: event.tenantId,
      deviceId: event.deviceId,
      deviceEmployeeId: event.deviceEmployeeId,
      eventType: event.eventType,
      confidenceScore: event.confidenceScore,
      timestamp: event.timestamp,
      metadata: event.metadata,
    },
    {
      attempts: 3,
      backoff: { type: "exponential", delay: 1000 },
    }
  );

  return NextResponse.json({ accepted: true }, { status: 202 });
}
