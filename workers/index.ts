/**
 * Worker entry-point — starts all BullMQ workers and registers cron jobs.
 *
 * Run with:
 *   npx tsx workers/index.ts
 *
 * Or via Docker:
 *   docker compose up worker
 *
 * Requirements: DESIGN.md Background Jobs Architecture
 */

import { Queue } from "bullmq";

// ─── Build-time guard ──────────────────────────────────────────────────────────
function isBuildTime(): boolean {
  if (typeof process === "undefined") return true;
  if (process.env?.NEXT_PHASE !== undefined) return true;
  if (!process.env.REDIS_URL && process.env.NODE_ENV !== "development") return true;
  return false;
}

// ─── Redis connection ─────────────────────────────────────────────────────────

  // BullMQ's ConnectionOptions type can conflict with the app's ioredis version
  // because ioredis exists both top-level and under bullmq's dependency tree.
  // Cast is compile-time only.

const connection = isBuildTime()
  ? ({
      status: "close",
      connect: () => Promise.resolve(),
      disconnect: () => Promise.resolve(),
      quit: () => Promise.resolve("OK"),
      on: () => null,
      once: () => null,
      removeListener: () => null,
    } as any)
  : new (require("ioredis").default ?? require("ioredis"))(
      process.env.REDIS_URL ?? "redis://localhost:6379",
      { maxRetriesPerRequest: null }
    ) as any;


// ─── Import all workers (side-effect: registers Worker instances) ─────────────

import "./workflow.worker";
import "./notification.worker";
import "./leave.worker";
import "./statutory.worker";
import "./payroll.worker";
import "./retention.worker";
import "./regulatory.worker";

console.log("[workers] All HCM workers started");


// ─── Cron / Scheduled Jobs
// Uses BullMQ's repeat option to schedule periodic jobs.
// All times are UTC.

async function registerCronJobs() {
  const attendanceQueue   = new Queue("attendance",   { connection: connection as any });
  const leaveQueue        = new Queue("leave",        { connection: connection as any });
  const notificationQueue = new Queue("notification", { connection: connection as any });
  const aiQueue           = new Queue("ai",           { connection: connection as any });
  const retentionQueue    = new Queue("retention",    { connection: connection as any });
  const syncQueue         = new Queue("sync",         { connection: connection as any });
  const reportsQueue      = new Queue("reports",      { connection: connection as any });
  const workflowQueue     = new Queue("workflow",     { connection: connection as any });

  // Attendance daily summary — 00:05 UTC daily
  await attendanceQueue.upsertJobScheduler(
    "cron:attendance:daily-summary",
    { pattern: "5 0 * * *" },
    { name: "daily-summary", data: { type: "daily-summary" } }
  );

  // Leave monthly accrual — 02:00 on the 1st of every month
  await leaveQueue.upsertJobScheduler(
    "cron:leave:monthly-accrual",
    { pattern: "0 2 1 * *" },
    { name: "monthly-accrual", data: { type: "monthly-accrual" } }
  );

  // Leave year-end carry-forward — 03:00 on Jan 1
  await leaveQueue.upsertJobScheduler(
    "cron:leave:year-end",
    { pattern: "0 3 1 1 *" },
    { name: "year-end-carryforward", data: { type: "year-end" } }
  );

  // Document expiry scan — 06:00 UTC daily (60-day passport/visa alerts)
  await notificationQueue.upsertJobScheduler(
    "cron:notification:expiry-scan",
    { pattern: "0 6 * * *" },
    { name: "expiry-scan", data: { type: "expiry-scan" } }
  );

  // Attrition risk scoring — 04:00 UTC every Sunday
  await aiQueue.upsertJobScheduler(
    "cron:ai:attrition-risk",
    { pattern: "0 4 * * 0" },
    { name: "attrition-risk", data: { type: "attrition-risk-batch" } }
  );

  // Workforce forecast — 05:00 on the 1st of every month
  await aiQueue.upsertJobScheduler(
    "cron:ai:workforce-forecast",
    { pattern: "0 5 1 * *" },
    { name: "workforce-forecast", data: { type: "workforce-forecast" } }
  );

  // Data retention enforcement — 02:00 UTC every Sunday
  await retentionQueue.upsertJobScheduler(
    "cron:retention:enforcement",
    { pattern: "0 2 * * 0" },
    { name: "retention-enforcement", data: { type: "retention-enforcement" } }
  );

  // AD/LDAP incremental sync — every 5 minutes
  await syncQueue.upsertJobScheduler(
    "cron:sync:ad-ldap",
    { pattern: "*/5 * * * *" },
    { name: "ad-ldap-sync", data: { type: "ad-ldap-incremental" } }
  );

  // Analytics materialised view refresh — every 5 minutes
  await reportsQueue.upsertJobScheduler(
    "cron:reports:analytics-refresh",
    { pattern: "*/5 * * * *" },
    { name: "analytics-refresh", data: { type: "analytics-materialised-view" } }
  );

  // SLA timer sweep — every minute
  await workflowQueue.upsertJobScheduler(
    "cron:workflow:sla-sweep",
    { pattern: "* * * * *" },
    { name: "sla-sweep", data: { type: "sla-sweep" } }
  );

  console.log("[workers] Cron jobs registered");
}

registerCronJobs().catch(err => {
  const safeErr = String(err instanceof Error ? err.message : err).replace(/[\r\n\t]/g, "_").slice(0, 200);
  console.error("[workers] Failed to register cron jobs:", safeErr);
  // Non-fatal — workers still run, just without scheduled jobs
});

// ─── Graceful shutdown ────────────────────────────────────────────────────────

let shuttingDown = false;

process.once("SIGTERM", () => void shutdown("SIGTERM"));
process.once("SIGINT", () => void shutdown("SIGINT"));

async function shutdown(signal: string) {
  if (shuttingDown) return;
  shuttingDown = true;

  console.log(`[workers] ${signal} received. Gracefully shutting down…`);

  // Stop scheduling/repeat adds + close Redis sockets
  try {
    await connection.quit();
  } catch (e) {
    console.warn("[workers] Redis quit failed during shutdown:", e);
  }

  // Stop BullMQ workers (imported modules export stop* helpers)
  await stopAllBullMqWorkers();

  // Close Prisma pg pool (if initialized by background jobs)
  try {
    const { shutdownPrisma } = await import("@/lib/prisma");
    await shutdownPrisma();
  } catch (e) {
    // no-op: app may not have a pool initialized yet
  }
}

async function stopAllBullMqWorkers() {
  try {
    const mods = await Promise.all([
      import("./workflow.worker"),
      import("./leave.worker"),
      import("./notification.worker"),
      import("./statutory.worker"),
      import("./payroll.worker"),
      import("./retention.worker"),
    ]);

    await Promise.all(
      mods.map((m) => {
        const fn = (m as any).stopWorker ?? (m as any).stopBullMqWorker ?? (m as any).stop;
        return typeof fn === "function" ? fn() : Promise.resolve();
      })
    );
  } catch (e) {
    console.warn("[workers] stopAllBullMqWorkers failed:", e);
  }
}


