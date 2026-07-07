/**
 * Liveness probe — Sprint 30, Task 30.1
 * Returns 200 if process is not deadlocked.
 * Requirements: 29.5
 */
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ status: "alive", timestamp: new Date().toISOString() }, { status: 200 });
}
