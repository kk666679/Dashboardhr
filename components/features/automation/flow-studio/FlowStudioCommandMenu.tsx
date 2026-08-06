"use client";

import { useEffect, useState } from "react";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { useWorkflowStore } from "@/lib/zustand/workflow-store";
import { useToast } from "@/components/ui/use-toast";
import {
  Save,
  Download,
  Upload,
  Undo2,
  Redo2,
  Sparkles,
  Play,
  Layout,
  Grid3x3,
  Plus,
  Trash2,
  History,
  Search,
  Magnet,
} from "lucide-react";

interface FlowStudioCommandMenuProps {
  endpoint?: string;
}

/**
 * Spotlight-style command launcher (Cmd+K / "/").
 * Touch-optimized actions for the mobile FAB + keyboard for desktop.
 */
export function FlowStudioCommandMenu({ endpoint }: FlowStudioCommandMenuProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  // Cmd+K / Ctrl+K opens the command menu
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const target = e.target as HTMLElement;
        const isTyping = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;
        if (!isTyping) {
          e.preventDefault();
          setOpen(true);
        }
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const store = useWorkflowStore.getState;

  const run = (fn: () => void, title: string) => {
    setOpen(false);
    fn();
    toast({ title });
  };

  const runSave = () => run(() => store().saveFlow(), "Flow saved");
  const runUndo = () => run(() => store().undo(), "Undo");
  const runRedo = () => run(() => store().redo(), "Redo");
  const runExport = () => run(() => store().exportFlow(), "Flow exported");
  const runImport = () => {
    setOpen(false);
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = () => {
      if (input.files?.[0]) store().importFlow(input.files[0]);
    };
    input.click();
  };
  const runClear = () => run(() => store().clearFlow(), "Canvas cleared");
  const runExecute = () => run(() => store().startExecution(), "Execution started");
  const runGrid = () => run(() => store().toggleGrid(), "Grid toggled");
  const runSnap = () => run(() => store().toggleSnap(), "Snap toggled");
  const runLayout = () => run(() => {
    const state = store();
    if (state.nodes.length === 0) return;
    // Simple default layout: stagger nodes
    const nodes = state.nodes.map((n, i) => ({ ...n, position: { x: 80 + (i % 3) * 220, y: 80 + Math.floor(i / 3) * 160 } }));
    useWorkflowStore.setState({ nodes: nodes as any, isDirty: true });
    state.pushHistory();
  }, "Layout applied");

  const addQuickNode = (type: string, label: string) => {
    setOpen(false);
    store().addNode(type, { label });
    toast({ title: `Added ${label}` });
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="File">
          <CommandItem onSelect={runSave}>
            <Save className="mr-2 h-4 w-4" /> Save
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={runExport}>
            <Download className="mr-2 h-4 w-4" /> Export JSON
          </CommandItem>
          <CommandItem onSelect={runImport}>
            <Upload className="mr-2 h-4 w-4" /> Import JSON
          </CommandItem>
          <CommandItem onSelect={runClear}>
            <Trash2 className="mr-2 h-4 w-4" /> Clear Canvas
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Edit">
          <CommandItem onSelect={runUndo}>
            <Undo2 className="mr-2 h-4 w-4" /> Undo
            <CommandShortcut>⌘Z</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={runRedo}>
            <Redo2 className="mr-2 h-4 w-4" /> Redo
            <CommandShortcut>⌘⇧Z</CommandShortcut>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Canvas">
          <CommandItem onSelect={runGrid}>
            <Grid3x3 className="mr-2 h-4 w-4" /> Toggle Grid
          </CommandItem>
          <CommandItem onSelect={runSnap}>
            <Magnet className="mr-2 h-4 w-4" /> Toggle Snap
          </CommandItem>
          <CommandItem onSelect={runLayout}>
            <Layout className="mr-2 h-4 w-4" /> Auto Layout
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Add Node">
          <CommandItem onSelect={() => addQuickNode("start", "Start")}>
            <Plus className="mr-2 h-4 w-4" /> Start
          </CommandItem>
          <CommandItem onSelect={() => addQuickNode("approval", "Approval")}>
            <Plus className="mr-2 h-4 w-4" /> Approval
          </CommandItem>
          <CommandItem onSelect={() => addQuickNode("email", "Send Email")}>
            <Plus className="mr-2 h-4 w-4" /> Email
          </CommandItem>
          <CommandItem onSelect={() => addQuickNode("action", "AI Action")}>
            <Sparkles className="mr-2 h-4 w-4" /> AI Action
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Run">
          <CommandItem onSelect={runExecute}>
            <Play className="mr-2 h-4 w-4" /> Execute Workflow
            <CommandShortcut>⌘↵</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => setOpen(false)}>
            <History className="mr-2 h-4 w-4" /> Version History
            <CommandShortcut>⌘H</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
