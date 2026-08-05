import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/server/auth";
import { pollAllSources, seedTrustedSources, enqueueMonitorRun } from "@/lib/regulatory/monitor";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/regulatory/monitor
 *
 * Triggers a regulatory source poll, seeds trusted sources, or enqueues a
 * background poll job.
 *
 * Requires authenticated session. `seed` and `enqueue` actions are further
 * restricted to Super_Admin and Compliance_Officer roles.
 *
 * Body: { action: "poll" | "seed" | "enqueue", tenantId?: string }
 */
export async function POST(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json().catch(() => ({}))) as {
      action?: "poll" | "seed" | "enqueue";
      tenantId?: string;
    };
    const action = body.action ?? "poll";

    // Elevated-privilege actions require admin/compliance role
    if ((action === "seed" || action === "enqueue") &&
        !["Super_Admin", "Compliance_Officer", "HR_Director"].includes(session.role ?? "")) {
      return NextResponse.json({ error: "Forbidden — insufficient role" }, { status: 403 });
    }

    switch (action) {
      case "seed": {
        const created = await seedTrustedSources();
        return NextResponse.json({ success: true, seeded: created });
      }
      case "enqueue": {
        const jobId = await enqueueMonitorRun(body.tenantId ?? session.tenantId);
        return NextResponse.json({ success: true, jobId });
      }
      case "poll":
      default: {
        const result = await pollAllSources();
        return NextResponse.json({ success: true, ...result });
      }
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * GET /api/regulatory/monitor — lists active trusted sources for the tenant.
 */
export async function GET(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const sources = await prisma.regulatory_sources.findMany({
      where: { isActive: true },
      orderBy: [{ priority: "asc" }, { name: "asc" }],
      select: {
        id:              true,
        name:            true,
        sourceType:      true,
        url:             true,
        rssUrl:          true,
        priority:        true,
        isActive:        true,
        lastPolledAt:    true,
        frequencyMinutes: true,
      },
    });
    return NextResponse.json({ success: true, sources });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
