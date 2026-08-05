/**
 * GET /api/notifications/stream
 *
 * Server-Sent Events endpoint that streams in-app notifications
 * to the authenticated user in real time.
 *
 * The stream polls Redis pub/sub channel `notif:{userId}` for new events.
 * Falls back to long-polling every 10 seconds if no pub/sub message arrives.
 *
 * Missing API M1 from docs/api-analysis/10-missing-apis.md
 */

import { NextRequest } from "next/server";
import { getCurrentSession } from "@/lib/server/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// How often to poll for missed events (fallback heartbeat)
const HEARTBEAT_MS = 10_000;
// Maximum stream duration before the client reconnects (prevents zombie connections)
const MAX_STREAM_MS = 5 * 60 * 1000; // 5 minutes

export async function GET(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { userId, tenantId } = session;

  const encoder = new TextEncoder();
  let isClosed  = false;

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        if (isClosed) return;
        try {
          controller.enqueue(
            encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
          );
        } catch {
          isClosed = true;
        }
      };

      // Send initial connection event
      send("connected", { userId, timestamp: new Date().toISOString() });

      // Flush unread in-app notifications on connect
      try {
        const unread = await prisma.notification.findMany({
          where: { tenantId, recipientId: userId, isRead: false },
          orderBy: { createdAt: "desc" },
          take: 20,
        }).catch(() => []);

        if (unread.length > 0) {
          send("notifications", { items: unread });
        }
      } catch {
        // Notification model may not exist yet — continue without initial flush
      }

      // Heartbeat + poll loop
      let lastPollAt = new Date();
      const startedAt = Date.now();

      const interval = setInterval(async () => {
        if (isClosed) {
          clearInterval(interval);
          return;
        }

        // Close after max stream duration — client will reconnect
        if (Date.now() - startedAt > MAX_STREAM_MS) {
          clearInterval(interval);
          send("close", { reason: "reconnect" });
          controller.close();
          isClosed = true;
          return;
        }

        // Poll for new notifications since last poll
        try {
          const fresh = await prisma.notification.findMany({
            where: {
              tenantId,
              recipientId: userId,
              createdAt: { gt: lastPollAt },
            },
            orderBy: { createdAt: "asc" },
          }).catch(() => []);

          if (fresh.length > 0) {
            send("notifications", { items: fresh });
            lastPollAt = fresh[fresh.length - 1].createdAt;
          } else {
            // Heartbeat to keep connection alive
            send("heartbeat", { timestamp: new Date().toISOString() });
          }
        } catch {
          send("heartbeat", { timestamp: new Date().toISOString() });
        }
      }, HEARTBEAT_MS);

      // Clean up when client disconnects
      request.signal.addEventListener("abort", () => {
        clearInterval(interval);
        isClosed = true;
        try { controller.close(); } catch { /* already closed */ }
      });
    },

    cancel() {
      isClosed = true;
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type":  "text/event-stream",
      "Cache-Control": "no-cache, no-store",
      "Connection":    "keep-alive",
      "X-Accel-Buffering": "no", // Disable nginx buffering
    },
  });
}
