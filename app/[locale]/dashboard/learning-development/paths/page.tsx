"use client";

import { useState } from "react";
import { toast } from "sonner";
import { TrendingUp, Plus, Download, Target, CheckCircle, Users } from "lucide-react";
import { PageShell, PageHeader } from "@/components/layout";
import {
  KpiCardGrid,
  PageContainer,
  SearchFilterBar,
  ActionButtonGroup,
  EmptyState,
} from "@/components/modules/common";
import { LearningPathList } from "@/components/features/learning-development/LearningPathList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LearningPath {
  id: string;
  name: string;
  description: string;
  courses: number;
  status: "Active" | "Archived";
}

const SAMPLE_PATHS: LearningPath[] = [
  { id: "1", name: "Frontend Engineer Track", description: "React, TypeScript, and modern frontend skills", courses: 6, status: "Active" },
  { id: "2", name: "Leadership Development", description: "Leadership and management competencies", courses: 4, status: "Active" },
  { id: "3", name: "Data Science Pathway", description: "Data analytics and machine learning fundamentals", courses: 5, status: "Archived" },
];

const STATUS_FILTER = [
  { value: "all", label: "All Statuses" },
  { value: "Active", label: "Active" },
  { value: "Archived", label: "Archived" },
];

export default function LearningPathsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = SAMPLE_PATHS.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const kpiItems = [
    {
      label: "Total Paths",
      value: SAMPLE_PATHS.length,
      icon: <TrendingUp className="h-4 w-4" />,
      color: "text-blue-600",
    },
    {
      label: "Active",
      value: SAMPLE_PATHS.filter((p) => p.status === "Active").length,
      icon: <CheckCircle className="h-4 w-4" />,
      color: "text-green-600",
    },
    {
      label: "Archived",
      value: SAMPLE_PATHS.filter((p) => p.status === "Archived").length,
      icon: <Target className="h-4 w-4" />,
      color: "text-amber-600",
    },
    {
      label: "Total Courses",
      value: SAMPLE_PATHS.reduce((sum, p) => sum + p.courses, 0),
      icon: <Users className="h-4 w-4" />,
      color: "text-purple-600",
    },
  ];

  return (
    <PageShell>
      <PageHeader
        title="Learning Paths"
        description="Structured learning journeys"
        actions={
          <ActionButtonGroup
            actions={[
              {
                label: "Export",
                variant: "outline",
                icon: <Download className="h-4 w-4" />,
                onClick: () => toast.info("Preparing export…"),
              },
              {
                label: "New",
                icon: <Plus className="h-4 w-4" />,
                onClick: () => toast.info("Opening creation wizard…"),
              },
            ]}
          />
        }
      />

      <KpiCardGrid items={kpiItems} columns={4} />

      <PageContainer>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Learning Path Records</CardTitle>
          </CardHeader>
          <CardContent>
            <SearchFilterBar
              searchValue={search}
              onSearchChange={setSearch}
              searchPlaceholder="Search learning paths…"
              filters={[
                {
                  key: "status",
                  label: "Status",
                  value: statusFilter,
                  onChange: setStatusFilter,
                  options: STATUS_FILTER,
                },
              ]}
            />
            {filtered.length === 0 ? (
              <EmptyState
                icon={<TrendingUp className="h-8 w-8" />}
                title="No learning paths found"
                description="Try adjusting your search or status filter."
                action={
                  <button
                    onClick={() => {
                      setSearch("");
                      setStatusFilter("all");
                    }}
                    className="text-sm font-medium text-blue-600 hover:underline"
                  >
                    Clear filters
                  </button>
                }
              />
            ) : (
              <LearningPathList
                paths={filtered}
                onDelete={(id) => toast.info(`Deleting path ${id}`)}
              />
            )}
          </CardContent>
        </Card>
      </PageContainer>
    </PageShell>
  );
}
