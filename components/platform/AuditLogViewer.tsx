"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  History,
  Search,
  Filter,
  Download,
  ChevronDown,
  ChevronRight,
  Eye,
  Edit3,
  Trash2,
  Plus,
  User,
  Clock,
  Shield,
  MoreHorizontal,
  Loader2,
  FileText,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format } from "date-fns";

// ─── Types ────────────────────────────────────────────────────────────────────

export type AuditAction = "CREATE" | "UPDATE" | "DELETE" | "READ";

export interface AuditLogEntry {
  id: string;
  action: AuditAction;
  entityType: string;
  entityId: string;
  actorId?: string;
  actorName?: string;
  actorRole?: string;
  timestamp: Date;
  changes?: Record<string, { old?: unknown; new?: unknown }>;
  summary?: string;
  metadata?: Record<string, unknown>;
  tenantId?: string;
}

export interface AuditLogViewerProps {
  entries: AuditLogEntry[];
  isLoading?: boolean;
  error?: string | null;
  onExport?: (format: "csv" | "pdf") => void;
  onEntryClick?: (entry: AuditLogEntry) => void;
  onRefresh?: () => void;
  pageSize?: number;
  className?: string;
}

// ─── Action Config ────────────────────────────────────────────────────────────

const ACTION_CONFIG: Record<
  AuditAction,
  { label: string; icon: React.ComponentType<{ className?: string }>; color: string }
> = {
  CREATE: {
    label: "Created",
    icon: Plus,
    color: "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400",
  },
  UPDATE: {
    label: "Updated",
    icon: Edit3,
    color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400",
  },
  DELETE: {
    label: "Deleted",
    icon: Trash2,
    color: "text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400",
  },
  READ: {
    label: "Viewed",
    icon: Eye,
    color: "text-slate-600 bg-slate-100 dark:bg-slate-900/30 dark:text-slate-400",
  },
};

const ENTITY_LABELS: Record<string, string> = {
  employee: "Employee",
  user: "User",
  payroll: "Payroll Record",
  document: "Document",
  visa: "Visa",
  contract: "Contract",
  leave: "Leave Request",
  compliance: "Compliance Rule",
  workflow: "Workflow",
  candidate: "Candidate",
  onboarding: "Onboarding",
  offboarding: "Offboarding",
  termination: "Termination",
  sop: "SOP",
  tenant: "Tenant",
  orgNode: "Organisation Node",
};

function formatEntityType(type: string): string {
  return (
    ENTITY_LABELS[type.toLowerCase()] ||
    type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

function formatTimestamp(date: Date): string {
  try {
    return format(date, "MMM d, yyyy HH:mm:ss");
  } catch {
    return date.toLocaleString();
  }
}

// ─── Entry Component ──────────────────────────────────────────────────────────

interface AuditEntryProps {
  entry: AuditLogEntry;
  expanded: boolean;
  onToggle: () => void;
  onClick?: (entry: AuditLogEntry) => void;
}

function AuditEntry({ entry, expanded, onToggle, onClick }: AuditEntryProps) {
  const cfg = ACTION_CONFIG[entry.action];
  const Icon = cfg.icon;

  return (
    <div className="group">
      <div
        className={cn(
          "flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-muted/50",
          expanded && "bg-muted/30"
        )}
        onClick={() => {
          onToggle();
          onClick?.(entry);
        }}
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle();
            onClick?.(entry);
          }
        }}
      >
        {/* Action icon */}
        <span
          className={cn(
            "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full",
            cfg.color
          )}
        >
          <Icon className="size-3.5" />
        </span>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{cfg.label}</span>
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-mono">
              {formatEntityType(entry.entityType)}
            </Badge>
            {entry.summary && (
              <span className="text-sm text-muted-foreground truncate flex-1">
                {entry.summary}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground/70">
              <Clock className="size-2.5" />
              {formatTimestamp(entry.timestamp)}
            </span>
            {entry.actorName && (
              <span className="flex items-center gap-1 text-[11px] text-muted-foreground/70">
                <User className="size-2.5" />
                {entry.actorName}
              </span>
            )}
            {entry.actorRole && (
              <Badge variant="outline" className="text-[9px] px-1 py-0 font-normal">
                <Shield className="size-2 mr-0.5" />
                {entry.actorRole}
              </Badge>
            )}
          </div>
        </div>

        {/* Expand/collapse */}
        <span className="mt-1 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors">
          {expanded ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
        </span>
      </div>

      {/* Expanded details */}
      {expanded && entry.changes && (
        <div className="px-4 pb-3 pl-[3.25rem] space-y-2">
          <Separator />
          <div className="grid gap-2">
            {Object.entries(entry.changes).map(([field, change]) => (
              <div key={field} className="rounded-md border bg-muted/30 p-2.5">
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">
                  {field
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (c) => c.toUpperCase())}
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="space-y-0.5">
                    <p className="text-[9px] text-muted-foreground/60">Old Value</p>
                    <p className="text-muted-foreground bg-background rounded px-1.5 py-1">
                      {change.old !== undefined ? (
                        String(change.old)
                      ) : (
                        <span className="italic text-muted-foreground/40">empty</span>
                      )}
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[9px] text-muted-foreground/60">New Value</p>
                    <p className="text-foreground bg-background rounded px-1.5 py-1">
                      {change.new !== undefined ? (
                        String(change.new)
                      ) : (
                        <span className="italic text-muted-foreground/40">empty</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {entry.metadata && Object.keys(entry.metadata).length > 0 && (
            <div className="rounded-md border bg-muted/30 p-2.5">
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">
                Metadata
              </p>
              <pre className="text-xs text-muted-foreground font-mono whitespace-pre-wrap">
                {JSON.stringify(entry.metadata, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function AuditLogViewer({
  entries,
  isLoading = false,
  error = null,
  onExport,
  onEntryClick,
  onRefresh,
  pageSize = 20,
  className,
}: AuditLogViewerProps) {
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState<AuditAction | "all">("all");
  const [entityFilter, setEntityFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  const entityTypes = useMemo(() => {
    const types = new Set(entries.map((e) => e.entityType));
    return Array.from(types).sort();
  }, [entries]);

  const filtered = useMemo(() => {
    return entries.filter((entry) => {
      if (search) {
        const q = search.toLowerCase();
        const matchesSearch =
          entry.summary?.toLowerCase().includes(q) ||
          entry.actorName?.toLowerCase().includes(q) ||
          entry.entityType.toLowerCase().includes(q) ||
          entry.entityId.toLowerCase().includes(q);
        if (!matchesSearch) return false;
      }
      if (actionFilter !== "all" && entry.action !== actionFilter) return false;
      if (entityFilter !== "all" && entry.entityType !== entityFilter) return false;
      return true;
    });
  }, [entries, search, actionFilter, entityFilter]);

  const paginated = filtered.slice(0, (page + 1) * pageSize);
  const hasMore = paginated.length < filtered.length;

  // Reset page when filters change
  const handleFilterChange = (setter: (v: any) => void) => (v: any) => {
    setPage(0);
    setter(v);
  };

  if (error) {
    return (
      <div className={cn("flex flex-col items-center gap-3 py-16 text-center", className)}>
        <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
          <History className="size-6 text-destructive" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-destructive">Failed to load audit log</p>
          <p className="text-xs text-muted-foreground max-w-[300px]">{error}</p>
        </div>
        {onRefresh && (
          <Button variant="outline" size="sm" onClick={onRefresh}>
            Retry
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={cn("rounded-lg border bg-background", className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-2">
          <History className="size-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold">Audit Trail</h3>
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
            {entries.length} events
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="size-7"
                  onClick={() => onExport?.("csv")}
                  aria-label="Export as CSV"
                >
                  <Download className="size-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Export as CSV</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="size-7"
                  onClick={() => onExport?.("pdf")}
                  aria-label="Export as PDF"
                >
                  <FileText className="size-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Export as PDF</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b bg-muted/20">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/50" />
          <Input
            placeholder="Search audit trail..."
            value={search}
            onChange={(e) => handleFilterChange(setSearch)(e.target.value)}
            className="h-8 pl-8 text-xs"
          />
        </div>
        <Select
          value={actionFilter}
          onValueChange={handleFilterChange(setActionFilter)}
        >
          <SelectTrigger className="h-8 w-[130px] text-xs">
            <SelectValue placeholder="All actions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            {Object.entries(ACTION_CONFIG).map(([key, { label }]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={entityFilter}
          onValueChange={handleFilterChange(setEntityFilter)}
        >
          <SelectTrigger className="h-8 w-[140px] text-xs">
            <SelectValue placeholder="All entities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Entities</SelectItem>
            {entityTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {formatEntityType(type)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {isLoading && <Loader2 className="size-3.5 animate-spin text-muted-foreground/50" />}
      </div>

      {/* List */}
      <ScrollArea className="h-[400px]">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-12 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted/50">
              <Search className="size-5 text-muted-foreground/40" />
            </div>
            <p className="text-sm text-muted-foreground">No audit entries found</p>
            <p className="text-xs text-muted-foreground/60">
              Try adjusting your filters or search terms
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {paginated.map((entry) => (
              <AuditEntry
                key={entry.id}
                entry={entry}
                expanded={expandedId === entry.id}
                onToggle={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                onClick={onEntryClick}
              />
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Footer with pagination */}
      <div className="flex items-center justify-between px-4 py-2 border-t bg-muted/10">
        <span className="text-[10px] text-muted-foreground/60">
          Showing {paginated.length} of {filtered.length} entries
        </span>
        {hasMore && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={() => setPage((p) => p + 1)}
            disabled={isLoading}
          >
            Load more
            <ChevronDown className="size-3 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
}