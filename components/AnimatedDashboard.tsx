import React from 'react';
import { motion } from 'motion/react';
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
  TrendingDown,
  ArrowUpRight,
  Activity,
  Zap
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
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  GlassmorphicCard,
  AnimatedCounter,
  FloatingElement,
  StaggerContainer,
  StaggerItem,
  SlideIn,
  GlassButton,
} from './GlassmorphicCard';

interface AnimatedDashboardProps {
  onNavigate: (tab: string) => void;
}

export function AnimatedDashboard({ onNavigate }: AnimatedDashboardProps) {
  const stats = [
    { 
      label: 'Total Employees', 
      value: 247, 
      change: '+12%', 
      trend: 'up', 
      icon: Users,
      gradient: 'from-pink-500/80 to-rose-500/80',
      linkTo: 'employees'
    },
    { 
      label: 'Present Today', 
      value: 231, 
      change: '93.5%', 
      trend: 'up', 
      icon: UserCheck,
      gradient: 'from-purple-500/80 to-violet-500/80',
      linkTo: 'attendance'
    },
    { 
      label: 'Leave Requests', 
      value: 18, 
      change: 'Pending', 
      trend: 'neutral', 
      icon: Calendar,
      gradient: 'from-blue-500/80 to-cyan-500/80',
      linkTo: 'leave'
    },
    { 
      label: 'Turnover Rate', 
      value: 4.2, 
      change: '-1.3%', 
      trend: 'down', 
      icon: TrendingDown,
      gradient: 'from-green-500/80 to-emerald-500/80',
      linkTo: 'reports',
      suffix: '%'
    },
    { 
      label: 'Avg Salary', 
      value: 8450, 
      change: '+5.2%', 
      trend: 'up', 
      icon: DollarSign,
      gradient: 'from-amber-500/80 to-orange-500/80',
      linkTo: 'payroll',
      prefix: 'RM '
    },
    { 
      label: 'Training Hours', 
      value: 1247, 
      change: '+18%', 
      trend: 'up', 
      icon: Award,
      gradient: 'from-indigo-500/80 to-purple-500/80',
      linkTo: 'learning'
    },
  ];

  const attendanceData = [
    { month: 'Jan', attendance: 92, target: 95 },
    { month: 'Feb', attendance: 94, target: 95 },
    { month: 'Mar', attendance: 91, target: 95 },
    { month: 'Apr', attendance: 95, target: 95 },
    { month: 'May', attendance: 93, target: 95 },
    { month: 'Jun', attendance: 94, target: 95 },
  ];

  const departmentData = [
    { name: 'Engineering', value: 85 },
    { name: 'Sales', value: 62 },
    { name: 'Marketing', value: 38 },
    { name: 'Operations', value: 42 },
    { name: 'HR', value: 20 },
  ];

  const headcountData = [
    { month: 'Jan', employees: 215, newHires: 8, terminations: 3 },
    { month: 'Feb', employees: 220, newHires: 10, terminations: 5 },
    { month: 'Mar', employees: 228, newHires: 12, terminations: 4 },
    { month: 'Apr', employees: 235, newHires: 9, terminations: 2 },
    { month: 'May', employees: 241, newHires: 11, terminations: 5 },
    { month: 'Jun', employees: 247, newHires: 13, terminations: 7 },
  ];

  const COLORS = ['#EC4899', '#A855F7', '#3B82F6', '#10B981', '#F59E0B'];

  const aiInsights = [
    {
      title: 'High Leave Volume',
      description: 'June shows 23% increase in leave requests.',
      action: 'View Details',
      linkTo: 'leave',
      gradient: 'from-orange-500/20 to-pink-500/20',
      icon: AlertCircle,
      iconColor: 'text-orange-500'
    },
    {
      title: 'Recruitment Optimization',
      description: 'Focus on engineering roles based on pipeline.',
      action: 'See Recommendations',
      linkTo: 'talent',
      gradient: 'from-purple-500/20 to-violet-500/20',
      icon: Sparkles,
      iconColor: 'text-purple-500'
    },
    {
      title: 'Compliance Status',
      description: 'All Malaysian labor law requirements met.',
      action: 'View Report',
      linkTo: 'compliance',
      gradient: 'from-green-500/20 to-emerald-500/20',
      icon: Heart,
      iconColor: 'text-green-500'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-purple-300/30 rounded-full blur-3xl"
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
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-pink-300/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-80 h-80 bg-blue-300/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 space-y-6">
        {/* Header */}
        <SlideIn direction="down">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <motion.h1 
                className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                Dashboard
              </motion.h1>
              <motion.p 
                className="text-gray-600 mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Welcome back! Here's your HR overview for today.
              </motion.p>
            </div>
            <GlassButton variant="primary" size="lg">
              <Activity className="w-5 h-5 inline mr-2" />
              Generate Report
            </GlassButton>
          </div>
        </SlideIn>

        {/* Stats Grid */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <StaggerItem key={index}>
                <GlassmorphicCard
                  gradient={`${stat.gradient.replace('/80', '/10')} backdrop-blur-xl`}
                  animation="scale"
                  delay={index * 0.1}
                  onClick={() => onNavigate(stat.linkTo)}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 mb-2">{stat.label}</p>
                        <motion.div
                          className="text-3xl sm:text-4xl font-bold text-gray-900"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ 
                            type: 'spring', 
                            stiffness: 200, 
                            delay: index * 0.1 + 0.3 
                          }}
                        >
                          {typeof stat.value === 'number' ? (
                            <AnimatedCounter
                              value={stat.value}
                              duration={2}
                              prefix={stat.prefix}
                              suffix={stat.suffix}
                            />
                          ) : (
                            stat.value
                          )}
                        </motion.div>
                      </div>
                      <FloatingElement delay={index * 0.2}>
                        <motion.div
                          className={`w-14 h-14 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg`}
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.5 }}
                        >
                          <Icon className="w-7 h-7 text-white" />
                        </motion.div>
                      </FloatingElement>
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
                        stat.trend === 'up' || stat.trend === 'down' 
                          ? 'text-green-600' 
                          : 'text-gray-600'
                      }`}>
                        {stat.change}
                      </span>
                      <ArrowUpRight className="w-4 h-4 text-gray-400 ml-auto" />
                    </div>
                  </div>
                </GlassmorphicCard>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Headcount Growth */}
          <SlideIn direction="left" delay={0.2}>
            <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Headcount Growth</h3>
                    <p className="text-sm text-gray-500">Employee growth over 6 months</p>
                  </div>
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  >
                    <Target className="w-6 h-6 text-purple-600" />
                  </motion.div>
                </div>
                <div style={{ width: '100%', height: '320px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={headcountData}>
                      <defs>
                        <linearGradient id="colorEmployees" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="month" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(139, 92, 246, 0.2)',
                          borderRadius: '12px',
                        }}
                      />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="employees" 
                        stroke="#8B5CF6" 
                        fill="url(#colorEmployees)"
                        strokeWidth={3}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </GlassmorphicCard>
          </SlideIn>

          {/* Department Distribution */}
          <SlideIn direction="right" delay={0.2}>
            <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Department Distribution</h3>
                    <p className="text-sm text-gray-500">Employee count by department</p>
                  </div>
                  <Users className="w-6 h-6 text-pink-600" />
                </div>
                <div style={{ width: '100%', height: '320px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={departmentData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        label={(entry) => `${entry.name}: ${entry.value}`}
                      >
                        {departmentData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(236, 72, 153, 0.2)',
                          borderRadius: '12px',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </GlassmorphicCard>
          </SlideIn>
        </div>

        {/* Attendance Trend */}
        <SlideIn direction="up" delay={0.4}>
          <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Attendance Trends</h3>
                  <p className="text-sm text-gray-500">Monthly attendance vs target</p>
                </div>
                <UserCheck className="w-6 h-6 text-purple-600" />
              </div>
              <div style={{ width: '100%', height: '320px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={attendanceData}>
                    <defs>
                      <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="month" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(139, 92, 246, 0.2)',
                        borderRadius: '12px',
                      }}
                    />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="attendance" 
                      stroke="#8B5CF6" 
                      fill="url(#colorAttendance)"
                      strokeWidth={3}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="target" 
                      stroke="#10B981" 
                      fill="url(#colorTarget)"
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </GlassmorphicCard>
        </SlideIn>

        {/* AI Insights */}
        <div className="space-y-4">
          <SlideIn direction="up" delay={0.5}>
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              >
                <Brain className="w-8 h-8 text-purple-600" />
              </motion.div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                AI-Powered Insights
              </h2>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Zap className="w-6 h-6 text-amber-500" />
              </motion.div>
            </div>
          </SlideIn>

          <StaggerContainer className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {aiInsights.map((insight, index) => {
              const Icon = insight.icon;
              return (
                <StaggerItem key={index}>
                  <GlassmorphicCard
                    gradient={`${insight.gradient} backdrop-blur-xl`}
                    animation="scale"
                    delay={0.6 + index * 0.1}
                    onClick={() => onNavigate(insight.linkTo)}
                  >
                    <div className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <motion.div 
                          className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg"
                          whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                          transition={{ duration: 0.5 }}
                        >
                          <Icon className={`w-6 h-6 ${insight.iconColor}`} />
                        </motion.div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 mb-2">{insight.title}</h3>
                          <p className="text-sm text-gray-600">{insight.description}</p>
                        </div>
                      </div>
                      <motion.div 
                        className="flex items-center justify-end text-sm font-semibold text-purple-600 group cursor-pointer"
                        whileHover={{ x: 5 }}
                      >
                        {insight.action}
                        <ArrowUpRight className="w-4 h-4 ml-1" />
                      </motion.div>
                    </div>
                  </GlassmorphicCard>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </div>
    </div>
  );
}
