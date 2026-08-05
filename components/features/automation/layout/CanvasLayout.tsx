"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CanvasLayoutProps {
  children: ReactNode;
  className?: string;
  toolbar?: ReactNode;
  sidebar?: ReactNode;
  footer?: ReactNode;
}

export function CanvasLayout({
  children,
  className,
  toolbar,
  sidebar,
  footer,
}: CanvasLayoutProps) {
  return (
    <div className={cn("flex flex-col h-full", className)}>
      {toolbar && (
        <div className="flex-shrink-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          {toolbar}
        </div>
      )}
      <div className="flex flex-1 overflow-hidden">
        {sidebar && (
          <div className="flex-shrink-0 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 overflow-y-auto">
            {sidebar}
          </div>
        )}
        <div className="flex-1 relative overflow-hidden">
          {children}
        </div>
      </div>
      {footer && (
        <div className="flex-shrink-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          {footer}
        </div>
      )}
    </div>
  );
}
