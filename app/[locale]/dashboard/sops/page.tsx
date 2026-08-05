"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  FileText,
  Plus,
  Search,
  ArrowRight,
  CheckCircle2,
  Clock,
  Archive,
  Edit3,
  Eye,
  GitBranch,
  Sparkles,
} from "lucide-react";
import { SOPWorkflowDashboard } from "@/components/features/automation/sop-workflow/SOPWorkflowDashboard";
import { SOPWorkflowDesigner } from "@/components/features/automation/sop-workflow/SOPWorkflowDesigner";
import { SOPAI } from "@/components/features/automation/sop-workflow/SOPAI";
import { SOPTemplates } from "@/components/features/automation/sop-workflow/templates/SOPTemplates";

// ─── Mock SOP registry ────────────────────────────────────────────────────────

type SOPStatus = "Draft" | "Review" | "Approved" | "Published" | "Archived";

interface SOPRecord {
  id: string;
  code: string;
  title: string;
  category: string;
  status: SOPStatus;
  version: string;
  owner: string;
  reviewDate: string;
  steps: number;
}

const MOCK_SOPS: SOPRecord[] = [
  { id: "s1", code: "SOP-HR-001", title: "Employee Onboarding Procedure",         category: "HR",          status: "Published", version: "3.1", owner: "HR Manager",      reviewDate: "2026-01-15", steps: 12 },
  { id: "s2", code: "SOP-HR-002", title: "Leave Application & Approval",          category: "HR",          status: "Published", version: "2.0", owner: "HR Manager",      reviewDate: "2026-03-10", steps: 7  },
  { id: "s3", code: "SOP-PAY-001", title: "Monthly Payroll Processing",           category: "Payroll",     status: "Published", version: "4.2", owner: "Finance Manager", reviewDate: "2026-02-28", steps: 10 },
  { id: "s4", code: "SOP-FW-001",  title: "Foreign Worker Permit Renewal",        category: "Compliance",  status: "Review",    version: "1.3", owner: "Compliance Mgr",  reviewDate: "2025-12-01", steps: 8  },
  { id: "s5", code: "SOP-QMS-001", title: "Internal Audit Preparation",           category: "QMS",         status: "Draft",     version: "0.2", owner: "Quality Manager", reviewDate: "—",          steps: 6  },
  { id: "s6", code: "SOP-IT-001",  title: "IT Equipment Provisioning",            category: "IT",          status: "Published", version: "2.4", owner: "IT Manager",      reviewDate: "2026-04-01", steps: 9  },
  { id: "s7", code: "SOP-HS-001",  title: "Workplace Incident Reporting",         category: "H&S",         status: "Approved",  version: "1.0", owner: "Safety Officer",  reviewDate: "2025-11-15", steps: 5  },
  { id: "s8", code: "SOP-REC-001", title: "Recruitment & Selection Process",      category: "Recruitment", status: "Published", version: "3.0", owner: "Talent Manager",  reviewDate: "2026-01-20", steps: 14 },
  { id: "s9", code: "SOP-OFF-001", title: "Employee Offboarding Clearance",       category: "HR",          status: "Draft",     version: "0.5", owner: "HR Manager",      reviewDate: "—",          steps: 11 },
];

const STATUS_CONFIG: Record<SOPStatus, { badge: string; icon: React.ElementType }> = {
  Draft:     { badge: "bg-slate-100 text-slate-700", icon: Edit3 },
  Review:    { badge: "bg-yellow-100 text-yellow-800", icon: Clock },
  Approved:  { badge: "bg-blue-100 text-blue-800", icon: CheckCircle2 },
  Published: { badge: "bg-green-100 text-green-800", icon: CheckCircle2 },
  Archived:  { badge: "bg-gray-100 text-gray-600", icon: Archive },
};

const CATEGORY_COLORS: Record<string, string> = {
  HR:          "bg-purple-100 text-purple-800",
  Payroll:     "bg-green-100 text-green-800",
  Compliance:  "bg-orange-100 text-orange-800",
  QMS:         "bg-teal-100 text-teal-800",
  IT:          "bg-blue-100 text-blue-800",
  "H&S":       "bg-red-100 text-red-800",
  Recruitment: "bg-indigo-100 text-indigo-800",
};

// ─── SOP Registry table ───────────────────────────────────────────────────────

function SOPRegistry() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState<string>("All");

  const categories = ["All", ...Array.from(new Set(MOCK_SOPS.map((s) => s.category)))];

  const filtered = MOCK_SOPS.filter((s) => {
    const matchSearch =
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.code.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === "All" || s.category === catFilter;
    return matchSearch && matchCat;
  });

  const stats = {
    total:     MOCK_SOPS.length,
    published: MOCK_SOPS.filter((s) => s.status === "Published").length,
    review:    MOCK_SOPS.filter((s) => s.status === "Review").length,
    draft:     MOCK_SOPS.filter((s) => s.status === "Draft").length,
  };

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total SOPs",      value: stats.total,     color: "text-slate-700" },
          { label: "Published",       value: stats.published, color: "text-green-600" },
          { label: "Pending Review",  value: stats.review,    color: "text-yellow-600" },
          { label: "Draft",           value: stats.draft,     color: "text-slate-400" },
        ].map((s) => (
          <Card key={s.label} className="p-4">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search by title or code…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 pl-8 text-sm"
          />
        </div>
        <div className="flex gap-1 flex-wrap">
          {categories.map((c) => (
            <Button
              key={c}
              size="sm"
              variant={catFilter === c ? "default" : "outline"}
              className="h-8 text-xs"
              onClick={() => setCatFilter(c)}
            >
              {c}
            </Button>
          ))}
        </div>
      </div>

      {/* SOP cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((sop) => {
          const cfg = STATUS_CONFIG[sop.status];
          const StatusIcon = cfg.icon;
          return (
            <Card key={sop.id} className="hover:shadow-md transition-shadow group">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-mono text-muted-foreground">{sop.code}</p>
                    <CardTitle className="text-sm mt-0.5 leading-snug">{sop.title}</CardTitle>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1 ${cfg.badge}`}>
                    <StatusIcon className="h-3 w-3" />
                    {sop.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 flex-wrap text-xs text-muted-foreground">
                  <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${CATEGORY_COLORS[sop.category] ?? "bg-muted text-foreground"}`}>
                    {sop.category}
                  </span>
                  <span>v{sop.version}</span>
                  <span>·</span>
                  <span>{sop.steps} steps</span>
                  <span>·</span>
                  <span>{sop.owner}</span>
                </div>
                {sop.reviewDate !== "—" && (
                  <p className="text-xs text-muted-foreground">
                    Next review: {new Date(sop.reviewDate).toLocaleDateString("en-MY")}
                  </p>
                )}
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 h-7 text-xs">
                    <Eye className="mr-1 h-3 w-3" /> View
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 h-7 text-xs group-hover:bg-accent"
onClick={() => router.push(`/automation/designer?template=sop-${sop.id}`)}
                  >
                    <Edit3 className="mr-1 h-3 w-3" /> Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SOPWorkflowPage() {
  const router = useRouter();
  const [templateOpen, setTemplateOpen] = useState(false);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">SOP Workflows</h1>
          <p className="text-sm text-muted-foreground">
            Manage the full lifecycle of Standard Operating Procedures
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setTemplateOpen(true)}>
            <GitBranch className="h-4 w-4 mr-1.5" />
            Load Template
          </Button>
<Button size="sm" onClick={() => router.push("/automation/designer")}>
            <Plus className="h-4 w-4 mr-1.5" />
            New SOP
          </Button>
        </div>
      </div>

      <Tabs defaultValue="registry">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="registry">SOP Registry</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="designer">Designer</TabsTrigger>
          <TabsTrigger value="ai">
            <Sparkles className="h-3.5 w-3.5 mr-1" />
            AI Assistant
          </TabsTrigger>
        </TabsList>

        <TabsContent value="registry" className="mt-4">
          <SOPRegistry />
        </TabsContent>

        <TabsContent value="dashboard" className="mt-4">
          <SOPWorkflowDashboard />
        </TabsContent>

        <TabsContent value="designer" className="mt-4">
          <div className="h-[calc(100vh-16rem)] border rounded-lg overflow-hidden">
            <SOPWorkflowDesigner />
          </div>
        </TabsContent>

        <TabsContent value="ai" className="mt-4">
          <SOPAI />
        </TabsContent>
      </Tabs>

      {/* Template picker dialog */}
      <Dialog open={templateOpen} onOpenChange={setTemplateOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Load SOP Template</DialogTitle>
            <DialogDescription>
              Select a pre-built template to start from in the designer.
            </DialogDescription>
          </DialogHeader>
          <SOPTemplates
            onLoad={(tpl) => {
              setTemplateOpen(false);
router.push(`/automation/designer?template=sop-${tpl.id}`);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
