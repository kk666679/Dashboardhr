"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { SidebarItem } from "./sidebar-data";
import { navGroups } from "./sidebar-data";
import { ChevronRight, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { SidebarFooter as SidebarFooterActions } from "./sidebar-footer";
import { KbChat } from "./kb-chat";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { ROUTE } from "./route-mapping";

// ─── Nav Item ─────────────────────────────────────────────────────────────────

interface NavItemProps {
  item:        SidebarItem;
  isCollapsed: boolean;
  depth?:      number;
  reduced:     boolean;
}

function NavItem({ item, isCollapsed, depth = 0, reduced }: NavItemProps) {
  const pathname = usePathname();
  const { t }   = useTranslation();

  const isActive = item.href
    ? pathname === item.href || pathname?.startsWith(item.href + "/")
    : false;
  const hasChildren = !!item.children?.length;

  const childActive = item.children?.some(
    (c) => c.href && (pathname === c.href || pathname?.startsWith(c.href + "/")),
  );
  const [isExpanded, setIsExpanded] = useState(() => !!childActive);

  if (item.hidden) return null;

  const label      = (t(item.title) as string) || item.title;
  const paddingLeft = depth === 0 ? "px-2" : "pl-[2.125rem] pr-2";

  const itemContent = (
    <>
      {item.icon && depth === 0 && (
        <span className="flex size-[1.125rem] shrink-0 items-center justify-center transition-colors duration-150" aria-hidden="true">
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
            {label}
          </motion.span>
        )}
      </AnimatePresence>
      {!isCollapsed && item.badge && (
        <Badge variant="solid" size="xs" className="ml-auto tabular-nums">{item.badge}</Badge>
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
    "group/nav relative flex w-full items-center gap-2 rounded-[var(--radius-md)] border border-transparent",
    "text-sm font-[450] leading-none",
    paddingLeft,
    depth === 0 ? "h-9" : "h-7",
    "transition-all duration-150",
    isActive
      ? depth === 0
        ? "border-[var(--brand-muted)] bg-[var(--brand-muted)] text-[var(--brand)] shadow-[0_0_0_1px_rgba(59,130,246,0.08)] font-semibold"
        : "border-[var(--brand-muted)] bg-[var(--brand-muted)]/70 text-[var(--brand)] font-semibold"
      : "text-[var(--foreground-muted)] hover:border-[var(--sidebar-accent)] hover:bg-[var(--sidebar-accent)] hover:text-[var(--foreground)]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-inset",
  );

  const navItem = hasChildren ? (
    <button
      onClick={() => setIsExpanded((v) => !v)}
      aria-expanded={isExpanded}
      title={isCollapsed ? label : undefined}
      className={cn(baseClass, "cursor-pointer select-none")}
    >
      {itemContent}
    </button>
  ) : (
    <Link href={item.href ?? "#"} title={isCollapsed ? label : undefined} className={baseClass}>
      {itemContent}
    </Link>
  );

  const wrapped =
    isCollapsed && depth === 0 ? (
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>{navItem}</TooltipTrigger>
        <TooltipContent side="right" sideOffset={8}>
          {label}
          {item.badge && <Badge variant="solid" size="xs" className="ml-2">{item.badge}</Badge>}
        </TooltipContent>
      </Tooltip>
    ) : navItem;

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
                <NavItem key={child.title} item={child} isCollapsed={isCollapsed} depth={depth + 1} reduced={reduced} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── AppSidebar ───────────────────────────────────────────────────────────────

interface AppSidebarProps {
  isCollapsed?: boolean;
  onToggle?:    () => void;
}

export function AppSidebar({ isCollapsed = false, onToggle }: AppSidebarProps) {
  const { t, currentLanguage } = useTranslation();
  const reduced = useReducedMotion() ?? false;

  return (
    <motion.div
      animate={{ width: isCollapsed ? 56 : 264 }}
      transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 340, damping: 36 }}
      className={cn(
        "flex flex-col h-full overflow-hidden",
        "bg-[var(--sidebar)] border-r border-[var(--sidebar-border)]",
      )}
    >
      {/* Logo */}
      <div className={cn(
        "flex h-14 shrink-0 items-center border-b border-[var(--sidebar-border)]",
        isCollapsed ? "justify-center px-0" : "justify-between px-3",
      )}>
        {!isCollapsed && (
          <Link
            href={ROUTE.dashboard.withLocale(currentLanguage, ROUTE.dashboard.root)}
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] rounded-[var(--radius-sm)]"
          >
            <Logo className="size-7 shrink-0" />
            <span className="text-sm font-bold tracking-tight truncate">
              {(t("app.title") as string) || "AHRFWMS"}
            </span>
          </Link>
        )}
        {isCollapsed && (
          <Link href={ROUTE.dashboard.withLocale(currentLanguage, ROUTE.dashboard.root)} aria-label="Dashboard home">
            <Logo className="size-7" />
          </Link>
        )}
        {onToggle && (
          <Button
            variant="ghost" size="icon-sm"
            onClick={onToggle}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={cn(
              "shrink-0 text-[var(--foreground-subtle)] hover:text-[var(--foreground)]",
              isCollapsed && "absolute right-1.5",
            )}
          >
            {isCollapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
          </Button>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 overflow-hidden">
        <nav className="px-2 py-3 space-y-4" aria-label="Main navigation">
          {navGroups.map((group) => (
            <div key={group.label}>
              <AnimatePresence initial={false}>
                {!isCollapsed && (
                  <motion.div
                    key="group-label"
                    initial={reduced ? undefined : { opacity: 0 }}
                    animate={reduced ? undefined : { opacity: 1 }}
                    exit={reduced ? undefined : { opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <p className="sidebar-section-title">{group.label}</p>
                  </motion.div>
                )}
              </AnimatePresence>
              {isCollapsed && <div className="my-1.5 mx-1 h-px bg-[var(--border)]" aria-hidden="true" />}
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <NavItem key={item.title} item={item} isCollapsed={isCollapsed} reduced={reduced} />
                ))}
              </div>
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className={cn(
        "shrink-0 border-t border-[var(--sidebar-border)] p-2",
        isCollapsed ? "flex flex-col items-center gap-2" : "space-y-2",
      )}>
        {!isCollapsed ? (
          <>
            <div className="flex items-center gap-2.5 px-1 py-1">
              <Avatar className="size-7 shrink-0">
                <AvatarImage src="/women.png" alt="User avatar" />
                <AvatarFallback className="text-xs bg-[var(--brand-muted)] text-[var(--brand)]">U</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate">Admin User</p>
                <p className="text-[11px] text-[var(--foreground-subtle)] truncate">admin@ahrfwms.xyz</p>
              </div>
            </div>
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-1">
                <LanguageSwitcher />
                <ThemeToggle />
              </div>
              <KbChat />
            </div>
            <div className="pt-1 border-t border-[var(--sidebar-border)]">
              <SidebarFooterActions />
            </div>
          </>
        ) : (
          <>
            <Avatar className="size-7">
              <AvatarImage src="/women.png" alt="User avatar" />
              <AvatarFallback className="text-xs bg-[var(--brand-muted)] text-[var(--brand)]">U</AvatarFallback>
            </Avatar>
            <ThemeToggle />
            <LanguageSwitcher />
          </>
        )}
      </div>
    </motion.div>
  );
}
