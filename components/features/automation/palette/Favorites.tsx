"use client";

import { useState, useEffect } from "react";
import { NodePaletteItem } from "./NodePaletteItem";
import { NodePaletteItem as PaletteItem } from "./paletteData";
import { getNodeById } from "./paletteData";

interface FavoritesProps {
  onAdd: (item: PaletteItem) => void;
}

export function Favorites({ onAdd }: FavoritesProps) {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem("node-favorites");
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {
        setFavorites([]);
      }
    } else {
      // Default favorites
      const defaults = ["start", "action", "decision", "workflow"];
      setFavorites(defaults);
      localStorage.setItem("node-favorites", JSON.stringify(defaults));
    }
  }, []);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const updated = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id];
      localStorage.setItem("node-favorites", JSON.stringify(updated));
      return updated;
    });
  };

  const favoriteItems = favorites.map(getNodeById).filter(Boolean) as PaletteItem[];

  if (favoriteItems.length === 0) {
    return (
      <div className="text-center text-sm text-muted-foreground p-4">
        No favorites yet. Click the star on any node to add it.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="text-xs font-medium text-muted-foreground px-1">⭐ Favorites</div>
      <div className="grid grid-cols-2 gap-1">
        {favoriteItems.map((item) => (
          <NodePaletteItem key={item.id} item={item} onAdd={onAdd} />
        ))}
      </div>
    </div>
  );
}
