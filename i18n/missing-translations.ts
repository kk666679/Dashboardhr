// ============================================================
// Missing Translation Detection & Validation
// ============================================================

import { extractAllKeys, diffTranslations, checkPlaceholderConsistency, flattenKeys } from "./fallback";
import { LOCALES, DEFAULT_LOCALE } from "./config";
import type { Locale } from "./config";

/** Result of comparing a locale against the default */
export interface LocaleComparison {
  locale: Locale;
  totalKeys: number;
  presentKeys: number;
  missingKeys: string[];
  extraKeys: string[];
  coverage: number; // 0–1
  placeholderMismatches: Array<{
    key: string;
    basePlaceholders: string[];
    comparePlaceholders: string[];
  }>;
}

/** Overall report for all locales */
export interface TranslationReport {
  generatedAt: string;
  defaultLocale: Locale;
  locales: LocaleComparison[];
  overallCoverage: number;
  fullyCoveredLocales: Locale[];
  partiallyCoveredLocales: Locale[];
  missingKeySummary: Record<string, Locale[]>;
}

/**
 * Load a locale's translation JSON dynamically (works on Node.js)
 * For browser use, this needs the file to be bundled.
 */
async function loadLocaleFile(locale: string, ns: string = "common"): Promise<Record<string, unknown>> {
  try {
    // Attempt dynamic import — works in both Node ESM and Next.js
    const mod = await import(`./locales/${locale}/${ns}.json`);
    return mod.default ?? mod;
  } catch {
    return {};
  }
}

/**
 * Compare all locales against the default locale (en).
 * Returns detailed comparison with coverage percentages.
 */
export async function findMissingKeys(
  baseLocale: Locale = DEFAULT_LOCALE,
  targetLocales: Locale[] = [...LOCALES],
  namespace: string = "common",
): Promise<LocaleComparison[]> {
  const baseResources = await loadLocaleFile(baseLocale, namespace);
  const baseKeys = extractAllKeys(baseResources);

  const results: LocaleComparison[] = [];

  for (const locale of targetLocales) {
    const targetResources = await loadLocaleFile(locale, namespace);
    const targetKeys = extractAllKeys(targetResources);

    const diff = diffTranslations(baseResources, targetResources);
    const placeholderIssues = checkPlaceholderConsistency(baseResources, targetResources);

    const presentKeys = targetKeys.length;
    const coverage = baseKeys.length > 0 ? presentKeys / baseKeys.length : 0;

    results.push({
      locale,
      totalKeys: baseKeys.length,
      presentKeys,
      missingKeys: diff.missing,
      extraKeys: diff.extra,
      coverage,
      placeholderMismatches: placeholderIssues,
    });
  }

  return results;
}

/**
 * Check that all locales have exactly the same key set.
 * Returns true if fully aligned, false otherwise.
 */
export async function checkKeyAlignment(
  namespace: string = "common",
): Promise<{ aligned: boolean; discrepancies: Array<{ locale: Locale; missing: string[]; extra: string[] }> }> {
  const baseLocale = DEFAULT_LOCALE;
  const baseResources = await loadLocaleFile(baseLocale, namespace);
  const baseKeys = new Set(extractAllKeys(baseResources));

  const discrepancies: Array<{ locale: Locale; missing: string[]; extra: string[] }> = [];
  let aligned = true;

  for (const locale of LOCALES) {
    if (locale === baseLocale) continue;

    const targetResources = await loadLocaleFile(locale, namespace);
    const targetKeys = new Set(extractAllKeys(targetResources));

    const missing: string[] = [];
    const extra: string[] = [];

    for (const key of baseKeys) {
      if (!targetKeys.has(key)) missing.push(key);
    }
    for (const key of targetKeys) {
      if (!baseKeys.has(key)) extra.push(key);
    }

    if (missing.length > 0 || extra.length > 0) {
      aligned = false;
      discrepancies.push({ locale, missing, extra });
    }
  }

  return { aligned, discrepancies };
}

/**
 * Get translation coverage percentage per locale (0–100)
 */
export async function getTranslationCoverage(
  namespace: string = "common",
): Promise<{ locale: Locale; coverage: number; totalKeys: number; missingCount: number }[]> {
  const baseLocale = DEFAULT_LOCALE;
  const baseResources = await loadLocaleFile(baseLocale, namespace);
  const baseKeys = extractAllKeys(baseResources);
  const totalKeys = baseKeys.length;

  const coverageResults: Array<{ locale: Locale; coverage: number; totalKeys: number; missingCount: number }> = [];

  for (const locale of LOCALES) {
    if (locale === baseLocale) {
      coverageResults.push({ locale, coverage: 100, totalKeys, missingCount: 0 });
      continue;
    }

    const targetResources = await loadLocaleFile(locale, namespace);
    const targetKeys = extractAllKeys(targetResources);
    const missingCount = totalKeys - targetKeys.length;
    const coverage = totalKeys > 0 ? Math.round((targetKeys.length / totalKeys) * 100) : 0;

    coverageResults.push({ locale, coverage, totalKeys, missingCount });
  }

  return coverageResults;
}

/**
 * Generate a comprehensive report for all locales
 */
export async function generateMissingReport(
  namespace: string = "common",
): Promise<TranslationReport> {
  const comparisons = await findMissingKeys(DEFAULT_LOCALE, [...LOCALES], namespace);

  const overallCoverage =
    comparisons.reduce((sum, c) => sum + c.coverage, 0) / comparisons.length;

  const fullyCoveredLocales = comparisons
    .filter((c) => c.coverage >= 1)
    .map((c) => c.locale);

  const partiallyCoveredLocales = comparisons
    .filter((c) => c.coverage < 1)
    .map((c) => c.locale);

  // Build a summary of which keys are missing across which locales
  const missingKeySummary: Record<string, Locale[]> = {};
  for (const comp of comparisons) {
    for (const key of comp.missingKeys) {
      if (!missingKeySummary[key]) missingKeySummary[key] = [];
      missingKeySummary[key].push(comp.locale);
    }
  }

  return {
    generatedAt: new Date().toISOString(),
    defaultLocale: DEFAULT_LOCALE,
    locales: comparisons,
    overallCoverage,
    fullyCoveredLocales,
    partiallyCoveredLocales,
    missingKeySummary,
  };
}

/**
 * Generate a human-readable text report
 */
export async function generateTextReport(
  namespace: string = "common",
): Promise<string> {
  const report = await generateMissingReport(namespace);
  const lines: string[] = [];

  lines.push("=".repeat(60));
  lines.push("TRANSLATION COVERAGE REPORT");
  lines.push("=".repeat(60));
  lines.push(`Generated: ${report.generatedAt}`);
  lines.push(`Default locale: ${report.defaultLocale}`);
  lines.push(`Namespace: ${namespace}`);
  lines.push(`Overall coverage: ${(report.overallCoverage * 100).toFixed(1)}%`);
  lines.push("");

  lines.push("LOCALE BREAKDOWN:");
  lines.push("-".repeat(40));

  for (const locale of report.locales) {
    const coveragePct = (locale.coverage * 100).toFixed(1);
    const status = locale.coverage >= 1 ? "✅" : "⚠️";
    lines.push(`${status} [${locale.locale}] ${coveragePct}% (${locale.presentKeys}/${locale.totalKeys} keys)`);

    if (locale.missingKeys.length > 0) {
      lines.push(`   Missing (${locale.missingKeys.length}):`);
      for (const key of locale.missingKeys.slice(0, 10)) {
        lines.push(`     - ${key}`);
      }
      if (locale.missingKeys.length > 10) {
        lines.push(`     ... and ${locale.missingKeys.length - 10} more`);
      }
    }

    if (locale.extraKeys.length > 0) {
      lines.push(`   Extra (${locale.extraKeys.length}): ${locale.extraKeys.join(", ")}`);
    }

    if (locale.placeholderMismatches.length > 0) {
      lines.push(`   Placeholder mismatches (${locale.placeholderMismatches.length}):`);
      for (const mismatch of locale.placeholderMismatches.slice(0, 5)) {
        lines.push(`     - ${mismatch.key}: expected [${mismatch.basePlaceholders.join(", ")}], got [${mismatch.comparePlaceholders.join(", ")}]`);
      }
    }
    lines.push("");
  }

  lines.push("=".repeat(60));
  lines.push(`MISSING KEYS SUMMARY (${Object.keys(report.missingKeySummary).length} unique keys missing in at least one locale):`);
  lines.push("-".repeat(40));

  const sortedKeys = Object.entries(report.missingKeySummary).sort(
    ([, a], [, b]) => b.length - a.length,
  );

  for (const [key, locales] of sortedKeys.slice(0, 20)) {
    lines.push(`  [${locales.join(", ")}] ${key}`);
  }

  if (sortedKeys.length > 20) {
    lines.push(`  ... and ${sortedKeys.length - 20} more`);
  }

  lines.push("");
  lines.push("RECOMMENDATIONS:");
  lines.push("-".repeat(40));

  if (report.partiallyCoveredLocales.length === 0) {
    lines.push("✅ All locales are fully covered!");
  } else {
    lines.push(`⚠️  ${report.partiallyCoveredLocales.length} locale(s) need attention:`);
    for (const locale of report.partiallyCoveredLocales) {
      const comp = report.locales.find((c) => c.locale === locale)!;
      lines.push(`   - ${locale}: missing ${comp.missingKeys.length} key(s)`);
    }
    lines.push("Run `node scripts/validate-locales.mjs` for full details.");
  }

  return lines.join("\n");
}

