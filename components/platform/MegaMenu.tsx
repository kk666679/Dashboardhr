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
import { ChevronDown, Grid3X3 } from "lucide-react";
import { PRODUCTS } from "@/config/products";

interface MegaMenuProps {
  className?: string;
}

export function MegaMenu({ className }: MegaMenuProps) {
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "flex items-center gap-2 px-3 h-9 rounded-[var(--radius-md)]",
            "text-sm font-medium text-[var(--foreground)]",
            "hover:bg-[var(--surface-1)] transition-colors",
            className,
          )}
        >
          <Grid3X3 className="size-4" />
          <span>Products</span>
          <ChevronDown
            className={cn(
              "size-3.5 text-[var(--foreground-subtle)] transition-transform duration-200",
              open && "rotate-180",
            )}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={8}
        className="w-[320px] sm:w-[400px]"
      >
        <DropdownMenuLabel className="text-xs text-[var(--foreground-muted)] font-medium px-3 py-2">
          Enterprise Products
        </DropdownMenuLabel>
        <div className="grid gap-1 p-1">
          {PRODUCTS.map((product) => (
            <DropdownMenuItem key={product.id} asChild className="p-0">
              <Link
                href={`/${locale}${product.href}`}
                className="flex items-center gap-3 px-2 py-2.5 w-full rounded-[var(--radius-md)]"
                onClick={() => setOpen(false)}
              >
                <div
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-md)]",
                    "bg-gradient-to-br",
                    product.bgGradient,
                  )}
                >
                  <product.icon className={cn("size-4.5", product.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{product.title}</p>
                  <p className="text-xs text-[var(--foreground-muted)] truncate leading-relaxed">
                    {product.description}
                  </p>
                </div>
              </Link>
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

