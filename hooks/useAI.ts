import { useState, useCallback, useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface UseAIOptions {
  endpoint: string;
  context?: Record<string, any>;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface UseAIReturn {
  messages: Message[];
  sendMessage: (content: string) => Promise<void>;
  isThinking: boolean;
  sources?: any[];
  reasoning?: string[];
  chainOfThought?: string[];
  clearMessages: () => void;
}

export function useAI({ endpoint, context }: UseAIOptions): UseAIReturn {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'How can I help you?' }
  ]);
  const [isThinking, setIsThinking] = useState(false);
  const [sources, setSources] = useState<any[]>();
  const [reasoning, setReasoning] = useState<string[]>();
  const [chainOfThought, setChainOfThought] = useState<string[]>();
  const { toast } = useToast();

  // Keep the latest messages in a ref so `sendMessage` stays stable across
  // renders while still reading the freshest message history.
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = { role: 'user', content };
    setMessages(prev => [...prev, userMessage]);
    setIsThinking(true);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messagesRef.current, userMessage],
          context: context || {},
        }),
      });

      if (!response.ok) throw new Error('AI request failed');

      const data = await response.json();
      setSources(data.sources);
      setReasoning(data.reasoning);
      setChainOfThought(data.chainOfThought);

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.message || 'No response from AI',
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      toast({
        title: 'AI Error',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setIsThinking(false);
    }
  }, [endpoint, context, toast]);

  const clearMessages = useCallback(() => {
    setMessages([{ role: 'assistant', content: 'How can I help you?' }]);
    setSources(undefined);
    setReasoning(undefined);
    setChainOfThought(undefined);
  }, []);

  return {
    messages,
    sendMessage,
    isThinking,
    sources,
    reasoning,
    chainOfThought,
    clearMessages,
  };
}
