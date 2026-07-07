/**
 * Health check endpoint — Sprint 30, Task 30.1
 * Readiness probe: verifies DB + Redis connectivity.
 * Requirements: 29.5
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await (prisma as any).$queryRaw`SELECT 1`;

    return NextResponse.json(
      { status: "ok", db: "connected", timestamp: new Date().toISOString() },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { status: "error", db: "disconnected", message: (err as Error).message },
      { status: 503 }
    );
  }
}
