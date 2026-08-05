"use client";

import { useState } from "react";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
  ConversationTypingIndicator,
  Suggestion,
  Suggestions,
  Artifact,
  ArtifactHeader,
  ArtifactTitle,
  ArtifactDescription,
  ArtifactContent,
  ArtifactActions,
  ArtifactAction,
  ArtifactClose,
} from "../../ai-elements";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Lightbulb } from "lucide-react";

// -----------------------------------------------------------------------------
// Mock Data
// -----------------------------------------------------------------------------
const initialMessages = [
  {
    role: "assistant",
    content:
      "Welcome to the Solution Brainstorming session. I can help generate ideas for your problem. Share your challenge, and I'll suggest potential solutions.",
  },
];

const initialSuggestions = [
  "Implement mistake‑proofing (poka‑yoke)",
  "Standardize work procedures",
  "Add visual controls",
  "Redesign workflow for better flow",
];

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------
export default function SolutionBrainstorm() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    initialMessages
  );
  const [ideas, setIdeas] = useState<string[]>([
    "Install sensors to detect misalignment",
    "Create one‑page standard work sheets",
    "Add color‑coded tool shadows",
  ]);
  const [isThinking, setIsThinking] = useState(false);
  const [newIdea, setNewIdea] = useState("");

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------
  const handleSend = (msg: string) => {
    const userMsg = { role: "user", content: msg };
    setMessages((prev) => [...prev, userMsg]);
    setIsThinking(true);

    // Simulate AI response
    setTimeout(() => {
      // Pick a random suggestion from the list or generate a new one
      const possibleResponses = [
        "I'd suggest implementing a mistake‑proofing device at the critical step.",
        "Consider standardizing the setup procedure to reduce variation.",
        "Visual controls like shadow boards can help ensure tools are returned.",
        "You might try reducing changeover time using SMED principles.",
        "A simple checklist could prevent missed steps.",
        "Have you considered using a go/no‑go gauge for quality checks?",
      ];
      const response =
        possibleResponses[Math.floor(Math.random() * possibleResponses.length)];
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response },
      ]);
      setIsThinking(false);
    }, 1200);
  };

  const addIdea = (idea: string) => {
    if (idea.trim()) {
      setIdeas((prev) => [...prev, idea.trim()]);
    }
  };

  const removeIdea = (index: number) => {
    setIdeas((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSuggestionClick = (suggestion: string) => {
    // Add suggestion as a new idea
    addIdea(suggestion);
    // Also send a message to the conversation
    const userMsg = {
      role: "user",
      content: `Add idea: "${suggestion}"`,
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsThinking(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Great idea! I've added "${suggestion}" to the list.`,
        },
      ]);
      setIsThinking(false);
    }, 600);
  };

  return (
    <div className="space-y-4 p-4">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Solution Brainstorming</h2>
        <p className="text-sm text-muted-foreground">
          Collaborate with AI to generate and refine improvement ideas.
        </p>
      </div>

      {/* Main content: Conversation + Artifact */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Conversation Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">AI Brainstorm Assistant</CardTitle>
            <CardDescription>
              Describe your challenge, and the AI will suggest solutions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="max-h-80 overflow-y-auto border rounded-md p-2">
              <Conversation>
                <ConversationContent>
                  {messages.length === 0 ? (
                    <ConversationEmptyState
                      title="Start the conversation"
                      description="Describe the problem you want to solve."
                    />
                  ) : (
                    <div className="space-y-3">
                      {messages.map((msg, idx) => (
                        <div
                          key={idx}
                          className={`flex ${
                            msg.role === "user" ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                              msg.role === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            {msg.content}
                          </div>
                        </div>
                      ))}
                      {isThinking && (
                        <ConversationTypingIndicator label="AI is thinking..." />
                      )}
                    </div>
                  )}
                </ConversationContent>
                <ConversationScrollButton />
              </Conversation>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Share your problem or ask for ideas..."
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.currentTarget.value.trim()) {
                    handleSend(e.currentTarget.value);
                    e.currentTarget.value = "";
                  }
                }}
              />
              <Button
                size="sm"
                onClick={(e) => {
                  const input = (e.target as HTMLElement)
                    .previousElementSibling as HTMLInputElement;
                  if (input?.value.trim()) {
                    handleSend(input.value);
                    input.value = "";
                  }
                }}
              >
                Send
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Artifact: Ideas List */}
        <Artifact>
          <ArtifactHeader>
            <div className="flex items-center gap-2">
              <Lightbulb className="size-4 text-muted-foreground" />
              <ArtifactTitle>Brainstormed Ideas</ArtifactTitle>
              <Badge variant="outline">{ideas.length} ideas</Badge>
            </div>
            <ArtifactActions>
              <ArtifactAction tooltip="Add idea" label="Add" icon={Plus} />
              <ArtifactClose />
            </ArtifactActions>
          </ArtifactHeader>
          <ArtifactDescription className="px-4 pb-2 text-sm text-muted-foreground">
            Click a suggestion to add it, or type a new idea below.
          </ArtifactDescription>
          <ArtifactContent>
            <div className="space-y-3">
              {/* Add new idea form */}
              <div className="flex gap-2">
                <Input
                  placeholder="Add your own idea..."
                  value={newIdea}
                  onChange={(e) => setNewIdea(e.target.value)}
                  className="flex-1 text-sm"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newIdea.trim()) {
                      addIdea(newIdea);
                      setNewIdea("");
                    }
                  }}
                />
                <Button
                  size="sm"
                  onClick={() => {
                    if (newIdea.trim()) {
                      addIdea(newIdea);
                      setNewIdea("");
                    }
                  }}
                >
                  Add
                </Button>
              </div>

              {/* Ideas list */}
              <div className="space-y-1">
                {ideas.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No ideas yet.</p>
                ) : (
                  ideas.map((idea, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 rounded-md border p-2 text-sm group"
                    >
                      <span className="flex-1">{idea}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="size-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeIdea(idx)}
                      >
                        <Trash2 className="size-3" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </ArtifactContent>
        </Artifact>
      </div>

      {/* Suggestions (AI‑generated) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Suggested Ideas</CardTitle>
          <CardDescription>Click any to add it to your list.</CardDescription>
        </CardHeader>
        <CardContent>
          <Suggestions>
            {initialSuggestions.map((suggestion, idx) => (
              <Suggestion
                key={idx}
                suggestion={suggestion}
                variant="outline"
                className="text-xs"
                onClick={handleSuggestionClick}
              />
            ))}
          </Suggestions>
        </CardContent>
      </Card>
    </div>
  );
}