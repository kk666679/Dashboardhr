/**
 * Build-time detection helper.
 *
 * Determines whether we are currently running inside a Next.js build
 * (compile, page-data collection, static generation, or worker processes).
 *
 * Why this matters:
 * - During `next build` the main process sets `NEXT_PHASE`, but the *worker*
 *   processes used for "Collecting page data" / "Generating static pages"
 *   do NOT inherit `NEXT_PHASE`. We therefore also detect those worker
 *   environments so none of the Redis / BullMQ / external services attempt to
 *   open a real socket during a build (which would raise ECONNREFUSED when
 *   Redis is not running locally).
 */

export function isBuildTime(): boolean {
  if (typeof process === "undefined") return true;

  // The main build process sets NEXT_PHASE.
  if (process.env?.NEXT_PHASE !== undefined) return true;

// Next.js build workers (page-data collection / static generation).
  if (process.env.__NEXT_PRIVATE_RENDER_WORKER === "1") return true;

  // A worker that is not the main build process (no NEXT_PHASE) but is
  // running as part of the build pipeline.
  if (
    process.env.NEXT_WORKER_ID !== undefined &&
    process.env.NEXT_PHASE === undefined
  ) {
    return true;
  }

  // When no REDIS_URL is configured and we're not in development, we cannot
  // reach a real Redis — treat as build/test time.
  if (!process.env.REDIS_URL && process.env.NODE_ENV !== "development") {
    return true;
  }

  return false;
}
