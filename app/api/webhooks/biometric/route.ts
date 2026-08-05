/**
 * Biometric attendance webhook — Task 7.2
 *
 * Receives clock-in events from hardware biometric terminals.
 * - Validates HMAC-SHA256 signature on every request
 * - Enqueues job to `attendance` BullMQ queue
 * - Rejects below configured confidence threshold (Req 7.8)
 *
 * Requirements: 7.1, 7.8
 */

import { createHmac } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { attendanceQueue } from "@/lib/queues";

const BIOMETRIC_CONFIDENCE_THRESHOLD = Number(
  process.env.BIOMETRIC_CONFIDENCE_THRESHOLD ?? "75"
);
const WEBHOOK_SECRET =
  process.env.BIOMETRIC_WEBHOOK_SECRET ?? "dev-biometric-secret";

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

  if (!verifySignature(body, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: BiometricEvent;
  try {
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const queue = await attendanceQueue();

  // Req 7.8: Reject below confidence threshold
  if (event.confidenceScore < BIOMETRIC_CONFIDENCE_THRESHOLD) {
    await queue.add("clock", {
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

  await queue.add(
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
    { attempts: 3, backoff: { type: "exponential", delay: 1000 } }
  );

  return NextResponse.json({ accepted: true }, { status: 202 });
}
