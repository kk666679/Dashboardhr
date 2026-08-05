"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Award, Plus, Download, BookOpen, AlertCircle, CheckCircle } from "lucide-react";
import { PageShell, PageHeader } from "@/components/layout";
import {
  KpiCardGrid,
  PageContainer,
  SearchFilterBar,
  ActionButtonGroup,
  EmptyState,
} from "@/components/modules/common";
import { CertificationList } from "@/components/features/learning-development/CertificationList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Certification {
  id: string;
  employee: string;
  course: string;
  issuedDate: string;
  expiryDate: string | null;
  status: "Active" | "Expired" | "Revoked";
}

const SAMPLE_CERTIFICATIONS: Certification[] = [
  { id: "1", employee: "John Doe", course: "AWS Certified Developer", issuedDate: "2025-01-15", expiryDate: "2028-01-15", status: "Active" },
  { id: "2", employee: "Jane Smith", course: "Project Management Professional", issuedDate: "2022-07-01", expiryDate: "2026-07-01", status: "Active" },
  { id: "3", employee: "Mike Wilson", course: "Six Sigma Green Belt", issuedDate: "2024-03-01", expiryDate: null, status: "Active" },
];

const STATUS_FILTER = [
  { value: "all", label: "All Statuses" },
  { value: "Active", label: "Active" },
  { value: "Expired", label: "Expired" },
  { value: "Revoked", label: "Revoked" },
];

export default function CertificationsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = SAMPLE_CERTIFICATIONS.filter((c) => {
    const matchesSearch =
      c.employee.toLowerCase().includes(search.toLowerCase()) ||
      c.course.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const kpiItems = [
    {
      label: "Total Certifications",
      value: SAMPLE_CERTIFICATIONS.length,
      icon: <Award className="h-4 w-4" />,
      color: "text-blue-600",
    },
    {
      label: "Active",
      value: SAMPLE_CERTIFICATIONS.filter((c) => c.status === "Active").length,
      icon: <CheckCircle className="h-4 w-4" />,
      color: "text-green-600",
    },
    {
      label: "Expired",
      value: SAMPLE_CERTIFICATIONS.filter((c) => c.status === "Expired").length,
      icon: <AlertCircle className="h-4 w-4" />,
      color: "text-amber-600",
    },
    {
      label: "Courses Covered",
      value: new Set(SAMPLE_CERTIFICATIONS.map((c) => c.course)).size,
      icon: <BookOpen className="h-4 w-4" />,
      color: "text-purple-600",
    },
  ];

  return (
    <PageShell>
      <PageHeader
        title="Certifications"
        description="Professional certifications tracking"
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
            <CardTitle className="text-sm font-semibold">Certification Records</CardTitle>
          </CardHeader>
          <CardContent>
            <SearchFilterBar
              searchValue={search}
              onSearchChange={setSearch}
              searchPlaceholder="Search certifications…"
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
                icon={<Award className="h-8 w-8" />}
                title="No certifications found"
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
              <CertificationList
                certifications={filtered}
                onRevoke={(id) => toast.info(`Revoking certification ${id}`)}
              />
            )}
          </CardContent>
        </Card>
      </PageContainer>
    </PageShell>
  );
}
