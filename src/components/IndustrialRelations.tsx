import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Scale,
  AlertTriangle,
  TrendingUp,
  FileText,
  Calendar,
  Users,
  Shield,
  Brain,
  Zap,
  Clock,
  Target,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Edit,
  Plus,
  Search,
  Filter,
  Download,
  MessageSquare,
  BarChart3,
  Activity,
  Building2,
  Gavel,
  BookOpen,
} from 'lucide-react';
import {
  GlassmorphicCard,
  StaggerContainer,
  StaggerItem,
  SlideIn,
  GlassButton,
  AnimatedCounter,
  GlassInput,
} from './GlassmorphicCard';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

type ViewMode = 'dashboard' | 'cases' | 'analytics' | 'compliance' | 'union';

interface IRCase {
  id: string;
  type: 'Dismissal' | 'Wage Dispute' | 'Collective Agreement' | 'Working Conditions' | 'Discrimination';
  employee: string;
  department: string;
  filedDate: string;
  status: 'Under Review' | 'Mediation' | 'Hearing Scheduled' | 'Resolved' | 'Closed';
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  riskScore: number;
  aiPrediction: string;
  description: string;
  union?: string;
}

export function IndustrialRelations() {
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const cases: IRCase[] = [
    {
      id: 'IRC-2024-001',
      type: 'Dismissal',
      employee: 'Ahmad bin Abdullah',
      department: 'Operations',
      filedDate: '2024-11-15',
      status: 'Under Review',
      priority: 'High',
      riskScore: 78,
      aiPrediction: 'Likely to settle in mediation',
      description: 'Unfair dismissal claim - procedural issues',
      union: 'National Union of Transport Workers',
    },
    {
      id: 'IRC-2024-002',
      type: 'Wage Dispute',
      employee: 'Siti Nurhaliza binti Ahmad',
      department: 'Sales',
      filedDate: '2024-11-20',
      status: 'Mediation',
      priority: 'Medium',
      riskScore: 45,
      aiPrediction: 'Favorable outcome expected',
      description: 'Overtime payment discrepancy',
    },
    {
      id: 'IRC-2024-003',
      type: 'Collective Agreement',
      employee: 'Union Representative - Raj Kumar',
      department: 'Manufacturing',
      filedDate: '2024-11-10',
      status: 'Hearing Scheduled',
      priority: 'Critical',
      riskScore: 92,
      aiPrediction: 'High escalation risk - immediate attention required',
      description: 'Collective bargaining - wage increase negotiation',
      union: 'Electrical Industry Workers Union',
    },
    {
      id: 'IRC-2024-004',
      type: 'Working Conditions',
      employee: 'Lee Mei Ling',
      department: 'Warehouse',
      filedDate: '2024-12-01',
      status: 'Under Review',
      priority: 'High',
      riskScore: 65,
      aiPrediction: 'Compliance review needed',
      description: 'Safety concerns - inadequate PPE equipment',
    },
    {
      id: 'IRC-2024-005',
      type: 'Discrimination',
      employee: 'David Tan Wei Jian',
      department: 'HR',
      filedDate: '2024-12-05',
      status: 'Mediation',
      priority: 'Critical',
      riskScore: 88,
      aiPrediction: 'Legal intervention likely',
      description: 'Alleged workplace discrimination based on religion',
    },
    {
      id: 'IRC-2024-006',
      type: 'Dismissal',
      employee: 'Nurul Ain binti Hassan',
      department: 'Customer Service',
      filedDate: '2024-10-20',
      status: 'Resolved',
      priority: 'Low',
      riskScore: 25,
      aiPrediction: 'Successfully mediated',
      description: 'Performance-based termination - amicable settlement',
    },
  ];

  const activeCases = cases.filter(c => c.status !== 'Resolved' && c.status !== 'Closed').length;
  const criticalCases = cases.filter(c => c.priority === 'Critical').length;
  const avgResolutionTime = 45;
  const resolutionRate = 87;

  const stats = [
    {
      label: 'Active Cases',
      value: activeCases,
      change: '+2 this month',
      icon: Scale,
      gradient: 'from-blue-500/80 to-cyan-500/80',
    },
    {
      label: 'Critical Cases',
      value: criticalCases,
      change: '1 requires attention',
      icon: AlertTriangle,
      gradient: 'from-red-500/80 to-orange-500/80',
    },
    {
      label: 'Resolution Rate',
      value: resolutionRate,
      suffix: '%',
      change: '+5% vs last quarter',
      icon: TrendingUp,
      gradient: 'from-green-500/80 to-emerald-500/80',
    },
    {
      label: 'Avg. Resolution Time',
      value: avgResolutionTime,
      suffix: 'd',
      change: '-10 days improvement',
      icon: Clock,
      gradient: 'from-purple-500/80 to-violet-500/80',
    },
  ];

  const caseTypeData = [
    { name: 'Dismissal', value: cases.filter(c => c.type === 'Dismissal').length },
    { name: 'Wage Dispute', value: cases.filter(c => c.type === 'Wage Dispute').length },
    { name: 'Collective Agreement', value: cases.filter(c => c.type === 'Collective Agreement').length },
    { name: 'Working Conditions', value: cases.filter(c => c.type === 'Working Conditions').length },
    { name: 'Discrimination', value: cases.filter(c => c.type === 'Discrimination').length },
  ];

  const monthlyTrendData = [
    { month: 'Jul', cases: 8, resolved: 6 },
    { month: 'Aug', cases: 10, resolved: 7 },
    { month: 'Sep', cases: 7, resolved: 8 },
    { month: 'Oct', cases: 12, resolved: 9 },
    { month: 'Nov', cases: 9, resolved: 10 },
    { month: 'Dec', cases: activeCases, resolved: 1 },
  ];

  const riskAnalysisData = [
    { category: 'Strike Risk', score: 34 },
    { category: 'Legal Risk', score: 58 },
    { category: 'Compliance Risk', score: 22 },
    { category: 'Reputational Risk', score: 45 },
    { category: 'Financial Risk', score: 51 },
  ];

  const resolutionMethodData = [
    { method: 'Mediation', count: 15 },
    { method: 'Arbitration', count: 8 },
    { method: 'Court Settlement', count: 3 },
    { method: 'Internal Resolution', count: 12 },
  ];

  const COLORS = ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#3B82F6', '#EF4444'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Under Review':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Mediation':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Hearing Scheduled':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'Resolved':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Closed':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'bg-red-500 text-white';
      case 'High':
        return 'bg-orange-500 text-white';
      case 'Medium':
        return 'bg-yellow-500 text-white';
      case 'Low':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-red-600';
    if (score >= 60) return 'text-orange-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  const filteredCases = cases.filter(caseItem => {
    const matchesSearch = caseItem.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         caseItem.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         caseItem.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || caseItem.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats */}
      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <StaggerItem key={index}>
              <GlassmorphicCard
                gradient={`${stat.gradient.replace('/80', '/10')} backdrop-blur-xl`}
                animation="scale"
                delay={index * 0.1}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                      <motion.p
                        className="text-3xl font-bold text-gray-900"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1 + 0.3, type: 'spring' }}
                      >
                        <AnimatedCounter value={stat.value} duration={2} />
                        {stat.suffix}
                      </motion.p>
                    </div>
                    <motion.div
                      className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </motion.div>
                  </div>
                  <p className="text-sm text-gray-600">{stat.change}</p>
                </div>
              </GlassmorphicCard>
            </StaggerItem>
          );
        })}
      </StaggerContainer>

      {/* AI Insights */}
      <SlideIn direction="up" delay={0.2}>
        <GlassmorphicCard gradient="from-purple-500/10 to-violet-500/10" blur="xl">
          <div className="p-6">
            <div className="flex items-start gap-3 mb-4">
              <Brain className="w-6 h-6 text-purple-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-purple-900 mb-1">AI Prediction Engine Active</h4>
                <p className="text-sm text-purple-700 mb-3">
                  Analyzing {activeCases} active cases with 92% prediction accuracy. Current strike risk is LOW based on sentiment analysis and historical patterns.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full border border-purple-200">
                    Industrial Relations Act 1967 ✓
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full border border-purple-200">
                    Trade Union Act 1959 ✓
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full border border-purple-200">
                    Employment Act 1955 ✓
                  </span>
                </div>
              </div>
            </div>
          </div>
        </GlassmorphicCard>
      </SlideIn>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SlideIn direction="left" delay={0.3}>
          <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Case Distribution</h3>
              <div style={{ width: '100%', height: '250px', minHeight: '250px' }}>
                <ResponsiveContainer width="100%" height="100%" minHeight={250}>
                  <PieChart>
                    <Pie
                      data={caseTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {caseTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </GlassmorphicCard>
        </SlideIn>

        <SlideIn direction="right" delay={0.3}>
          <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Monthly Trends</h3>
              <div style={{ width: '100%', height: '250px', minHeight: '250px' }}>
                <ResponsiveContainer width="100%" height="100%" minHeight={250}>
                  <LineChart data={monthlyTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="month" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="cases" stroke="#EF4444" strokeWidth={3} dot={{ fill: '#EF4444', r: 4 }} name="New Cases" />
                    <Line type="monotone" dataKey="resolved" stroke="#10B981" strokeWidth={3} dot={{ fill: '#10B981', r: 4 }} name="Resolved" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </GlassmorphicCard>
        </SlideIn>

        <SlideIn direction="left" delay={0.4}>
          <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Risk Analysis</h3>
              <div style={{ width: '100%', height: '250px', minHeight: '250px' }}>
                <ResponsiveContainer width="100%" height="100%" minHeight={250}>
                  <RadarChart data={riskAnalysisData}>
                    <PolarGrid stroke="#E5E7EB" />
                    <PolarAngleAxis dataKey="category" stroke="#6B7280" />
                    <PolarRadiusAxis stroke="#6B7280" />
                    <Radar name="Risk Score" dataKey="score" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </GlassmorphicCard>
        </SlideIn>

        <SlideIn direction="right" delay={0.4}>
          <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Resolution Methods</h3>
              <div style={{ width: '100%', height: '250px', minHeight: '250px' }}>
                <ResponsiveContainer width="100%" height="100%" minHeight={250}>
                  <BarChart data={resolutionMethodData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="method" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </GlassmorphicCard>
        </SlideIn>
      </div>

      {/* Recent Critical Cases */}
      <SlideIn direction="up" delay={0.5}>
        <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Critical Cases Requiring Attention</h3>
            <div className="space-y-3">
              {cases.filter(c => c.priority === 'Critical' && c.status !== 'Resolved').map((caseItem, index) => (
                <motion.div
                  key={caseItem.id}
                  className="bg-red-50 border border-red-200 rounded-xl p-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-gray-900">{caseItem.id}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(caseItem.status)}`}>
                          {caseItem.status}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(caseItem.priority)}`}>
                          {caseItem.priority}
                        </span>
                      </div>
                      <p className="text-sm text-gray-900 mb-1">{caseItem.employee} - {caseItem.department}</p>
                      <p className="text-sm text-gray-600 mb-2">{caseItem.description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-600">Risk: <span className={`font-semibold ${getRiskColor(caseItem.riskScore)}`}>{caseItem.riskScore}%</span></span>
                        <span className="text-gray-600">AI: {caseItem.aiPrediction}</span>
                      </div>
                    </div>
                    <GlassButton variant="danger" onClick={() => {}}>
                      <AlertTriangle className="w-4 h-4" />
                    </GlassButton>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </GlassmorphicCard>
      </SlideIn>
    </div>
  );

  const renderCases = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">Industrial Relations Cases</h3>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <GlassInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search cases..."
            icon={<Search className="w-5 h-5" />}
          />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          >
            <option value="all">All Status</option>
            <option value="Under Review">Under Review</option>
            <option value="Mediation">Mediation</option>
            <option value="Hearing Scheduled">Hearing Scheduled</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
          <GlassButton variant="primary" onClick={() => {}}>
            <Plus className="w-4 h-4 mr-2" />
            File Case
          </GlassButton>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredCases.map((caseItem, index) => (
          <motion.div
            key={caseItem.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-bold text-gray-900">{caseItem.id}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(caseItem.status)}`}>
                        {caseItem.status}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(caseItem.priority)}`}>
                        {caseItem.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{caseItem.type}</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm mb-3">
                      <div>
                        <p className="text-gray-500">Employee</p>
                        <p className="font-semibold text-gray-900">{caseItem.employee}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Department</p>
                        <p className="font-semibold text-gray-900">{caseItem.department}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Filed Date</p>
                        <p className="font-semibold text-gray-900">{caseItem.filedDate}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Risk Score</p>
                        <p className={`font-semibold ${getRiskColor(caseItem.riskScore)}`}>
                          {caseItem.riskScore}%
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{caseItem.description}</p>
                    {caseItem.union && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <Users className="w-4 h-4" />
                        <span>Union: {caseItem.union}</span>
                      </div>
                    )}
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <Brain className="w-4 h-4 text-purple-600 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-purple-900 mb-1">AI Prediction</p>
                          <p className="text-sm text-purple-700">{caseItem.aiPrediction}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    <button className="p-2 hover:bg-white/50 rounded-lg transition-colors">
                      <Eye className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-white/50 rounded-lg transition-colors">
                      <Edit className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-white/50 rounded-lg transition-colors">
                      <MessageSquare className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-white/50 rounded-lg transition-colors">
                      <Download className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            </GlassmorphicCard>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderCompliance = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900">Malaysian IR Compliance</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SlideIn direction="left">
          <GlassmorphicCard gradient="from-blue-500/10 to-cyan-500/10" blur="xl">
            <div className="p-6">
              <div className="flex items-start gap-3 mb-4">
                <BookOpen className="w-6 h-6 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">Industrial Relations Act 1967</h4>
                  <p className="text-sm text-blue-700 mb-3">
                    Framework for maintaining harmonious industrial relations and resolving trade disputes
                  </p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between bg-white/50 rounded-lg p-3">
                  <span className="text-gray-700">Collective Bargaining Compliance</span>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex items-center justify-between bg-white/50 rounded-lg p-3">
                  <span className="text-gray-700">Trade Dispute Resolution</span>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex items-center justify-between bg-white/50 rounded-lg p-3">
                  <span className="text-gray-700">Strike & Lockout Procedures</span>
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                </div>
              </div>
            </div>
          </GlassmorphicCard>
        </SlideIn>

        <SlideIn direction="right">
          <GlassmorphicCard gradient="from-purple-500/10 to-violet-500/10" blur="xl">
            <div className="p-6">
              <div className="flex items-start gap-3 mb-4">
                <Users className="w-6 h-6 text-purple-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-purple-900 mb-1">Trade Union Act 1959</h4>
                  <p className="text-sm text-purple-700 mb-3">
                    Registration and regulation of trade unions and their operations
                  </p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between bg-white/50 rounded-lg p-3">
                  <span className="text-gray-700">Union Registration</span>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex items-center justify-between bg-white/50 rounded-lg p-3">
                  <span className="text-gray-700">Union Rights & Obligations</span>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex items-center justify-between bg-white/50 rounded-lg p-3">
                  <span className="text-gray-700">Annual Returns Filing</span>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </div>
          </GlassmorphicCard>
        </SlideIn>

        <SlideIn direction="left" delay={0.1}>
          <GlassmorphicCard gradient="from-green-500/10 to-emerald-500/10" blur="xl">
            <div className="p-6">
              <div className="flex items-start gap-3 mb-4">
                <Gavel className="w-6 h-6 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-green-900 mb-1">Industrial Court</h4>
                  <p className="text-sm text-green-700 mb-3">
                    Jurisdiction and procedures for industrial dispute resolution
                  </p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="bg-white/50 rounded-lg p-3">
                  <p className="text-gray-700 font-semibold mb-1">Active Cases in Court</p>
                  <p className="text-2xl font-bold text-green-600">2</p>
                </div>
                <div className="bg-white/50 rounded-lg p-3">
                  <p className="text-gray-700 font-semibold mb-1">Pending Hearings</p>
                  <p className="text-2xl font-bold text-orange-600">1</p>
                </div>
              </div>
            </div>
          </GlassmorphicCard>
        </SlideIn>

        <SlideIn direction="right" delay={0.1}>
          <GlassmorphicCard gradient="from-orange-500/10 to-amber-500/10" blur="xl">
            <div className="p-6">
              <div className="flex items-start gap-3 mb-4">
                <Shield className="w-6 h-6 text-orange-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-orange-900 mb-1">Risk Mitigation</h4>
                  <p className="text-sm text-orange-700 mb-3">
                    Proactive measures to prevent industrial disputes
                  </p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between bg-white/50 rounded-lg p-3">
                  <span className="text-gray-700">Regular Union Meetings</span>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex items-center justify-between bg-white/50 rounded-lg p-3">
                  <span className="text-gray-700">Grievance Procedures</span>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex items-center justify-between bg-white/50 rounded-lg p-3">
                  <span className="text-gray-700">Employee Engagement</span>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </div>
          </GlassmorphicCard>
        </SlideIn>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-purple-50 p-4 sm:p-6 lg:p-8">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 right-10 w-96 h-96 bg-red-300/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="relative z-10 space-y-6">
        {/* Header */}
        <SlideIn direction="down">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <motion.h1 
                className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                Industrial Relations
              </motion.h1>
              <p className="text-gray-600 mt-2">AI-powered dispute resolution & compliance tracking</p>
            </div>
          </div>
        </SlideIn>

        {/* Navigation Tabs */}
        <SlideIn direction="down" delay={0.1}>
          <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
            <div className="p-2">
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
                  { id: 'cases', name: 'Cases', icon: Scale },
                  { id: 'analytics', name: 'Analytics', icon: Activity },
                  { id: 'compliance', name: 'Compliance', icon: Shield },
                  { id: 'union', name: 'Union Relations', icon: Users },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setViewMode(tab.id as ViewMode)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                        viewMode === tab.id
                          ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg'
                          : 'bg-white/30 text-gray-700 hover:bg-white/50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{tab.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </GlassmorphicCard>
        </SlideIn>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {viewMode === 'dashboard' && renderDashboard()}
            {viewMode === 'cases' && renderCases()}
            {viewMode === 'analytics' && renderDashboard()}
            {viewMode === 'compliance' && renderCompliance()}
            {viewMode === 'union' && renderCompliance()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
