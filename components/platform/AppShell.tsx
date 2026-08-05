"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { isValidLocale } from "@/i18n/config";
import { setLocaleInPath } from "@/lib/locale-utils";
import { Header } from "./Header";
import { ProductSidebar } from "./ProductSidebar";
import { Breadcrumb } from "./Breadcrumb";
import { MobileMenu } from "./MobileMenu";
import { CommandPalette, useCommandPalette } from "./CommandPalette";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ShellMode = "dashboard" | "product" | "minimal";

export interface AppShellProps {
  children: React.ReactNode;
  /** Shell layout mode */
  mode?: ShellMode;
  /** Product ID for product-specific navigation (required when mode="product") */
  productId?: string;
  /** Whether to hide the sidebar */
  hideSidebar?: boolean;
  /** Whether to hide the breadcrumb */
  hideBreadcrumb?: boolean;
  /** Whether to hide the header */
  hideHeader?: boolean;
  /** Extra class names */
  className?: string;
  /** Initial sidebar collapsed state */
  defaultCollapsed?: boolean;
  /** Callback when sidebar collapse state changes */
  onCollapsedChange?: (collapsed: boolean) => void;
}

// ─── AppShell ─────────────────────────────────────────────────────────────────

export function AppShell({
  children,
  mode = "dashboard",
  productId,
  hideSidebar = false,
  hideBreadcrumb = false,
  hideHeader = false,
  className,
  defaultCollapsed = false,
  onCollapsedChange,
}: AppShellProps) {
  const params = useParams();
  const router = useRouter();
  const locale = (params?.locale as string) || "en";
  const { currentLanguage } = useTranslation();

  // Sidebar state
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Command palette
  const {
    open: commandPaletteOpen,
    setOpen: setCommandPaletteOpen,
    toggle: toggleCommandPalette,
  } = useCommandPalette();

  // ── Mount guard ──
  useEffect(() => {
    setMounted(true);
  }, []);

  // ── Responsive ──
  useEffect(() => {
    if (!mounted) return;
    const onResize = () => {
      const mobile = window.innerWidth < 768;
      if (mobile) {
        setIsCollapsed(true);
        setMobileMenuOpen(false);
      }
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [mounted]);

  // ── Locale sync ──
  useEffect(() => {
    if (!mounted) return;
    const current = currentLanguage || "en";
    if (current !== locale && isValidLocale(current)) {
      router.push(setLocaleInPath(window.location.pathname, current));
    }
  }, [currentLanguage, locale, router, mounted]);

  // ── Collapse callback ──
  const handleToggleCollapse = useCallback(() => {
    setIsCollapsed((v) => {
      const next = !v;
      onCollapsedChange?.(next);
      return next;
    });
  }, [onCollapsedChange]);

  // ── Don't render until mounted to avoid hydration mismatch ──
  if (!mounted) return null;

  const sidebarWidth = isCollapsed ? "w-14" : "w-[264px]";
  // Dashboard navigation is a product configuration too. Keeping this fallback
  // here makes every non-minimal layout use the same sidebar implementation.
  const resolvedProductId = productId ?? "dashboard";
  const sidebar = (
    <ProductSidebar
      productId={resolvedProductId}
      isCollapsed={isCollapsed}
      onToggle={handleToggleCollapse}
    />
  );

  // ── Minimal mode (no sidebar, no header) ──
  if (mode === "minimal") {
    return (
      <div className="flex h-screen overflow-hidden bg-[var(--background)]">
        <main
          id="main-content"
          className="flex-1 overflow-y-auto"
          role="main"
        >
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--background)]">
      {/* Sidebar (desktop) */}
      {!hideSidebar && (
        <div
          className={cn(
            "hidden md:flex md:flex-col shrink-0 border-r border-[var(--border)]",
            "transition-[width] duration-300 ease-out",
            sidebarWidth,
          )}
          aria-label={`${resolvedProductId} sidebar`}
        >
          {sidebar}
        </div>
      )}

      {/* Mobile menu drawer */}
      <MobileMenu
        open={mobileMenuOpen && !hideSidebar}
        onClose={() => setMobileMenuOpen(false)}
        productId={resolvedProductId}
      />

      {/* Main content area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Header */}
        {!hideHeader && (
          <Header
            productId={productId}
            onMenuClick={() => setMobileMenuOpen((v) => !v)}
          />
        )}

        {/* Breadcrumb */}
        {!hideBreadcrumb && (
          <div className="shrink-0 border-b border-[var(--border)] bg-[var(--background-subtle)] px-4 md:px-5 py-2">
            <Breadcrumb />
          </div>
        )}

        {/* Content */}
        <main
          id="main-content"
          className={cn(
            "flex-1 overflow-y-auto bg-[var(--background-subtle)]",
            className,
          )}
          role="main"
        >
          <div className="mx-auto max-w-[1400px] px-4 py-5 md:px-6 md:py-6">
            {children}
          </div>
        </main>
      </div>

      {/* Command Palette — global Cmd+K */}
      <CommandPalette
        open={commandPaletteOpen}
        onOpenChange={setCommandPaletteOpen}
      />
    </div>
  );
}

// ─── useAppShell ──────────────────────────────────────────────────────────────

export function useAppShell() {
  const params = useParams();
  const locale = (params?.locale as string) || "en";

  return {
    locale,
    withLocale: (path: string) => `/${locale}${path}`,
  };
}

export { useCommandGroup } from "./command-registry";
export type {
  RegisteredCommandGroup as DomainCommandGroup,
  RegisteredCommandItem as DomainCommand,
} from "./command-registry";
