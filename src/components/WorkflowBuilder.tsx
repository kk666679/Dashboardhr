import React, { useState, useCallback } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  BackgroundVariant,
  MarkerType,
  ReactFlowProvider,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import {
  StartNode,
  EndNode,
  ActionNode,
  DecisionNode,
  ApprovalNode,
  WaitNode,
  NotificationNode,
  ParallelNode,
  ErrorNode,
} from './reactflow/WorkflowNodes';
import {
  Play,
  Plus,
  Save,
  Download,
  Upload,
  Trash2,
  Copy,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Settings,
  Sparkles,
  Workflow,
  GitBranch,
} from 'lucide-react';

const nodeTypes = {
  start: StartNode,
  end: EndNode,
  action: ActionNode,
  decision: DecisionNode,
  approval: ApprovalNode,
  wait: WaitNode,
  notification: NotificationNode,
  parallel: ParallelNode,
  error: ErrorNode,
};

const workflowData = {
  nodes: [
    {
      id: '1',
      type: 'start',
      position: { x: 400, y: 50 },
      data: { label: 'Start Process' },
    },
    {
      id: '2',
      type: 'action',
      position: { x: 350, y: 200 },
      data: { 
        label: 'Submit Leave Request',
        actionType: 'document',
        description: 'Employee submits leave application',
        duration: '5 minutes'
      },
    },
    {
      id: '3',
      type: 'approval',
      position: { x: 300, y: 380 },
      data: { 
        label: 'Manager Approval',
        approver: 'Direct Manager',
        sla: '24 hours',
        priority: 'High'
      },
    },
    {
      id: '4',
      type: 'decision',
      position: { x: 330, y: 600 },
      data: { label: 'Days > 5?' },
    },
    {
      id: '5',
      type: 'approval',
      position: { x: 600, y: 720 },
      data: { 
        label: 'HR Director Approval',
        approver: 'HR Director',
        sla: '48 hours',
        priority: 'Medium'
      },
    },
    {
      id: '6',
      type: 'notification',
      position: { x: 80, y: 720 },
      data: { 
        label: 'Notify Employee',
        recipients: 'Employee',
        channel: 'email'
      },
    },
    {
      id: '7',
      type: 'action',
      position: { x: 550, y: 920 },
      data: { 
        label: 'Update Calendar',
        actionType: 'calendar',
        description: 'Block dates in calendar',
        duration: '2 minutes'
      },
    },
    {
      id: '8',
      type: 'parallel',
      position: { x: 350, y: 1080 },
      data: { label: 'Parallel Tasks' },
    },
    {
      id: '9',
      type: 'notification',
      position: { x: 150, y: 1260 },
      data: { 
        label: 'Notify Team',
        recipients: 'Team Members',
        channel: 'email'
      },
    },
    {
      id: '10',
      type: 'action',
      position: { x: 450, y: 1260 },
      data: { 
        label: 'Update Payroll',
        actionType: 'payment',
        description: 'Adjust salary for leave days',
        duration: '3 minutes'
      },
    },
    {
      id: '11',
      type: 'end',
      position: { x: 370, y: 1440 },
      data: { label: 'Approved', type: 'success' },
    },
    {
      id: '12',
      type: 'notification',
      position: { x: 50, y: 920 },
      data: { 
        label: 'Rejection Notice',
        recipients: 'Employee',
        channel: 'email'
      },
    },
    {
      id: '13',
      type: 'end',
      position: { x: 80, y: 1080 },
      data: { label: 'Rejected', type: 'error' },
    },
  ],
  edges: [
    {
      id: 'e1-2',
      source: '1',
      target: '2',
      type: 'smoothstep',
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { strokeWidth: 2, stroke: '#10B981' },
    },
    {
      id: 'e2-3',
      source: '2',
      target: '3',
      type: 'smoothstep',
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { strokeWidth: 2, stroke: '#8B5CF6' },
    },
    {
      id: 'e3-4',
      source: '3',
      sourceHandle: 'approved',
      target: '4',
      type: 'smoothstep',
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { strokeWidth: 2, stroke: '#10B981' },
      label: 'Approved',
    },
    {
      id: 'e3-12',
      source: '3',
      sourceHandle: 'rejected',
      target: '12',
      type: 'smoothstep',
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { strokeWidth: 2, stroke: '#EF4444' },
      label: 'Rejected',
    },
    {
      id: 'e4-5',
      source: '4',
      sourceHandle: 'yes',
      target: '5',
      type: 'smoothstep',
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { strokeWidth: 2, stroke: '#F59E0B' },
      label: 'Yes',
    },
    {
      id: 'e4-6',
      source: '4',
      sourceHandle: 'no',
      target: '6',
      type: 'smoothstep',
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { strokeWidth: 2, stroke: '#F59E0B' },
      label: 'No',
    },
    {
      id: 'e5-7',
      source: '5',
      sourceHandle: 'approved',
      target: '7',
      type: 'smoothstep',
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { strokeWidth: 2, stroke: '#10B981' },
      label: 'Approved',
    },
    {
      id: 'e6-8',
      source: '6',
      target: '8',
      type: 'smoothstep',
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { strokeWidth: 2, stroke: '#6366F1' },
    },
    {
      id: 'e7-8',
      source: '7',
      target: '8',
      type: 'smoothstep',
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { strokeWidth: 2, stroke: '#3B82F6' },
    },
    {
      id: 'e8-9',
      source: '8',
      sourceHandle: 'branch1',
      target: '9',
      type: 'smoothstep',
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { strokeWidth: 2, stroke: '#14B8A6' },
    },
    {
      id: 'e8-10',
      source: '8',
      sourceHandle: 'branch2',
      target: '10',
      type: 'smoothstep',
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { strokeWidth: 2, stroke: '#14B8A6' },
    },
    {
      id: 'e9-11',
      source: '9',
      target: '11',
      type: 'smoothstep',
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { strokeWidth: 2, stroke: '#10B981' },
    },
    {
      id: 'e10-11',
      source: '10',
      target: '11',
      type: 'smoothstep',
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { strokeWidth: 2, stroke: '#10B981' },
    },
    {
      id: 'e12-13',
      source: '12',
      target: '13',
      type: 'smoothstep',
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { strokeWidth: 2, stroke: '#EF4444' },
    },
  ],
};

function WorkflowBuilderInner() {
  const [nodes, setNodes, onNodesChange] = useNodesState(workflowData.nodes as Node[]);
  const [edges, setEdges, onEdgesChange] = useEdgesState(workflowData.edges);
  const [backgroundVariant, setBackgroundVariant] = useState<BackgroundVariant>(BackgroundVariant.Dots);
  const [showNodePalette, setShowNodePalette] = useState(true);

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = {
        ...params,
        type: 'smoothstep',
        animated: true,
        markerEnd: { type: MarkerType.ArrowClosed },
        style: { strokeWidth: 2, stroke: '#8B5CF6' },
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  const nodePalette = [
    { type: 'start', label: 'Start', icon: Play, color: 'green' },
    { type: 'action', label: 'Action', icon: Sparkles, color: 'blue' },
    { type: 'decision', label: 'Decision', icon: GitBranch, color: 'amber' },
    { type: 'approval', label: 'Approval', icon: Settings, color: 'purple' },
    { type: 'wait', label: 'Wait', icon: Settings, color: 'gray' },
    { type: 'notification', label: 'Notify', icon: Settings, color: 'indigo' },
    { type: 'parallel', label: 'Parallel', icon: Settings, color: 'teal' },
    { type: 'end', label: 'End', icon: Settings, color: 'red' },
  ];

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-pink-50 via-purple-50 to-violet-50">
      {/* Header */}
      <div className="bg-white border-b-2 border-pink-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-gray-900 flex items-center gap-2">
              <Workflow className="w-7 h-7 text-pink-600" />
              Workflow Builder
            </h1>
            <p className="text-gray-500">Visual workflow automation designer</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2">
              <Play className="w-4 h-4" />
              Run Test
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex relative">
        {/* Node Palette */}
        {showNodePalette && (
          <div className="w-64 bg-white border-r-2 border-pink-200 p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Node Palette</h3>
              <button
                onClick={() => setShowNodePalette(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="space-y-2">
              {nodePalette.map((node) => {
                const Icon = node.icon;
                return (
                  <div
                    key={node.type}
                    draggable
                    className={`p-3 border-2 border-${node.color}-200 rounded-lg cursor-move hover:shadow-lg transition-all bg-white`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className={`w-5 h-5 text-${node.color}-600`} />
                      <span className="text-sm font-medium text-gray-700">{node.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Canvas */}
        <div className="flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.2 }}
          >
            <Background variant={backgroundVariant} gap={16} size={1} color="#F9A8D4" />
            <Controls className="bg-white border-2 border-pink-200 rounded-lg shadow-lg" />
            <MiniMap
              className="bg-white border-2 border-pink-200 rounded-lg shadow-lg"
              maskColor="rgba(236, 72, 153, 0.1)"
            />
            <Panel position="top-right" className="bg-white/95 backdrop-blur-sm border-2 border-pink-200 rounded-lg p-4 m-4">
              <div className="space-y-2 text-sm">
                <h3 className="font-semibold text-gray-900 mb-2">Leave Approval Workflow</h3>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-gray-600">{nodes.length} Nodes</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span className="text-gray-600">{edges.length} Connections</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                  <span className="text-gray-600">Active</span>
                </div>
              </div>
            </Panel>
          </ReactFlow>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="bg-white border-t-2 border-pink-200 px-6 py-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-6">
            <span className="text-gray-600">
              <span className="font-semibold text-gray-900">{nodes.length}</span> nodes
            </span>
            <span className="text-gray-600">
              <span className="font-semibold text-gray-900">{edges.length}</span> connections
            </span>
            <span className="text-gray-600">
              Status: <span className="font-semibold text-green-600">Valid</span>
            </span>
          </div>
          <div className="text-gray-500">
            Drag nodes from palette to canvas • Connect nodes to build workflow
          </div>
        </div>
      </div>
    </div>
  );
}

export function WorkflowBuilder() {
  return (
    <ReactFlowProvider>
      <WorkflowBuilderInner />
    </ReactFlowProvider>
  );
}
