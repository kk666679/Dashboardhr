"use client";

import { useState } from "react";
import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { trpc } from "@/lib/trpc";

interface SuccessorRankingProps {
  positionId: string;
  successors: { id: string; employeeId: string; name: string; rank: number }[];
  onReorder?: () => void;
}

function SortableItem({ id, name, rank }: { id: string; name: string; rank: number }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="rounded-lg border bg-card text-card-foreground shadow-sm p-3 cursor-grab">
      <div className="flex justify-between items-center">
        <span>{name}</span>
        <span className="text-sm text-muted-foreground">Rank {rank}</span>
      </div>
    </div>
  );
}

export function SuccessorRanking({ positionId, successors, onReorder }: SuccessorRankingProps) {
  const { toast } = useToast();
  const utils = trpc.useUtils();
  const [items, setItems] = useState([...successors].sort((a, b) => a.rank - b.rank));

  const { mutate: reorder } = trpc.successor.updateRanking.useMutation({
    onSuccess: () => {
      toast({ title: "Ranking updated" });
      utils.successor.getByPosition.invalidate({ positionId });
      onReorder?.();
    },
    onError: (err: { message: string }) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    const newItems = arrayMove(items, oldIndex, newIndex);
    setItems(newItems);
    reorder({ updates: newItems.map((item, index) => ({ candidateId: item.id, rank: index + 1 })) });
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {items.map((s, index) => (
            <SortableItem key={s.id} id={s.id} name={s.name} rank={index + 1} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
