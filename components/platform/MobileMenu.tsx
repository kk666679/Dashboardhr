"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getNavForProduct, type NavSection, type NavItem } from "@/config/navigation";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  productId: string;
}

function MobileNavItem({
  item,
  depth = 0,
  onNavigate,
}: {
  item: NavItem;
  depth?: number;
  onNavigate: () => void;
}) {
  const pathname = usePathname();
  const params = useParams();
  const locale = (params?.locale as string) || "en";

  const isActive = item.href
    ? pathname === `/${locale}${item.href}` ||
      pathname?.startsWith(`/${locale}${item.href}/`)
    : false;

  const hasChildren = !!item.children?.length;
  const [expanded, setExpanded] = useState(false);

  const href = item.href ? `/${locale}${item.href}` : "#";

  const content = (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-2.5 rounded-[var(--radius-md)]",
        "text-sm font-medium transition-colors",
        isActive
          ? "bg-[var(--brand-muted)] text-[var(--brand)]"
          : "text-[var(--foreground-muted)] hover:bg-[var(--surface-1)] hover:text-[var(--foreground)]",
      )}
    >
      {item.icon && <item.icon className="size-4 shrink-0" />}
      <span className="flex-1 truncate">{item.title}</span>
      {item.badge && (
        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-[var(--brand-muted)] text-[var(--brand)]">
          {item.badge}
        </span>
      )}
      {hasChildren && (
        <ChevronRight
          className={cn(
            "size-3.5 shrink-0 transition-transform",
            expanded && "rotate-90",
          )}
        />
      )}
    </div>
  );

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full text-left"
        >
          {content}
        </button>
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden pl-3"
            >
              {item.children?.map((child) => (
                <MobileNavItem
                  key={child.title}
                  item={child}
                  depth={depth + 1}
                  onNavigate={onNavigate}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <Link href={href} onClick={onNavigate}>
      {content}
    </Link>
  );
}

export function MobileMenu({ open, onClose, productId }: MobileMenuProps) {
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const navSections = getNavForProduct(productId);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 left-0 z-50 w-[280px] flex flex-col bg-[var(--sidebar)] border-r border-[var(--sidebar-border)]"
          >
            {/* Header */}
            <div className="flex h-14 shrink-0 items-center justify-between px-3 border-b border-[var(--sidebar-border)]">
              <Link
                href={`/${locale}`}
                className="flex items-center gap-2.5"
                onClick={onClose}
              >
                <Logo className="size-7 shrink-0" />
                <span className="text-sm font-bold tracking-tight">AiFWMS</span>
              </Link>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={onClose}
                aria-label="Close menu"
              >
                <X className="size-4" />
              </Button>
            </div>

            {/* Navigation */}
            <ScrollArea className="flex-1 px-2 py-3">
              <nav className="space-y-4" aria-label="Mobile navigation">
                {navSections.map((section) => (
                  <div key={section.label}>
                    <p className="sidebar-section-title px-1">{section.label}</p>
                    <div className="space-y-0.5 mt-1">
                      {section.items.map((item) => (
                        <MobileNavItem
                          key={item.title}
                          item={item}
                          onNavigate={onClose}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </nav>
            </ScrollArea>

            {/* Footer */}
            <div className="shrink-0 border-t border-[var(--sidebar-border)] p-3 space-y-3">
              <div className="flex items-center gap-2.5">
                <Avatar className="size-8 shrink-0">
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
              <div className="flex items-center gap-2">
                <LanguageSwitcher />
                <ThemeToggle />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

