"use client";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Copy, Trash2, BringToFront, SendToBack, Edit } from "lucide-react";



interface CanvasContextMenuProps {
  children: React.ReactNode;
  onCopy?: () => void;
  onPaste?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onBringForward?: () => void;
  onSendBackward?: () => void;
  onEdit?: () => void;
  hasSelection?: boolean;
}

export function CanvasContextMenu({
  children,
  onCopy,
  onPaste,
  onDelete,
  onDuplicate,
  onBringForward,
  onSendBackward,
  onEdit,
  hasSelection = false,
}: CanvasContextMenuProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        {hasSelection && (
          <>
            <ContextMenuItem onClick={onEdit}>
              <Edit className="mr-2 h-4 w-4" /> Edit
            </ContextMenuItem>
            <ContextMenuItem onClick={onCopy}>
              <Copy className="mr-2 h-4 w-4" /> Copy
            </ContextMenuItem>
            <ContextMenuItem onClick={onDuplicate}>
              <Copy className="mr-2 h-4 w-4" /> Duplicate
            </ContextMenuItem>

            <ContextMenuSeparator />

            <ContextMenuItem onClick={onDelete} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuSub>
              <ContextMenuSubTrigger>
                <BringToFront className="mr-2 h-4 w-4" /> Arrange
              </ContextMenuSubTrigger>
              <ContextMenuSubContent>
                <ContextMenuItem onClick={onBringForward}>
                  <BringToFront className="mr-2 h-4 w-4" /> Bring Forward
                </ContextMenuItem>
                <ContextMenuItem onClick={onSendBackward}>
                  <SendToBack className="mr-2 h-4 w-4" /> Send Backward
                </ContextMenuItem>
              </ContextMenuSubContent>
            </ContextMenuSub>
          </>
        )}
        {!hasSelection && (
          <ContextMenuItem onClick={onPaste}>
            <Copy className="mr-2 h-4 w-4" /> Paste
          </ContextMenuItem>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
}
