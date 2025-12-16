import React, { memo } from 'react';
import { Handle, Position, NodeProps, NodeToolbar } from 'reactflow';
import { 
  Play,
  CheckCircle2,
  XCircle,
  GitBranch,
  UserCheck,
  Mail,
  Clock,
  Bell,
  Database,
  Code,
  FileText,
  Settings,
  Trash2,
  Copy,
  Edit,
  Send,
  Users,
  Calendar,
  DollarSign,
  Award,
  Shield,
  Zap,
  AlertCircle,
  Pause,
  RotateCw
} from 'lucide-react';

// Start Node
export const StartNode = memo(({ data, selected }: NodeProps) => {
  return (
    <>
      <NodeToolbar
        isVisible={selected}
        position={Position.Top}
        className="flex items-center gap-1 bg-white rounded-lg shadow-lg border-2 border-green-200 p-1"
      >
        <button className="p-1.5 hover:bg-green-50 rounded">
          <Edit className="w-4 h-4 text-green-600" />
        </button>
        <button className="p-1.5 hover:bg-red-50 rounded">
          <Trash2 className="w-4 h-4 text-red-600" />
        </button>
      </NodeToolbar>

      <div 
        className={`rounded-full flex items-center justify-center transition-all ${
          selected 
            ? 'ring-4 ring-green-300 shadow-2xl scale-110' 
            : 'shadow-xl hover:shadow-2xl'
        }`}
        style={{ width: 120, height: 120 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 rounded-full"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.4),transparent)] rounded-full"></div>
        
        <div className="relative text-center text-white p-4">
          <Play className="w-10 h-10 mx-auto mb-2" />
          <p className="text-sm font-semibold">{data.label || 'Start'}</p>
        </div>

        <Handle
          type="source"
          position={Position.Bottom}
          className="w-3 h-3 !bg-green-600 !border-2 !border-white"
        />
      </div>
    </>
  );
});

StartNode.displayName = 'StartNode';

// End Node
export const EndNode = memo(({ data, selected }: NodeProps) => {
  const isSuccess = data.type === 'success';
  const colors = isSuccess 
    ? { from: 'from-green-500', to: 'to-emerald-500', ring: 'ring-green-300', icon: CheckCircle2 }
    : { from: 'from-red-500', to: 'to-rose-500', ring: 'ring-red-300', icon: XCircle };

  const Icon = colors.icon;

  return (
    <>
      <NodeToolbar
        isVisible={selected}
        position={Position.Top}
        className="flex items-center gap-1 bg-white rounded-lg shadow-lg border-2 border-gray-200 p-1"
      >
        <button className="p-1.5 hover:bg-gray-50 rounded">
          <Edit className="w-4 h-4 text-gray-600" />
        </button>
      </NodeToolbar>

      <div 
        className={`rounded-full flex items-center justify-center transition-all ${
          selected ? `ring-4 ${colors.ring} shadow-2xl scale-110` : 'shadow-xl hover:shadow-2xl'
        }`}
        style={{ width: 120, height: 120 }}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${colors.from} ${colors.to} rounded-full`}></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.4),transparent)] rounded-full"></div>
        
        <div className="relative text-center text-white p-4">
          <Icon className="w-10 h-10 mx-auto mb-2" />
          <p className="text-sm font-semibold">{data.label || 'End'}</p>
        </div>

        <Handle
          type="target"
          position={Position.Top}
          className={`w-3 h-3 ${isSuccess ? '!bg-green-600' : '!bg-red-600'} !border-2 !border-white`}
        />
      </div>
    </>
  );
});

EndNode.displayName = 'EndNode';

// Action Node
export const ActionNode = memo(({ data, selected }: NodeProps) => {
  const iconMap: { [key: string]: any } = {
    email: Mail,
    notification: Bell,
    database: Database,
    api: Code,
    document: FileText,
    user: Users,
    calendar: Calendar,
    payment: DollarSign,
    default: Zap,
  };

  const Icon = iconMap[data.actionType || 'default'];

  return (
    <>
      <NodeToolbar
        isVisible={selected}
        position={Position.Top}
        className="flex items-center gap-1 bg-white rounded-lg shadow-lg border-2 border-blue-200 p-1"
      >
        <button className="p-1.5 hover:bg-blue-50 rounded">
          <Edit className="w-4 h-4 text-blue-600" />
        </button>
        <button className="p-1.5 hover:bg-purple-50 rounded">
          <Copy className="w-4 h-4 text-purple-600" />
        </button>
        <button className="p-1.5 hover:bg-red-50 rounded">
          <Trash2 className="w-4 h-4 text-red-600" />
        </button>
      </NodeToolbar>

      <div 
        className={`bg-white rounded-xl border-2 transition-all ${
          selected 
            ? 'border-blue-500 shadow-2xl scale-105' 
            : 'border-blue-200 shadow-lg hover:shadow-xl'
        }`}
        style={{ minWidth: '240px' }}
      >
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 !bg-blue-500 !border-2 !border-white"
        />

        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-3 rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white/80">Action</p>
              <h4 className="text-sm font-semibold truncate">{data.label}</h4>
            </div>
          </div>
        </div>

        <div className="p-3">
          {data.description && (
            <p className="text-xs text-gray-600 mb-2">{data.description}</p>
          )}
          {data.duration && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              <span>{data.duration}</span>
            </div>
          )}
        </div>

        <Handle
          type="source"
          position={Position.Bottom}
          className="w-3 h-3 !bg-blue-500 !border-2 !border-white"
        />
      </div>
    </>
  );
});

ActionNode.displayName = 'ActionNode';

// Decision Node
export const DecisionNode = memo(({ data, selected }: NodeProps) => {
  return (
    <>
      <NodeToolbar
        isVisible={selected}
        position={Position.Top}
        className="flex items-center gap-1 bg-white rounded-lg shadow-lg border-2 border-amber-200 p-1"
      >
        <button className="p-1.5 hover:bg-amber-50 rounded">
          <Edit className="w-4 h-4 text-amber-600" />
        </button>
        <button className="p-1.5 hover:bg-red-50 rounded">
          <Trash2 className="w-4 h-4 text-red-600" />
        </button>
      </NodeToolbar>

      <div className="relative" style={{ width: 180, height: 180 }}>
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 !bg-amber-500 !border-2 !border-white"
          style={{ top: 20 }}
        />

        <div 
          className={`absolute inset-0 transform rotate-45 bg-gradient-to-br from-amber-500 to-orange-500 transition-all ${
            selected ? 'ring-4 ring-amber-300 shadow-2xl scale-105' : 'shadow-xl'
          }`}
          style={{ borderRadius: '20px' }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent)]"></div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-[140px]">
            <GitBranch className="w-8 h-8 mx-auto mb-2" />
            <p className="text-xs text-white/80 mb-1">Decision</p>
            <h4 className="text-sm font-semibold">{data.label}</h4>
          </div>
        </div>

        <Handle
          type="source"
          position={Position.Right}
          id="yes"
          className="w-3 h-3 !bg-green-500 !border-2 !border-white"
          style={{ right: 20 }}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          id="no"
          className="w-3 h-3 !bg-red-500 !border-2 !border-white"
          style={{ bottom: 20 }}
        />
      </div>
    </>
  );
});

DecisionNode.displayName = 'DecisionNode';

// Approval Node
export const ApprovalNode = memo(({ data, selected }: NodeProps) => {
  return (
    <>
      <NodeToolbar
        isVisible={selected}
        position={Position.Top}
        className="flex items-center gap-1 bg-white rounded-lg shadow-lg border-2 border-purple-200 p-1"
      >
        <button className="p-1.5 hover:bg-purple-50 rounded">
          <Edit className="w-4 h-4 text-purple-600" />
        </button>
        <button className="p-1.5 hover:bg-pink-50 rounded">
          <Copy className="w-4 h-4 text-pink-600" />
        </button>
        <button className="p-1.5 hover:bg-red-50 rounded">
          <Trash2 className="w-4 h-4 text-red-600" />
        </button>
      </NodeToolbar>

      <div 
        className={`bg-white rounded-2xl border-2 transition-all ${
          selected 
            ? 'border-purple-500 shadow-2xl scale-105' 
            : 'border-purple-200 shadow-lg hover:shadow-xl'
        }`}
        style={{ minWidth: '260px' }}
      >
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 !bg-purple-500 !border-2 !border-white"
        />

        <div className="bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 text-white px-4 py-3 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white/80">Requires Approval</p>
              <h4 className="text-sm font-semibold truncate">{data.label}</h4>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-3">
          {data.approver && (
            <div className="flex items-center gap-2 text-sm">
              <Shield className="w-4 h-4 text-purple-400" />
              <span className="text-gray-700">{data.approver}</span>
            </div>
          )}
          {data.sla && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-pink-400" />
              <span className="text-gray-700">SLA: {data.sla}</span>
            </div>
          )}
          {data.priority && (
            <div className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
              <Award className="w-3 h-3" />
              {data.priority}
            </div>
          )}
        </div>

        <Handle
          type="source"
          position={Position.Bottom}
          id="approved"
          className="w-3 h-3 !bg-green-500 !border-2 !border-white"
          style={{ left: '33%' }}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          id="rejected"
          className="w-3 h-3 !bg-red-500 !border-2 !border-white"
          style={{ left: '66%' }}
        />
      </div>
    </>
  );
});

ApprovalNode.displayName = 'ApprovalNode';

// Wait/Delay Node
export const WaitNode = memo(({ data, selected }: NodeProps) => {
  return (
    <>
      <NodeToolbar
        isVisible={selected}
        position={Position.Top}
        className="flex items-center gap-1 bg-white rounded-lg shadow-lg border-2 border-gray-200 p-1"
      >
        <button className="p-1.5 hover:bg-gray-50 rounded">
          <Edit className="w-4 h-4 text-gray-600" />
        </button>
      </NodeToolbar>

      <div 
        className={`bg-white rounded-lg border-2 transition-all ${
          selected 
            ? 'border-gray-500 shadow-xl scale-105' 
            : 'border-gray-300 shadow-md hover:shadow-lg'
        }`}
        style={{ width: '200px' }}
      >
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 !bg-gray-500 !border-2 !border-white"
        />

        <div className="p-4 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <p className="text-xs text-gray-500 mb-1">Wait</p>
          <p className="text-sm font-semibold text-gray-900">{data.duration || '1 hour'}</p>
          {data.description && (
            <p className="text-xs text-gray-600 mt-2">{data.description}</p>
          )}
        </div>

        <Handle
          type="source"
          position={Position.Bottom}
          className="w-3 h-3 !bg-gray-500 !border-2 !border-white"
        />
      </div>
    </>
  );
});

WaitNode.displayName = 'WaitNode';

// Notification Node
export const NotificationNode = memo(({ data, selected }: NodeProps) => {
  return (
    <>
      <NodeToolbar
        isVisible={selected}
        position={Position.Top}
        className="flex items-center gap-1 bg-white rounded-lg shadow-lg border-2 border-indigo-200 p-1"
      >
        <button className="p-1.5 hover:bg-indigo-50 rounded">
          <Edit className="w-4 h-4 text-indigo-600" />
        </button>
        <button className="p-1.5 hover:bg-red-50 rounded">
          <Trash2 className="w-4 h-4 text-red-600" />
        </button>
      </NodeToolbar>

      <div 
        className={`bg-white rounded-xl border-2 transition-all ${
          selected 
            ? 'border-indigo-500 shadow-xl scale-105' 
            : 'border-indigo-200 shadow-md hover:shadow-lg'
        }`}
        style={{ minWidth: '220px' }}
      >
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 !bg-indigo-500 !border-2 !border-white"
        />

        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Bell className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 mb-1">Send Notification</p>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">{data.label}</h4>
              {data.recipients && (
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <Users className="w-3 h-3" />
                  <span>{data.recipients}</span>
                </div>
              )}
              {data.channel && (
                <div className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs mt-2">
                  {data.channel === 'email' ? <Mail className="w-3 h-3" /> : <Bell className="w-3 h-3" />}
                  {data.channel}
                </div>
              )}
            </div>
          </div>
        </div>

        <Handle
          type="source"
          position={Position.Bottom}
          className="w-3 h-3 !bg-indigo-500 !border-2 !border-white"
        />
      </div>
    </>
  );
});

NotificationNode.displayName = 'NotificationNode';

// Parallel Gateway Node
export const ParallelNode = memo(({ data, selected }: NodeProps) => {
  return (
    <>
      <NodeToolbar
        isVisible={selected}
        position={Position.Top}
        className="flex items-center gap-1 bg-white rounded-lg shadow-lg border-2 border-teal-200 p-1"
      >
        <button className="p-1.5 hover:bg-teal-50 rounded">
          <Edit className="w-4 h-4 text-teal-600" />
        </button>
      </NodeToolbar>

      <div className="relative" style={{ width: 140, height: 140 }}>
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 !bg-teal-500 !border-2 !border-white"
          style={{ top: 15 }}
        />

        <div 
          className={`absolute inset-0 transform rotate-45 bg-gradient-to-br from-teal-500 to-cyan-500 transition-all ${
            selected ? 'ring-4 ring-teal-300 shadow-2xl scale-105' : 'shadow-lg'
          }`}
          style={{ borderRadius: '12px' }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="transform -rotate-45 text-white">
              <RotateCw className="w-8 h-8" />
            </div>
          </div>
        </div>

        <Handle
          type="source"
          position={Position.Bottom}
          id="branch1"
          className="w-3 h-3 !bg-teal-500 !border-2 !border-white"
          style={{ bottom: 15, left: '33%' }}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          id="branch2"
          className="w-3 h-3 !bg-teal-500 !border-2 !border-white"
          style={{ bottom: 15, left: '66%' }}
        />
      </div>
    </>
  );
});

ParallelNode.displayName = 'ParallelNode';

// Error Handler Node
export const ErrorNode = memo(({ data, selected }: NodeProps) => {
  return (
    <div 
      className={`bg-white rounded-lg border-2 transition-all ${
        selected 
          ? 'border-red-500 shadow-xl scale-105' 
          : 'border-red-200 shadow-md'
      }`}
      style={{ width: '180px' }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-red-500 !border-2 !border-white"
      />

      <div className="p-3 text-center">
        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
        </div>
        <p className="text-xs text-gray-500">Error Handler</p>
        <p className="text-sm font-semibold text-gray-900">{data.label || 'Handle Error'}</p>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-red-500 !border-2 !border-white"
      />
    </div>
  );
});

ErrorNode.displayName = 'ErrorNode';
