import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

export interface StatusAction {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: "default" | "secondary" | "outline" | "ghost";
}

export interface StatusScreenProps {
  code: string;
  title: string;
  description: string;
  icon?: ReactNode;
  actions?: StatusAction[];
}

export function StatusScreen({ code, title, description, icon, actions }: StatusScreenProps) {
  return (
    <main
      role="main"
      className="flex min-h-screen items-center justify-center bg-background px-4 py-16 text-foreground"
    >
      <div className="w-full max-w-md text-center">
        {icon ? (
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface-1)] text-primary">
            {icon}
          </div>
        ) : null}

        <p className="text-sm font-semibold uppercase tracking-widest text-primary">{code}</p>
        <h1 className="mt-2 text-balance text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
        <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">{description}</p>

        {actions && actions.length > 0 ? (
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {actions.map((action) =>
              action.href ? (
                <Button
                  key={action.label}
                  asChild
                  variant={action.variant ?? "default"}
                  className="w-full sm:w-auto"
                >
                  <Link href={action.href}>{action.label}</Link>
                </Button>
              ) : (
                <Button
                  key={action.label}
                  type="button"
                  onClick={action.onClick}
                  variant={action.variant ?? "default"}
                  className="w-full sm:w-auto"
                >
                  {action.label}
                </Button>
              ),
            )}
          </div>
        ) : null}
      </div>
    </main>
  );
}
