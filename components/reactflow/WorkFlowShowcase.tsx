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
  useReactFlow,
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
} from './WorkflowNodes';
import {
  Workflow,
  Play,
  Pause,
  RotateCcw,
  Layers,
  Zap,
  Eye,
  EyeOff,
  Download,
  Save,
  Settings,
  Info,
  Plus,
  GitBranch,
  Mail,
  Clock,
  UserCheck,
  Bell,
  CheckCircle2,
  XCircle
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

// Comprehensive Workflow Showcase Data
const showcaseData = {
  nodes: [
    // Row 1: Start & End Nodes
    {
      id: 'start-1',
      type: 'start',
      position: { x: 100, y: 50 },
      data: { label: 'Process Start' },
    },
    {
      id: 'end-success',
      type: 'end',
      position: { x: 350, y: 50 },
      data: { label: 'Success', type: 'success' },
    },
    {
      id: 'end-error',
      type: 'end',
      position: { x: 600, y: 50 },
      data: { label: 'Failed', type: 'error' },
    },

    // Row 2: Action Nodes
    {
      id: 'action-email',
      type: 'action',
      position: { x: 50, y: 250 },
      data: { 
        label: 'Send Email',
        actionType: 'email',
        description: 'Send notification email to user',
        duration: '2 minutes'
      },
    },
    {
      id: 'action-notification',
      type: 'action',
      position: { x: 320, y: 250 },
      data: { 
        label: 'Push Notification',
        actionType: 'notification',
        description: 'Send push notification',
        duration: '1 minute'
      },
    },
    {
      id: 'action-database',
      type: 'action',
      position: { x: 590, y: 250 },
      data: { 
        label: 'Update Database',
        actionType: 'database',
        description: 'Save to database',
        duration: '3 minutes'
      },
    },
    {
      id: 'action-api',
      type: 'action',
      position: { x: 860, y: 250 },
      data: { 
        label: 'API Call',
        actionType: 'api',
        description: 'Call external API',
        duration: '5 minutes'
      },
    },

    // Row 3: Decision & Approval Nodes
    {
      id: 'decision-1',
      type: 'decision',
      position: { x: 80, y: 470 },
      data: { label: 'Budget OK?' },
    },
    {
      id: 'approval-manager',
      type: 'approval',
      position: { x: 350, y: 450 },
      data: { 
        label: 'Manager Approval',
        approver: 'Line Manager',
        sla: '24 hours',
        priority: 'High'
      },
    },
    {
      id: 'approval-director',
      type: 'approval',
      position: { x: 680, y: 450 },
      data: { 
        label: 'Director Approval',
        approver: 'Department Director',
        sla: '48 hours',
        priority: 'Critical'
      },
    },

    // Row 4: Wait & Notification Nodes
    {
      id: 'wait-1',
      type: 'wait',
      position: { x: 50, y: 720 },
      data: { 
        duration: '24 hours',
        description: 'Wait for response'
      },
    },
    {
      id: 'notification-email',
      type: 'notification',
      position: { x: 300, y: 720 },
      data: { 
        label: 'Email Notification',
        recipients: 'All Stakeholders',
        channel: 'email'
      },
    },
    {
      id: 'notification-sms',
      type: 'notification',
      position: { x: 570, y: 720 },
      data: { 
        label: 'SMS Alert',
        recipients: 'Manager',
        channel: 'sms'
      },
    },

    // Row 5: Parallel & Error Nodes
    {
      id: 'parallel-1',
      type: 'parallel',
      position: { x: 100, y: 960 },
      data: { label: 'Split Tasks' },
    },
    {
      id: 'error-handler',
      type: 'error',
      position: { x: 350, y: 960 },
      data: { label: 'Error Handler' },
    },

    // Complex Workflow Example (Right Side)
    {
      id: 'workflow-start',
      type: 'start',
      position: { x: 1150, y: 50 },
      data: { label: 'Leave Request' },
    },
    {
      id: 'workflow-action-1',
      type: 'action',
      position: { x: 1100, y: 200 },
      data: { 
        label: 'Submit Application',
        actionType: 'document',
        description: 'Submit leave application form',
        duration: '3 minutes'
      },
    },
    {
      id: 'workflow-approval-1',
      type: 'approval',
      position: { x: 1050, y: 380 },
      data: { 
        label: 'Manager Review',
        approver: 'Direct Manager',
        sla: '24 hours',
        priority: 'High'
      },
    },
    {
      id: 'workflow-decision-1',
      type: 'decision',
      position: { x: 1130, y: 600 },
      data: { label: 'Days > 5?' },
    },
    {
      id: 'workflow-approval-2',
      type: 'approval',
      position: { x: 1350, y: 720 },
      data: { 
        label: 'HR Approval',
        approver: 'HR Director',
        sla: '48 hours',
        priority: 'Medium'
      },
    },
    {
      id: 'workflow-notify-1',
      type: 'notification',
      position: { x: 900, y: 720 },
      data: { 
        label: 'Auto-Approve',
        recipients: 'Employee',
        channel: 'email'
      },
    },
    {
      id: 'workflow-parallel-1',
      type: 'parallel',
      position: { x: 1140, y: 900 },
      data: { label: 'Update Systems' },
    },
    {
      id: 'workflow-action-2',
      type: 'action',
      position: { x: 1000, y: 1070 },
      data: { 
        label: 'Update Calendar',
        actionType: 'calendar',
        description: 'Block calendar dates',
        duration: '2 minutes'
      },
    },
    {
      id: 'workflow-action-3',
      type: 'action',
      position: { x: 1270, y: 1070 },
      data: { 
        label: 'Update Payroll',
        actionType: 'payment',
        description: 'Adjust payroll',
        duration: '3 minutes'
      },
    },
    {
      id: 'workflow-end',
      type: 'end',
      position: { x: 1180, y: 1240 },
      data: { label: 'Completed', type: 'success' },
    },
    {
      id: 'workflow-reject',
      type: 'notification',
      position: { x: 850, y: 520 },
      data: { 
        label: 'Rejection Notice',
        recipients: 'Employee',
        channel: 'email'
      },
    },
    {
      id: 'workflow-end-reject',
      type: 'end',
      position: { x: 880, y: 660 },
      data: { label: 'Rejected', type: 'error' },
    },
  ],

  edges: [
    // Showcase connections
    {
      id: 'e-showcase-1',
      source: 'start-1',
      target: 'end-success',
      type: 'smoothstep',
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed, color: '#10B981' },
      style: { strokeWidth: 2, stroke: '#10B981' },
    },
    {
      id: 'e-showcase-2',
      source: 'start-1',
      target: 'end-error',
      type: 'smoothstep',
      markerEnd: { type: MarkerType.ArrowClosed, color: '#EF4444' },
      style: { strokeWidth: 2, stroke: '#EF4444' },
    },

    // Complex Workflow connections
    {
      id: 'e-wf-1',
      source: 'workflow-start',
      target: 'workflow-action-1',
      type: 'smoothstep',
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed, color: '#10B981' },
      style: { strokeWidth: 2, stroke: '#10B981' },
    },
    {
      id: 'e-wf-2',
      source: 'workflow-action-1',
      target: 'workflow-approval-1',
      type: 'smoothstep',
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed, color: '#8B5CF6' },
      style: { strokeWidth: 2, stroke: '#8B5CF6' },
    },
    {
      id: 'e-wf-3',
      source: 'workflow-approval-1',
      sourceHandle: 'approved',
      target: 'workflow-decision-1',
      type: 'smoothstep',
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed, color: '#10B981' },
      style: { strokeWidth: 2, stroke: '#10B981' },
      label: 'Approved',
    },
    {
      id: 'e-wf-4',
      source: 'workflow-approval-1',
      sourceHandle: 'rejected',
      target: 'workflow-reject',
      type: 'smoothstep',
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed, color: '#EF4444' },
      style: { strokeWidth: 2, stroke: '#EF4444' },
      label: 'Rejected',
    },
    {
      id: 'e-wf-5',
      source: 'workflow-decision-1',
      sourceHandle: 'yes',
      target: 'workflow-approval-2',
      type: 'smoothstep',
      markerEnd: { type: MarkerType.ArrowClosed, color: '#F59E0B' },
      style: { strokeWidth: 2, stroke: '#F59E0B' },
      label: 'Yes',
    },
    {
      id: 'e-wf-6',
      source: 'workflow-decision-1',
      sourceHandle: 'no',
      target: 'workflow-notify-1',
      type: 'smoothstep',
      markerEnd: { type: MarkerType.ArrowClosed, color: '#F59E0B' },
      style: { strokeWidth: 2, stroke: '#F59E0B' },
      label: 'No',
    },
    {
      id: 'e-wf-7',
      source: 'workflow-approval-2',
      sourceHandle: 'approved',
      target: 'workflow-parallel-1',
      type: 'smoothstep',
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed, color: '#10B981' },
      style: { strokeWidth: 2, stroke: '#10B981' },
      label: 'Approved',
    },
    {
      id: 'e-wf-8',
      source: 'workflow-notify-1',
      target: 'workflow-parallel-1',
      type: 'smoothstep',
      markerEnd: { type: MarkerType.ArrowClosed, color: '#6366F1' },
      style: { strokeWidth: 2, stroke: '#6366F1' },
    },
    {
      id: 'e-wf-9',
      source: 'workflow-parallel-1',
      sourceHandle: 'branch1',
      target: 'workflow-action-2',
      type: 'smoothstep',
      markerEnd: { type: MarkerType.ArrowClosed, color: '#14B8A6' },
      style: { strokeWidth: 2, stroke: '#14B8A6' },
    },
    {
      id: 'e-wf-10',
      source: 'workflow-parallel-1',
      sourceHandle: 'branch2',
      target: 'workflow-action-3',
      type: 'smoothstep',
      markerEnd: { type: MarkerType.ArrowClosed, color: '#14B8A6' },
      style: { strokeWidth: 2, stroke: '#14B8A6' },
    },
    {
      id: 'e-wf-11',
      source: 'workflow-action-2',
      target: 'workflow-end',
      type: 'smoothstep',
      markerEnd: { type: MarkerType.ArrowClosed, color: '#10B981' },
      style: { strokeWidth: 2, stroke: '#10B981' },
    },
    {
      id: 'e-wf-12',
      source: 'workflow-action-3',
      target: 'workflow-end',
      type: 'smoothstep',
      markerEnd: { type: MarkerType.ArrowClosed, color: '#10B981' },
      style: { strokeWidth: 2, stroke: '#10B981' },
    },
    {
      id: 'e-wf-13',
      source: 'workflow-reject',
      target: 'workflow-end-reject',
      type: 'smoothstep',
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed, color: '#EF4444' },
      style: { strokeWidth: 2, stroke: '#EF4444' },
    },
  ],
};

function WorkFlowShowcaseInner() {
  const [nodes, setNodes, onNodesChange] = useNodesState(showcaseData.nodes as Node[]);
  const [edges, setEdges, onEdgesChange] = useEdgesState(showcaseData.edges);
  const [backgroundVariant, setBackgroundVariant] = useState<BackgroundVariant>(BackgroundVariant.Dots);
  const [showMiniMap, setShowMiniMap] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [isAnimating, setIsAnimating] = useState(true);

  const reactFlowInstance = useReactFlow();

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

  const handleFitView = () => {
    reactFlowInstance.fitView({ padding: 0.2, duration: 800 });
  };

  const handleReset = () => {
    setNodes(showcaseData.nodes as Node[]);
    setEdges(showcaseData.edges);
    setTimeout(() => handleFitView(), 100);
  };

  const toggleAnimation = () => {
    setIsAnimating(!isAnimating);
    setEdges((eds) =>
      eds.map((edge) => ({
        ...edge,
        animated: !isAnimating,
      }))
    );
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white border-b-2 border-blue-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-gray-900 flex items-center gap-2">
              <Workflow className="w-7 h-7 text-blue-600" />
              Workflow Components Showcase
            </h1>
            <p className="text-gray-500">
              Complete workflow automation node library with 9 specialized types
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleAnimation}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-violet-500 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
            >
              {isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isAnimating ? 'Pause' : 'Play'}
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
            <button
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white border-b-2 border-blue-100 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">{nodes.length}</span> Workflow Nodes
            </div>
            <div className="w-px h-4 bg-blue-200"></div>
            <div className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">{edges.length}</span> Connections
            </div>
            <div className="w-px h-4 bg-blue-200"></div>
            <div className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">9</span> Node Types
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMiniMap(!showMiniMap)}
              className={`px-3 py-2 rounded-lg transition-all flex items-center gap-2 text-sm ${
                showMiniMap
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {showMiniMap ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              MiniMap
            </button>
            <button
              onClick={() => setShowControls(!showControls)}
              className={`px-3 py-2 rounded-lg transition-all flex items-center gap-2 text-sm ${
                showControls
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {showControls ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              Controls
            </button>

            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setBackgroundVariant(BackgroundVariant.Dots)}
                className={`px-3 py-1 rounded text-sm ${
                  backgroundVariant === BackgroundVariant.Dots
                    ? 'bg-white shadow'
                    : ''
                }`}
              >
                Dots
              </button>
              <button
                onClick={() => setBackgroundVariant(BackgroundVariant.Lines)}
                className={`px-3 py-1 rounded text-sm ${
                  backgroundVariant === BackgroundVariant.Lines
                    ? 'bg-white shadow'
                    : ''
                }`}
              >
                Lines
              </button>
              <button
                onClick={() => setBackgroundVariant(BackgroundVariant.Cross)}
                className={`px-3 py-1 rounded text-sm ${
                  backgroundVariant === BackgroundVariant.Cross
                    ? 'bg-white shadow'
                    : ''
                }`}
              >
                Cross
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ReactFlow Canvas */}
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.1}
          maxZoom={2}
          defaultViewport={{ x: 0, y: 0, zoom: 0.6 }}
        >
          <Background variant={backgroundVariant} gap={16} size={1} color="#93C5FD" />
          {showControls && (
            <Controls
              showInteractive={false}
              className="bg-white border-2 border-blue-200 rounded-lg shadow-lg"
            />
          )}
          {showMiniMap && (
            <MiniMap
              nodeColor={(node) => {
                if (node.type === 'start') return '#10B981';
                if (node.type === 'end') return '#EF4444';
                if (node.type === 'action') return '#3B82F6';
                if (node.type === 'decision') return '#F59E0B';
                if (node.type === 'approval') return '#8B5CF6';
                if (node.type === 'notification') return '#6366F1';
                if (node.type === 'wait') return '#6B7280';
                if (node.type === 'parallel') return '#14B8A6';
                return '#94A3B8';
              }}
              maskColor="rgba(59, 130, 246, 0.1)"
              className="bg-white border-2 border-blue-200 rounded-lg shadow-lg"
            />
          )}

          {/* Info Panel */}
          <Panel position="top-left" className="bg-white/95 backdrop-blur-sm border-2 border-blue-200 rounded-lg p-4 m-4 max-w-sm">
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <Info className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Workflow Node Types</h3>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <Play className="w-4 h-4 text-green-600" />
                  <span className="text-gray-700">Start</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span className="text-gray-700">End</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-700">Action</span>
                </div>
                <div className="flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-amber-600" />
                  <span className="text-gray-700">Decision</span>
                </div>
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-purple-600" />
                  <span className="text-gray-700">Approval</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-700">Wait</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-indigo-600" />
                  <span className="text-gray-700">Notification</span>
                </div>
                <div className="flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-teal-600 rotate-90" />
                  <span className="text-gray-700">Parallel</span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-600" />
                  <span className="text-gray-700">Error</span>
                </div>
              </div>
            </div>
          </Panel>

          {/* Workflow Example Panel */}
          <Panel position="top-right" className="bg-white/95 backdrop-blur-sm border-2 border-green-200 rounded-lg p-4 m-4 max-w-xs">
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <Workflow className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-gray-900">Leave Request Flow</h3>
              </div>
              <div className="text-sm space-y-1 text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span>Employee submits</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <span>Manager approves</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                  <span>Days check ({'>'}5?)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <span>HR approval (if {'>'} 5)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                  <span>Update systems</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span>Complete</span>
                </div>
              </div>
            </div>
          </Panel>
        </ReactFlow>
      </div>

      {/* Stats Footer */}
      <div className="bg-white border-t-2 border-blue-200 px-6 py-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <span className="text-gray-600">
                Complete workflow automation with <span className="font-semibold text-gray-900">9 specialized nodes</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-600" />
              <span className="text-gray-600">
                Drag, connect, and build <span className="font-semibold text-gray-900">complex workflows</span>
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <Settings className="w-4 h-4" />
            <span>Interactive workflow designer • Production ready</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function WorkFlowShowcase() {
  return (
    <ReactFlowProvider>
      <WorkFlowShowcaseInner />
    </ReactFlowProvider>
  );
}