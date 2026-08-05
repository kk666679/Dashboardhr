import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/server/auth";
import { runChangePipeline } from "@/lib/regulatory/change-pipeline";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/regulatory/changes
 *
 * Manually triggers the 10-step regulatory change pipeline for a tenant.
 * Restricted to Compliance_Officer, HR_Director, and Super_Admin.
 *
 * Body (ChangePipelineInput):
 * {
 *   tenantId: string,       (defaults to session tenant)
 *   sourceId?: string,
 *   title: string,
 *   description?: string,
 *   referenceNo?: string,
 *   oldContent?: string,
 *   newContent?: string,
 *   sourceUrl?: string,
 *   effectiveDate?: string (ISO date),
 *   implementationDeadline?: string (ISO date)
 * }
 */
export async function POST(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Only elevated roles may trigger the change pipeline
  const allowedRoles = ["Super_Admin", "Compliance_Officer", "HR_Director", "HR_Manager"];
  if (!allowedRoles.includes(session.role ?? "")) {
    return NextResponse.json({ error: "Forbidden — insufficient role" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const tenantId = String(body.tenantId ?? session.tenantId);
    const { tenantId: _ignored, ...pipelineInput } = body;

    if (!pipelineInput.title) {
      return NextResponse.json({ error: "title is required" }, { status: 400 });
    }

    const result = await runChangePipeline({ tenantId, ...pipelineInput });
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * GET /api/regulatory/changes
 *
 * Lists regulatory changes scoped to the authenticated session's tenant.
 * Query params: status, limit
 */
export async function GET(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") ?? undefined;
    const limit  = Math.min(Number(searchParams.get("limit") ?? 50), 200);

    const changes = await prisma.regulatory_changes.findMany({
      where: {
        tenantId: session.tenantId,           // always scoped to session tenant
        ...(status ? { status: status as any } : {}),
      },
      orderBy: { detectedAt: "desc" },
      take: limit,
      select: {
        id:                      true,
        tenantId:                true,
        title:                   true,
        referenceNo:             true,
        description:             true,
        diffSummary:             true,
        status:                  true,
        impactLevel:             true,
        affectedWorkflows:       true,
        affectedPolicies:        true,
        implementationDeadline:  true,
        impactAssessment:        true,
        notified:                true,
        migrationTasksCreated:   true,
        knowledgeIndexUpdated:   true,
        detectedAt:              true,
        sourceUrl:               true,
      },
    });

    return NextResponse.json({ success: true, changes, total: changes.length });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
