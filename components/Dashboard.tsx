import React from 'react';
import { 
  Users, 
  UserCheck, 
  Calendar, 
  TrendingUp, 
  AlertCircle, 
  Brain, 
  Sparkles, 
  Heart,
  DollarSign,
  Award,
  Clock,
  Target,
  TrendingDown
} from 'lucide-react';
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
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
} from 'recharts';

interface DashboardProps {
  onNavigate: (tab: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const stats = [
    { 
      label: 'Total Employees', 
      value: '247', 
      change: '+12%', 
      trend: 'up', 
      icon: Users,
      gradient: 'from-pink-400 to-pink-500',
      bg: 'bg-pink-50',
      text: 'text-pink-600',
      linkTo: 'employees'
    },
    { 
      label: 'Present Today', 
      value: '231', 
      change: '93.5%', 
      trend: 'up', 
      icon: UserCheck,
      gradient: 'from-purple-400 to-purple-500',
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      linkTo: 'attendance'
    },
    { 
      label: 'Leave Requests', 
      value: '18', 
      change: 'Pending', 
      trend: 'neutral', 
      icon: Calendar,
      gradient: 'from-violet-400 to-violet-500',
      bg: 'bg-violet-50',
      text: 'text-violet-600',
      linkTo: 'leave'
    },
    { 
      label: 'Turnover Rate', 
      value: '4.2%', 
      change: '-1.3%', 
      trend: 'down', 
      icon: TrendingUp,
      gradient: 'from-rose-400 to-rose-500',
      bg: 'bg-rose-50',
      text: 'text-rose-600',
      linkTo: 'reports'
    },
    { 
      label: 'Avg Salary', 
      value: 'RM 8,450', 
      change: '+5.2%', 
      trend: 'up', 
      icon: DollarSign,
      gradient: 'from-green-400 to-green-500',
      bg: 'bg-green-50',
      text: 'text-green-600',
      linkTo: 'payroll'
    },
    { 
      label: 'Training Hours', 
      value: '1,247', 
      change: '+18%', 
      trend: 'up', 
      icon: Award,
      gradient: 'from-blue-400 to-blue-500',
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      linkTo: 'learning'
    },
  ];

  // Attendance Trend Data
  const attendanceTrendData = [
    { month: 'Jan', attendance: 92, target: 95, leaves: 8 },
    { month: 'Feb', attendance: 94, target: 95, leaves: 6 },
    { month: 'Mar', attendance: 91, target: 95, leaves: 9 },
    { month: 'Apr', attendance: 95, target: 95, leaves: 5 },
    { month: 'May', attendance: 93, target: 95, leaves: 7 },
    { month: 'Jun', attendance: 94, target: 95, leaves: 6 },
  ];

  // Department Employee Distribution
  const departmentData = [
    { name: 'Engineering', value: 85 },
    { name: 'Sales', value: 62 },
    { name: 'Marketing', value: 38 },
    { name: 'Operations', value: 42 },
    { name: 'HR', value: 20 },
  ];

  // Headcount Growth
  const headcountGrowthData = [
    { month: 'Jan', employees: 215, newHires: 8, terminations: 3 },
    { month: 'Feb', employees: 220, newHires: 10, terminations: 5 },
    { month: 'Mar', employees: 228, newHires: 12, terminations: 4 },
    { month: 'Apr', employees: 235, newHires: 9, terminations: 2 },
    { month: 'May', employees: 241, newHires: 11, terminations: 5 },
    { month: 'Jun', employees: 247, newHires: 13, terminations: 7 },
  ];

  // Leave Type Distribution
  const leaveTypeData = [
    { name: 'Annual', value: 45 },
    { name: 'Medical', value: 28 },
    { name: 'Emergency', value: 15 },
    { name: 'Maternity', value: 8 },
    { name: 'Unpaid', value: 4 },
  ];

  // Performance Radar
  const performanceRadarData = [
    { skill: 'Productivity', current: 85, target: 90 },
    { skill: 'Quality', current: 88, target: 90 },
    { skill: 'Teamwork', current: 92, target: 90 },
    { skill: 'Innovation', current: 78, target: 85 },
    { skill: 'Leadership', current: 82, target: 90 },
    { skill: 'Communication', current: 86, target: 90 },
  ];

  // Department Performance
  const departmentPerformanceData = [
    { department: 'Engineering', performance: 92 },
    { department: 'Sales', performance: 88 },
    { department: 'Marketing', performance: 85 },
    { department: 'Operations', performance: 90 },
    { department: 'HR', performance: 87 },
    { department: 'Finance', performance: 89 },
  ];

  // Payroll Trends
  const payrollTrendData = [
    { month: 'Jan', salaries: 1850, benefits: 245, bonuses: 120 },
    { month: 'Feb', salaries: 1870, benefits: 250, bonuses: 95 },
    { month: 'Mar', salaries: 1920, benefits: 255, bonuses: 180 },
    { month: 'Apr', salaries: 1980, benefits: 260, bonuses: 110 },
    { month: 'May', salaries: 2030, benefits: 268, bonuses: 145 },
    { month: 'Jun', salaries: 2090, benefits: 275, bonuses: 165 },
  ];

  // Skills Progress
  const skillsProgressData = [
    { name: 'Technical Skills', value: 85, fill: '#8B5CF6' },
    { name: 'Leadership', value: 72, fill: '#EC4899' },
    { name: 'Communication', value: 88, fill: '#10B981' },
    { name: 'Problem Solving', value: 78, fill: '#F59E0B' },
  ];

  const COLORS = ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#3B82F6', '#EF4444'];
  const COLORS_GRADIENT = ['#EC4899', '#F472B6', '#FB7185', '#FDA4AF', '#FECDD3'];
  const COLORS_PRIMARY = ['#8B5CF6', '#A78BFA', '#C4B5FD', '#DDD6FE', '#EDE9FE'];

  const aiInsights = [
    {
      type: 'warning',
      title: 'High Leave Volume Detected',
      description: 'June shows 23% increase in leave requests. Consider workload review.',
      action: 'View Details',
      linkTo: 'leave',
      gradient: 'from-orange-100 to-pink-100',
      icon: AlertCircle,
      iconColor: 'text-orange-500'
    },
    {
      type: 'info',
      title: 'Recruitment Optimization',
      description: 'AI suggests focusing on engineering roles based on project pipeline.',
      action: 'See Recommendations',
      linkTo: 'talent',
      gradient: 'from-purple-100 to-violet-100',
      icon: Sparkles,
      iconColor: 'text-purple-500'
    },
    {
      type: 'success',
      title: 'Compliance Status',
      description: 'All Malaysian labor law requirements met for Q2 2024.',
      action: 'View Report',
      linkTo: 'compliance',
      gradient: 'from-green-100 to-emerald-100',
      icon: Heart,
      iconColor: 'text-green-500'
    },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border-2 border-purple-200 rounded-lg shadow-lg p-3">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              ></div>
              <span className="text-gray-600">{entry.name}:</span>
              <span className="font-semibold text-gray-900">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your HR overview for today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <button
              key={index}
              onClick={() => onNavigate(stat.linkTo)}
              className={`${stat.bg} border-2 border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:scale-105 transition-all text-left group`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                {stat.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : stat.trend === 'down' ? (
                  <TrendingDown className="w-4 h-4 text-green-600" />
                ) : (
                  <Clock className="w-4 h-4 text-gray-400" />
                )}
                <span className={`text-sm font-semibold ${
                  stat.trend === 'up' ? 'text-green-600' : 
                  stat.trend === 'down' ? 'text-green-600' : 
                  'text-gray-600'
                }`}>
                  {stat.change}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Headcount Growth Trend */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Headcount Growth</h3>
              <p className="text-sm text-gray-500">Employee growth over 6 months</p>
            </div>
            <Target className="w-6 h-6 text-purple-600" />
          </div>
          <div style={{ width: '100%', height: '300px', minHeight: '300px' }}>
            <ResponsiveContainer width="100%" height="100%" minHeight={300}>
              <ComposedChart data={headcountGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="newHires" name="New Hires" fill="#10B981" radius={[8, 8, 0, 0]} />
                <Bar dataKey="terminations" name="Terminations" fill="#EF4444" radius={[8, 8, 0, 0]} />
                <Line type="monotone" dataKey="employees" name="Total Employees" stroke="#8B5CF6" strokeWidth={3} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Distribution */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Department Distribution</h3>
              <p className="text-sm text-gray-500">Employee count by department</p>
            </div>
            <Users className="w-6 h-6 text-pink-600" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={departmentData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                label={(entry) => `${entry.name}: ${entry.value}`}
              >
                {departmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS_GRADIENT[index % COLORS_GRADIENT.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Main Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Trend */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Attendance Trends</h3>
              <p className="text-sm text-gray-500">Monthly attendance vs target</p>
            </div>
            <UserCheck className="w-6 h-6 text-purple-600" />
          </div>
          <div style={{ width: '100%', height: '300px', minHeight: '300px' }}>
            <ResponsiveContainer width="100%" height="100%" minHeight={300}>
              <LineChart data={attendanceTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="attendance" name="Attendance %" stroke="#8B5CF6" strokeWidth={3} dot={{ fill: '#8B5CF6', r: 4 }} />
                <Line type="monotone" dataKey="target" name="Target" stroke="#10B981" strokeWidth={3} dot={{ fill: '#10B981', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payroll Overview */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Payroll Trends</h3>
              <p className="text-sm text-gray-500">Salaries, benefits & bonuses (RM 1000s)</p>
            </div>
            <DollarSign className="w-6 h-6 text-green-600" />
          </div>
          <div style={{ width: '100%', height: '300px', minHeight: '300px' }}>
            <ResponsiveContainer width="100%" height="100%" minHeight={300}>
              <AreaChart data={payrollTrendData}>
                <defs>
                  <linearGradient id="colorSalaries" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorBenefits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorBonuses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area type="monotone" dataKey="salaries" stackId="1" name="Salaries" stroke="#8B5CF6" fill="url(#colorSalaries)" />
                <Area type="monotone" dataKey="benefits" stackId="1" name="Benefits" stroke="#10B981" fill="url(#colorBenefits)" />
                <Area type="monotone" dataKey="bonuses" stackId="1" name="Bonuses" stroke="#F59E0B" fill="url(#colorBonuses)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Main Charts Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leave Distribution */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Leave Types</h3>
              <p className="text-sm text-gray-500">Distribution by category</p>
            </div>
            <Calendar className="w-6 h-6 text-violet-600" />
          </div>
          <ResponsiveContainer width="100%" height={250} minHeight={250}>
            <PieChart>
              <Pie
                data={leaveTypeData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                label={(entry) => `${entry.name}: ${entry.value}%`}
              >
                {leaveTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS_PRIMARY[index % COLORS_PRIMARY.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Department Performance */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Dept Performance</h3>
              <p className="text-sm text-gray-500">Performance scores</p>
            </div>
            <Award className="w-6 h-6 text-blue-600" />
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={departmentPerformanceData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis type="number" stroke="#6B7280" />
              <YAxis dataKey="department" type="category" stroke="#6B7280" width={100} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="performance" fill="#8B5CF6" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Skills Progress */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Skills Progress</h3>
              <p className="text-sm text-gray-500">Current proficiency levels</p>
            </div>
            <Brain className="w-6 h-6 text-pink-600" />
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <RadialBarChart
              innerRadius="10%"
              outerRadius="90%"
              data={skillsProgressData}
              startAngle={90}
              endAngle={-270}
            >
              <PolarGrid gridType="circle" stroke="#E5E7EB" />
              <RadialBar
                minAngle={15}
                background
                clockWise
                dataKey="value"
                cornerRadius={10}
              />
              <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
              <Tooltip content={<CustomTooltip />} />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Performance Radar */}
      <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Performance Metrics</h3>
            <p className="text-sm text-gray-500">Current vs target performance across key areas</p>
          </div>
          <Target className="w-6 h-6 text-purple-600" />
        </div>
        <div style={{ width: '100%', height: '350px', minHeight: '350px' }}>
          <ResponsiveContainer width="100%" height="100%" minHeight={350}>
            <RadarChart data={performanceRadarData}>
              <PolarGrid stroke="#E5E7EB" />
              <PolarAngleAxis dataKey="skill" stroke="#6B7280" />
              <PolarRadiusAxis stroke="#6B7280" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Radar name="Current" dataKey="current" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} />
              <Radar name="Target" dataKey="target" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Insights */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Brain className="w-6 h-6 text-purple-600" />
          <h2 className="text-xl font-bold text-gray-900">AI-Powered Insights</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {aiInsights.map((insight, index) => {
            const Icon = insight.icon;
            return (
              <button
                key={index}
                onClick={() => onNavigate(insight.linkTo)}
                className={`bg-gradient-to-br ${insight.gradient} border-2 border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:scale-105 transition-all text-left group`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Icon className={`w-6 h-6 ${insight.iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-2">{insight.title}</h3>
                    <p className="text-sm text-gray-600">{insight.description}</p>
                  </div>
                </div>
                <div className="flex items-center justify-end text-sm font-semibold text-purple-600 group-hover:text-purple-700">
                  {insight.action} →
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}