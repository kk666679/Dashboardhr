/**
 * SIEM outbound event stream — Design doc / Phase 6
 * Streams audit trail events in CEF (Common Event Format) or JSON
 * to a configured SIEM system.
 * Requirements: 30.5
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function toCef(event: {
  id: string;
  createdAt: Date;
  entityType: string;
  action: string;
  actorId?: string | null;
  tenantId: string;
  ipAddress?: string | null;
}): string {
  const timestamp = event.createdAt.toISOString();
  const severity = event.action === "DELETE" ? 7 : event.action === "UPDATE" ? 5 : 3;
  return `CEF:0|HCM Platform|AuditTrail|1.0|${event.action}|${event.entityType} ${event.action}|${severity}|` +
    `rt=${timestamp} suser=${event.actorId ?? "system"} tenantId=${event.tenantId} ` +
    `externalId=${event.id} src=${event.ipAddress ?? "unknown"}`;
}

export async function GET(request: NextRequest) {
  const url    = new URL(request.url);
  const format = url.searchParams.get("format") ?? "json"; // json | cef
  const since  = url.searchParams.get("since");
  const tenantId = url.searchParams.get("tenantId");

  if (!tenantId) {
    return NextResponse.json({ error: "tenantId query param required" }, { status: 400 });
  }

  // Simple API key auth for SIEM integration
  const apiKey = request.headers.get("x-api-key");
  const expectedKey = process.env.SIEM_API_KEY;
  if (expectedKey && apiKey !== expectedKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const events = await prisma.auditTrail.findMany({
    where: {
      tenantId,
      ...(since ? { createdAt: { gte: new Date(since) } } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 1000,
    select: {
      id: true, createdAt: true, entityType: true, action: true,
      actorId: true, tenantId: true, ipAddress: true, module: true,
    },
  });

  if (format === "cef") {
    const cefLines = events.map(toCef).join("\n");
    return new NextResponse(cefLines, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  return NextResponse.json({ events, count: events.length });
}
