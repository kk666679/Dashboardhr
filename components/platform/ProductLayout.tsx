"use client";

import { AppShell } from "./AppShell";

interface ProductLayoutProps {
  children: React.ReactNode;
  productId: string;
  /** Whether to hide the sidebar (e.g., for full-page views) */
  hideSidebar?: boolean;
  /** Whether to hide the breadcrumb */
  hideBreadcrumb?: boolean;
}

export function ProductLayout({
  children,
  productId,
  hideSidebar = false,
  hideBreadcrumb = false,
}: ProductLayoutProps) {
  return (
    <AppShell
      mode="product"
      productId={productId}
      hideSidebar={hideSidebar}
      hideBreadcrumb={hideBreadcrumb}
    >
      {children}
    </AppShell>
  );
}
