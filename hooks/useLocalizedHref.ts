"use client";

import { useParams } from "next/navigation";
import { isValidLocale, DEFAULT_LOCALE } from "@/i18n/config";
import type { Locale } from "@/i18n/config";

/**
 * Returns a locale-aware href helper.
 *
 * - Internal paths (e.g. `/dashboard`) are prefixed with the active locale
 *   (e.g. `/en/dashboard`).
 * - Paths that already carry a valid locale prefix are left untouched.
 * - External URLs (`http(s)://`, `mailto:`, `tel:`), anchors (`#...`),
 *   API routes (`/api/...`) and document links (`/docs/...`) are returned
 *   unchanged.
 *
 * Usage:
 *   const { href } = useLocalizedHref();
 *   <Link href={href("/dashboard")}>Dashboard</Link>
 */
export function useLocalizedHref(): {
  /** Localize a path with the active locale prefix. */
  href: (path: string) => string;
  /** The active locale (falls back to DEFAULT_LOCALE). */
  locale: Locale;
} {
  const params = useParams();
  const rawLocale = (params?.locale as string) || "";
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;

  const href = (path: string): string => {
    if (!path || path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }

    // Never prefix these
    if (
      path.startsWith("mailto:") ||
      path.startsWith("tel:") ||
      path.startsWith("#") ||
      path.startsWith("/api/") ||
      path.startsWith("/docs/") ||
      path.startsWith("/_next") ||
      path.startsWith("/static")
    ) {
      return path;
    }

    // Already localized
    const firstSegment = path.split("/").filter(Boolean)[0] ?? "";
    if (isValidLocale(firstSegment)) {
      return path;
    }

    // Bare "/" root
    if (path === "/" || path === "") {
      return `/${locale}`;
    }

    return `/${locale}${path.startsWith("/") ? path : `/${path}`}`;
  };

  return { href, locale };
}

export default useLocalizedHref;

