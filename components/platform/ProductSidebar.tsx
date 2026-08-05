"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronRight, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { Logo } from "@/components/ui/Logo";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ProductSwitcher } from "./ProductSwitcher";
import { getSidebarConfig, type SidebarConfig } from "@/config/sidebar";
import type { NavSection, NavItem } from "@/config/navigation";

interface ProductSidebarProps {
  productId: string;
  isCollapsed?: boolean;
  onToggle?: () => void;
}

/* ── Nav item ── */
interface NavItemProps {
  item: NavItem;
  isCollapsed: boolean;
  depth?: number;
  reduced: boolean;
  locale: string;
}

function SidebarNavItem({ item, isCollapsed, depth = 0, reduced, locale }: NavItemProps) {
  const pathname = usePathname();

  const fullHref = item.href ? `/${locale}${item.href}` : "#";
  const isActive = item.href
    ? pathname === fullHref || pathname?.startsWith(fullHref + "/")
    : false;
  const hasChildren = !!item.children?.length;

  const childActive = item.children?.some(
    (c) => c.href && (pathname === `/${locale}${c.href}` || pathname?.startsWith(`/${locale}${c.href}/`)),
  );
  const [isExpanded, setIsExpanded] = useState(() => !!childActive);

  if (item.hidden) return null;

  const paddingLeft = depth === 0 ? "px-2" : "pl-[2.125rem] pr-2";

  const itemContent = (
    <>
      {item.icon && depth === 0 && (
        <span
          className="flex size-[1.125rem] shrink-0 items-center justify-center"
          aria-hidden="true"
        >
          <item.icon className="size-[1.0625rem]" />
        </span>
      )}
      {depth > 0 && (
        <span
          aria-hidden="true"
          className={cn(
            "size-1.5 shrink-0 rounded-full border border-current opacity-40",
            "transition-opacity duration-150 group-hover/nav:opacity-70",
            isActive && "opacity-100 border-transparent bg-current",
          )}
        />
      )}
      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.span
            key="label"
            initial={reduced ? undefined : { opacity: 0, width: 0 }}
            animate={reduced ? undefined : { opacity: 1, width: "auto" }}
            exit={reduced ? undefined : { opacity: 0, width: 0 }}
            transition={{ duration: 0.18, ease: [0.32, 0.72, 0, 1] }}
            className="flex-1 truncate text-left"
          >
            {item.title}
          </motion.span>
        )}
      </AnimatePresence>
      {!isCollapsed && item.badge && (
        <Badge variant="solid" size="xs" className="ml-auto tabular-nums">
          {item.badge}
        </Badge>
      )}
      {!isCollapsed && hasChildren && (
        <ChevronRight
          aria-hidden="true"
          className={cn(
            "ml-auto size-3.5 shrink-0 text-[var(--foreground-subtle)]",
            "transition-transform duration-200",
            isExpanded && "rotate-90",
          )}
        />
      )}
    </>
  );

  const baseClass = cn(
    "group/nav relative flex w-full items-center gap-2 rounded-[var(--radius-md)]",
    "text-sm font-[450] leading-none",
    paddingLeft,
    depth === 0 ? "h-8" : "h-7",
    "transition-colors duration-100",
    isActive
      ? depth === 0
        ? "bg-[var(--brand-muted)] text-[var(--brand)] font-medium"
        : "text-[var(--brand)] font-medium"
      : "text-[var(--foreground-muted)] hover:bg-[var(--sidebar-accent)] hover:text-[var(--foreground)]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-inset",
  );

  const navItem = hasChildren ? (
    <button
      onClick={() => setIsExpanded((v) => !v)}
      aria-expanded={isExpanded}
      title={isCollapsed ? item.title : undefined}
      className={cn(baseClass, "cursor-pointer select-none")}
    >
      {itemContent}
    </button>
  ) : (
    <Link
      href={fullHref}
      title={isCollapsed ? item.title : undefined}
      className={baseClass}
    >
      {itemContent}
    </Link>
  );

  const wrapped =
    isCollapsed && depth === 0 ? (
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>{navItem}</TooltipTrigger>
        <TooltipContent side="right" sideOffset={8}>
          {item.title}
          {item.badge && (
            <Badge variant="solid" size="xs" className="ml-2">
              {item.badge}
            </Badge>
          )}
        </TooltipContent>
      </Tooltip>
    ) : (
      navItem
    );

  return (
    <div className="w-full">
      {wrapped}
      <AnimatePresence initial={false}>
        {hasChildren && isExpanded && !isCollapsed && (
          <motion.div
            key="children"
            initial={reduced ? undefined : { height: 0, opacity: 0 }}
            animate={reduced ? undefined : { height: "auto", opacity: 1 }}
            exit={reduced ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-0.5 space-y-0.5">
              {item.children?.map((child) => (
                <SidebarNavItem
                  key={child.title}
                  item={child}
                  isCollapsed={isCollapsed}
                  depth={depth + 1}
                  reduced={reduced}
                  locale={locale}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Product Sidebar ── */
export function ProductSidebar({ productId, isCollapsed = false, onToggle }: ProductSidebarProps) {
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const reduced = useReducedMotion() ?? false;

// Randomly pick a user avatar on mount
  const avatarSrc = useMemo(() => {
    const avatars = ["/man.png", "/woman.png"];
    return avatars[Math.floor(Math.random() * avatars.length)];
  }, []);

  const config = getSidebarConfig(productId);
  if (!config) return null;

  return (
    <motion.div
      animate={{ width: isCollapsed ? 56 : 264 }}
      transition={
        reduced
          ? { duration: 0 }
          : { type: "spring", stiffness: 340, damping: 36 }
      }
      className={cn(
        "flex flex-col h-full overflow-hidden",
        "bg-[var(--sidebar)] border-r border-[var(--sidebar-border)]",
      )}
    >
      {/* ── Logo / header ── */}
      <div
        className={cn(
          "flex h-14 shrink-0 items-center border-b border-[var(--sidebar-border)]",
          isCollapsed ? "justify-center px-0" : "justify-between px-3",
        )}
      >
        {!isCollapsed ? (
          <>
            <ProductSwitcher currentProductId={productId} />
            {onToggle && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={onToggle}
                aria-label="Collapse sidebar"
                className="shrink-0 text-[var(--foreground-subtle)] hover:text-[var(--foreground)]"
              >
                <PanelLeftClose className="size-4" />
              </Button>
            )}
          </>
        ) : (
          <>
            <Link href={`/${locale}`} aria-label="Home">
              <Logo className="size-7" />
            </Link>
            {onToggle && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={onToggle}
                aria-label="Expand sidebar"
                className="absolute right-1.5 text-[var(--foreground-subtle)] hover:text-[var(--foreground)]"
              >
                <PanelLeftOpen className="size-4" />
              </Button>
            )}
          </>
        )}
      </div>

      {/* ── Navigation ── */}
      <ScrollArea className="flex-1 overflow-hidden">
        <nav className="px-2 py-3 space-y-4" aria-label={`${config.title} navigation`}>
          {config.sections.map((section) => (
            <div key={section.label}>
              <AnimatePresence initial={false}>
                {!isCollapsed && (
                  <motion.div
                    key="group-label"
                    initial={reduced ? undefined : { opacity: 0 }}
                    animate={reduced ? undefined : { opacity: 1 }}
                    exit={reduced ? undefined : { opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <p className="sidebar-section-title">{section.label}</p>
                  </motion.div>
                )}
              </AnimatePresence>
              {isCollapsed && (
                <div className="my-1.5 mx-1 h-px bg-[var(--border)]" aria-hidden="true" />
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => (
                  <SidebarNavItem
                    key={item.title}
                    item={item}
                    isCollapsed={isCollapsed}
                    reduced={reduced}
                    locale={locale}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* ── Footer ── */}
      <div
        className={cn(
          "shrink-0 border-t border-[var(--sidebar-border)] p-2",
          isCollapsed ? "flex flex-col items-center gap-2" : "space-y-2",
        )}
      >
        {!isCollapsed && (
          <>
            <div className="flex items-center gap-2.5 px-1 py-1">
              <Avatar className="size-7 shrink-0">
                <AvatarImage src="/women.png" alt="User avatar" />
                <AvatarFallback className="text-xs bg-[var(--brand-muted)] text-[var(--brand)]">
                  U
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate">Admin User</p>
                <p className="text-[11px] text-[var(--foreground-subtle)] truncate">
                  admin@aifwms.xyz
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-1">
                <LanguageSwitcher />
                <ThemeToggle />
              </div>
            </div>
          </>
        )}
        {isCollapsed && (
          <>
            <Avatar className="size-7">
              <AvatarImage src="/women.png" alt="User avatar" />
              <AvatarFallback className="text-xs bg-[var(--brand-muted)] text-[var(--brand)]">
                U
              </AvatarFallback>
            </Avatar>
            <ThemeToggle />
            <LanguageSwitcher />
          </>
        )}
      </div>
    </motion.div>
  );
}
