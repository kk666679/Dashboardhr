"use client";

import { Conversation, Message, PromptInput, PromptInputTextarea, Sources, Reasoning, ReasoningTrigger, ReasoningContent, SourcesTrigger, SourcesContent, Source } from "@/components/ai-elements";
import { useAI } from "@/hooks/useAI";

interface ExitInterviewAIProps {
  terminationId: string;
}

export function ExitInterviewAI({ terminationId }: ExitInterviewAIProps) {
  const { messages, sendMessage, isThinking, sources, reasoning } = useAI({
    endpoint: "/api/ai/exit-interview",
    context: { terminationId },
  });

  return (
    <div className="border rounded-lg p-4 bg-muted/30">
      <h3 className="text-lg font-semibold mb-2">AI Exit Interview Assistant</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Get suggestions for questions or summarise the interview.
      </p>
      <Conversation className="max-h-80 overflow-y-auto mb-4">
        {messages.map((msg, i) => (
          <Message key={i} role={msg.role} content={msg.content} />
        ))}
        {isThinking && <Message role="assistant" content="Thinking..." isLoading />}
      </Conversation>
      {reasoning && reasoning.length > 0 && (
        <Reasoning>
          <ReasoningTrigger />
          <ReasoningContent>{reasoning.join("\n")}</ReasoningContent>
        </Reasoning>
      )}
      {sources && sources.length > 0 && (
        <Sources>
          <SourcesTrigger count={sources.length} />
          <SourcesContent>
            {sources.map((s: unknown, idx: number) => {
              const src = s as Record<string, unknown>;
              const title = typeof s === 'string' ? s : (src?.title as string) ?? (src?.url as string) ?? 'Source';
              const href = src?.url as string;
              return <Source key={idx} title={title} href={href} />;
            })}
          </SourcesContent>
        </Sources>
      )}
      <PromptInput
        onSubmit={async (message) => { await sendMessage(message.text); }}
        className="mt-2"
      >
        <PromptInputTextarea placeholder="e.g., Suggest three questions for a software engineer" />
      </PromptInput>
    </div>
  );
}

