/**
 * GET  /api/ai/chat/history?sessionId=xxx  — return message history for a session
 * DELETE /api/ai/chat/history?sessionId=xxx — clear session history
 */

import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

// Shared reference to the same Map used in ../route.ts
// In production replace with a shared cache (Redis, DB, etc.)
// For now we re-export a module-level singleton via a shared lib.
import { getChatSession, deleteChatSession } from "@/lib/chat-sessions";

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("sessionId") ?? "default";
  const history = getChatSession(sessionId);
  return NextResponse.json({
    sessionId,
    messages: history,
    count: history.length,
  });
}

export async function DELETE(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("sessionId") ?? "default";
  deleteChatSession(sessionId);
  return NextResponse.json({ ok: true, sessionId });
}
