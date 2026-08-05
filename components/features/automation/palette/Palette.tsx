"use client";

import { useState, useCallback, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { NodePaletteItem } from "./NodePaletteItem";
import { NodePaletteCategory, NodePaletteItem as PaletteItem, nodeCategories, getFilteredNodes } from "./paletteData";
import { useWorkflowStore } from "@/lib/zustand/workflow-store";
import { useToast } from "@/components/ui/use-toast";

interface PaletteProps {
  onAddNode?: (type: string, data: unknown, position?: { x: number; y: number }) => void;
}

export function Palette({ onAddNode }: PaletteProps) {
  const { toast } = useToast();
  const addNode = useWorkflowStore((s) => s.addNode);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const handleAddNode = useCallback((item: PaletteItem) => {
    const data = {
      label: item.label,
      description: item.description,
      ...item.defaultData,
    };
    if (onAddNode) {
      onAddNode(item.type, data);
    } else {
      addNode(item.type, data);
    }
    toast({ title: `Added "${item.label}"` });
  }, [addNode, onAddNode, toast]);

  const filteredNodes = useMemo(() => {
    if (search.trim()) {
      return getFilteredNodes(search);
    }
    if (activeCategory === "all") {
      return nodeCategories.flatMap(c => c.items);
    }
    const category = nodeCategories.find(c => c.id === activeCategory);
    return category ? category.items : [];
  }, [search, activeCategory]);

  const favorites = useMemo(() => {
    // Mock favorites – in production, would be stored in user preferences
    return nodeCategories.flatMap(c => c.items).filter(item => item.favorite);
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b">
        <Input
          placeholder="Search nodes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-8 text-sm"
        />
        {search && (
          <div className="mt-1 text-xs text-muted-foreground">
            {filteredNodes.length} results
          </div>
        )}
      </div>

      {!search && (
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="flex-1 flex flex-col">
          <TabsList className="justify-start px-3 py-1 h-auto flex-wrap gap-1 bg-transparent">
            <TabsTrigger value="all" className="text-xs data-[state=active]:bg-primary/10">All</TabsTrigger>
            {nodeCategories.map((cat) => (
              <TabsTrigger key={cat.id} value={cat.id} className="text-xs data-[state=active]:bg-primary/10">
                {cat.icon} {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeCategory} className="flex-1 mt-0">
            <ScrollArea className="h-full">
              <div className="p-2 space-y-2">
                {favorites.length > 0 && activeCategory === "all" && (
                  <div>
                    <div className="text-xs font-medium text-muted-foreground px-1 py-1">⭐ Favorites</div>
                    <div className="grid grid-cols-2 gap-1">
                      {favorites.map((item) => (
                        <NodePaletteItem key={item.id} item={item} onAdd={handleAddNode} />
                      ))}
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-1">
                  {filteredNodes.map((item) => (
                    <NodePaletteItem key={item.id} item={item} onAdd={handleAddNode} />
                  ))}
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      )}

      {search && (
        <ScrollArea className="flex-1">
          <div className="p-2 grid grid-cols-2 gap-1">
            {filteredNodes.map((item) => (
              <NodePaletteItem key={item.id} item={item} onAdd={handleAddNode} />
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
