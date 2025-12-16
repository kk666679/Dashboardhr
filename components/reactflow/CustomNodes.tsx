import React, { memo } from 'react';
import { Handle, Position, NodeProps, NodeToolbar } from 'reactflow';
import { 
  User, 
  Building2, 
  Briefcase, 
  Mail, 
  Phone, 
  MapPin, 
  Award,
  Settings,
  Trash2,
  Copy,
  Link2,
  MoreVertical,
  Plus,
  Minus,
  Sparkles,
  TrendingUp,
  Users
} from 'lucide-react';

// Enhanced Employee Node with Toolbar
export const EnhancedEmployeeNode = memo(({ data, selected }: NodeProps) => {
  const getDepartmentGradient = (department: string) => {
    const gradients: { [key: string]: string } = {
      'Executive': 'from-pink-500 via-rose-500 to-red-500',
      'HR': 'from-purple-500 via-violet-500 to-indigo-500',
      'Finance': 'from-fuchsia-500 via-pink-500 to-rose-500',
      'IT': 'from-violet-500 via-purple-500 to-fuchsia-500',
      'Marketing': 'from-rose-500 via-pink-500 to-fuchsia-500',
      'Operations': 'from-purple-500 via-fuchsia-500 to-pink-500',
    };
    return gradients[department] || 'from-gray-500 to-gray-600';
  };

  return (
    <>
      {/* Node Toolbar - appears on hover/select */}
      <NodeToolbar
        isVisible={selected}
        position={Position.Top}
        className="flex items-center gap-1 bg-white rounded-lg shadow-lg border-2 border-pink-200 p-1"
      >
        <button
          onClick={() => data.onEdit?.(data)}
          className="p-1.5 hover:bg-pink-50 rounded transition-colors"
          title="Edit"
        >
          <Settings className="w-4 h-4 text-pink-600" />
        </button>
        <button
          onClick={() => data.onDuplicate?.(data)}
          className="p-1.5 hover:bg-purple-50 rounded transition-colors"
          title="Duplicate"
        >
          <Copy className="w-4 h-4 text-purple-600" />
        </button>
        <button
          onClick={() => data.onAddChild?.(data)}
          className="p-1.5 hover:bg-violet-50 rounded transition-colors"
          title="Add Child"
        >
          <Plus className="w-4 h-4 text-violet-600" />
        </button>
        <div className="w-px h-5 bg-pink-200"></div>
        <button
          onClick={() => data.onDelete?.(data)}
          className="p-1.5 hover:bg-red-50 rounded transition-colors"
          title="Delete"
        >
          <Trash2 className="w-4 h-4 text-red-600" />
        </button>
      </NodeToolbar>

      {/* Main Node */}
      <div 
        className={`bg-white rounded-2xl border-2 transition-all duration-300 ${
          selected 
            ? 'border-pink-500 shadow-2xl shadow-pink-200 scale-105' 
            : 'border-pink-200 shadow-lg hover:shadow-xl hover:border-pink-300'
        }`}
        style={{ minWidth: '280px' }}
      >
        {/* Top Handles */}
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 !bg-gradient-to-r from-pink-500 to-rose-500 !border-2 !border-white"
        />

        {/* Header */}
        <div className={`bg-gradient-to-r ${getDepartmentGradient(data.department)} text-white px-4 py-3 rounded-t-2xl relative overflow-hidden`}>
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.5),transparent)]"></div>
          </div>
          
          <div className="relative flex items-center gap-3">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0 ring-2 ring-white/30">
              <User className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold truncate">{data.name}</h3>
              <p className="text-xs text-white/80">{data.position}</p>
              {data.employeeCount && (
                <div className="flex items-center gap-1 mt-1">
                  <Users className="w-3 h-3" />
                  <span className="text-xs">{data.employeeCount} reports</span>
                </div>
              )}
            </div>
            {data.performance && (
              <div className="flex flex-col items-center gap-1 bg-white/20 px-2 py-1 rounded-lg backdrop-blur-sm">
                <Award className="w-4 h-4" />
                <span className="text-xs font-semibold">{data.performance}%</span>
              </div>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="p-4 space-y-2.5">
          {data.email && (
            <div className="flex items-center gap-2 text-sm text-gray-700 group">
              <Mail className="w-4 h-4 text-pink-400 flex-shrink-0" />
              <span className="truncate group-hover:text-pink-600 transition-colors">{data.email}</span>
            </div>
          )}
          
          {data.phone && (
            <div className="flex items-center gap-2 text-sm text-gray-700 group">
              <Phone className="w-4 h-4 text-purple-400 flex-shrink-0" />
              <span className="truncate group-hover:text-purple-600 transition-colors">{data.phone}</span>
            </div>
          )}
          
          {data.location && (
            <div className="flex items-center gap-2 text-sm text-gray-700 group">
              <MapPin className="w-4 h-4 text-violet-400 flex-shrink-0" />
              <span className="truncate group-hover:text-violet-600 transition-colors">{data.location}</span>
            </div>
          )}

          {/* Stats */}
          {(data.projects || data.tasks) && (
            <div className="flex items-center gap-3 pt-2 border-t border-pink-100">
              {data.projects && (
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <Briefcase className="w-3 h-3 text-pink-400" />
                  <span>{data.projects} projects</span>
                </div>
              )}
              {data.tasks && (
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <TrendingUp className="w-3 h-3 text-purple-400" />
                  <span>{data.tasks} tasks</span>
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="pt-2 border-t border-pink-100 flex items-center justify-between">
            <span className="text-xs px-2 py-1 bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 rounded-full font-medium">
              {data.department}
            </span>
            {selected && (
              <Sparkles className="w-4 h-4 text-pink-500 animate-pulse" />
            )}
          </div>
        </div>

        {/* Bottom Handles */}
        <Handle
          type="source"
          position={Position.Bottom}
          className="w-3 h-3 !bg-gradient-to-r from-purple-500 to-violet-500 !border-2 !border-white"
        />

        {/* Side Handles */}
        <Handle
          type="source"
          position={Position.Right}
          id="right"
          className="w-3 h-3 !bg-gradient-to-r from-fuchsia-500 to-pink-500 !border-2 !border-white"
        />
        <Handle
          type="target"
          position={Position.Left}
          id="left"
          className="w-3 h-3 !bg-gradient-to-r from-violet-500 to-purple-500 !border-2 !border-white"
        />
      </div>
    </>
  );
});

EnhancedEmployeeNode.displayName = 'EnhancedEmployeeNode';

// Department Group Node
export const DepartmentGroupNode = memo(({ data, selected }: NodeProps) => {
  return (
    <div 
      className={`bg-gradient-to-br from-pink-50 to-purple-50 rounded-3xl border-2 border-dashed transition-all duration-300 ${
        selected ? 'border-pink-400 shadow-2xl' : 'border-pink-200 shadow-lg'
      }`}
      style={{ minWidth: '400px', minHeight: '300px', padding: '20px' }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-4 h-4 !bg-pink-500 !border-2 !border-white opacity-0"
      />

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{data.name}</h3>
            <p className="text-sm text-gray-600">{data.employeeCount} employees</p>
          </div>
        </div>
        <div className="px-3 py-1 bg-white rounded-lg border border-pink-200">
          <span className="text-sm text-pink-600 font-medium">{data.department}</span>
        </div>
      </div>

      {data.description && (
        <p className="text-sm text-gray-600 mb-4">{data.description}</p>
      )}

      {/* Stats Grid */}
      {data.stats && (
        <div className="grid grid-cols-3 gap-3">
          {Object.entries(data.stats).map(([key, value]) => (
            <div key={key} className="bg-white rounded-lg p-3 border border-pink-100">
              <p className="text-xs text-gray-500 capitalize">{key}</p>
              <p className="text-lg font-semibold text-gray-900">{value as string}</p>
            </div>
          ))}
        </div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-4 h-4 !bg-purple-500 !border-2 !border-white opacity-0"
      />
    </div>
  );
});

DepartmentGroupNode.displayName = 'DepartmentGroupNode';

// Compact Card Node
export const CompactCardNode = memo(({ data, selected }: NodeProps) => {
  return (
    <>
      <NodeToolbar
        isVisible={selected}
        position={Position.Top}
        className="flex items-center gap-1 bg-white rounded-lg shadow-lg border border-pink-200 p-1"
      >
        <button className="p-1 hover:bg-pink-50 rounded">
          <MoreVertical className="w-3 h-3 text-pink-600" />
        </button>
      </NodeToolbar>

      <div 
        className={`bg-white rounded-xl border transition-all ${
          selected ? 'border-pink-400 shadow-lg' : 'border-pink-200 shadow'
        }`}
        style={{ width: '180px' }}
      >
        <Handle
          type="target"
          position={Position.Top}
          className="w-2 h-2 !bg-pink-500 !border-white"
        />

        <div className="p-3 space-y-2">
          <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-400 rounded-lg flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 truncate">{data.name}</h4>
            <p className="text-xs text-gray-600 truncate">{data.position}</p>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-pink-100">
            <span className="text-xs text-gray-500">{data.department}</span>
            {data.performance && (
              <span className="text-xs text-pink-600 font-medium">{data.performance}%</span>
            )}
          </div>
        </div>

        <Handle
          type="source"
          position={Position.Bottom}
          className="w-2 h-2 !bg-purple-500 !border-white"
        />
      </div>
    </>
  );
});

CompactCardNode.displayName = 'CompactCardNode';

// Circular Node
export const CircularNode = memo(({ data, selected }: NodeProps) => {
  const size = data.type === 'ceo' ? 160 : 120;
  
  return (
    <div className="relative">
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-pink-500 !border-2 !border-white"
        style={{ top: -8 }}
      />

      <div 
        className={`bg-gradient-to-br from-pink-500 via-purple-500 to-violet-500 rounded-full flex flex-col items-center justify-center text-white transition-all duration-300 ${
          selected ? 'ring-4 ring-pink-300 shadow-2xl scale-110' : 'shadow-xl hover:shadow-2xl'
        }`}
        style={{ width: size, height: size }}
      >
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.3),transparent)] pointer-events-none"></div>
        
        <div className="relative text-center p-4">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-2">
            <User className="w-6 h-6 text-white" />
          </div>
          <h4 className="font-semibold text-sm mb-1">{data.name}</h4>
          <p className="text-xs text-white/80">{data.position}</p>
          {data.performance && (
            <div className="mt-2 flex items-center justify-center gap-1">
              <Award className="w-3 h-3" />
              <span className="text-xs">{data.performance}%</span>
            </div>
          )}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-purple-500 !border-2 !border-white"
        style={{ bottom: -8 }}
      />
    </div>
  );
});

CircularNode.displayName = 'CircularNode';

// Diamond Node
export const DiamondNode = memo(({ data, selected }: NodeProps) => {
  return (
    <div className="relative" style={{ width: 200, height: 200 }}>
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-pink-500 !border-2 !border-white"
        style={{ top: -8 }}
      />

      <div 
        className={`absolute inset-0 transform rotate-45 bg-gradient-to-br from-fuchsia-500 to-pink-500 transition-all duration-300 ${
          selected ? 'ring-4 ring-pink-300 shadow-2xl scale-105' : 'shadow-xl'
        }`}
        style={{ borderRadius: '20px' }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent)]"></div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white max-w-[140px]">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-2">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <h4 className="font-semibold text-sm mb-1">{data.name}</h4>
          <p className="text-xs text-white/80">{data.position}</p>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-purple-500 !border-2 !border-white"
        style={{ bottom: -8 }}
      />
    </div>
  );
});

DiamondNode.displayName = 'DiamondNode';

// Hexagon Node
export const HexagonNode = memo(({ data, selected }: NodeProps) => {
  return (
    <div className="relative" style={{ width: 180, height: 200 }}>
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-pink-500 !border-2 !border-white"
        style={{ top: 10 }}
      />

      <svg width="180" height="200" viewBox="0 0 180 200" className={`transition-all duration-300 ${selected ? 'drop-shadow-2xl scale-105' : 'drop-shadow-xl'}`}>
        <defs>
          <linearGradient id={`hexGrad-${data.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EC4899" />
            <stop offset="100%" stopColor="#A855F7" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <path
          d="M 90 15 L 165 60 L 165 140 L 90 185 L 15 140 L 15 60 Z"
          fill={`url(#hexGrad-${data.id})`}
          stroke={selected ? '#F9A8D4' : 'white'}
          strokeWidth={selected ? '4' : '3'}
          filter={selected ? 'url(#glow)' : undefined}
        />
      </svg>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white max-w-[120px] mt-4">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-2">
            <User className="w-6 h-6 text-white" />
          </div>
          <h4 className="font-semibold text-sm mb-1">{data.name}</h4>
          <p className="text-xs text-white/80">{data.position}</p>
          {data.department && (
            <p className="text-xs text-white/60 mt-1">{data.department}</p>
          )}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-purple-500 !border-2 !border-white"
        style={{ bottom: 10 }}
      />
    </div>
  );
});

HexagonNode.displayName = 'HexagonNode';

// Pill/Stadium Node
export const StadiumNode = memo(({ data, selected }: NodeProps) => {
  return (
    <div className="relative">
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-pink-500 !border-2 !border-white"
      />

      <div 
        className={`bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500 text-white transition-all duration-300 ${
          selected ? 'ring-4 ring-pink-300 shadow-2xl scale-105' : 'shadow-lg'
        }`}
        style={{ 
          borderRadius: '9999px',
          padding: '12px 24px',
          minWidth: '240px'
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm truncate">{data.name}</h4>
            <p className="text-xs text-white/80 truncate">{data.position}</p>
          </div>
          {data.performance && (
            <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full">
              <Award className="w-3 h-3" />
              <span className="text-xs">{data.performance}%</span>
            </div>
          )}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!bg-purple-500 !border-2 !border-white"
      />
    </div>
  );
});

StadiumNode.displayName = 'StadiumNode';

// Annotation Node
export const AnnotationNode = memo(({ data, selected }: NodeProps) => {
  return (
    <div 
      className={`bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg p-3 transition-all ${
        selected ? 'shadow-xl ring-2 ring-yellow-300' : 'shadow-md'
      }`}
      style={{ maxWidth: '200px' }}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-yellow-400 !border-2 !border-white opacity-0"
      />

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-yellow-600" />
          <span className="text-xs font-semibold text-yellow-800">Note</span>
        </div>
        <p className="text-sm text-gray-700">{data.content}</p>
        {data.author && (
          <p className="text-xs text-gray-500">- {data.author}</p>
        )}
      </div>
    </div>
  );
});

AnnotationNode.displayName = 'AnnotationNode';

// Metric Card Node
export const MetricCardNode = memo(({ data, selected }: NodeProps) => {
  const getColorScheme = (trend: string) => {
    if (trend === 'up') return { bg: 'from-green-500 to-emerald-500', icon: TrendingUp };
    if (trend === 'down') return { bg: 'from-red-500 to-rose-500', icon: TrendingUp };
    return { bg: 'from-blue-500 to-cyan-500', icon: TrendingUp };
  };

  const scheme = getColorScheme(data.trend);
  const Icon = scheme.icon;

  return (
    <div 
      className={`bg-white rounded-2xl border-2 transition-all ${
        selected ? 'border-pink-400 shadow-2xl scale-105' : 'border-gray-200 shadow-lg'
      }`}
      style={{ width: '200px' }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-pink-500 !border-2 !border-white"
      />

      <div className="p-4 space-y-3">
        <div className={`w-12 h-12 bg-gradient-to-br ${scheme.bg} rounded-xl flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        
        <div>
          <p className="text-sm text-gray-600">{data.label}</p>
          <p className="text-2xl font-bold text-gray-900">{data.value}</p>
        </div>

        {data.change && (
          <div className={`flex items-center gap-1 text-sm ${
            data.trend === 'up' ? 'text-green-600' : 
            data.trend === 'down' ? 'text-red-600' : 
            'text-blue-600'
          }`}>
            <TrendingUp className={`w-4 h-4 ${data.trend === 'down' ? 'rotate-180' : ''}`} />
            <span>{data.change}</span>
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-purple-500 !border-2 !border-white"
      />
    </div>
  );
});

MetricCardNode.displayName = 'MetricCardNode';
