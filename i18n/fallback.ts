// ============================================================
// Fallback Handler — deep-merge fallback with dev-mode warnings
// ============================================================

const MISSING_KEY_LOG_PREFIX = "[i18n] MISSING TRANSLATION KEY:";
const MISSING_KEY_STORAGE_KEY = "i18n_missing_keys";

/** Flatten a nested translation object into dot-notation keys */
export function flattenKeys(obj: Record<string, unknown>, prefix = ""): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "string") {
      result[fullKey] = value;
    } else if (value && typeof value === "object") {
      Object.assign(result, flattenKeys(value as Record<string, unknown>, fullKey));
    }
  }
  return result;
}

/** Deep-merge two objects (source overrides base) */
function deepMerge(base: Record<string, unknown>, source: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(source)) {
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      result[key] &&
      typeof result[key] === "object" &&
      !Array.isArray(result[key])
    ) {
      result[key] = deepMerge(result[key] as Record<string, unknown>, value as Record<string, unknown>);
    } else {
      result[key] = value;
    }
  }
  return result;
}

/**
 * Custom fallback handler for i18next that:
 * 1. Tries the target locale
 * 2. Falls back to the default locale (en)
 * 3. Returns the key path as a last resort
 * 4. Logs missing keys in development
 */
export function createFallbackHandler(defaultLocale: string) {
  const missingKeys = new Set<string>();

  return {
    type: "fallback" as const,

    /** Deep-merge default locale resources into target locale */
    apply(
      lng: string,
      fallbackLng: string | string[],
      resources: Record<string, Record<string, unknown>>,
    ): Record<string, unknown> {
      const resolvedFallback = Array.isArray(fallbackLng) ? fallbackLng[0] : fallbackLng;

      // If target has resources, merge default on top as fallback
      if (resources[lng]) {
        const defaultResources = resources[resolvedFallback];
        if (defaultResources) {
          const merged: Record<string, Record<string, unknown>> = {};
          for (const ns of Object.keys(resources[lng])) {
            merged[ns] = deepMerge(
              defaultResources[ns] as Record<string, unknown> || {},
              resources[lng][ns] as Record<string, unknown> || {},
            );
          }
          return merged;
        }
        return resources[lng];
      }

      // If target has no resources, use default
      return resources[resolvedFallback] || {};
    },

    /** Log missing keys and return fallback value */
    handleMissingKey(
      lngs: string[],
      namespace: string,
      key: string,
      fallbackValue: string,
    ): string {
      const fullKey = `${namespace}:${key}`;

      if (!missingKeys.has(fullKey)) {
        missingKeys.add(fullKey);

        if (process.env.NODE_ENV === "development") {
          // Group by namespace for cleaner output
          console.warn(
            `${MISSING_KEY_LOG_PREFIX} "${fullKey}" in languages: [${lngs.join(", ")}]`,
            `\n  ↳ Using fallback: "${fallbackValue}"`,
          );

          // Store for runtime analysis
          if (typeof window !== "undefined") {
            try {
              const stored = JSON.parse(
                sessionStorage.getItem(MISSING_KEY_STORAGE_KEY) || "[]",
              );
              stored.push({ key: fullKey, languages: lngs, timestamp: new Date().toISOString() });
              sessionStorage.setItem(MISSING_KEY_STORAGE_KEY, JSON.stringify(stored));
            } catch {
              // Silently fail storage
            }
          }
        }
      }

      // Return the fallback value (which is the key path if no translation found)
      return fallbackValue || key;
    },
  };
}

/**
 * Collect all missing keys detected during the session
 * (useful for generating reports during development)
 */
export function getCollectedMissingKeys(): Array<{
  key: string;
  languages: string[];
  timestamp: string;
}> {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(sessionStorage.getItem(MISSING_KEY_STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

/**
 * Clear collected missing key data
 */
export function clearMissingKeys(): void {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(MISSING_KEY_STORAGE_KEY);
  }
}

/**
 * Extract all key paths from a translation resource object
 */
export function extractAllKeys(
  resources: Record<string, unknown>,
  prefix = "",
): string[] {
  const keys: string[] = [];
  for (const [key, value] of Object.entries(resources)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      keys.push(...extractAllKeys(value as Record<string, unknown>, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

/**
 * Deep-compare two translation objects and return missing and extra keys
 */
export function diffTranslations(
  base: Record<string, unknown>,
  compare: Record<string, unknown>,
): { missing: string[]; extra: string[] } {
  const baseKeys = new Set(extractAllKeys(base));
  const compareKeys = new Set(extractAllKeys(compare));

  const missing: string[] = [];
  const extra: string[] = [];

  for (const key of baseKeys) {
    if (!compareKeys.has(key)) {
      missing.push(key);
    }
  }

  for (const key of compareKeys) {
    if (!baseKeys.has(key)) {
      extra.push(key);
    }
  }

  return { missing, extra };
}

/**
 * Check for placeholder/variable mismatches between locale files.
 * Returns keys where placeholders differ.
 */
export function checkPlaceholderConsistency(
  base: Record<string, unknown>,
  compare: Record<string, unknown>,
): Array<{ key: string; basePlaceholders: string[]; comparePlaceholders: string[] }> {
  const PLACEHOLDER_REGEX = /\{\{(\w+)\}\}/g;
  const mismatches: Array<{ key: string; basePlaceholders: string[]; comparePlaceholders: string[] }> = [];

  const baseFlat = flattenKeys(base);
  const compareFlat = flattenKeys(compare);

  for (const [key, baseValue] of Object.entries(baseFlat)) {
    const compareValue = compareFlat[key];
    if (!compareValue) continue;

    const basePlaceholders = [...baseValue.matchAll(PLACEHOLDER_REGEX)].map((m) => m[1]);
    const comparePlaceholders = [...compareValue.matchAll(PLACEHOLDER_REGEX)].map((m) => m[1]);

    if (basePlaceholders.length !== comparePlaceholders.length ||
        !basePlaceholders.every((p, i) => p === comparePlaceholders[i])) {
      mismatches.push({ key, basePlaceholders, comparePlaceholders });
    }
  }

  return mismatches;
}

