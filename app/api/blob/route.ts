import { get, put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getRequiredServerEnv } from "@/config/server-env";
import { getCurrentSession } from "@/lib/server/auth";

const uploadSchema = z.object({
  content: z.string(),
  filename: z.string().min(1).max(255).default("articles/blob.txt"),
});

export async function POST(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = uploadSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid upload payload" }, { status: 400 });
  }

  const { content, filename } = parsed.data;

  const blob = await put(filename, content, {
    access: "public",
    token: getRequiredServerEnv("BLOB_READ_WRITE_TOKEN"),
  });

  return NextResponse.json(blob);
}

export async function GET(request: NextRequest) {
  // Authenticate the request before serving the Blob.
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const pathname = request.nextUrl.searchParams.get("pathname");
  if (!pathname) {
    return NextResponse.json({ error: "Missing pathname" }, { status: 400 });
  }

  const result = await get(pathname, {
    access: "private",
    token: getRequiredServerEnv("BLOB_READ_WRITE_TOKEN"),
  });
  if (result === null) {
    return new NextResponse("Not found", { status: 404 });
  }

  return new NextResponse(result.stream, {
    headers: {
      "Cache-Control": "private, no-cache",
      "Content-Type": result.blob.contentType ?? "application/octet-stream",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
