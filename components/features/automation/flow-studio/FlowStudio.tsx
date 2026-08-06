"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ReactFlowProvider, useReactFlow } from "@xyflow/react";
import type { Node, Edge, NodeTypes, EdgeTypes } from "@xyflow/react";

import { useWorkflowStore, setFlowViewportApi } from "@/lib/zustand/workflow-store";

// Canvas + palette
import { EnhancedFlowCanvas } from "../layout/EnhancedFlowCanvas";
import { CanvasSearch } from "../canvas/CanvasSearch";
import { CanvasContextMenu } from "../canvas/CanvasContextMenu";
import { CanvasLayers } from "../canvas/CanvasLayers";
import { Palette } from "../palette/Palette";
import { Library } from "../library/Library";
import { PropertiesPanel } from "../properties/PropertiesPanel";

// Node/edge registries
import { nodeTypes as defaultNodeTypes } from "../node";
import { edgeTypes as defaultEdgeTypes } from "../edge";

// Providers
import { AutomationProvider } from "../AutomationProvider";

// Flow Studio sub-components
import { FlowStudioLayout } from "./FlowStudioLayout";
import { FlowStudioToolbar } from "../FlowStudioToolbar";
import { FlowStudioStatusBar } from "./FlowStudioStatusBar";
import { FlowStudioAIPanel } from "./FlowStudioAIPanel";
import { FlowStudioExecutionPanel } from "./FlowStudioExecutionPanel";
import { FlowStudioVersionPanel } from "./FlowStudioVersionPanel";
import { FlowStudioTemplateQuickPick } from "./FlowStudioTemplateQuickPick";
import { FlowStudioMobileSheet, type MobileSheetKind } from "./FlowStudioMobileSheet";
import { FlowStudioCommandMenu } from "./FlowStudioCommandMenu";

// UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { Layers, BookOpen, Search, Plus, Sparkles, Play, History, Terminal, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FlowStudioProps {
  flowId?: string;
  template?: string;
  standard?: string;
  initialNodes?: Node[];
  initialEdges?: Edge[];
  nodeTypes?: NodeTypes;
  edgeTypes?: EdgeTypes;
  enableAI?: boolean;
  workflowName?: string;
  onWorkflowExecute?: (nodes: Node[], edges: Edge[]) => void;
  onWorkflowSave?: (nodes: Node[], edges: Edge[]) => void;
  onWorkflowExport?: (nodes: Node[], edges: Edge[]) => void;
  onWorkflowImport?: (data: unknown) => void;
}

function FlowStudioInner({
  template,
  initialNodes,
  initialEdges,
  nodeTypes: customNodeTypes,
  edgeTypes: customEdgeTypes,
  enableAI = true,
  workflowName,
  onWorkflowExecute,
  onWorkflowSave,
  onWorkflowExport,
}: FlowStudioProps) {
  const { toast } = useToast();
  const reactFlow = useReactFlow();
  const isMobile = useIsMobile();

  // Store state
  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);
  const isDirty = useWorkflowStore((s) => s.isDirty);
  const settings = useWorkflowStore((s) => s.settings);
  const executionStatus = useWorkflowStore((s) => s.executionStatus);
  const selectedNodeIds = useWorkflowStore((s) => s.selectedNodeIds);
  const selectedEdgeIds = useWorkflowStore((s) => s.selectedEdgeIds);

  const onNodesChange = useWorkflowStore((s) => s.onNodesChange);
  const onEdgesChange = useWorkflowStore((s) => s.onEdgesChange);
  const onConnect = useWorkflowStore((s) => s.onConnect);
  const updateNode = useWorkflowStore((s) => s.updateNode);
  const updateEdge = useWorkflowStore((s) => s.updateEdge);
  const deleteNodes = useWorkflowStore((s) => s.deleteNodes);
  const deleteEdge = useWorkflowStore((s) => s.deleteEdge);
  const undo = useWorkflowStore((s) => s.undo);
  const redo = useWorkflowStore((s) => s.redo);
  const saveFlow = useWorkflowStore((s) => s.saveFlow);
  const loadTemplate = useWorkflowStore((s) => s.loadTemplate);
  const exportFlow = useWorkflowStore((s) => s.exportFlow);
  const importFlow = useWorkflowStore((s) => s.importFlow);
  const copySelected = useWorkflowStore((s) => s.copySelected);
  const pasteClipboard = useWorkflowStore((s) => s.pasteClipboard);
  const duplicateNodes = useWorkflowStore((s) => s.duplicateNodes);
  const toggleGrid = useWorkflowStore((s) => s.toggleGrid);
  const toggleSnap = useWorkflowStore((s) => s.toggleSnap);
  const fitView = useWorkflowStore((s) => s.fitView);
  const zoomIn = useWorkflowStore((s) => s.zoomIn);
  const zoomOut = useWorkflowStore((s) => s.zoomOut);
  const centerOnNode = useWorkflowStore((s) => s.centerOnNode);
  const startExecution = useWorkflowStore((s) => s.startExecution);
  const canUndo = useWorkflowStore((s) => s.canUndo());
  const canRedo = useWorkflowStore((s) => s.canRedo());

  // Merged node/edge types
  const mergedNodeTypes = useMemo(
    () => ({ ...defaultNodeTypes, ...customNodeTypes }),
    [customNodeTypes]
  );
  const mergedEdgeTypes = useMemo(
    () => ({ ...defaultEdgeTypes, ...customEdgeTypes }),
    [customEdgeTypes]
  );

  // Local UI state
  const [showSearch, setShowSearch] = useState(false);
  const [showLayers, setShowLayers] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [showExecution, setShowExecution] = useState(false);
  const [showVersions, setShowVersions] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showTest, setShowTest] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [highlightedNode, setHighlightedNode] = useState<string | null>(null);
  const [mobileSheet, setMobileSheet] = useState<MobileSheetKind>(null);

  // Edit dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // Expose viewport API
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
        history: [{ nodes: JSON.parse(JSON.stringify(initialNodes)), edges: JSON.parse(JSON.stringify(initialEdges ?? [])) }],
        historyIndex: 0,
      });
    }
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
    updateNode(editingNodeId, { label: editLabel, description: editDescription });
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
    if (onWorkflowExecute) onWorkflowExecute(nodes, edges);
    else startExecution();
    setShowExecution(true);
  }, [onWorkflowExecute, nodes, edges, startExecution]);

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

  // ─── Derived data ────────────────────────────────────────────────────────
  const layers = useMemo(
    () => [{ id: "default", name: "Default", visible: true, locked: false, count: nodes.length }],
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

  // ─── Panel content ───────────────────────────────────────────────────────
  const palettePanel = (
    <div className="flex flex-col h-full">
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
    </div>
  );

  const propertiesPanel = (
    <PropertiesPanel
      selectedNode={selectedNode as any}
      selectedEdge={selectedEdge as any}
      onUpdateNode={(id, data) => updateNode(id, data as any)}
      onUpdateEdge={(id, data) => updateEdge(id, data as any)}
    />
  );

  const aiPanel = <FlowStudioAIPanel onClose={() => setShowAI(false)} />;
  const executionPanel = <FlowStudioExecutionPanel onClose={() => setShowExecution(false)} />;
  const versionsPanel = <FlowStudioVersionPanel onClose={() => setShowVersions(false)} />;

  const fabMenu = (
    <div className="absolute bottom-4 right-4 z-30 flex flex-col gap-2 items-end">
      <div className="flex flex-col gap-2">
        {showExecution && <OpenButton icon={<Terminal className="h-4 w-4" />} label="Execution" onClick={() => setMobileSheet("execution")} />}
        {enableAI && <OpenButton icon={<Sparkles className="h-4 w-4" />} label="AI" onClick={() => setMobileSheet("ai")} />}
        <OpenButton icon={<History className="h-4 w-4" />} label="Versions" onClick={() => setMobileSheet("versions")} />
        <OpenButton icon={<Layers className="h-4 w-4" />} label="Palette" onClick={() => setMobileSheet("palette")} />
      </div>
      <Button
        size="icon-lg"
        className="h-14 w-14 rounded-full shadow-lg"
        onClick={() => setMobileSheet(showExecution ? "execution" : "palette")}
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  );

  // ─── Canvas ──────────────────────────────────────────────────────────────
  const canvas = (
    <div className="relative w-full h-full">
      {showSearch && (
        <CanvasSearch
          nodes={nodes as any}
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
      {showAI && !isMobile && (
        <div className="absolute top-2 right-2 z-20 w-80">
          {aiPanel}
        </div>
      )}
      {showExecution && !isMobile && (
        <div className="absolute bottom-3 right-3 z-20 w-80">
          {executionPanel}
        </div>
      )}
      {showVersions && !isMobile && (
        <div className="absolute top-2 left-2 z-20 w-80">
          {versionsPanel}
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
          nodes={styledNodes as any}
          edges={edges as any}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeDoubleClick={handleNodeDoubleClick as any}
          snapToGrid={settings.snapEnabled}
          gridSize={settings.gridSize}
          showBackground={settings.gridEnabled}
          backgroundVariant={settings.backgroundVariant as any}
          showControls
          showMiniMap
          nodeTypes={mergedNodeTypes}
          edgeTypes={mergedEdgeTypes}
          className="bg-dot-muted/30"
        />
      </CanvasContextMenu>
    </div>
  );

  return (
    <FlowStudioLayout
      toolbar={
        <FlowStudioToolbar
          onZoomIn={() => zoomIn()}
          onZoomOut={() => zoomOut()}
          onFitView={() => fitView()}
          onZoomTo100={() => reactFlow.zoomTo(1)}
          zoomLevel={reactFlow.getViewport().zoom * 100}
          showGrid={settings.gridEnabled}
          showSnap={settings.snapEnabled}
          showMinimap={settings.showMiniMap}
          onToggleGrid={toggleGrid}
          onToggleSnap={toggleSnap}
          onToggleMinimap={() => {}}
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={undo}
          onRedo={redo}
          onSave={handleSave}
          onExport={handleExport}
          onImport={handleImport}
          isDirty={isDirty}
          onToggleSearch={() => setShowSearch((v) => !v)}
          onToggleLayers={() => setShowLayers((v) => !v)}
          onToggleAI={() => setShowAI((v) => !v)}
          onToggleLogs={() => setShowExecution((v) => !v)}
          onToggleVersions={() => setShowVersions((v) => !v)}
          onToggleTest={() => setShowTest((v) => !v)}
          onToggleAnalytics={() => setShowAnalytics((v) => !v)}
          showAI={showAI}
          showLogs={showExecution}
          showVersions={showVersions}
          showTest={showTest}
          showAnalytics={showAnalytics}
          executionStatus={executionStatus}
          onExecute={handleExecute}
          onPause={() => useWorkflowStore.getState().pauseExecution()}
          onStop={() => useWorkflowStore.getState().failExecution()}
          nodeCount={nodes.length}
          edgeCount={edges.length}
        />
      }
      palette={palettePanel}
      canvas={canvas}
      properties={propertiesPanel}
      tabletDrawer={
        <div className="absolute bottom-0 inset-x-0 z-20 p-3">
          <div className="flex gap-2 justify-center">
            {enableAI && <Button variant="outline" size="sm" onClick={() => setShowAI((v) => !v)}><Sparkles className="h-3.5 w-3.5 mr-1" />AI</Button>}
            <Button variant="outline" size="sm" onClick={() => setShowExecution((v) => !v)}><Terminal className="h-3.5 w-3.5 mr-1" />Run</Button>
            <Button variant="outline" size="sm" onClick={() => setShowVersions((v) => !v)}><History className="h-3.5 w-3.5 mr-1" />Versions</Button>
          </div>
        </div>
      }
      statusBar={<FlowStudioStatusBar />}
      fab={isMobile ? fabMenu : undefined}
      mobileSheets={
        <FlowStudioMobileSheet
          open={isMobile ? mobileSheet : null}
          onOpenChange={setMobileSheet}
          palette={palettePanel}
          properties={propertiesPanel}
          ai={aiPanel}
          execution={executionPanel}
          versions={versionsPanel}
        />
      }
      templateQuickPick={
        showTemplates ? (
          <FlowStudioTemplateQuickPick onClose={() => setShowTemplates(false)} />
        ) : undefined
      }
      commandMenu={<FlowStudioCommandMenu />}
    >
      {/* Edit Node Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Node</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Label</Label>
              <Input value={editLabel} onChange={(e) => setEditLabel(e.target.value)} placeholder="Node label" />
            </div>
            <div>
              <Label>Description</Label>
              <Input value={editDescription} onChange={(e) => setEditDescription(e.target.value)} placeholder="Node description" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveNodeEdit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </FlowStudioLayout>
  );
}

function OpenButton({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <Button variant="secondary" size="sm" className="gap-1.5 shadow-md" onClick={onClick}>
      {icon}
      {label}
    </Button>
  );
}

/**
 * FlowStudio — public master component.
 * Provides ReactFlow + Automation contexts.
 */
export function FlowStudio(props: FlowStudioProps) {
  const handleSave = useCallback(() => {
    useWorkflowStore.getState().saveFlow();
  }, []);

  return (
    <ReactFlowProvider>
      <AutomationProvider onSave={handleSave}>
        <FlowStudioInner {...props} />
      </AutomationProvider>
    </ReactFlowProvider>
  );
}
