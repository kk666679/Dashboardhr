/**
 * Worker entry-point — starts all BullMQ workers.
 *
 * Run with: npx tsx workers/index.ts
 * Or configure as a separate process in your deployment.
 */

// Import all workers (side-effect: registers the Worker instances)
import "./workflow.worker";
import "./notification.worker";
import "./leave.worker";
import "./statutory.worker";
import "./payroll.worker";

console.log("[workers] All HCM workers started");

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("[workers] SIGTERM received, shutting down gracefully…");
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("[workers] SIGINT received, shutting down…");
  process.exit(0);
});
