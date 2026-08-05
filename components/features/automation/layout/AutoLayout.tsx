"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Layout, LayoutTemplate, Grid, AlignJustify, AlignHorizontalJustifyCenter } from "lucide-react";
import {
  applyLayout,
  applyHierarchicalLayout,
  applyForceLayout,
  centerNodes,
  distributeNodesVertically,
  distributeNodesHorizontally,
  type LayoutOptions,
} from "./LayoutEngine";
import { useWorkflowStore } from "@/lib/zustand/workflow-store";
import { useToast } from "@/components/ui/use-toast";

interface AutoLayoutProps {
  onLayoutApplied?: () => void;
}

export function AutoLayout({ onLayoutApplied }: AutoLayoutProps) {
  const { toast } = useToast();
  const [isApplying, setIsApplying] = useState(false);

  const applyAutoLayout = useCallback(
    (
      layoutFn: (
        nodes: Parameters<typeof applyLayout>[0],
        edges: Parameters<typeof applyLayout>[1],
        options?: LayoutOptions
      ) => ReturnType<typeof applyLayout>,
      options?: LayoutOptions
    ) => {
      setIsApplying(true);
      const state = useWorkflowStore.getState();
      const { nodes, edges } = state;

      if (!nodes.length) {
        toast({ title: "No nodes to layout" });
        setIsApplying(false);
        return;
      }

      try {
        const result = layoutFn(nodes as any, edges as any, options);
        useWorkflowStore.setState({
          nodes: result.nodes as any,
          isDirty: true,
        });
        state.pushHistory();
        toast({ title: "Layout applied" });
        onLayoutApplied?.();
      } catch (error) {
        toast({
          title: "Layout failed",
          description: String(error),
          variant: "destructive",
        });
      } finally {
        setIsApplying(false);
      }
    },
    [toast, onLayoutApplied]
  );

  const handleCenter = useCallback(() => {
    const state = useWorkflowStore.getState();
    const nodes = state.nodes;
    if (!nodes.length) {
      toast({ title: "No nodes to center" });
      return;
    }
    const centered = centerNodes(nodes as any, 2000, 1500);
    useWorkflowStore.setState({
      nodes: centered as any,
      isDirty: true,
    });
    state.pushHistory();
    toast({ title: "Centered" });
  }, [toast]);

  const handleDistributeVertically = useCallback(() => {
    const state = useWorkflowStore.getState();
    const nodes = state.nodes;
    if (nodes.length < 2) {
      toast({ title: "Need at least 2 nodes" });
      return;
    }
    const distributed = distributeNodesVertically(nodes as any, 80);
    useWorkflowStore.setState({
      nodes: distributed as any,
      isDirty: true,
    });
    state.pushHistory();
    toast({ title: "Distributed vertically" });
  }, [toast]);

  const handleDistributeHorizontally = useCallback(() => {
    const state = useWorkflowStore.getState();
    const nodes = state.nodes;
    if (nodes.length < 2) {
      toast({ title: "Need at least 2 nodes" });
      return;
    }
    const distributed = distributeNodesHorizontally(nodes as any, 80);
    useWorkflowStore.setState({
      nodes: distributed as any,
      isDirty: true,
    });
    state.pushHistory();
    toast({ title: "Distributed horizontally" });
  }, [toast]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={isApplying}>
          <Layout className="h-4 w-4 mr-1" />
          Layout
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Auto Layout</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => applyAutoLayout(applyLayout)}>
          <LayoutTemplate className="h-4 w-4 mr-2" />
          Default (LR)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => applyAutoLayout(applyHierarchicalLayout)}>
          <AlignJustify className="h-4 w-4 mr-2" />
          Hierarchical (TB)
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            applyAutoLayout(applyForceLayout, {
              nodeSpacing: 100,
              rankSpacing: 120,
            })
          }
        >
          <Layout className="h-4 w-4 mr-2" />
          Force-like
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Arrange</DropdownMenuLabel>
        <DropdownMenuItem onClick={handleCenter}>
          <AlignHorizontalJustifyCenter className="h-4 w-4 mr-2" />
          Center
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDistributeVertically}>
          <Grid className="h-4 w-4 mr-2" />
          Distribute Vertical
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDistributeHorizontally}>
          <Grid className="h-4 w-4 mr-2" />
          Distribute Horizontal
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

