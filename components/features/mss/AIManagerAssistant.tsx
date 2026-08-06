"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Brain, Send, Sparkles, User, Loader2, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const SUGGESTED_PROMPTS = [
  "Who is overloaded this month?",
  "Which employees need recognition?",
  "What actions should I prioritize today?",
  "Recommend candidates for the new project",
  "Prepare my quarterly talent review",
  "Who is at risk of leaving?",
  "Summarise team performance this quarter",
  "What training gaps exist in my team?",
];

const MOCK_RESPONSES: Record<string, string> = {
  default: "Based on your team data, I've analysed the current workforce signals. Here's what I found:\n\n**Key observations:**\n- 2 employees show elevated burnout indicators (62h+ weekly average)\n- Team utilisation is at 94% — near capacity\n- 4 employees haven't received recognition in 90+ days\n\n**Recommended actions:**\n1. Schedule 1:1 with Ahmad Razif — retention risk score 87%\n2. Redistribute Siti Norzahra's workload before end of week\n3. Approve the pending AWS training request for the engineering team\n\nWould you like me to draft a message or initiate any of these actions?",
};

export function AIManagerAssistant({ compact = false }: { compact?: boolean }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm your AI Manager Assistant. I can help you understand your team, draft communications, prepare for reviews, and take HR actions. What would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(text?: string) {
    const query = text ?? input.trim();
    if (!query || isLoading) return;

    setInput("");
    setShowSuggestions(false);
    setMessages(prev => [...prev, { id: Date.now().toString(), role: "user", content: query, timestamp: new Date() }]);
    setIsLoading(true);

    // Simulate AI response
    await new Promise(r => setTimeout(r, 1200));
    const response = MOCK_RESPONSES[query] ?? MOCK_RESPONSES.default;
    setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: response, timestamp: new Date() }]);
    setIsLoading(false);
  }

  return (
    <Card className={cn("flex flex-col", compact ? "h-[480px]" : "h-[600px]")}>
      <CardHeader className="pb-3 shrink-0">
        <CardTitle className="text-sm flex items-center gap-2">
          <Brain className="h-4 w-4 text-violet-600" />
          AI Manager Assistant
          <Badge className="ml-auto bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300 border-0 text-[10px]">
            <Sparkles className="h-2.5 w-2.5 mr-1" /> Powered by OpenClaw
          </Badge>
        </CardTitle>
      </CardHeader>

      <ScrollArea className="flex-1 px-4">
        <div className="space-y-4 pb-2">
          {messages.map((msg) => (
            <div key={msg.id} className={cn("flex gap-2.5", msg.role === "user" && "flex-row-reverse")}>
              <div className={cn(
                "h-7 w-7 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                msg.role === "assistant" ? "bg-violet-100 dark:bg-violet-900/40" : "bg-blue-100 dark:bg-blue-900/40"
              )}>
                {msg.role === "assistant"
                  ? <Brain className="h-3.5 w-3.5 text-violet-600" />
                  : <User className="h-3.5 w-3.5 text-blue-600" />}
              </div>
              <div className={cn(
                "max-w-[80%] rounded-xl px-3.5 py-2.5 text-sm",
                msg.role === "assistant"
                  ? "bg-muted/60 text-foreground"
                  : "bg-blue-600 text-white"
              )}>
                {msg.content.split("\n").map((line, i) => {
                  if (line.startsWith("**") && line.endsWith("**")) {
                    return <p key={i} className="font-semibold mt-1">{line.slice(2, -2)}</p>;
                  }
                  if (line.match(/^\d+\./)) {
                    return <p key={i} className="ml-2">{line}</p>;
                  }
                  return line ? <p key={i}>{line}</p> : <br key={i} />;
                })}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-2.5">
              <div className="h-7 w-7 rounded-full bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center shrink-0">
                <Brain className="h-3.5 w-3.5 text-violet-600" />
              </div>
              <div className="bg-muted/60 rounded-xl px-3.5 py-2.5">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}

          {showSuggestions && messages.length === 1 && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground font-medium">Suggested questions:</p>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_PROMPTS.map((p) => (
                  <button
                    key={p}
                    onClick={() => handleSend(p)}
                    className="text-xs px-2.5 py-1 rounded-full border border-violet-200 text-violet-700 dark:border-violet-700 dark:text-violet-300 hover:bg-violet-50 dark:hover:bg-violet-900/30 transition-colors"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      <CardContent className="pt-3 pb-4 shrink-0 border-t">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder="Ask anything about your team…"
            className="min-h-[40px] max-h-[100px] resize-none text-sm"
            rows={1}
          />
          <Button size="icon" onClick={() => handleSend()} disabled={!input.trim() || isLoading} className="shrink-0 h-10 w-10 bg-violet-600 hover:bg-violet-700">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
