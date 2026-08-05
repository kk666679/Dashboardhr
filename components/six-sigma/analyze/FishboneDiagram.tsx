"use client";

import { useState } from "react";
import { useRive, Layout, Fit, Alignment } from "@rive-app/react-webgl2";
import {
  Reasoning,
  ReasoningTrigger,
  ReasoningContent,
  Suggestion,
  Suggestions,
  Artifact,
  ArtifactHeader,
  ArtifactTitle,
  ArtifactContent,
  ArtifactDescription,
  ArtifactActions,
  ArtifactAction,
  ArtifactClose,
  Sources,
  SourcesTrigger,
  SourcesContent,
  Source,
} from "../../ai-elements";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Layers,
  Users,
  Wrench,
  Gauge,
  Factory,
  Package,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

// -----------------------------------------------------------------------------
// Mock Data for Categories & Causes
// -----------------------------------------------------------------------------
interface Cause {
  id: string;
  label: string;
  selected?: boolean;
}

interface Category {
  id: string;
  label: string;
  icon: React.ReactNode;
  causes: Cause[];
}

const categories: Category[] = [
  {
    id: "materials",
    label: "Materials",
    icon: <Package className="size-4" />,
    causes: [
      { id: "m1", label: "Poor quality raw material" },
      { id: "m2", label: "Incorrect specification" },
      { id: "m3", label: "Contamination" },
    ],
  },
  {
    id: "methods",
    label: "Methods",
    icon: <Layers className="size-4" />,
    causes: [
      { id: "me1", label: "Inadequate process design" },
      { id: "me2", label: "Lack of standard work" },
      { id: "me3", label: "Poor training" },
    ],
  },
  {
    id: "machines",
    label: "Machines",
    icon: <Factory className="size-4" />,
    causes: [
      { id: "ma1", label: "Equipment wear" },
      { id: "ma2", label: "Calibration errors" },
      { id: "ma3", label: "Maintenance issues" },
    ],
  },
  {
    id: "measurement",
    label: "Measurement",
    icon: <Gauge className="size-4" />,
    causes: [
      { id: "mea1", label: "Gauge error" },
      { id: "mea2", label: "Measurement technique" },
      { id: "mea3", label: "Data recording mistakes" },
    ],
  },
  {
    id: "environment",
    label: "Environment",
    icon: <Factory className="size-4" />, // placeholder
    causes: [
      { id: "e1", label: "Temperature variation" },
      { id: "e2", label: "Humidity" },
      { id: "e3", label: "Lighting" },
    ],
  },
  {
    id: "people",
    label: "People",
    icon: <Users className="size-4" />,
    causes: [
      { id: "p1", label: "Skill gaps" },
      { id: "p2", label: "Fatigue" },
      { id: "p3", label: "Lack of motivation" },
    ],
  },
];

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------
export default function FishBoneDiagram() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [highlightedCauses, setHighlightedCauses] = useState<string[]>([]);

  // Rive setup – assuming we have a fishbone.riv file in public/
  const { RiveComponent } = useRive({
    src: "/fishbone.riv",
    stateMachines: "Fishbone", // optional, if we have a state machine
    autoplay: true,
    layout: new Layout({
      fit: Fit.FitWidth,
      alignment: Alignment.Center,
    }),
  });

  // Toggle category selection (simulate highlighting)
  const toggleCategory = (categoryId: string) => {
    setSelectedCategory((prev) => (prev === categoryId ? null : categoryId));
    // In a full implementation, we'd send an input to Rive to highlight that branch
  };

  // Toggle a specific cause (for highlighting)
  const toggleCause = (causeId: string) => {
    setHighlightedCauses((prev) =>
      prev.includes(causeId)
        ? prev.filter((id) => id !== causeId)
        : [...prev, causeId]
    );
  };

  return (
    <div className="space-y-4 p-4">
      {/* Header: Reasoning & Suggestion */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Reasoning>
          <ReasoningTrigger />
          <ReasoningContent>Categorizing potential causes using Fishbone method. Identifying top contributors via Pareto analysis.</ReasoningContent>
        </Reasoning>
        <Suggestions>
          <Suggestion suggestion="Material quality is the most likely root cause (42% of defects)" />
        </Suggestions>
      </div>

      {/* Main Artifact: Fishbone Diagram */}
      <Artifact>
        <ArtifactHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="size-4 text-muted-foreground" />
            <ArtifactTitle>Fishbone Diagram – Defect Analysis</ArtifactTitle>
            <Badge variant="outline">v1.2</Badge>
          </div>
          <ArtifactActions>
            <ArtifactAction tooltip="Export as image" label="Export" icon={Layers} />
            <ArtifactAction tooltip="Reset view" label="Reset" icon={CheckCircle} />
            <ArtifactClose />
          </ArtifactActions>
        </ArtifactHeader>

        <ArtifactDescription className="px-4 pb-2 text-sm text-muted-foreground">
          Cause‑and‑effect analysis for defect Y – click a category to highlight.
        </ArtifactDescription>

        <ArtifactContent className="min-h-[400px]">
          {/* Rive diagram */}
          <div className="relative w-full h-[400px] bg-muted/20 rounded-lg overflow-hidden">
            <RiveComponent className="w-full h-full" />
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-muted-foreground/20 text-sm">
              (Fishbone diagram rendered with Rive)
            </div>
          </div>

          {/* Category legend / interactive toggles */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? "default" : "outline"}
                size="sm"
                className="gap-1 text-xs"
                onClick={() => toggleCategory(cat.id)}
              >
                {cat.icon}
                {cat.label}
              </Button>
            ))}
          </div>
        </ArtifactContent>
      </Artifact>

      {/* Causes breakdown (AI‑enhanced) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <Card
            key={cat.id}
            className={`cursor-pointer transition-colors ${
              selectedCategory === cat.id ? "border-primary" : ""
            }`}
            onClick={() => toggleCategory(cat.id)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                {cat.icon}
                {cat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1">
                {cat.causes.map((cause) => (
                  <li
                    key={cause.id}
                    className={`text-xs flex items-center gap-1 px-2 py-1 rounded-md ${
                      highlightedCauses.includes(cause.id)
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-muted"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCause(cause.id);
                    }}
                  >
                    <span className="size-1.5 rounded-full bg-muted-foreground/40" />
                    {cause.label}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sources */}
      <Sources>
        <SourcesTrigger count={2} />
        <SourcesContent>
          <Source title="Defect Log – Q2 2026" href="/dashboard/reports/compliance" />
          <Source title="Process Capability Report" href="/dashboard/reports/workforce" />
        </SourcesContent>
      </Sources>
    </div>
  );
}