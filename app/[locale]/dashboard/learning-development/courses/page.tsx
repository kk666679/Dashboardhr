"use client";

import { useState } from "react";
import { toast } from "sonner";
import { BookOpen, Plus, Download, GraduationCap, Award, Users } from "lucide-react";
import { PageShell, PageHeader } from "@/components/layout";
import {
  KpiCardGrid,
  PageContainer,
  SearchFilterBar,
  ActionButtonGroup,
  EmptyState,
} from "@/components/modules/common";
import { CourseList } from "@/components/features/learning-development/CourseList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Course {
  id: string;
  title: string;
  category: string;
  duration: string;
  status: "Published" | "Draft" | "Archived";
  enrollments: number;
}

const SAMPLE_COURSES: Course[] = [
  { id: "1", title: "Advanced React & TypeScript", category: "Technical", duration: "6 weeks", status: "Published", enrollments: 25 },
  { id: "2", title: "Leadership Essentials", category: "Leadership", duration: "4 weeks", status: "Published", enrollments: 15 },
  { id: "3", title: "Data Analytics Bootcamp", category: "Technical", duration: "8 weeks", status: "Draft", enrollments: 0 },
  { id: "4", title: "Conflict Resolution", category: "Soft Skills", duration: "2 days", status: "Published", enrollments: 30 },
];

const COURSE_STATUS_FILTER = [
  { value: "all", label: "All Statuses" },
  { value: "Published", label: "Published" },
  { value: "Draft", label: "Draft" },
  { value: "Archived", label: "Archived" },
];

export default function CoursesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = SAMPLE_COURSES.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const kpiItems = [
    {
      label: "Total Courses",
      value: SAMPLE_COURSES.length,
      icon: <BookOpen className="h-4 w-4" />,
      color: "text-blue-600",
    },
    {
      label: "Published",
      value: SAMPLE_COURSES.filter((c) => c.status === "Published").length,
      icon: <GraduationCap className="h-4 w-4" />,
      color: "text-green-600",
    },
    {
      label: "Drafts",
      value: SAMPLE_COURSES.filter((c) => c.status === "Draft").length,
      icon: <Award className="h-4 w-4" />,
      color: "text-amber-600",
    },
    {
      label: "Total Enrollments",
      value: SAMPLE_COURSES.reduce((sum, c) => sum + c.enrollments, 0),
      icon: <Users className="h-4 w-4" />,
      color: "text-purple-600",
    },
  ];

  return (
    <PageShell>
      <PageHeader
        title="Courses"
        description="Training course catalogue"
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
            <CardTitle className="text-sm font-semibold">Course Records</CardTitle>
          </CardHeader>
          <CardContent>
            <SearchFilterBar
              searchValue={search}
              onSearchChange={setSearch}
              searchPlaceholder="Search courses…"
              filters={[
                {
                  key: "status",
                  label: "Status",
                  value: statusFilter,
                  onChange: setStatusFilter,
                  options: COURSE_STATUS_FILTER,
                },
              ]}
            />
            {filtered.length === 0 ? (
              <EmptyState
                icon={<BookOpen className="h-8 w-8" />}
                title="No courses found"
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
              <CourseList
                courses={filtered}
                onDelete={(id) => toast.info(`Deleting course ${id}`)}
              />
            )}
          </CardContent>
        </Card>
      </PageContainer>
    </PageShell>
  );
}
