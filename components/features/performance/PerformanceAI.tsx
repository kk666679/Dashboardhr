import {
  Conversation,
  Message,
  PromptInput,
} from "@/components/ai-elements";


import { useAI } from "@/hooks/useAI";

export function PerformanceAI() {
  const { messages, sendMessage, isThinking } = useAI({
    endpoint: "/api/ai/performance",
  });

  return (
    <div className="border rounded-lg p-4 bg-muted/30">
      <h3 className="text-lg font-semibold">AI Performance Assistant</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Get insights on performance trends, review suggestions, and goal recommendations.
      </p>
      <Conversation className="max-h-60 overflow-y-auto my-3">
        {messages.map((msg, i) => (
          <Message key={i} from={msg.role} content={msg.content} />
        ))}
        {isThinking && (
          <div className="text-sm text-muted-foreground">Thinking...</div>
        )}
      </Conversation>
      <PromptInput
        onSubmit={async (message) => {
          await sendMessage(message.text);
        }}
      />





    </div>
  );
}
