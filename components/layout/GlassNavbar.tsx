import type { ReactNode } from "react";
import styles from "./GlassNavbar.module.css";

interface GlassNavbarProps {
  children: ReactNode;
  className?: string;
}

/**
 * GlassNavbar
 *
 * A sticky top navigation bar with glassmorphism treatment.
 * Uses a CSS Module so the `.glassNavbar` class is scoped and does not
 * pollute the global namespace.
 *
 * Usage:
 *   <GlassNavbar>
 *     <Logo />
 *     <NavLinks />
 *   </GlassNavbar>
 */
export function GlassNavbar({ children, className }: GlassNavbarProps) {
  return (
    <header
      className={[styles.glassNavbar, className].filter(Boolean).join(" ")}
      role="banner"
    >
      {children}
    </header>
  );
}
