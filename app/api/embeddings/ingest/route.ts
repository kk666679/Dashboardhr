/**
 * POST /api/embeddings/ingest
 *
 * Stores extracted text on a Document record so it becomes
 * searchable via the semantic search tRPC router.
 *
 * Call this after OCR or after a document upload where you have
 * the text content available.
 *
 * Body: { documentId: string, text: string }
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/server/auth";

const IngestSchema = z.object({
  documentId: z.string().min(1),
  text: z.string().min(1).max(50_000),
});

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  // Auth check — tenant ownership verified before overwriting document text
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = IngestSchema.parse(await req.json());

    // Verify document belongs to this tenant before updating
    const existing = await prisma.document.findFirst({
      where: { id: body.documentId, tenantId: session.tenantId },
      select: { id: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    const doc = await prisma.document.update({
      where: { id: body.documentId },
      data: { contentText: body.text },
      select: { id: true, type: true, status: true },
    });

    return NextResponse.json({ ok: true, document: doc });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 400 });
    }
    console.error("Ingest error:", error);
    return NextResponse.json({ error: "Ingest failed" }, { status: 500 });
  }
}
