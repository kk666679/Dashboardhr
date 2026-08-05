"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Search, Send } from "lucide-react";
import { useRecruitmentAgent } from "@/hooks/useRecruitment";

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

export function AIRecruitmentAgent() {
  const [inputText, setInputText] = useState("");
  const recruitmentAgent = useRecruitmentAgent();
  const { messages, sendMessage, isLoading: statusLoading } = recruitmentAgent;

  const { toast } = useToast();

  const isLoading = statusLoading;

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text) return;
    setInputText("");
    await sendMessage(text);
    toast({
      title: "Sent to Recruitment Agent",
      description: "Analyzing recruitment requirements...",
    });
  };

  const handlePromptSelect = (prompt: string) => {
    setInputText(prompt);
  };

  const handleScreen = () => {
    recruitmentAgent.screenCandidates('Construction Supervisor');
  };


  return (
    <Agent className="border-blue-200 bg-gradient-to-br from-blue-50/50 to-cyan-50/50">
      <AgentHeader name="Recruitment Agent" model="Talent Acquisition">
        <Badge className="bg-blue-500 hover:bg-blue-600 text-white">
          JDs • Screening • Offers
        </Badge>
      </AgentHeader>

      <div className="p-4 space-y-4">
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-900 font-medium mb-1">Live:</p>
          <p className="text-xs text-blue-800">Pipeline: {recruitmentAgent.candidates.data?.length || 0}</p>
        </div>


        <Conversation className="h-80 border rounded-lg bg-white">
          <ConversationContent>
            {messages.length === 0 && (
              <ConversationEmptyState
                title="Ready for Recruitment Support"
                description="Get help with job descriptions, candidate screening, visa eligibility, and offer letters"
                icon={<Users className="h-8 w-8 text-blue-600" />}
              >
                <div className="flex flex-wrap gap-2 mt-4">
                  <Badge
                    variant="secondary"
                    className="cursor-pointer hover:bg-blue-100"
                    onClick={() =>
                      handlePromptSelect(
                        "Create job description for construction supervisor",
                      )
                    }
                  >
                    Job Description
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="cursor-pointer hover:bg-blue-100"
                    onClick={() =>
                      handlePromptSelect(
                        "Check visa eligibility for Bangladeshi engineer",
                      )
                    }
                  >
                    Visa Check
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="cursor-pointer hover:bg-blue-100"
                    onClick={() =>
                      handlePromptSelect(
                        "Screen candidates for technical skills",
                      )
                    }
                  >
                    Candidate Screening
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="cursor-pointer hover:bg-blue-100"
                    onClick={() =>
                      handlePromptSelect("Prepare employment offer letter")
                    }
                  >
                    Offer Letter
                  </Badge>
                  <Badge variant="secondary" className="cursor-pointer hover:bg-cyan-100" onClick={handleScreen}>
                    Screen Candidates (Hook)
                  </Badge>
                </div>

              </ConversationEmptyState>
            )}

            {messages.map((message) => (
              <Message key={message.id} from={message.role}>
                <MessageContent className="flex items-start gap-2">
                  <AiMessageRow message={message} agent="recruitment" />
                </MessageContent>
              </Message>
            ))}

            {isLoading && (
              <Reasoning>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Search className="w-4 h-4 animate-pulse" />
                  Analyzing recruitment requirements...
                </div>
              </Reasoning>
            )}
          </ConversationContent>
        </Conversation>

        <div className="flex gap-2 pt-2">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Create JD? Check visa eligibility? Screen candidates?..."
            onKeyDown={(e) => e.key === "Enter" && !isLoading && handleSend()}
            className="flex-1 border-blue-200 focus:border-blue-400"
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
