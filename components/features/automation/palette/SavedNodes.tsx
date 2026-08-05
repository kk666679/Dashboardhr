"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useFlowOperations } from "../../../../hooks/useFlowOperations";
import { useToast } from "@/components/ui/use-toast";

interface SavedNodeTemplate {
  id: string;
  name: string;
  type: string;
  data: unknown;
  createdAt: string;
}

export function SavedNodes({ onAddNode }: { onAddNode?: (type: string, data: unknown) => void }) {
  const { toast } = useToast();
  const { nodes, edges } = useFlowOperations();
  const [templates, setTemplates] = useState<SavedNodeTemplate[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("node-templates");
    if (saved) {
      try {
        setTemplates(JSON.parse(saved));
      } catch (e) {
        setTemplates([]);
      }
    }
  }, []);

  const saveTemplate = () => {
    if (!selectedNodeId || !templateName.trim()) {
      toast({ title: "Please select a node and enter a name" });
      return;
    }
    const node = nodes.find((n: { id: string }) => n.id === selectedNodeId);
    if (!node) return;

    const newTemplate: SavedNodeTemplate = {
      id: Date.now().toString(),
      name: templateName.trim(),
      type: node.type || "custom",
      data: {
        label: node.data?.label,
        description: node.data?.description,
        ...node.data,
      },
      createdAt: new Date().toISOString(),
    };

    const updated = [...templates, newTemplate];
    setTemplates(updated);
    localStorage.setItem("node-templates", JSON.stringify(updated));
    setDialogOpen(false);
    setTemplateName("");
    setSelectedNodeId(null);
    toast({ title: "Template saved" });
  };

  const loadTemplate = (template: SavedNodeTemplate) => {
    if (onAddNode) {
      onAddNode(template.type, template.data);
    }
    toast({ title: `Added "${template.name}"` });
  };

  const deleteTemplate = (id: string) => {
    const updated = templates.filter((t) => t.id !== id);
    setTemplates(updated);
    localStorage.setItem("node-templates", JSON.stringify(updated));
    toast({ title: "Template deleted" });
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="text-xs font-medium text-muted-foreground">Saved Templates</div>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-xs"
          onClick={() => setDialogOpen(true)}
          disabled={nodes.length === 0}
        >
          + Save
        </Button>
      </div>
      {templates.length === 0 ? (
        <div className="text-center text-sm text-muted-foreground p-2">
          No saved templates. Select a node and click "Save".
        </div>
      ) : (
        <div className="space-y-1">
          {templates.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between p-1 rounded hover:bg-muted/50 cursor-pointer"
              onClick={() => loadTemplate(t)}
            >
              <div className="flex-1 min-w-0">
                <div className="text-sm truncate">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.type}</div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteTemplate(t.id);
                }}
              >
                <span className="text-destructive">×</span>
              </Button>
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Node Template</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium">Template Name</label>
              <Input
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="My custom node"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Select Node</label>
              <div className="max-h-32 overflow-y-auto border rounded p-1 space-y-1">
                {nodes.map((n: { id: string; type?: string; data?: any }) => (
                  <div
                    key={n.id}
                    className={`p-1 rounded cursor-pointer hover:bg-muted ${
                      selectedNodeId === n.id ? "bg-primary/10" : ""
                    }`}
                    onClick={() => setSelectedNodeId(n.id)}
                  >
                    <span className="text-sm">{n.data?.label || n.id}</span>
                    <span className="text-xs text-muted-foreground ml-2">({n.type})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveTemplate}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
