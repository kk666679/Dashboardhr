import { put } from "@vercel/blob";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { content } = await request.json();

  const { url } = await put("articles/blob.txt", content, { access: "public" });

  return Response.json({ url });
}
