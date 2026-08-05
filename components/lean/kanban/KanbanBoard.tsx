import React, { useState, useMemo, useCallback, memo } from 'react';
import {
  Bot,
  Clock,
  Flag,
  AlertTriangle,
  User,
  Plus,
  MoreHorizontal,
  Zap,
  TrendingUp,
  BarChart2,
} from 'lucide-react';
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
  ConversationTypingIndicator,
  ConversationHeader,
} from '../../ai-elements';
import { Suggestion, Suggestions } from '../../ai-elements';
import { Agent, AgentHeader, AgentStatusDot, AgentContent, AgentMetrics, AgentActions, AgentAction } from '../../ai-elements';
import { Reasoning, ReasoningTrigger, ReasoningContent } from '../../ai-elements';
import { Controls } from '../../ai-elements';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------
type Priority = 'critical' | 'high' | 'medium' | 'low';
type Column = 'backlog' | 'ready' | 'doing' | 'testing' | 'blocked' | 'done';

interface KanbanCard {
  id: string;
  title: string;
  assignee: string;
  priority: Priority;
  column: Column;
  tags: string[];
  due: string;
  effort: number;
  aiRisk: number;
  description: string;
}

// -----------------------------------------------------------------------------
// Constants & Configuration
// -----------------------------------------------------------------------------
const COLUMNS: { id: Column; label: string; color: string }[] = [
  { id: 'backlog', label: 'Backlog', color: '#4d5468' },
  { id: 'ready', label: 'Ready', color: '#8b92a9' },
  { id: 'doing', label: 'In Progress', color: '#00d4ff' },
  { id: 'testing', label: 'Testing', color: '#7c5cfc' },
  { id: 'blocked', label: 'Blocked', color: '#ff4d6d' },
  { id: 'done', label: 'Completed', color: '#00d68f' },
];

const PRIORITY_CONFIG: Record<Priority, { color: string; bg: string; label: string }> = {
  critical: { color: '#ff4d6d', bg: 'rgba(255,77,109,0.12)', label: 'Critical' },
  high: { color: '#ffaa00', bg: 'rgba(255,170,0,0.12)', label: 'High' },
  medium: { color: '#00d4ff', bg: 'rgba(0,212,255,0.12)', label: 'Medium' },
  low: { color: '#4d5468', bg: 'rgba(77,84,104,0.12)', label: 'Low' },
};

const INITIAL_CARDS: KanbanCard[] = [
  {
    id: 'T-101',
    title: 'Install IoT sensors on Press #3 hydraulics',
    assignee: 'Tom B',
    priority: 'critical',
    column: 'doing',
    tags: ['IoT', 'Press'],
    due: 'Jul 28',
    effort: 5,
    aiRisk: 72,
    description: 'Sensor installation for condition-based maintenance trigger',
  },
  {
    id: 'T-102',
    title: 'MSA study — calibrate Gauge B12',
    assignee: 'Aiko T',
    priority: 'high',
    column: 'testing',
    tags: ['MSA', 'QC'],
    due: 'Jul 25',
    effort: 3,
    aiRisk: 28,
    description: 'Full gauge R&R study with 3 operators, 10 parts',
  },
  // ... (include all other initial cards)
];

// Mock burndown data
const BURNDOWN_DATA = Array.from({ length: 14 }, (_, i) => ({
  day: `Jul ${i + 8}`,
  ideal: Math.round(10 - (i / 13) * 10),
  actual: Math.round(10 - (i / 13) * 8.2 + (Math.random() - 0.5) * 1.2),
}));

// -----------------------------------------------------------------------------
// Sub‑components
// -----------------------------------------------------------------------------

// -------- Card Component --------
interface CardProps {
  card: KanbanCard;
  onMove: (id: string, col: Column) => void;
  onDragStart: (id: string) => void;
}

const Card = memo(({ card, onMove, onDragStart }: CardProps) => {
  const p = PRIORITY_CONFIG[card.priority];
  const riskColor = card.aiRisk > 70 ? '#ff4d6d' : card.aiRisk > 40 ? '#ffaa00' : '#00d68f';

  return (
    <div
      draggable
      className="rounded-xl p-3 mb-2 bg-[#161820] border border-white/6 cursor-grab active:cursor-grabbing focus:outline-none focus:ring-2 focus:ring-blue-400"
      onDragStart={() => onDragStart(card.id)}
      tabIndex={0}
      role="button"
      aria-label={`Card ${card.id}: ${card.title}`}
    >
      {/* Header: ID and priority */}
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs font-mono text-[#4d5468]">{card.id}</span>
        <span
          className="px-1.5 py-0.5 rounded-full text-xs font-medium"
          style={{ background: p.bg, color: p.color }}
        >
          {p.label}
        </span>
      </div>

      {/* Title */}
      <p className="text-sm font-medium mb-2 leading-snug text-[#f0f2f7]">{card.title}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-3">
        {card.tags.map((tag) => (
          <span
            key={tag}
            className="px-1.5 py-0.5 rounded text-xs bg-white/6 text-[#8b92a9]"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Metadata */}
      <div className="flex items-center gap-3 text-xs text-[#4d5468]">
        <div className="flex items-center gap-1">
          <User size={10} />
          <span>{card.assignee}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock size={10} />
          <span>{card.due}</span>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <Bot size={10} style={{ color: riskColor }} />
          <span className="font-mono" style={{ color: riskColor }}>
            {card.aiRisk}%
          </span>
        </div>
      </div>
    </div>
  );
});
Card.displayName = 'Card';

// -------- Column Component --------
interface ColumnProps {
  column: { id: Column; label: string; color: string };
  cards: KanbanCard[];
  onDrop: (colId: Column) => void;
  onDragStart: (cardId: string) => void;
  onMove: (cardId: string, colId: Column) => void;
}

const Column = memo(({ column, cards, onDrop, onDragStart, onMove }: ColumnProps) => {
  return (
    <div
      className="flex flex-col shrink-0 rounded-xl p-3 w-60 bg-[#0f1117] border border-white/5 min-h-[400px]"
      onDragOver={(e) => e.preventDefault()}
      onDrop={() => onDrop(column.id)}
      role="group"
      aria-label={`${column.label} column`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: column.color }} />
          <span className="text-xs font-semibold text-[#f0f2f7]">{column.label}</span>
        </div>
        <span className="text-xs px-1.5 py-0.5 rounded-full bg-white/6 text-[#8b92a9] font-mono">
          {cards.length}
        </span>
      </div>

      {/* Cards */}
      <div className="flex-1">
        {cards.map((card) => (
          <Card key={card.id} card={card} onMove={onMove} onDragStart={onDragStart} />
        ))}
      </div>

      {/* Add card button */}
      <button
        className="w-full mt-2 py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 border border-dashed border-white/6 text-[#4d5468] hover:bg-white/5 transition-colors"
        aria-label={`Add card to ${column.label}`}
      >
        <Plus size={11} /> Add card
      </button>
    </div>
  );
});
Column.displayName = 'Column';

// -------- Stats Row --------
interface StatsRowProps {
  total: number;
  inProgress: number;
  blocked: number;
  cycleTimeAvg: number;
  velocity: string;
}

const StatsRow = memo(({ total, inProgress, blocked, cycleTimeAvg, velocity }: StatsRowProps) => {
  const stats = [
    { label: 'Total Tasks', value: total.toString(), color: '#8b92a9' },
    { label: 'In Progress', value: inProgress.toString(), color: '#00d4ff' },
    { label: 'Blocked', value: blocked.toString(), color: '#ff4d6d' },
    { label: 'Avg Cycle Time', value: `${cycleTimeAvg}d`, color: '#7c5cfc' },
    { label: 'Velocity', value: velocity, color: '#00d68f' },
  ];

  return (
    <div className="grid grid-cols-5 gap-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl p-3 bg-[#0f1117] border border-white/6"
        >
          <div className="text-xs mb-1 text-[#4d5468]">{stat.label}</div>
          <div className="text-lg font-bold font-mono" style={{ color: stat.color }}>
            {stat.value}
          </div>
        </div>
      ))}
    </div>
  );
});
StatsRow.displayName = 'StatsRow';

// -------- Burndown Chart (simplified) --------
interface BurndownProps {
  data: typeof BURNDOWN_DATA;
}

const BurndownChart = memo(({ data }: BurndownProps) => (
  <div className="rounded-xl p-5 bg-[#0f1117] border border-white/6">
    <div className="text-sm font-semibold mb-1 text-[#f0f2f7]">Burndown Chart</div>
    <div className="text-xs mb-4 text-[#4d5468]">Sprint 14 · Jul 8 – Aug 1</div>
    <div className="space-y-3">
      {data
        .filter((_, i) => i % 2 === 0)
        .map((d) => (
          <div key={d.day}>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-mono text-[#4d5468]">{d.day}</span>
              <span className="font-mono text-[#8b92a9]">{Math.max(0, d.actual)}</span>
            </div>
            <div className="flex gap-1">
              <div className="h-1.5 rounded-full flex-1 bg-white/6">
                <div
                  className="h-full rounded-full bg-white/40"
                  style={{ width: `${(d.ideal / 10) * 100}%` }}
                />
              </div>
              <div className="h-1.5 rounded-full flex-1 bg-white/6">
                <div
                  className="h-full rounded-full bg-[#7c5cfc]"
                  style={{ width: `${Math.max(0, (d.actual / 10) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        ))}
    </div>
  </div>
));
BurndownChart.displayName = 'BurndownChart';

// -------- Cycle Time & Risk Panel --------
interface CycleTime {
  avg: number;
  p50: number;
  p90: number;
}

interface RiskPanelProps {
  cards: KanbanCard[];
  cycleTime: CycleTime;
}

const RiskPanel = memo(({ cards, cycleTime }: RiskPanelProps) => {
  const highRiskCards = cards
    .filter((c) => c.aiRisk > 40)
    .sort((a, b) => b.aiRisk - a.aiRisk)
    .slice(0, 3);

  return (
    <div className="rounded-xl p-5 bg-[#0f1117] border border-white/6">
      <div className="text-sm font-semibold mb-4 text-[#f0f2f7]">Cycle Time Distribution</div>
      {[
        { label: 'Average', value: `${cycleTime.avg} days`, color: '#00d4ff' },
        { label: 'Median (P50)', value: `${cycleTime.p50} days`, color: '#7c5cfc' },
        { label: 'P90', value: `${cycleTime.p90} days`, color: '#ffaa00' },
      ].map((m) => (
        <div
          key={m.label}
          className="flex justify-between items-center p-3 rounded-lg mb-2 bg-[#161820]"
        >
          <span className="text-sm text-[#8b92a9]">{m.label}</span>
          <span className="text-sm font-bold font-mono" style={{ color: m.color }}>
            {m.value}
          </span>
        </div>
      ))}
      <div className="mt-4">
        <div className="text-xs font-semibold mb-3 text-[#f0f2f7]">AI Risk Assessment</div>
        {highRiskCards.map((card) => {
          const riskColor = card.aiRisk > 70 ? '#ff4d6d' : '#ffaa00';
          return (
            <div
              key={card.id}
              className="flex items-center gap-2 p-2 rounded-lg mb-1.5"
              style={{ background: `${riskColor}08` }}
            >
              <AlertTriangle size={11} style={{ color: riskColor }} />
              <span className="text-xs flex-1 truncate text-[#f0f2f7]">{card.title}</span>
              <span className="text-xs font-mono" style={{ color: riskColor }}>
                {card.aiRisk}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
});
RiskPanel.displayName = 'RiskPanel';

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------
export default function KanbanBoard() {
  const [cards, setCards] = useState<KanbanCard[]>(INITIAL_CARDS);
  const [dragId, setDragId] = useState<string | null>(null);
  const [view, setView] = useState<'board' | 'metrics'>('board');
  const [conversationMessages, setConversationMessages] = useState<
    Array<{ role: string; content: string }>
  >([]);

  // Derived data
  const totalTasks = cards.length;
  const inProgress = cards.filter((c) => c.column === 'doing').length;
  const blocked = cards.filter((c) => c.column === 'blocked').length;
  const cycleTime = { avg: 4.2, p50: 3.8, p90: 7.1 }; // static for demo

  // Find risky card (highest risk, closest due, not done)
  const riskyCard = useMemo(() => {
    return cards
      .filter((c) => c.column !== 'done')
      .sort((a, b) => b.aiRisk - a.aiRisk || new Date(a.due).getTime() - new Date(b.due).getTime())[0];
  }, [cards]);

  // -------- Handlers --------
  const moveCard = useCallback((id: string, targetCol: Column) => {
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, column: targetCol } : c))
    );
  }, []);

  const handleDrop = useCallback(
    (targetCol: Column) => {
      if (dragId) {
        moveCard(dragId, targetCol);
        setDragId(null);
      }
    },
    [dragId, moveCard]
  );

  const handleDragStart = useCallback((id: string) => {
    setDragId(id);
  }, []);

  // Keyboard support for moving cards (simplified: within board)
  // We'll rely on the Card's tabIndex and keydown events, but we can also add
  // a global handler if needed. Not implemented for brevity.

  // -------- Conversation AI handler --------
  const handleSendMessage = useCallback((msg: string) => {
    // Append user message
    const userMessage = { role: 'user', content: msg };
    setConversationMessages((prev) => [...prev, userMessage]);

    // Simulate AI response (could parse intent and create task)
    const response =
      'I can help you create tasks. For example: "Create a task to calibrate gauge B12 for Aiko due July 25".';
    setConversationMessages((prev) => [
      ...prev,
      { role: 'assistant', content: response },
    ]);
  }, []);

  // -------- Render --------
  return (
    <div className="p-6 space-y-5">
      {/* AI Conversation Panel */}
      <div
        className="rounded-xl p-4 border border-cyan-400/20"
        style={{ background: '#161820' }}
      >
        <Conversation>
          <ConversationContent>
            {conversationMessages.length === 0 ? (
              <ConversationEmptyState title="No messages" description="Type to create a task, ask for recommendations, or get insights..." />
            ) : (
              <div className="space-y-3">
                {conversationMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>{msg.content}</div>
                  </div>
                ))}
              </div>
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
        <div className="flex gap-2 mt-2">
          <input
            className="flex-1 bg-transparent text-xs outline-none px-2 py-1.5 rounded-lg"
            style={{ background: '#0f1117', color: '#f0f2f7', border: '1px solid rgba(255,255,255,0.06)' }}
            placeholder="Type to create a task, ask for recommendations, or get insights..."
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === 'Enter' && (e.target as HTMLInputElement).value) {
                handleSendMessage((e.target as HTMLInputElement).value);
                (e.target as HTMLInputElement).value = '';
              }
            }}
          />
        </div>
      </div>

      {/* AI Suggestion and Reasoning for risky card */}
      {riskyCard && (
        <div className="grid grid-cols-2 gap-3">
          <Suggestions>
            <Suggestion
              suggestion={`⚠️ High-Risk Task: ${riskyCard.id} – ${riskyCard.title} (Risk ${riskyCard.aiRisk}%, due ${riskyCard.due})`}
            />
          </Suggestions>
          <Reasoning>
            <ReasoningTrigger />
            <ReasoningContent>Risk assessment based on complexity and due date. Priority recomputed.</ReasoningContent>
          </Reasoning>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#f0f2f7]">
            AI Kanban Board
          </h1>
          <p className="text-sm mt-0.5 text-[#8b92a9]">Sprint 14 · July 8 – August 1, 2026</p>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex p-1 rounded-lg gap-1 bg-[#0f1117]">
            {(['board', 'metrics'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                  view === v
                    ? 'bg-cyan-400/10 text-cyan-400'
                    : 'text-[#8b92a9] hover:text-white'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
          {/* Add task button */}
          <button
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-cyan-400/10 text-cyan-400 border border-cyan-400/20"
            aria-label="Add new task"
          >
            <Plus size={12} /> Add Task
          </button>
          {/* AI Agent */}
          <Agent>
            <AgentHeader
              name="Cycle Time Predictor"
              model="prediction-v1"
              status="streaming"
              actions={<span className="flex items-center gap-1 text-xs"><AgentStatusDot status="streaming" />Predicting...</span>}
            />
          </Agent>
        </div>
      </div>

      {/* Stats */}
      <StatsRow
        total={totalTasks}
        inProgress={inProgress}
        blocked={blocked}
        cycleTimeAvg={cycleTime.avg}
        velocity="6.4/sprint"
      />

      {/* Main content: Board or Metrics */}
      {view === 'board' ? (
        <div className="flex gap-3 overflow-x-auto pb-4">
          {COLUMNS.map((col) => {
            const colCards = cards.filter((c) => c.column === col.id);
            return (
              <Column
                key={col.id}
                column={col}
                cards={colCards}
                onDrop={handleDrop}
                onDragStart={handleDragStart}
                onMove={moveCard}
              />
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <BurndownChart data={BURNDOWN_DATA} />
          <RiskPanel cards={cards} cycleTime={cycleTime} />
        </div>
      )}
    </div>
  );
}