"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { LibraryItem } from "./LibraryItem";
import { LibraryCategory, LibraryItem as LibraryItemType, libraryData, getFilteredItems } from "./libraryData";
import { useToast } from "@/components/ui/use-toast";

interface LibraryProps {
  onAddToCanvas?: (item: LibraryItemType) => void;
  onSelectItem?: (item: LibraryItemType) => void;
  className?: string;
}

export function Library({ onAddToCanvas, onSelectItem, className }: LibraryProps) {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredItems = useMemo(() => {
    if (search.trim()) {
      return getFilteredItems(search);
    }
    if (activeCategory === "all") {
      return libraryData.flatMap(c => c.items);
    }
    const category = libraryData.find(c => c.id === activeCategory);
    return category ? category.items : [];
  }, [search, activeCategory]);

  const handleItemClick = (item: LibraryItemType) => {
    onSelectItem?.(item);
    if (item.type === "template" || item.type === "subflow") {
      onAddToCanvas?.(item);
    }
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      <div className="p-3 border-b">
        <Input
          placeholder="Search library..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-8 text-sm"
        />
        {search && (
          <div className="mt-1 text-xs text-muted-foreground">
            {filteredItems.length} results
          </div>
        )}
      </div>

      {!search && (
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="flex-1 flex flex-col">
          <TabsList className="justify-start px-3 py-1 h-auto flex-wrap gap-1 bg-transparent">
            <TabsTrigger value="all" className="text-xs data-[state=active]:bg-primary/10">All</TabsTrigger>
            {libraryData.map((cat) => (
              <TabsTrigger key={cat.id} value={cat.id} className="text-xs data-[state=active]:bg-primary/10">
                {cat.icon} {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeCategory} className="flex-1 mt-0">
            <ScrollArea className="h-full">
              <div className="p-2 space-y-2">
                {filteredItems.map((item) => (
                  <LibraryItem key={item.id} item={item} onSelect={handleItemClick} />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      )}

      {search && (
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-2">
            {filteredItems.map((item) => (
              <LibraryItem key={item.id} item={item} onSelect={handleItemClick} />
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
