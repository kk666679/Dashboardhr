/**
 * Malaysian Foreign Worker Levy & Statutory Fees (2026)
 *
 * Source: IMI / MYEG / FWCMS data
 *
 * This is the canonical single source of truth for levy rates.
 * All agents and services should import from here — do NOT duplicate.
 */

/** Base annual levy by sector (MYR) */
export const BASE_LEVY_SECTOR: Record<string, number> = {
  manufacturing: 1850,
  construction: 1850,
  plantation: 640,
  agriculture: 640,
  services: 1850,
  domestic: 1850,
} as const;

/**
 * Skill-level adjusted annual levy by sector (MYR).
 * The base levy applies to skilled workers; semi/unskilled levy is a
 * higher government rate. Sources: MYEG / FWCMS 2026.
 */
export const LEVY_BY_SKILL: Record<
  string,
  { skilled: number; semiskilled: number; unskilled: number }
> = {
  manufacturing: { skilled: 1850, semiskilled: 2500, unskilled: 2500 },
  construction: { skilled: 1850, semiskilled: 2500, unskilled: 2500 },
  plantation: { skilled: 1500, semiskilled: 1500, unskilled: 1500 },
  services: { skilled: 1850, semiskilled: 2500, unskilled: 2500 },
} as const;

/** One-off processing fees per application type (MYR) */
export const PROCESSING_FEES = {
  newApplication: 500,
  renewal: 300,
  replacement: 200,
} as const;

/** Nationality-specific visa & bond fees (MYR) */
export const NATIONALITY_FEES: Record<
  string,
  { visa: number; bond: number; total: number }
> = {
  vietnam: { visa: 13, bond: 1500, total: 1513 },
  philippines: { visa: 36, bond: 1000, total: 1036 },
  india: { visa: 50, bond: 750, total: 800 },
  myanmar: { visa: 19.5, bond: 750, total: 769.5 },
  bangladesh: { visa: 20, bond: 500, total: 520 },
  cambodia: { visa: 20, bond: 250, total: 270 },
  indonesia: { visa: 15, bond: 250, total: 265 },
  thailand: { visa: 0, bond: 250, total: 250 },
} as const;

/** Maximum foreign workers allowed as % of total workforce (13th Malaysia Plan) */
export const FOREIGN_WORKER_CAP_PERCENT = 0.10; // 10%

/** Penalty per worker exceeding the cap (MTLM) */
export const EXCESS_WORKER_PENALTY_MIN = 300;
export const EXCESS_WORKER_PENALTY_MAX = 500;

/** Portal URLs */
export const PORTALS = {
  MYEG: "https://www.myeg.com.my",
  FWCMS: "https://fwcms.imi.gov.my",
  IMI: "https://www.imi.gov.my",
} as const;

/** Get sector key from department name */
export function getSectorKey(department: string): string {
  const sector = department?.toLowerCase() || "";
  return (
    Object.keys(BASE_LEVY_SECTOR).find((k) => sector.includes(k)) || "services"
  );
}

/** Get nationality key from nationality string */
export function getNationalityKey(nationality: string): string {
  return (nationality || "").toLowerCase().replace(/\s/g, "");
}

/** Calculate total annual levy for a given sector and nationality */
export function calculateAnnualLevy(sector: string, nationality: string): number {
  const sectorKey = getSectorKey(sector);
  const natKey = getNationalityKey(nationality);
  const baseLevy = BASE_LEVY_SECTOR[sectorKey] ?? BASE_LEVY_SECTOR.services;
  const natFees = NATIONALITY_FEES[natKey] ?? { visa: 0, bond: 0, total: 0 };
  return baseLevy + natFees.total;
}

/** Get all levy rates for reference (e.g. for admin UI) */
export function getAllLevyRates() {
  return {
    baseLevyBySector: BASE_LEVY_SECTOR,
    levyBySkill: LEVY_BY_SKILL,
    processingFees: PROCESSING_FEES,
    nationalityFees: NATIONALITY_FEES,
    effectiveDate: "2026-01-01",
    source: "IMI / MYEG / FWCMS",
  };
}

export const LEVY_RATES = {
  BASE_LEVY_SECTOR,
  LEVY_BY_SKILL,
  PROCESSING_FEES,
  NATIONALITY_FEES,
  FOREIGN_WORKER_CAP_PERCENT,
  EXCESS_WORKER_PENALTY_MIN,
  EXCESS_WORKER_PENALTY_MAX,
  PORTALS,
  getSectorKey,
  getNationalityKey,
  calculateAnnualLevy,
  getAllLevyRates,
};

export const AUDITOR_EMAIL = process.env.AUDITOR_EMAIL ?? ""; // Set via environment variable
