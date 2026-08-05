"use client";

import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { DEFAULT_LOCALE, getI18nOptions, LOCALES, NAMESPACES, DEFAULT_NS } from "./config";
import type { Locale, Namespace } from "./config";

// ============================================================
// Statically import all locale JSON files so they are bundled
// ============================================================

// Common namespace
import enCommon from "./locales/en/common.json";
import msCommon from "./locales/ms/common.json";
import bnCommon from "./locales/bn/common.json";
import neCommon from "./locales/ne/common.json";
import zhCommon from "./locales/zh/common.json";
import esCommon from "./locales/es/common.json";
import idCommon from "./locales/id/common.json";
import thCommon from "./locales/th/common.json";
import phCommon from "./locales/ph/common.json";
import vtCommon from "./locales/vt/common.json";
import arCommon from "./locales/ar/common.json";

// Validation namespace (new)
import enValidation from "./locales/en/validation.json";
import msValidation from "./locales/ms/validation.json";
import bnValidation from "./locales/bn/validation.json";
import neValidation from "./locales/ne/validation.json";
import zhValidation from "./locales/zh/validation.json";
import esValidation from "./locales/es/validation.json";
import idValidation from "./locales/id/validation.json";
import thValidation from "./locales/th/validation.json";
import phValidation from "./locales/ph/validation.json";
import vtValidation from "./locales/vt/validation.json";
import arValidation from "./locales/ar/validation.json";

// Errors namespace (new)
import enErrors from "./locales/en/errors.json";
import msErrors from "./locales/ms/errors.json";
import bnErrors from "./locales/bn/errors.json";
import neErrors from "./locales/ne/errors.json";
import zhErrors from "./locales/zh/errors.json";
import esErrors from "./locales/es/errors.json";
import idErrors from "./locales/id/errors.json";
import thErrors from "./locales/th/errors.json";
import phErrors from "./locales/ph/errors.json";
import vtErrors from "./locales/vt/errors.json";
import arErrors from "./locales/ar/errors.json";

// Notifications namespace (new)
import enNotifications from "./locales/en/notifications.json";
import msNotifications from "./locales/ms/notifications.json";
import bnNotifications from "./locales/bn/notifications.json";
import neNotifications from "./locales/ne/notifications.json";
import zhNotifications from "./locales/zh/notifications.json";
import esNotifications from "./locales/es/notifications.json";
import idNotifications from "./locales/id/notifications.json";
import thNotifications from "./locales/th/notifications.json";
import phNotifications from "./locales/ph/notifications.json";
import vtNotifications from "./locales/vt/notifications.json";
import arNotifications from "./locales/ar/notifications.json";

// Email namespace (new)
import enEmail from "./locales/en/email.json";
import msEmail from "./locales/ms/email.json";
import bnEmail from "./locales/bn/email.json";
import neEmail from "./locales/ne/email.json";
import zhEmail from "./locales/zh/email.json";
import esEmail from "./locales/es/email.json";
import idEmail from "./locales/id/email.json";
import thEmail from "./locales/th/email.json";
import phEmail from "./locales/ph/email.json";
import vtEmail from "./locales/vt/email.json";
import arEmail from "./locales/ar/email.json";

type NamespaceResources = Record<Namespace, unknown>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const resources: Record<Locale, NamespaceResources> = {
  en: { common: enCommon, validation: enValidation, errors: enErrors, notifications: enNotifications, email: enEmail },
  ms: { common: msCommon, validation: msValidation, errors: msErrors, notifications: msNotifications, email: msEmail },
  bn: { common: bnCommon, validation: bnValidation, errors: bnErrors, notifications: bnNotifications, email: bnEmail },
  ne: { common: neCommon, validation: neValidation, errors: neErrors, notifications: neNotifications, email: neEmail },
  zh: { common: zhCommon, validation: zhValidation, errors: zhErrors, notifications: zhNotifications, email: zhEmail },
  es: { common: esCommon, validation: esValidation, errors: esErrors, notifications: esNotifications, email: esEmail },
  id: { common: idCommon, validation: idValidation, errors: idErrors, notifications: idNotifications, email: idEmail },
  th: { common: thCommon, validation: thValidation, errors: thErrors, notifications: thNotifications, email: thEmail },
  ph: { common: phCommon, validation: phValidation, errors: phErrors, notifications: phNotifications, email: phEmail },
  vt: { common: vtCommon, validation: vtValidation, errors: vtErrors, notifications: vtNotifications, email: vtEmail },
  ar: { common: arCommon, validation: arValidation, errors: arErrors, notifications: arNotifications, email: arEmail },
};

let initialised = false;

export function initClientI18n(locale: Locale = DEFAULT_LOCALE) {
  if (initialised) {
    // Already running — just switch language if needed
    if (i18next.language !== locale) {
      void i18next.changeLanguage(locale);
    }
    return i18next;
  }

  i18next
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      ...getI18nOptions(locale, [...NAMESPACES]),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      resources: resources as any,
      detection: {
        order: ["path", "cookie", "localStorage", "navigator"],
        lookupFromPathIndex: 0,
        caches: ["cookie", "localStorage"],
      },
      supportedLngs: [...LOCALES],
      // Preload all namespaces for faster access
      ns: [...NAMESPACES],
      defaultNS: DEFAULT_NS,
    });

  initialised = true;
  return i18next;
}

/**
 * Load a specific namespace on demand (lazy loading).
 * Useful for reducing initial bundle size.
 */
export async function loadNamespace(ns: Namespace, locale: Locale = DEFAULT_LOCALE): Promise<void> {
  if (i18next.hasResourceBundle(locale, ns)) return;

  try {
    const mod = await import(`./locales/${locale}/${ns}.json`);
    const bundle = mod.default ?? mod;
    i18next.addResourceBundle(locale, ns, bundle, true, true);
  } catch {
    // Fallback to English
    try {
      const mod = await import(`./locales/en/${ns}.json`);
      const bundle = mod.default ?? mod;
      i18next.addResourceBundle(locale, ns, bundle, true, true);
    } catch {
      // Namespace doesn't exist
    }
  }
}

export default i18next;
