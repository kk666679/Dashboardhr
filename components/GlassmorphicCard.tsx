"use client";

/**
 * GlassmorphicCard — design-system aligned
 *
 * Uses CSS utilities from styles/utilities.css (@utility glass, glass-sm, etc.)
 * and theme tokens from styles/theme.css rather than raw Tailwind colour strings.
 * Framer Motion durations are synced with --duration-* tokens.
 */

import React, { ReactNode } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { cn } from "@/lib/utils";

// ─── GlassmorphicCard ────────────────────────────────────────────────────────

interface GlassmorphicCardProps {
  children: ReactNode;
  id?: string;
  /** Additional Tailwind / utility classes */
  className?: string;
  /** Framer Motion entrance animation style */
  animation?: "scale" | "fade" | "slide" | "none";
  /** Stagger delay in seconds */
  delay?: number;
  /** Use heavier glass for text-heavy content */
  heavy?: boolean;
  /** Accepted but unused — gradient handled via CSS utilities */
  gradient?: string;
  /** Accepted but unused — blur handled via CSS utilities */
  blur?: string;
}

export function GlassmorphicCard({
  children,
  className = "",
  animation = "fade",
  delay = 0,
  heavy = false,
}: GlassmorphicCardProps) {
  type AnimVariant = {
    initial: Parameters<typeof motion.div>[0]["initial"];
    animate: Parameters<typeof motion.div>[0]["animate"];
    transition: Parameters<typeof motion.div>[0]["transition"];
  };

  const variants: Record<string, AnimVariant> = {
    scale: {
      initial: { scale: 0.95, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      transition: { type: "spring", stiffness: 300, damping: 30, delay },
    },
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.3, delay },
    },
    slide: {
      initial: { y: 16, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      transition: { duration: 0.3, delay },
    },
    none: {
      initial: false,
      animate: {},
      transition: {},
    },
  };

  const anim = variants[animation];

  return (
    <motion.div
      initial={anim.initial}
      animate={anim.animate}
      transition={anim.transition}
      className={cn(
        // Swap raw gradient strings for the design-system utility classes
        heavy ? "glass-heavy" : "glass",
        // Interactive hover/active states from utilities.css
        "glass-interactive",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}

// ─── StaggerContainer ────────────────────────────────────────────────────────

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
}

export function StaggerContainer({ children, className = "" }: StaggerContainerProps) {
  return (
    <LayoutGroup>
      <div className={cn("grid gap-6", className)}>{children}</div>
    </LayoutGroup>
  );
}

// ─── StaggerItem ─────────────────────────────────────────────────────────────

interface StaggerItemProps {
  children: ReactNode;
}

export function StaggerItem({ children }: StaggerItemProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}               // --duration-300
    >
      {children}
    </motion.div>
  );
}

// ─── SlideIn ─────────────────────────────────────────────────────────────────

interface SlideInProps {
  children: ReactNode;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
}

const SLIDE_VARIANTS = {
  up:    { initial: { y: 40, opacity: 0 }, animate: { y: 0, opacity: 1 } },
  down:  { initial: { y: -40, opacity: 0 }, animate: { y: 0, opacity: 1 } },
  left:  { initial: { x: -40, opacity: 0 }, animate: { x: 0, opacity: 1 } },
  right: { initial: { x: 40, opacity: 0 }, animate: { x: 0, opacity: 1 } },
};

export function SlideIn({ children, direction = "up", delay = 0 }: SlideInProps) {
  const v = SLIDE_VARIANTS[direction];
  return (
    <motion.div
      initial={v.initial}
      animate={v.animate}
      transition={{ duration: 0.45, delay, type: "spring", stiffness: 260, damping: 26 }}
    >
      {children}
    </motion.div>
  );
}

// ─── GlassButton ─────────────────────────────────────────────────────────────
// Uses the `.btn-glass` component class from components.css for glass-specific
// styling and falls back to Tailwind for colour variants.

interface GlassButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "danger";
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

const GLASS_BUTTON_VARIANT: Record<string, string> = {
  primary:   "bg-primary text-primary-foreground border-transparent hover:opacity-90",
  secondary: "bg-white/10 text-foreground border-white/30 hover:bg-white/20",
  outline:   "bg-transparent text-foreground border-white/30 hover:bg-white/10",
  danger:    "bg-destructive text-destructive-foreground border-transparent hover:opacity-90",
};

export function GlassButton({
  children,
  variant = "primary",
  onClick,
  className = "",
  disabled = false,
}: GlassButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "btn-glass",
        GLASS_BUTTON_VARIANT[variant],
        disabled && "opacity-50 pointer-events-none",
        className,
      )}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      transition={{ duration: 0.15 }}              // --duration-150
    >
      {children}
    </motion.button>
  );
}

// ─── GlassInput ──────────────────────────────────────────────────────────────
// Fixed: was hardcoding `text-gray-900` which breaks in dark mode.

interface GlassInputProps {
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  icon?: ReactNode;
  className?: string;
}

export function GlassInput({
  type = "text",
  value,
  onChange,
  placeholder = "",
  icon,
  className = "",
}: GlassInputProps) {
  return (
    <div className={cn("relative group", className)}>
      {icon && (
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors duration-200">
          {icon}
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={cn(
          // Use design-system glass surface
          "glass-sm",
          "w-full px-4 py-2.5 text-foreground placeholder:text-muted-foreground",
          icon && "pl-10",
          // Focus ring aligned with --ring token
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-1 focus-visible:ring-offset-transparent",
          "transition-all duration-200",
          "hover:border-white/35",
        )}
      />
    </div>
  );
}

// ─── AnimatedCounter ─────────────────────────────────────────────────────────

interface AnimatedCounterProps {
  value: number;
  /** Animation duration in seconds */
  duration?: number;
}

export function AnimatedCounter({ value, duration = 1.2 }: AnimatedCounterProps) {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    let start = 0;
    const end = value;
    const fps = 60;
    const increment = end / (duration * fps);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / fps);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{count.toLocaleString()}</span>;
}
