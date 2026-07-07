import { NextRequest, NextResponse } from "next/server";
import { searchSops } from "@/lib/sop/search";

/**
 * GET /api/sops
 *
 * MVP list endpoint.
 * Query params:
 * - q: search query (required)
 * - limit: number (optional, default 10)
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const q = searchParams.get("q") ?? "";
  const limitRaw = searchParams.get("limit") ?? "10";
  const limit = Number.parseInt(limitRaw, 10);

  try {
    const results = await searchSops(q, Number.isFinite(limit) ? limit : 10);
    return NextResponse.json({ query: q, results });
  } catch {
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}

