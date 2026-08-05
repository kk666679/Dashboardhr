import { NextResponse } from "next/server";
import path from "path";
import { createReadStream } from "fs";

export async function GET() {
  const filePath = path.join(process.cwd(), "public", "downloads", "WindowDownloader.exe");

  const stream = createReadStream(filePath);

  return new NextResponse(stream as any, {
    status: 200,
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": 'attachment; filename="Window.exe"',
    },
  });
}

