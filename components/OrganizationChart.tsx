import React, { useState, useCallback, useRef } from 'react';
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
  NodeProps,
  Panel,
  ReactFlowProvider,
  useReactFlow,
  EdgeProps,
  getBezierPath,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { 
  Users, 
  User, 
  Mail, 
  Phone,
  Building2,
  ChevronDown,
  Plus,
  Download,
  Network,
  Briefcase,
  Grid3x3,
  Search,
  Trash2,
  Edit,
  X,
  Save,
  FileText,
  MapPin,
  Award,
  TrendingUp,
  LayoutTemplate,
  Sparkles,
  Upload,
  RotateCcw,
  Copy,
  Printer,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Filter,
  GitBranch,
  Settings,
  Share2,
  Link2,
  Unlink,
  Move
} from 'lucide-react';

interface EmployeeNode {
  id: string;
  name: string;
  position: string;
  department: string;
  email?: string;
  phone?: string;
  location?: string;
  salary?: string;
  joinDate?: string;
  avatar?: string;
  type?: 'ceo' | 'manager' | 'employee' | 'department';
  employeeCount?: number;
  performance?: number;
  reportsTo?: string;
}

type ViewMode = 'hierarchy' | 'departments' | 'template';
type TemplateType = 'functional' | 'divisional' | 'matrix' | 'flat' | 'network';

// Custom Edge with label
const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  label,
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
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      {label && (
        <text>
          <textPath href={`#${id}`} style={{ fontSize: '12px' }} startOffset="50%" textAnchor="middle">
            {label}
          </textPath>
        </text>
      )}
    </>
  );
};

// Custom Node Component
const CustomNodeComponent = ({ data, selected }: NodeProps<EmployeeNode>) => {
  const getDepartmentColor = (department: string) => {
    const colors: { [key: string]: string } = {
      'Executive': 'from-pink-500 to-rose-600',
      'HR': 'from-purple-500 to-violet-600',
      'Finance': 'from-fuchsia-500 to-pink-600',
      'IT': 'from-violet-500 to-purple-600',
      'Marketing': 'from-rose-500 to-pink-600',
      'Operations': 'from-purple-500 to-fuchsia-600',
      'Sales': 'from-pink-500 to-fuchsia-600',
      'Legal': 'from-indigo-500 to-purple-600',
    };
    return colors[department] || 'from-gray-500 to-gray-600';
  };

  const isCEO = data.type === 'ceo';
  const borderColor = selected ? 'border-pink-500 shadow-xl shadow-pink-200' : isCEO ? 'border-rose-400' : 'border-pink-200';

  return (
    <div 
      className={`bg-white rounded-2xl border-2 shadow-lg hover:shadow-xl transition-all duration-200 cursor-move ${borderColor} ${
        isCEO ? 'min-w-[300px]' : 'min-w-[240px]'
      }`}
    >
      <div className={`bg-gradient-to-r ${getDepartmentColor(data.department)} text-white px-4 py-3 rounded-t-2xl`}>
        <div className="flex items-center gap-3">
          <div className={`${isCEO ? 'w-16 h-16' : 'w-12 h-12'} bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0`}>
            <User className={`${isCEO ? 'w-8 h-8' : 'w-6 h-6'} text-white`} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={`${isCEO ? 'text-lg' : 'text-base'} truncate font-medium`}>{data.name}</h3>
            {data.employeeCount && (
              <p className="text-xs text-white/80">{data.employeeCount} employees</p>
            )}
          </div>
          {data.performance && (
            <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded">
              <Award className="w-3 h-3" />
              <span className="text-xs">{data.performance}%</span>
            </div>
          )}
        </div>
      </div>
      <div className="p-4 space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Briefcase className="w-4 h-4 text-pink-400 flex-shrink-0" />
          <span className="truncate font-medium">{data.position}</span>
        </div>
        {data.email && (
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Mail className="w-3 h-3 text-purple-400 flex-shrink-0" />
            <span className="truncate">{data.email}</span>
          </div>
        )}
        {data.location && (
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <MapPin className="w-3 h-3 text-violet-400 flex-shrink-0" />
            <span className="truncate">{data.location}</span>
          </div>
        )}
        <div className="pt-2 border-t border-pink-100 flex items-center justify-between">
          <span className="text-xs text-gray-500">{data.department}</span>
          {selected && (
            <span className="text-xs text-pink-600 font-medium">Selected</span>
          )}
        </div>
      </div>
    </div>
  );
};

const nodeTypes = {
  custom: CustomNodeComponent,
};

const edgeTypes = {
  custom: CustomEdge,
};

// Full org chart data
const getFullOrgChartData = () => ({
  nodes: [
    { id: 'ceo-001', type: 'custom', position: { x: 650, y: 50 }, data: { id: 'ceo-001', name: "Dato' Ahmad Rahman", position: 'Chief Executive Officer', department: 'Executive', email: 'ahmad.rahman@company.my', location: 'Kuala Lumpur HQ', type: 'ceo', performance: 98, employeeCount: 156 } },
    { id: 'coo-001', type: 'custom', position: { x: 350, y: 250 }, data: { id: 'coo-001', name: 'Tan Wei Ming', position: 'Chief Operating Officer', department: 'Executive', email: 'tan.wei@company.my', location: 'Kuala Lumpur HQ', type: 'manager', performance: 95 } },
    { id: 'cfo-001', type: 'custom', position: { x: 950, y: 250 }, data: { id: 'cfo-001', name: 'Chen Wei', position: 'Chief Financial Officer', department: 'Finance', email: 'chen.wei@company.my', location: 'Kuala Lumpur HQ', type: 'manager', performance: 97 } },
    { id: 'hr-001', type: 'custom', position: { x: 50, y: 450 }, data: { id: 'hr-001', name: 'Siti Nurhaliza', position: 'HR Director', department: 'HR', email: 'siti@company.my', location: 'Kuala Lumpur HQ', type: 'manager', performance: 92, employeeCount: 12 } },
    { id: 'it-001', type: 'custom', position: { x: 400, y: 450 }, data: { id: 'it-001', name: 'Raj Kumar', position: 'IT Director', department: 'IT', email: 'raj@company.my', location: 'Cyberjaya', type: 'manager', performance: 96, employeeCount: 24 } },
    { id: 'fin-001', type: 'custom', position: { x: 850, y: 450 }, data: { id: 'fin-001', name: 'Fatimah Zahra', position: 'Finance Manager', department: 'Finance', email: 'fatimah@company.my', location: 'Kuala Lumpur HQ', type: 'manager', performance: 93, employeeCount: 8 } },
    { id: 'mkt-001', type: 'custom', position: { x: 1200, y: 450 }, data: { id: 'mkt-001', name: 'Layla Ahmed', position: 'Marketing Director', department: 'Marketing', email: 'layla@company.my', location: 'Kuala Lumpur HQ', type: 'manager', performance: 95, employeeCount: 15 } },
  ],
  edges: [
    { id: 'e1', source: 'ceo-001', target: 'coo-001', type: 'smoothstep', animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { strokeWidth: 2, stroke: '#EC4899' }, label: 'Reports to' },
    { id: 'e2', source: 'ceo-001', target: 'cfo-001', type: 'smoothstep', animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { strokeWidth: 2, stroke: '#A855F7' }, label: 'Reports to' },
    { id: 'e4', source: 'coo-001', target: 'hr-001', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed }, style: { strokeWidth: 2, stroke: '#A855F7' } },
    { id: 'e5', source: 'coo-001', target: 'it-001', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed }, style: { strokeWidth: 2, stroke: '#A855F7' } },
    { id: 'e10', source: 'cfo-001', target: 'fin-001', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed }, style: { strokeWidth: 2, stroke: '#EC4899' } },
    { id: 'e3', source: 'ceo-001', target: 'mkt-001', type: 'smoothstep', animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { strokeWidth: 2, stroke: '#F472B6' }, label: 'Reports to' },
  ]
});

function OrganizationChartInner() {
  const [viewMode, setViewMode] = useState<ViewMode>('hierarchy');
  const [backgroundVariant, setBackgroundVariant] = useState<BackgroundVariant>(BackgroundVariant.Dots);
  const [showBackgroundControls, setShowBackgroundControls] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeNode | null>(null);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [history, setHistory] = useState<Array<{ nodes: Node<EmployeeNode>[]; edges: Edge[] }>>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isConnecting, setIsConnecting] = useState(false);
  const [newEmployeeData, setNewEmployeeData] = useState<Partial<EmployeeNode>>({
    name: '',
    position: '',
    department: 'HR',
    email: '',
    phone: '',
    location: 'Kuala Lumpur HQ',
    type: 'employee',
  });

  const reactFlowInstance = useReactFlow();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initialData = getFullOrgChartData();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialData.nodes as Node<EmployeeNode>[]);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialData.edges);

  // Save to history
  const saveToHistory = useCallback(() => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ nodes: [...nodes], edges: [...edges] });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [nodes, edges, history, historyIndex]);

  // Undo
  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setNodes(prevState.nodes);
      setEdges(prevState.edges);
      setHistoryIndex(historyIndex - 1);
    }
  };

  // Redo
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setNodes(nextState.nodes);
      setEdges(nextState.edges);
      setHistoryIndex(historyIndex + 1);
    }
  };

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = {
        ...params,
        type: 'smoothstep',
        animated: true,
        markerEnd: { type: MarkerType.ArrowClosed },
        style: { strokeWidth: 2, stroke: '#EC4899' },
      };
      setEdges((eds) => addEdge(newEdge, eds));
      saveToHistory();
    },
    [setEdges, saveToHistory]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node<EmployeeNode>) => {
    setSelectedEmployee(node.data);
    setShowEmployeeModal(true);
  }, []);

  const onNodeDragStop = useCallback(() => {
    saveToHistory();
  }, [saveToHistory]);

  // Filter nodes based on search and department
  const filteredNodes = nodes.filter(node => {
    const matchesSearch = node.data.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         node.data.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         node.data.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = filterDepartment === 'all' || node.data.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  // Highlight filtered nodes
  const highlightedNodes = filteredNodes.map(node => ({
    ...node,
    style: {
      ...node.style,
      opacity: searchQuery || filterDepartment !== 'all' ? 1 : 1,
    }
  }));

  const unhighlightedNodes = nodes.filter(node => !filteredNodes.includes(node)).map(node => ({
    ...node,
    style: {
      ...node.style,
      opacity: searchQuery || filterDepartment !== 'all' ? 0.3 : 1,
    }
  }));

  const displayNodes = [...highlightedNodes, ...unhighlightedNodes];

  // Layout functions
  const handleAutoLayout = () => {
    const layoutNodes = nodes.map((node, index) => {
      const row = Math.floor(index / 4);
      const col = index % 4;
      return {
        ...node,
        position: {
          x: col * 350 + 100,
          y: row * 300 + 50
        }
      };
    });
    setNodes(layoutNodes);
    saveToHistory();
    setTimeout(() => reactFlowInstance.fitView({ padding: 0.2, duration: 800 }), 100);
  };

  const handleHierarchicalLayout = () => {
    // Simple hierarchical layout based on connections
    const roots = nodes.filter(node => !edges.find(edge => edge.target === node.id));
    const layouted: Node<EmployeeNode>[] = [];
    const positioned = new Set<string>();
    
    const layoutLevel = (nodeIds: string[], level: number, startX: number) => {
      const nodeWidth = 300;
      const nodeSpacing = 50;
      const levelHeight = 250;
      
      nodeIds.forEach((nodeId, index) => {
        const node = nodes.find(n => n.id === nodeId);
        if (node && !positioned.has(nodeId)) {
          layouted.push({
            ...node,
            position: {
              x: startX + (index * (nodeWidth + nodeSpacing)),
              y: level * levelHeight
            }
          });
          positioned.add(nodeId);
          
          // Get children
          const children = edges
            .filter(edge => edge.source === nodeId)
            .map(edge => edge.target);
          
          if (children.length > 0) {
            layoutLevel(children, level + 1, startX + (index * (nodeWidth + nodeSpacing)) - ((children.length - 1) * (nodeWidth + nodeSpacing) / 2));
          }
        }
      });
    };
    
    layoutLevel(roots.map(r => r.id), 0, 100);
    setNodes(layouted);
    saveToHistory();
    setTimeout(() => reactFlowInstance.fitView({ padding: 0.2, duration: 800 }), 100);
  };

  const handleFitView = () => {
    reactFlowInstance.fitView({ padding: 0.2, duration: 800 });
  };

  const handleZoomIn = () => {
    reactFlowInstance.zoomIn({ duration: 300 });
  };

  const handleZoomOut = () => {
    reactFlowInstance.zoomOut({ duration: 300 });
  };

  // Export functions
  const handleExportJSON = () => {
    const data = {
      nodes: nodes.map(node => ({
        ...node,
        position: node.position,
        data: node.data,
      })),
      edges: edges,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `org-chart-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setShowExportModal(false);
  };

  const handleExportPNG = () => {
    if (reactFlowInstance) {
      const flow = reactFlowInstance.toObject();
      // In a real implementation, you would use html2canvas or similar
      alert('PNG export functionality would be implemented here using html2canvas or similar library.');
      setShowExportModal(false);
    }
  };

  const handleExportSVG = () => {
    alert('SVG export functionality would be implemented here.');
    setShowExportModal(false);
  };

  const handlePrint = () => {
    window.print();
  };

  // Import function
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          if (data.nodes && data.edges) {
            setNodes(data.nodes);
            setEdges(data.edges);
            saveToHistory();
            setTimeout(() => reactFlowInstance.fitView({ padding: 0.2, duration: 800 }), 100);
            setShowImportModal(false);
          }
        } catch (error) {
          alert('Invalid JSON file');
        }
      };
      reader.readAsText(file);
    }
  };

  // Add employee
  const handleAddEmployee = () => {
    if (!newEmployeeData.name || !newEmployeeData.position) {
      alert('Please fill in name and position');
      return;
    }

    const newNode: Node<EmployeeNode> = {
      id: `emp-${Date.now()}`,
      type: 'custom',
      position: { x: 500, y: 500 },
      data: {
        id: `emp-${Date.now()}`,
        name: newEmployeeData.name || '',
        position: newEmployeeData.position || '',
        department: newEmployeeData.department || 'HR',
        email: newEmployeeData.email,
        phone: newEmployeeData.phone,
        location: newEmployeeData.location,
        type: newEmployeeData.type as 'ceo' | 'manager' | 'employee',
        performance: 85,
      }
    };

    setNodes([...nodes, newNode]);
    saveToHistory();
    setShowAddEmployeeModal(false);
    setNewEmployeeData({
      name: '',
      position: '',
      department: 'HR',
      email: '',
      phone: '',
      location: 'Kuala Lumpur HQ',
      type: 'employee',
    });
  };

  // Delete employee
  const handleDeleteNode = (nodeId: string) => {
    if (confirm('Are you sure you want to remove this employee from the organization?')) {
      setNodes(nodes.filter(n => n.id !== nodeId));
      setEdges(edges.filter(e => e.source !== nodeId && e.target !== nodeId));
      saveToHistory();
      setShowEmployeeModal(false);
    }
  };

  // Edit employee
  const handleEditEmployee = () => {
    if (!selectedEmployee) return;
    
    const updatedNodes = nodes.map(node => {
      if (node.id === selectedEmployee.id) {
        return {
          ...node,
          data: selectedEmployee
        };
      }
      return node;
    });
    
    setNodes(updatedNodes);
    saveToHistory();
    setShowEmployeeModal(false);
  };

  // Duplicate node
  const handleDuplicateNode = (nodeId: string) => {
    const nodeToDuplicate = nodes.find(n => n.id === nodeId);
    if (nodeToDuplicate) {
      const newNode: Node<EmployeeNode> = {
        ...nodeToDuplicate,
        id: `${nodeId}-copy-${Date.now()}`,
        position: {
          x: nodeToDuplicate.position.x + 50,
          y: nodeToDuplicate.position.y + 50
        },
        data: {
          ...nodeToDuplicate.data,
          id: `${nodeId}-copy-${Date.now()}`,
          name: `${nodeToDuplicate.data.name} (Copy)`
        }
      };
      setNodes([...nodes, newNode]);
      saveToHistory();
    }
  };

  // Delete edge
  const handleDeleteEdge = (edgeId: string) => {
    setEdges(edges.filter(e => e.id !== edgeId));
    saveToHistory();
  };

  const departments = [
    { name: 'Executive', count: 2, color: 'pink' },
    { name: 'HR', count: 1, color: 'purple' },
    { name: 'Finance', count: 2, color: 'fuchsia' },
    { name: 'IT', count: 1, color: 'violet' },
    { name: 'Marketing', count: 1, color: 'rose' },
  ];

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-pink-50 via-purple-50 to-violet-50">
      {/* Header */}
      <div className="bg-white border-b-2 border-pink-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-gray-900 flex items-center gap-2">
              <Network className="w-7 h-7 text-pink-600" />
              Organization Chart
            </h1>
            <p className="text-gray-500">Full-featured org chart with {nodes.length} positions</p>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowImportModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Import
            </button>
            <button 
              onClick={() => setShowExportModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <button 
              onClick={() => setShowAddEmployeeModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Employee
            </button>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white border-b-2 border-pink-100 px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-400" />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-2 border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
              />
            </div>

            {/* Department Filter */}
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="px-4 py-2 border-2 border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
            >
              <option value="all">All Departments</option>
              {departments.map(dept => (
                <option key={dept.name} value={dept.name}>{dept.name}</option>
              ))}
            </select>

            {/* Background Selector */}
            <div className="relative">
              <button
                onClick={() => setShowBackgroundControls(!showBackgroundControls)}
                className="flex items-center gap-2 px-4 py-2 border-2 border-pink-200 rounded-lg hover:bg-pink-50 text-sm"
              >
                <Grid3x3 className="w-4 h-4 text-pink-600" />
                <ChevronDown className={`w-4 h-4 transition-transform ${showBackgroundControls ? 'rotate-180' : ''}`} />
              </button>
              
              {showBackgroundControls && (
                <div className="absolute top-full mt-2 left-0 bg-white border-2 border-pink-200 rounded-lg shadow-lg p-2 z-50 min-w-[140px]">
                  <button
                    onClick={() => {
                      setBackgroundVariant(BackgroundVariant.Dots);
                      setShowBackgroundControls(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded hover:bg-pink-50 text-sm ${
                      backgroundVariant === BackgroundVariant.Dots ? 'bg-pink-100 text-pink-700' : ''
                    }`}
                  >
                    Dots
                  </button>
                  <button
                    onClick={() => {
                      setBackgroundVariant(BackgroundVariant.Lines);
                      setShowBackgroundControls(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded hover:bg-pink-50 text-sm ${
                      backgroundVariant === BackgroundVariant.Lines ? 'bg-pink-100 text-pink-700' : ''
                    }`}
                  >
                    Lines
                  </button>
                  <button
                    onClick={() => {
                      setBackgroundVariant(BackgroundVariant.Cross);
                      setShowBackgroundControls(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded hover:bg-pink-50 text-sm ${
                      backgroundVariant === BackgroundVariant.Cross ? 'bg-pink-100 text-pink-700' : ''
                    }`}
                  >
                    Cross
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* View Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className="p-2 border-2 border-pink-200 rounded-lg hover:bg-pink-50 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Undo"
            >
              <RotateCcw className="w-4 h-4 text-pink-600" />
            </button>
            <button
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className="p-2 border-2 border-pink-200 rounded-lg hover:bg-pink-50 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Redo"
            >
              <RotateCcw className="w-4 h-4 text-pink-600 scale-x-[-1]" />
            </button>
            <div className="w-px h-6 bg-pink-200"></div>
            <button
              onClick={handleZoomOut}
              className="p-2 border-2 border-pink-200 rounded-lg hover:bg-pink-50"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4 text-pink-600" />
            </button>
            <button
              onClick={handleZoomIn}
              className="p-2 border-2 border-pink-200 rounded-lg hover:bg-pink-50"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4 text-pink-600" />
            </button>
            <button
              onClick={handleFitView}
              className="p-2 border-2 border-pink-200 rounded-lg hover:bg-pink-50"
              title="Fit View"
            >
              <Maximize2 className="w-4 h-4 text-pink-600" />
            </button>
            <div className="w-px h-6 bg-pink-200"></div>
            <button
              onClick={handleAutoLayout}
              className="px-4 py-2 border-2 border-pink-200 rounded-lg hover:bg-pink-50 flex items-center gap-2 text-sm"
            >
              <Grid3x3 className="w-4 h-4 text-pink-600" />
              Grid Layout
            </button>
            <button
              onClick={handleHierarchicalLayout}
              className="px-4 py-2 border-2 border-pink-200 rounded-lg hover:bg-pink-50 flex items-center gap-2 text-sm"
            >
              <GitBranch className="w-4 h-4 text-pink-600" />
              Hierarchy Layout
            </button>
            <button
              onClick={handlePrint}
              className="p-2 border-2 border-pink-200 rounded-lg hover:bg-pink-50"
              title="Print"
            >
              <Printer className="w-4 h-4 text-pink-600" />
            </button>
          </div>
        </div>
      </div>

      {/* ReactFlow Canvas */}
      <div className="flex-1 relative">
        <ReactFlow
          nodes={displayNodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onNodeDragStop={onNodeDragStop}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.1}
          maxZoom={2}
          defaultViewport={{ x: 0, y: 0, zoom: 0.6 }}
          deleteKeyCode="Delete"
          multiSelectionKeyCode="Shift"
          selectionOnDrag
          panOnDrag
          elementsSelectable
          nodesDraggable
          nodesConnectable
        >
          <Background 
            variant={backgroundVariant} 
            gap={16} 
            size={1}
            color="#F9A8D4"
          />
          <Controls 
            showInteractive={false}
            className="bg-white border-2 border-pink-200 rounded-lg shadow-lg"
          />
          <MiniMap 
            nodeColor={(node) => {
              const dept = node.data.department;
              const colors: { [key: string]: string } = {
                'Executive': '#EC4899',
                'HR': '#A855F7',
                'Finance': '#EC4899',
                'IT': '#A855F7',
                'Marketing': '#F472B6',
                'Operations': '#C084FC',
                'Sales': '#EC4899',
              };
              return colors[dept] || '#F472B6';
            }}
            maskColor="rgba(236, 72, 153, 0.1)"
            className="bg-white border-2 border-pink-200 rounded-lg shadow-lg"
          />
          <Panel position="top-right" className="bg-white/90 backdrop-blur-sm border-2 border-pink-200 rounded-lg p-3 m-4">
            <div className="text-xs space-y-2">
              <div className="font-medium text-gray-700 mb-2">Legend</div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                <span className="text-gray-600">Executive</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span className="text-gray-600">HR & IT</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-fuchsia-500"></div>
                <span className="text-gray-600">Finance</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                <span className="text-gray-600">Marketing</span>
              </div>
              <div className="border-t border-pink-200 pt-2 mt-2 space-y-1">
                <div className="text-gray-600">Drag: Move nodes</div>
                <div className="text-gray-600">Shift: Multi-select</div>
                <div className="text-gray-600">Delete: Remove</div>
              </div>
            </div>
          </Panel>
        </ReactFlow>
      </div>

      {/* Stats Footer */}
      <div className="bg-white border-t-2 border-pink-200 px-6 py-4">
        <div className="grid grid-cols-5 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-rose-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-pink-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Positions</p>
              <p className="text-2xl text-gray-900">{nodes.length}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-violet-100 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Departments</p>
              <p className="text-2xl text-gray-900">{departments.length}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-fuchsia-100 to-pink-100 rounded-xl flex items-center justify-center">
              <Network className="w-6 h-6 text-fuchsia-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Connections</p>
              <p className="text-2xl text-gray-900">{edges.length}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-violet-100 to-purple-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-violet-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Avg Performance</p>
              <p className="text-2xl text-gray-900">95%</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-rose-100 to-pink-100 rounded-xl flex items-center justify-center">
              <Filter className="w-6 h-6 text-rose-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Filtered</p>
              <p className="text-2xl text-gray-900">{filteredNodes.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Employee Modal */}
      {showAddEmployeeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-pink-200">
            <div className="sticky top-0 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center gap-2">
                <Plus className="w-6 h-6" />
                <h2 className="text-xl">Add New Employee</h2>
              </div>
              <button 
                onClick={() => setShowAddEmployeeModal(false)}
                className="text-white hover:bg-white/20 rounded-lg p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleAddEmployee(); }}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Full Name *</label>
                    <input 
                      type="text" 
                      value={newEmployeeData.name}
                      onChange={(e) => setNewEmployeeData({ ...newEmployeeData, name: e.target.value })}
                      className="w-full px-3 py-2 border-2 border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Position *</label>
                    <input 
                      type="text"
                      value={newEmployeeData.position}
                      onChange={(e) => setNewEmployeeData({ ...newEmployeeData, position: e.target.value })}
                      className="w-full px-3 py-2 border-2 border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      placeholder="Software Engineer"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Email</label>
                    <input 
                      type="email"
                      value={newEmployeeData.email}
                      onChange={(e) => setNewEmployeeData({ ...newEmployeeData, email: e.target.value })}
                      className="w-full px-3 py-2 border-2 border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      placeholder="john@company.my"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Phone</label>
                    <input 
                      type="tel"
                      value={newEmployeeData.phone}
                      onChange={(e) => setNewEmployeeData({ ...newEmployeeData, phone: e.target.value })}
                      className="w-full px-3 py-2 border-2 border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      placeholder="+60 12-345 6789"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Department</label>
                    <select
                      value={newEmployeeData.department}
                      onChange={(e) => setNewEmployeeData({ ...newEmployeeData, department: e.target.value })}
                      className="w-full px-3 py-2 border-2 border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      {departments.map(dept => (
                        <option key={dept.name} value={dept.name}>{dept.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Location</label>
                    <input 
                      type="text"
                      value={newEmployeeData.location}
                      onChange={(e) => setNewEmployeeData({ ...newEmployeeData, location: e.target.value })}
                      className="w-full px-3 py-2 border-2 border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      placeholder="Kuala Lumpur"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Role Type</label>
                  <select
                    value={newEmployeeData.type}
                    onChange={(e) => setNewEmployeeData({ ...newEmployeeData, type: e.target.value as 'ceo' | 'manager' | 'employee' })}
                    className="w-full px-3 py-2 border-2 border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="employee">Employee</option>
                    <option value="manager">Manager</option>
                    <option value="ceo">Executive</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <button 
                    type="submit"
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Add Employee
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowAddEmployeeModal(false)}
                    className="px-4 py-2 border-2 border-pink-200 rounded-lg hover:bg-pink-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Employee Details Modal */}
      {showEmployeeModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-pink-200">
            <div className="sticky top-0 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-xl">Employee Details</h2>
              <button 
                onClick={() => setShowEmployeeModal(false)}
                className="text-white hover:bg-white/20 rounded-lg p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center text-white text-2xl">
                  {selectedEmployee.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl text-gray-900">{selectedEmployee.name}</h3>
                  <p className="text-lg text-gray-600">{selectedEmployee.position}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm">
                      {selectedEmployee.department}
                    </span>
                    {selectedEmployee.performance && (
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        {selectedEmployee.performance}% Performance
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {selectedEmployee.email && (
                <div className="border-t-2 border-pink-100 pt-6">
                  <h4 className="text-lg text-gray-900 mb-4">Contact Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-pink-400" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="text-gray-900">{selectedEmployee.email}</p>
                      </div>
                    </div>
                    {selectedEmployee.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-purple-400" />
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="text-gray-900">{selectedEmployee.phone}</p>
                        </div>
                      </div>
                    )}
                    {selectedEmployee.location && (
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-violet-400" />
                        <div>
                          <p className="text-sm text-gray-500">Location</p>
                          <p className="text-gray-900">{selectedEmployee.location}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 pt-6 border-t-2 border-pink-100">
                <button 
                  onClick={handleEditEmployee}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit Details
                </button>
                <button 
                  onClick={() => handleDuplicateNode(selectedEmployee.id)}
                  className="flex-1 px-4 py-2 border-2 border-pink-200 text-gray-700 rounded-lg hover:bg-pink-50 flex items-center justify-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Duplicate
                </button>
                <button 
                  onClick={() => handleDeleteNode(selectedEmployee.id)}
                  className="px-4 py-2 border-2 border-red-300 text-red-600 rounded-lg hover:bg-red-50 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border-2 border-pink-200">
            <div className="bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center gap-2">
                <Download className="w-6 h-6" />
                <h2 className="text-xl">Export Organization Chart</h2>
              </div>
              <button 
                onClick={() => setShowExportModal(false)}
                className="text-white hover:bg-white/20 rounded-lg p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-3">
              <button
                onClick={handleExportJSON}
                className="w-full px-4 py-3 border-2 border-pink-200 rounded-lg hover:bg-pink-50 flex items-center justify-between text-left group"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-pink-600" />
                  <div>
                    <p className="text-gray-900 group-hover:text-pink-600">Export as JSON</p>
                    <p className="text-sm text-gray-500">Data format for backup/import</p>
                  </div>
                </div>
                <Download className="w-5 h-5 text-pink-400" />
              </button>
              <button
                onClick={handleExportPNG}
                className="w-full px-4 py-3 border-2 border-pink-200 rounded-lg hover:bg-pink-50 flex items-center justify-between text-left group"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-gray-900 group-hover:text-purple-600">Export as PNG</p>
                    <p className="text-sm text-gray-500">High-resolution image</p>
                  </div>
                </div>
                <Download className="w-5 h-5 text-purple-400" />
              </button>
              <button
                onClick={handleExportSVG}
                className="w-full px-4 py-3 border-2 border-pink-200 rounded-lg hover:bg-pink-50 flex items-center justify-between text-left group"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-fuchsia-600" />
                  <div>
                    <p className="text-gray-900 group-hover:text-fuchsia-600">Export as SVG</p>
                    <p className="text-sm text-gray-500">Scalable vector graphics</p>
                  </div>
                </div>
                <Download className="w-5 h-5 text-fuchsia-400" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border-2 border-pink-200">
            <div className="bg-gradient-to-r from-violet-500 to-purple-500 text-white px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center gap-2">
                <Upload className="w-6 h-6" />
                <h2 className="text-xl">Import Organization Chart</h2>
              </div>
              <button 
                onClick={() => setShowImportModal(false)}
                className="text-white hover:bg-white/20 rounded-lg p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImport}
                accept=".json"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full px-4 py-6 border-2 border-dashed border-pink-300 rounded-lg hover:bg-pink-50 flex flex-col items-center gap-3 text-center group"
              >
                <Upload className="w-8 h-8 text-pink-500 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="text-gray-900 group-hover:text-pink-600">Click to upload JSON file</p>
                  <p className="text-sm text-gray-500 mt-1">Import previously exported org chart data</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden file input for import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImport}
        accept=".json"
        className="hidden"
      />
    </div>
  );
}

export function OrganizationChart() {
  return (
    <ReactFlowProvider>
      <OrganizationChartInner />
    </ReactFlowProvider>
  );
}
