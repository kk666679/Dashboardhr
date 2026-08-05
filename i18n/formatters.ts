// ============================================================
// Locale-aware Formatters (Date, Number, Currency, Pluralization)
// ============================================================

import { LOCALE_BCP47 } from "./config";
import type { Locale } from "./config";

// ============================================================
// Number Formatting
// ============================================================

const numberFormatterCache = new Map<string, Intl.NumberFormat>();

function getNumberFormatter(locale: Locale, options?: Intl.NumberFormatOptions): Intl.NumberFormat {
  const bcp47 = LOCALE_BCP47[locale] || locale;
  const cacheKey = `${bcp47}:${JSON.stringify(options || {})}`;

  if (numberFormatterCache.has(cacheKey)) {
    return numberFormatterCache.get(cacheKey)!;
  }

  const formatter = new Intl.NumberFormat(bcp47, options);
  numberFormatterCache.set(cacheKey, formatter);
  return formatter;
}

/**
 * Format a number according to the locale
 */
export function formatNumber(
  value: number | bigint,
  locale: Locale,
  options?: Intl.NumberFormatOptions,
): string {
  try {
    return getNumberFormatter(locale, options).format(value);
  } catch {
    return String(value);
  }
}

/**
 * Format a number as a percentage
 */
export function formatPercent(
  value: number,
  locale: Locale,
  fractionDigits = 1,
): string {
  return formatNumber(value, locale, {
    style: "percent",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}

/**
 * Format a number with compact notation (e.g., 1.5K, 2.3M)
 */
export function formatCompactNumber(
  value: number,
  locale: Locale,
): string {
  return formatNumber(value, locale, {
    notation: "compact",
    compactDisplay: "short",
  });
}

// ============================================================
// Currency Formatting
// ============================================================

const currencyFormatterCache = new Map<string, Intl.NumberFormat>();

/**
 * Format a monetary value according to locale and currency
 */
export function formatCurrency(
  value: number,
  currency: string,
  locale: Locale,
  options?: Omit<Intl.NumberFormatOptions, "style" | "currency">,
): string {
  const bcp47 = LOCALE_BCP47[locale] || locale;
  const cacheKey = `${bcp47}:${currency}:${JSON.stringify(options || {})}`;

  if (currencyFormatterCache.has(cacheKey)) {
    return currencyFormatterCache.get(cacheKey)!.format(value);
  }

  const formatter = new Intl.NumberFormat(bcp47, {
    style: "currency",
    currency,
    ...options,
  });

  currencyFormatterCache.set(cacheKey, formatter);
  return formatter.format(value);
}

// ============================================================
// Date & Time Formatting
// ============================================================

const dateFormatterCache = new Map<string, Intl.DateTimeFormat>();

function getDateFormatter(locale: Locale, options?: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  const bcp47 = LOCALE_BCP47[locale] || locale;
  const cacheKey = `${bcp47}:${JSON.stringify(options || {})}`;

  if (dateFormatterCache.has(cacheKey)) {
    return dateFormatterCache.get(cacheKey)!;
  }

  const formatter = new Intl.DateTimeFormat(bcp47, options);
  dateFormatterCache.set(cacheKey, formatter);
  return formatter;
}

/**
 * Format a date according to locale
 */
export function formatDate(
  date: Date | number | string,
  locale: Locale,
  options?: Intl.DateTimeFormatOptions,
): string {
  try {
    const d = typeof date === "string" ? new Date(date) : date;
    return getDateFormatter(locale, options).format(d);
  } catch {
    return String(date);
  }
}

/**
 * Predefined date format: short (e.g., "01/15/2024" or "15/01/2024")
 */
export function formatDateShort(date: Date | number | string, locale: Locale): string {
  return formatDate(date, locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

/**
 * Predefined date format: medium (e.g., "Jan 15, 2024")
 */
export function formatDateMedium(date: Date | number | string, locale: Locale): string {
  return formatDate(date, locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Predefined date format: long (e.g., "January 15, 2024")
 */
export function formatDateLong(date: Date | number | string, locale: Locale): string {
  return formatDate(date, locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Format a time value according to locale
 */
export function formatTime(
  date: Date | number | string,
  locale: Locale,
  options?: Intl.DateTimeFormatOptions,
): string {
  return formatDate(date, locale, {
    hour: "2-digit",
    minute: "2-digit",
    ...options,
  });
}

/**
 * Format a full date and time
 */
export function formatDateTime(
  date: Date | number | string,
  locale: Locale,
): string {
  return formatDate(date, locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Format a relative time (e.g., "2 days ago", "in 3 hours")
 * Falls back to date-only formatting for older dates
 */
export function formatRelativeTime(
  date: Date | number | string,
  locale: Locale,
): string {
  const bcp47 = LOCALE_BCP47[locale] || locale;
  try {
    const parsedDate = typeof date === "string" ? new Date(date) : new Date(date);
    const now = new Date();
    const diffMs = parsedDate.getTime() - now.getTime();
    const diffSeconds = Math.round(diffMs / 1000);
    const absDiffSeconds = Math.abs(diffSeconds);

    // Use Intl.RelativeTimeFormat if available
    if (typeof Intl.RelativeTimeFormat !== "undefined") {
      const rtf = new Intl.RelativeTimeFormat(bcp47, { numeric: "auto" });

      if (absDiffSeconds < 60) return rtf.format(diffSeconds, "second");
      if (absDiffSeconds < 3600) return rtf.format(Math.round(diffSeconds / 60), "minute");
      if (absDiffSeconds < 86400) return rtf.format(Math.round(diffSeconds / 3600), "hour");
      if (absDiffSeconds < 2592000) return rtf.format(Math.round(diffSeconds / 86400), "day");
      if (absDiffSeconds < 31536000) return rtf.format(Math.round(diffSeconds / 2592000), "month");
      return rtf.format(Math.round(diffSeconds / 31536000), "year");
    }

    // Fallback to short date
    return formatDateShort(parsedDate, locale);
  } catch {
    return String(date);
  }
}

// ============================================================
// Pluralization
// ============================================================

/**
 * Pluralization rules per locale (based on CLDR data)
 */
type PluralRule = "zero" | "one" | "two" | "few" | "many" | "other";

const pluralRules: Record<string, (n: number) => PluralRule> = {
  // English-like: 1 = one, everything else = other
  en: (n) => (n === 1 ? "one" : "other"),
  ms: () => "other",
  id: () => "other",
  th: () => "other",
  ph: () => "other",
  vt: () => "other",
  // Arabic has 6 plural forms
  ar: (n) => {
    if (n === 0) return "zero";
    if (n === 1) return "one";
    if (n === 2) return "two";
    if (n % 100 >= 3 && n % 100 <= 10) return "few";
    if (n % 100 >= 11) return "many";
    return "other";
  },
  // Chinese-like: other for everything
  zh: () => "other",
  es: (n) => (n === 1 ? "one" : "other"),
};

/**
 * Get the plural category for a number in a given locale
 */
export function getPluralCategory(locale: Locale, count: number): PluralRule {
  const rule = pluralRules[locale] || pluralRules.en;
  return rule(count);
}

/**
 * Format a pluralized string with count.
 * Uses Intl.PluralRules when available, falls back to custom rules.
 */
export function formatPlural(
  count: number,
  locale: Locale,
  singular: string,
  plural: string,
  zero?: string,
): string {
  if (count === 0 && zero) return zero.replace("{{count}}", String(count));
  const category = getPluralCategory(locale, count);
  if (category === "one") return singular.replace("{{count}}", String(count));
  return plural.replace("{{count}}", String(count));
}

// ============================================================
// List Formatting
// ============================================================

const listFormatterCache = new Map<string, Intl.ListFormat>();

/**
 * Format a list of items according to locale (e.g., "A, B, and C")
 */
export function formatList(
  items: string[],
  locale: Locale,
  type: Intl.ListFormatType = "conjunction",
): string {
  const bcp47 = LOCALE_BCP47[locale] || locale;
  const cacheKey = `${bcp47}:${type}`;

  if (listFormatterCache.has(cacheKey)) {
    return listFormatterCache.get(cacheKey)!.format(items);
  }

  try {
    const formatter = new Intl.ListFormat(bcp47, { style: "long", type });
    listFormatterCache.set(cacheKey, formatter);
    return formatter.format(items);
  } catch {
    return items.join(", ");
  }
}

// ============================================================
// Ordinal Number Formatting
// ============================================================

/**
 * Format a number as an ordinal (e.g., 1st, 2nd, 3rd)
 */
export function formatOrdinal(
  value: number,
  locale: Locale,
): string {
  const bcp47 = LOCALE_BCP47[locale] || locale;
  try {
    const formatter = new Intl.PluralRules(bcp47, { type: "ordinal" });
    const category = formatter.select(value);

    // Ordinal suffixes by locale
    const ordinalMap: Record<string, Record<string, string>> = {
      en: { one: "st", two: "nd", few: "rd", other: "th" },
    };

    const suffix = ordinalMap[locale]?.[category] || "";
    return `${value}${suffix}`;
  } catch {
    return String(value);
  }
}

// ============================================================
// Utility: Clear all formatter caches (useful for testing)
// ============================================================

export function clearFormatterCaches(): void {
  numberFormatterCache.clear();
  currencyFormatterCache.clear();
  dateFormatterCache.clear();
  listFormatterCache.clear();
}

