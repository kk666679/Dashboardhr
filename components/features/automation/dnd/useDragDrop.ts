import { useCallback, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  closestCenter,
  useSensors,
  useSensor,
  PointerSensor,
  KeyboardSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";

interface UseDragDropOptions {
  onDragEnd?: (event: DragEndEvent) => void;
  onDragOver?: (event: DragOverEvent) => void;
  onDragStart?: (event: DragStartEvent) => void;
}

export function useDragDrop({ onDragEnd, onDragOver, onDragStart }: UseDragDropOptions = {}) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    onDragStart?.(event);
  }, [onDragStart]);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    setOverId(event.over?.id as string || null);
    onDragOver?.(event);
  }, [onDragOver]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    setActiveId(null);
    setOverId(null);
    onDragEnd?.(event);
  }, [onDragEnd]);

  return {
    DndContext,
    sensors,
    activeId,
    overId,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    arrayMove,
  };
}

// Helper to reorder items in an array
export function reorderItems<T>(items: T[], fromIndex: number, toIndex: number): T[] {
  return arrayMove(items, fromIndex, toIndex);
}
