import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/server/auth";
import { complianceScoringEngine } from "@/services/compliance-scoring-engine";
import { z } from "zod";

const BodySchema = z.object({
  current: z.number().min(0).max(100),
  target:  z.number().min(0).max(100).default(100),
});

export async function POST(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = BodySchema.parse(await request.json());
    const gapAnalysis = complianceScoringEngine.generateGapAnalysis(body.current, body.target);
    return NextResponse.json({ gapAnalysis });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.flatten() }, { status: 400 });
    return NextResponse.json({ error: "Failed to generate gap analysis" }, { status: 500 });
  }
}
