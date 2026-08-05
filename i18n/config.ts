import type { InitOptions } from "i18next";

// ✅ All 11 locales synchronized with proxy.ts
export const LOCALES = ["en", "ms", "bn", "ne", "zh", "es", "id", "th", "ph", "vt", "ar"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

/** Extended namespaces for better separation of concerns */
export const NAMESPACES = ["common", "validation", "errors", "notifications", "email"] as const;
export type Namespace = (typeof NAMESPACES)[number];
export const DEFAULT_NS: Namespace = "common";

/** RTL locales (Arabic for now) */
export const RTL_LOCALES: Locale[] = ["ar"];

/** Locale text direction map - Added bn and ne */
export const LOCALE_DIR: Record<Locale, "ltr" | "rtl"> = {
  en: "ltr",
  ms: "ltr",
  bn: "ltr", // Bengali - Left to Right
  ne: "ltr", // Nepali - Left to Right
  zh: "ltr",
  es: "ltr",
  id: "ltr",
  th: "ltr",
  ph: "ltr",
  vt: "ltr",
  ar: "rtl",
};

/** Human-readable locale labels - Added bn and ne */
export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  ms: "Bahasa Melayu",
  bn: "বাংলা", // Bengali
  ne: "नेपाली", // Nepali
  zh: "中文",
  es: "Español",
  id: "Bahasa Indonesia",
  th: "ภาษาไทย",
  ph: "Filipino",
  vt: "Tiếng Việt",
  ar: "العربية",
};

/** Flag emojis - Added bn and ne */
export const LOCALE_FLAGS: Record<Locale, string> = {
  en: "🇬🇧",
  ms: "🇲🇾",
  bn: "🇧🇩", // Bangladesh
  ne: "🇳🇵", // Nepal
  zh: "🇨🇳",
  es: "🇪🇸",
  id: "🇮🇩",
  th: "🇹🇭",
  ph: "🇵🇭",
  vt: "🇻🇳",
  ar: "🇸🇦",
};

/** BCP-47 locale codes for Intl APIs - Added bn and ne */
export const LOCALE_BCP47: Record<Locale, string> = {
  en: "en-US",
  ms: "ms-MY",
  bn: "bn-BD", // Bengali (Bangladesh)
  ne: "ne-NP", // Nepali (Nepal)
  zh: "zh-CN",
  es: "es-ES",
  id: "id-ID",
  th: "th-TH",
  ph: "fil-PH",
  vt: "vi-VN",
  ar: "ar-SA",
};

/** Default number formatting options per locale - Added bn and ne */
export const LOCALE_NUMBER_FORMAT: Partial<Record<Locale, Intl.NumberFormatOptions>> = {
  en: {},
  ms: {},
  bn: {}, // Bengali number formatting
  ne: {}, // Nepali number formatting
  zh: {},
  es: {},
  id: {},
  th: {},
  ph: {},
  vt: {},
  ar: { useGrouping: true },
};

/** Default date formatting options per locale - Added bn and ne */
export const LOCALE_DATE_FORMAT: Partial<Record<Locale, Intl.DateTimeFormatOptions>> = {
  en: { year: "numeric", month: "short", day: "numeric" },
  ms: { year: "numeric", month: "long", day: "numeric" },
  bn: { year: "numeric", month: "long", day: "numeric" }, // Bengali date format
  ne: { year: "numeric", month: "long", day: "numeric" }, // Nepali date format
  zh: { year: "numeric", month: "numeric", day: "numeric" },
  es: { year: "numeric", month: "long", day: "numeric" },
  id: { year: "numeric", month: "long", day: "numeric" },
  th: { year: "numeric", month: "long", day: "numeric" },
  ph: { year: "numeric", month: "long", day: "numeric" },
  vt: { year: "numeric", month: "long", day: "numeric" },
  ar: { year: "numeric", month: "long", day: "numeric" },
};

/** Currency symbols per locale - New addition */
export const LOCALE_CURRENCY: Record<Locale, string> = {
  en: "$",
  ms: "RM",
  bn: "৳", // Taka
  ne: "रू", // Rupee
  zh: "¥",
  es: "€",
  id: "Rp",
  th: "฿",
  ph: "₱",
  vt: "₫",
  ar: "﷼",
};

/** Validation: Check if locale is valid */
export function isValidLocale(locale: string): locale is Locale {
  return (LOCALES as readonly string[]).includes(locale);
}

/** Check if a locale uses right-to-left text direction */
export function isRtl(locale: string): boolean {
  if (!isValidLocale(locale)) return false;
  return LOCALE_DIR[locale] === "rtl";
}

/** Get locale text direction */
export function getLocaleDir(locale: string): "ltr" | "rtl" {
  if (!isValidLocale(locale)) return "ltr";
  return LOCALE_DIR[locale];
}

/** Get human-readable locale label */
export function getLocaleLabel(locale: string): string {
  if (!isValidLocale(locale)) return locale;
  return LOCALE_LABELS[locale];
}

/** Get BCP-47 locale code */
export function getBCP47(locale: string): string {
  if (!isValidLocale(locale)) return "en-US";
  return LOCALE_BCP47[locale];
}

/** Get i18n configuration options (without resources — use getI18nResources for full data) */
export function getI18nOptions(locale: Locale, ns: Namespace[] = [...NAMESPACES]): InitOptions {
  return {
    lng: locale,
    ns,
    defaultNS: DEFAULT_NS,
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
    resources: {},
    fallbackLng: DEFAULT_LOCALE,
    returnNull: false,
    returnEmptyString: false,
  };
}

/**
 * Asynchronously load all translation resources for a locale using dynamic imports.
 * Replaces the synchronous require() calls for ESM compatibility.
 */
export async function getI18nResources(locale: Locale): Promise<Record<string, Record<string, any>>> {
  const [common, validation, errors, notifications, email] = await Promise.all([
    import(`../i18n/locales/${locale}/common.json`),
    import(`../i18n/locales/${locale}/validation.json`),
    import(`../i18n/locales/${locale}/errors.json`),
    import(`../i18n/locales/${locale}/notifications.json`),
    import(`../i18n/locales/${locale}/email.json`),
  ]);

  return {
    common: common.default || common,
    validation: validation.default || validation,
    errors: errors.default || errors,
    notifications: notifications.default || notifications,
    email: email.default || email,
  };
}

/** Get all supported locales with metadata */
export function getSupportedLocales() {
  return LOCALES.map((locale) => ({
    code: locale,
    label: LOCALE_LABELS[locale],
    flag: LOCALE_FLAGS[locale],
    dir: LOCALE_DIR[locale],
    bcp47: LOCALE_BCP47[locale],
    currency: LOCALE_CURRENCY[locale],
    isRtl: LOCALE_DIR[locale] === "rtl",
  }));
}
