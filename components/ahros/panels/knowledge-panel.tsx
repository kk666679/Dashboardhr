/**
 * KnowledgePanel — Knowledge tree navigation panel.
 *
 * Uses the FileTree component from ai-elements to display
 * a navigable tree of generated assets from AHROS executions.
 *
 * Represents:
 *  Employee/
 *  ├── Workflow.json
 *  ├── SOP.md
 *  ├── Audit.pdf
 *  ├── Compliance.md
 *  ├── Timeline.json
 *  ├── Reasoning.md
 *  ├── Execution.log
 *  ├── Checkpoints/
 *  ├── Knowledge/
 *  └── Reports/
 */

"use client";

import { useMemo, useCallback, useState } from "react";
import {
  FileTree,
  FileTreeFile,
  FileTreeFolder,
} from "@/components/ai-elements/file-tree";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useAhrosStore } from "@/lib/zustand/ahros-store";
import { useArtifactStore } from "@/lib/zustand/artifact-store";
import {
  FolderTreeIcon,
  FileJsonIcon,
  FileTextIcon,
  FileSpreadsheetIcon,
  FolderOpenIcon,
  FileIcon,
} from "lucide-react";

interface KnowledgeNode {
  type: "folder" | "file";
  name: string;
  children?: KnowledgeNode[];
  artifactId?: string;
  icon?: React.ReactNode;
}

export function KnowledgePanel() {
  const activeArtifactIds = useAhrosStore((s) => s.activeArtifactIds);
  const artifactStore = useArtifactStore();
  const [selectedPath, setSelectedPath] = useState<string | undefined>();
  const [expandedPaths] = useState<Set<string>>(
    new Set(["employee"]),
  );

  // Build knowledge tree from active artifacts
  const knowledgeTree = useMemo((): KnowledgeNode => {
    const artifacts = activeArtifactIds
      .map((id) => artifactStore.getArtifact(id))
      .filter(Boolean);

    return {
      type: "folder",
      name: "Knowledge Base",
      children: [
        {
          type: "folder",
          name: "Executions",
          children: artifacts.map((a) => ({
            type: "file" as const,
            name: `${a!.meta.title.replace(/\s+/g, "-")}.json`,
            artifactId: a!.meta.id,
            icon: <FileJsonIcon className="size-4 text-blue-500" />,
          })),
        },
        {
          type: "folder",
          name: "Workflows",
          children: artifacts
            .filter((a) => a?.meta.type === "workflow")
            .map((a) => ({
              type: "file" as const,
              name: `${a!.meta.title.replace(/\s+/g, "-")}.json`,
              artifactId: a!.meta.id,
              icon: <FileJsonIcon className="size-4 text-green-500" />,
            })),
          ...(artifacts.filter((a) => a?.meta.type === "workflow").length === 0
            ? []
            : []),
        },
        {
          type: "folder",
          name: "Compliance",
          children: artifacts
            .filter((a) => a?.meta.type === "compliance")
            .map((a) => ({
              type: "file" as const,
              name: `${a!.meta.title.replace(/\s+/g, "-")}.md`,
              artifactId: a!.meta.id,
              icon: <FileTextIcon className="size-4 text-amber-500" />,
            })),
        },
        {
          type: "folder",
          name: "SOPs",
          children: artifacts
            .filter((a) => a?.meta.type === "sop")
            .map((a) => ({
              type: "file" as const,
              name: `${a!.meta.title.replace(/\s+/g, "-")}.md`,
              artifactId: a!.meta.id,
              icon: <FileTextIcon className="size-4 text-purple-500" />,
            })),
        },
        {
          type: "folder",
          name: "Timelines",
          children: artifacts
            .filter((a) => a?.meta.type === "timeline")
            .map((a) => ({
              type: "file" as const,
              name: `${a!.meta.title.replace(/\s+/g, "-")}.json`,
              artifactId: a!.meta.id,
              icon: <FileJsonIcon className="size-4 text-cyan-500" />,
            })),
        },
        {
          type: "folder",
          name: "Checkpoints",
          children: artifacts
            .filter((a) => a?.meta.type === "checkpoint")
            .map((a) => ({
              type: "file" as const,
              name: `v${a!.meta.version}-${a!.meta.id.slice(0, 8)}.json`,
              artifactId: a!.meta.id,
              icon: <FileIcon className="size-4 text-muted-foreground" />,
            })),
        },
        {
          type: "folder",
          name: "Reports",
          children: artifacts
            .filter(
              (a) =>
                a?.meta.type === "report" || a?.meta.type === "audit",
            )
            .map((a) => ({
              type: "file" as const,
              name: `${a!.meta.title.replace(/\s+/g, "-")}.pdf`,
              artifactId: a!.meta.id,
              icon: <FileSpreadsheetIcon className="size-4 text-red-500" />,
            })),
        },
        {
          type: "folder",
          name: "Knowledge",
          children: [],
        },
      ],
    };
  }, [activeArtifactIds, artifactStore]);

  const countNodes = useMemo(() => {
    let count = 0;
    const countRecursive = (node: KnowledgeNode) => {
      if (node.type === "file") count++;
      node.children?.forEach(countRecursive);
    };
    countRecursive(knowledgeTree);
    return count;
  }, [knowledgeTree]);

  const handleSelect = useCallback(
    (path: string) => {
      setSelectedPath(path);
      // Could trigger artifact detail view here
    },
    [],
  );

  const renderTree = useCallback(
    (node: KnowledgeNode, parentPath = "") => {
      const currentPath = parentPath
        ? `${parentPath}/${node.name}`
        : node.name;

      if (node.type === "folder") {
        return (
          <FileTreeFolder
            key={currentPath}
            path={currentPath}
            name={node.name}
          >
            {node.children?.map((child) => renderTree(child, currentPath))}
          </FileTreeFolder>
        );
      }

      return (
        <FileTreeFile
          key={currentPath}
          path={currentPath}
          name={node.name}
          icon={node.icon}
        />
      );
    },
    [],
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-1.5 border-b shrink-0">
        <div className="flex items-center gap-2">
          <FolderTreeIcon className="size-4 text-muted-foreground" />
          <span className="text-xs font-medium">Knowledge Tree</span>
          <Badge variant="outline" className="text-[9px]">
            {countNodes} files
          </Badge>
        </div>
      </div>
      <ScrollArea className="flex-1 p-3">
        {countNodes === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <FolderTreeIcon className="size-8 text-muted-foreground/30 mb-2" />
            <p className="text-sm">No knowledge artifacts yet</p>
            <p className="text-xs mt-1">
              Generated assets will appear here after workflow execution
            </p>
          </div>
        ) : (
          <FileTree
            selectedPath={selectedPath}
            onSelect={handleSelect}
            expanded={expandedPaths}
          >
            {renderTree(knowledgeTree)}
          </FileTree>
        )}
      </ScrollArea>
    </div>
  );
}

