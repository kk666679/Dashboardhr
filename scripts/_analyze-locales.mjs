#!/usr/bin/env node
// Temporary analysis script — compares key sets across all locale common.json files.
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIR = join(__dirname, "..", "i18n", "locales");
const LOCALES = ["en", "ms", "bn", "ne", "zh", "es", "id", "th", "ph", "vt", "ar"];

function flatten(obj, prefix = "") {
  const r = {};
  for (const [k, v] of Object.entries(obj)) {
    const full = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) {
      Object.assign(r, flatten(v, full));
    } else {
      r[full] = v;
    }
  }
  return r;
}

const en = flatten(JSON.parse(readFileSync(join(DIR, "en", "common.json"), "utf8")));
const enKeys = Object.keys(en);
console.log("EN keys:", enKeys.length);
console.log("==========================================");

for (const l of LOCALES) {
  if (l === "en") continue;
  try {
    const t = flatten(JSON.parse(readFileSync(join(DIR, l, "common.json"), "utf8")));
    const missing = enKeys.filter((k) => !(k in t));
    const extra = Object.keys(t).filter((k) => !(k in en));
    console.log(`\n[${l}] total=${Object.keys(t).length} missing=${missing.length} extra=${extra.length}`);
    if (missing.length) {
      console.log("  MISSING:", missing.slice(0, 20).join(", "));
      if (missing.length > 20) console.log(`  ... and ${missing.length - 20} more`);
    }
    if (extra.length) {
      console.log("  EXTRA (sample):", extra.slice(0, 20).join(", "));
      if (extra.length > 20) console.log(`  ... and ${extra.length - 20} more`);
    }
  } catch (e) {
    console.log(`\n[${l}] ERROR loading common.json: ${e.message}`);
  }
}

// Also report top-level section key presence
console.log("\n==========================================");
console.log("TOP-LEVEL SECTION KEY PRESENCE (common.json):");
const topLevel = Object.keys(en);
for (const l of LOCALES) {
  try {
    const t = JSON.parse(readFileSync(join(DIR, l, "common.json"), "utf8"));
    const present = topLevel.filter((k) => k in t);
    const absent = topLevel.filter((k) => !(k in t));
    console.log(`[${l}] sections present=${present.length}/${topLevel.length} absent=${absent.join(",") || "none"}`);
  } catch {
    console.log(`[${l}] MISSING FILE`);
  }
}

