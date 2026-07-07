import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { searchSops, findRelatedSops } from "@/lib/sop/search";

const SearchQuerySchema = z.object({
  query: z.string().min(0).default(""),
  limit: z.number().int().positive().max(50).default(10),
});

export async function POST(request: NextRequest) {
  let body: z.infer<typeof SearchQuerySchema>;
  try {
    body = SearchQuerySchema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const results = await searchSops(body.query, body.limit);
  return NextResponse.json({ results });
}

// Convenience GET: /api/sops/search?q=...&limit=...
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q") ?? "";
  const limitRaw = url.searchParams.get("limit");
  const limit = limitRaw ? Number(limitRaw) : 10;

  const results = await searchSops(q, Number.isFinite(limit) ? limit : 10);
  return NextResponse.json({ results });
}

export async function PUT(request: NextRequest) {
  // Convenience related: body { sopId, limit }
  const body = z
    .object({
      sopId: z.string().min(1),
      limit: z.number().int().positive().max(50).default(5),
    })
    .parse(await request.json());

  const results = await findRelatedSops(body.sopId, body.limit);
  return NextResponse.json({ results });
}

