"use client";

import { useTranslation as useI18nTranslation } from "react-i18next";
import { useRouter, usePathname } from "next/navigation";
import {
  LOCALES,
  LOCALE_LABELS,
  LOCALE_FLAGS,
  isValidLocale,
  DEFAULT_LOCALE,
  LOCALE_DIR,
  isRtl,
} from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import { setLocaleInPath } from "@/lib/locale-utils";
import {
  formatNumber,
  formatPercent,
  formatCompactNumber,
  formatCurrency,
  formatDate,
  formatDateShort,
  formatDateMedium,
  formatDateLong,
  formatTime,
  formatDateTime,
  formatRelativeTime,
  formatPlural,
  formatList,
  formatOrdinal,
} from "@/i18n/formatters";

export interface UseTranslationReturn {
  /** i18next t() function for translating keys */
  t: ReturnType<typeof useI18nTranslation>["t"];
  /** i18n instance */
  i18n: ReturnType<typeof useI18nTranslation>["i18n"];
  /** Change the current language */
  changeLanguage: (lng: string) => Promise<void>;
  /** Current language code */
  currentLanguage: Locale;
  /** List of available languages */
  languages: Array<{ code: Locale; name: string; flag: string }>;
  /** Text direction for the current locale */
  dir: "ltr" | "rtl";
  /** Whether the current locale uses RTL */
  isRtl: boolean;

  // --- Formatters ---
  /** Format a number according to the current locale */
  formatNumber: (value: number | bigint, options?: Intl.NumberFormatOptions) => string;
  /** Format a number as a percentage */
  formatPercent: (value: number, fractionDigits?: number) => string;
  /** Format a number with compact notation */
  formatCompactNumber: (value: number) => string;
  /** Format a monetary value */
  formatCurrency: (value: number, currency: string, options?: Omit<Intl.NumberFormatOptions, "style" | "currency">) => string;
  /** Format a date according to the current locale */
  formatDate: (date: Date | number | string, options?: Intl.DateTimeFormatOptions) => string;
  /** Format a date in short format */
  formatDateShort: (date: Date | number | string) => string;
  /** Format a date in medium format */
  formatDateMedium: (date: Date | number | string) => string;
  /** Format a date in long format */
  formatDateLong: (date: Date | number | string) => string;
  /** Format a time */
  formatTime: (date: Date | number | string, options?: Intl.DateTimeFormatOptions) => string;
  /** Format a full date and time */
  formatDateTime: (date: Date | number | string) => string;
  /** Format a relative time string (e.g., "2 days ago") */
  formatRelativeTime: (date: Date | number | string) => string;
  /** Format a pluralized string */
  formatPlural: (count: number, singular: string, plural: string, zero?: string) => string;
  /** Format a list of items */
  formatList: (items: string[], type?: Intl.ListFormatType) => string;
  /** Format an ordinal number */
  formatOrdinal: (value: number) => string;
}

export function useTranslation(): UseTranslationReturn {
  const { t, i18n } = useI18nTranslation();
  const router = useRouter();
  const pathname = usePathname();

  const changeLanguage = async (lng: string) => {
    if (!isValidLocale(lng)) return;
    await i18n.changeLanguage(lng);
    const nextPath = setLocaleInPath(pathname, lng);
    router.push(nextPath || "/");
  };

  const currentLanguage: Locale = isValidLocale(i18n.language) ? i18n.language : DEFAULT_LOCALE;
  const direction = isRtl(currentLanguage) ? "rtl" : "ltr";

  const languages = LOCALES.map((code) => ({
    code: code as Locale,
    name: LOCALE_LABELS[code],
    flag: LOCALE_FLAGS[code],
  }));

  return {
    t,
    i18n,
    changeLanguage,
    currentLanguage,
    languages,
    dir: direction,
    isRtl: direction === "rtl",

    // Formatters bound to the current locale
    formatNumber: (value, options) => formatNumber(value, currentLanguage, options),
    formatPercent: (value, fractionDigits) => formatPercent(value, currentLanguage, fractionDigits),
    formatCompactNumber: (value) => formatCompactNumber(value, currentLanguage),
    formatCurrency: (value, currency, options) => formatCurrency(value, currency, currentLanguage, options),
    formatDate: (date, options) => formatDate(date, currentLanguage, options),
    formatDateShort: (date) => formatDateShort(date, currentLanguage),
    formatDateMedium: (date) => formatDateMedium(date, currentLanguage),
    formatDateLong: (date) => formatDateLong(date, currentLanguage),
    formatTime: (date, options) => formatTime(date, currentLanguage, options),
    formatDateTime: (date) => formatDateTime(date, currentLanguage),
    formatRelativeTime: (date) => formatRelativeTime(date, currentLanguage),
    formatPlural: (count, singular, plural, zero) => formatPlural(count, currentLanguage, singular, plural, zero),
    formatList: (items, type) => formatList(items, currentLanguage, type),
    formatOrdinal: (value) => formatOrdinal(value, currentLanguage),
  };
}
