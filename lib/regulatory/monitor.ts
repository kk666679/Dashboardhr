/**
 * Regulatory Source Monitor
 *
 * Polls trusted regulatory sources (Federal Gazette, AGC, ministry portals,
 * agency portals, government APIs, official circulars, practice directions,
 * official FAQs, press releases) for content changes.
 *
 * Each source is registered in the `regulatory_sources` table. On each poll
 * the monitor fetches content, hashes it, and compares against the previous
 * hash (`lastChangeHash`). If changed, it emits a regulatory change event that
 * feeds the 10-step change pipeline.
 */
import { prisma } from "@/lib/prisma";
import { createBullMqConnection } from "@/lib/queues/bullmq-connection";
import type { Queue } from "bullmq";

let _regulatoryQueue: Queue | undefined;

/**
 * Lazy singleton queue. Constructed on first use (not at module scope) so it
 * is never instantiated during `next build` page-data collection, which would
 * otherwise attempt to open a real Redis connection (ECONNREFUSED).
 */
export function getRegulatoryQueue(): Queue {
  if (_regulatoryQueue) return _regulatoryQueue;
  // Dynamic import so BullMQ / monkeypatch valkey-glide native module is not
  // bundled by Turbopack during `next build`.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Queue: QueueCtor } = require("bullmq") as typeof import("bullmq");
  _regulatoryQueue = new QueueCtor("regulatory-monitor", {
    connection: createBullMqConnection(),
  });
  return _regulatoryQueue;
}

/** Content-hash used to detect changes without storing full bodies. */
export function hashContent(content: string): string {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    hash = (hash << 5) - hash + content.charCodeAt(i);
    hash |= 0; // 32-bit integer
  }
  return `h${Math.abs(hash).toString(36)}${content.length.toString(36)}`;
}

export interface RegulatorySourceConfig {
  id?: string;
  sourceType:
    | "FEDERAL_GAZETTE"
    | "ATTORNEY_GENERAL_CHAMBERS"
    | "MINISTRY_PORTAL"
    | "AGENCY_PORTAL"
    | "GOVERNMENT_API"
    | "PARLIAMENT_PUBLICATION"
    | "OFFICIAL_CIRCULAR"
    | "PRACTICE_DIRECTION"
    | "OFFICIAL_FAQ"
    | "TECHNICAL_DOCUMENT"
    | "PRESS_RELEASE";
  name: string;
  url?: string;
  rssUrl?: string;
  apiEndpoint?: string;
  agencyId?: string;
  priority?: number;
  frequencyMinutes?: number;
}

/** Fetches remote content for a given source. Supports RSS, plain URL, and mockable API. */
export async function fetchSourceContent(source: RegulatorySourceConfig): Promise<string> {
  // Priority: RSS feed > API endpoint > plain URL
  const target = source.rssUrl ?? source.apiEndpoint ?? source.url;
  if (!target) return "";

  // Skip network calls during build/test when URL is placeholder
  if (target.startsWith("https://example") || target.includes("placeholder")) {
    return `placeholder-content:${source.name}`;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);
    const res = await fetch(target, {
      signal: controller.signal,
      headers: { Accept: "application/rss+xml, application/xml, text/html" },
      next: { revalidate: 0 },
    });
    clearTimeout(timeout);
    if (!res.ok) return "";
    const text = await res.text();
    // Normalise whitespace to keep hash stable against formatting-only changes
    return text.replace(/\s+/g, " ").trim();
  } catch {
    return "";
  }
}

/** Seeds the trusted-source registry if empty. Returns count created. */
export async function seedTrustedSources(): Promise<number> {
  const count = await prisma.regulatory_sources.count();
  if (count > 0) return 0;

  const sources: RegulatorySourceConfig[] = [
    { sourceType: "FEDERAL_GAZETTE", name: "Federal Gazette (AGP)", url: "https://lom.agc.gov.my", rssUrl: "", priority: 10, frequencyMinutes: 1440 },
    { sourceType: "ATTORNEY_GENERAL_CHAMBERS", name: "AG Chamber Laws of Malaysia", url: "https://lom.agc.gov.my", priority: 10, frequencyMinutes: 1440 },
    { sourceType: "MINISTRY_PORTAL", name: "KESUMA Portal", url: "https://ksm.mohr.gov.my", priority: 30, frequencyMinutes: 720 },
    { sourceType: "MINISTRY_PORTAL", name: "Ministry of Home Affairs", url: "https://www.moha.gov.my", priority: 30, frequencyMinutes: 720 },
    { sourceType: "MINISTRY_PORTAL", name: "Ministry of Finance", url: "https://www.mof.gov.my", priority: 30, frequencyMinutes: 720 },
    { sourceType: "AGENCY_PORTAL", name: "Immigration Department (JIM)", url: "https://www.imi.gov.my", priority: 40, frequencyMinutes: 720 },
    { sourceType: "AGENCY_PORTAL", name: "PERKESO/SOCSO", url: "https://www.perkeso.gov.my", priority: 40, frequencyMinutes: 1440 },
    { sourceType: "AGENCY_PORTAL", name: "EPF/KWSP", url: "https://www.kwsp.gov.my", priority: 40, frequencyMinutes: 1440 },
    { sourceType: "AGENCY_PORTAL", name: "LHDN/IRBM", url: "https://www.hasil.gov.my", priority: 40, frequencyMinutes: 1440 },
    { sourceType: "AGENCY_PORTAL", name: "HRD Corp", url: "https://hrdcorp.gov.my", priority: 40, frequencyMinutes: 1440 },
    { sourceType: "AGENCY_PORTAL", name: "DOSH/JKKP", url: "https://www.dosh.gov.my", priority: 40, frequencyMinutes: 1440 },
    { sourceType: "GOVERNMENT_API", name: "Malaysia Open Data API", url: "https://api.data.gov.my", priority: 20, frequencyMinutes: 720 },
    { sourceType: "PARLIAMENT_PUBLICATION", name: "Parliament Malaysia Bills", url: "https://www.parlimen.gov.my", priority: 20, frequencyMinutes: 1440 },
    { sourceType: "AGENCY_PORTAL", name: "MyFutureJobs", url: "https://www.myfuturejobs.gov.my", priority: 60, frequencyMinutes: 1440 },
    { sourceType: "AGENCY_PORTAL", name: "FOMEMA", url: "https://www.fomema.com.my", priority: 60, frequencyMinutes: 1440 },
    { sourceType: "AGENCY_PORTAL", name: "TalentCorp", url: "https://www.talentcorp.com.my", priority: 60, frequencyMinutes: 1440 },
    { sourceType: "AGENCY_PORTAL", name: "MDEC", url: "https://mdec.my", priority: 60, frequencyMinutes: 1440 },
    { sourceType: "AGENCY_PORTAL", name: "MIDA", url: "https://www.mida.gov.my", priority: 60, frequencyMinutes: 1440 },
    { sourceType: "AGENCY_PORTAL", name: "SSM", url: "https://www.ssm.com.my", priority: 60, frequencyMinutes: 1440 },
    { sourceType: "AGENCY_PORTAL", name: "Expatriate Services Division (ESD)", url: "https://esd.imi.gov.my", priority: 60, frequencyMinutes: 1440 },
    { sourceType: "OFFICIAL_CIRCULAR", name: "LHDN Circulars", url: "https://www.hasil.gov.my/circulars", priority: 30, frequencyMinutes: 720 },
    { sourceType: "OFFICIAL_CIRCULAR", name: "KWSP Circulars", url: "https://www.kwsp.gov.my/circulars", priority: 30, frequencyMinutes: 720 },
    { sourceType: "OFFICIAL_CIRCULAR", name: "PERKESO Circulars", url: "https://www.perkeso.gov.my/circulars", priority: 30, frequencyMinutes: 720 },
    { sourceType: "PRACTICE_DIRECTION", name: "JIM Practice Directions", url: "https://www.imi.gov.my/practice-directions", priority: 30, frequencyMinutes: 720 },
    { sourceType: "OFFICIAL_FAQ", name: "JTKSM FAQs", url: "https://jtksm.mohr.gov.my/faq", priority: 60, frequencyMinutes: 10080 },
    { sourceType: "TECHNICAL_DOCUMENT", name: "Bursa ESG Reporting Guide", url: "https://www.bursamalaysia.com/sustainability", priority: 60, frequencyMinutes: 10080 },
    { sourceType: "PRESS_RELEASE", name: "KESUMA Press Releases", url: "https://ksm.mohr.gov.my/press", priority: 50, frequencyMinutes: 720 },
  ];

  await prisma.regulatory_sources.createMany({
    data: sources.map((s) => ({
      sourceType: s.sourceType,
      name: s.name,
      url: s.url,
      rssUrl: s.rssUrl ?? null,
      apiEndpoint: s.apiEndpoint ?? null,
      agencyId: s.agencyId ?? null,
      priority: s.priority ?? 100,
      isActive: true,
      frequencyMinutes: s.frequencyMinutes ?? 1440,
    })),
    skipDuplicates: true,
  });
  return sources.length;
}

/** Polls all active sources. Returns the count of sources with detected changes. */
export async function pollAllSources(): Promise<{ polled: number; changed: number; details: string[] }> {
  const sources = await prisma.regulatory_sources.findMany({
    where: { isActive: true },
    orderBy: { priority: "asc" },
  });

  const details: string[] = [];
  let changed = 0;

  for (const source of sources) {
    const content = await fetchSourceContent({
      sourceType: source.sourceType as RegulatorySourceConfig["sourceType"],
      name: source.name,
      url: source.url ?? undefined,
      rssUrl: source.rssUrl ?? undefined,
      apiEndpoint: source.apiEndpoint ?? undefined,
    });
    if (!content) continue;

    const hash = hashContent(content);
    if (source.lastChangeHash && source.lastChangeHash !== hash) {
      changed += 1;
      details.push(`CHANGED:${source.name}`);
    }

    // Always record lastPolledAt; only update hash on first poll or change
    await prisma.regulatory_sources.update({
      where: { id: source.id },
      data: {
        lastPolledAt: new Date(),
        lastChangeHash: source.lastChangeHash ? hash : source.lastChangeHash,
      },
    });
  }

  return { polled: sources.length, changed, details };
}

/**
 * Alias for the lazy queue singleton (used by workers). Exposes `add` and
 * `close` bound to the lazily-initialised queue so it is never constructed
 * during `next build` page-data collection.
 */
export const regulatoryQueue = {
  get add() {
    return getRegulatoryQueue().add.bind(getRegulatoryQueue());
  },
  get close() {
    return getRegulatoryQueue().close.bind(getRegulatoryQueue());
  },
};

/** Enqueues a regulatory-monitor job. */
export async function enqueueMonitorRun(tenantId?: string): Promise<string> {
  const job = await getRegulatoryQueue().add("poll-sources", { tenantId: tenantId ?? null }, { jobId: `regulatory-poll-${Date.now()}` });
  return job.id ?? "unknown";
}

