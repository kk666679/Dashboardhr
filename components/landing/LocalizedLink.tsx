"use client";

import type { ComponentProps } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { setLocaleInPath } from "@/lib/locale-utils";
import { isValidLocale, type Locale } from "@/i18n/config";

export function LocalizedLink({ href, ...props }: ComponentProps<typeof Link>) {
  const params = useParams<{ locale?: string }>();
  const localeParam = typeof params?.locale === "string" ? params.locale : "en";
  const locale = isValidLocale(localeParam) ? (localeParam as Locale) : "en";

  const resolvedHref =
    typeof href === "string"
      ? buildLocalizedHref(href, locale)
      : href;

  return <Link {...props} href={resolvedHref} />;
}

function buildLocalizedHref(href: string, locale: Locale) {
  if (
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    href.startsWith("#") ||
    href.startsWith("javascript:")
  ) {
    return href;
  }

  const normalizedHref = href.startsWith("/") ? href : `/${href}`;

  if (
    normalizedHref.startsWith("/api/") ||
    normalizedHref.startsWith("/_next/") ||
    normalizedHref.startsWith("/favicon.ico")
  ) {
    return normalizedHref;
  }

  return setLocaleInPath(normalizedHref, locale);
}
