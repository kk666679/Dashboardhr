"use client";

import { useState } from "react";
import { useSemanticSearch } from "@/hooks/useSemanticSearch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  Users,
  FileText,
  Shield,
  TrendingUp,
  Download,
  Filter,
  Sparkles,
  Clock,
} from "lucide-react";

type SearchKind = "employees" | "documents" | "rules" | "all";

const KIND_CONFIG = {
  employee: { label: "Employee", icon: Users, color: "bg-blue-100 text-blue-800" },
  document: { label: "Document", icon: FileText, color: "bg-amber-100 text-amber-800" },
  rule: { label: "Rule", icon: Shield, color: "bg-green-100 text-green-800" },
};

export default function SemanticSearchPage() {
  const [kind, setKind] = useState<SearchKind>("all");
  const [topK, setTopK] = useState(12);
  const { query, setQuery, results, isLoading } = useSemanticSearch({ kind, topK });

  const stats = {
    employees: results.filter((r) => r.kind === "employee").length,
    documents: results.filter((r) => r.kind === "document").length,
    rules: results.filter((r) => r.kind === "rule").length,
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Sparkles className="h-8 w-8 text-purple-600" />
              Semantic Search
            </h1>
            <p className="text-muted-foreground mt-1">
              AI-powered search across employees, documents, and compliance rules
            </p>
          </div>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Results
          </Button>
        </div>

        {/* Search Bar */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                className="pl-12 h-12 text-lg"
                placeholder="Search employees, documents, compliance rules…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            {/* Filter Tabs */}
            <Tabs value={kind} onValueChange={(v) => setKind(v as SearchKind)} className="mt-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All Results</TabsTrigger>
                <TabsTrigger value="employees">
                  <Users className="h-4 w-4 mr-2" />
                  Employees
                </TabsTrigger>
                <TabsTrigger value="documents">
                  <FileText className="h-4 w-4 mr-2" />
                  Documents
                </TabsTrigger>
                <TabsTrigger value="rules">
                  <Shield className="h-4 w-4 mr-2" />
                  Rules
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        {query.length >= 2 && !isLoading && results.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Results</p>
                    <p className="text-2xl font-bold">{results.length}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Employees</p>
                    <p className="text-2xl font-bold">{stats.employees}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Documents</p>
                    <p className="text-2xl font-bold">{stats.documents}</p>
                  </div>
                  <FileText className="h-8 w-8 text-amber-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Rules</p>
                    <p className="text-2xl font-bold">{stats.rules}</p>
                  </div>
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Results */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Search Results</span>
                  {results.length > 0 && (
                    <Badge variant="secondary">{results.length} found</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading && (
                  <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-24 w-full" />
                    ))}
                  </div>
                )}

                {!isLoading && results.length > 0 && (
                  <div className="space-y-3">
                    {results.map((r) => {
                      const config = KIND_CONFIG[r.kind as keyof typeof KIND_CONFIG];
                      const Icon = config.icon;
                      return (
                        <Card key={r.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="pt-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-start gap-3 flex-1 min-w-0">
                                <div className="mt-1">
                                  <Icon className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Badge className={config.color}>{config.label}</Badge>
                                    <h3 className="font-semibold truncate">
                                      {"name" in r.meta
                                        ? (r.meta as { name: string }).name
                                        : "type" in r.meta
                                          ? (r.meta as { type: string }).type
                                          : (r.meta as { ruleType: string }).ruleType}
                                    </h3>
                                  </div>
                                  <div className="text-sm text-muted-foreground space-y-1">
                                    {"position" in r.meta && (
                                      <p>Position: {(r.meta as { position?: string }).position}</p>
                                    )}
                                    {"department" in r.meta && (
                                      <p>Department: {(r.meta as { department?: string }).department}</p>
                                    )}
                                    {"nationality" in r.meta && (
                                      <p>Nationality: {(r.meta as { nationality?: string }).nationality}</p>
                                    )}
                                    {"country" in r.meta && (
                                      <p>Country: {(r.meta as { country?: string }).country}</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <Badge variant="outline" className="shrink-0 tabular-nums">
                                {(r.score * 100).toFixed(0)}%
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}

                {!isLoading && query.length >= 2 && results.length === 0 && (
                  <div className="text-center py-12">
                    <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium">No results found</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Try adjusting your search terms or filters
                    </p>
                  </div>
                )}

                {!isLoading && query.length < 2 && (
                  <div className="text-center py-12">
                    <Sparkles className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                    <p className="text-lg font-medium">Start searching</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Enter at least 2 characters to begin semantic search
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Search Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Results Limit</label>
                  <select
                    className="w-full border rounded-md px-3 py-2 text-sm"
                    value={topK}
                    onChange={(e) => setTopK(Number(e.target.value))}
                  >
                    <option value={5}>5 results</option>
                    <option value={10}>10 results</option>
                    <option value={12}>12 results</option>
                    <option value={20}>20 results</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Quick Searches
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {["Malaysian workers", "Expired permits", "Engineering roles", "Compliance rules"].map((suggestion) => (
                    <Button
                      key={suggestion}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setQuery(suggestion)}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">How It Works</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>Semantic search uses AI embeddings to understand meaning, not just keywords.</p>
                <p>Results are ranked by relevance score (0-100%).</p>
                <p>Search across employees, documents, and compliance rules simultaneously.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
