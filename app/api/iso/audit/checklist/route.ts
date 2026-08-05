import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/server/auth";
import { auditEngine } from "@/services/audit-engine";
import { z } from "zod";

const BodySchema = z.object({
  standard: z.enum(["ISO9001", "ISO14001", "ISO45001", "ISO27001"]),
  clauses:  z.array(z.string()).min(1),
});

export async function POST(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = BodySchema.parse(await request.json());
    const checklist = auditEngine.generateChecklist(body.standard as any, body.clauses);
    return NextResponse.json({ standard: body.standard, checklist });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.flatten() }, { status: 400 });
    return NextResponse.json({ error: "Failed to generate checklist" }, { status: 500 });
  }
}
