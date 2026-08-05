"use client";

import { useState } from "react";
import {
  Artifact,
  ArtifactHeader,
  ArtifactTitle,
  ArtifactDescription,
  ArtifactContent,
  ArtifactActions,
  ArtifactAction,
  ArtifactClose,
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
  ConversationTypingIndicator,
  Suggestion,
  Suggestions,
  Sources,
  SourcesTrigger,
  SourcesContent,
  Source,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash2, Pencil, Check, X, GitBranch } from "lucide-react";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------
type SIPOCCategory = "suppliers" | "inputs" | "process" | "outputs" | "customers";

interface SIPOCItem {
  id: string;
  category: SIPOCCategory;
  value: string;
}

interface SIPOCData {
  suppliers: string[];
  inputs: string[];
  process: string[];
  outputs: string[];
  customers: string[];
}

// -----------------------------------------------------------------------------
// Initial Data
// -----------------------------------------------------------------------------
const initialSIPOC: SIPOCData = {
  suppliers: ["Raw Material Vendor A", "Component Supplier B"],
  inputs: ["Steel coils", "Fasteners", "Work order"],
  process: [
    "Receive materials",
    "Load press",
    "Form part",
    "Inspect",
    "Package",
  ],
  outputs: ["Formed parts", "Scrap", "Inspection reports"],
  customers: ["Assembly Line", "Warehouse", "End customer"],
};

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------
export default function ProcessMap() {
  const [sipoc, setSipoc] = useState<SIPOCData>(initialSIPOC);
  const [editingCategory, setEditingCategory] = useState<SIPOCCategory | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [newItemCategory, setNewItemCategory] = useState<SIPOCCategory | null>(null);
  const [newItemValue, setNewItemValue] = useState("");

  // Conversation state
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    {
      role: "assistant",
      content:
        "I can help you map your process using SIPOC. Ask me for suggestions or to add/remove steps.",
    },
  ]);
  const [isThinking, setIsThinking] = useState(false);

  // ---------------------------------------------------------------------------
  // SIPOC Handlers
  // ---------------------------------------------------------------------------
  const getCategoryItems = (category: SIPOCCategory): string[] => {
    return sipoc[category] || [];
  };

  const updateCategory = (category: SIPOCCategory, items: string[]) => {
    setSipoc((prev) => ({ ...prev, [category]: items }));
  };

  const startEditing = (category: SIPOCCategory, index: number) => {
    setEditingCategory(category);
    setEditingIndex(index);
    setEditingValue(getCategoryItems(category)[index]);
  };

  const saveEdit = () => {
    if (editingCategory === null || editingIndex === null) return;
    const items = getCategoryItems(editingCategory);
    const newItems = [...items];
    newItems[editingIndex] = editingValue;
    updateCategory(editingCategory, newItems);
    setEditingCategory(null);
    setEditingIndex(null);
  };

  const cancelEdit = () => {
    setEditingCategory(null);
    setEditingIndex(null);
  };

  const addItemToCategory = (category: SIPOCCategory) => {
    if (!newItemValue.trim()) return;
    const items = getCategoryItems(category);
    updateCategory(category, [...items, newItemValue.trim()]);
    setNewItemValue("");
    setNewItemCategory(null);
  };

  const removeItem = (category: SIPOCCategory, index: number) => {
    const items = getCategoryItems(category);
    const newItems = items.filter((_, i) => i !== index);
    updateCategory(category, newItems);
  };

  // ---------------------------------------------------------------------------
  // Conversation Handlers
  // ---------------------------------------------------------------------------
  const handleSend = (msg: string) => {
    const userMsg = { role: "user", content: msg };
    setMessages((prev) => [...prev, userMsg]);
    setIsThinking(true);

    // Simulate AI response
    setTimeout(() => {
      const lowerMsg = msg.toLowerCase();
      let response = "";
      if (lowerMsg.includes("supplier")) {
        response =
          "Consider adding 'Logistics provider' as a supplier to cover material handling.";
      } else if (lowerMsg.includes("input")) {
        response =
          "You might add 'Quality specifications' as an input to ensure clear requirements.";
      } else if (lowerMsg.includes("process") || lowerMsg.includes("step")) {
        response =
          "I suggest adding 'Final quality check' after packaging to catch any defects.";
      } else if (lowerMsg.includes("output")) {
        response =
          "Outputs could include 'rework parts' if you have a rework loop.";
      } else if (lowerMsg.includes("customer")) {
        response =
          "Don't forget internal customers like the next work cell after yours.";
      } else {
        response =
          "I can help you refine your SIPOC. Try asking about a specific category: suppliers, inputs, process, outputs, or customers.";
      }
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
      setIsThinking(false);
    }, 1000);
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  const categories: { key: SIPOCCategory; label: string }[] = [
    { key: "suppliers", label: "Suppliers" },
    { key: "inputs", label: "Inputs" },
    { key: "process", label: "Process" },
    { key: "outputs", label: "Outputs" },
    { key: "customers", label: "Customers" },
  ];

  return (
    <div className="space-y-4 p-4">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Process Map – SIPOC</h2>
        <p className="text-sm text-muted-foreground">
          Visualize process inputs, outputs, and stakeholders.
        </p>
      </div>

      {/* Artifact: SIPOC Table */}
      <Artifact>
        <ArtifactHeader>
          <div className="flex items-center gap-2">
            <GitBranch className="size-4 text-muted-foreground" />
            <ArtifactTitle>SIPOC Diagram</ArtifactTitle>
            <Badge variant="outline">
              {Object.values(sipoc).reduce((sum, arr) => sum + arr.length, 0)} items
            </Badge>
          </div>
          <ArtifactActions>
            <ArtifactAction tooltip="Add new item" label="Add" icon={Plus} />
            <ArtifactClose />
          </ArtifactActions>
        </ArtifactHeader>
        <ArtifactDescription className="px-4 pb-2 text-sm text-muted-foreground">
          Define Suppliers, Inputs, Process steps, Outputs, and Customers.
        </ArtifactDescription>
        <ArtifactContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Category</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map(({ key, label }) => {
                  const items = getCategoryItems(key);
                  return (
                    <TableRow key={key}>
                      <TableCell className="font-medium">{label}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap items-center gap-1">
                          {items.map((item, idx) => (
                            <div
                              key={idx}
                              className="group flex items-center gap-1 rounded-md border border-transparent px-2 py-1 text-sm hover:border-muted-foreground/20"
                            >
                              {editingCategory === key && editingIndex === idx ? (
                                <div className="flex items-center gap-1">
                                  <Input
                                    value={editingValue}
                                    onChange={(e) => setEditingValue(e.target.value)}
                                    className="h-6 w-32 text-sm"
                                    autoFocus
                                  />
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="size-6"
                                    onClick={saveEdit}
                                  >
                                    <Check className="size-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="size-6"
                                    onClick={cancelEdit}
                                  >
                                    <X className="size-3" />
                                  </Button>
                                </div>
                              ) : (
                                <>
                                  <span>{item}</span>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="size-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => startEditing(key, idx)}
                                  >
                                    <Pencil className="size-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="size-6 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                                    onClick={() => removeItem(key, idx)}
                                  >
                                    <Trash2 className="size-3" />
                                  </Button>
                                </>
                              )}
                            </div>
                          ))}
                          {/* Add new item input */}
                          {newItemCategory === key ? (
                            <div className="flex items-center gap-1">
                              <Input
                                value={newItemValue}
                                onChange={(e) => setNewItemValue(e.target.value)}
                                className="h-6 w-32 text-sm"
                                placeholder="Add..."
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") addItemToCategory(key);
                                  if (e.key === "Escape") {
                                    setNewItemCategory(null);
                                    setNewItemValue("");
                                  }
                                }}
                              />
                              <Button
                                size="sm"
                                variant="ghost"
                                className="size-6"
                                onClick={() => addItemToCategory(key)}
                              >
                                <Check className="size-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="size-6"
                                onClick={() => {
                                  setNewItemCategory(null);
                                  setNewItemValue("");
                                }}
                              >
                                <X className="size-3" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="size-6 text-muted-foreground hover:text-foreground"
                              onClick={() => {
                                setNewItemCategory(key);
                                setEditingCategory(null);
                                setEditingIndex(null);
                              }}
                            >
                              <Plus className="size-3" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          {items.length}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </ArtifactContent>
      </Artifact>

      {/* Conversation Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Process Assistant</CardTitle>
          <CardDescription>Ask for suggestions or modifications.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="max-h-60 overflow-y-auto border rounded-md p-2">
            <Conversation>
              <ConversationContent>
                {messages.length === 0 ? (
                  <ConversationEmptyState
                    title="Start the conversation"
                    description="Ask about your SIPOC or process improvements."
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
                      <ConversationTypingIndicator label="Assistant is thinking..." />
                    )}
                  </div>
                )}
              </ConversationContent>
              <ConversationScrollButton />
            </Conversation>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Ask about SIPOC..."
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

      {/* Suggestions */}
      <Suggestions>
        <Suggestion suggestion="Add 'Quality control' as a process step to ensure compliance." />
        <Suggestion suggestion="Consider 'Training records' as an input to standardize work." />
      </Suggestions>

      {/* Sources */}
      <Sources>
        <SourcesTrigger count={2} />
        <SourcesContent>
          <Source title="SIPOC Template" href="/dashboard/documents/templates" />
          <Source title="Process Mapping Guidelines" href="/dashboard/documents/repository" />
        </SourcesContent>
      </Sources>
    </div>
  );
}