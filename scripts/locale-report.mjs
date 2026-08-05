#!/usr/bin/env node

/**
 * Locale Coverage Report Generator
 * 
 * Generates comprehensive reports on translation coverage across all locales:
 *   - HTML report with color-coded status
 *   - JSON report for programmatic consumption
 *   - Human-readable console report
 * 
 * Usage:
 *   node scripts/locale-report.mjs                         # Console + HTML report
 *   node scripts/locale-report.mjs --json                   # JSON only
 *   node scripts/locale-report.mjs --html                   # HTML only
 *   node scripts/locale-report.mjs --output-dir ./reports   # Custom output directory
 */

import { readFileSync, existsSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname, basename } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const LOCALES_DIR = join(__dirname, "..", "i18n", "locales");
const DEFAULT_LOCALE = "en";

const LOCALES = ["en", "ms", "bn", "ne", "zh", "es", "id", "th", "ph", "vt", "ar"];
const NAMESPACES = ["common", "validation", "errors", "notifications", "email"];

const LOCALE_LABELS = {
  en: "English",
  ms: "Bahasa Melayu",
  bn: "বাংলা",
  ne: "नेपाली",
  zh: "中文",
  es: "Español",
  id: "Bahasa Indonesia",
  th: "ภาษาไทย",
  ph: "Filipino",
  vt: "Tiếng Việt",
  ar: "العربية",
};

// --- Utilities ---

function flattenKeys(obj, prefix = "") {
  const keys = {};
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      Object.assign(keys, flattenKeys(value, fullKey));
    } else {
      keys[fullKey] = String(value);
    }
  }
  return keys;
}

function loadJSON(filePath) {
  try {
    if (!existsSync(filePath)) return null;
    return JSON.parse(readFileSync(filePath, "utf-8"));
  } catch { return null; }
}

function green(text) { return `\x1b[32m${text}\x1b[0m`; }
function yellow(text) { return `\x1b[33m${text}\x1b[0m`; }
function red(text) { return `\x1b[31m${text}\x1b[0m`; }
function bold(text) { return `\x1b[1m${text}\x1b[0m`; }

// --- Analysis ---

function analyze() {
  const args = process.argv.slice(2);
  const jsonOnly = args.includes("--json");
  const htmlOnly = args.includes("--html");
  const outputDirIndex = args.indexOf("--output-dir");
  const outputDir = outputDirIndex !== -1 && outputDirIndex + 1 < args.length
    ? args[outputDirIndex + 1]
    : join(__dirname, "..", "reports", "i18n");

  const analysis = [];

  for (const ns of NAMESPACES) {
    const defaultPath = join(LOCALES_DIR, DEFAULT_LOCALE, `${ns}.json`);
    const defaultData = loadJSON(defaultPath);
    if (!defaultData) continue;

    const defaultKeys = flattenKeys(defaultData);
    const totalKeys = Object.keys(defaultKeys).length;

    for (const locale of LOCALES) {
      const targetPath = join(LOCALES_DIR, locale, `${ns}.json`);
      const targetData = loadJSON(targetPath);
      const targetKeys = targetData ? flattenKeys(targetData) : {};

      const missingKeys = [];
      const extraKeys = [];
      let presentCount = 0;

      for (const key of Object.keys(defaultKeys)) {
        if (key in targetKeys) {
          presentCount++;
        } else {
          missingKeys.push(key);
        }
      }

      for (const key of Object.keys(targetKeys)) {
        if (!(key in defaultKeys)) {
          extraKeys.push(key);
        }
      }

      const coverage = totalKeys > 0 ? (presentCount / totalKeys) * 100 : 0;

      analysis.push({
        locale,
        ns,
        label: LOCALE_LABELS[locale] || locale,
        totalKeys,
        presentKeys: presentCount,
        missingCount: missingKeys.length,
        extraCount: extraKeys.length,
        missingKeys,
        extraKeys,
        coverage: Math.round(coverage * 100) / 100,
        status: coverage >= 100 ? "complete" : coverage >= 90 ? "partial" : "incomplete",
      });
    }
  }

  // Summary by locale
  const localeSummary = {};
  for (const locale of LOCALES) {
    const entries = analysis.filter((a) => a.locale === locale);
    const overall = entries.reduce((sum, e) => sum + e.coverage, 0) / (entries.length || 1);
    localeSummary[locale] = {
      label: LOCALE_LABELS[locale] || locale,
      totalMissing: entries.reduce((sum, e) => sum + e.missingCount, 0),
      totalExtra: entries.reduce((sum, e) => sum + e.extraCount, 0),
      namespaces: entries.map((e) => ({
        ns: e.ns,
        coverage: e.coverage,
        status: e.status,
        missingCount: e.missingCount,
      })),
      overallCoverage: Math.round(overall * 100) / 100,
    };
  }

  // Overall stats
  const allCoverage = LOCALES.map((loc) => localeSummary[loc].overallCoverage);
  const overallAvg = allCoverage.reduce((a, b) => a + b, 0) / allCoverage.length;
  const fullyComplete = LOCALES.filter((loc) => localeSummary[loc].overallCoverage >= 100);
  const needsWork = LOCALES.filter(
    (loc) => localeSummary[loc].overallCoverage < 100 || localeSummary[loc].totalMissing > 0,
  );

  return {
    generatedAt: new Date().toISOString(),
    locales: LOCALES,
    namespaces: NAMESPACES,
    overallCoverage: Math.round(overallAvg * 100) / 100,
    fullyCompleteLocales: fullyComplete,
    needsWorkLocales: needsWork,
    totalMissingKeys: needsWork.reduce((sum, loc) => sum + localeSummary[loc].totalMissing, 0),
    localeSummary,
    detail: analysis,
  };
}

// --- HTML Report ---

function generateHTML(report) {
  const statusColor = (status) => {
    switch (status) {
      case "complete": return "#22c55e";
      case "partial": return "#eab308";
      case "incomplete": return "#ef4444";
      default: return "#6b7280";
    }
  };

  const localeRows = report.locales.map((locale) => {
    const ls = report.localeSummary[locale];
    const coveragePct = ls.overallCoverage;
    const color = coveragePct >= 100 ? "#22c55e" : coveragePct >= 90 ? "#eab308" : "#ef4444";

    const nsBars = ls.namespaces.map(
      (n) => `
        <div class="ns-item">
          <span class="ns-label">${n.ns}</span>
          <div class="ns-bar-bg">
            <div class="ns-bar-fill" style="width: ${n.coverage}%; background: ${statusColor(n.status)}"></div>
          </div>
          <span class="ns-pct">${n.coverage}%</span>
          ${n.missingCount > 0 ? `<span class="ns-missing">(-${n.missingCount})</span>` : ""}
        </div>`
    ).join("");

    return `
      <div class="locale-card">
        <div class="locale-header">
          <span class="locale-flag">${getFlag(locale)}</span>
          <span class="locale-name">${ls.label}</span>
          <span class="locale-code">[${locale}]</span>
          <span class="locale-coverage" style="color: ${color}">${coveragePct}%</span>
          <span class="locale-missing">(${ls.totalMissing} missing)</span>
        </div>
        <div class="locale-detail">
          ${nsBars}
        </div>
      </div>`;
  }).join("");

  function getFlag(locale) {
    const flags = {
      en: "🇬🇧", ms: "🇲🇾", zh: "🇨🇳", es: "🇪🇸",
      id: "🇮🇩", th: "🇹🇭", ph: "🇵🇭", vt: "🇻🇳", ar: "🇸🇦",
    };
    return flags[locale] || "🌐";
  }

  const overallColor = report.overallCoverage >= 100 ? "#22c55e" : report.overallCoverage >= 90 ? "#eab308" : "#ef4444";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>i18n Translation Coverage Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #e2e8f0; padding: 2rem; }
    .container { max-width: 1200px; margin: 0 auto; }
    h1 { font-size: 2rem; margin-bottom: 0.5rem; color: #f8fafc; }
    .subtitle { color: #94a3b8; margin-bottom: 2rem; }
    .overall { background: #1e293b; border-radius: 1rem; padding: 1.5rem 2rem; margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center; }
    .overall-value { font-size: 3rem; font-weight: 700; }
    .overall-stats { display: flex; gap: 2rem; }
    .stat { text-align: center; }
    .stat-value { font-size: 1.5rem; font-weight: 600; }
    .stat-label { font-size: 0.875rem; color: #94a3b8; }
    .locale-card { background: #1e293b; border-radius: 0.75rem; padding: 1.25rem; margin-bottom: 1rem; }
    .locale-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem; }
    .locale-flag { font-size: 1.5rem; }
    .locale-name { font-weight: 600; }
    .locale-code { color: #64748b; font-size: 0.875rem; }
    .locale-coverage { margin-left: auto; font-weight: 700; font-size: 1.25rem; }
    .locale-missing { color: #94a3b8; font-size: 0.875rem; }
    .ns-item { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem; }
    .ns-label { width: 100px; font-size: 0.875rem; color: #94a3b8; }
    .ns-bar-bg { flex: 1; height: 8px; background: #334155; border-radius: 999px; overflow: hidden; }
    .ns-bar-fill { height: 100%; border-radius: 999px; transition: width 0.5s ease; }
    .ns-pct { width: 48px; font-size: 0.875rem; text-align: right; }
    .ns-missing { color: #ef4444; font-size: 0.75rem; }
    .footer { margin-top: 2rem; text-align: center; color: #64748b; font-size: 0.875rem; }
    .status-dot { display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 0.5rem; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🌍 Translation Coverage Report</h1>
    <p class="subtitle">Comprehensive i18n coverage analysis — Generated on ${new Date(report.generatedAt).toLocaleString()}</p>

    <div class="overall">
      <div>
        <div class="overall-value" style="color: ${overallColor}">${report.overallCoverage}%</div>
        <div>Overall Coverage</div>
      </div>
      <div class="overall-stats">
        <div class="stat">
          <div class="stat-value">${report.locales.length}</div>
          <div class="stat-label">Locales</div>
        </div>
        <div class="stat">
          <div class="stat-value">${report.namespaces.length}</div>
          <div class="stat-label">Namespaces</div>
        </div>
        <div class="stat">
          <div class="stat-value" style="color: #22c55e">${report.fullyCompleteLocales.length}</div>
          <div class="stat-label">Complete</div>
        </div>
        <div class="stat">
          <div class="stat-value" style="color: #ef4444">${report.totalMissingKeys}</div>
          <div class="stat-label">Missing Keys</div>
        </div>
      </div>
    </div>

    ${localeRows}
    <div class="footer">
      Generated by locale-report.mjs • ${report.generatedAt}
    </div>
  </div>
</body>
</html>`;
}

// --- Console Report ---

function generateConsoleReport(report) {
  const lines = [];
  const bar = "=".repeat(60);

  lines.push("");
  lines.push(green(bar));
  lines.push(green(bold("        TRANSLATION COVERAGE REPORT")));
  lines.push(green(bar));
  lines.push(`  Generated: ${report.generatedAt}`);
  lines.push(`  Overall coverage: ${report.overallCoverage >= 100 ? green(`${report.overallCoverage}%`) : yellow(`${report.overallCoverage}%`)}`);
  lines.push(`  Locales: ${report.locales.length}  |  Namespaces: ${report.namespaces.length}`);
  lines.push(`  Fully complete: ${green(`${report.fullyCompleteLocales.length}/${report.locales.length}`)}`);
  lines.push(`  Total missing keys: ${red(String(report.totalMissingKeys))}`);
  lines.push("");

  for (const locale of report.locales) {
    const ls = report.localeSummary[locale];
    const status = ls.overallCoverage >= 100 ? green("✅") : ls.overallCoverage >= 90 ? yellow("⚠️") : red("❌");
    const covStr = ls.overallCoverage >= 100
      ? green(`${ls.overallCoverage}%`)
      : ls.overallCoverage >= 90
        ? yellow(`${ls.overallCoverage}%`)
        : red(`${ls.overallCoverage}%`);

    lines.push(`  ${status} [${locale}] ${ls.label}: ${covStr} (${ls.totalMissing} missing)`);

    if (ls.totalMissing > 0) {
      for (const ns of ls.namespaces) {
        if (ns.missingCount > 0) {
          lines.push(`       ${red("−")} ${ns.ns}: ${ns.missingCount} missing (${ns.coverage}%)`);
        }
      }
    }
  }

  lines.push("");
  lines.push(green(bar));
  lines.push(green(bold("        REPORT GENERATED SUCCESSFULLY")));
  lines.push(green(bar));

  return lines.join("\n");
}

// --- Main ---

function main() {
  const args = process.argv.slice(2);
  const jsonOnly = args.includes("--json");
  const htmlOnly = args.includes("--html");
  const outputDirIndex = args.indexOf("--output-dir");
  const outputDir = outputDirIndex !== -1 && outputDirIndex + 1 < args.length
    ? args[outputDirIndex + 1]
    : join(__dirname, "..", "reports", "i18n");

  console.log(bold("🔍 Analyzing translation coverage...\n"));

  const report = analyze();

  // Console output (default)
  if (!htmlOnly) {
    console.log(generateConsoleReport(report));
  }

  // JSON output (default)
  if (!htmlOnly || jsonOnly) {
    mkdirSync(outputDir, { recursive: true });
    const jsonPath = join(outputDir, "locale-report.json");
    writeFileSync(jsonPath, JSON.stringify(report, null, 2));
    console.log(green(`  📄 JSON report saved: ${jsonPath}`));
  }

  // HTML output (default)
  if (!jsonOnly || htmlOnly) {
    mkdirSync(outputDir, { recursive: true });
    const htmlPath = join(outputDir, "locale-report.html");
    writeFileSync(htmlPath, generateHTML(report));
    console.log(green(`  📄 HTML report saved: ${htmlPath}`));
  }
}

main();

