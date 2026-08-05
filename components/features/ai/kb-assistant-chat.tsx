"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, X, Bot, User, Database } from "lucide-react";
import { useKbChat, type KbMessage } from "@/hooks/useKbChat";

/**
 * Helper: extract plain text content from a KbMessage (UIMessage) by reading its parts.
 */
function getMessageText(message: KbMessage): string {
  const parts = message.parts as Array<{ type: string; text?: string }> | undefined;
  if (!Array.isArray(parts)) return "";
  return parts
    .filter((part): part is { type: "text"; text: string } => part.type === "text")
    .map((part) => part.text)
    .filter(Boolean)
    .join("");
}

export interface KbAssistantChatProps {
  variant: "floating" | "alwaysOpen";
}

export function KbAssistantChat({ variant }: KbAssistantChatProps) {
  const [isOpen, setIsOpen] = useState(variant === "alwaysOpen");
  const [inputText, setInputText] = useState("");
  const { messages, isLoading, sendMessage } = useKbChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text || isLoading) return;

    await sendMessage(text);
    setInputText("");
  };

  const chatPanel = (
    <CardContent className="p-0">
      <div className="h-80 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="max-w-[85%] p-3 rounded-lg bg-muted text-foreground">
            <div className="flex items-start gap-2">
              <Bot className="w-4 h-4 mt-0.5 text-primary" />
              <p className="text-sm">
                Hello! I can answer questions based on your knowledge base
                (documents, policies, employee records, etc.). Ask me anything.
              </p>
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={`${message.id ?? message.role}-${index}`}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground"
              }`}
            >
              <div className="flex items-start gap-2">
                {message.role === "user" ? (
                  <User className="w-4 h-4 mt-0.5" />
                ) : (
                  <Bot className="w-4 h-4 mt-0.5 text-primary" />
                )}
                <div>
                  <p className="text-sm whitespace-pre-wrap">{getMessageText(message)}</p>
                  {message.structured?.sources && message.structured.sources.length > 0 && (
                    <div className="mt-2 text-xs opacity-70">
                      Sources:{" "}
                      {message.structured.sources
                        .map((source) => `${source.title}${source.score ? ` (${Math.round(source.score * 100)}%)` : ""}`)
                        .join(", ")}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] p-3 rounded-lg bg-muted text-foreground">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-primary animate-pulse" />
                <p className="text-sm">Thinking...</p>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={inputText}
            onChange={(event) => setInputText(event.target.value)}
            placeholder="Ask your knowledge base..."
            onKeyDown={(event) => event.key === "Enter" && handleSend()}
          />
          <Button onClick={handleSend} disabled={isLoading || !inputText.trim()}>
            {isLoading ? "..." : <Send className="w-4 h-4" />}
          </Button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Uses vector search + Ollama (local LLM). Answers grounded in your
          uploaded documents.
        </p>
      </div>
    </CardContent>
  );

  if (variant === "alwaysOpen") {
    return (
      <Card className="shadow-xl border-0">
        <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Database className="w-5 h-5" />
            KB Assistant
            <Badge className="ml-auto bg-green-500 text-white">RAG + Ollama</Badge>
          </CardTitle>
        </CardHeader>
        {chatPanel}
      </Card>
    );
  }

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          className="rounded-full w-14 h-14 bg-primary hover:bg-primary/90 shadow-lg"
          onClick={() => setIsOpen((open) => !open)}
          aria-label="Toggle knowledge base assistant"
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        </Button>
      </div>

      {isOpen && (
        <div className="fixed bottom-20 right-4 z-40 w-96 max-w-[calc(100vw-1rem)]">
          <Card className="shadow-2xl border-0">
            <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Database className="w-5 h-5" />
                KB Assistant
                <Badge className="ml-auto bg-green-500 text-white">RAG + Ollama</Badge>
              </CardTitle>
            </CardHeader>
            {chatPanel}
          </Card>
        </div>
      )}
    </>
  );
}
