export { LanguageSwitcher } from "@/components/ui/language-switcher";
export { useTranslation } from "@/hooks/useTranslation";
export type { UseTranslationReturn } from "@/hooks/useTranslation";
export { I18nProvider } from "@/i18n/I18nProvider";
export { getTranslations, getTranslationsForNamespaces } from "@/i18n/server";
export { loadNamespace } from "@/i18n/client";
export {
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
  getPluralCategory,
  clearFormatterCaches,
} from "@/i18n/formatters";
export {
  extractAllKeys,
  diffTranslations,
  checkPlaceholderConsistency,
  flattenKeys,
  getCollectedMissingKeys,
} from "@/i18n/fallback";
export {
  findMissingKeys,
  checkKeyAlignment,
  getTranslationCoverage,
  generateMissingReport,
  generateTextReport,
} from "@/i18n/missing-translations";
export {
  getDirection,
  getLocaleFromPath,
  stripLocaleFromPath,
  setLocaleInPath,
  getLocalizedUrl,
  getAvailableLocales,
  getHreflangLinks,
  detectLocaleFromHeader,
} from "@/lib/locale-utils";
export type { LocaleCode, TextDirection, CommonTranslationKey } from "@/types/i18n";
// Re-export i18n config — explicitly to avoid ambiguity with types/i18n
export {
  LOCALES,
  DEFAULT_LOCALE,
  NAMESPACES,
  DEFAULT_NS,
  RTL_LOCALES,
  LOCALE_DIR,
  LOCALE_LABELS,
  LOCALE_FLAGS,
  LOCALE_BCP47,
  LOCALE_NUMBER_FORMAT,
  LOCALE_DATE_FORMAT,
  isValidLocale,
  isRtl,
  getLocaleDir,
  getI18nOptions,
} from "@/i18n/config";
export type { Locale, Namespace } from "@/i18n/config";
