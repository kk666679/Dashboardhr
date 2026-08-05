"use client";

import {
  SortableContext,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { ReactNode } from "react";

interface SortableListProps {
  items: string[]; // Array of IDs
  children: ReactNode;
  strategy?: "vertical" | "horizontal" | "rect";
}

export function SortableList({ items, children, strategy = "vertical" }: SortableListProps) {
  const getStrategy = () => {
    switch (strategy) {
      case "horizontal":
        return horizontalListSortingStrategy;
      case "rect":
        return rectSortingStrategy;
      default:
        return verticalListSortingStrategy;
    }
  };

  return (
    <SortableContext items={items} strategy={getStrategy()}>
      {children}
    </SortableContext>
  );
}
