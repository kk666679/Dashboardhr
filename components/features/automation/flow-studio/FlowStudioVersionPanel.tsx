"use client";

import { useEffect, useState } from "react";
import { useWorkflowStore } from "@/lib/zustand/workflow-store";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import {
  History,
  Clock,
  RotateCcw,
  GitCompare,
  User,
  Save,
  X,
} from "lucide-react";

interface VersionEntry {
  id: string;
  name: string;
  author: string;
  timestamp: string;
  nodes: number;
  edges: number;
  raw: { nodes: unknown[]; edges: unknown[] };
}

interface FlowStudioVersionPanelProps {
  onClose?: () => void;
  className?: string;
}

/**
 * Version Control UI — timeline of saved versions.
 *
 * Connects to:
 *  - saveFlow()  → persists a new version
 *  - loadFlow()  → restores a selected version
 *
 * Features:
 *  - Version timeline with timestamps + authors
 *  - Restore button per version
 *  - Compare versions (diff summary)
 */
export function FlowStudioVersionPanel({ onClose, className }: FlowStudioVersionPanelProps) {
  const { toast } = useToast();
  const saveFlow = useWorkflowStore((s) => s.saveFlow);
  const loadFlow = useWorkflowStore((s) => s.loadFlow);
  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);
  const currentId = useWorkflowStore((s) => s.currentId);

  const [versions, setVersions] = useState<VersionEntry[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [compareId, setCompareId] = useState<string | null>(null);

  // Load versions from localStorage
  useEffect(() => {
    refreshVersions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentId]);

  const refreshVersions = () => {
    try {
      const list = JSON.parse(localStorage.getItem("flow-list") || "[]") as { id: string; name: string }[];
      const entries: VersionEntry[] = [];
      list.forEach((item) => {
        const raw = localStorage.getItem(item.id);
        if (!raw) return;
        try {
          const data = JSON.parse(raw);
          entries.push({
            id: item.id,
            name: data.name ?? item.name,
            author: data.author ?? "Current User",
            timestamp: data.savedAt ?? new Date().toISOString(),
            nodes: data.nodes?.length ?? 0,
            edges: data.edges?.length ?? 0,
            raw: { nodes: data.nodes ?? [], edges: data.edges ?? [] },
          });
        } catch {}
      });
      setVersions(entries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    } catch {
      setVersions([]);
    }
  };

  const handleSaveVersion = () => {
    const id = saveFlow();
    setSelectedId(id);
    refreshVersions();
    toast({ title: "Version saved", description: id });
  };

  const handleRestore = (v: VersionEntry) => {
    const ok = loadFlow(v.id);
    if (ok) {
      setSelectedId(v.id);
      toast({ title: "Version restored", description: v.name });
    }
  };

  const handleCompare = (v: VersionEntry) => {
    if (!compareId) {
      setCompareId(v.id);
      return;
    }
    if (compareId === v.id) {
      setCompareId(null);
      return;
    }
    const base = versions.find((x) => x.id === compareId);
    setCompareId(null);
    if (base) {
      const diffNodes = Math.abs(base.nodes - v.nodes);
      const diffEdges = Math.abs(base.edges - v.edges);
      toast({
        title: "Version comparison",
        description: `${base.name} vs ${v.name}: ${diffNodes} node(s) and ${diffEdges} edge(s) differ.`,
      });
    }
  };

  return (
    <div className={cn("flex flex-col h-full bg-background/95 backdrop-blur-md border rounded-xl shadow-lg", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-orange-500" />
          <span className="text-sm font-semibold">Version History</span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={handleSaveVersion}>
            <Save className="h-3.5 w-3.5" /> Save Version
          </Button>
          {onClose && (
            <Button variant="ghost" size="icon-sm" onClick={onClose} title="Close">
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>

      {/* Current state */}
      <div className="p-3 border-b bg-muted/40">
        <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1">Current Canvas</div>
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium">{nodes.length} nodes · {edges.length} edges</span>
          {currentId && <Badge variant="outline" className="text-[9px]">{currentId}</Badge>}
        </div>
      </div>

      {/* Timeline */}
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-2">
          {versions.length === 0 && (
            <div className="text-center py-8 space-y-2">
              <History className="h-8 w-8 mx-auto text-muted-foreground/40" />
              <p className="text-xs text-muted-foreground">No versions yet.<br />Save a version to start tracking.</p>
            </div>
          )}
          {versions.map((v, idx) => {
            const isSelected = v.id === selectedId;
            const isComparing = v.id === compareId;
            return (
              <div
                key={v.id}
                className={cn(
                  "relative rounded-lg border p-2.5 transition-all cursor-pointer",
                  isSelected ? "border-primary bg-primary/5" : "hover:bg-muted/40",
                  isComparing && "border-blue-400 bg-blue-50/50 dark:bg-blue-950/20"
                )}
                onClick={() => setSelectedId(v.id)}
              >
                {/* Timeline connector */}
                {idx < versions.length - 1 && (
                  <span className="absolute left-3 top-6 bottom-[-8px] w-px bg-border" />
                )}
                <div className="flex items-start gap-2.5">
                  <span className={cn("mt-0.5 h-2.5 w-2.5 rounded-full shrink-0", isSelected ? "bg-primary" : "bg-muted-foreground/40")} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-medium truncate">{v.name}</span>
                      <Badge variant="secondary" className="text-[9px] shrink-0">v{versions.length - idx}</Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{formatTime(v.timestamp)}</span>
                      <span className="flex items-center gap-1"><User className="h-3 w-3" />{v.author}</span>
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">
                      {v.nodes} nodes · {v.edges} edges
                    </div>
                  </div>
                </div>
                <div className="flex gap-1.5 mt-2 pl-5">
                  <Button size="xs" variant="outline" className="gap-1" onClick={(e) => { e.stopPropagation(); handleRestore(v); }}>
                    <RotateCcw className="h-3 w-3" /> Restore
                  </Button>
                  <Button size="xs" variant="ghost" className={cn("gap-1", isComparing && "bg-blue-100 dark:bg-blue-900/40")} onClick={(e) => { e.stopPropagation(); handleCompare(v); }}>
                    <GitCompare className="h-3 w-3" /> {isComparing ? "Cancel" : "Compare"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}

function formatTime(iso: string) {
  try {
    const d = new Date(iso);
    const diff = Date.now() - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins} min${mins === 1 ? "" : "s"} ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
    return d.toLocaleDateString();
  } catch {
    return iso;
  }
}
