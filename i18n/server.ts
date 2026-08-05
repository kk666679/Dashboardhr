import { createInstance, type TFunction } from "i18next";
import { DEFAULT_LOCALE, DEFAULT_NS, getI18nOptions, isValidLocale, NAMESPACES } from "./config";
import type { Locale, Namespace } from "./config";
import { createFallbackHandler } from "./fallback";

type TranslationResources = Record<string, Record<string, unknown>>;

/** Simple LRU cache for loaded resources */
const resourceCache = new Map<string, TranslationResources>();
const MAX_CACHE_SIZE = 20;

function cacheResource(locale: Locale, resources: TranslationResources): void {
  if (resourceCache.size >= MAX_CACHE_SIZE) {
    const firstKey = resourceCache.keys().next().value;
    if (firstKey) resourceCache.delete(firstKey);
  }
  resourceCache.set(locale, resources);
}

async function loadResources(locale: Locale): Promise<TranslationResources> {
  // Check cache first
  const cached = resourceCache.get(locale);
  if (cached) return cached;

  const resources: TranslationResources = {};
  const missingNamespaces: string[] = [];

  for (const ns of NAMESPACES) {
    try {
      // Dynamic import — Next.js bundles these at build time
      const mod = await import(`./locales/${locale}/${ns}.json`);
      resources[ns] = mod.default ?? mod;
    } catch {
      missingNamespaces.push(ns);
      // Fallback to English if locale file is missing
      try {
        const fallback = await import(`./locales/${DEFAULT_LOCALE}/${ns}.json`);
        resources[ns] = fallback.default ?? fallback;
      } catch {
        resources[ns] = {};
      }
    }
  }

  // Log missing namespaces in development
  if (missingNamespaces.length > 0 && process.env.NODE_ENV === "development") {
    console.warn(
      `[i18n] Missing namespace(s) for locale "${locale}": [${missingNamespaces.join(", ")}]. Using English fallback.`,
    );
  }

  cacheResource(locale, resources);
  return resources;
}

export async function getTranslations(
  localeParam: string,
  ns: Namespace | Namespace[] = DEFAULT_NS,
): Promise<TFunction> {
  const locale: Locale = isValidLocale(localeParam) ? localeParam : DEFAULT_LOCALE;
  const namespaces = Array.isArray(ns) ? ns : [ns];
  const resources = await loadResources(locale);

  const instance = createInstance();
  const fallbackHandler = createFallbackHandler(DEFAULT_LOCALE);

  await instance.init({
    ...getI18nOptions(locale, namespaces),
    resources: { [locale]: resources },
    initAsync: false,
    // Apply fallback handler for missing keys
    ...(process.env.NODE_ENV === "development"
      ? {
          missingKeyHandler: (
            lngs: readonly string[],
            namespace: string,
            key: string,
            fallbackValue: string,
          ): void => {
            fallbackHandler.handleMissingKey([...lngs], namespace, key, fallbackValue);
          },
        }
      : {}),
  });

  // Return TFunction for the primary namespace, or first namespace if array
  return instance.getFixedT(locale, namespaces[0]);
}

/**
 * Get translations for multiple namespaces simultaneously.
 * Returns a record of TFunction keyed by namespace.
 */
export async function getTranslationsForNamespaces(
  localeParam: string,
  namespaces: Namespace[],
): Promise<Record<string, TFunction>> {
  const result: Record<string, TFunction> = {};
  // Load all resources once for efficiency
  const locale: Locale = isValidLocale(localeParam) ? localeParam : DEFAULT_LOCALE;
  const resources = await loadResources(locale);

  const instance = createInstance();
  await instance.init({
    ...getI18nOptions(locale, namespaces),
    resources: { [locale]: resources },
    initAsync: false,
  });

  for (const ns of namespaces) {
    result[ns] = instance.getFixedT(locale, ns);
  }

  return result;
}

/**
 * Clear server-side resource cache (useful for testing)
 */
export function clearResourceCache(): void {
  resourceCache.clear();
}
