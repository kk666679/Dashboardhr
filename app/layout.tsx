'use client';

import React from 'react';
import { TenantProvider } from './src/contexts/TenantContext';
import { RBACProvider } from './src/contexts/RBACContext';
import { ThemeProvider } from './src/contexts/ThemeContext';


/**
 * Root layout for Next.js App Router
 * Marked as a Client Component because AppContent relies on useState and client-only UI
 */
export default function RootLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <TenantProvider>
          <RBACProvider>
            <ThemeProvider>
              {/* App shell (sidebar + header + routed content) */}
              <AppContent />
              {/* Optional slot for parallel routes or overlays */}
              {children}
            </ThemeProvider>
          </RBACProvider>
        </TenantProvider>
      </body>
    </html>
  );
}
