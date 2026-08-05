"use client";

import {
  Conversation,
  Message,
  PromptInput,
  PromptInputTextarea,
  Sources,
  SourcesTrigger,
  SourcesContent,
} from "@/components/ai-elements";
import { useAI } from "@/hooks/useAI";

export function PermitAI() {
  const { messages, sendMessage, isThinking, sources } = useAI({
    endpoint: "/api/ai/permits",
  });

  return (
    <div className="border rounded-lg p-4 bg-muted/30">
      <h3 className="text-lg font-semibold">AI Permit Assistant</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Get renewal reminders, check compliance, or ask about permit regulations.
      </p>
      <Conversation className="max-h-60 overflow-y-auto my-3">
        {messages.map((msg, i) => (
          <Message key={i} from={msg.role} content={msg.content} />
        ))}
        {isThinking && (
          <div className="text-sm text-muted-foreground">Thinking...</div>
        )}
      </Conversation>
      {sources && (
        <Sources>
          <SourcesTrigger count={sources.length} />
          <SourcesContent>
            {(sources || []).map((s: unknown, idx: number) => {
              const label = typeof s === 'string' ? s : String((s as Record<string, unknown>)?.title ?? (s as Record<string, unknown>)?.url ?? 'Source');
              return <div key={idx} className="break-all">{label}</div>;
            })}
          </SourcesContent>
        </Sources>
      )}
      <PromptInput
        onSubmit={async (message) => {
          await sendMessage(message.text);
        }}
      >
        <PromptInputTextarea placeholder="Ask about permits..." />
      </PromptInput>
    </div>
  );
}

