import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/server/auth";
import { auditEngine } from "@/services/audit-engine";
import { z } from "zod";

const BodySchema = z.object({
  standard: z.enum(["ISO9001", "ISO14001", "ISO45001", "ISO27001"]),
  scope:    z.string().min(1),
  duration: z.number().int().min(1).max(30).default(3),
});

export async function POST(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = BodySchema.parse(await request.json());
    const plan = auditEngine.createAuditPlan({ standard: body.standard, scope: body.scope, duration: body.duration });
    return NextResponse.json({ plan });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.flatten() }, { status: 400 });
    return NextResponse.json({ error: "Failed to create audit plan" }, { status: 500 });
  }
}
