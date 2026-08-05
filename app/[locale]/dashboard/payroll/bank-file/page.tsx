"use client";

import { useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import {
  PageHeader,
  StatsGrid,
  TableToolbar,
  EmptyState,
  PageSkeleton,
} from "@/components/layout/page-template";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
  BarChart3, CheckCircle, Clock, Calendar, Plus, Download,
  Upload, RefreshCw, Eye, Edit, Trash2, BanknoteIcon,
} from "lucide-react";

export default function BankFileGenerationPage() {
  const router  = useRouter();
  const params  = useParams();
  const locale  = (params?.locale as string) || "en";
  const withLocale = (path: string) => `/${locale}${path}`;

  const [loading, setLoading] = useState(false);
  const [search, setSearch]   = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    toast.success("Data refreshed");
  }, []);

  if (loading) return <PageSkeleton />;

  const stats = [
    { label: "Total", value: "—", icon: BarChart3 },
    { label: "Active", value: "—", icon: CheckCircle },
    { label: "Pending", value: "—", icon: Clock },
    { label: "This Month", value: "—", icon: Calendar },
  ];

  return (
    <div>
      <PageHeader
        title="Bank File Generation"
        description="Generate bank transfer files for salary payment"
        actions={[
          {
            label: "New",
            icon:  Plus,
            variant: "default",
            onClick: () => toast.info("Opening creation wizard…"),
          },
          {
            label: "Export",
            icon:  Download,
            variant: "outline",
            onClick: () => toast.info("Preparing export…"),
          },
          {
            label: "Refresh",
            icon:  RefreshCw,
            variant: "outline",
            onClick: refresh,
          },
        ]}
      />

      <StatsGrid stats={stats} />

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Bank File Generation Records</CardTitle>
        </CardHeader>
        <CardContent>
          <TableToolbar
            searchPlaceholder="Search bank file generation…"
            onSearch={setSearch}
            onFilter={() => toast.info("Filter panel")}
            onExport={() => toast.info("Exporting…")}
            onImport={() => toast.info("Opening import wizard…")}
            onRefresh={refresh}
          />
          <EmptyState
            icon={BanknoteIcon}
            title="No Bank File Generation records yet"
            description="Create your first record to get started."
            action={{
              label: "Create Bank",
              onClick: () => toast.info("Opening wizard…"),
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
