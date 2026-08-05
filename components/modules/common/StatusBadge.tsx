"use client";

import { Badge } from "@/components/ui/badge";
import type { LucideIcon } from "lucide-react";

export interface StatusConfig {
  label: string;
  color: string;
  icon?: LucideIcon;
}

export interface StatusBadgeProps {
  status: string;
  mapping: Record<string, StatusConfig>;
}

export function StatusBadge({ status, mapping }: StatusBadgeProps) {
  const config = mapping[status];
  if (!config) {
    return <Badge variant="outline">{status}</Badge>;
  }

  const Icon = config.icon;

  return (
    <Badge className={config.color}>
      {Icon && <Icon className="w-3 h-3 mr-1" />}
      {config.label}
    </Badge>
  );
}
