"use client";

import { useState, useEffect, useCallback } from "react";
import { Node, Edge } from "@xyflow/react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PropertyEditor } from "./PropertyEditor";
import { useProperties } from "./useProperties";
import { cn } from "@/lib/utils";
import { MousePointerClick, Keyboard, MousePointer2, Workflow } from "lucide-react";

interface PropertiesPanelProps {
  selectedNode: Node | null;
  selectedEdge: Edge | null;
  onUpdateNode: (id: string, data: unknown) => void;
  onUpdateEdge: (id: string, data: unknown) => void;
  className?: string;
}

export function PropertiesPanel({
  selectedNode,
  selectedEdge,
  onUpdateNode,
  onUpdateEdge,
  className,
}: PropertiesPanelProps) {
  const [activeTab, setActiveTab] = useState<"node" | "edge">("node");

  useEffect(() => {
    if (selectedNode) setActiveTab("node");
    else if (selectedEdge) setActiveTab("edge");
  }, [selectedNode, selectedEdge]);

  const hasSelection = selectedNode !== null || selectedEdge !== null;

  return (
    <div className={cn("flex flex-col h-full border-l bg-background", className)}>
      <div className="p-3 border-b">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Properties</h3>
          {hasSelection && (
            <Badge variant="secondary" className="text-xs">
              {selectedNode ? "Node" : "Edge"}
            </Badge>
          )}
        </div>
      </div>

      {!hasSelection && (
        <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
          Select a node or edge to edit properties
        </div>
      )}

      {hasSelection && (
        <>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "node" | "edge")} className="flex-1 flex flex-col">
            <TabsList className="grid grid-cols-2 mx-3 mt-2">
              <TabsTrigger value="node" disabled={!selectedNode}>
                Node
              </TabsTrigger>
              <TabsTrigger value="edge" disabled={!selectedEdge}>
                Edge
              </TabsTrigger>
            </TabsList>

            <TabsContent value="node" className="flex-1 mt-0">
              <ScrollArea className="h-full">
                <div className="p-3">
                  {selectedNode && (
                    <PropertyEditor
                      element={selectedNode}
                      type="node"
                      onUpdate={(data) => onUpdateNode(selectedNode.id, data)}
                    />
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="edge" className="flex-1 mt-0">
              <ScrollArea className="h-full">
                <div className="p-3">
                  {selectedEdge && (
                    <PropertyEditor
                      element={selectedEdge}
                      type="edge"
                      onUpdate={(data) => onUpdateEdge(selectedEdge.id, data)}
                    />
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
