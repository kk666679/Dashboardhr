"use client";

import { useState } from "react";
import type { UIMessage } from "ai";
import { useAiChat } from "@/hooks/useAiChat";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
  ConversationDownload,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bot, User, MessageCircle, X, Download, Trash2 } from "lucide-react";
import type { AgentPersona } from "@/server/agents/prompts";

const PERSONAS: { value: AgentPersona; label: string }[] = [
  { value: "orchestrator", label: "HR Orchestrator" },
  { value: "hrOperations", label: "HR Operations" },
  { value: "foreignWorkers", label: "Foreign Workers" },
  { value: "foreignWorkerExpatriate", label: "Expat & FW" },
  { value: "compensationBenefits", label: "Compensation" },
  { value: "talentAcquisition", label: "Recruitment" },
  { value: "hrCompliance", label: "Compliance" },
  { value: "industrialRelations", label: "Industrial Relations" },
  { value: "hrAnalytics", label: "HR Analytics" },
  { value: "learningDevelopment", label: "L&D" },
  { value: "employerBranding", label: "Employer Branding" },
  { value: "successionPlanning", label: "Succession" },
  { value: "hrQualityManagement", label: "Quality" },
  { value: "employeeRelations", label: "Employee Relations" },
];

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [persona, setPersona] = useState<AgentPersona>("orchestrator");

  const { messages, sendMessage, status, clearHistory } = useAiChat({
    persona,
  });

  const isLoading = status === "submitted" || status === "streaming";

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text || isLoading) return;
    setInputText("");
    
    try {
      // Fix: Use the correct format - send as { text: string }
      await sendMessage({ text });
    } catch (error) {
      console.error("Failed to send message:", error);
      // Optionally add error state here
    }
  };

  const getMessageText = (message: UIMessage) => {
    const parts = message.parts as Array<{ type: string; text?: string }> | undefined;

    return (
      parts
        ?.filter((part): part is { type: "text"; text: string } => part.type === "text")
        .map((part) => part.text)
        .join("") ?? ""
    );
  };

  return (
    <>
      {/* Floating toggle */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          className="rounded-full w-14 h-14 bg-blue-600 hover:bg-blue-700 shadow-lg touch-target"
          onClick={() => setIsOpen((o) => !o)}
          aria-label="Toggle HR AI Chat"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <MessageCircle className="w-6 h-6" />
          )}
        </Button>
      </div>

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-40 w-[22rem] sm:w-96 max-w-[calc(100vw-1rem)] max-h-[80dvh] flex flex-col">
          <Card className="shadow-2xl border-0 flex flex-col h-full">
            {/* Header */}
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg p-4 shrink-0">
              <CardTitle className="flex items-center justify-between text-base">
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5 shrink-0" />
                  <span>HR AI Agent</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-500/20 text-green-200 border-green-500/30 text-xs hidden sm:flex">
                    Online
                  </Badge>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-white/70 hover:text-white hover:bg-white/10"
                    onClick={clearHistory}
                    title="Clear chat"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </CardTitle>

              {/* Persona selector */}
              <Select
                value={persona}
                onValueChange={(v) => setPersona(v as AgentPersona)}
              >
                <SelectTrigger className="mt-2 h-7 text-xs bg-white/10 border-white/20 text-white focus:ring-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PERSONAS.map((p) => (
                    <SelectItem
                      key={p.value}
                      value={p.value}
                      className="text-xs"
                    >
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardHeader>

            <CardContent className="p-0 flex-1 flex flex-col overflow-hidden min-h-0">
              {/* Messages */}
              <Conversation className="flex-1 min-h-0">
                <ConversationContent>
                  {messages.length === 0 ? (
                    <ConversationEmptyState
                      icon={
                        <Bot className="w-10 h-10 text-muted-foreground/40" />
                      }
                      title="HR AI Ready"
                      description="Ask about payroll, leave, permits, FOMEMA, compliance, or any HR topic."
                    />
                  ) : (
                    messages.map((msg) => (
                      <Message key={msg.id} from={msg.role}>
                        <MessageContent>
                          <div className="flex items-start gap-2">
                            {msg.role === "assistant" ? (
                              <Bot className="w-4 h-4 mt-0.5 shrink-0 text-blue-600" />
                            ) : (
                              <User className="w-4 h-4 mt-0.5 shrink-0" />
                            )}
                            <MessageResponse>
                              {getMessageText(msg)}
                            </MessageResponse>
                          </div>
                        </MessageContent>
                      </Message>
                    ))
                  )}
                </ConversationContent>
                <ConversationScrollButton />
                <ConversationDownload
                  messages={messages}
                  filename="hr-chat.md"
                  className="top-16 right-4"
                >
                  <Download className="w-4 h-4" />
                </ConversationDownload>
              </Conversation>

              {/* Input */}
              <div className="p-3 border-t bg-background shrink-0">
                <div className="flex gap-2">
                  <Input
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Ask any HR question..."
                    disabled={isLoading}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    className="flex-1 text-sm"
                  />
                  <Button
                    onClick={handleSend}
                    disabled={isLoading || !inputText.trim()}
                    className="w-10 h-10 rounded-full p-0 shrink-0"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M7 11L12 6L17 11"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M7 17L12 12L17 17"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}