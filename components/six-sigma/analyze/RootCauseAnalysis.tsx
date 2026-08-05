"use client";

import { useState } from "react";
import {
  ChainOfThought,
  ChainOfThoughtStep,
  Suggestion,
  Suggestions,
  Artifact,
  ArtifactHeader,
  ArtifactTitle,
  ArtifactDescription,
  ArtifactContent,
  ArtifactActions,
  ArtifactAction,
  ArtifactClose,
  Sources,
  SourcesTrigger,
  SourcesContent,
  Source,
} from "../../ai-elements";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash2, AlertTriangle, CheckCircle, HelpCircle } from "lucide-react";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------
interface FMEARow {
  id: string;
  failureMode: string;
  effect: string;
  severity: number; // 1-10
  cause: string;
  occurrence: number; // 1-10
  detection: number; // 1-10
  rpn: number; // severity * occurrence * detection
  action: string;
}

interface WhyNode {
  id: string;
  question: string;
  answer: string;
  children?: WhyNode[];
}

// -----------------------------------------------------------------------------
// Mock Data
// -----------------------------------------------------------------------------
const initialFMEA: FMEARow[] = [
  {
    id: "1",
    failureMode: "Bearing seizure",
    effect: "Machine downtime, scrap parts",
    severity: 8,
    cause: "Insufficient lubrication",
    occurrence: 5,
    detection: 3,
    rpn: 120,
    action: "Implement automatic lubrication system",
  },
  {
    id: "2",
    failureMode: "Misalignment",
    effect: "Increased wear, quality defects",
    severity: 6,
    cause: "Thermal expansion",
    occurrence: 4,
    detection: 4,
    rpn: 96,
    action: "Add thermal compensation to setup",
  },
  {
    id: "3",
    failureMode: "Sensor drift",
    effect: "Incorrect readings, process upset",
    severity: 7,
    cause: "Calibration interval too long",
    occurrence: 3,
    detection: 5,
    rpn: 105,
    action: "Reduce calibration frequency to weekly",
  },
];

const initialWhyTree: WhyNode = {
  id: "root",
  question: "Why did the bearing seize?",
  answer: "Insufficient lubrication.",
  children: [
    {
      id: "1",
      question: "Why was lubrication insufficient?",
      answer: "The lubrication pump failed.",
      children: [
        {
          id: "1.1",
          question: "Why did the pump fail?",
          answer: "The filter was clogged.",
          children: [
            {
              id: "1.1.1",
              question: "Why was the filter clogged?",
              answer: "Maintenance schedule was not followed.",
              children: [],
            },
          ],
        },
      ],
    },
  ],
};

// -----------------------------------------------------------------------------
// Sub-components: 5 Whys Tree
// -----------------------------------------------------------------------------
interface WhyNodeProps {
  node: WhyNode;
  onUpdate: (id: string, newAnswer: string) => void;
  onAddChild: (id: string) => void;
  level?: number;
}

const WhyNodeComponent = ({ node, onUpdate, onAddChild, level = 0 }: WhyNodeProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(node.answer);

  const handleSave = () => {
    onUpdate(node.id, editValue);
    setIsEditing(false);
  };

  return (
    <div className="relative ml-4 border-l-2 border-muted pl-4" style={{ marginLeft: level > 0 ? "1.5rem" : 0 }}>
      <div className="flex items-start gap-2 py-1">
        <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
          {level + 1}
        </div>
        <div className="flex-1 space-y-1">
          <p className="text-sm font-medium">{node.question}</p>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="h-7 text-sm"
                  autoFocus
                />
                <Button size="sm" variant="ghost" onClick={handleSave}>
                  Save
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </div>
            ) : (
              <span className="text-sm text-muted-foreground">{node.answer}</span>
            )}
            <Button
              size="sm"
              variant="ghost"
              className="size-6"
              onClick={() => setIsEditing(true)}
            >
              <HelpCircle className="size-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="size-6"
              onClick={() => onAddChild(node.id)}
            >
              <Plus className="size-3" />
            </Button>
          </div>
        </div>
      </div>
      {node.children?.map((child) => (
        <WhyNodeComponent
          key={child.id}
          node={child}
          onUpdate={onUpdate}
          onAddChild={onAddChild}
          level={level + 1}
        />
      ))}
    </div>
  );
};

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------
export default function RootCauseAnalysis() {
  const [fmeaData, setFmeaData] = useState<FMEARow[]>(initialFMEA);
  const [whyTree, setWhyTree] = useState<WhyNode>(initialWhyTree);

  // ---------------------------------------------------------------------------
  // Handlers for FMEA
  // ---------------------------------------------------------------------------
  const deleteFMEARow = (id: string) => {
    setFmeaData((prev) => prev.filter((row) => row.id !== id));
  };

  const addFMEARow = () => {
    const newRow: FMEARow = {
      id: (Math.max(...fmeaData.map((r) => parseInt(r.id))) + 1).toString(),
      failureMode: "New mode",
      effect: "Unknown",
      severity: 5,
      cause: "Unknown",
      occurrence: 5,
      detection: 5,
      rpn: 125,
      action: "Investigate",
    };
    setFmeaData((prev) => [...prev, newRow]);
  };

  // ---------------------------------------------------------------------------
  // Handlers for 5 Whys Tree
  // ---------------------------------------------------------------------------
  const updateWhyAnswer = (id: string, newAnswer: string) => {
    const updateNode = (node: WhyNode): WhyNode => {
      if (node.id === id) {
        return { ...node, answer: newAnswer };
      }
      if (node.children) {
        return { ...node, children: node.children.map(updateNode) };
      }
      return node;
    };
    setWhyTree(updateNode);
  };

  const addWhyChild = (id: string) => {
    const addChild = (node: WhyNode): WhyNode => {
      if (node.id === id) {
        const newChild: WhyNode = {
          id: `${node.id}.${(node.children?.length ?? 0) + 1}`,
          question: "Why?",
          answer: "Unknown",
          children: [],
        };
        return {
          ...node,
          children: [...(node.children || []), newChild],
        };
      }
      if (node.children) {
        return { ...node, children: node.children.map(addChild) };
      }
      return node;
    };
    setWhyTree(addChild);
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div className="space-y-4 p-4">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Root Cause Analysis</h2>
        <p className="text-sm text-muted-foreground">
          AI‑assisted 5 Whys and FMEA for defect investigation.
        </p>
      </div>

      {/* Chain of Thought (5 Whys) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">5 Whys Analysis</CardTitle>
          <CardDescription>Drill down to root cause by repeatedly asking "Why?"</CardDescription>
        </CardHeader>
        <CardContent>
          <ChainOfThought>
            <ChainOfThoughtStep label="Why did the bearing seize?">
              Insufficient lubrication.
            </ChainOfThoughtStep>
            <ChainOfThoughtStep label="Why was lubrication insufficient?">
              The lubrication pump failed.
            </ChainOfThoughtStep>
            <ChainOfThoughtStep label="Why did the pump fail?">
              The filter was clogged.
            </ChainOfThoughtStep>
            <ChainOfThoughtStep label="Why was the filter clogged?">
              Maintenance schedule was not followed.
            </ChainOfThoughtStep>
            <ChainOfThoughtStep label="Why was maintenance not followed?">
              Lack of standard work for PM.
            </ChainOfThoughtStep>
          </ChainOfThought>
          {/* Interactive tree view */}
          <div className="mt-4 rounded-lg border p-3">
            <WhyNodeComponent
              node={whyTree}
              onUpdate={updateWhyAnswer}
              onAddChild={addWhyChild}
            />
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            Click the <HelpCircle className="inline size-3" /> to edit an answer, or <Plus className="inline size-3" /> to add a new "Why?".
          </div>
        </CardContent>
      </Card>

      {/* Suggestion */}
      <Suggestions>
        <Suggestion suggestion="Root cause identified: lack of standard PM – implement preventive maintenance schedule" />
        <Suggestion suggestion="Consider updating FMEA with this finding" />
      </Suggestions>

      {/* Artifact: FMEA Table */}
      <Artifact>
        <ArtifactHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="size-4 text-muted-foreground" />
            <ArtifactTitle>FMEA – Failure Mode & Effects Analysis</ArtifactTitle>
            <Badge variant="outline">RPN ≥ 100</Badge>
          </div>
          <ArtifactActions>
            <ArtifactAction tooltip="Add row" label="Add" icon={Plus} onClick={addFMEARow} />
            <ArtifactClose />
          </ArtifactActions>
        </ArtifactHeader>
        <ArtifactDescription className="px-4 pb-2 text-sm text-muted-foreground">
          Prioritize actions based on Risk Priority Number (RPN).
        </ArtifactDescription>
        <ArtifactContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Mode</TableHead>
                  <TableHead>Effect</TableHead>
                  <TableHead className="w-[70px] text-center">S</TableHead>
                  <TableHead>Cause</TableHead>
                  <TableHead className="w-[70px] text-center">O</TableHead>
                  <TableHead className="w-[70px] text-center">D</TableHead>
                  <TableHead className="w-[70px] text-center">RPN</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead className="w-[40px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {fmeaData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">{row.failureMode}</TableCell>
                    <TableCell>{row.effect}</TableCell>
                    <TableCell className="text-center">{row.severity}</TableCell>
                    <TableCell>{row.cause}</TableCell>
                    <TableCell className="text-center">{row.occurrence}</TableCell>
                    <TableCell className="text-center">{row.detection}</TableCell>
                    <TableCell className="text-center font-mono font-bold">
                      {row.rpn}
                    </TableCell>
                    <TableCell>{row.action}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="size-6"
                        onClick={() => deleteFMEARow(row.id)}
                      >
                        <Trash2 className="size-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            RPN = Severity × Occurrence × Detection. Focus on high RPN items first.
          </div>
        </ArtifactContent>
      </Artifact>

      {/* Sources */}
      <Sources>
        <SourcesTrigger count={2} />
        <SourcesContent>
          <Source title="FMEA Template – Q2 2026" href="/dashboard/documents/templates" />
          <Source title="Defect History Database" href="/dashboard/reports/compliance" />
        </SourcesContent>
      </Sources>
    </div>
  );
}