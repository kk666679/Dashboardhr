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
import { Loader2, Send, BookOpen, Database } from "lucide-react";

type KBContext = {
  type: "kb" | "db" | string;
  source: string;
  score?: number;
};

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  experimental_assistantContext?: KBContext[];
};

export default function KbChatPage() {
  const [currentQuery, setCurrentQuery] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const chat = useKbChat();

  const messages = chat.messages as ChatMessage[];
  const isLoading = chat.isLoading;
  const append = chat.append;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmed = currentQuery.trim();
    if (!trimmed || isLoading) return;

    await append({
      role: "user",
      content: trimmed,
    });

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
                        <p className="whitespace-pre-wrap">{m.content}</p>
                      </div>
                    </Card>
                  </div>

                  {m.role === "assistant" &&
                    m.experimental_assistantContext?.length ? (
                    <div className="mt-2 flex gap-2 text-xs text-muted-foreground max-w-lg ml-16">
                      {m.experimental_assistantContext.map((ctx, j) => (
                        <Card key={j} className="p-2 bg-secondary">
                          <div className="flex items-center gap-1">
                            {ctx.type === "kb" ? (
                              <BookOpen className="h-3 w-3" />
                            ) : (
                              <Database className="h-3 w-3" />
                            )}

                            <span>
                              {ctx.source.length > 40
                                ? ctx.source.slice(0, 40) + "..."
                                : ctx.source}
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
            onSubmit={sendMessage}
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