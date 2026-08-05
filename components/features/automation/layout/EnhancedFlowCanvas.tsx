"use client";

import React, { useCallback, useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  ReactFlowProvider,
  BackgroundVariant,
  SelectionMode,
  type NodeTypes,
  type EdgeTypes,
  type ReactFlowProps,
} from "@xyflow/react";

import { nodeTypes as automationNodeTypes } from "../node";
import { edgeTypes as automationEdgeTypes } from "../edge";

import { CanvasLayout } from "./CanvasLayout";
import { MiniMap } from "./mini_map";

export interface EnhancedFlowCanvasProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;

  onDrop?: React.DragEventHandler<HTMLDivElement>;
  onDragOver?: React.DragEventHandler<HTMLDivElement>;

  onNodeDoubleClick?: (node: Node) => void;
  onNodeClick?: (event: React.MouseEvent, node: Node) => void;

  nodeTypes?: NodeTypes;
  edgeTypes?: EdgeTypes;

  nodesConnectable?: boolean;
  connectionLineType?: ReactFlowProps["connectionLineType"];
  connectionLineStyle?: ReactFlowProps["connectionLineStyle"];

  snapToGrid?: boolean;
  gridSize?: number;

  showBackground?: boolean;
  backgroundVariant?: BackgroundVariant;
  backgroundGap?: number;

  showControls?: boolean;
  showMiniMap?: boolean;
  fitViewOptions?: ReactFlowProps["fitViewOptions"];

  defaultEdgeOptions?: ReactFlowProps["defaultEdgeOptions"];

  topRightPanel?: React.ReactNode;

  selectionMode?: SelectionMode;
  className?: string;
  children?: React.ReactNode;
}

function EnhancedFlowCanvasInner({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onDrop,
  onDragOver,
  onNodeDoubleClick,
  onNodeClick,
  nodeTypes,
  edgeTypes,
  nodesConnectable = true,
  connectionLineType,
  connectionLineStyle,
  snapToGrid = false,
  gridSize = 15,
  showBackground = true,
  backgroundVariant = BackgroundVariant.Dots,
  backgroundGap = 12,
  showControls = true,
  showMiniMap = true,
  fitViewOptions,
  defaultEdgeOptions,
  topRightPanel,
  selectionMode = SelectionMode.Partial,
  className,
  children,
}: EnhancedFlowCanvasProps) {
  const mergedNodeTypes = useMemo(() => {
    return {
      ...automationNodeTypes,
      ...(nodeTypes || {}),
    } as NodeTypes;
  }, [nodeTypes]);

  const mergedEdgeTypes = useMemo(() => {
    return {
      ...automationEdgeTypes,
      ...(edgeTypes || {}),
    };
  }, [edgeTypes]);

  const handleNodeDoubleClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      onNodeDoubleClick?.(node);
    },
    [onNodeDoubleClick]
  );

  const handleNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      onNodeClick?.(event, node);
    },
    [onNodeClick]
  );

  return (
    <CanvasLayout className={className}>
      <div className="relative w-full h-full" onDrop={onDrop} onDragOver={onDragOver}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={mergedNodeTypes}
          edgeTypes={mergedEdgeTypes}
          nodesConnectable={nodesConnectable}
          connectionLineType={connectionLineType}
          connectionLineStyle={connectionLineStyle}
          snapToGrid={snapToGrid}
          snapGrid={[gridSize, gridSize]}
          selectionMode={selectionMode}
          fitView={false}
          fitViewOptions={fitViewOptions}
          defaultEdgeOptions={defaultEdgeOptions}
          onNodeDoubleClick={handleNodeDoubleClick}
          onNodeClick={handleNodeClick}
        >
          {showBackground && (
            <Background variant={backgroundVariant} gap={backgroundGap} />
          )}
          {showControls && <Controls />}
          {showMiniMap && <MiniMap />}
          {children}
        </ReactFlow>

        {topRightPanel && (
          <div className="absolute top-2 right-2 z-20">{topRightPanel}</div>
        )}
      </div>
    </CanvasLayout>
  );
}

/**
 * EnhancedFlowCanvas — the core canvas component.
 *
 * NOTE: This component expects a parent ReactFlowProvider.
 * Use `EnhancedFlowCanvasWithProvider` if you need a standalone variant
 * (not wrapped by FlowDesigner's own provider).
 */
export function EnhancedFlowCanvas(props: EnhancedFlowCanvasProps) {
  return <EnhancedFlowCanvasInner {...props} />;
}

/**
 * Standalone variant with its own ReactFlowProvider.
 * Use this only when NOT nesting inside another ReactFlowProvider
 * (e.g., outside of FlowDesigner).
 */
export function EnhancedFlowCanvasWithProvider(props: EnhancedFlowCanvasProps) {
  return (
    <ReactFlowProvider>
      <EnhancedFlowCanvasInner {...props} />
    </ReactFlowProvider>
  );
}

