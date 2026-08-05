"use client";

import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title?: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title = "No data found",
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={`text-center py-8 text-muted-foreground ${className ?? ""}`}>
      {icon && <div className="mx-auto mb-4 opacity-50">{icon}</div>}
      {title && <p className="text-sm font-medium mb-1">{title}</p>}
      {description && <p className="text-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
