"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export interface ActionButton {
  label: string;
  icon?: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "default" | "outline" | "ghost" | "secondary" | "destructive";
  disabled?: boolean;
  loading?: boolean;
}

interface ActionButtonGroupProps {
  actions: ActionButton[];
  className?: string;
  align?: "left" | "center" | "right";
}

const ALIGN_MAP: Record<string, string> = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
};

export function ActionButtonGroup({
  actions,
  className,
  align = "left",
}: ActionButtonGroupProps) {
  return (
    <div className={cn("flex items-center gap-2 flex-wrap", ALIGN_MAP[align], className)}>
      {actions.map((action, i) => (
        <Button
          key={`${action.label}-${i}`}
          variant={action.variant ?? "default"}
          size="sm"
          disabled={action.disabled || action.loading}
          asChild={!!action.href}
          onClick={!action.href ? action.onClick : undefined}
        >
          {action.href ? (
            <Link href={action.href}>
              {action.icon && <span className="mr-2 h-4 w-4">{action.icon}</span>}
              {action.loading ? `${action.label}...` : action.label}
            </Link>
          ) : (
            <>
              {action.icon && <span className="mr-2 h-4 w-4">{action.icon}</span>}
              {action.loading ? `${action.label}...` : action.label}
            </>
          )}
        </Button>
      ))}
    </div>
  );
}
