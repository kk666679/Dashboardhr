"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { PRODUCTS, type Product } from "@/config/products";

interface ProductSwitcherProps {
  currentProductId: string;
  align?: "start" | "end";
  className?: string;
}

export function ProductSwitcher({
  currentProductId,
  align = "start",
  className,
}: ProductSwitcherProps) {
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const [open, setOpen] = useState(false);

  const currentProduct = PRODUCTS.find((p) => p.id === currentProductId);
  if (!currentProduct) return null;

  const otherProducts = PRODUCTS.filter((p) => p.id !== currentProductId);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "flex items-center gap-2 px-2 h-8 rounded-[var(--radius-md)]",
            "text-sm font-semibold text-[var(--foreground)]",
            "hover:bg-[var(--surface-1)] transition-colors",
            className,
          )}
        >
          <currentProduct.icon className="size-4 shrink-0" aria-hidden="true" />
          <span className="truncate max-w-[140px]">{currentProduct.title}</span>
          <ChevronDown className="size-3.5 shrink-0 text-[var(--foreground-subtle)]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} sideOffset={8} className="w-64">
        <DropdownMenuLabel className="text-xs text-[var(--foreground-muted)] font-medium">
          Switch Product
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {otherProducts.map((product) => (
          <DropdownMenuItem key={product.id} asChild className="p-0">
            <Link
              href={`/${locale}${product.href}`}
              className="flex items-center gap-3 px-2 py-2 w-full"
              onClick={() => setOpen(false)}
            >
              <div
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-[var(--radius-md)]",
                  "bg-gradient-to-br",
                  product.bgGradient,
                )}
              >
                <product.icon className={cn("size-4", product.color)} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{product.title}</p>
                <p className="text-xs text-[var(--foreground-muted)] truncate">
                  {product.description}
                </p>
              </div>
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="p-0">
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2 px-2 py-2 w-full text-xs text-[var(--foreground-muted)]"
            onClick={() => setOpen(false)}
          >
            ← Back to Home
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

