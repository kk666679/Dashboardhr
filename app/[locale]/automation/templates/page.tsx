"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ArrowRight, GitBranch, Search, Clock, Layers,
  Filter, X, Users, FileText, Shield, Briefcase,
  Globe, Zap, Monitor, TrendingUp,
} from "lucide-react";
import { AutomationNavigation } from "@/components/features/automation/navigation";
import {
  FLOW_TEMPLATES,
  TEMPLATE_CATEGORIES,
  searchTemplates,
  getTemplatesByCategory,
  type FlowTemplateCategory,
} from "@/lib/flow-templates";

// ─── Category config ──────────────────────────────────────────────────────────

const CATEGORY_CONFIG: Record<string, { color: string; icon: React.ElementType }> = {
  HR:           { color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",     icon: Users },
  Onboarding:   { color: "bg-green-500/10 text-green-600 dark:text-green-400",   icon: Users },
  Offboarding:  { color: "bg-orange-500/10 text-orange-600 dark:text-orange-400",icon: Users },
  Payroll:      { color: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",icon: Briefcase },
  Compliance:   { color: "bg-red-500/10 text-red-600 dark:text-red-400",         icon: Shield },
  Performance:  { color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",icon: TrendingUp },
  Recruitment:  { color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",icon: Users },
  QMS:          { color: "bg-teal-500/10 text-teal-600 dark:text-teal-400",      icon: Shield },
  Immigration:  { color: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",      icon: Globe },
  Finance:      { color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400", icon: Briefcase },
  IT:           { color: "bg-slate-500/10 text-slate-600 dark:text-slate-400",   icon: Monitor },
};

const DEFAULT_CONFIG = { color: "bg-muted text-muted-foreground", icon: GitBranch };

function fmt(minutes: number): string {
  if (minutes < 60)   return `${minutes}m`;
  if (minutes < 1440) return `${Math.round(minutes / 60)}h`;
  if (minutes < 10080) return `${Math.round(minutes / 1440)}d`;
  return `${Math.round(minutes / 10080)}w`;
}

// ─── Template card ────────────────────────────────────────────────────────────

function TemplateCard({ tpl }: { tpl: typeof FLOW_TEMPLATES[0] }) {
  const cfg = CATEGORY_CONFIG[tpl.category] ?? DEFAULT_CONFIG;
  const Icon = cfg.icon;
  const href = `/automation/designer?template=${tpl.id}${tpl.standard ? `&standard=${tpl.standard}` : ""}`;

  return (
    <Card className="hover:shadow-md transition-all duration-200 group flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className={`p-2 rounded-lg shrink-0 ${cfg.color}`}>
              <Icon className="h-4 w-4" />
            </div>
            <CardTitle className="text-sm truncate">{tpl.name}</CardTitle>
          </div>
          <Badge variant="secondary" className="shrink-0 text-xs">{tpl.category}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 flex-1">
        <CardDescription className="text-xs leading-relaxed flex-1">{tpl.description}</CardDescription>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {tpl.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
              {tag}
            </span>
          ))}
        </div>

        {/* Meta */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Layers className="h-3 w-3" /> {tpl.steps} steps
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" /> ~{fmt(tpl.estimatedMinutes)}
          </span>
          {tpl.standard && (
            <Badge variant="outline" className="text-[10px] h-4">{tpl.standard}</Badge>
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          className="w-full group-hover:bg-accent group-hover:border-accent-foreground/20 transition-colors"
          asChild
        >
          <Link href={href}>
            Open in Designer
            <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AutomationTemplatesPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<FlowTemplateCategory | "all">("all");

  const filtered = useMemo(() => {
    let list = search.trim() ? searchTemplates(search) : FLOW_TEMPLATES;
    if (activeCategory !== "all") {
      list = list.filter((t) => t.category === activeCategory);
    }
    return list;
  }, [search, activeCategory]);

  const counts = useMemo(
    () => Object.fromEntries(TEMPLATE_CATEGORIES.map((c) => [c, getTemplatesByCategory(c).length])),
    []
  );

  return (
    <div className="space-y-6">
      <AutomationNavigation />

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Flow Templates</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {FLOW_TEMPLATES.length} pre-built templates — open any in the designer to customise
          </p>
        </div>
        <Button size="sm" asChild>
          <Link href="/automation/designer">
            <Zap className="mr-1.5 h-4 w-4" />
            Blank Canvas
          </Link>
        </Button>
      </div>

      {/* Search + category filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
          {search && (
            <button
              className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
              onClick={() => setSearch("")}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
          <Button
            variant={activeCategory === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory("all")}
          >
            All ({FLOW_TEMPLATES.length})
          </Button>
          {TEMPLATE_CATEGORIES.map((cat) => {
            const cfg = CATEGORY_CONFIG[cat] ?? DEFAULT_CONFIG;
            const Icon = cfg.icon;
            return (
              <Button
                key={cat}
                variant={activeCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(activeCategory === cat ? "all" : cat)}
                className="gap-1"
              >
                <Icon className="h-3 w-3" />
                {cat} ({counts[cat] ?? 0})
              </Button>
            );
          })}
        </div>
      </div>

      {/* Results count */}
      {(search || activeCategory !== "all") && (
        <p className="text-sm text-muted-foreground">
          {filtered.length} template{filtered.length !== 1 ? "s" : ""} found
        </p>
      )}

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((tpl) => (
            <TemplateCard key={tpl.id} tpl={tpl} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
          <FileText className="h-10 w-10 mb-3 opacity-30" />
          <p className="font-medium">No templates match your search</p>
          <p className="text-sm mt-1">Try a different keyword or clear the filter</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => { setSearch(""); setActiveCategory("all"); }}
          >
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}
