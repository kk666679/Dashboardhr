/**
 * Regulatory Monitoring Worker
 *
 * BullMQ worker on the `regulatory-monitor` queue. Polls trusted regulatory
 * sources on a schedule, detects content changes, and runs the 10-step change
 * pipeline for affected tenants.
 *
 * Run as part of the workers cluster:
 *   npx tsx workers/index.ts
 * Or standalone:
 *   npx tsx workers/regulatory.worker.ts
 */
import { Worker } from "bullmq";
import { createBullMqConnection } from "@/lib/queues/bullmq-connection";
import { pollAllSources, enqueueMonitorRun, regulatoryQueue } from "@/lib/regulatory/monitor";
import { runChangePipelineForAllTenants } from "@/lib/regulatory/change-pipeline";

const connection = createBullMqConnection();

interface RegulatoryJob {
  type: "poll-sources";
  tenantId?: string | null;
}

export const regulatoryWorker = new Worker<RegulatoryJob>(
  "regulatory-monitor",
  async (job) => {
    const { type, tenantId } = job.data;

    switch (type) {
      case "poll-sources": {
        const result = await pollAllSources();
        console.log(
          `[regulatory-worker] Polled ${result.polled} sources, ${result.changed} changed: ${result.details.join(", ") || "none"}`
        );

        // If changes detected and tenant specified, run pipeline for that tenant.
        // For global sources (no tenant), run pipeline for all tenants.
        if (result.changed > 0) {
          if (tenantId) {
            // Single-tenant pipeline would be triggered from the API layer.
            console.log(`[regulatory-worker] Changes detected for tenant ${tenantId} — pipeline triggered via API.`);
          } else {
            const results = await runChangePipelineForAllTenants({
              title: "Regulatory content change detected",
              description: `Poll detected changes in ${result.changed} trusted source(s): ${result.details.join("; ")}`,
            });
            console.log(`[regulatory-worker] Ran pipeline for ${results.length} tenants.`);
          }
        }
        break;
      }
      default:
        console.warn(`[regulatory-worker] Unknown job type: ${String(type)}`);
    }
  },
  { connection, concurrency: 1 }
);

// ─── Schedule the periodic monitor run (every 60 min) ────────────────────────
async function scheduleMonitor() {
  await regulatoryQueue.add(
    "poll-sources",
    { type: "poll-sources" },
    { repeat: { pattern: "0 * * * *" }, jobId: "cron:regulatory:poll" } as any
  );
  console.log("[regulatory-worker] Scheduled regulatory source polling (hourly)");
}

scheduleMonitor().catch((err) => {
  const safe = String(err instanceof Error ? err.message : err).replace(/[\r\n\t]/g, "_").slice(0, 200);
  console.warn("[regulatory-worker] Failed to schedule monitor:", safe);
});

// ─── Graceful shutdown ───────────────────────────────────────────────────────
export async function stopWorker() {
  try {
    await regulatoryWorker.close();
  } catch {}
  try {
    await regulatoryQueue.close();
  } catch {}
}

console.log("[regulatory-worker] Started");

