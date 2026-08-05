"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;

function TabsList({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn(
        "inline-flex items-center gap-0.5 rounded-[var(--radius-lg)] p-1",
        "bg-[var(--surface-2)] border border-[var(--border)]",
        "text-[var(--foreground-muted)]",
        className,
      )}
      {...props}
    />
  );
}
TabsList.displayName = TabsPrimitive.List.displayName;

function TabsTrigger({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "inline-flex items-center justify-center gap-1.5 whitespace-nowrap",
        "rounded-[calc(var(--radius-lg)-2px)] px-3 h-7",
        "text-xs font-medium",
        "transition-all duration-150",
        "outline-none",
        "focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--surface-2)]",
        "disabled:pointer-events-none disabled:opacity-40",
        // Active
        "data-[state=active]:bg-[var(--surface-0)] data-[state=active]:text-[var(--foreground)] data-[state=active]:shadow-[var(--shadow-xs)]",
        // Inactive
        "hover:text-[var(--foreground)]",
        "[&_svg]:size-3.5 [&_svg]:shrink-0",
        className,
      )}
      {...props}
    />
  );
}
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

function TabsContent({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      className={cn(
        "mt-3",
        "outline-none",
        "focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-1",
        className,
      )}
      {...props}
    />
  );
}
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
