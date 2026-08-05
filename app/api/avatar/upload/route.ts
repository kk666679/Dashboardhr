import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { getRequiredServerEnv } from "@/config/server-env";
import { getCurrentSession } from "@/lib/server/auth";

export async function POST(request: Request): Promise<NextResponse> {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("filename") || "avatar/upload";
  if (!request.body || filename.length > 255) {
    return NextResponse.json({ error: "Invalid upload request" }, { status: 400 });
  }

  const blob = await put(filename, request.body, {
    access: "public",
    token: getRequiredServerEnv("BLOB_READ_WRITE_TOKEN"),
  });

  return NextResponse.json(blob);
}
