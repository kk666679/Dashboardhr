import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { I18nProvider } from "@/i18n/I18nProvider";
import { isValidLocale, LOCALE_BCP47, getLocaleDir } from "@/i18n/config";
import { LocaleHtmlAttributes } from "@/components/LocaleHtmlAttributes";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  // RTL support — centralized via config
  const dir = getLocaleDir(locale);
  const lang = LOCALE_BCP47[locale];

  return (
    <>
      <LocaleHtmlAttributes lang={lang} dir={dir} />
      <I18nProvider locale={locale}>{children}</I18nProvider>
    </>
  );
}
