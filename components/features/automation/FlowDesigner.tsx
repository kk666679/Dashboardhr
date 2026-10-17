/**
 * Unified FlowDesigner — Single shared workflow designer for ALL Automation pages.
 *
 * Consolidates:
 *  - FlowDesigner (canvas-based designer with palette, properties, toolbar)
 *  - FlowDesignerInner (internal state management)
 *  - flow-process/components/FlowDesigner (thin wrapper — now unnecessary)
 *  - workflow-engine/page.tsx (standalone ReactFlow — now uses this)
 *  - SOPWorkflowDesigner (separate designer — now uses this)
 *
 * @xyflow/react — Full integration with custom nodes, edges, minimap, controls
 * @dnd-kit/core — Drag from palette to canvas
 * @dnd-kit/sortable — Sortable layers/properties
 */

"use client";

import { useState, useCallback, useEffect, useMemo, useRef, type ReactNode } from "react";
import { ReactFlowProvider, useReactFlow } from "@xyflow/react";
import type { Node, Edge, NodeTypes, EdgeTypes } from "@xyflow/react";

// Shared store
import { useWorkflowStore, setFlowViewportApi } from "@/lib/zustand/workflow-store";

// Shared components
import { EnhancedFlowCanvas } from "./layout/EnhancedFlowCanvas";
import { CanvasToolbar } from "./canvas/CanvasToolbar";
import { CanvasSearch } from "./canvas/CanvasSearch";
import { CanvasContextMenu } from "./canvas/CanvasContextMenu";
import { CanvasLayers } from "./canvas/CanvasLayers";
import { PropertiesPanel } from "./properties/PropertiesPanel";
import { Palette } from "./palette/Palette";
import { Library } from "./library/Library";

// Default nodes/edges from the shared registries
import { nodeTypes as defaultNodeTypes } from "./node";
import { edgeTypes as defaultEdgeTypes } from "./edge";

// Provider
import { AutomationProvider } from "./AutomationProvider";

// UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { Layers, BookOpen, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FlowDesignerProps {
  flowId?: string;
  template?: string;
  standard?: string;
  initialNodes?: Node[];
  initialEdges?: Edge[];
  /** Custom node types to merge with the default node registry */
  nodeTypes?: NodeTypes;
  /** Custom edge types to merge with the default edge registry */
  edgeTypes?: EdgeTypes;
  enableAI?: boolean;
  leftSidebarCollapsible?: boolean;
  rightSidebarCollapsible?: boolean;
  defaultEdgeType?: string;
  defaultShowMinimap?: boolean;
  defaultShowControls?: boolean;
  workflowName?: string;
  onWorkflowExecute?: (nodes: Node[], edges: Edge[]) => void;
  onWorkflowSave?: (nodes: Node[], edges: Edge[]) => void;
  onWorkflowExport?: (nodes: Node[], edges: Edge[]) => void;
  onWorkflowImport?: (data: unknown) => void;
  children?: ReactNode;
}

/**
 * Inner component that uses the ReactFlow context and workflow store.
 */
function FlowDesignerInner({
  template,
  initialNodes,
  initialEdges,
  nodeTypes: customNodeTypes,
  edgeTypes: customEdgeTypes,
  leftSidebarCollapsible = true,
  rightSidebarCollapsible = true,
  defaultEdgeType = "smoothstep",
  defaultShowMinimap = true,
  defaultShowControls = true,
  onWorkflowExecute,
  onWorkflowSave,
  onWorkflowExport,
  children,
}: FlowDesignerProps) {
  const { toast } = useToast();
  const reactFlow = useReactFlow();

  // Merge default node/edge types with any custom overrides
  const mergedNodeTypes = useMemo(
    () => ({ ...defaultNodeTypes, ...customNodeTypes }),
    [customNodeTypes]
  );
  const mergedEdgeTypes = useMemo(
    () => ({ ...defaultEdgeTypes, ...customEdgeTypes }),
    [customEdgeTypes]
  );

  // ─── Store state ──────────────────────────────────────────────────────────
  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);
  const isDirty = useWorkflowStore((s) => s.isDirty);
const currentId = useWorkflowStore((s) => s.currentId);

  const onNodesChange = useWorkflowStore((s) => s.onNodesChange);
  const onEdgesChange = useWorkflowStore((s) => s.onEdgesChange);
  const onConnect = useWorkflowStore((s) => s.onConnect);
  const addNode = useWorkflowStore((s) => s.addNode);
  const updateNode = useWorkflowStore((s) => s.updateNode);
  const deleteNode = useWorkflowStore((s) => s.deleteNode);
  const deleteNodes = useWorkflowStore((s) => s.deleteNodes);
  const updateEdge = useWorkflowStore((s) => s.updateEdge);
  const deleteEdge = useWorkflowStore((s) => s.deleteEdge);
  const undo = useWorkflowStore((s) => s.undo);
  const redo = useWorkflowStore((s) => s.redo);
  const saveFlow = useWorkflowStore((s) => s.saveFlow);
  const loadTemplate = useWorkflowStore((s) => s.loadTemplate);
  const exportFlow = useWorkflowStore((s) => s.exportFlow);
  const importFlow = useWorkflowStore((s) => s.importFlow);
  const selectedNodeIds = useWorkflowStore((s) => s.selectedNodeIds);
  const selectedEdgeIds = useWorkflowStore((s) => s.selectedEdgeIds);
  const selectNode = useWorkflowStore((s) => s.selectNode);
  const selectEdge = useWorkflowStore((s) => s.selectEdge);
  const clearSelection = useWorkflowStore((s) => s.clearSelection);
  const copySelected = useWorkflowStore((s) => s.copySelected);
  const pasteClipboard = useWorkflowStore((s) => s.pasteClipboard);
  const settings = useWorkflowStore((s) => s.settings);
  const toggleSnap = useWorkflowStore((s) => s.toggleSnap);
  const toggleGrid = useWorkflowStore((s) => s.toggleGrid);
  const fitView = useWorkflowStore((s) => s.fitView);
  const zoomIn = useWorkflowStore((s) => s.zoomIn);
  const zoomOut = useWorkflowStore((s) => s.zoomOut);
  const centerOnNode = useWorkflowStore((s) => s.centerOnNode);
  const duplicateNodes = useWorkflowStore((s) => s.duplicateNodes);
  const startExecution = useWorkflowStore((s) => s.startExecution);

  const canUndo = useWorkflowStore((s) => s.canUndo());
  const canRedo = useWorkflowStore((s) => s.canRedo());

  // ─── Local UI state ──────────────────────────────────────────────────────
  const [showSearch, setShowSearch] = useState(false);
  const [showLayers, setShowLayers] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const sidebarCollapsedRef = useRef(false);
  const [highlightedNode, setHighlightedNode] = useState<string | null>(null);

  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // ─── Effects ─────────────────────────────────────────────────────────────
  // Expose viewport API to the store
  useEffect(() => {
    setFlowViewportApi({
      fitView: (opts) => reactFlow.fitView(opts),
      zoomIn: (opts) => reactFlow.zoomIn(opts),
      zoomOut: (opts) => reactFlow.zoomOut(opts),
      zoomTo: (level, opts) => reactFlow.zoomTo(level, opts),
      setViewport: (vp, opts) => reactFlow.setViewport(vp, opts),
      getViewport: () => reactFlow.getViewport(),
    });
    return () => setFlowViewportApi(null);
  }, [reactFlow]);

  // Load template or initial data
  useEffect(() => {
    if (template) {
      loadTemplate(template);
    } else if (initialNodes && initialNodes.length > 0) {
      useWorkflowStore.setState({
        nodes: initialNodes,
        edges: initialEdges ?? [],
        isDirty: false,
        history: [
          {
            nodes: JSON.parse(JSON.stringify(initialNodes)),
            edges: JSON.parse(JSON.stringify(initialEdges ?? [])),
          },
        ],
        historyIndex: 0,
      });
    }
    // Intentionally only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Handlers ────────────────────────────────────────────────────────────
  const handleNodeDoubleClick = useCallback(
    (node: { id: string; data?: { label?: string; description?: string } }) => {
      setEditingNodeId(node.id);
      setEditLabel((node.data?.label as string) || "");
      setEditDescription((node.data?.description as string) || "");
      setEditDialogOpen(true);
    },
    []
  );

  const handleSaveNodeEdit = useCallback(() => {
    if (!editingNodeId) return;
    updateNode(editingNodeId, {
      label: editLabel,
      description: editDescription,
    });
    setEditDialogOpen(false);
    toast({ title: "Node updated" });
  }, [editingNodeId, editLabel, editDescription, updateNode, toast]);

  const handleSearchSelect = useCallback(
    (nodeId: string) => {
      centerOnNode(nodeId);
      setHighlightedNode(nodeId);
      setTimeout(() => setHighlightedNode(null), 2000);
      setShowSearch(false);
    },
    [centerOnNode]
  );

  const handleSave = useCallback(() => {
    const id = saveFlow();
    toast({ title: "Flow saved", description: id });
    onWorkflowSave?.(nodes, edges);
  }, [saveFlow, toast, nodes, edges, onWorkflowSave]);

  const handleExport = useCallback(() => {
    exportFlow();
    onWorkflowExport?.(nodes, edges);
  }, [exportFlow, nodes, edges, onWorkflowExport]);

  const handleImport = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = () => {
      if (input.files?.[0]) importFlow(input.files[0]);
    };
    input.click();
  }, [importFlow]);

  const handleExecute = useCallback(() => {
    if (onWorkflowExecute) {
      onWorkflowExecute(nodes, edges);
    } else {
      startExecution();
      toast({ title: "Workflow execution started" });
    }
  }, [onWorkflowExecute, nodes, edges, startExecution, toast]);

  const handleDeleteSelected = useCallback(() => {
    if (selectedNodeIds.length > 0) deleteNodes(selectedNodeIds);
    selectedEdgeIds.forEach((id) => deleteEdge(id));
  }, [selectedNodeIds, selectedEdgeIds, deleteNodes, deleteEdge]);

  const handleDuplicateSelected = useCallback(() => {
    duplicateNodes(selectedNodeIds);
  }, [duplicateNodes, selectedNodeIds]);

  const handleEditSelected = useCallback(() => {
    const node = nodes.find((n) => selectedNodeIds.includes(n.id));
    if (node) handleNodeDoubleClick(node);
  }, [selectedNodeIds, nodes, handleNodeDoubleClick]);

  // ─── Derived data ──────────────────────────────────────────────────────
  const layers = useMemo(
    () => [
      { id: "default", name: "Default", visible: true, locked: false, count: nodes.length },
      { id: "draft", name: "Draft", visible: true, locked: false, count: 0 },
    ],
    [nodes.length]
  );

  const selectedNode = useMemo(
    () => nodes.find((n) => selectedNodeIds.includes(n.id)) ?? null,
    [nodes, selectedNodeIds]
  );
  const selectedEdge = useMemo(
    () => edges.find((e) => selectedEdgeIds.includes(e.id)) ?? null,
    [edges, selectedEdgeIds]
  );

  const styledNodes = useMemo(
    () =>
      nodes.map((n) => ({
        ...n,
        style:
          n.id === highlightedNode
            ? { ...n.style, border: "2px solid #3b82f6", boxShadow: "0 0 0 4px rgba(59,130,246,0.3)" }
            : n.style,
      })),
    [nodes, highlightedNode]
  );

  const hasSelection = selectedNodeIds.length > 0 || selectedEdgeIds.length > 0;

  // ─── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b bg-background shrink-0">
        <CanvasToolbar
          onZoomIn={() => zoomIn()}
          onZoomOut={() => zoomOut()}
          onFitView={() => fitView()}
          onToggleGrid={toggleGrid}
          onToggleSnap={toggleSnap}
          onUndo={undo}
          onRedo={redo}
          onSave={handleSave}
          onExport={handleExport}
          onImport={handleImport}
          onToggleLayers={() => setShowLayers((v) => !v)}
          onToggleSearch={() => setShowSearch((v) => !v)}
          showGrid={settings.gridEnabled}
          showSnap={settings.snapEnabled}
          canUndo={canUndo}
          canRedo={canRedo}
        />
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground hidden sm:inline">
            {nodes.length} nodes, {edges.length} edges
          </span>
          {isDirty && <span className="text-xs text-yellow-500 font-medium">Unsaved</span>}
          {onWorkflowExecute && (
            <Button size="sm" variant="default" onClick={handleExecute}>
              Execute
            </Button>
          )}
          <Button size="sm" onClick={handleSave}>
            {currentId ? "Save" : "Save As"}
          </Button>
        </div>
      </div>

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="flex-1">
          {/* Left sidebar (palette / library) */}
          {leftSidebarCollapsible && (
            <>
              <ResizablePanel
                defaultSize={18}
                minSize={0}
                maxSize={30}
                collapsedSize={0}
                collapsible
                onResize={(size) => {
                  const collapsed = size.asPercentage === 0;
                  if (sidebarCollapsedRef.current !== collapsed) {
                    sidebarCollapsedRef.current = collapsed;
                    setSidebarCollapsed(collapsed);
                  }
                }}
                className="border-r bg-background overflow-hidden"
              >
                <div className="flex flex-col h-full relative">
                  <button
                    onClick={() => setSidebarCollapsed((v) => !v)}
                    className="absolute -right-3 top-3 z-10 flex h-6 w-6 items-center justify-center rounded-full border bg-background shadow-sm hover:bg-muted"
                    aria-label={sidebarCollapsed ? "Expand" : "Collapse"}
                  >
                    {sidebarCollapsed ? (
                      <ChevronRight className="h-3 w-3" />
                    ) : (
                      <ChevronLeft className="h-3 w-3" />
                    )}
                  </button>
                  {!sidebarCollapsed ? (
                    <>
                      <div className="p-3 border-b">
                        <Input
                          placeholder="Search nodes..."
                          className="h-8 text-sm"
                          onFocus={() => setShowSearch(true)}
                        />
                      </div>
                      <Tabs defaultValue="palette" className="flex-1 flex flex-col">
                        <TabsList className="mx-3 mt-2 grid grid-cols-2">
                          <TabsTrigger value="palette" className="text-xs">
                            <Layers className="mr-1 h-3 w-3" />Nodes
                          </TabsTrigger>
                          <TabsTrigger value="library" className="text-xs">
                            <BookOpen className="mr-1 h-3 w-3" />Library
                          </TabsTrigger>
                        </TabsList>
                        <TabsContent value="palette" className="flex-1 mt-0 overflow-hidden">
                          <ScrollArea className="h-full">
                            <Palette />
                          </ScrollArea>
                        </TabsContent>
                        <TabsContent value="library" className="flex-1 mt-0 overflow-hidden">
                          <ScrollArea className="h-full">
                            <Library />
                          </ScrollArea>
                        </TabsContent>
                      </Tabs>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-3 pt-10 text-muted-foreground">
                      <Layers className="h-4 w-4" />
                      <BookOpen className="h-4 w-4" />
                      <Search className="h-4 w-4" />
                    </div>
                  )}
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
            </>
          )}

          {/* Canvas area */}
          <ResizablePanel
            defaultSize={rightSidebarCollapsible ? 62 : 82}
            minSize={40}
          >
            <div className="relative w-full h-full">
              {showSearch && (
                <CanvasSearch
                  nodes={nodes}
                  onSelectNode={handleSearchSelect}
                  onHighlightNode={setHighlightedNode}
                  onClose={() => setShowSearch(false)}
                />
              )}
              {showLayers && (
                <div className="absolute top-2 right-2 z-10">
                  <CanvasLayers
                    layers={layers}
                    onToggleVisibility={() => {}}
                    onToggleLock={() => {}}
                    onDeleteLayer={() => {}}
                    onSelectLayer={() => {}}
                  />
                </div>
              )}
              <CanvasContextMenu
                hasSelection={hasSelection}
                onCopy={copySelected}
                onPaste={pasteClipboard}
                onDelete={handleDeleteSelected}
                onDuplicate={handleDuplicateSelected}
                onEdit={handleEditSelected}
              >
                <EnhancedFlowCanvas
                  nodes={styledNodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  onNodeDoubleClick={handleNodeDoubleClick}
                  snapToGrid={settings.snapEnabled}
                  gridSize={settings.gridSize}
                  showBackground={settings.gridEnabled}
                  showControls={defaultShowControls}
                  showMiniMap={defaultShowMinimap}
                  defaultEdgeOptions={
                    defaultEdgeType !== "smoothstep" ? { type: defaultEdgeType } : undefined
                  }
                  nodeTypes={mergedNodeTypes}
                  edgeTypes={mergedEdgeTypes}
                  className="bg-dot-muted/30"
                >
                  {children}
                </EnhancedFlowCanvas>
              </CanvasContextMenu>
            </div>
          </ResizablePanel>

          {/* Right sidebar (properties) */}
          {rightSidebarCollapsible && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel
                defaultSize={20}
                minSize={0}
                maxSize={35}
                collapsedSize={0}
                collapsible
                className="border-l bg-background min-w-[200px]"
              >
                <PropertiesPanel
                  selectedNode={selectedNode as any}
                  selectedEdge={selectedEdge as any}
                  onUpdateNode={(id, data) => updateNode(id, data as any)}
                  onUpdateEdge={(id, data) => updateEdge(id, data as any)}
                />
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>

      {/* Edit Node Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Node</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Label</Label>
              <Input
                value={editLabel}
                onChange={(e) => setEditLabel(e.target.value)}
                placeholder="Node label"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Node description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveNodeEdit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/**
 * Public wrapper that provides ReactFlow and Automation contexts.
 */
export function FlowDesigner(props: FlowDesignerProps) {
  const [showSearch, setShowSearch] = useState(false);

  const handleSave = useCallback(() => {
    useWorkflowStore.getState().saveFlow();
  }, []);

  return (
    <ReactFlowProvider>
      <AutomationProvider onSearchToggle={() => setShowSearch((v) => !v)} onSave={handleSave}>
        <FlowDesignerInner {...props} />
      </AutomationProvider>
    </ReactFlowProvider>
  );
}

/**
 * Simplified entry for use in pages that only need a flowId/template/standard.
 */
export function FlowDesignerWithProvider({
  flowId,
  template,
  standard,
}: {
  flowId?: string;
  template?: string;
  standard?: string;
}) {
  return <FlowDesigner flowId={flowId} template={template} standard={standard} />;
}
