"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { INTEGRATION_REGISTRY } from "@/lib/integrations/integration-registry";
import type { IntegrationDefinition } from "@/components/features/integrations/integration-center-types";
import { Search, GripVertical } from "lucide-react";

type ColumnKey = "connected" | "available" | "coming_soon";

const COLUMNS: Array<{ key: ColumnKey; title: string; badge: string }> = [
  { key: "connected", title: "Connected", badge: "LIVE" },
  { key: "available", title: "Available", badge: "READY" },
  { key: "coming_soon", title: "Coming Soon", badge: "SOON" },
];

const CATEGORY_LABELS: Record<IntegrationDefinition["category"], string> = {
  HRIS: "HRIS",
  PAYROLL: "Payroll",
  PROGRESS: "Productivity",
  SECURITY: "Security",
  IDENTITY: "Identity",
  STORAGE: "Storage",
  FINANCE: "Finance",
  AI: "AI Platform",
  GOV_HR: "Gov · HR",
  GOV_SAFETY: "Gov · Safety",
  GOV_CORPORATE: "Gov · Corporate",
  GOV_IMMIGRATION: "Gov · Immigration",
  GOV_FINANCE: "Gov · Finance",
  GOV_PAYROLL: "Gov · Payroll",
  GOV_HRIS: "Gov · HRIS",
  GOV_PRODUCTIVITY: "Gov · Productivity",
  GOV_IDENTITY: "Gov · Identity",
  GOV_STORAGE: "Gov · Storage",
};

function statusToColumn(status: IntegrationDefinition["status"]): ColumnKey {
  if (status === "connected") return "connected";
  if (status === "available") return "available";
  return "coming_soon";
}

function IntegrationCard({
  integ,
  overlay = false,
}: {
  integ: IntegrationDefinition;
  overlay?: boolean;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: integ.id,
  });

  return (
    <div ref={overlay ? undefined : setNodeRef}>
    <Card
      className={`border border-[var(--border)] bg-[var(--surface-2)] shadow-sm transition-opacity ${
        isDragging && !overlay ? "opacity-40" : "opacity-100"
      } ${overlay ? "w-72 rotate-2 shadow-lg" : ""}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <button
            type="button"
            aria-label={`Drag ${integ.platformName}`}
            className="mt-0.5 cursor-grab touch-none rounded-md p-1 text-muted-foreground hover:bg-[var(--surface-1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing"
            {...(overlay ? {} : listeners)}
            {...(overlay ? {} : attributes)}
          >
            <GripVertical className="h-4 w-4" aria-hidden="true" />
          </button>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-1)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={integ.logo?.src ?? "/logo.svg"}
              alt=""
              aria-hidden="true"
              className="h-6 w-6"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold">{integ.platformName}</div>
            <Badge variant="outline" className="mt-1 text-[10px]">
              {CATEGORY_LABELS[integ.category]}
            </Badge>
          </div>
        </div>

        <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {integ.description}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          <Badge variant="outline" className="text-[10px]">
            API: {integ.apiEndpoint ? "Available" : "N/A"}
          </Badge>
          {integ.supportsOAuth && (
            <Badge variant="outline" className="text-[10px]">
              OAuth
            </Badge>
          )}
          {integ.supportsSync && (
            <Badge variant="outline" className="text-[10px]">
              Sync
            </Badge>
          )}
          {integ.supportsWebhook && (
            <Badge variant="outline" className="text-[10px]">
              Webhook
            </Badge>
          )}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <Button
            size="sm"
            variant="outline"
            className="w-full"
            aria-label={`Configure ${integ.platformName}`}
          >
            Configure
          </Button>
          <Button asChild size="sm" variant="ghost" className="w-full">
            <Link href={integ.documentationUrl ?? "/docs/integrations"} prefetch={false}>
              Docs
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
    </div>
  );
}

function Column({
  column,
  items,
}: {
  column: (typeof COLUMNS)[number];
  items: IntegrationDefinition[];
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column.key });

  return (
    <section
      ref={setNodeRef}
      aria-label={`${column.title} integrations`}
      className={`flex flex-col rounded-[var(--radius-lg)] border p-3 transition-colors ${
        isOver
          ? "border-primary bg-[var(--surface-2)]"
          : "border-[var(--border)] bg-[var(--surface-1)]"
      }`}
    >
      <div className="flex items-center justify-between px-2 py-1">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold">{column.title}</h2>
          <span className="rounded-full bg-[var(--surface-2)] px-2 py-0.5 text-[11px] text-muted-foreground">
            {items.length}
          </span>
        </div>
        <Badge variant="outline" className="text-[11px]">
          {column.badge}
        </Badge>
      </div>

      <div className="mt-3 flex min-h-24 flex-1 flex-col gap-3">
        {items.length === 0 ? (
          <div className="flex flex-1 items-center justify-center rounded-[var(--radius-md)] border border-dashed border-[var(--border)] p-6 text-center text-xs text-muted-foreground">
            Drag an integration here
          </div>
        ) : (
          items.map((integ) => <IntegrationCard key={integ.id} integ={integ} />)
        )}
      </div>
    </section>
  );
}

export function IntegrationKanbanBoard() {
  // Local override map lets the board reflect drag-and-drop moves without a backend.
  const [statusOverrides, setStatusOverrides] = useState<Record<string, ColumnKey>>({});
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor),
  );

  const categories = useMemo(() => {
    const set = new Set<IntegrationDefinition["category"]>();
    INTEGRATION_REGISTRY.forEach((i) => set.add(i.category));
    return Array.from(set).sort((a, b) =>
      CATEGORY_LABELS[a].localeCompare(CATEGORY_LABELS[b]),
    );
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return INTEGRATION_REGISTRY.filter((i) => {
      const matchesQuery =
        !q ||
        i.platformName.toLowerCase().includes(q) ||
        i.provider.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q);
      const matchesCategory = category === "all" || i.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [query, category]);

  const grouped = useMemo(() => {
    const result: Record<ColumnKey, IntegrationDefinition[]> = {
      connected: [],
      available: [],
      coming_soon: [],
    };
    for (const integ of filtered) {
      const key = statusOverrides[integ.id] ?? statusToColumn(integ.status);
      result[key].push(integ);
    }
    return result;
  }, [filtered, statusOverrides]);

  const activeIntegration = activeId
    ? INTEGRATION_REGISTRY.find((i) => i.id === activeId) ?? null
    : null;

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;
    const target = String(over.id) as ColumnKey;
    if (!["connected", "available", "coming_soon"].includes(target)) return;
    setStatusOverrides((prev) => ({ ...prev, [String(active.id)]: target }));
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search integrations..."
            aria-label="Search integrations"
            className="pl-9"
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full sm:w-56" aria-label="Filter by category">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>
                {CATEGORY_LABELS[c]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <DndContext
          id="integration-kanban"
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={() => setActiveId(null)}
        >
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {COLUMNS.map((col) => (
              <Column key={col.key} column={col} items={grouped[col.key]} />
            ))}
          </div>

          <DragOverlay>
            {activeIntegration ? (
              <IntegrationCard integ={activeIntegration} overlay />
            ) : null}
          </DragOverlay>
        </DndContext>
      </motion.div>
    </div>
  );
}
