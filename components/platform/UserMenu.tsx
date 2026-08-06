"use client";

import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { getLocaleFromPath, setLocaleInPath } from "@/lib/locale-utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface UserMenuProps {
  className?: string;
  showThemeToggle?: boolean;
  showLanguageSwitcher?: boolean;
}

export function UserMenu({
  className,
  showThemeToggle = false,
  showLanguageSwitcher = false,
}: UserMenuProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { signOut } = useAuth();

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              "flex items-center gap-2 rounded-[var(--radius-md)] px-1.5 py-1",
              "text-sm font-medium text-[var(--foreground)]",
              "hover:bg-[var(--surface-1)] transition-colors duration-150",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-1",
            )}
            aria-label="User menu"
          >
            <Avatar className="size-7">
              <AvatarImage src="/Avatar-woman.png" alt="User avatar" />
              <AvatarFallback className="text-xs bg-[var(--brand-muted)] text-[var(--brand)]">
                U
              </AvatarFallback>
            </Avatar>
            <span className="hidden sm:block max-w-[120px] truncate text-xs font-medium">
              Admin User
            </span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={8} className="w-52">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col">
              <span className="text-sm font-semibold">Admin User</span>
              <span className="text-xs text-[var(--foreground-muted)] mt-0.5">
                admin@aifwms.xyz
              </span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() =>
              router.push(
                setLocaleInPath("/dashboard/settings", getLocaleFromPath(pathname)),
              )
            }
          >
            Settings
            <DropdownMenuShortcut>⌘,</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              router.push(
                setLocaleInPath(
                  "/dashboard/settings/subscription",
                  getLocaleFromPath(pathname),
                ),
              )
            }
          >
            Subscription
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              router.push(
                setLocaleInPath("/dashboard/help", getLocaleFromPath(pathname)),
              )
            }
          >
            Help & Support
            <DropdownMenuShortcut>?</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-[var(--destructive-foreground)] focus:bg-[var(--destructive-subtle)] focus:text-[var(--destructive-foreground)]"
            onClick={signOut}
          >
            Sign out
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {showThemeToggle && <ThemeToggle />}
      {showLanguageSwitcher && <LanguageSwitcher />}
    </div>
  );
}

