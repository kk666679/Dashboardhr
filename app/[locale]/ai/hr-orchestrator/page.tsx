"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useKbChat } from "@/hooks/useKbChat";
import type { KbMessage } from "@/hooks/useKbChat";
import { Loader2, Send, BookOpen, Database } from "lucide-react";

type KBContext = {
  type: "kb" | "db" | string;
  source: string;
  score?: number;
};

/**
 * Helper to extract text content from a KbMessage (which extends UIMessage using `parts`).
 */
function getMessageText(msg: KbMessage): string {
  const parts = msg.parts as Array<{ type: string; text?: string }> | undefined;
  if (!Array.isArray(parts)) return "";
  return parts
    .filter((part): part is { type: "text"; text: string } => part.type === "text")
    .map((part) => part.text)
    .filter(Boolean)
    .join("");
}

export default function KbChatPage() {
  const [currentQuery, setCurrentQuery] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const chat = useKbChat();

  const messages = chat.messages;
  const isLoading = chat.isLoading;
  const sendMessage = chat.sendMessage;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmed = currentQuery.trim();
    if (!trimmed || isLoading) return;

    await sendMessage(trimmed);
    setCurrentQuery("");
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl h-screen flex flex-col">
      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            Knowledge Base RAG Chat
          </CardTitle>

          <CardDescription className="flex items-center gap-2 flex-wrap">
            <span>
              Ask about ISO clauses, HR docs, employees. Powered by RAG.
            </span>

            <Button
              variant="link"
              size="sm"
              onClick={() =>
                (window.location.href = "/api/kb/ingest?preload=true")
              }
              className="h-4 p-0"
            >
              Load KB
            </Button>
          </CardDescription>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 p-6">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-12">
                <BookOpen className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>Ask about ISO 9001 clauses or HR records...</p>
              </div>
            ) : (
              messages.map((m, i) => (
                <div key={i} className="mb-6">
                  <div
                    className={`flex ${
                      m.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <Card
                      className={`max-w-lg ${
                        m.role === "user"
                          ? "bg-primary/10 text-primary-foreground"
                          : ""
                      }`}
                    >
                      <div className="p-4">
                        <p className="whitespace-pre-wrap">{getMessageText(m)}</p>
                      </div>
                    </Card>
                  </div>

                  {m.role === "assistant" &&
                    m.structured?.sources?.length ? (
                    <div className="mt-2 flex gap-2 text-xs text-muted-foreground max-w-lg ml-16">
                      {m.structured.sources.map((ctx, j) => (
                        <Card key={j} className="p-2 bg-secondary">
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-3 w-3" />
                            <span>
                              {ctx.title.length > 40
                                ? ctx.title.slice(0, 40) + "..."
                                : ctx.title}
                            </span>
                            {typeof ctx.score === "number" && (
                              <span>({ctx.score.toFixed(3)})</span>
                            )}
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))
            )}

            <div ref={messagesEndRef} />
          </ScrollArea>

          <form
            onSubmit={handleSend}
            className="border-t p-4 flex gap-2"
          >
            <Input
              value={currentQuery}
              onChange={(e) => setCurrentQuery(e.target.value)}
              placeholder="Ask about ISO clauses or employee records..."
              className="flex-1"
              disabled={isLoading}
            />

            <Button
              type="submit"
              disabled={isLoading || !currentQuery.trim()}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Send
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}