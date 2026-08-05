import { readdirSync } from "fs";
import { join } from "path";
import { NextResponse } from "next/server";

export const dynamic = "force-static";

export async function GET() {
  const svgDir = join(process.cwd(), "public", "platform-logo-svg");
  let files: string[] = [];
  try {
    files = readdirSync(svgDir)
      .filter((f) => f.endsWith(".svg"))
      .sort((a, b) => a.localeCompare(b));
  } catch {
    // Fallback if directory doesn't exist
  }
  return NextResponse.json({ svgs: files });
}

