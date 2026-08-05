"use client";

import { useEffect } from "react";
import "./globals.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[v0] Global error boundary caught:", error);
  }, [error]);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <main
          role="main"
          className="flex min-h-screen items-center justify-center px-4 py-16"
        >
          <div className="w-full max-w-md text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
              500 - Server Error
            </p>
            <h1 className="mt-2 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              Application error
            </h1>
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
              A critical error occurred and the application could not recover. Please try
              reloading the page.
            </p>
            <div className="mt-8 flex items-center justify-center">
              <button
                type="button"
                onClick={() => reset()}
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Reload
              </button>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
