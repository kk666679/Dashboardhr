"use client";

import { useState, type ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import { createQueryClient } from "@/lib/query-client";
import { trpc } from "@/lib/trpc";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { I18nextProvider } from "react-i18next";
import { initClientI18n } from "@/i18n/client";

// Initialise i18next once at module load time so every route tree
// (including /dashboard/* outside [locale]) has a valid i18n instance.
const i18nInstance = initClientI18n("en");

function getBaseUrl() {
  if (typeof window !== "undefined") return "";
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => createQueryClient());

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
          transformer: superjson as never,
        }),
      ],
    }),
  );

  return (
    <I18nextProvider i18n={i18nInstance}>
      <ThemeProvider
        defaultTheme="dark"
        attribute="class"
        enableSystem
        disableTransitionOnChange
      >
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
          <QueryClientProvider client={queryClient}>
            <TooltipProvider>{children}</TooltipProvider>
          </QueryClientProvider>
        </trpc.Provider>
      </ThemeProvider>
    </I18nextProvider>
  );
}
