"use client";
/**
 * Benefits Administration Dashboard — Sprint 16
 * Plan management and enrolment overview.
 * Requirements: 16.1–16.7
 */
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader, PageShell } from "@/components/layout/page-shell";
import { Heart, Plus } from "lucide-react";

// ─── Type Definitions ────────────────────────────────────────────────────────

type PlanType = "MEDICAL" | "DENTAL" | "VISION" | "LIFE_INSURANCE" | "PENSION" | "WELLNESS" | "OTHER";

interface BenefitPlan {
  id: string;
  name: string;
  planType: PlanType;
  description: string | null;
  isActive: boolean;
  enrolmentDeadline: Date | string | null;
  _count?: {
    enrolments: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface BenefitFormData {
  name: string;
  planType: PlanType;
  description: string;
}

// ─── Constants ──────────────────────────────────────────────────────────────

const PLAN_TYPES: PlanType[] = ["MEDICAL", "DENTAL", "VISION", "LIFE_INSURANCE", "PENSION", "WELLNESS", "OTHER"];

const TYPE_BADGE: Record<PlanType, string> = {
  MEDICAL: "bg-red-100 text-red-800",
  DENTAL: "bg-blue-100 text-blue-800",
  VISION: "bg-purple-100 text-purple-800",
  LIFE_INSURANCE: "bg-green-100 text-green-800",
  PENSION: "bg-orange-100 text-orange-800",
  WELLNESS: "bg-teal-100 text-teal-800",
  OTHER: "bg-slate-100 text-slate-700",
};

const PLAN_TYPE_LABELS: Record<PlanType, string> = {
  MEDICAL: "Medical",
  DENTAL: "Dental",
  VISION: "Vision",
  LIFE_INSURANCE: "Life Insurance",
  PENSION: "Pension",
  WELLNESS: "Wellness",
  OTHER: "Other",
};

// ─── Component ──────────────────────────────────────────────────────────────

export default function BenefitsPage() {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [form, setForm] = useState<BenefitFormData>({
    name: "",
    planType: "MEDICAL",
    description: "",
  });

  const { data: plans, refetch } = trpc.benefits.listPlans.useQuery({});
  const createPlan = trpc.benefits.createPlan.useMutation({
    onSuccess: () => {
      refetch();
      setShowForm(false);
      // Reset form
      setForm({
        name: "",
        planType: "MEDICAL",
        description: "",
      });
    },
  });

  const handleFormChange = (key: keyof BenefitFormData, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleCreatePlan = () => {
    if (!form.name.trim()) return;
    
    createPlan.mutate({
      name: form.name.trim(),
      planType: form.planType,
      description: form.description.trim() || undefined,
    });
  };

  const formatDate = (date: Date | string | null): string => {
    if (!date) return "";
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString();
  };

  const getBadgeColor = (planType: PlanType): string => {
    return TYPE_BADGE[planType] || "bg-slate-100 text-slate-700";
  };

  const getPlanTypeLabel = (planType: PlanType): string => {
    return PLAN_TYPE_LABELS[planType] || planType.replace(/_/g, " ");
  };

  return (
    <PageShell className="space-y-6">
      <PageHeader
        title="Benefits Administration"
        description="Manage benefit plans and employee enrolments"
        actions={
          <Button onClick={() => setShowForm(!showForm)} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            New Plan
          </Button>
        }
        badge={<Heart className="h-4 w-4 text-primary" />}
      />

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Create Benefit Plan</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-3">
            <Input
              placeholder="Plan name"
              value={form.name}
              onChange={(e) => handleFormChange("name", e.target.value)}
            />
            <Select
              value={form.planType}
              onValueChange={(value: PlanType) => handleFormChange("planType", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PLAN_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {getPlanTypeLabel(type)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Description"
              value={form.description}
              onChange={(e) => handleFormChange("description", e.target.value)}
            />
            <div className="sm:col-span-3 flex gap-2">
              <Button
                onClick={handleCreatePlan}
                disabled={!form.name.trim() || createPlan.isPending}
              >
                {createPlan.isPending ? "Creating…" : "Create Plan"}
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {!plans?.length ? (
          <p className="text-sm text-muted-foreground col-span-full text-center py-8">
            No benefit plans configured yet
          </p>
        ) : (
          (plans as BenefitPlan[]).map((plan: BenefitPlan) => (
            <Card key={plan.id} className="h-full">
              <CardContent className="pt-4 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-semibold">{plan.name}</h3>
                    {plan.description && (
                      <p className="text-xs text-muted-foreground">
                        {plan.description}
                      </p>
                    )}
                  </div>
                  <Badge className={getBadgeColor(plan.planType)}>
                    {getPlanTypeLabel(plan.planType)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="text-muted-foreground">
                    {plan._count?.enrolments ?? 0} enrolled
                  </span>
                  <Badge variant={plan.isActive ? "default" : "outline"}>
                    {plan.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                {plan.enrolmentDeadline && (
                  <p className="text-xs text-muted-foreground">
                    Deadline: {formatDate(plan.enrolmentDeadline)}
                  </p>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </PageShell>
  );
}