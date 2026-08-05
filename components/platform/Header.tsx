"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/ui/Logo";
import { Menu, Search, X, Bell } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { UserMenu } from "./UserMenu";
import { ProductSwitcher } from "./ProductSwitcher";
import { MegaMenu } from "./MegaMenu";
import { motion, AnimatePresence } from "framer-motion";
import { KbChat } from "@/components/dashboard-sidebar/kb-chat";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  /** Product ID for the product switcher. If omitted, shows MegaMenu. */
  productId?: string;
  /** Whether this is the landing page header */
  isLanding?: boolean;
  /** Callback for mobile menu toggle */
  onMenuClick?: () => void;
  className?: string;
}

/* ── Notification bell ── */
function NotificationBell() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
          aria-label="Notifications (3 unread)"
        >
          <Bell className="size-[1.1rem]" />
          <span
            aria-hidden="true"
            className={cn(
              "absolute top-1 right-1",
              "size-[7px] rounded-full",
              "bg-[var(--destructive)]",
              "ring-2 ring-[var(--background)]",
              "animate-pulse",
            )}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80" sideOffset={8}>
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          <Badge variant="default" size="xs">3 new</Badge>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {[
          { title: "Leave request approved", time: "2 min ago", dot: "bg-[var(--success)]" },
          { title: "Payroll run completed", time: "1 hr ago", dot: "bg-[var(--brand)]" },
          { title: "New hire onboarding due", time: "3 hrs ago", dot: "bg-[var(--warning)]" },
        ].map((n, i) => (
          <DropdownMenuItem key={i} className="flex items-start gap-3 py-3 cursor-pointer">
            <span className={cn("mt-1 size-2 shrink-0 rounded-full", n.dot)} aria-hidden="true" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium leading-tight">{n.title}</p>
              <p className="text-xs text-[var(--foreground-muted)] mt-0.5">{n.time}</p>
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="justify-center text-xs text-[var(--brand)] cursor-pointer">
          View all notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* ── Mobile search overlay ── */
function MobileSearch({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="absolute inset-0 z-50 flex items-center gap-3 px-4 bg-[var(--background)]"
    >
      <Search className="size-4 shrink-0 text-[var(--foreground-muted)]" aria-hidden="true" />
      <Input
        autoFocus
        type="search"
        placeholder="Search anything…"
        className="flex-1 border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
      />
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={onClose}
        aria-label="Close search"
      >
        <X className="size-4" />
      </Button>
    </motion.div>
  );
}

export function Header({
  productId,
  isLanding = false,
  onMenuClick,
  className,
}: HeaderProps) {
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
    }
  }, []);

  return (
    <header
      className={cn(
        "glass-navbar relative flex h-14 items-center gap-3 px-4 md:px-5",
        className,
      )}
      role="banner"
      aria-label="Main navigation"
      onKeyDown={handleKeyDown}
    >
      {/* Mobile: hamburger */}
      {!isLanding && (
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-[var(--foreground-muted)] hover:text-[var(--foreground)] shrink-0"
          onClick={onMenuClick}
          aria-label="Toggle navigation menu"
        >
          <Menu className="size-[1.1rem]" />
        </Button>
      )}

      {/* Logo */}
      <Link
        href={`/${locale}`}
        className="flex items-center gap-2.5 shrink-0 hover:opacity-80 transition-opacity"
      >
        <Logo className="size-7 shrink-0" />
        <span className="text-sm font-bold tracking-tight hidden sm:block">
          AiFWMS
        </span>
      </Link>

      {/* Product Switcher or MegaMenu */}
      <div className="hidden md:flex items-center">
        {isLanding ? (
          <MegaMenu />
        ) : productId ? (
          <ProductSwitcher currentProductId={productId} />
        ) : null}
      </div>

      {/* Desktop: search bar */}
      <div className="hidden md:flex flex-1 items-center gap-2 max-w-sm ml-2">
        <div className="relative w-full">
          <Search
            className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-[var(--foreground-subtle)]"
            aria-hidden="true"
          />
          <Input
            type="search"
            placeholder="Search…"
            className={cn(
              "h-8 pl-8 pr-12 text-sm",
              "bg-[var(--surface-1)] border-[var(--border)]",
              "placeholder:text-[var(--foreground-subtle)]",
              "focus-visible:ring-1 focus-visible:ring-[var(--ring)] focus-visible:border-[var(--brand)]",
              "transition-[border-color,box-shadow] duration-150",
            )}
          />
          <div
            className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5"
            aria-hidden="true"
          >
            <kbd className="flex items-center justify-center h-5 min-w-[1.25rem] rounded border border-[var(--border)] bg-[var(--surface-2)] px-1 text-[10px] font-medium text-[var(--foreground-subtle)] font-mono">
              ⌘
            </kbd>
            <kbd className="flex items-center justify-center h-5 min-w-[1.25rem] rounded border border-[var(--border)] bg-[var(--surface-2)] px-1 text-[10px] font-medium text-[var(--foreground-subtle)] font-mono">
              K
            </kbd>
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" aria-hidden="true" />

      {/* Right actions */}
      <div className="flex items-center gap-0.5">
        {/* Mobile search trigger */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
          onClick={() => setMobileSearchOpen(true)}
          aria-label="Search"
        >
          <Search className="size-[1.1rem]" />
        </Button>

        {/* KB Chat */}
        <div className="hidden sm:block">
          <KbChat />
        </div>

        {/* Notification bell */}
        {!isLanding && <NotificationBell />}

        {/* Language + theme */}
        <div className="hidden sm:flex items-center gap-0.5">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>

        {/* Divider */}
        <div
          className="hidden sm:block mx-1 h-5 w-px bg-[var(--border)]"
          aria-hidden="true"
        />

        {/* User menu */}
        <UserMenu />
      </div>

      {/* Mobile search overlay */}
      <AnimatePresence>
        {mobileSearchOpen && (
          <MobileSearch onClose={() => setMobileSearchOpen(false)} />
        )}
      </AnimatePresence>
    </header>
  );
}

