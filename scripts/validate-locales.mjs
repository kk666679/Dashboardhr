#!/usr/bin/env node

/**
 * Locale Validation Script
 * 
 * Validates that all locale files have the same key structure as the default locale (en).
 * Checks for:
 *   - Missing keys (keys in default but not in target)
 *   - Extra keys (keys in target but not in default)
 *   - Placeholder/variable consistency ({{var}} tags)
 *   - Coverage percentage
 * 
 * Usage:
 *   node scripts/validate-locales.mjs              # Validate all locales
 *   node scripts/validate-locales.mjs --json       # Output as JSON
 *   node scripts/validate-locales.mjs --strict     # Exit with error if any missing keys
 *   node scripts/validate-locales.mjs --ns errors  # Validate specific namespace only
 */

import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const LOCALES_DIR = join(__dirname, "..", "i18n", "locales");
const DEFAULT_LOCALE = "en";

const LOCALES = ["en", "ms", "bn", "ne", "zh", "es", "id", "th", "ph", "vt", "ar"];
const NAMESPACES = ["common", "validation", "errors", "notifications", "email"];

// --- Utilities ---

function flattenKeys(obj, prefix = "") {
  const keys = {};
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      Object.assign(keys, flattenKeys(value, fullKey));
    } else {
      keys[fullKey] = value;
    }
  }
  return keys;
}

function extractPlaceholders(str) {
  const regex = /\{\{(\w+)\}\}/g;
  const placeholders = [];
  let match;
  while ((match = regex.exec(str)) !== null) {
    placeholders.push(match[1]);
  }
  return placeholders;
}

function loadJSON(filePath) {
  try {
    if (!existsSync(filePath)) return null;
    return JSON.parse(readFileSync(filePath, "utf-8"));
  } catch (err) {
    console.error(`  ⚠  Error loading ${filePath}: ${err.message}`);
    return null;
  }
}

function green(text) {
  return `\x1b[32m${text}\x1b[0m`;
}
function yellow(text) {
  return `\x1b[33m${text}\x1b[0m`;
}
function red(text) {
  return `\x1b[31m${text}\x1b[0m`;
}
function bold(text) {
  return `\x1b[1m${text}\x1b[0m`;
}

// --- Main Validation ---

function validate() {
  const args = process.argv.slice(2);
  const jsonOutput = args.includes("--json");
  const strictMode = args.includes("--strict");
  const nsFilterIndex = args.indexOf("--ns");
  const nsFilter = nsFilterIndex !== -1 && nsFilterIndex + 1 < args.length ? args[nsFilterIndex + 1] : null;

  const namespaces = nsFilter ? [nsFilter] : NAMESPACES;

  const allResults = [];

  for (const ns of namespaces) {
    if (!jsonOutput) {
      console.log(bold(`\n📁 Namespace: ${ns}`));
      console.log("=".repeat(50));
    }

    // Load default locale
    const defaultPath = join(LOCALES_DIR, DEFAULT_LOCALE, `${ns}.json`);
    const defaultData = loadJSON(defaultPath);
    if (!defaultData) {
      if (!jsonOutput) {
        console.log(yellow(`  ⚠  No default file found for namespace "${ns}", skipping...`));
      }
      continue;
    }

    const defaultKeys = flattenKeys(defaultData);
    const defaultKeyCount = Object.keys(defaultKeys).length;
    if (!jsonOutput) {
      console.log(`  Default (${DEFAULT_LOCALE}): ${defaultKeyCount} keys`);
    }

    let localeResults = [];

    for (const locale of LOCALES) {
      const targetPath = join(LOCALES_DIR, locale, `${ns}.json`);
      const targetData = loadJSON(targetPath);

      if (!targetData) {
        localeResults.push({
          locale,
          ns,
          total: defaultKeyCount,
          present: 0,
          missing: defaultKeyCount,
          missingKeys: Object.keys(defaultKeys),
          extra: 0,
          extraKeys: [],
          coverage: 0,
          placeholderIssues: [],
        });
        continue;
      }

      const targetKeys = flattenKeys(targetData);
      const targetKeyCount = Object.keys(targetKeys).length;

      // Find missing keys
      const missingKeys = [];
      for (const key of Object.keys(defaultKeys)) {
        if (!(key in targetKeys)) {
          missingKeys.push(key);
        }
      }

      // Find extra keys
      const extraKeys = [];
      for (const key of Object.keys(targetKeys)) {
        if (!(key in defaultKeys)) {
          extraKeys.push(key);
        }
      }

      // Check placeholder consistency
      const placeholderIssues = [];
      for (const key of Object.keys(defaultKeys)) {
        if (key in targetKeys) {
          const defaultPh = extractPlaceholders(String(defaultKeys[key]));
          const targetPh = extractPlaceholders(String(targetKeys[key]));
          if (JSON.stringify(defaultPh) !== JSON.stringify(targetPh)) {
            placeholderIssues.push({
              key,
              expected: defaultPh,
              actual: targetPh,
            });
          }
        }
      }

      const coverage = defaultKeyCount > 0 ? (targetKeyCount / defaultKeyCount) * 100 : 0;

      localeResults.push({
        locale,
        ns,
        total: defaultKeyCount,
        present: targetKeyCount,
        missing: missingKeys.length,
        missingKeys,
        extra: extraKeys.length,
        extraKeys,
        coverage: Math.round(coverage * 100) / 100,
        placeholderIssues,
      });
    }

    allResults.push(...localeResults);

    // Print results
    if (!jsonOutput) {
      for (const result of localeResults) {
        const status = result.coverage >= 100 ? green("✅") : result.coverage >= 90 ? yellow("⚠️") : red("❌");
        const coverageStr = result.coverage >= 100
          ? green(`${result.coverage}%`)
          : result.coverage >= 90
            ? yellow(`${result.coverage}%`)
            : red(`${result.coverage}%`);
        console.log(`  ${status} [${result.locale}] ${coverageStr} (${result.present}/${result.total})`);

        if (result.missing > 0 && result.missing <= 15) {
          for (const key of result.missingKeys) {
            console.log(`        ${red("−")} ${key}`);
          }
        } else if (result.missing > 15) {
          console.log(`        ${red(`− ${result.missing} missing keys (showing first 5)`)}`);
          for (const key of result.missingKeys.slice(0, 5)) {
            console.log(`        ${red("−")} ${key}`);
          }
        }

        if (result.placeholderIssues.length > 0) {
          for (const issue of result.placeholderIssues.slice(0, 3)) {
            console.log(`        ${yellow("⚠")} Placeholder mismatch: ${issue.key}`);
            console.log(`           Expected: {{${issue.expected.join("}}, {{")}}`);
            console.log(`           Actual:   {{${issue.actual.join("}}, {{")}}`);
          }
        }
      }
    }
  }

  // Summary
  const allMissing = allResults.filter((r) => r.missing > 0);
  const allPlaceholders = allResults.filter((r) => r.placeholderIssues.length > 0);
  const allExtra = allResults.filter((r) => r.extra > 0);
  const fullyCovered = allResults.filter((r) => r.coverage >= 100);

  const overallCoverage = allResults.length > 0
    ? allResults.reduce((sum, r) => sum + r.coverage, 0) / allResults.length
    : 0;

  if (!jsonOutput) {
    console.log(bold("\n📊 SUMMARY"));
    console.log("=".repeat(50));
    console.log(`  Locales analyzed: ${LOCALES.length}`);
    console.log(`  Namespaces analyzed: ${namespaces.join(", ")}`);
    console.log(`  Overall coverage: ${green(`${overallCoverage.toFixed(1)}%`)}`);
    console.log(`  Fully covered: ${green(`${fullyCovered.length}/${allResults.length}`)}`);
    console.log(`  With missing keys: ${red(`${allMissing.length}`)}`);
    console.log(`  With extra keys: ${yellow(`${allExtra.length}`)}`);
    console.log(`  Placeholder issues: ${allPlaceholders.length > 0 ? red(`${allPlaceholders.length}`) : green("0")}`);

    if (allMissing.length > 0) {
      console.log(bold("\n⚠️  LOCALES WITH MISSING KEYS (needs translation):"));
      for (const r of allMissing) {
        console.log(`  ${yellow(`[${r.locale}/${r.ns}]`)} ${r.missing} missing keys (${r.coverage}% coverage)`);
      }
    }

    if (strictMode && allMissing.length > 0) {
      console.log(red("\n❌ Strict mode: Validation failed!"));
      process.exit(1);
    }

    console.log(green("\n✅ Validation complete!"));
  }

  // JSON output
  if (jsonOutput) {
    const output = {
      generatedAt: new Date().toISOString(),
      summary: {
        locales: LOCALES.length,
        namespaces: namespaces,
        overallCoverage: `${overallCoverage.toFixed(1)}%`,
        fullyCovered: fullyCovered.length,
        withMissingKeys: allMissing.length,
        withPlaceholderIssues: allPlaceholders.length,
      },
      results: allResults,
      missingKeysSummary: allResults.flatMap((r) => r.missingKeys).filter(Boolean),
      placeholderIssuesSummary: allResults.flatMap((r) => r.placeholderIssues),
    };
    console.log(JSON.stringify(output, null, 2));
  }
}

validate();

