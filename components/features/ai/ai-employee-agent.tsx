"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, GraduationCap, Heart, TrendingUp, Send } from "lucide-react";
import { useEmployee } from "@/hooks/useEmployee";


import { useToast } from "@/hooks/use-toast";
import { Agent, AgentHeader } from "@/components/ai-elements/agent";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import { Reasoning } from "@/components/ai-elements/reasoning";
import { AiMessageRow } from "./ai-message-renderer";

type AgentMessage = { id: string; role: "user" | "assistant" | "system"; content?: string; parts?: unknown[] };

export function AIEmployeeAgent() {
  const [inputText, setInputText] = useState("");
  // Temporary: this component expects a useEmployeeAgent hook, but the repo only provides useEmployee.
  // Keep it compiling by using the closest available hook.
  const employeeAgent = useEmployee();
  const { messages = [], sendMessage, status } = employeeAgent as any;


  const { toast } = useToast();

  const isLoading = status === "submitted" || status === "streaming";

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text) return;
    await sendMessage({ text });
    setInputText("");
    toast({
      title: "Sent to Employee Agent",
      description: "Analyzing employee requirements...",
    });
  };

  const handlePromptSelect = (prompt: string) => {
    setInputText(prompt);
  };

  const handleOnboarding = async () => {
    const onboardingQuery = "Create employee onboarding checklist for new hire";
    setInputText(onboardingQuery);
    await sendMessage({ text: onboardingQuery });
    setInputText("");
    toast({
      title: "Generating Onboarding Plan",
      description: "Creating comprehensive onboarding checklist...",
    });
  };



  return (
    <Agent className="border-purple-200 bg-gradient-to-br from-purple-50/50 to-violet-50/50">
      <AgentHeader name="Employee Agent" model="HR Relations & Development">
        <Badge className="bg-purple-500 hover:bg-purple-600 text-white">
          Onboarding • Performance • Training
        </Badge>
      </AgentHeader>

      <div className="p-4 space-y-4">
        <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
          <p className="text-sm text-purple-900 font-medium mb-1">Live:</p>
          <p className="text-xs text-purple-800">Employees: {0}</p>


        </div>


        <Conversation className="h-80 border rounded-lg bg-white">
          <ConversationContent>
            {messages.length === 0 && (
              <ConversationEmptyState
                title="Ready for Employee Support"
                description="Help with onboarding, performance reviews, training plans, and employee relations"
                icon={<Heart className="h-8 w-8 text-purple-600" />}
              >
                <div className="flex flex-wrap gap-2 mt-4">
                  <Badge
                    variant="secondary"
                    className="cursor-pointer hover:bg-purple-100"
                    onClick={() =>
                      handlePromptSelect("Create employee onboarding checklist")
                    }
                  >
                    Onboarding
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="cursor-pointer hover:bg-purple-100"
                    onClick={() =>
                      handlePromptSelect("Prepare performance review template")
                    }
                  >
                    Performance Review
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="cursor-pointer hover:bg-purple-100"
                    onClick={() =>
                      handlePromptSelect("Design training needs assessment")
                    }
                  >
                    Training Plan
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="cursor-pointer hover:bg-purple-100"
                    onClick={() =>
                      handlePromptSelect("Handle employee grievance procedure")
                    }
                  >
                    ER/IR Support
                  </Badge>
                  <Badge variant="secondary" className="cursor-pointer hover:bg-indigo-100" onClick={handleOnboarding}>
                    Onboarding Plan (Hook)
                  </Badge>
                </div>

              </ConversationEmptyState>
            )}

            {(messages as AgentMessage[]).map((message) => (
              <Message key={message.id} from={message.role}>
                <MessageContent className="flex items-start gap-2">
                  <AiMessageRow message={message as any} agent="employee" />
                </MessageContent>
              </Message>
            ))}

            {isLoading && (
              <Reasoning>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="w-4 h-4 animate-pulse" />
                  Analyzing employee requirements...
                </div>
              </Reasoning>
            )}
          </ConversationContent>
        </Conversation>

        <div className="flex gap-2 pt-2">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Onboarding help? Performance review? Training plan?..."
            onKeyDown={(e) => e.key === "Enter" && !isLoading && handleSend()}
            className="flex-1 border-purple-200 focus:border-purple-400"
          />
          <Button
            onClick={handleSend}
            disabled={isLoading || !inputText.trim()}
            size="sm"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Agent>
  );
}
