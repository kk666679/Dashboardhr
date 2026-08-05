import "./globals.css";
import { Providers } from "@/components/layout/providers";
import type { ReactNode } from "react";

/**
 * Root layout must always return the top-level HTML document shell.
 * Locale-specific layouts may override lang/dir, but this root wrapper
 * is still responsible for the mandatory <html> and <body> tags.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}