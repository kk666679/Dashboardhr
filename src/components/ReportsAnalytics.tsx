import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, 
  Download, 
  TrendingUp, 
  Users, 
  Calendar, 
  Brain,
  Filter,
  FileText,
  Share2,
  Eye,
  Target,
  DollarSign,
  Clock,
  Award,
  TrendingDown,
  Activity,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Zap,
  Shield,
  AlertCircle,
  CheckCircle,
  Briefcase,
  Globe,
  Mail,
  Printer,
  RefreshCw,
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
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
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
  RadialBarChart,
  RadialBar,
  Treemap,
  FunnelChart,
  Funnel,
} from 'recharts';

type ReportCategory = 'overview' | 'workforce' | 'financial' | 'performance' | 'compliance' | 'ai-insights';

export function ReportsAnalytics() {
  const [reportCategory, setReportCategory] = useState<ReportCategory>('overview');
  const [dateRange, setDateRange] = useState('last-6-months');
  const [exportFormat, setExportFormat] = useState<string>('pdf');

  // Overview Data
  const keyMetrics = [
    {
      label: 'Total Reports',
      value: 156,
      change: '+23 this month',
      icon: FileText,
      gradient: 'from-blue-500/80 to-cyan-500/80',
    },
    {
      label: 'Active Users',
      value: 247,
      change: '+12% vs last month',
      icon: Users,
      gradient: 'from-purple-500/80 to-violet-500/80',
    },
    {
      label: 'Compliance Score',
      value: 98,
      suffix: '%',
      change: '+2% improvement',
      icon: Shield,
      gradient: 'from-green-500/80 to-emerald-500/80',
    },
    {
      label: 'AI Predictions',
      value: 42,
      change: '87% accuracy',
      icon: Brain,
      gradient: 'from-pink-500/80 to-rose-500/80',
    },
  ];

  // Workforce Analytics
  const headcountTrend = [
    { month: 'Jul', headcount: 220, newHires: 8, terminations: 3, contractors: 15 },
    { month: 'Aug', headcount: 225, newHires: 10, terminations: 5, contractors: 18 },
    { month: 'Sep', headcount: 232, newHires: 12, terminations: 5, contractors: 20 },
    { month: 'Oct', headcount: 238, newHires: 9, terminations: 3, contractors: 22 },
    { month: 'Nov', headcount: 242, newHires: 11, terminations: 7, contractors: 19 },
    { month: 'Dec', headcount: 247, newHires: 13, terminations: 8, contractors: 21 },
  ];

  const turnoverData = [
    { quarter: 'Q1 2023', rate: 8.2, voluntary: 6.5, involuntary: 1.7 },
    { quarter: 'Q2 2023', rate: 7.5, voluntary: 5.8, involuntary: 1.7 },
    { quarter: 'Q3 2023', rate: 6.8, voluntary: 5.2, involuntary: 1.6 },
    { quarter: 'Q4 2023', rate: 5.9, voluntary: 4.5, involuntary: 1.4 },
    { quarter: 'Q1 2024', rate: 5.2, voluntary: 4.0, involuntary: 1.2 },
    { quarter: 'Q2 2024', rate: 4.2, voluntary: 3.2, involuntary: 1.0 },
  ];

  const departmentData = [
    { name: 'Engineering', value: 89, fill: '#8B5CF6' },
    { name: 'Sales', value: 52, fill: '#EC4899' },
    { name: 'Marketing', value: 38, fill: '#10B981' },
    { name: 'Operations', value: 45, fill: '#F59E0B' },
    { name: 'HR', value: 23, fill: '#3B82F6' },
  ];

  const ageDistribution = [
    { range: '20-29', value: 62 },
    { range: '30-39', value: 98 },
    { range: '40-49', value: 65 },
    { range: '50-59', value: 18 },
    { range: '60+', value: 4 },
  ];

  const genderDiversity = [
    { name: 'Male', value: 143 },
    { name: 'Female', value: 104 },
  ];

  // Financial Analytics
  const payrollTrend = [
    { month: 'Jul', gross: 1850, deductions: 320, net: 1530, epf: 180, socso: 45, eis: 8 },
    { month: 'Aug', gross: 1920, deductions: 335, net: 1585, epf: 190, socso: 48, eis: 9 },
    { month: 'Sep', gross: 1980, deductions: 345, net: 1635, epf: 195, socso: 50, eis: 9 },
    { month: 'Oct', gross: 2050, deductions: 358, net: 1692, epf: 205, socso: 52, eis: 10 },
    { month: 'Nov', gross: 2120, deductions: 370, net: 1750, epf: 210, socso: 53, eis: 10 },
    { month: 'Dec', gross: 2200, deductions: 385, net: 1815, epf: 220, socso: 55, eis: 11 },
  ];

  const costByDepartment = [
    { department: 'Engineering', cost: 780 },
    { department: 'Sales', cost: 450 },
    { department: 'Marketing', cost: 320 },
    { department: 'Operations', cost: 390 },
    { department: 'HR', cost: 260 },
  ];

  const benefitsBreakdown = [
    { name: 'EPF (11%)', value: 220, fill: '#8B5CF6' },
    { name: 'SOCSO', value: 55, fill: '#EC4899' },
    { name: 'EIS', value: 11, fill: '#10B981' },
    { name: 'Medical', value: 45, fill: '#F59E0B' },
    { name: 'Insurance', value: 54, fill: '#3B82F6' },
  ];

  // Performance Analytics
  const performanceScores = [
    { department: 'Engineering', current: 92, target: 90, potential: 95 },
    { department: 'Sales', current: 87, target: 85, potential: 90 },
    { department: 'Marketing', current: 85, target: 88, potential: 92 },
    { department: 'Operations', current: 90, target: 87, potential: 93 },
    { department: 'HR', current: 88, target: 90, potential: 94 },
  ];

  const kpiData = [
    { metric: 'Productivity', value: 88, target: 85, fill: '#8B5CF6' },
    { metric: 'Quality', value: 92, target: 90, fill: '#EC4899' },
    { metric: 'Efficiency', value: 86, target: 88, fill: '#10B981' },
    { metric: 'Innovation', value: 78, target: 75, fill: '#F59E0B' },
    { metric: 'Collaboration', value: 90, target: 85, fill: '#3B82F6' },
  ];

  const trainingROI = [
    { month: 'Jul', investment: 45, productivity: 82 },
    { month: 'Aug', investment: 52, productivity: 85 },
    { month: 'Sep', investment: 48, productivity: 87 },
    { month: 'Oct', investment: 60, productivity: 90 },
    { month: 'Nov', investment: 55, productivity: 92 },
    { month: 'Dec', investment: 58, productivity: 94 },
  ];

  // Compliance Analytics
  const complianceMetrics = [
    {
      category: 'Employment Act 1955',
      score: 100,
      status: 'Compliant',
      lastAudit: '2024-12-01',
      nextReview: '2025-03-01',
    },
    {
      category: 'EPF Compliance',
      score: 100,
      status: 'Compliant',
      lastAudit: '2024-11-15',
      nextReview: '2025-02-15',
    },
    {
      category: 'SOCSO Compliance',
      score: 100,
      status: 'Compliant',
      lastAudit: '2024-11-15',
      nextReview: '2025-02-15',
    },
    {
      category: 'EIS Compliance',
      score: 98,
      status: 'Minor Issues',
      lastAudit: '2024-12-10',
      nextReview: '2025-01-10',
    },
    {
      category: 'Immigration Act',
      score: 95,
      status: 'Action Required',
      lastAudit: '2024-11-20',
      nextReview: '2024-12-20',
    },
  ];

  const complianceTimeline = [
    { month: 'Jul', score: 92 },
    { month: 'Aug', score: 94 },
    { month: 'Sep', score: 95 },
    { month: 'Oct', score: 96 },
    { month: 'Nov', score: 97 },
    { month: 'Dec', score: 98 },
  ];

  // AI Insights
  const aiPredictions = [
    {
      type: 'Turnover Risk',
      prediction: 'High risk identified in Sales department',
      confidence: 87,
      impact: 'High',
      recommendation: 'Conduct retention interviews with 5 key employees',
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      type: 'Hiring Forecast',
      prediction: 'Need 12 new hires in Q1 2025',
      confidence: 92,
      impact: 'Medium',
      recommendation: 'Start recruitment pipeline for Engineering roles',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      type: 'Leave Pattern',
      prediction: 'Increase in sick leave in December',
      confidence: 78,
      impact: 'Low',
      recommendation: 'Plan backup resources for critical projects',
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      type: 'Performance Trend',
      prediction: 'Marketing team exceeding targets',
      confidence: 95,
      impact: 'Positive',
      recommendation: 'Consider expansion and reward programs',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
  ];

  const sentimentTrend = [
    { month: 'Jul', positive: 72, neutral: 20, negative: 8 },
    { month: 'Aug', positive: 75, neutral: 18, negative: 7 },
    { month: 'Sep', positive: 78, neutral: 16, negative: 6 },
    { month: 'Oct', positive: 82, neutral: 13, negative: 5 },
    { month: 'Nov', positive: 85, neutral: 11, negative: 4 },
    { month: 'Dec', positive: 88, neutral: 9, negative: 3 },
  ];

  const COLORS = ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#3B82F6', '#EF4444'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Compliant':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Minor Issues':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Action Required':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Headcount', value: 247, change: '+5 this month', icon: Users, color: 'purple' },
          { label: 'Avg Salary', value: 'RM 7.2K', change: '+3% YoY', icon: DollarSign, color: 'green' },
          { label: 'Turnover Rate', value: '4.2%', change: '-1.8% improvement', icon: TrendingDown, color: 'blue' },
          { label: 'Engagement', value: '88%', change: '+5% vs Q3', icon: Activity, color: 'pink' },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 bg-${stat.color}-500 rounded-lg flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{stat.change}</p>
                </div>
              </GlassmorphicCard>
            </motion.div>
          );
        })}
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SlideIn direction="left">
          <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Headcount Trend</h3>
              <div style={{ width: '100%', height: '300px', minHeight: '300px' }}>
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={300}>
                  <ComposedChart data={headcountTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="month" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="newHires" name="New Hires" fill="#10B981" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="terminations" name="Terminations" fill="#EF4444" radius={[8, 8, 0, 0]} />
                    <Line type="monotone" dataKey="headcount" name="Total" stroke="#8B5CF6" strokeWidth={3} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          </GlassmorphicCard>
        </SlideIn>

        <SlideIn direction="right">
          <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Department Distribution</h3>
              <div style={{ width: '100%', height: '300px', minHeight: '300px' }}>
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={300}>
                  <PieChart>
                    <Pie
                      data={departmentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={110}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {departmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </GlassmorphicCard>
        </SlideIn>

        <SlideIn direction="left" delay={0.2}>
          <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Turnover Analysis</h3>
              <div style={{ width: '100%', height: '300px', minHeight: '300px' }}>
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={300}>
                  <AreaChart data={turnoverData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="quarter" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="voluntary" stackId="1" stroke="#EC4899" fill="#EC4899" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="involuntary" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </GlassmorphicCard>
        </SlideIn>

        <SlideIn direction="right" delay={0.2}>
          <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Age Distribution</h3>
              <div style={{ width: '100%', height: '300px', minHeight: '300px' }}>
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={300}>
                  <BarChart data={ageDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="range" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </GlassmorphicCard>
        </SlideIn>
      </div>
    </div>
  );

  const renderWorkforce = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Headcount Growth</h3>
            <div style={{ width: '100%', height: '300px', minHeight: '300px' }}>
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={300}>
                <LineChart data={headcountTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="headcount" stroke="#8B5CF6" strokeWidth={3} name="Full-time" />
                  <Line type="monotone" dataKey="contractors" stroke="#10B981" strokeWidth={3} name="Contractors" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </GlassmorphicCard>

        <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Gender Diversity</h3>
            <div style={{ width: '100%', height: '300px', minHeight: '300px' }}>
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={300}>
                <PieChart>
                  <Pie
                    data={genderDiversity}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {genderDiversity.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </GlassmorphicCard>
      </div>
    </div>
  );

  const renderFinancial = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Payroll Trend (RM '000)</h3>
            <div style={{ width: '100%', height: '300px', minHeight: '300px' }}>
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={300}>
                <ComposedChart data={payrollTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="gross" fill="#8B5CF6" radius={[8, 8, 0, 0]} name="Gross Salary" />
                  <Bar dataKey="deductions" fill="#EC4899" radius={[8, 8, 0, 0]} name="Deductions" />
                  <Line type="monotone" dataKey="net" stroke="#10B981" strokeWidth={3} name="Net Salary" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </GlassmorphicCard>

        <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Benefits Breakdown (RM '000)</h3>
            <div style={{ width: '100%', height: '300px', minHeight: '300px' }}>
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={300}>
                <PieChart>
                  <Pie
                    data={benefitsBreakdown}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value }) => `${name}: RM ${value}K`}
                  >
                    {benefitsBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </GlassmorphicCard>

        <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Cost by Department (RM '000)</h3>
            <div style={{ width: '100%', height: '300px', minHeight: '300px' }}>
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={300}>
                <BarChart data={costByDepartment} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis type="number" stroke="#6B7280" />
                  <YAxis dataKey="department" type="category" stroke="#6B7280" width={100} />
                  <Tooltip />
                  <Bar dataKey="cost" fill="#8B5CF6" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </GlassmorphicCard>

        <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Malaysian Statutory Contributions</h3>
            <div style={{ width: '100%', height: '300px', minHeight: '300px' }}>
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={300}>
                <AreaChart data={payrollTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="epf" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" name="EPF" />
                  <Area type="monotone" dataKey="socso" stackId="1" stroke="#EC4899" fill="#EC4899" name="SOCSO" />
                  <Area type="monotone" dataKey="eis" stackId="1" stroke="#10B981" fill="#10B981" name="EIS" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </GlassmorphicCard>
      </div>
    </div>
  );

  const renderPerformance = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Department Performance</h3>
            <div style={{ width: '100%', height: '300px', minHeight: '300px' }}>
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={300}>
                <RadarChart data={performanceScores}>
                  <PolarGrid stroke="#E5E7EB" />
                  <PolarAngleAxis dataKey="department" stroke="#6B7280" />
                  <PolarRadiusAxis stroke="#6B7280" />
                  <Tooltip />
                  <Legend />
                  <Radar name="Current" dataKey="current" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
                  <Radar name="Target" dataKey="target" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                  <Radar name="Potential" dataKey="potential" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </GlassmorphicCard>

        <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Key Performance Indicators</h3>
            <div style={{ width: '100%', height: '300px', minHeight: '300px' }}>
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={300}>
                <RadialBarChart
                  innerRadius="20%"
                  outerRadius="90%"
                  data={kpiData}
                  startAngle={90}
                  endAngle={-270}
                >
                  <RadialBar
                    minAngle={15}
                    background
                    clockWise
                    dataKey="value"
                    cornerRadius={10}
                  />
                  <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
                  <Tooltip />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </GlassmorphicCard>

        <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Training ROI</h3>
            <div style={{ width: '100%', height: '300px', minHeight: '300px' }}>
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={300}>
                <ComposedChart data={trainingROI}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="investment" fill="#EC4899" radius={[8, 8, 0, 0]} name="Investment (RM '000)" />
                  <Line type="monotone" dataKey="productivity" stroke="#10B981" strokeWidth={3} name="Productivity Score" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </GlassmorphicCard>
      </div>
    </div>
  );

  const renderCompliance = () => (
    <div className="space-y-6">
      {/* Compliance Score Trend */}
      <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">🇲🇾 Malaysian Compliance Score Trend</h3>
          <div style={{ width: '100%', height: '250px', minHeight: '250px' }}>
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={250}>
              <AreaChart data={complianceTimeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" domain={[90, 100]} />
                <Tooltip />
                <Area type="monotone" dataKey="score" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </GlassmorphicCard>

      {/* Compliance Metrics */}
      <div className="grid grid-cols-1 gap-4">
        {complianceMetrics.map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Shield className="w-6 h-6 text-green-600" />
                      <div>
                        <h4 className="font-bold text-gray-900">{metric.category}</h4>
                        <span className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(metric.status)}`}>
                          {metric.status}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Compliance Score</p>
                        <p className="font-bold text-2xl text-green-600">{metric.score}%</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Last Audit</p>
                        <p className="font-semibold text-gray-900">{metric.lastAudit}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Next Review</p>
                        <p className="font-semibold text-gray-900">{metric.nextReview}</p>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4">
                    {metric.status === 'Compliant' ? (
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    ) : (
                      <AlertCircle className="w-8 h-8 text-orange-600" />
                    )}
                  </div>
                </div>
              </div>
            </GlassmorphicCard>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderAIInsights = () => (
    <div className="space-y-6">
      {/* AI Predictions */}
      <div className="grid grid-cols-1 gap-4">
        {aiPredictions.map((prediction, index) => {
          const Icon = prediction.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 ${prediction.bgColor} rounded-lg flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${prediction.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-bold text-gray-900">{prediction.type}</h4>
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full border border-purple-200">
                          AI Powered
                        </span>
                      </div>
                      <p className="text-gray-700 mb-3">{prediction.prediction}</p>
                      <div className="grid grid-cols-3 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-gray-500">Confidence</p>
                          <p className="font-bold text-purple-600">{prediction.confidence}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Impact</p>
                          <p className="font-bold text-gray-900">{prediction.impact}</p>
                        </div>
                      </div>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-sm text-blue-900">
                          <strong>💡 Recommendation:</strong> {prediction.recommendation}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassmorphicCard>
            </motion.div>
          );
        })}
      </div>

      {/* Sentiment Analysis */}
      <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Employee Sentiment Trend</h3>
          <div style={{ width: '100%', height: '300px', minHeight: '300px' }}>
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={300}>
              <AreaChart data={sentimentTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="positive" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} name="Positive" />
                <Area type="monotone" dataKey="neutral" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} name="Neutral" />
                <Area type="monotone" dataKey="negative" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} name="Negative" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </GlassmorphicCard>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 sm:p-6 lg:p-8">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-96 h-96 bg-blue-300/30 rounded-full blur-3xl"
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
                className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                Reports & Analytics
              </motion.h1>
              <p className="text-gray-600 mt-2">Comprehensive workforce insights and compliance reporting</p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
                className="px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="pdf">PDF</option>
                <option value="excel">Excel</option>
                <option value="csv">CSV</option>
              </select>
              <GlassButton variant="secondary" onClick={() => {}}>
                <Mail className="w-4 h-4 mr-2" />
                Email
              </GlassButton>
              <GlassButton variant="primary" onClick={() => {}}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </GlassButton>
            </div>
          </div>
        </SlideIn>

        {/* Key Metrics */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {keyMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <StaggerItem key={index}>
                <GlassmorphicCard
                  gradient={`${metric.gradient.replace('/80', '/10')} backdrop-blur-xl`}
                  animation="scale"
                  delay={index * 0.1}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">{metric.label}</p>
                        <motion.p
                          className="text-3xl font-bold text-gray-900"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.1 + 0.3, type: 'spring' }}
                        >
                          <AnimatedCounter value={metric.value} duration={2} />
                          {metric.suffix}
                        </motion.p>
                      </div>
                      <motion.div
                        className={`w-12 h-12 bg-gradient-to-br ${metric.gradient} rounded-xl flex items-center justify-center shadow-lg`}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </motion.div>
                    </div>
                    <p className="text-sm text-gray-600">{metric.change}</p>
                  </div>
                </GlassmorphicCard>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        {/* Report Category Navigation */}
        <SlideIn direction="down" delay={0.1}>
          <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
            <div className="p-2">
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'overview', name: 'Overview', icon: BarChart3 },
                  { id: 'workforce', name: 'Workforce', icon: Users },
                  { id: 'financial', name: 'Financial', icon: DollarSign },
                  { id: 'performance', name: 'Performance', icon: Target },
                  { id: 'compliance', name: 'Compliance', icon: Shield },
                  { id: 'ai-insights', name: 'AI Insights', icon: Brain },
                ].map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setReportCategory(category.id as ReportCategory)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${ 
                        reportCategory === category.id
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                          : 'bg-white/30 text-gray-700 hover:bg-white/50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{category.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </GlassmorphicCard>
        </SlideIn>

        {/* Filters */}
        <SlideIn direction="up" delay={0.2}>
          <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
            <div className="p-6">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Date Range:</span>
                </div>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                >
                  <option value="last-7-days">Last 7 Days</option>
                  <option value="last-30-days">Last 30 Days</option>
                  <option value="last-6-months">Last 6 Months</option>
                  <option value="last-12-months">Last 12 Months</option>
                  <option value="ytd">Year to Date</option>
                  <option value="custom">Custom Range</option>
                </select>
                <div className="flex-1" />
                <button className="flex items-center gap-2 px-4 py-2 bg-white/30 hover:bg-white/50 rounded-lg transition-all">
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </button>
              </div>
            </div>
          </GlassmorphicCard>
        </SlideIn>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={reportCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {reportCategory === 'overview' && renderOverview()}
            {reportCategory === 'workforce' && renderWorkforce()}
            {reportCategory === 'financial' && renderFinancial()}
            {reportCategory === 'performance' && renderPerformance()}
            {reportCategory === 'compliance' && renderCompliance()}
            {reportCategory === 'ai-insights' && renderAIInsights()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
