"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type { CSSProperties, ElementType, ReactNode } from "react";
import { memo, useState, useEffect } from "react";

/**
 * AIStreamingText — Animated streaming text component
 *
 * Leverages the `Shimmer` pattern from @/components/ai-elements/shimmer
 * to provide a smooth animated streaming effect for AI-generated text.
 *
 * Features:
 * - Animated streaming cursor with configurable speed
 * - Typewriter effect for sequential text display
 * - Gradient shimmer for loading/streaming states
 * - Supports both inline and block display modes
 *
 * @example
 * // Basic streaming text
 * <AIStreamingText text="Hello, world!" isStreaming />
 *
 * // Typewriter effect
 * <AIStreamingText text="Hello, world!" effect="typewriter" speed={50} />
 *
 * // Custom cursor
 * <AIStreamingText text="Hello" cursor="▊" />
 */

export type StreamingEffect = "shimmer" | "typewriter" | "none";

export interface AIStreamingTextProps {
  /** The full text content to display */
  text: string;
  /** Whether the text is currently being streamed/generated */
  isStreaming?: boolean;
  /** Visual streaming effect */
  effect?: StreamingEffect;
  /** Typewriter speed in ms per character (default: 30) */
  speed?: number;
  /** Custom cursor character (default: "▊") */
  cursor?: string;
  /** Whether to show cursor when not streaming */
  showCursorWhenDone?: boolean;
  /** HTML element to render as */
  as?: ElementType;
  /** Additional class names */
  className?: string;
  /** Empty state message when text is empty */
  emptyMessage?: string;
  /** Loading shimmer animation duration in seconds (default: 2) */
  shimmerDuration?: number;
  /** Error state */
  error?: string | null;
  /** Error fallback component */
  errorFallback?: ReactNode;
}

// ─── Hook: Typewriter Logic ──────────────────────────────────────────────────

function useTypewriter(text: string, speed: number, isActive: boolean) {
  const [displayedLength, setDisplayedLength] = useState(
    isActive ? 0 : text.length
  );

  useEffect(() => {
    if (!isActive) {
      setDisplayedLength(text.length);
      return;
    }

    setDisplayedLength(0);
    const interval = setInterval(() => {
      setDisplayedLength((prev: number) => {
        if (prev >= text.length) {
          clearInterval(interval);
          return text.length;
        }
        return prev + 1;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, isActive]);

  return displayedLength;
}

// ─── Shimmer Effect ──────────────────────────────────────────────────────────

function ShimmerText({
  children,
  className,
  duration = 2,
}: {
  children: string;
  className?: string;
  duration?: number;
}) {
  const spread = 2;
  const dynamicSpread = (children?.length ?? 0) * spread;

  return (
    <motion.span
      animate={{ backgroundPosition: "0% center" }}
      className={cn(
        "relative inline-block bg-[length:250%_100%,auto] bg-clip-text text-transparent",
        "[--bg:linear-gradient(90deg,#0000_calc(50%-var(--spread)),var(--color-background),#0000_calc(50%+var(--spread)))] [background-repeat:no-repeat,padding-box]",
        className,
      )}
      initial={{ backgroundPosition: "100% center" }}
      style={
        {
          "--spread": `${dynamicSpread}px`,
          backgroundImage:
            "var(--bg), linear-gradient(var(--color-muted-foreground), var(--color-muted-foreground))",
        } as CSSProperties
      }
      transition={{
        duration,
        ease: "linear",
        repeat: Number.POSITIVE_INFINITY,
      }}
    >
      {children}
    </motion.span>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

function AIStreamingTextComponent({
  text,
  isStreaming = false,
  effect = "shimmer",
  speed = 30,
  cursor = "▊",
  showCursorWhenDone = false,
  as: Component = "span",
  className,
  emptyMessage = "No content",
  shimmerDuration = 2,
  error = null,
  errorFallback,
}: AIStreamingTextProps) {
  const displayLength = useTypewriter(text, speed, effect === "typewriter" && isStreaming);
  const showCursor = isStreaming || showCursorWhenDone;

  // Error state
  if (error) {
    return (
      <Component className={cn("text-destructive text-sm", className)} role="alert">
        {errorFallback ?? (
          <span className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-destructive animate-pulse" />
            {error}
          </span>
        )}
      </Component>
    );
  }

  // Empty state
  if (!text && !isStreaming) {
    return (
      <Component className={cn("text-muted-foreground text-sm italic", className)}>
        {emptyMessage}
      </Component>
    );
  }

  // Shimmer effect (for loading/streaming state without full text)
  if (isStreaming && effect === "shimmer" && !text) {
    return (
      <Component className={className}>
        <ShimmerText duration={shimmerDuration}>
          Generating response...
        </ShimmerText>
      </Component>
    );
  }

  // Typewriter effect
  if (effect === "typewriter") {
    const displayText = isStreaming
      ? text.slice(0, displayLength)
      : text;

    return (
      <Component className={cn("relative", className)}>
        <span>{displayText}</span>
        {showCursor && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            className="inline-block ml-0.5 font-light text-foreground/70"
            transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            aria-hidden="true"
          >
            {cursor}
          </motion.span>
        )}
        {!isStreaming && displayLength < text.length && (
          <span className="sr-only" role="status">
            Generating content...
          </span>
        )}
      </Component>
    );
  }

  // Shimmer effect on completed/full text
  if (isStreaming && effect === "shimmer" && text) {
    return (
      <Component className={cn("relative", className)}>
        <ShimmerText duration={shimmerDuration}>{text}</ShimmerText>
        {showCursor && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            className="inline-block ml-0.5 font-light"
            transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            aria-hidden="true"
          >
            {cursor}
          </motion.span>
        )}
      </Component>
    );
  }

  // Default: plain text
  return (
    <Component className={cn("relative", className)}>
      <span>{text}</span>
      {showCursor && !isStreaming && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          className="inline-block ml-0.5 font-light text-foreground/40"
          transition={{ duration: 1.2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          aria-hidden="true"
        >
          {cursor}
        </motion.span>
      )}
    </Component>
  );
}

export const AIStreamingText = memo(AIStreamingTextComponent);
AIStreamingText.displayName = "AIStreamingText";
