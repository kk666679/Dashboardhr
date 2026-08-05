"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, X } from "lucide-react";
import { KbAssistantChat } from "@/components/features/ai/kb-assistant-chat";
import { cn } from "@/lib/utils";

export function KbChat() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {!open && (
        <Button
          variant="outline"
          size="icon"
          className="relative"
          onClick={() => setOpen(true)}
          title="Knowledge Base Assistant"
        >
          <MessageSquare className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 h-2 w-2 bg-green-500 rounded-full animate-pulse" />
        </Button>
      )}
      <div
        className={cn(
          "fixed bottom-20 right-4 w-96 max-w-[calc(100%-2rem)] max-h-[80vh] bg-background border rounded-lg shadow-2xl transition-all duration-300 z-50",
          open ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        )}
      >
        {open && (
          <div className="flex flex-col h-[500px]">
            <div className="flex items-center justify-between p-3 border-b">
              <h3 className="font-medium">AI Assistant</h3>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-hidden">
              <KbAssistantChat variant="alwaysOpen" />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
