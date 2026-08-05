import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/server/auth";
import { complianceScoringEngine } from "@/services/compliance-scoring-engine";
import { z } from "zod";

const RequirementSchema = z.object({
  requirement: z.string().min(1),
  implemented: z.boolean(),
  evidence:    z.array(z.string()).default([]),
});

export async function POST(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const requirements = z.array(RequirementSchema).min(1).parse(await request.json());
    const score = complianceScoringEngine.scoreCompliance(requirements);
    return NextResponse.json({ score });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.flatten() }, { status: 400 });
    return NextResponse.json({ error: "Failed to calculate compliance score" }, { status: 500 });
  }
}
