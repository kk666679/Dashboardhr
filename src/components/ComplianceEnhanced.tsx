import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  FileCheck, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Shield, 
  BookOpen,
  Bell,
  Calendar,
  Download,
  Eye,
  TrendingUp,
  AlertCircle,
  FileText,
  Plus
} from 'lucide-react';
import {
  GlassmorphicCard,
  StaggerContainer,
  StaggerItem,
  SlideIn,
  GlassButton,
  AnimatedCounter,
} from './GlassmorphicCard';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
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

interface ComplianceItem {
  name: string;
  status: 'compliant' | 'warning' | 'critical';
  description: string;
}

interface ComplianceCategory {
  category: string;
  status: 'compliant' | 'warning' | 'critical';
  items: ComplianceItem[];
}

export function ComplianceEnhanced() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const complianceCategories: ComplianceCategory[] = [
    {
      category: 'Employment Act 1955',
      status: 'compliant',
      items: [
        { name: 'Working Hours', status: 'compliant', description: 'Max 48 hours/week' },
        { name: 'Overtime Calculation', status: 'compliant', description: '1.5x rate applied' },
        { name: 'Rest Days', status: 'compliant', description: 'Minimum 1 day/week' },
        { name: 'Public Holidays', status: 'compliant', description: '11 gazetted holidays' },
      ]
    },
    {
      category: 'Leave Entitlements',
      status: 'compliant',
      items: [
        { name: 'Annual Leave', status: 'compliant', description: '8-16 days based on tenure' },
        { name: 'Sick Leave', status: 'compliant', description: '14-22 days provision' },
        { name: 'Maternity Leave', status: 'compliant', description: '98 consecutive days' },
        { name: 'Paternity Leave', status: 'compliant', description: '7 consecutive days' },
      ]
    },
    {
      category: 'Statutory Contributions',
      status: 'warning',
      items: [
        { name: 'EPF Contributions', status: 'compliant', description: 'Employee 11%, Employer 12%' },
        { name: 'SOCSO Registration', status: 'compliant', description: 'All employees covered' },
        { name: 'EIS Contributions', status: 'warning', description: 'Pending submission for 2 employees' },
        { name: 'PCB Deductions', status: 'compliant', description: 'Monthly tax deductions' },
      ]
    },
    {
      category: 'Workplace Safety (OSHA)',
      status: 'compliant',
      items: [
        { name: 'OSHA Compliance', status: 'compliant', description: 'Safety regulations met' },
        { name: 'JKKP Registration', status: 'compliant', description: 'Committee established' },
        { name: 'Safety Training', status: 'compliant', description: 'Annual training completed' },
        { name: 'First Aid Facilities', status: 'compliant', description: 'Equipment available' },
      ]
    },
  ];

  const upcomingDeadlines = [
    { task: 'EPF Monthly Remittance', date: '2024-07-15', priority: 'high', daysLeft: 5 },
    { task: 'SOCSO Contribution Filing', date: '2024-07-15', priority: 'high', daysLeft: 5 },
    { task: 'EIS Monthly Filing', date: '2024-07-15', priority: 'high', daysLeft: 5 },
    { task: 'PCB Monthly Submission', date: '2024-07-10', priority: 'medium', daysLeft: 2 },
    { task: 'Quarterly Safety Report', date: '2024-07-30', priority: 'medium', daysLeft: 20 },
  ];

  const totalItems = complianceCategories.reduce((sum, cat) => sum + cat.items.length, 0);
  const compliantItems = complianceCategories.reduce(
    (sum, cat) => sum + cat.items.filter(item => item.status === 'compliant').length, 
    0
  );
  const warningItems = complianceCategories.reduce(
    (sum, cat) => sum + cat.items.filter(item => item.status === 'warning').length, 
    0
  );
  const criticalItems = complianceCategories.reduce(
    (sum, cat) => sum + cat.items.filter(item => item.status === 'critical').length, 
    0
  );

  const stats = [
    {
      label: 'Compliance Rate',
      value: Math.round((compliantItems / totalItems) * 100),
      suffix: '%',
      change: '+2.5%',
      icon: Shield,
      gradient: 'from-green-500/80 to-emerald-500/80',
    },
    {
      label: 'Items Compliant',
      value: compliantItems,
      suffix: ` / ${totalItems}`,
      change: 'Total Items',
      icon: CheckCircle,
      gradient: 'from-blue-500/80 to-cyan-500/80',
    },
    {
      label: 'Warnings',
      value: warningItems,
      change: 'Need Attention',
      icon: AlertTriangle,
      gradient: 'from-orange-500/80 to-amber-500/80',
    },
    {
      label: 'Upcoming Deadlines',
      value: upcomingDeadlines.filter(d => d.daysLeft <= 7).length,
      change: 'Next 7 Days',
      icon: Clock,
      gradient: 'from-purple-500/80 to-violet-500/80',
    },
  ];

  const complianceOverviewData = [
    { name: 'Compliant', value: compliantItems },
    { name: 'Warning', value: warningItems },
    { name: 'Critical', value: criticalItems },
  ];

  const categoryScoresData = complianceCategories.map(cat => ({
    category: cat.category.split(' ')[0],
    score: Math.round((cat.items.filter(i => i.status === 'compliant').length / cat.items.length) * 100)
  }));

  const monthlyComplianceData = [
    { month: 'Jan', rate: 92 },
    { month: 'Feb', rate: 94 },
    { month: 'Mar', rate: 93 },
    { month: 'Apr', rate: 95 },
    { month: 'May', rate: 94 },
    { month: 'Jun', rate: Math.round((compliantItems / totalItems) * 100) },
  ];

  const COLORS = ['#10B981', '#F59E0B', '#EF4444'];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'critical':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'warning':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'critical':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'low':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6 lg:p-8">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-96 h-96 bg-indigo-300/30 rounded-full blur-3xl"
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
                className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                Compliance Center
              </motion.h1>
              <p className="text-gray-600 mt-2">Monitor Malaysian employment law compliance</p>
            </div>
            <div className="flex items-center gap-2">
              <GlassButton variant="secondary" onClick={() => {}}>
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </GlassButton>
              <GlassButton variant="primary" onClick={() => {}}>
                <Bell className="w-4 h-4 mr-2" />
                Set Reminder
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

        {/* Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SlideIn direction="left" delay={0.2}>
            <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Compliance Overview</h3>
                <div style={{ width: '100%', height: '250px', minHeight: '250px' }}>
                  <ResponsiveContainer width="100%" height="100%" minHeight={250}>
                    <PieChart>
                      <Pie
                        data={complianceOverviewData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {complianceOverviewData.map((entry, index) => (
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

          <SlideIn direction="right" delay={0.2}>
            <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Category Scores</h3>
                <div style={{ width: '100%', height: '250px', minHeight: '250px' }}>
                  <ResponsiveContainer width="100%" height="100%" minHeight={250}>
                    <RadarChart data={categoryScoresData}>
                      <PolarGrid stroke="#E5E7EB" />
                      <PolarAngleAxis dataKey="category" stroke="#6B7280" />
                      <PolarRadiusAxis stroke="#6B7280" />
                      <Radar 
                        name="Compliance Score" 
                        dataKey="score" 
                        stroke="#3B82F6" 
                        fill="#3B82F6" 
                        fillOpacity={0.6} 
                      />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </GlassmorphicCard>
          </SlideIn>
        </div>

        {/* Compliance Categories */}
        <SlideIn direction="up" delay={0.3}>
          <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Compliance Categories</h3>
              <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {complianceCategories.map((category, index) => (
                  <StaggerItem key={index}>
                    <div className="bg-white/50 backdrop-blur-sm rounded-xl p-5 border border-white/20 hover:border-blue-300 transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{category.category}</h4>
                          <p className="text-xs text-gray-600 mt-1">
                            {category.items.filter(i => i.status === 'compliant').length} / {category.items.length} compliant
                          </p>
                        </div>
                        {getStatusIcon(category.status)}
                      </div>
                      <div className="space-y-2">
                        {category.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(item.status)}
                              <span className="text-gray-700">{item.name}</span>
                            </div>
                            <span className="text-xs text-gray-500">{item.description}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </GlassmorphicCard>
        </SlideIn>

        {/* Upcoming Deadlines */}
        <SlideIn direction="up" delay={0.4}>
          <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Upcoming Deadlines</h3>
              <div className="space-y-3">
                {upcomingDeadlines.map((deadline, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center justify-between p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20 hover:border-blue-300 transition-all"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{deadline.task}</p>
                        <p className="text-sm text-gray-600">{deadline.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">{deadline.daysLeft} days left</p>
                        <span className={`px-3 py-1 rounded-full text-xs border ${getPriorityColor(deadline.priority)}`}>
                          {deadline.priority.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </GlassmorphicCard>
        </SlideIn>

        {/* Malaysian Labor Law Reference */}
        <SlideIn direction="up" delay={0.5}>
          <GlassmorphicCard gradient="from-blue-500/10 to-indigo-500/10" blur="xl">
            <div className="p-6">
              <div className="flex items-start gap-3 mb-4">
                <BookOpen className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">Malaysian Labor Law Reference</h4>
                  <p className="text-sm text-blue-700">Key regulations and compliance requirements</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-900 mb-2">Employment Act 1955</p>
                  <p className="text-xs text-gray-600">Working hours, overtime, rest days, and termination</p>
                </div>
                <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-900 mb-2">OSHA 1994</p>
                  <p className="text-xs text-gray-600">Workplace safety and health standards</p>
                </div>
                <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-900 mb-2">Minimum Wages Order</p>
                  <p className="text-xs text-gray-600">RM 1,500/month effective May 2024</p>
                </div>
              </div>
            </div>
          </GlassmorphicCard>
        </SlideIn>
      </div>
    </div>
  );
}
