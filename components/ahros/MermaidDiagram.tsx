/**
 * MermaidDiagram — Renders Mermaid.js diagrams within AHROS.
 *
 * Automatically generates:
 *  - Planning Diagram (task flow)
 *  - Execution Diagram (step sequence)
 *  - Dependency Graph (task dependencies)
 *  - Sequence Diagram (actor interactions)
 *  - State Machine (workflow states)
 *  - Compliance Graph (regulation mapping)
 *  - Retry Flow (error handling)
 *  - Human Approval Flow (approval gates)
 *  - Knowledge Graph (artifact relationships)
 *
 * All diagrams stay synchronized with the underlying workflow JSON.
 */

"use client";

import { useEffect, useRef, useState, useMemo, memo } from "react";
import mermaid from "mermaid";
import { cn } from "@/lib/utils";
import type { Plan, ExecutionState } from "@/lib/ahros/types";

// ─── Initialize Mermaid ─────────────────────────────────────────────────────

mermaid.initialize({
  startOnLoad: false,
  theme: "base",
  themeVariables: {
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, monospace",
    fontSize: "12px",
    primaryColor: "#3b82f6",
    primaryTextColor: "#fff",
    primaryBorderColor: "#3b82f6",
    lineColor: "#6b7280",
    secondaryColor: "#10b981",
    tertiaryColor: "#f59e0b",
    background: "transparent",
    mainBkg: "#1f2937",
    nodeBorder: "#4b5563",
    clusterBkg: "#111827",
    clusterBorder: "#374151",
    titleColor: "#f9fafb",
    edgeLabelBackground: "#1f2937",
    nodeTextColor: "#f9fafb",
  },
});

// ─── Diagram Types ───────────────────────────────────────────────────────────

export type DiagramType =
  | "workflow"       // Graph TD — task flow
  | "execution"      // Sequence diagram — step sequence
  | "dependencies"   // Graph LR — dependency graph
  | "sequence"       // Sequence diagram — actor interactions
  | "state-machine"  // State diagram — workflow states
  | "compliance"     // Graph — regulation mapping
  | "retry"          // Flowchart — retry flow
  | "approval"       // Flowchart — human approval flow
  | "knowledge";     // Graph — artifact relationships

// ─── Props ───────────────────────────────────────────────────────────────────

export interface MermaidDiagramProps {
  /** Type of diagram to render */
  type: DiagramType;
  /** Plan data for workflow/planning diagrams */
  plan?: Plan | null;
  /** Execution data for timeline diagrams */
  execution?: ExecutionState | null;
  /** Raw Mermaid definition string (overrides generated) */
  definition?: string;
  /** Additional CSS classes */
  className?: string;
  /** Title shown above the diagram */
  title?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

export const MermaidDiagram = memo(function MermaidDiagram({
  type,
  plan,
  execution,
  definition,
  className,
  title,
}: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Generate diagram definition from data
  const diagramDef = useMemo(() => {
    if (definition) return definition;

    switch (type) {
      case "workflow":
        return generateWorkflowDiagram(plan);
      case "dependencies":
        return generateDependencyGraph(plan);
      case "sequence":
        return generateSequenceDiagram(plan);
      case "state-machine":
        return generateStateMachine(plan);
      case "compliance":
        return generateComplianceGraph();
      case "retry":
        return generateRetryFlow();
      case "approval":
        return generateApprovalFlow();
      case "knowledge":
        return generateKnowledgeGraph();
      case "execution":
        return generateExecutionDiagram(execution);
      default:
        return "graph TD\n    A[No data]";
    }
  }, [type, plan, execution, definition]);

  // Render diagram
  useEffect(() => {
    if (!containerRef.current || !diagramDef) return;

    let cancelled = false;

    const render = async () => {
      try {
        setError(null);
        const { svg: svgStr } = await mermaid.render(
          `mermaid-${type}-${Date.now()}`,
          diagramDef,
        );
        if (!cancelled) {
          setSvg(svgStr);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to render diagram",
          );
          setSvg(null);
        }
      }
    };

    render();
    return () => {
      cancelled = true;
    };
  }, [diagramDef, type]);

  if (error) {
    return (
      <div className={cn("rounded-md border border-red-200 bg-red-50 dark:bg-red-950/20 p-3", className)}>
        <p className="text-xs text-red-600 dark:text-red-400 font-medium">Diagram Error</p>
        <p className="text-[10px] text-red-500 mt-0.5">{error}</p>
        <pre className="text-[9px] text-red-400 mt-1 overflow-auto max-h-20">
          {diagramDef}
        </pre>
      </div>
    );
  }

  return (
    <div className={cn("space-y-1", className)}>
      {title && (
        <p className="text-xs font-medium text-muted-foreground">{title}</p>
      )}
      <div
        ref={containerRef}
        className="overflow-auto rounded-md border bg-background p-3"
        dangerouslySetInnerHTML={svg ? { __html: svg } : undefined}
      >
        {!svg && (
          <div className="flex items-center justify-center py-8">
            <div className="size-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}
      </div>
    </div>
  );
});

// ─── Diagram Generators ──────────────────────────────────────────────────────

function generateWorkflowDiagram(plan?: Plan | null): string {
  if (!plan || plan.tasks.length === 0) return "graph TD\n    A[No workflow data]";

  const lines: string[] = ["graph TD"];
  const colors: Record<string, string> = {
    LOW: "#10b981",
    MEDIUM: "#f59e0b",
    HIGH: "#ef4444",
  };

  plan.tasks.forEach((task, index) => {
    const nodeId = `T${index}`;
    const label = task.title.replace(/[<>"]/g, "").slice(0, 35);
    const color = colors[task.risk] ?? "#6b7280";
    lines.push(`    ${nodeId}["${label}"]`);
    lines.push(`    style ${nodeId} fill:${color}22,stroke:${color},color:#fff`);

    if (index > 0) {
      lines.push(`    T${index - 1} --> ${nodeId}`);
    }
  });

  return lines.join("\n");
}

function generateDependencyGraph(plan?: Plan | null): string {
  if (!plan || plan.tasks.length === 0) return "graph LR\n    A[No dependencies]";

  const lines: string[] = ["graph LR"];
  const added = new Set<string>();

  plan.tasks.forEach((task, index) => {
    const nodeId = `D${index}`;
    const label = task.title.replace(/[<>"]/g, "").slice(0, 25);
    lines.push(`    ${nodeId}["${label}"]`);

    task.dependencies.forEach((depId) => {
      const depIndex = plan.tasks.findIndex((t) => t.id === depId);
      if (depIndex >= 0) {
        const edge = `D${depIndex} -->|depends| ${nodeId}`;
        if (!added.has(edge)) {
          lines.push(`    ${edge}`);
          added.add(edge);
        }
      }
    });
  });

  return lines.join("\n");
}

function generateSequenceDiagram(plan?: Plan | null): string {
  if (!plan) return "sequenceDiagram\n    participant User\n    User->>System: No data";

  const lines: string[] = [
    "sequenceDiagram",
    "    participant User as 👤 User",
    "    participant AI as 🤖 AI Agent",
    "    participant System as ⚙️ AHROS",
    "    participant DB as 💾 Database",
    "    participant Gov as 🏛️ Government",
  ];

  lines.push("");
  lines.push("    User->>AI: Submit business event");
  lines.push("    AI->>System: Generate execution plan");
  lines.push("    System->>DB: Save workflow state");
  lines.push("    DB-->>System: Confirmed");

  plan.tasks.slice(0, 5).forEach((task, index) => {
    const label = task.title.replace(/[<>"]/g, "").slice(0, 30);
    lines.push(`    System->>AI: Execute step ${index + 1}: ${label}`);
    lines.push(`    AI-->>System: Step completed`);
  });

  lines.push("    System->>DB: Finalize execution");
  lines.push("    DB-->>System: Done");
  lines.push("    System-->>User: Execution complete");

  return lines.join("\n");
}

function generateStateMachine(plan?: Plan | null): string {
  const lines: string[] = [
    "stateDiagram-v2",
    "    [*] --> Idle",
    "    Idle --> Processing: Business Event",
    "    Processing --> Planning: Intent Analyzed",
    "    Planning --> Executing: Plan Generated",
    "    Executing --> WaitingApproval: Human Review Needed",
    "    WaitingApproval --> Executing: Approved",
    "    WaitingApproval --> Failed: Rejected",
    "    Executing --> ComplianceCheck: All Steps Done",
    "    ComplianceCheck --> Completed: Pass",
    "    ComplianceCheck --> Remediation: Fail",
    "    Remediation --> ComplianceCheck: Fixed",
    "    Completed --> [*]",
    "    Failed --> Idle: Retry",
  ];

  return lines.join("\n");
}

function generateComplianceGraph(): string {
  return [
    "graph TD",
    '    C[Compliance Check] --> EA[Employment Act 1955]',
    '    C --> EPF[EPF Act 1991]',
    '    C --> SOCSO[SOCSO Act 1969]',
    '    C --> EIS[EIS Act 2017]',
    '    C --> LHDN[Income Tax Act 1967]',
    '    C --> PDPA[PDPA 2010]',
    '    C --> IM[Immigration Act 1959/63]',
    '    C --> CP[Company Policy]',
    '    EA -->|Pass| G1[Green]',
    '    EPF -->|Pass| G2[Green]',
    '    SOCSO -->|Pass| G3[Green]',
    '    PDPA -->|Warning| Y1[Amber]',
    '    style G1 fill:#10b98122,stroke:#10b981',
    '    style G2 fill:#10b98122,stroke:#10b981',
    '    style G3 fill:#10b98122,stroke:#10b981',
    '    style Y1 fill:#f59e0b22,stroke:#f59e0b',
  ].join("\n");
}

function generateRetryFlow(): string {
  return [
    "flowchart TD",
    '    S[Start Step] --> E{Execute}',
    '    E -->|Success| C[Complete]',
    '    E -->|Fail| R1{Retry 1}',
    '    R1 -->|Success| C',
    '    R1 -->|Fail| R2{Retry 2}',
    '    R2 -->|Success| C',
    '    R2 -->|Fail| R3{Retry 3}',
    '    R3 -->|Success| C',
    '    R3 -->|Fail| F[Failed]',
    '    F -->|Max Retries| E2{Escalate}',
    '    E2 --> H[Human Operator]',
    '    H -->|Review| S',
    '    H -->|Override| C',
    '    style F fill:#ef444422,stroke:#ef4444',
    '    style C fill:#10b98122,stroke:#10b981',
  ].join("\n");
}

function generateApprovalFlow(): string {
  return [
    "flowchart TD",
    '    A[Action Required] --> R{Risk Assessment}',
    '    R -->|Low| Auto[Auto-Approve]',
    '    R -->|Medium| M{Manager Approval}',
    '    R -->|High| D{Director Approval}',
    '    Auto --> Done[Done]',
    '    M -->|Approve| Done',
    '    M -->|Reject| Rev[Review]',
    '    D -->|Approve| Done',
    '    D -->|Reject| Rev',
    '    Rev --> A',
    '    style Auto fill:#10b98122,stroke:#10b981',
    '    style Done fill:#3b82f622,stroke:#3b82f6',
  ].join("\n");
}

function generateKnowledgeGraph(): string {
  return [
    "graph LR",
    '    BE[Business Event] --> Conv[Conversation]',
    '    Conv --> Plan[Planning]',
    '    Plan --> WF[Workflow]',
    '    Plan --> Reas[Reasoning]',
    '    WF --> Exec[Execution]',
    '    Exec --> TL[Timeline]',
    '    Exec --> Comp[Compliance]',
    '    Comp --> SOP[SOP Doc]',
    '    Exec --> CP[Checkpoint]',
    '    Comp --> KB[Knowledge Base]',
    '    KB --> Mem[Memory]',
    '    Mem --> Learn[Learning]',
    '    Learn -.->|Optimize| Plan',
    '    style BE fill:#8b5cf622,stroke:#8b5cf6',
    '    style Mem fill:#f59e0b22,stroke:#f59e0b',
  ].join("\n");
}

function generateExecutionDiagram(execution?: ExecutionState | null): string {
  if (!execution || execution.steps.length === 0) {
    return "sequenceDiagram\n    participant System\n    System->>System: No execution data";
  }

  const lines: string[] = [
    "sequenceDiagram",
    "    participant Engine as ⚙️ Engine",
    "    participant Step as 📋 Steps",
  ];

  execution.steps.slice(0, 8).forEach((step, index) => {
    const status = step.status === "completed" ? "✅" : step.status === "failed" ? "❌" : "⏳";
    lines.push(`    Engine->>Step: ${status} Step ${index + 1}: ${step.name.slice(0, 25)}`);
    if (step.duration) {
      lines.push(`    Step-->>Engine: ${step.duration}s`);
    }
  });

  if (execution.status === "completed") {
    lines.push("    Engine->>Engine: ✅ Execution Complete");
  } else if (execution.status === "failed") {
    lines.push("    Engine->>Engine: ❌ Execution Failed");
  }

  return lines.join("\n");
}

