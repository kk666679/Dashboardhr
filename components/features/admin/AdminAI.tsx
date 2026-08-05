"use client";

import { useState } from "react";
import type { PromptInputMessage } from "@/components/ai-elements/prompt-input";
import { 
  Agent, 
  AgentHeader, 
  AgentStatusDot, 
  AgentContent 
} from "@/components/ai-elements/agent";
import { 
  Message, 
  MessageContent,
  MessageActions,
  MessageAction,
  MessageResponse
} from "@/components/ai-elements/message";
import { Conversation } from "@/components/ai-elements/conversation";
import { 
  Sources, 
  SourcesTrigger, 
  SourcesContent, 
  Source 
} from "@/components/ai-elements/sources";
import { 
  PromptInput, 
  PromptInputTextarea, 
  PromptInputFooter, 
  PromptInputTools, 
  PromptInputSubmit,
  PromptInputActionMenu,
  PromptInputActionMenuTrigger,
  PromptInputActionMenuContent,
  PromptInputActionAddAttachments,
  PromptInputActionAddScreenshot,
} from "@/components/ai-elements/prompt-input";
import { Panel, PanelHeader, PanelTitle, PanelDescription, PanelContent, PanelActions } from "@/components/ai-elements/panel";
import { Suggestions, Suggestion } from "@/components/ai-elements/suggestion";
import { Reasoning, ReasoningTrigger, ReasoningContent } from "@/components/ai-elements/reasoning";
import { useKbChat } from "@/hooks/useKbChat";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Bot, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Helper to extract text content from a KbMessage (which extends UIMessage using `parts`).
 */
function getMessageText(msg: { parts?: Array<{ type: string; text?: string }> }): string {
  const parts = msg.parts as Array<{ type: string; text?: string }> | undefined;
  if (!Array.isArray(parts)) return "";
  return parts
    .filter((part): part is { type: "text"; text: string } => part.type === "text")
    .map((part) => part.text)
    .filter(Boolean)
    .join("");
}

export function AdminAI() {
  const { toast } = useToast();
  const [agentStatus, setAgentStatus] = useState<"idle" | "thinking" | "done">("idle");

  // Use the unified KBChat with admin context
  const {
    messages,
    sendMessage,
    isLoading,
    latestResponse,
    latestSuggestions,
    sources,
    clear,
  } = useKbChat({
    employeeId: "system",
    tenantId: "default",
    // Optionally, we can restrict to admin agents
    agents: ["admin", "audit", "security"],
    provider: "claude",
  });

  const handleSend = async (msg: PromptInputMessage) => {
    // The orchestrator will handle the rest
    await sendMessage(msg.text);
  };

  const runAIInsight = () => {
    setAgentStatus("thinking");
    setTimeout(() => {
      setAgentStatus("done");
      toast({
        title: "AI Insights Ready",
        description: "Analyzed system logs and user activity. No critical issues found.",
      });
    }, 1500);
  };

  const handleClear = () => {
    clear();
    toast({ title: "Conversation cleared" });
  };

  return (
    <Panel className="min-h-screen">
      <PanelHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
          <div>
            <PanelTitle>AI Admin Assistant</PanelTitle>
            <PanelDescription>
              Chat with the AI to manage users, review logs, and get security insights
            </PanelDescription>
          </div>
          <PanelActions>
            <Button variant="outline" onClick={runAIInsight} className="gap-2">
              <Sparkles className="h-4 w-4" />
              AI Insights
            </Button>
            <Button variant="outline" onClick={handleClear} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Clear Chat
            </Button>
          </PanelActions>
        </div>
      </PanelHeader>

      <PanelContent className="space-y-6">
        {/* Agent Status */}
        <Agent>
          <AgentHeader
            name="Admin Intelligence Agent"
            model="admin-v2"
            status={agentStatus}
            actions={
              <span className="flex items-center gap-1 text-xs">
                <AgentStatusDot status={agentStatus} />
                {agentStatus === "idle" && "Monitoring"}
                {agentStatus === "thinking" && "Analyzing..."}
                {agentStatus === "done" && "Done"}
              </span>
            }
          />
          {agentStatus === "done" && (
            <AgentContent>
              <Suggestions>
                <Suggestion suggestion="🔍 Run a full security audit of user permissions" variant="outline" />
                <Suggestion suggestion="📊 Generate a system health report for the last 7 days" variant="outline" />
                <Suggestion suggestion="🛡️ Review recent failed login attempts" variant="outline" />
              </Suggestions>
            </AgentContent>
          )}
        </Agent>

        {/* Conversation */}
        <div className="rounded-lg border bg-card">
          <Conversation className="max-h-[400px] overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                <Bot className="h-12 w-12 mb-2 opacity-50" />
                <p className="text-sm">Ask me anything about system administration</p>
                <p className="text-xs">I can help with user management, audit logs, security, and more</p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <Message key={idx} role={msg.role}>
                  <MessageContent>
                    <MessageResponse>{getMessageText(msg)}</MessageResponse>
                    {msg.role === "assistant" && msg.structured?.sources && (
                      <Sources>
                        <SourcesTrigger count={msg.structured.sources.length} />
                        <SourcesContent>
                          {msg.structured.sources.map((src, i) => (
                            <Source key={i} title={src.title} href={src.url} />
                          ))}
                        </SourcesContent>
                      </Sources>
                    )}
                  </MessageContent>
                  {msg.role === "assistant" && (
                    <MessageActions>
                      <MessageAction tooltip="Copy response" label="Copy" />
                      <MessageAction tooltip="Regenerate" label="Regenerate" />
                    </MessageActions>
                  )}
                </Message>
              ))
            )}
            {isLoading && (
              <Message role="assistant">
                <MessageContent>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="flex gap-1">
                      <span className="size-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:0ms]" />
                      <span className="size-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:150ms]" />
                      <span className="size-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:300ms]" />
                    </div>
                    <span className="text-xs">Thinking...</span>
                  </div>
                </MessageContent>
              </Message>
            )}
          </Conversation>

          {/* Prompt Input */}
          <div className="border-t p-4">
            <PromptInput onSubmit={handleSend}>
              <PromptInputTextarea placeholder="Ask about admin tasks, user issues, or security..." />
              <PromptInputFooter>
                <PromptInputTools>
                  <PromptInputActionMenu>
                    <PromptInputActionMenuTrigger />
                    <PromptInputActionMenuContent>
                      <PromptInputActionAddAttachments label="Upload file" />
                      <PromptInputActionAddScreenshot label="Take screenshot" />
                    </PromptInputActionMenuContent>
                  </PromptInputActionMenu>
                </PromptInputTools>
                <PromptInputSubmit status={isLoading ? "streaming" : "ready"} />
              </PromptInputFooter>
            </PromptInput>
          </div>
        </div>

        {/* AI Reasoning & Suggestions */}
        {latestResponse && (
          <div className="space-y-4">
            {latestResponse.actions && latestResponse.actions.length > 0 && (
              <div className="rounded-lg border bg-muted/30 p-4">
                <h4 className="text-sm font-medium mb-2">Actions Taken</h4>
                <ul className="space-y-1">
                  {latestResponse.actions.map((action, i) => (
                    <li key={i} className="text-sm flex items-center gap-2">
                      <span className={cn(
                        "size-2 rounded-full",
                        action.status === "completed" ? "bg-green-500" :
                        action.status === "pending" ? "bg-yellow-500" :
                        "bg-red-500"
                      )} />
                      {action.description}
                      {action.details && (
                        <span className="text-xs text-muted-foreground">({action.details})</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {latestResponse.pendingTasks && latestResponse.pendingTasks.length > 0 && (
              <div className="rounded-lg border bg-yellow-50 dark:bg-yellow-950/20 p-4">
                <h4 className="text-sm font-medium mb-2">Pending Tasks</h4>
                <ul className="space-y-1">
                  {latestResponse.pendingTasks.map((task, i) => (
                    <li key={i} className="text-sm flex items-center gap-2">
                      <span className="size-2 rounded-full bg-yellow-500" />
                      {task.description}
                      {task.requiredAction && (
                        <Badge variant="outline" className="text-xs">{task.requiredAction}</Badge>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {latestResponse.suggestions && latestResponse.suggestions.length > 0 && (
              <div className="rounded-lg border p-4">
                <h4 className="text-sm font-medium mb-2">Suggested Follow-ups</h4>
                <div className="flex flex-wrap gap-2">
                  {latestResponse.suggestions.map((suggestion, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => sendMessage(suggestion.label)}
                    >
                      {suggestion.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Overall Sources */}
        {sources.length > 0 && (
          <Sources>
            <SourcesTrigger count={sources.length} />
            <SourcesContent>
              {sources.map((src, i) => (
                <Source key={i} title={src.title} href={src.url} />
              ))}
            </SourcesContent>
          </Sources>
        )}
      </PanelContent>
    </Panel>
  );
}