"use client";

import { useSemanticSearch } from "@/hooks/useSemanticSearch";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";

const KIND_COLORS = {
  employee: "bg-blue-100 text-blue-800",
  document: "bg-amber-100 text-amber-800",
  rule: "bg-green-100 text-green-800",
} as const;

type SearchKind = "employees" | "documents" | "rules" | "all";

interface SemanticSearchProps {
  kind?: SearchKind;
  placeholder?: string;
  topK?: number;
}

export function SemanticSearch({
  kind = "all",
  placeholder = "Search employees, documents, compliance rules…",
  topK = 8,
}: SemanticSearchProps) {
  const { query, setQuery, results, isLoading, error } = useSemanticSearch({
    kind,
    topK,
  });

  return (
    <div className="w-full space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-md" />
          ))}
        </div>
      )}

      {!isLoading && results.length > 0 && (
        <ul className="divide-y rounded-md border bg-background">
          {results.map((r: (typeof results)[number]) => (
            <li
              key={r.id}
              className="flex items-center justify-between px-4 py-2.5 text-sm"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className={`shrink-0 rounded px-1.5 py-0.5 text-xs font-medium capitalize ${KIND_COLORS[r.kind as keyof typeof KIND_COLORS]}`}
                >
                  {r.kind}
                </span>
                <span className="truncate text-foreground">
                  {"name" in r.meta
                    ? (r.meta as { name: string }).name
                    : "type" in r.meta
                      ? (r.meta as { type: string }).type
                      : (r.meta as { ruleType: string }).ruleType}
                </span>
                {"position" in r.meta &&
                  (r.meta as { position?: string }).position && (
                    <span className="truncate text-muted-foreground">
                      — {(r.meta as { position: string }).position}
                    </span>
                  )}
              </div>
              <Badge variant="outline" className="ml-2 shrink-0 tabular-nums">
                {(r.score * 100).toFixed(0)}%
              </Badge>
            </li>
          ))}
        </ul>
      )}

      {!isLoading && query.length >= 2 && results.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          No matching records found.
        </p>
      )}
    </div>
  );
}
