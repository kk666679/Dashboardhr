// ============================================================
// Locale Utilities — URL helpers, direction detection, etc.
// ============================================================

import { LOCALES, isValidLocale, DEFAULT_LOCALE, LOCALE_DIR } from "@/i18n/config";
import type { Locale } from "@/i18n/config";

/**
 * Get the text direction for a given locale
 */
export function getDirection(locale: string): "ltr" | "rtl" {
  if (!isValidLocale(locale)) return "ltr";
  return LOCALE_DIR[locale];
}

/**
 * Check if a locale uses right-to-left text direction
 */
export function isRtl(locale: string): boolean {
  return getDirection(locale) === "rtl";
}

/**
 * Extract locale from a URL pathname.
 * Returns the default locale if no valid locale is found in the path.
 */
export function getLocaleFromPath(pathname: string): Locale {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length > 0 && isValidLocale(segments[0])) {
    return segments[0];
  }
  return DEFAULT_LOCALE;
}

/**
 * Remove the locale segment from a URL pathname
 */
export function stripLocaleFromPath(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length > 0 && isValidLocale(segments[0])) {
    return "/" + segments.slice(1).join("/");
  }
  return pathname;
}

/**
 * Replace or add locale segment in a URL pathname
 */
export function setLocaleInPath(pathname: string, targetLocale: Locale): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length > 0 && isValidLocale(segments[0])) {
    segments[0] = targetLocale;
  } else {
    segments.unshift(targetLocale);
  }
  return "/" + segments.join("/");
}

/**
 * Get a localized URL for a given path and target locale.
 * Preserves query parameters and hash.
 */
export function getLocalizedUrl(
  path: string,
  targetLocale: Locale,
  currentLocale?: string,
): string {
  // Parse the path to extract query string and hash
  const queryStart = path.indexOf("?");
  const hashStart = path.indexOf("#");

  const queryString = queryStart !== -1 ? path.slice(queryStart) : "";
  const hash = hashStart !== -1 ? path.slice(hashStart) : "";

  let pathWithoutQuery = path;
  if (queryStart !== -1) pathWithoutQuery = path.slice(0, queryStart);
  if (hashStart !== -1) pathWithoutQuery = pathWithoutQuery.slice(0, hashStart);

  const localizedPath = setLocaleInPath(pathWithoutQuery, targetLocale);
  return localizedPath + queryString + hash;
}

/**
 * Get all available locales with their metadata
 */
export function getAvailableLocales() {
  const localeList = [...LOCALES];
  return localeList.map((code) => ({
    code,
    dir: LOCALE_DIR[code],
  }));
}

/**
 * Generate hreflang links for SEO for a given path
 */
export function getHreflangLinks(pathname: string): Array<{
  rel: string;
  href: string;
  hrefLang: string;
}> {
  const path = stripLocaleFromPath(pathname);
  const links: Array<{ rel: string; href: string; hrefLang: string }> = [];

  for (const locale of LOCALES) {
    links.push({
      rel: "alternate",
      href: setLocaleInPath(path, locale),
      hrefLang: locale,
    });
  }

  // Add x-default (default locale)
  links.push({
    rel: "alternate",
    href: path || "/",
    hrefLang: "x-default",
  });

  return links;
}

/**
 * Detect preferred locale from Accept-Language header
 */
export function detectLocaleFromHeader(
  acceptLanguage: string | null | undefined,
): Locale {
  if (!acceptLanguage) return DEFAULT_LOCALE;

  // Parse the Accept-Language header
  const preferred = acceptLanguage
    .split(",")
    .map((lang) => {
      const [code, q = "q=1"] = lang.trim().split(";");
      const quality = parseFloat(q.split("=")[1]) || 1;
      return { code: code.split("-")[0], quality };
    })
    .sort((a, b) => b.quality - a.quality);

  // Find the first matching locale
  for (const lang of preferred) {
    if (isValidLocale(lang.code)) {
      return lang.code as Locale;
    }
  }

  return DEFAULT_LOCALE;
}

/**
 * Format a locale code for display with its native name
 */
export function getLocaleDisplayName(locale: Locale): string {
  const displayNames = new Intl.DisplayNames([LOCALE_DIR[locale] === "rtl" ? "ar" : locale], {
    type: "language",
  });
  try {
    return displayNames.of(locale) || locale;
  } catch {
    return locale;
  }
}

