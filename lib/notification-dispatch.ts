/**
 * Notification dispatch helper — used by tRPC routers to enqueue notifications
 * to the BullMQ notification queue.
 *
 * Keeps routers decoupled from the worker implementation while guaranteeing
 *
 */

import { Queue } from "bullmq";
import { prisma } from "@/lib/prisma";
import { createBullMqConnection } from "@/lib/queues/bullmq-connection";


// ─── Lazy Redis + Queue (only instantiated when actually called) ──────────────

let _queue: Queue | undefined;

function getNotificationQueue(): Queue {
  if (_queue) return _queue;
  const connection = createBullMqConnection();
  (connection as any).lazyConnect = true;
  _queue = new Queue("notification", { connection });
  // Suppress errors during build
  _queue.on("error", () => {});
  return _queue;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export interface DispatchOptions {
  tenantId: string;
  recipientId: string;
  eventType: string;
  channel?: "EMAIL" | "SMS" | "PUSH" | "TEAMS" | "SLACK" | "WHATSAPP" | "IN_APP";
  subject?: string;
  body: string;
}

/**
 * Persist a NotificationLog record and enqueue the delivery job.
 * The worker retries up to 3× at 5-minute intervals (Req 25.2).
 * Returns the notification log ID.
 */
export async function dispatchNotification(opts: DispatchOptions): Promise<string> {
  const channel = opts.channel ?? "IN_APP";

  // Check recipient channel preference
  // NotificationPreference uses userId as the key (matches User.id, not Employee.id)
  const pref = await prisma.notificationPreference.findFirst({
    where: {
      tenantId:  opts.tenantId,
      userId:    opts.recipientId,
      eventType: opts.eventType,
      channel:   channel as any,
    },
  });

  if (pref && !pref.enabled) {
    // Silently skip — recipient has opted out
    return "";
  }

  const log = await (prisma as any).notificationLog.create({
    data: {
      tenantId: opts.tenantId,
      recipientId: opts.recipientId,
      channel,
      eventType: opts.eventType,
      subject: opts.subject,
      body: opts.body,
      status: "PENDING",
    },
  });

  // Enqueue to BullMQ worker — at-most-once delivery with dedup by logId
  try {
    const queue = getNotificationQueue();
    await queue.add(
      "send",
      {
        logId:       log.id,
        tenantId:    opts.tenantId,
        recipientId: opts.recipientId,
        channel,
        subject:     opts.subject,
        body:        opts.body,
        eventType:   opts.eventType,
      },
      {
        attempts: 3,
        backoff: { type: "fixed", delay: 5 * 60 * 1000 }, // 5-minute intervals (Req 25.2)
        jobId: `notif:${log.id}:${channel}`, // prevents duplicate enqueueing
      }
    );
  } catch (queueErr) {
    // Non-fatal — notification is persisted; worker will pick it up on next poll
    console.warn("[notification-dispatch] Queue enqueue failed:", queueErr);
  }

  return log.id;
}

/**
 * Dispatch to all channels that the recipient has enabled for the given event type.
 * Falls back to IN_APP if no preferences are configured.
 */
export async function dispatchToAllChannels(
  base: Omit<DispatchOptions, "channel">
): Promise<string[]> {
  const prefs = await prisma.notificationPreference.findMany({
    where: {
      tenantId:  base.tenantId,
      userId:    base.recipientId,
      eventType: base.eventType,
      enabled:   true,
    },
  });

  const channels = prefs.length
    ? (prefs as any[]).map((p: any) => p.channel as DispatchOptions["channel"])
    : (["IN_APP"] as DispatchOptions["channel"][]);

  const ids = await Promise.all(
    (channels as any[]).map((channel: any) => dispatchNotification({ ...base, channel }))
  );

  return ids.filter(Boolean);
}
