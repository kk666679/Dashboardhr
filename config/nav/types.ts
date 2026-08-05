/**
 * config/nav/types.ts
 * Shared navigation type definitions.
 */
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  title: string;
  href?: string;
  icon?: LucideIcon;
  children?: NavItem[];
  badge?: string;
  hidden?: boolean;
}

export interface NavSection {
  label: string;
  items: NavItem[];
}
