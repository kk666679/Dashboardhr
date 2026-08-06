"use client";

import * as React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

export type MobileSheetKind = "palette" | "properties" | "ai" | "execution" | "versions" | null;

interface FlowStudioMobileSheetProps {
  /** Currently open sheet kind */
  open: MobileSheetKind;
  onOpenChange: (kind: MobileSheetKind) => void;
  palette?: React.ReactNode;
  properties?: React.ReactNode;
  ai?: React.ReactNode;
  execution?: React.ReactNode;
  versions?: React.ReactNode;
}

const SHEET_TITLES: Record<Exclude<MobileSheetKind, null>, string> = {
  palette: "Node Palette",
  properties: "Properties",
  ai: "AI Copilot",
  execution: "Execution",
  versions: "Version History",
};

/**
 * Mobile bottom-sheet panel system.
 * Renders each Studio panel as a bottom sheet with a drag handle.
 */
export function FlowStudioMobileSheet({
  open,
  onOpenChange,
  palette,
  properties,
  ai,
  execution,
  versions,
}: FlowStudioMobileSheetProps) {
  const content =
    open === "palette" ? palette :
    open === "properties" ? properties :
    open === "ai" ? ai :
    open === "execution" ? execution :
    open === "versions" ? versions :
    null;

  return (
    <Sheet open={open !== null} onOpenChange={(o) => onOpenChange(o ? open : null)}>
      <SheetContent side="bottom" className="h-[70vh] rounded-t-2xl p-0" showCloseButton={false}>
        <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-muted" />
        <SheetHeader className="px-4 py-2">
          <SheetTitle className="text-sm">{open ? SHEET_TITLES[open] : ""}</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-1 px-4 pb-6 h-[calc(70vh-80px)]">
          {content}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
