"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import styles from "./GlassModal.module.css";

interface GlassModalProps {
  children: ReactNode;
  className?: string;
  /** Rendered as a `<dialog>` for native accessibility when true (default: div) */
  asDialog?: boolean;
}

/**
 * GlassModal
 *
 * A glass-styled content container intended for modal/overlay use.
 * For full accessibility, wrap with Radix UI `<Dialog>` or shadcn/ui
 * `<Dialog>` — this component only handles visual treatment.
 *
 * Usage:
 *   <Dialog>
 *     <DialogContent asChild>
 *       <GlassModal>
 *         <DialogHeader>…</DialogHeader>
 *       </GlassModal>
 *     </DialogContent>
 *   </Dialog>
 */
export function GlassModal({ children, className, asDialog = false }: GlassModalProps) {
  const Tag = asDialog ? "dialog" : "div";

  return (
    <Tag className={cn(styles.glassModal, className)}>
      {children}
    </Tag>
  );
}
