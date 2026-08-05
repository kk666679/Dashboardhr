"use client";

import { type ReactNode, useEffect, useRef } from "react";
import { I18nextProvider } from "react-i18next";
import { initClientI18n } from "./client";
import { isValidLocale, DEFAULT_LOCALE } from "./config";
import type { Locale } from "./config";

interface I18nProviderProps {
  locale: string;
  children: ReactNode;
}

export function I18nProvider({ locale, children }: I18nProviderProps) {
  const resolvedLocale: Locale = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  // Initialise once synchronously so the first render already has translations
  const i18n = useRef(initClientI18n(resolvedLocale)).current;

  useEffect(() => {
    if (i18n.language !== resolvedLocale) {
      void i18n.changeLanguage(resolvedLocale);
    }
  }, [resolvedLocale, i18n]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
