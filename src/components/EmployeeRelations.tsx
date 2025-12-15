import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Handshake,
  Heart,
  MessageSquare,
  TrendingUp,
  Users,
  Calendar,
  Target,
  Award,
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
  Edit,
  Plus,
  Search,
  Filter,
  Download,
  BarChart3,
  Activity,
  Brain,
  Zap,
  Star,
  ThumbsUp,
  Smile,
  Frown,
  Meh,
  UserCheck,
  Building2,
  Gift,
  PartyPopper,
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

type ViewMode = 'dashboard' | 'grievances' | 'engagement' | 'wellness' | 'recognition';

interface Grievance {
  id: string;
  employee: string;
  department: string;
  category: 'Harassment' | 'Discrimination' | 'Pay Issue' | 'Working Conditions' | 'Management Conflict' | 'Other';
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'Under Investigation' | 'Resolved' | 'Closed';
  filedDate: string;
  description: string;
  sentiment: 'Negative' | 'Neutral' | 'Positive';
  confidential: boolean;
}

interface EngagementSurvey {
  id: string;
  title: string;
  date: string;
  participants: number;
  score: number;
  category: string;
}

export function EmployeeRelations() {
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const grievances: Grievance[] = [
    {
      id: 'ER-2024-001',
      employee: 'Ahmad Syafiq bin Hassan',
      department: 'Engineering',
      category: 'Working Conditions',
      priority: 'High',
      status: 'Under Investigation',
      filedDate: '2024-12-01',
      description: 'Concerns about excessive overtime hours',
      sentiment: 'Negative',
      confidential: false,
    },
    {
      id: 'ER-2024-002',
      employee: 'Confidential Employee',
      department: 'Sales',
      category: 'Harassment',
      priority: 'Critical',
      status: 'Under Investigation',
      filedDate: '2024-12-03',
      description: 'Workplace harassment complaint',
      sentiment: 'Negative',
      confidential: true,
    },
    {
      id: 'ER-2024-003',
      employee: 'Lee Mei Ling',
      department: 'Marketing',
      category: 'Pay Issue',
      priority: 'Medium',
      status: 'Resolved',
      filedDate: '2024-11-20',
      description: 'Commission calculation discrepancy',
      sentiment: 'Neutral',
      confidential: false,
    },
    {
      id: 'ER-2024-004',
      employee: 'Raj Kumar Patel',
      department: 'Operations',
      category: 'Management Conflict',
      priority: 'Medium',
      status: 'Open',
      filedDate: '2024-12-08',
      description: 'Communication issues with direct supervisor',
      sentiment: 'Negative',
      confidential: false,
    },
    {
      id: 'ER-2024-005',
      employee: 'Nurul Ain binti Ibrahim',
      department: 'HR',
      category: 'Discrimination',
      priority: 'High',
      status: 'Under Investigation',
      filedDate: '2024-12-05',
      description: 'Alleged unfair treatment in promotion process',
      sentiment: 'Negative',
      confidential: true,
    },
  ];

  const openGrievances = grievances.filter(g => g.status !== 'Resolved' && g.status !== 'Closed').length;
  const criticalGrievances = grievances.filter(g => g.priority === 'Critical').length;
  const engagementScore = 78;
  const avgResolutionTime = 12;

  const stats = [
    {
      label: 'Open Grievances',
      value: openGrievances,
      change: '-1 vs last week',
      icon: MessageSquare,
      gradient: 'from-blue-500/80 to-cyan-500/80',
    },
    {
      label: 'Critical Cases',
      value: criticalGrievances,
      change: 'Requires attention',
      icon: AlertCircle,
      gradient: 'from-red-500/80 to-orange-500/80',
    },
    {
      label: 'Engagement Score',
      value: engagementScore,
      suffix: '%',
      change: '+3% this quarter',
      icon: Heart,
      gradient: 'from-pink-500/80 to-rose-500/80',
    },
    {
      label: 'Avg Resolution Time',
      value: avgResolutionTime,
      suffix: 'd',
      change: '-2 days improvement',
      icon: Clock,
      gradient: 'from-purple-500/80 to-violet-500/80',
    },
  ];

  const grievanceCategoryData = [
    { name: 'Harassment', value: grievances.filter(g => g.category === 'Harassment').length },
    { name: 'Discrimination', value: grievances.filter(g => g.category === 'Discrimination').length },
    { name: 'Pay Issue', value: grievances.filter(g => g.category === 'Pay Issue').length },
    { name: 'Working Conditions', value: grievances.filter(g => g.category === 'Working Conditions').length },
    { name: 'Management Conflict', value: grievances.filter(g => g.category === 'Management Conflict').length },
    { name: 'Other', value: grievances.filter(g => g.category === 'Other').length },
  ];

  const monthlyGrievanceData = [
    { month: 'Jul', grievances: 3, resolved: 4 },
    { month: 'Aug', grievances: 5, resolved: 3 },
    { month: 'Sep', grievances: 2, resolved: 5 },
    { month: 'Oct', grievances: 4, resolved: 3 },
    { month: 'Nov', grievances: 3, resolved: 4 },
    { month: 'Dec', grievances: openGrievances, resolved: 1 },
  ];

  const engagementTrendData = [
    { month: 'Jul', score: 72 },
    { month: 'Aug', score: 74 },
    { month: 'Sep', score: 73 },
    { month: 'Oct', score: 75 },
    { month: 'Nov', score: 76 },
    { month: 'Dec', score: engagementScore },
  ];

  const departmentEngagementData = [
    { department: 'Engineering', score: 82 },
    { department: 'Sales', score: 75 },
    { department: 'Marketing', score: 80 },
    { department: 'Operations', score: 74 },
    { department: 'HR', score: 85 },
  ];

  const wellnessMetricsData = [
    { category: 'Work-Life Balance', score: 75 },
    { category: 'Mental Health', score: 70 },
    { category: 'Physical Health', score: 68 },
    { category: 'Job Satisfaction', score: 80 },
    { category: 'Career Growth', score: 72 },
  ];

  const COLORS = ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#3B82F6', '#EF4444'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Under Investigation':
        return 'bg-orange-100 text-orange-700 border-orange-200';
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

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'Positive':
        return <Smile className="w-5 h-5 text-green-600" />;
      case 'Neutral':
        return <Meh className="w-5 h-5 text-yellow-600" />;
      case 'Negative':
        return <Frown className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const filteredGrievances = grievances.filter(grievance => {
    const matchesSearch = grievance.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         grievance.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         grievance.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || grievance.status === selectedStatus;
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
        <GlassmorphicCard gradient="from-pink-500/10 to-rose-500/10" blur="xl">
          <div className="p-6">
            <div className="flex items-start gap-3 mb-4">
              <Brain className="w-6 h-6 text-pink-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-pink-900 mb-1">AI-Powered Employee Sentiment Analysis</h4>
                <p className="text-sm text-pink-700 mb-3">
                  Real-time sentiment tracking across {openGrievances} active cases with 95% accuracy. Early warning system detecting potential issues before escalation.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-pink-100 text-pink-700 text-sm rounded-full border border-pink-200">
                    Sentiment Analysis ✓
                  </span>
                  <span className="px-3 py-1 bg-pink-100 text-pink-700 text-sm rounded-full border border-pink-200">
                    Predictive Resolution ✓
                  </span>
                  <span className="px-3 py-1 bg-pink-100 text-pink-700 text-sm rounded-full border border-pink-200">
                    Confidentiality Protected ✓
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
              <h3 className="text-lg font-bold text-gray-900 mb-4">Grievance Categories</h3>
              <div style={{ width: '100%', height: '250px', minHeight: '250px' }}>
                <ResponsiveContainer width="100%" height="100%" minHeight={250}>
                  <PieChart>
                    <Pie
                      data={grievanceCategoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, value }) => value > 0 ? `${name}: ${value}` : ''}
                    >
                      {grievanceCategoryData.map((entry, index) => (
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
              <h3 className="text-lg font-bold text-gray-900 mb-4">Monthly Grievance Trends</h3>
              <div style={{ width: '100%', height: '250px', minHeight: '250px' }}>
                <ResponsiveContainer width="100%" height="100%" minHeight={250}>
                  <LineChart data={monthlyGrievanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="month" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="grievances" stroke="#EF4444" strokeWidth={3} dot={{ fill: '#EF4444', r: 4 }} name="New" />
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
              <h3 className="text-lg font-bold text-gray-900 mb-4">Engagement Score Trend</h3>
              <div style={{ width: '100%', height: '250px', minHeight: '250px' }}>
                <ResponsiveContainer width="100%" height="100%" minHeight={250}>
                  <AreaChart data={engagementTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="month" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" domain={[60, 85]} />
                    <Tooltip />
                    <Area type="monotone" dataKey="score" stroke="#EC4899" fill="#EC4899" fillOpacity={0.3} strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </GlassmorphicCard>
        </SlideIn>

        <SlideIn direction="right" delay={0.4}>
          <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Department Engagement</h3>
              <div style={{ width: '100%', height: '250px', minHeight: '250px' }}>
                <ResponsiveContainer width="100%" height="100%" minHeight={250}>
                  <BarChart data={departmentEngagementData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis type="number" stroke="#6B7280" domain={[0, 100]} />
                    <YAxis type="category" dataKey="department" stroke="#6B7280" width={100} />
                    <Tooltip />
                    <Bar dataKey="score" fill="#EC4899" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </GlassmorphicCard>
        </SlideIn>
      </div>

      {/* Quick Actions */}
      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Plus, title: 'File Grievance', desc: 'Submit new case', color: 'from-blue-500 to-cyan-500' },
          { icon: Users, title: 'Wellness Program', desc: 'Employee support', color: 'from-pink-500 to-rose-500' },
          { icon: Award, title: 'Recognition', desc: 'Employee awards', color: 'from-purple-500 to-violet-500' },
        ].map((action, index) => {
          const Icon = action.icon;
          return (
            <StaggerItem key={index}>
              <GlassmorphicCard
                gradient="from-white/80 to-white/60"
                blur="xl"
                animation="scale"
                delay={index * 0.1}
              >
                <button className="w-full p-6 text-center hover:bg-white/30 rounded-xl transition-all">
                  <motion.div
                    className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </motion.div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">{action.title}</h4>
                  <p className="text-xs text-gray-600">{action.desc}</p>
                </button>
              </GlassmorphicCard>
            </StaggerItem>
          );
        })}
      </StaggerContainer>
    </div>
  );

  const renderGrievances = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">Employee Grievances</h3>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <GlassInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search grievances..."
            icon={<Search className="w-5 h-5" />}
          />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
          >
            <option value="all">All Status</option>
            <option value="Open">Open</option>
            <option value="Under Investigation">Under Investigation</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
          <GlassButton variant="primary" onClick={() => {}}>
            <Plus className="w-4 h-4 mr-2" />
            File Grievance
          </GlassButton>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredGrievances.map((grievance, index) => (
          <motion.div
            key={grievance.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-bold text-gray-900">{grievance.id}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(grievance.status)}`}>
                        {grievance.status}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(grievance.priority)}`}>
                        {grievance.priority}
                      </span>
                      {grievance.confidential && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full border border-gray-200">
                          🔒 Confidential
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{grievance.category}</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm mb-3">
                      <div>
                        <p className="text-gray-500">Employee</p>
                        <p className="font-semibold text-gray-900">{grievance.employee}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Department</p>
                        <p className="font-semibold text-gray-900">{grievance.department}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Filed Date</p>
                        <p className="font-semibold text-gray-900">{grievance.filedDate}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Sentiment</p>
                        <div className="flex items-center gap-1">
                          {getSentimentIcon(grievance.sentiment)}
                          <span className="font-semibold text-gray-900">{grievance.sentiment}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{grievance.description}</p>
                    <div className="bg-pink-50 border border-pink-200 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <Brain className="w-4 h-4 text-pink-600 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-pink-900 mb-1">AI Analysis</p>
                          <p className="text-sm text-pink-700">
                            {grievance.priority === 'Critical' 
                              ? 'Immediate action required - high escalation risk'
                              : grievance.sentiment === 'Negative'
                              ? 'Requires attention - potential dissatisfaction'
                              : 'Standard procedure - manageable resolution expected'}
                          </p>
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
                  </div>
                </div>
              </div>
            </GlassmorphicCard>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderWellness = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900">Employee Wellness & Engagement</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SlideIn direction="left">
          <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
            <div className="p-6">
              <h4 className="text-lg font-bold text-gray-900 mb-4">Wellness Metrics</h4>
              <div style={{ width: '100%', height: '300px', minHeight: '300px' }}>
                <ResponsiveContainer width="100%" height="100%" minHeight={300}>
                  <RadarChart data={wellnessMetricsData}>
                    <PolarGrid stroke="#E5E7EB" />
                    <PolarAngleAxis dataKey="category" stroke="#6B7280" />
                    <PolarRadiusAxis stroke="#6B7280" domain={[0, 100]} />
                    <Radar name="Score" dataKey="score" stroke="#EC4899" fill="#EC4899" fillOpacity={0.6} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </GlassmorphicCard>
        </SlideIn>

        <SlideIn direction="right">
          <GlassmorphicCard gradient="from-pink-500/10 to-rose-500/10" blur="xl">
            <div className="p-6">
              <h4 className="font-semibold text-pink-900 mb-4">Wellness Programs</h4>
              <div className="space-y-3">
                {[
                  { name: 'Mental Health Support', participants: 45, icon: Heart },
                  { name: 'Fitness Program', participants: 62, icon: Activity },
                  { name: 'Work-Life Balance Workshop', participants: 38, icon: Target },
                  { name: 'Career Development', participants: 51, icon: TrendingUp },
                ].map((program, idx) => {
                  const Icon = program.icon;
                  return (
                    <div key={idx} className="bg-white/50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg flex items-center justify-center">
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{program.name}</p>
                            <p className="text-sm text-gray-600">{program.participants} participants</p>
                          </div>
                        </div>
                        <button className="px-3 py-1 bg-pink-100 text-pink-700 text-sm rounded-lg hover:bg-pink-200 transition-colors">
                          View
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </GlassmorphicCard>
        </SlideIn>
      </div>

      {/* Recognition */}
      <SlideIn direction="up" delay={0.2}>
        <GlassmorphicCard gradient="from-purple-500/10 to-violet-500/10" blur="xl">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bold text-gray-900">Recent Recognition</h4>
              <GlassButton variant="primary" onClick={() => {}}>
                <Award className="w-4 h-4 mr-2" />
                Add Recognition
              </GlassButton>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { employee: 'Ahmad Syafiq', award: 'Employee of the Month', date: '2024-12-01', icon: '🏆' },
                { employee: 'Lee Mei Ling', award: 'Innovation Award', date: '2024-11-28', icon: '💡' },
                { employee: 'Raj Kumar', award: 'Team Player', date: '2024-11-25', icon: '🤝' },
              ].map((recognition, idx) => (
                <motion.div
                  key={idx}
                  className="bg-white/50 rounded-xl p-4 text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <div className="text-4xl mb-2">{recognition.icon}</div>
                  <h5 className="font-semibold text-gray-900 mb-1">{recognition.employee}</h5>
                  <p className="text-sm text-gray-600 mb-1">{recognition.award}</p>
                  <p className="text-xs text-gray-500">{recognition.date}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </GlassmorphicCard>
      </SlideIn>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 p-4 sm:p-6 lg:p-8">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute bottom-20 left-10 w-96 h-96 bg-pink-300/30 rounded-full blur-3xl"
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
                className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                Employee Relations
              </motion.h1>
              <p className="text-gray-600 mt-2">AI-powered grievance management & engagement tracking</p>
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
                  { id: 'grievances', name: 'Grievances', icon: MessageSquare },
                  { id: 'engagement', name: 'Engagement', icon: Heart },
                  { id: 'wellness', name: 'Wellness', icon: Activity },
                  { id: 'recognition', name: 'Recognition', icon: Award },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setViewMode(tab.id as ViewMode)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                        viewMode === tab.id
                          ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg'
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
            {viewMode === 'grievances' && renderGrievances()}
            {viewMode === 'engagement' && renderDashboard()}
            {viewMode === 'wellness' && renderWellness()}
            {viewMode === 'recognition' && renderWellness()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
