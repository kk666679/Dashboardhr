import React, { memo } from 'react';
import { 
  EdgeProps, 
  getBezierPath, 
  getStraightPath,
  getSmoothStepPath,
  EdgeLabelRenderer,
  BaseEdge,
  Position
} from 'reactflow';
import { 
  ArrowRight, 
  ChevronRight, 
  TrendingUp, 
  Zap,
  Link2,
  GitBranch,
  Share2,
  Info
} from 'lucide-react';

// Animated Gradient Edge
export const AnimatedGradientEdge = memo(({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}: EdgeProps) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <defs>
        <linearGradient id={`gradient-${id}`} gradientUnits="userSpaceOnUse" x1={sourceX} y1={sourceY} x2={targetX} y2={targetY}>
          <stop offset="0%" stopColor="#EC4899" />
          <stop offset="50%" stopColor="#A855F7" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
        <linearGradient id={`animated-gradient-${id}`}>
          <stop offset="0%" stopColor="#EC4899" stopOpacity="0.8">
            <animate attributeName="offset" values="0;1" dur="2s" repeatCount="indefinite" />
          </stop>
          <stop offset="50%" stopColor="#A855F7" stopOpacity="0.8">
            <animate attributeName="offset" values="0.5;1.5" dur="2s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.8">
            <animate attributeName="offset" values="1;2" dur="2s" repeatCount="indefinite" />
          </stop>
        </linearGradient>
      </defs>

      {/* Glow effect */}
      <path
        d={edgePath}
        fill="none"
        stroke={`url(#gradient-${id})`}
        strokeWidth={8}
        opacity={0.2}
        style={{ filter: 'blur(4px)' }}
      />

      {/* Main path */}
      <path
        id={id}
        d={edgePath}
        fill="none"
        stroke={`url(#animated-gradient-${id})`}
        strokeWidth={3}
        markerEnd={markerEnd}
        style={{
          ...style,
          strokeDasharray: '10 5',
          animation: 'dash 20s linear infinite',
        }}
      />

      {data?.label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
            }}
            className="nodrag nopan"
          >
            <div className="bg-white px-3 py-1 rounded-full shadow-lg border-2 border-pink-200 text-sm text-gray-700 font-medium">
              {data.label}
            </div>
          </div>
        </EdgeLabelRenderer>
      )}

      <style>
        {`
          @keyframes dash {
            to {
              stroke-dashoffset: -1000;
            }
          }
        `}
      </style>
    </>
  );
});

AnimatedGradientEdge.displayName = 'AnimatedGradientEdge';

// Pulse Edge
export const PulseEdge = memo(({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}: EdgeProps) => {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      {/* Animated pulse circle */}
      <circle r="8" fill="#EC4899">
        <animateMotion dur="3s" repeatCount="indefinite" path={edgePath} />
        <animate attributeName="r" values="4;8;4" dur="1.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" />
      </circle>

      {/* Main path */}
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          ...style,
          stroke: '#A855F7',
          strokeWidth: 3,
        }}
        markerEnd={markerEnd}
      />

      {data?.label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
            }}
            className="nodrag nopan"
          >
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 py-1 rounded-lg shadow-lg text-xs font-semibold flex items-center gap-1">
              <Zap className="w-3 h-3" />
              {data.label}
            </div>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
});

PulseEdge.displayName = 'PulseEdge';

// Dashed Connection Edge
export const DashedConnectionEdge = memo(({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}: EdgeProps) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          ...style,
          stroke: '#C084FC',
          strokeWidth: 2,
          strokeDasharray: '8 4',
        }}
        markerEnd={markerEnd}
      />

      {data?.label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
            }}
            className="nodrag nopan"
          >
            <div className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-medium flex items-center gap-1 border border-purple-200">
              <GitBranch className="w-3 h-3" />
              {data.label}
            </div>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
});

DashedConnectionEdge.displayName = 'DashedConnectionEdge';

// Thick Gradient Edge
export const ThickGradientEdge = memo(({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
  selected,
}: EdgeProps) => {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 20,
  });

  return (
    <>
      <defs>
        <linearGradient id={`thick-gradient-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#EC4899" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>

      {/* Shadow */}
      {selected && (
        <path
          d={edgePath}
          fill="none"
          stroke="#EC4899"
          strokeWidth={10}
          opacity={0.3}
          style={{ filter: 'blur(6px)' }}
        />
      )}

      {/* Main path */}
      <path
        id={id}
        d={edgePath}
        fill="none"
        stroke={`url(#thick-gradient-${id})`}
        strokeWidth={selected ? 6 : 4}
        markerEnd={markerEnd}
        style={{
          ...style,
          transition: 'all 0.2s ease',
        }}
      />

      {data?.label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
            }}
            className="nodrag nopan"
          >
            <div className="bg-white px-3 py-2 rounded-lg shadow-xl border-2 border-pink-300 text-sm font-semibold text-gray-800 flex items-center gap-2">
              <ArrowRight className="w-4 h-4 text-pink-500" />
              {data.label}
              {data.count && (
                <span className="px-2 py-0.5 bg-pink-100 text-pink-700 rounded-full text-xs">
                  {data.count}
                </span>
              )}
            </div>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
});

ThickGradientEdge.displayName = 'ThickGradientEdge';

// Bidirectional Edge
export const BidirectionalEdge = memo(({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
}: EdgeProps) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <defs>
        <marker
          id={`arrow-start-${id}`}
          markerWidth="12"
          markerHeight="12"
          refX="6"
          refY="6"
          orient="auto-start-reverse"
        >
          <polygon points="0 0, 12 6, 0 12" fill="#A855F7" />
        </marker>
        <marker
          id={`arrow-end-${id}`}
          markerWidth="12"
          markerHeight="12"
          refX="6"
          refY="6"
          orient="auto"
        >
          <polygon points="0 0, 12 6, 0 12" fill="#A855F7" />
        </marker>
      </defs>

      <path
        id={id}
        d={edgePath}
        fill="none"
        stroke="#A855F7"
        strokeWidth={3}
        markerStart={`url(#arrow-start-${id})`}
        markerEnd={`url(#arrow-end-${id})`}
        style={style}
      />

      {data?.label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
            }}
            className="nodrag nopan"
          >
            <div className="bg-purple-500 text-white px-3 py-1 rounded-full shadow-lg text-xs font-semibold flex items-center gap-1">
              <Share2 className="w-3 h-3" />
              {data.label}
            </div>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
});

BidirectionalEdge.displayName = 'BidirectionalEdge';

// Step Edge with Icons
export const StepEdgeWithIcons = memo(({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}: EdgeProps) => {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          ...style,
          stroke: '#F472B6',
          strokeWidth: 2.5,
        }}
        markerEnd={markerEnd}
      />

      {data?.icons && data.icons.length > 0 && (
        <EdgeLabelRenderer>
          {data.icons.map((iconData: any, index: number) => {
            const position = (index + 1) / (data.icons.length + 1);
            const x = sourceX + (targetX - sourceX) * position;
            const y = sourceY + (targetY - sourceY) * position;
            
            return (
              <div
                key={`icon-${index}`}
                style={{
                  position: 'absolute',
                  transform: `translate(-50%, -50%) translate(${x}px,${y}px)`,
                  pointerEvents: 'all',
                }}
                className="nodrag nopan"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                  <ChevronRight className="w-4 h-4 text-white" />
                </div>
              </div>
            );
          })}
        </EdgeLabelRenderer>
      )}

      {data?.label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
            }}
            className="nodrag nopan"
          >
            <div className="bg-white px-3 py-1 rounded-lg shadow-md border border-pink-200 text-sm text-gray-700 font-medium">
              {data.label}
            </div>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
});

StepEdgeWithIcons.displayName = 'StepEdgeWithIcons';

// Straight Arrow Edge
export const StraightArrowEdge = memo(({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}: EdgeProps) => {
  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          ...style,
          stroke: '#8B5CF6',
          strokeWidth: 2,
        }}
        markerEnd={markerEnd}
      />

      {data?.label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
            }}
            className="nodrag nopan"
          >
            <div className="bg-violet-100 text-violet-700 px-2 py-1 rounded text-xs font-medium">
              {data.label}
            </div>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
});

StraightArrowEdge.displayName = 'StraightArrowEdge';

// Glowing Edge
export const GlowingEdge = memo(({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
  selected,
}: EdgeProps) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <defs>
        <filter id={`glow-${id}`}>
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Outer glow */}
      <path
        d={edgePath}
        fill="none"
        stroke={selected ? '#EC4899' : '#F9A8D4'}
        strokeWidth={12}
        opacity={0.3}
        filter={`url(#glow-${id})`}
      />

      {/* Inner glow */}
      <path
        d={edgePath}
        fill="none"
        stroke={selected ? '#EC4899' : '#F9A8D4'}
        strokeWidth={6}
        opacity={0.6}
      />

      {/* Main path */}
      <path
        id={id}
        d={edgePath}
        fill="none"
        stroke={selected ? '#EC4899' : '#F472B6'}
        strokeWidth={3}
        markerEnd={markerEnd}
        style={style}
      />

      {data?.label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
            }}
            className="nodrag nopan"
          >
            <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-3 py-2 rounded-xl shadow-lg text-sm font-semibold border-2 border-white">
              {data.label}
            </div>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
});

GlowingEdge.displayName = 'GlowingEdge';

// Info Edge with Tooltip
export const InfoEdge = memo(({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}: EdgeProps) => {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const [showTooltip, setShowTooltip] = React.useState(false);

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          ...style,
          stroke: '#94A3B8',
          strokeWidth: 2,
        }}
        markerEnd={markerEnd}
      />

      {data?.info && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
            }}
            className="nodrag nopan"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <div className="relative">
              <button className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors">
                <Info className="w-4 h-4" />
              </button>
              
              {showTooltip && (
                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg shadow-xl text-xs whitespace-nowrap">
                  {data.info}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                    <div className="w-2 h-2 bg-gray-900 transform rotate-45"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
});

InfoEdge.displayName = 'InfoEdge';
