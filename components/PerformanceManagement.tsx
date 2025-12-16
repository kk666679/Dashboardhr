import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import {
  Target,
  TrendingUp,
  Users,
  Award,
  Brain,
  AlertTriangle,
  CheckCircle,
  Eye,
  Edit,
  Plus,
  Download,
  Upload,
  Filter,
  Search,
  Calendar,
  Clock,
  BarChart3,
  Activity,
  Zap,
  Star,
  MessageSquare,
  User,
  UserCheck,
  Shield,
  TrendingDown,
  ArrowRight,
  ChevronRight,
  FileText,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Sparkles,
  GitBranch,
  Lightbulb,
  Flag,
  Rocket,
  MapPin,
  Briefcase,
  GraduationCap,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  XCircle,
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
  ComposedChart,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

type ViewMode = 'dashboard' | 'okr' | 'feedback' | 'reviews' | '9box' | 'career-path' | 'bias-detection' | 'continuous-feedback';

interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  performanceScore: number;
  potentialScore: number;
  okrProgress: number;
  feedbackScore: number;
  riskLevel: 'Low' | 'Medium' | 'High';
}

interface OKR {
  id: string;
  employeeId: string;
  employeeName: string;
  objective: string;
  keyResults: KeyResult[];
  progress: number;
  status: 'On Track' | 'At Risk' | 'Behind' | 'Completed';
  quarter: string;
  aiPrediction: number;
}

interface KeyResult {
  id: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  dueDate: string;
}

interface Feedback360 {
  id: string;
  employeeId: string;
  employeeName: string;
  reviewCycle: string;
  selfRating: number;
  managerRating: number;
  peerRating: number;
  subordinateRating: number;
  overallScore: number;
  sentimentScore: number;
  completionStatus: 'Completed' | 'In Progress' | 'Pending';
  biasDetected: boolean;
}

interface PerformanceReview {
  id: string;
  employeeId: string;
  employeeName: string;
  reviewPeriod: string;
  rating: number;
  strengths: string[];
  improvements: string[];
  goals: string[];
  status: 'Draft' | 'Submitted' | 'Approved';
  biasScore: number;
}

interface CareerPath {
  employeeId: string;
  employeeName: string;
  currentRole: string;
  nextRole: string;
  readinessScore: number;
  requiredSkills: string[];
  missingSkills: string[];
  estimatedTimeframe: string;
  probability: number;
}

export function PerformanceManagement() {
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const employees: Employee[] = [
    {
      id: 'EMP-001',
      name: 'Sarah Johnson',
      position: 'Senior Engineer',
      department: 'Engineering',
      performanceScore: 4.5,
      potentialScore: 4.8,
      okrProgress: 85,
      feedbackScore: 4.6,
      riskLevel: 'Low',
    },
    {
      id: 'EMP-002',
      name: 'Ahmad Rahman',
      position: 'Product Manager',
      department: 'Product',
      performanceScore: 4.2,
      potentialScore: 4.5,
      okrProgress: 78,
      feedbackScore: 4.3,
      riskLevel: 'Low',
    },
    {
      id: 'EMP-003',
      name: 'Michelle Tan',
      position: 'Marketing Lead',
      department: 'Marketing',
      performanceScore: 3.8,
      potentialScore: 4.2,
      okrProgress: 65,
      feedbackScore: 3.9,
      riskLevel: 'Medium',
    },
    {
      id: 'EMP-004',
      name: 'David Chen',
      position: 'Sales Manager',
      department: 'Sales',
      performanceScore: 4.7,
      potentialScore: 4.3,
      okrProgress: 92,
      feedbackScore: 4.5,
      riskLevel: 'Low',
    },
    {
      id: 'EMP-005',
      name: 'Nurul Aisyah',
      position: 'HR Manager',
      department: 'HR',
      performanceScore: 4.0,
      potentialScore: 4.6,
      okrProgress: 70,
      feedbackScore: 4.1,
      riskLevel: 'Low',
    },
    {
      id: 'EMP-006',
      name: 'Kumar Singh',
      position: 'Junior Developer',
      department: 'Engineering',
      performanceScore: 3.5,
      potentialScore: 4.0,
      okrProgress: 60,
      feedbackScore: 3.7,
      riskLevel: 'Medium',
    },
  ];

  const okrs: OKR[] = [
    {
      id: 'OKR-001',
      employeeId: 'EMP-001',
      employeeName: 'Sarah Johnson',
      objective: 'Improve system performance and reduce latency',
      keyResults: [
        { id: 'KR-001', description: 'Reduce API response time', target: 200, current: 170, unit: 'ms', dueDate: '2024-12-31' },
        { id: 'KR-002', description: 'Increase test coverage', target: 90, current: 85, unit: '%', dueDate: '2024-12-31' },
        { id: 'KR-003', description: 'Deploy microservices', target: 5, current: 4, unit: 'services', dueDate: '2024-12-31' },
      ],
      progress: 85,
      status: 'On Track',
      quarter: 'Q4 2024',
      aiPrediction: 92,
    },
    {
      id: 'OKR-002',
      employeeId: 'EMP-002',
      employeeName: 'Ahmad Rahman',
      objective: 'Launch new product features and increase user engagement',
      keyResults: [
        { id: 'KR-004', description: 'Launch 3 new features', target: 3, current: 2, unit: 'features', dueDate: '2024-12-31' },
        { id: 'KR-005', description: 'Increase DAU', target: 50000, current: 38000, unit: 'users', dueDate: '2024-12-31' },
        { id: 'KR-006', description: 'Improve retention rate', target: 75, current: 68, unit: '%', dueDate: '2024-12-31' },
      ],
      progress: 78,
      status: 'On Track',
      quarter: 'Q4 2024',
      aiPrediction: 85,
    },
    {
      id: 'OKR-003',
      employeeId: 'EMP-003',
      employeeName: 'Michelle Tan',
      objective: 'Expand brand awareness and lead generation',
      keyResults: [
        { id: 'KR-007', description: 'Generate qualified leads', target: 500, current: 320, unit: 'leads', dueDate: '2024-12-31' },
        { id: 'KR-008', description: 'Increase social media followers', target: 10000, current: 6500, unit: 'followers', dueDate: '2024-12-31' },
        { id: 'KR-009', description: 'Launch marketing campaigns', target: 4, current: 3, unit: 'campaigns', dueDate: '2024-12-31' },
      ],
      progress: 65,
      status: 'At Risk',
      quarter: 'Q4 2024',
      aiPrediction: 72,
    },
  ];

  const feedback360Data: Feedback360[] = [
    {
      id: 'FB-001',
      employeeId: 'EMP-001',
      employeeName: 'Sarah Johnson',
      reviewCycle: '2024 Annual Review',
      selfRating: 4.5,
      managerRating: 4.7,
      peerRating: 4.6,
      subordinateRating: 4.8,
      overallScore: 4.65,
      sentimentScore: 0.85,
      completionStatus: 'Completed',
      biasDetected: false,
    },
    {
      id: 'FB-002',
      employeeId: 'EMP-002',
      employeeName: 'Ahmad Rahman',
      reviewCycle: '2024 Annual Review',
      selfRating: 4.3,
      managerRating: 4.2,
      peerRating: 4.4,
      subordinateRating: 4.5,
      overallScore: 4.35,
      sentimentScore: 0.78,
      completionStatus: 'Completed',
      biasDetected: false,
    },
    {
      id: 'FB-003',
      employeeId: 'EMP-003',
      employeeName: 'Michelle Tan',
      reviewCycle: '2024 Annual Review',
      selfRating: 4.0,
      managerRating: 3.5,
      peerRating: 4.1,
      subordinateRating: 4.2,
      overallScore: 3.95,
      sentimentScore: 0.65,
      completionStatus: 'In Progress',
      biasDetected: true,
    },
  ];

  const careerPaths: CareerPath[] = [
    {
      employeeId: 'EMP-001',
      employeeName: 'Sarah Johnson',
      currentRole: 'Senior Engineer',
      nextRole: 'Engineering Manager',
      readinessScore: 85,
      requiredSkills: ['Team Leadership', 'Project Management', 'Strategic Planning', 'Budget Management'],
      missingSkills: ['Budget Management'],
      estimatedTimeframe: '6-12 months',
      probability: 78,
    },
    {
      employeeId: 'EMP-005',
      employeeName: 'Nurul Aisyah',
      currentRole: 'HR Manager',
      nextRole: 'HR Director',
      readinessScore: 72,
      requiredSkills: ['Strategic HR', 'C-Suite Communication', 'Change Management', 'Organizational Design'],
      missingSkills: ['C-Suite Communication', 'Organizational Design'],
      estimatedTimeframe: '12-18 months',
      probability: 65,
    },
    {
      employeeId: 'EMP-006',
      employeeName: 'Kumar Singh',
      currentRole: 'Junior Developer',
      nextRole: 'Mid-level Developer',
      readinessScore: 68,
      requiredSkills: ['Advanced Coding', 'System Design', 'Code Review', 'Mentoring'],
      missingSkills: ['System Design', 'Mentoring'],
      estimatedTimeframe: '9-15 months',
      probability: 70,
    },
  ];

  const totalEmployees = employees.length;
  const avgPerformance = employees.reduce((sum, e) => sum + e.performanceScore, 0) / employees.length;
  const avgOKRProgress = employees.reduce((sum, e) => sum + e.okrProgress, 0) / employees.length;
  const highPotential = employees.filter(e => e.potentialScore >= 4.5).length;

  const stats = [
    {
      label: 'Total Employees',
      value: totalEmployees,
      change: '+3 this quarter',
      icon: Users,
      gradient: 'from-blue-500/80 to-cyan-500/80',
    },
    {
      label: 'Avg Performance',
      value: avgPerformance.toFixed(1),
      change: '+0.3 vs last quarter',
      icon: Award,
      gradient: 'from-green-500/80 to-emerald-500/80',
    },
    {
      label: 'OKR Progress',
      value: Math.round(avgOKRProgress),
      suffix: '%',
      change: 'On track',
      icon: Target,
      gradient: 'from-purple-500/80 to-violet-500/80',
    },
    {
      label: 'High Potential',
      value: highPotential,
      change: `${Math.round((highPotential / totalEmployees) * 100)}% of workforce`,
      icon: Rocket,
      gradient: 'from-orange-500/80 to-amber-500/80',
    },
  ];

  // Analytics Data
  const performanceDistribution = [
    { rating: '1.0-2.0', count: 0, fill: '#EF4444' },
    { rating: '2.0-3.0', count: 0, fill: '#F59E0B' },
    { rating: '3.0-4.0', count: 2, fill: '#10B981' },
    { rating: '4.0-5.0', count: 4, fill: '#8B5CF6' },
  ];

  const departmentPerformance = [
    { department: 'Engineering', avg: 4.0, target: 4.0 },
    { department: 'Product', avg: 4.2, target: 4.0 },
    { department: 'Marketing', avg: 3.8, target: 4.0 },
    { department: 'Sales', avg: 4.7, target: 4.5 },
    { department: 'HR', avg: 4.0, target: 4.0 },
  ];

  const okrTrend = [
    { month: 'Jul', progress: 45 },
    { month: 'Aug', progress: 55 },
    { month: 'Sep', progress: 65 },
    { month: 'Oct', progress: 72 },
    { month: 'Nov', progress: 78 },
    { month: 'Dec', progress: 85 },
  ];

  const feedbackCompletion = [
    { type: 'Self', completed: 100, fill: '#8B5CF6' },
    { type: 'Manager', completed: 100, fill: '#EC4899' },
    { type: 'Peer', completed: 85, fill: '#10B981' },
    { type: 'Subordinate', completed: 90, fill: '#F59E0B' },
  ];

  // 9-Box Grid Data
  const nineBoxData = employees.map(e => ({
    name: e.name,
    performance: e.performanceScore,
    potential: e.potentialScore,
    department: e.department,
  }));

  const COLORS = ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#3B82F6', '#EF4444'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'On Track':
      case 'Completed':
      case 'Low':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'At Risk':
      case 'In Progress':
      case 'Medium':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Behind':
      case 'Pending':
      case 'High':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'Draft':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'Approved':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Quick Actions */}
      <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => setViewMode('okr')}
              className="flex flex-col items-center gap-2 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border-2 border-purple-200 transition-all"
            >
              <Target className="w-6 h-6 text-purple-600" />
              <span className="text-sm font-medium text-purple-900">Set OKRs</span>
            </button>
            <button
              onClick={() => setViewMode('feedback')}
              className="flex flex-col items-center gap-2 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border-2 border-blue-200 transition-all"
            >
              <MessageSquare className="w-6 h-6 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">360° Feedback</span>
            </button>
            <button
              onClick={() => setViewMode('9box')}
              className="flex flex-col items-center gap-2 p-4 bg-green-50 hover:bg-green-100 rounded-lg border-2 border-green-200 transition-all"
            >
              <BarChart3 className="w-6 h-6 text-green-600" />
              <span className="text-sm font-medium text-green-900">9-Box Grid</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 bg-orange-50 hover:bg-orange-100 rounded-lg border-2 border-orange-200 transition-all">
              <Download className="w-6 h-6 text-orange-600" />
              <span className="text-sm font-medium text-orange-900">Reports</span>
            </button>
          </div>
        </div>
      </GlassmorphicCard>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Performance Distribution</h3>
            <div style={{ width: '100%', height: '250px', minHeight: '250px' }}>
              <ResponsiveContainer width="100%" height="100%" minHeight={250}>
                <BarChart data={performanceDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="rating" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {performanceDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </GlassmorphicCard>

        <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Department Performance</h3>
            <div style={{ width: '100%', height: '250px', minHeight: '250px' }}>
              <ResponsiveContainer width="100%" height="100%" minHeight={250}>
                <BarChart data={departmentPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="department" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" domain={[0, 5]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="avg" fill="#8B5CF6" radius={[8, 8, 0, 0]} name="Average" />
                  <Bar dataKey="target" fill="#10B981" radius={[8, 8, 0, 0]} name="Target" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </GlassmorphicCard>

        <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">OKR Progress Trend</h3>
            <div style={{ width: '100%', height: '250px', minHeight: '250px' }}>
              <ResponsiveContainer width="100%" height="100%" minHeight={250}>
                <AreaChart data={okrTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip />
                  <Area type="monotone" dataKey="progress" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </GlassmorphicCard>

        <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">360° Feedback Completion</h3>
            <div style={{ width: '100%', height: '250px', minHeight: '250px' }}>
              <ResponsiveContainer width="100%" height="100%" minHeight={250}>
                <BarChart data={feedbackCompletion} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis type="number" stroke="#6B7280" domain={[0, 100]} />
                  <YAxis dataKey="type" type="category" stroke="#6B7280" />
                  <Tooltip />
                  <Bar dataKey="completed" radius={[0, 8, 8, 0]}>
                    {feedbackCompletion.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </GlassmorphicCard>
      </div>

      {/* AI Insights */}
      <GlassmorphicCard gradient="from-purple-50/80 to-violet-50/60" blur="xl">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-purple-900 mb-2">🤖 AI Performance Insights</h3>
              <div className="space-y-2 text-sm text-purple-800">
                <p>✓ <strong>Predictive Analytics:</strong> 85% of OKRs on track to meet Q4 targets</p>
                <p>✓ <strong>Talent Risk:</strong> 2 high-potential employees showing early attrition signals</p>
                <p>✓ <strong>Bias Detection:</strong> 1 review flagged for potential unconscious bias in ratings</p>
                <p>✓ <strong>Performance Trend:</strong> Overall team performance up 7.5% vs last quarter</p>
              </div>
            </div>
          </div>
        </div>
      </GlassmorphicCard>
    </div>
  );

  const renderOKR = () => (
    <div className="space-y-6">
      {/* OKR Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <GlassmorphicCard gradient="from-green-50/80 to-emerald-50/60" blur="xl">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">On Track</p>
                <p className="text-3xl font-bold text-green-600">
                  {okrs.filter(o => o.status === 'On Track').length}
                </p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>
        </GlassmorphicCard>

        <GlassmorphicCard gradient="from-orange-50/80 to-amber-50/60" blur="xl">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">At Risk</p>
                <p className="text-3xl font-bold text-orange-600">
                  {okrs.filter(o => o.status === 'At Risk').length}
                </p>
              </div>
              <AlertTriangle className="w-12 h-12 text-orange-600" />
            </div>
          </div>
        </GlassmorphicCard>

        <GlassmorphicCard gradient="from-blue-50/80 to-cyan-50/60" blur="xl">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Avg Progress</p>
                <p className="text-3xl font-bold text-blue-600">{Math.round(avgOKRProgress)}%</p>
              </div>
              <Target className="w-12 h-12 text-blue-600" />
            </div>
          </div>
        </GlassmorphicCard>
      </div>

      {/* OKR List */}
      <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Active OKRs - Q4 2024</h3>
            <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all">
              <Plus className="w-4 h-4" />
              New OKR
            </button>
          </div>
          <div className="space-y-4">
            {okrs.map((okr, index) => (
              <motion.div
                key={okr.id}
                className="p-6 bg-white/50 rounded-lg border-2 border-gray-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-bold text-gray-900">{okr.employeeName}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(okr.status)}`}>
                        {okr.status}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-3">{okr.objective}</p>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-3xl font-bold text-purple-600">{okr.progress}%</div>
                    <div className="text-sm text-gray-600">Progress</div>
                  </div>
                </div>

                {/* Key Results */}
                <div className="space-y-3 mb-4">
                  {okr.keyResults.map((kr) => {
                    const krProgress = Math.round((kr.current / kr.target) * 100);
                    return (
                      <div key={kr.id} className="bg-white/70 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-medium text-gray-900">{kr.description}</p>
                          <span className="text-sm font-bold text-purple-600">{krProgress}%</span>
                        </div>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-purple-600 rounded-full transition-all"
                              style={{ width: `${krProgress}%` }}
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-600">
                          <span>Current: {kr.current} {kr.unit}</span>
                          <span>Target: {kr.target} {kr.unit}</span>
                          <span>Due: {kr.dueDate}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* AI Prediction */}
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <div className="flex-1">
                    <p className="text-sm text-purple-900">
                      <strong>AI Prediction:</strong> {okr.aiPrediction}% likelihood of achieving all key results by quarter end
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </GlassmorphicCard>
    </div>
  );

  const renderFeedback360 = () => (
    <div className="space-y-6">
      {/* Feedback Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: 'Self Reviews', value: 100, color: 'purple' },
          { label: 'Manager Reviews', value: 100, color: 'blue' },
          { label: 'Peer Reviews', value: 85, color: 'green' },
          { label: 'Subordinate Reviews', value: 90, color: 'orange' },
        ].map((stat, index) => (
          <GlassmorphicCard key={index} gradient="from-white/80 to-white/60" blur="xl">
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className={`text-3xl font-bold text-${stat.color}-600`}>{stat.value}%</p>
            </div>
          </GlassmorphicCard>
        ))}
      </div>

      {/* 360 Feedback List */}
      <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">360° Feedback Reviews - 2024 Cycle</h3>
          <div className="space-y-4">
            {feedback360Data.map((feedback, index) => (
              <motion.div
                key={feedback.id}
                className="p-6 bg-white/50 rounded-lg border-2 border-gray-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {feedback.employeeName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{feedback.employeeName}</h4>
                      <p className="text-sm text-gray-600">{feedback.reviewCycle}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {feedback.biasDetected && (
                      <span className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-full border border-red-200 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Bias Detected
                      </span>
                    )}
                    <span className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(feedback.completionStatus)}`}>
                      {feedback.completionStatus}
                    </span>
                  </div>
                </div>

                {/* Rating Breakdown */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-4">
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Self</p>
                    <p className="text-2xl font-bold text-purple-600">{feedback.selfRating.toFixed(1)}</p>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Manager</p>
                    <p className="text-2xl font-bold text-blue-600">{feedback.managerRating.toFixed(1)}</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Peer</p>
                    <p className="text-2xl font-bold text-green-600">{feedback.peerRating.toFixed(1)}</p>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Subordinate</p>
                    <p className="text-2xl font-bold text-orange-600">{feedback.subordinateRating.toFixed(1)}</p>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border-2 border-purple-200">
                    <p className="text-xs text-gray-600 mb-1">Overall</p>
                    <p className="text-2xl font-bold text-purple-600">{feedback.overallScore.toFixed(2)}</p>
                  </div>
                </div>

                {/* Sentiment Analysis */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-semibold text-blue-900">Sentiment Analysis</span>
                    </div>
                    <span className="text-sm font-bold text-blue-600">
                      {Math.round(feedback.sentimentScore * 100)}% Positive
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-green-600 rounded-full transition-all"
                      style={{ width: `${feedback.sentimentScore * 100}%` }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </GlassmorphicCard>
    </div>
  );

  const render9Box = () => {
    const getBoxLabel = (performance: number, potential: number): string => {
      if (performance >= 4.0 && potential >= 4.5) return 'Star (High Perf, High Pot)';
      if (performance >= 4.0 && potential >= 3.5) return 'Core Player';
      if (performance >= 4.0) return 'Consistent Performer';
      if (potential >= 4.5) return 'High Potential';
      if (performance >= 3.5 && potential >= 3.5) return 'Solid Performer';
      if (performance < 3.5 && potential < 3.5) return 'Development Needed';
      return 'Needs Attention';
    };

    const getBoxColor = (performance: number, potential: number): string => {
      if (performance >= 4.0 && potential >= 4.5) return 'bg-purple-500';
      if (performance >= 4.0 && potential >= 3.5) return 'bg-blue-500';
      if (performance >= 4.0) return 'bg-green-500';
      if (potential >= 4.5) return 'bg-orange-500';
      if (performance >= 3.5 && potential >= 3.5) return 'bg-teal-500';
      if (performance < 3.5 && potential < 3.5) return 'bg-red-500';
      return 'bg-yellow-500';
    };

    return (
      <div className="space-y-6">
        {/* 9-Box Grid Visualization */}
        <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Performance-Potential Matrix (9-Box Grid)</h3>
            <div style={{ width: '100%', height: '500px', minHeight: '500px' }}>
              <ResponsiveContainer width="100%" height="100%" minHeight={500}>
                <ScatterChart margin={{ top: 20, right: 20, bottom: 60, left: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    type="number"
                    dataKey="performance"
                    name="Performance"
                    domain={[0, 5]}
                    stroke="#6B7280"
                    label={{ value: 'Performance Score →', position: 'bottom', offset: 40 }}
                  />
                  <YAxis
                    type="number"
                    dataKey="potential"
                    name="Potential"
                    domain={[0, 5]}
                    stroke="#6B7280"
                    label={{ value: 'Potential Score →', angle: -90, position: 'left', offset: 40 }}
                  />
                  <Tooltip
                    cursor={{ strokeDasharray: '3 3' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-4 rounded-lg shadow-lg border-2 border-gray-200">
                            <p className="font-bold text-gray-900">{data.name}</p>
                            <p className="text-sm text-gray-600">Department: {data.department}</p>
                            <p className="text-sm text-gray-600">Performance: {data.performance.toFixed(1)}</p>
                            <p className="text-sm text-gray-600">Potential: {data.potential.toFixed(1)}</p>
                            <p className="text-xs text-purple-600 mt-2 font-semibold">
                              {getBoxLabel(data.performance, data.potential)}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Scatter name="Employees" data={nineBoxData} fill="#8B5CF6">
                    {nineBoxData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        </GlassmorphicCard>

        {/* Talent Categories */}
        <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Talent Distribution</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {employees.map((employee, index) => (
                <motion.div
                  key={employee.id}
                  className="p-4 bg-white/50 rounded-lg border-2 border-gray-200"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-3 h-3 rounded-full ${getBoxColor(employee.performanceScore, employee.potentialScore)}`} />
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 text-sm">{employee.name}</p>
                      <p className="text-xs text-gray-600">{employee.position}</p>
                    </div>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Performance:</span>
                      <span className="font-semibold text-gray-900">{employee.performanceScore.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Potential:</span>
                      <span className="font-semibold text-gray-900">{employee.potentialScore.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs font-semibold text-purple-600">
                      {getBoxLabel(employee.performanceScore, employee.potentialScore)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </GlassmorphicCard>
      </div>
    );
  };

  const renderCareerPath = () => (
    <div className="space-y-6">
      <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Career Path Simulations</h3>
          <div className="space-y-4">
            {careerPaths.map((path, index) => (
              <motion.div
                key={path.employeeId}
                className="p-6 bg-white/50 rounded-lg border-2 border-gray-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                      {path.employeeName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{path.employeeName}</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>{path.currentRole}</span>
                        <ArrowRight className="w-4 h-4" />
                        <span className="font-semibold text-green-600">{path.nextRole}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-green-600">{path.readinessScore}%</div>
                    <div className="text-sm text-gray-600">Ready</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Readiness Score</span>
                    <span className="text-sm text-gray-600">{path.estimatedTimeframe}</span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-600 to-teal-600 rounded-full transition-all"
                      style={{ width: `${path.readinessScore}%` }}
                    />
                  </div>
                </div>

                {/* Skills Analysis */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-semibold text-green-900">Required Skills</span>
                    </div>
                    <div className="space-y-1">
                      {path.requiredSkills.map((skill, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-green-600 rounded-full" />
                          <span className="text-xs text-green-800">{skill}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="w-5 h-5 text-orange-600" />
                      <span className="text-sm font-semibold text-orange-900">Development Areas</span>
                    </div>
                    <div className="space-y-1">
                      {path.missingSkills.map((skill, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-orange-600 rounded-full" />
                          <span className="text-xs text-orange-800">{skill}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* AI Prediction */}
                <div className="mt-4 bg-purple-50 border border-purple-200 rounded-lg p-3 flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <p className="text-sm text-purple-900">
                    <strong>AI Success Probability:</strong> {path.probability}% chance of successful transition within {path.estimatedTimeframe}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </GlassmorphicCard>
    </div>
  );

  const renderBiasDetection = () => (
    <div className="space-y-6">
      <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">AI Bias Detection in Performance Reviews</h3>
          <div className="space-y-4">
            {feedback360Data.filter(f => f.biasDetected).map((feedback, index) => (
              <motion.div
                key={feedback.id}
                className="p-6 bg-red-50/50 rounded-lg border-2 border-red-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-red-900 mb-2">Potential Bias Detected</h4>
                    <p className="text-sm text-red-700 mb-3">
                      Review for <strong>{feedback.employeeName}</strong> shows inconsistencies that may indicate unconscious bias.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div className="bg-white/70 p-4 rounded-lg">
                    <p className="text-sm font-semibold text-gray-900 mb-2">Rating Discrepancy</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Self Rating:</span>
                        <span className="font-bold text-gray-900">{feedback.selfRating.toFixed(1)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Manager Rating:</span>
                        <span className="font-bold text-red-600">{feedback.managerRating.toFixed(1)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Peer Rating:</span>
                        <span className="font-bold text-gray-900">{feedback.peerRating.toFixed(1)}</span>
                      </div>
                      <div className="pt-2 border-t border-gray-200">
                        <span className="text-red-600 font-semibold">Variance: {Math.abs(feedback.managerRating - feedback.peerRating).toFixed(1)} points</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/70 p-4 rounded-lg">
                    <p className="text-sm font-semibold text-gray-900 mb-2">AI Analysis</p>
                    <div className="space-y-2 text-sm text-gray-700">
                      <p>⚠️ Significant gap between manager and peer ratings</p>
                      <p>⚠️ Low sentiment score in manager comments</p>
                      <p>⚠️ Pattern matches historical gender bias indicators</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-blue-900 mb-2">Recommended Actions:</p>
                  <ul className="space-y-1 text-sm text-blue-800">
                    <li>✓ Schedule calibration session with manager and HR</li>
                    <li>✓ Review feedback against objective performance metrics</li>
                    <li>✓ Provide unconscious bias training to manager</li>
                    <li>✓ Consider additional peer input for balanced view</li>
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </GlassmorphicCard>

      {/* Bias Prevention */}
      <GlassmorphicCard gradient="from-green-50/80 to-emerald-50/60" blur="xl">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-bold text-green-900 mb-2">🇲🇾 Malaysian Fairness Standards</h3>
              <div className="space-y-2 text-sm text-green-800">
                <p>✓ <strong>Employment Act 1955:</strong> Equal treatment regardless of race, religion, or gender</p>
                <p>✓ <strong>MSC Malaysia Standards:</strong> Merit-based performance evaluation</p>
                <p>✓ <strong>GLC Transformation:</strong> Diversity and inclusion in talent development</p>
                <p>✓ <strong>AI Monitoring:</strong> Continuous bias detection across all performance reviews</p>
              </div>
            </div>
          </div>
        </div>
      </GlassmorphicCard>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-4 sm:p-6 lg:p-8">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 right-10 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl"
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
                className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                🎯 Performance Management System
              </motion.h1>
              <p className="text-gray-600 mt-2">AI-enhanced performance tracking with OKR management and bias detection</p>
            </div>
            <div className="flex items-center gap-2">
              <GlassButton variant="secondary" onClick={() => {}}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </GlassButton>
              <GlassButton variant="primary" onClick={() => {}}>
                <Plus className="w-4 h-4 mr-2" />
                New Review
              </GlassButton>
            </div>
          </div>
        </SlideIn>

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
                          <AnimatedCounter value={typeof stat.value === 'number' ? stat.value : parseFloat(stat.value)} duration={2} />
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

        {/* Navigation */}
        <SlideIn direction="down" delay={0.1}>
          <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
            <div className="p-2">
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
                  { id: 'okr', name: 'OKRs', icon: Target },
                  { id: 'feedback', name: '360° Feedback', icon: MessageSquare },
                  { id: 'reviews', name: 'Reviews', icon: FileText },
                  { id: '9box', name: '9-Box Grid', icon: Activity },
                  { id: 'career-path', name: 'Career Path', icon: GitBranch },
                  { id: 'bias-detection', name: 'Bias Detection', icon: Shield },
                  { id: 'continuous-feedback', name: 'Feedback', icon: MessageSquare },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setViewMode(tab.id as ViewMode)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${ 
                        viewMode === tab.id
                          ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
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
            {viewMode === 'okr' && renderOKR()}
            {viewMode === 'feedback' && renderFeedback360()}
            {viewMode === '9box' && render9Box()}
            {viewMode === 'career-path' && renderCareerPath()}
            {viewMode === 'bias-detection' && renderBiasDetection()}
            {viewMode === 'reviews' && <div className="text-center p-12 text-gray-500">Performance Reviews view coming soon</div>}
            {viewMode === 'continuous-feedback' && <div className="text-center p-12 text-gray-500">Continuous Feedback view coming soon</div>}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
