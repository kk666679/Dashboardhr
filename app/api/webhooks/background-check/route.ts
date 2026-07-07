/**
 * Background Check Webhook — Task 11.2
 *
 * Receives callbacks from background check providers.
 * Surfaces result on candidate timeline within 30s (Req 3.10).
 * HMAC-SHA256 signature validation.
 *
 * Requirements: 3.10
 */

import { createHmac } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const WEBHOOK_SECRET = process.env.BACKGROUND_CHECK_WEBHOOK_SECRET ?? "dev-bg-check-secret";

interface BackgroundCheckResult {
  candidateId: string;
  tenantId: string;
  status: "CLEAR" | "CONSIDER" | "SUSPENDED" | "PENDING";
  reportUrl?: string;
  completedAt: string;
  checks: {
    type: string;
    result: string;
    details?: string;
  }[];
}

function verifySignature(body: string, signature: string): boolean {
  const expected = createHmac("sha256", WEBHOOK_SECRET).update(body).digest("hex");
  return `sha256=${expected}` === signature;
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig  = request.headers.get("x-background-check-signature") ?? "";

  if (!verifySignature(body, sig)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let result: BackgroundCheckResult;
  try {
    result = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Update candidate record with background check result (Req 3.10 — within 30s)
  const candidate = await prisma.candidate.findFirst({
    where: { id: result.candidateId, tenantId: result.tenantId },
  });

  if (!candidate) {
    return NextResponse.json({ error: "Candidate not found" }, { status: 404 });
  }

  const updatedProfile = {
    ...(candidate.parsedProfile as object | null ?? {}),
    backgroundCheck: {
      status: result.status,
      completedAt: result.completedAt,
      reportUrl: result.reportUrl,
      checks: result.checks,
    },
  };

  await prisma.candidate.update({
    where: { id: result.candidateId },
    data: {
      parsedProfile: updatedProfile,
      status:
        result.status === "CLEAR"
          ? "SHORTLISTED"
          : result.status === "CONSIDER"
            ? "SCREENING"
            : result.status === "SUSPENDED"
              ? "SUSPENDED"
              : "SCREENING",
    },
  });


  await prisma.auditTrail.create({
    data: {
      tenantId: result.tenantId,
      module: "recruitment",
      entityType: "Candidate",
      entityId: result.candidateId,
      action: "UPDATE",
      actorId: "system",
      actorRole: "system",
      newValue: { backgroundCheck: result.status },
      changedFields: ["parsedProfile", "status"],
      metadata: { source: "background_check_webhook" },
    },
  });

  return NextResponse.json({ received: true }, { status: 200 });
}
