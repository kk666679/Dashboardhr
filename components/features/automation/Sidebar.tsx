"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Palette } from "./palette/Palette";
import { Favorites } from "./palette/Favorites";
import { SavedNodes } from "./palette/SavedNodes";
import { useFlowOperations } from "../../../hooks/useFlowOperations";
import { Trash2, MoreVertical } from "lucide-react";

interface SidebarProps {
  onAddNode: (type: string, data: unknown, position?: { x: number; y: number }) => void;
  selectedNode?: any;
  onUpdateNode?: (id: string, data: unknown) => void;
  onDeleteNode?: (id: string) => void;
}

export function Sidebar({ onAddNode, selectedNode, onUpdateNode, onDeleteNode }: SidebarProps) {
  const { nodes } = useFlowOperations();

  return (
    <div className="w-80 h-full border-r bg-background flex flex-col">
      <div className="p-3 border-b flex justify-between items-center">
        <h2 className="text-sm font-semibold">Node Palette</h2>
        <span className="text-xs text-muted-foreground">{nodes.length} nodes</span>
      </div>

      <Tabs defaultValue="palette" className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-3 mx-3 mt-2">
          <TabsTrigger value="palette" className="text-xs">All</TabsTrigger>
          <TabsTrigger value="favorites" className="text-xs">⭐</TabsTrigger>
          <TabsTrigger value="saved" className="text-xs">📦</TabsTrigger>
        </TabsList>

        <TabsContent value="palette" className="flex-1 mt-0">
          <Palette onAddNode={onAddNode} />
        </TabsContent>

        <TabsContent value="favorites" className="flex-1 mt-0">
          <ScrollArea className="h-full p-3">
            <Favorites onAdd={(item) => onAddNode(item.type, item.defaultData || {})} />
          </ScrollArea>
        </TabsContent>

        <TabsContent value="saved" className="flex-1 mt-0">
          <ScrollArea className="h-full p-3">
            <SavedNodes onAddNode={onAddNode} />
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {selectedNode && (
        <div className="p-3 border-t bg-muted/20">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xs font-medium">Selected Node</h3>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => onDeleteNode?.(selectedNode.id)}>
                <Trash2 className="h-3 w-3 text-destructive" />
              </Button>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreVertical className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <div className="space-y-1">
            <div>
              <label className="text-[10px] text-muted-foreground">Label</label>
              <input
                type="text"
                value={selectedNode.data?.label || ""}
                onChange={(e) => {
                  onUpdateNode?.(selectedNode.id, { label: e.target.value });
                }}
                className="w-full text-sm bg-transparent border rounded px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground">Description</label>
              <input
                type="text"
                value={selectedNode.data?.description || ""}
                onChange={(e) => {
                  onUpdateNode?.(selectedNode.id, { description: e.target.value });
                }}
                className="w-full text-sm bg-transparent border rounded px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
