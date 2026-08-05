"use client";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { PageHeader, StatsGrid, TableToolbar, EmptyState, PageSkeleton } from "@/components/layout/page-template";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useCallback } from "react";
import { Shield, CheckCircle, Clock, AlertTriangle, Plus, Download, RefreshCw } from "lucide-react";

export default function ComplianceAuditPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    toast.success("Audit data refreshed");
  }, []);

  if (loading) return <PageSkeleton />;

  const stats = [
    { label: "Total Audits", value: "—", icon: Shield },
    { label: "Completed", value: "—", icon: CheckCircle },
    { label: "In Progress", value: "—", icon: Clock },
    { label: "Findings", value: "—", icon: AlertTriangle },
  ];

  return (
    <div>
      <PageHeader
        title="Compliance Audits"
        description="Track and manage all compliance audits"
        actions={[
          { label: "New Audit", icon: Plus, variant: "default", onClick: () => router.push(`/${locale}/dashboard/compliance/audit/new`) },
          { label: "Export", icon: Download, variant: "outline", onClick: () => toast.info("Preparing export…") },
          { label: "Refresh", icon: RefreshCw, variant: "outline", onClick: refresh },
        ]}
      />
      <StatsGrid stats={stats} />
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Audit Records</CardTitle>
        </CardHeader>
        <CardContent>
          <TableToolbar
            searchPlaceholder="Search audits…"
            onSearch={setSearch}
            onFilter={() => toast.info("Filter panel")}
            onExport={() => toast.info("Exporting…")}
            onRefresh={refresh}
          />
          <EmptyState
            icon={Shield}
            title="No audit records yet"
            description="Start a new compliance audit to track regulatory adherence."
            action={{ label: "New Audit", onClick: () => router.push(`/${locale}/dashboard/compliance/audit/new`) }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
