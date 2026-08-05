"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft, Edit, Download, Share2, MoreHorizontal, RefreshCw,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const TABS = [{ id: "overview", label: "Overview" }, { id: "candidates", label: "Candidates" }, { id: "interviews", label: "Interviews" }, { id: "offers", label: "Offers" }, { id: "activity", label: "Activity" }];

export default function VacancyDetailsPage() {
  const params   = useParams();
  const router   = useRouter();
  const locale   = (params?.locale as string) || "en";
  const entityId = params?.vacancyId as string;
  const [tab, setTab]     = useState("overview");
  const [loading]         = useState(false);

  if (loading) return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-32 w-full rounded-xl" />
      <Skeleton className="h-48 w-full rounded-xl" />
    </div>
  );

  return (
    <div>
      {/* Back + Actions */}
      <div className="mb-5 flex items-center justify-between gap-3 flex-wrap">
        <Button variant="ghost" size="sm" className="gap-1.5 -ml-2" onClick={() => router.back()}>
          <ArrowLeft className="size-3.5" />
          Back
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => toast.info("Opening editor…")}>
            <Edit className="size-3.5" /> Edit
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => toast.info("Generating PDF…")}>
            <Download className="size-3.5" /> Export
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => toast.info("Share link copied")}>
            <Share2 className="size-3.5" /> Share
          </Button>
        </div>
      </div>

      {/* Header card */}
      <Card className="mb-5">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-lg font-bold text-[var(--foreground)]">Vacancy Details</h1>
              <p className="text-sm text-[var(--foreground-muted)] mt-0.5">ID: {entityId}</p>
            </div>
            <Badge variant="secondary">Active</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-4 flex-wrap h-auto gap-1">
          {TABS.map((t) => (
            <TabsTrigger key={t.id} value={t.id} className="text-xs">{t.label}</TabsTrigger>
          ))}
        </TabsList>

        {TABS.map((t) => (
          <TabsContent key={t.id} value={t.id}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">{t.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12 text-center gap-2">
                  <p className="text-sm text-[var(--foreground-muted)]">{t.label} content for {entityId}</p>
                  <Button size="sm" variant="outline" onClick={() => toast.info(`Loading ${t.label}…`)}>
                    <RefreshCw className="size-3.5 mr-1.5" />
                    Load Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
