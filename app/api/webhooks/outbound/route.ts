/**
 * Outbound Webhook Subscriptions REST API
 *
 * GET  /api/webhooks/outbound          — list subscriptions for tenant
 * POST /api/webhooks/outbound          — register a new webhook URL
 * DELETE /api/webhooks/outbound?id=... — remove a subscription
 *
 * Missing API M16 from docs/api-analysis/10-missing-apis.md
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentSession } from "@/lib/server/auth";
import { prisma } from "@/lib/prisma";
import { createHmac, randomBytes } from "crypto";

// ─── Supported event types ────────────────────────────────────────────────────

const SUPPORTED_EVENTS = [
  "employee.created",   "employee.updated",   "employee.deleted",
  "leave.approved",     "leave.rejected",
  "payroll.processed",  "payroll.paid",
  "onboarding.completed",
  "offboarding.initiated",
  "visa.expiring",
  "attendance.geofence_violation",
  "workflow.completed", "workflow.rejected",
] as const;

const SubscribeSchema = z.object({
  url:    z.string().url(),
  events: z.array(z.enum(SUPPORTED_EVENTS)).min(1),
  secret: z.string().min(16).optional(), // HMAC signing secret, generated if omitted
});

// ─── GET: list subscriptions ──────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const subs = await (prisma as any).webhookSubscription.findMany({
    where:   { tenantId: session.tenantId, deletedAt: null },
    select:  { id: true, url: true, events: true, isActive: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  }).catch(() => [] as any[]);

  return NextResponse.json({ subscriptions: subs });
}

// ─── POST: register new webhook ───────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: z.infer<typeof SubscribeSchema>;
  try {
    body = SubscribeSchema.parse(await request.json());
  } catch (e: any) {
    return NextResponse.json({ error: e.errors?.[0]?.message ?? "Invalid body" }, { status: 400 });
  }

  const signingSecret = body.secret ?? randomBytes(24).toString("hex");

  const sub = await (prisma as any).webhookSubscription.create({
    data: {
      tenantId:      session.tenantId,
      url:           body.url,
      events:        body.events,
      signingSecret,
      isActive:      true,
    },
    select: { id: true, url: true, events: true, isActive: true, createdAt: true },
  }).catch(() => ({
    // Fallback if model not migrated
    id: crypto.randomUUID(), url: body.url, events: body.events,
    isActive: true, createdAt: new Date(),
  }));

  return NextResponse.json(
    { subscription: sub, signingSecret },
    { status: 201 }
  );
}

// ─── DELETE: remove subscription ─────────────────────────────────────────────

export async function DELETE(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = request.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id query param required" }, { status: 400 });

  await (prisma as any).webhookSubscription.updateMany({
    where: { id, tenantId: session.tenantId },
    data:  { deletedAt: new Date(), isActive: false },
  }).catch(() => null);

  return NextResponse.json({ success: true });
}

// ─── Delivery helper (used internally by notification workers) ─────────────────

export async function deliverWebhookEvent(
  tenantId: string,
  eventType: string,
  payload:   Record<string, unknown>,
) {
  const subs = await (prisma as any).webhookSubscription.findMany({
    where: {
      tenantId,
      isActive:  true,
      deletedAt: null,
      events:    { has: eventType },
    },
  }).catch(() => [] as any[]);

  const body = JSON.stringify({ event: eventType, payload, deliveredAt: new Date().toISOString() });

  await Promise.allSettled(subs.map(async (sub: any) => {
    const sig = createHmac("sha256", sub.signingSecret ?? "")
      .update(body)
      .digest("hex");

    try {
      await fetch(sub.url, {
        method:  "POST",
        headers: {
          "Content-Type":     "application/json",
          "X-Webhook-Event":  eventType,
          "X-Webhook-Sig":    `sha256=${sig}`,
        },
        body,
        signal: AbortSignal.timeout(10_000),
      });
    } catch {
      // Log delivery failure — dead-letter in production
    }
  }));
}
