"use client";

import { useState } from "react";

export interface KbContext {
  type: string;
  source: string;
  score: number;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  experimental_assistantContext?: KbContext[];
}

const fallbackResponse = (query: string): ChatMessage => ({
  role: "assistant",
  content: `I can help review the knowledge base for: ${query}. Add documents or connect the RAG service to get grounded answers from your policies and HR content.`,
  experimental_assistantContext: [
    { type: "kb", source: "FWMS knowledge base", score: 0.88 },
  ],
});

export interface UseKbChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  append: (msg: ChatMessage) => Promise<void>;
}

export function useKbChat(): UseKbChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const append = async (msg: ChatMessage) => {
    setMessages((prev) => [...prev, msg]);
    setIsLoading(true);
    try {
      const prompt = msg.content.trim();
      const response = prompt
        ? fallbackResponse(prompt)
        : {
            role: "assistant" as const,
            content: "Please enter a question to search the knowledge base.",
            experimental_assistantContext: [] as KbContext[],
          };
      setMessages((prev) => [...prev, response]);
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, isLoading, append };
}
