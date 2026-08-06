import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/server/auth";
import { searchSops } from "@/lib/sop/search";

export async function GET(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
