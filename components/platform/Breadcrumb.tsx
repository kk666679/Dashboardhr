"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useParams } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { PRODUCTS } from "@/config/products";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumb() {
  const pathname = usePathname();
  const params = useParams();
  const locale = (params?.locale as string) || "en";

  // Remove locale prefix for parsing
  const pathWithoutLocale = pathname.replace(`/${locale}`, "") || "/";
  const segments = pathWithoutLocale.split("/").filter(Boolean);

  if (segments.length === 0) return null;

  const productId = segments[0];
  const product = PRODUCTS.find((p) => p.id === productId);

  const items: BreadcrumbItem[] = [];

  // Home
  items.push({ label: "Home", href: `/${locale}` });

  // Product
  if (product) {
    items.push({
      label: product.title,
      href: `/${locale}${product.href}`,
    });
  } else if (productId) {
    items.push({
      label: productId.charAt(0).toUpperCase() + productId.slice(1),
      href: `/${locale}/${productId}`,
    });
  }

  // Sub-segments
  for (let i = 1; i < segments.length; i++) {
    const segment = segments[i];
    const href = `/${locale}/${segments.slice(0, i + 1).join("/")}`;
    const label = segment
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    items.push({ label, href });
  }

  if (items.length <= 1) return null;

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs text-[var(--foreground-muted)]">
      <ol className="flex items-center gap-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.href || item.label} className="flex items-center gap-1">
              {index > 0 && (
                <ChevronRight className="size-3 shrink-0" aria-hidden="true" />
              )}
              {isLast ? (
                <span
                  className={cn(
                    "font-medium",
                    "text-[var(--foreground)]",
                  )}
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href ?? "#"}
                  className="hover:text-[var(--foreground)] transition-colors duration-150"
                >
                  {index === 0 ? <Home className="size-3" aria-label="Home" /> : item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

