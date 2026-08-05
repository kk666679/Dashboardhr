import { Conversation, Message, PromptInput, Sources, SourcesTrigger, SourcesContent, Source } from "@/components/ai-elements";
import { useAI } from "@/hooks/useAI";

export function MSSAI() {
  const { messages, sendMessage, isThinking, sources } = useAI({
    endpoint: "/api/ai/mss",
  });

  return (
    <div className="border rounded-lg p-4 bg-muted/30">
      <h3 className="text-lg font-semibold">AI Manager Assistant</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Get insights on team performance, leave trends, hiring needs, or management advice.
      </p>
      <Conversation className="max-h-60 overflow-y-auto my-3">
        {messages.map((msg, i) => (
          <Message key={i} role={msg.role} content={msg.content} />
        ))}
        {isThinking && <Message role="assistant" content="Thinking..." isLoading />}
      </Conversation>
      {sources && sources.length > 0 && (
        <Sources>
          <SourcesTrigger count={sources.length} />
          <SourcesContent>
            {sources.map((src: any, i: number) => (
              <Source key={i} title={src.title} href={src.url} />
            ))}
          </SourcesContent>
        </Sources>
      )}
      <PromptInput
        onSubmit={(msg) => sendMessage(msg.text)}
      />
    </div>
  );
}
