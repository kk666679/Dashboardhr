"use client";

import { useEffect } from "react";

interface LocaleHtmlAttributesProps {
  lang: string;
  dir: "ltr" | "rtl";
}

/**
 * Client component that sets the `lang`, `dir`, and `className` attributes
 * on the root <html> element based on the active locale.
 *
 * This is necessary because only the root layout (app/layout.tsx) is allowed
 * to render the <html> tag in Next.js App Router. Locale-specific layouts
 * must use this component to dynamically update the HTML attributes instead.
 */
export function LocaleHtmlAttributes({ lang, dir }: LocaleHtmlAttributesProps) {
  useEffect(() => {
    // Set language and text direction
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;

    // Toggle RTL class for Tailwind RTL utilities
    document.documentElement.classList.toggle("h-full", true);

    return () => {
      // Reset to defaults on unmount
      document.documentElement.lang = "en";
      document.documentElement.dir = "ltr";
    };
  }, [lang, dir]);

  return null;
}

