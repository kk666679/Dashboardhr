import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/server/auth";
import { correctiveActionEngine } from "@/services/corrective-action-engine";
import { z } from "zod";

const BodySchema = z.object({ problem: z.string().min(1) });

export async function POST(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = BodySchema.parse(await request.json());
    const fiveWhys = correctiveActionEngine.perform5Whys(body.problem);
    return NextResponse.json({ problem: body.problem, fiveWhys });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.flatten() }, { status: 400 });
    return NextResponse.json({ error: "Failed to generate 5 Whys analysis" }, { status: 500 });
  }
}
