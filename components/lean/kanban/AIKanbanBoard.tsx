// AIKanbanBoard.tsx
import React, { useState, useMemo, useCallback, memo } from 'react';
import { Suggestion, Suggestions } from '../../ai-elements/suggestion';
import { Agent, AgentHeader, AgentStatusDot } from '../../ai-elements/agent';
import { Timeline, TimelineEventItem } from '../../ai-elements/timeline';
import { Task, TaskTrigger, TaskContent, TaskItem } from '../../ai-elements/task';
import { Checkpoint, CheckpointTrigger, CheckpointIcon } from '../../ai-elements/checkpoint';
import { Sources, SourcesTrigger, SourcesContent, Source } from '../../ai-elements/sources';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------
export interface Card {
  id: string;
  title: string;
}

export interface Column {
  id: string;
  label: string;
  limit?: number; // optional WIP limit
  cards: Card[];
}

// -----------------------------------------------------------------------------
// Initial Data
// -----------------------------------------------------------------------------
const initialColumns: Column[] = [
  {
    id: 'backlog',
    label: 'Backlog',
    limit: 0,
    cards: [
      { id: 'c1', title: 'Setup SMED training' },
      { id: 'c2', title: 'Update SOPs' },
      { id: 'c3', title: 'Order 5S shadow boards' },
      { id: 'c4', title: 'Audit Line C' },
    ],
  },
  {
    id: 'ready',
    label: 'Ready',
    limit: 5,
    cards: [
      { id: 'c5', title: 'Install Press #3 sensors' },
      { id: 'c6', title: 'Create TPM schedule' },
    ],
  },
  {
    id: 'in-progress',
    label: 'In Progress',
    limit: 3,
    cards: [{ id: 'c7', title: 'Implement poka-yoke fixture' }],
  },
  {
    id: 'review',
    label: 'Review',
    limit: 3,
    cards: [
      { id: 'c8', title: 'VSM future state' },
      { id: 'c9', title: 'Kaizen Week 2 report' },
    ],
  },
  {
    id: 'done',
    label: 'Done',
    limit: 0,
    cards: [
      { id: 'c10', title: '5S Audit Press Area' },
      { id: 'c11', title: 'Setup baseline DPMO' },
      { id: 'c12', title: 'Takt time analysis' },
    ],
  },
];

// -----------------------------------------------------------------------------
// Sub‑components
// -----------------------------------------------------------------------------

interface KanbanCardProps {
  card: Card;
  columnId: string;
  onDragStart: (e: React.DragEvent, cardId: string, fromColId: string) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onKeyDown: (e: React.KeyboardEvent, cardId: string, fromColId: string) => void;
}

const KanbanCard = memo(({ card, columnId, onDragStart, onDragEnd, onKeyDown }: KanbanCardProps) => {
  return (
    <div
      draggable
      tabIndex={0}
      onDragStart={(e) => onDragStart(e, card.id, columnId)}
      onDragEnd={onDragEnd}
      onKeyDown={(e) => onKeyDown(e, card.id, columnId)}
      className="p-2 rounded-lg text-xs bg-[#0f1117] border border-white/5 text-[#f0f2f7] cursor-grab active:cursor-grabbing focus:outline-none focus:ring-2 focus:ring-blue-400"
      aria-label={`Card: ${card.title}`}
    >
      {card.title}
    </div>
  );
});
KanbanCard.displayName = 'KanbanCard';

interface KanbanColumnProps {
  column: Column;
  onDrop: (e: React.DragEvent, targetColId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragStart: (e: React.DragEvent, cardId: string, fromColId: string) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onKeyDown: (e: React.KeyboardEvent, cardId: string, fromColId: string) => void;
}

const KanbanColumn = memo(({
  column,
  onDrop,
  onDragOver,
  onDragStart,
  onDragEnd,
  onKeyDown,
}: KanbanColumnProps) => {
  const { id, label, limit, cards } = column;
  const cardCount = cards.length;
  const showLimit = limit !== undefined && limit > 0;

  return (
    <div
      className="rounded-xl p-3 bg-[#161820] border border-white/6"
      onDrop={(e) => onDrop(e, id)}
      onDragOver={onDragOver}
      role="group"
      aria-label={`${label} column, ${cardCount} cards`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-[#8b92a9]">
          {label}
        </span>
        <span className="text-xs font-mono text-[#4d5468]">
          {cardCount}{showLimit ? `/${limit}` : ''}
        </span>
      </div>
      <div className="space-y-2">
        {cards.map((card) => (
          <KanbanCard
            key={card.id}
            card={card}
            columnId={id}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onKeyDown={onKeyDown}
          />
        ))}
      </div>
    </div>
  );
});
KanbanColumn.displayName = 'KanbanColumn';

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------

export const AIKanbanBoard = () => {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);
  const [sourceColumnId, setSourceColumnId] = useState<string | null>(null);

  // Compute total WIP and limit for the 'in-progress' column
  const inProgressColumn = columns.find((c) => c.id === 'in-progress');
  const totalWIP = inProgressColumn?.cards.length ?? 0;
  const wipLimit = inProgressColumn?.limit ?? 3;

  // Memoized WIP status
  const wipStatus = useMemo(() => {
    if (totalWIP === 0) return null;
    const exceeded = totalWIP >= wipLimit;
    return {
      exceeded,
      text: `WIP: ${totalWIP}/${wipLimit}${exceeded ? ' (limit reached)' : ''}`,
      className: `text-xs px-2 py-1 rounded-full font-mono ${
        exceeded
          ? 'bg-red-500/10 text-red-500'
          : 'bg-green-500/10 text-green-500'
      }`,
    };
  }, [totalWIP, wipLimit]);

  // --- Drag & Drop handlers ---
  const handleDragStart = useCallback((e: React.DragEvent, cardId: string, fromColId: string) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ cardId, fromColId }));
    setDraggedCardId(cardId);
    setSourceColumnId(fromColId);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedCardId(null);
    setSourceColumnId(null);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault(); // Necessary to allow drop
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, targetColId: string) => {
      e.preventDefault();
      const raw = e.dataTransfer.getData('text/plain');
      if (!raw) return;
      try {
        const { cardId, fromColId } = JSON.parse(raw);
        if (fromColId === targetColId) return; // No move

        setColumns((prev) => {
          // Find source and target columns
          const sourceCol = prev.find((c) => c.id === fromColId);
          const targetCol = prev.find((c) => c.id === targetColId);
          if (!sourceCol || !targetCol) return prev;

          // Check if target has a limit and is full
          if (targetCol.limit !== undefined && targetCol.cards.length >= targetCol.limit) {
            // Optionally alert or just ignore the drop
            return prev;
          }

          // Remove card from source
          const cardToMove = sourceCol.cards.find((c) => c.id === cardId);
          if (!cardToMove) return prev;

          const newSourceCards = sourceCol.cards.filter((c) => c.id !== cardId);
          const newTargetCards = [...targetCol.cards, cardToMove];

          return prev.map((col) => {
            if (col.id === fromColId) return { ...col, cards: newSourceCards };
            if (col.id === targetColId) return { ...col, cards: newTargetCards };
            return col;
          });
        });
      } catch (error) {
        console.error('Drop error:', error);
      }
      setDraggedCardId(null);
      setSourceColumnId(null);
    },
    []
  );

  // Keyboard support: move card left/right (simple arrow keys)
  const handleCardKeyDown = useCallback(
    (e: React.KeyboardEvent, cardId: string, fromColId: string) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        const direction = e.key === 'ArrowLeft' ? -1 : 1;
        const colIndex = columns.findIndex((c) => c.id === fromColId);
        const targetIndex = colIndex + direction;
        if (targetIndex < 0 || targetIndex >= columns.length) return;
        const targetColId = columns[targetIndex].id;
        // Simulate a drop
        const fakeEvent = { preventDefault: () => {} } as React.DragEvent;
        handleDrop(fakeEvent, targetColId);
      }
    },
    [columns, handleDrop]
  );

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Agent>
          <AgentHeader
            name="Kanban Cycle Time Predictor"
            model="prophet-v1"
            status="idle"
            actions={
              <span className="flex items-center gap-1 text-xs text-[#8b92a9]">
                <AgentStatusDot status="idle" aria-label="Agent status: idle" />
                Idle
              </span>
            }
          />
        </Agent>
        {wipStatus && <div className={wipStatus.className}>{wipStatus.text}</div>}
      </div>

      {/* Suggestions */}
      <Suggestions>
        <Suggestion suggestion="WIP limit exceeded on In Progress — move Review items to Done" />
        <Suggestion suggestion="Predicted cycle time: 3.2 days for current backlog items" />
        <Suggestion suggestion="Blocked: poka-yoke fixture awaiting approval from Engineering" />
      </Suggestions>

      {/* Kanban columns */}
      <div className="grid grid-cols-5 gap-3">
        {columns.map((col) => (
          <KanbanColumn
            key={col.id}
            column={col}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onKeyDown={handleCardKeyDown}
          />
        ))}
      </div>

      {/* Task (Action Items) */}
      <Task defaultOpen={false}>
        <TaskTrigger title="Kanban Action Items" />
        <TaskContent>
          <TaskItem>
            <div className="flex items-center gap-2 text-sm text-[#8b92a9]">
              <span className="w-2 h-2 rounded-full bg-red-500" aria-hidden="true" />
              <span>Move completed Review items to Done</span>
            </div>
          </TaskItem>
          <TaskItem>
            <div className="flex items-center gap-2 text-sm text-[#8b92a9]">
              <span className="w-2 h-2 rounded-full bg-yellow-500" aria-hidden="true" />
              <span>Unblock poka-yoke fixture — escalate to Engineering</span>
            </div>
          </TaskItem>
        </TaskContent>
      </Task>

      {/* Checkpoint */}
      <Checkpoint>
        <CheckpointIcon />
        <CheckpointTrigger tooltip="Cycle time target">
          <span className="text-xs text-[#00d4ff]">Target avg cycle time: 2.5 days (current: 3.2 days)</span>
        </CheckpointTrigger>
      </Checkpoint>

      {/* Timeline */}
      <Timeline>
        <TimelineEventItem
          event={{
            id: 'kb-1',
            status: 'completed',
            title: 'Sprint 1: Reduce cycle time from 4.1 to 3.5 days',
            description: 'Achieved: 3.2 days',
          }}
          isLast={false}
          showTimestamp={true}
        />
        <TimelineEventItem
          event={{
            id: 'kb-2',
            status: 'running',
            title: 'Sprint 2: Target 2.5 days avg cycle time',
            description: 'In progress: 3.2 days',
          }}
          isLast={false}
          showTimestamp={true}
        />
        <TimelineEventItem
          event={{
            id: 'kb-3',
            status: 'pending',
            title: 'Sprint 3: Implement WIP pull system',
            description: 'Planned for Aug 2026',
          }}
          isLast={true}
        />
      </Timeline>

      {/* Sources */}
      <Sources>
        <SourcesTrigger count={2} />
        <SourcesContent>
          <Source title="Kanban Board — Work Items" href="/dashboard/workflows" />
          <Source title="Cycle Time Report — July 2026" href="/dashboard/reports/workforce" />
        </SourcesContent>
      </Sources>
    </div>
  );
};

export default AIKanbanBoard;