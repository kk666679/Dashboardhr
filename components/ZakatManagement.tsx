import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import {
  Moon,
  DollarSign,
  TrendingUp,
  CheckCircle,
  Calendar,
  MapPin,
  Users,
  Building2,
  FileText,
  Download,
  Eye,
  Edit,
  Plus,
  Search,
  BarChart3,
  Activity,
  Brain,
  AlertCircle,
  Shield,
  Heart,
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
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

type ViewMode = 'dashboard' | 'employees' | 'payments' | 'reports' | 'tabunghaji';

interface ZakatRecord {
  employeeId: string;
  name: string;
  month: string;
  zakatableIncome: number;
  zakatRate: number;
  zakatAmount: number;
  state: string;
  institution: string;
  status: 'Paid' | 'Pending' | 'Calculated' | 'Failed';
  paidDate: string | null;
  receiptNo: string | null;
}

export function ZakatManagement() {
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const zakatRecords: ZakatRecord[] = [
    {
      employeeId: 'EMP-001',
      name: 'Ahmad Fauzi bin Hassan',
      month: 'December 2024',
      zakatableIncome: 8500,
      zakatRate: 2.5,
      zakatAmount: 212.50,
      state: 'Selangor',
      institution: 'Lembaga Zakat Selangor',
      status: 'Paid',
      paidDate: '2024-12-15',
      receiptNo: 'ZS2024-12-1234',
    },
    {
      employeeId: 'EMP-002',
      name: 'Nurul Izzah binti Abdullah',
      month: 'December 2024',
      zakatableIncome: 6200,
      zakatRate: 2.5,
      zakatAmount: 155.00,
      state: 'Kuala Lumpur',
      institution: 'Pusat Pungutan Zakat MAIWP',
      status: 'Pending',
      paidDate: null,
      receiptNo: null,
    },
    {
      employeeId: 'EMP-003',
      name: 'Muhammad Syafiq bin Ibrahim',
      month: 'December 2024',
      zakatableIncome: 12000,
      zakatRate: 2.5,
      zakatAmount: 300.00,
      state: 'Penang',
      institution: 'Majlis Agama Islam Negeri Pulau Pinang',
      status: 'Calculated',
      paidDate: null,
      receiptNo: null,
    },
    {
      employeeId: 'EMP-004',
      name: 'Fatimah binti Yusof',
      month: 'December 2024',
      zakatableIncome: 7800,
      zakatRate: 2.5,
      zakatAmount: 195.00,
      state: 'Johor',
      institution: 'Majlis Agama Islam Negeri Johor',
      status: 'Paid',
      paidDate: '2024-12-10',
      receiptNo: 'ZJ2024-12-5678',
    },
  ];

  const totalEmployees = 89;
  const monthlyZakat = zakatRecords.reduce((sum, r) => sum + r.zakatAmount, 0);
  const paidRecords = zakatRecords.filter(r => r.status === 'Paid').length;
  const complianceRate = Math.round((paidRecords / zakatRecords.length) * 100);

  const stats = [
    {
      label: 'Zakat Employees',
      value: totalEmployees,
      change: '+5 this month',
      icon: Users,
      gradient: 'from-purple-500/80 to-violet-500/80',
    },
    {
      label: 'Monthly Zakat',
      value: Math.round(monthlyZakat * 89 / zakatRecords.length),
      prefix: 'RM ',
      change: '+8% vs last month',
      icon: DollarSign,
      gradient: 'from-green-500/80 to-emerald-500/80',
    },
    {
      label: 'Compliance Rate',
      value: complianceRate,
      suffix: '%',
      change: '+2% improvement',
      icon: CheckCircle,
      gradient: 'from-blue-500/80 to-cyan-500/80',
    },
    {
      label: 'Tabung Haji',
      value: 12,
      change: 'Active contributors',
      icon: Heart,
      gradient: 'from-pink-500/80 to-rose-500/80',
    },
  ];

  const stateDistributionData = [
    { name: 'Selangor', value: 32 },
    { name: 'Kuala Lumpur', value: 28 },
    { name: 'Penang', value: 15 },
    { name: 'Johor', value: 10 },
    { name: 'Others', value: 4 },
  ];

  const monthlyTrendData = [
    { month: 'Jul', amount: 16200 },
    { month: 'Aug', amount: 17100 },
    { month: 'Sep', amount: 16800 },
    { month: 'Oct', amount: 17900 },
    { month: 'Nov', amount: 18200 },
    { month: 'Dec', amount: 18450 },
  ];

  const institutionData = [
    { name: 'Lembaga Zakat Selangor', employees: 32 },
    { name: 'Pusat Pungutan Zakat MAIWP', employees: 28 },
    { name: 'MAIN Penang', employees: 15 },
    { name: 'MAIN Johor', employees: 10 },
  ];

  const COLORS = ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#3B82F6', '#EF4444'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Pending':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Calculated':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Failed':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const filteredRecords = zakatRecords.filter(record => {
    const matchesSearch = record.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || record.status === selectedStatus;
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
                        {stat.prefix}
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

      {/* Islamic Finance Banner */}
      <SlideIn direction="up" delay={0.2}>
        <GlassmorphicCard gradient="from-purple-500/10 to-violet-500/10" blur="xl">
          <div className="p-6">
            <div className="flex items-start gap-3 mb-4">
              <Moon className="w-6 h-6 text-purple-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-purple-900 mb-1">Islamic Finance Compliance</h4>
                <p className="text-sm text-purple-700 mb-3">
                  Automated Zakat calculation following Malaysian Islamic Religious Council guidelines. Fully compliant with state-specific regulations.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full border border-purple-200">
                    Shariah Compliant ✓
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full border border-purple-200">
                    2.5% Nisab Rate ✓
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full border border-purple-200">
                    State Integration ✓
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
              <h3 className="text-lg font-bold text-gray-900 mb-4">State Distribution</h3>
              <div style={{ width: '100%', height: '250px', minHeight: '250px' }}>
                <ResponsiveContainer width="100%" height="100%" minHeight={250}>
                  <PieChart>
                    <Pie
                      data={stateDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {stateDistributionData.map((entry, index) => (
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
              <h3 className="text-lg font-bold text-gray-900 mb-4">Monthly Zakat Trend</h3>
              <div style={{ width: '100%', height: '250px', minHeight: '250px' }}>
                <ResponsiveContainer width="100%" height="100%" minHeight={250}>
                  <AreaChart data={monthlyTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="month" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip />
                    <Area type="monotone" dataKey="amount" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </GlassmorphicCard>
        </SlideIn>

        <SlideIn direction="left" delay={0.4}>
          <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Zakat Institutions</h3>
              <div style={{ width: '100%', height: '250px', minHeight: '250px' }}>
                <ResponsiveContainer width="100%" height="100%" minHeight={250}>
                  <BarChart data={institutionData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis type="number" stroke="#6B7280" />
                    <YAxis type="category" dataKey="name" stroke="#6B7280" width={150} />
                    <Tooltip />
                    <Bar dataKey="employees" fill="#8B5CF6" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </GlassmorphicCard>
        </SlideIn>

        <SlideIn direction="right" delay={0.4}>
          <GlassmorphicCard gradient="from-pink-500/10 to-rose-500/10" blur="xl">
            <div className="p-6">
              <div className="flex items-start gap-3 mb-4">
                <Heart className="w-6 h-6 text-pink-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-pink-900 mb-1">Tabung Haji Integration</h4>
                  <p className="text-sm text-pink-700 mb-3">
                    Seamless integration with Tabung Haji for Hajj savings
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-white/50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-700">Active Contributors</span>
                    <span className="text-xl font-bold text-pink-600">12</span>
                  </div>
                </div>
                <div className="bg-white/50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-700">Monthly Contribution</span>
                    <span className="text-xl font-bold text-pink-600">RM 3,600</span>
                  </div>
                </div>
                <div className="bg-white/50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-700">Total Savings</span>
                    <span className="text-xl font-bold text-pink-600">RM 86,400</span>
                  </div>
                </div>
              </div>
            </div>
          </GlassmorphicCard>
        </SlideIn>
      </div>
    </div>
  );

  const renderEmployees = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">Zakat Records</h3>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <GlassInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search employees..."
            icon={<Search className="w-5 h-5" />}
          />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          >
            <option value="all">All Status</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Calculated">Calculated</option>
          </select>
          <GlassButton variant="primary" onClick={() => {}}>
            <Plus className="w-4 h-4 mr-2" />
            Calculate Zakat
          </GlassButton>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredRecords.map((record, index) => (
          <motion.div
            key={record.employeeId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-bold text-gray-900">{record.name}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(record.status)}`}>
                        {record.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{record.employeeId} • {record.month}</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm mb-3">
                      <div>
                        <p className="text-gray-500">Zakatable Income</p>
                        <p className="font-semibold text-gray-900">RM {record.zakatableIncome.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Zakat Rate</p>
                        <p className="font-semibold text-gray-900">{record.zakatRate}%</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Zakat Amount</p>
                        <p className="font-semibold text-purple-600">RM {record.zakatAmount.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">State</p>
                        <p className="font-semibold text-gray-900">{record.state}</p>
                      </div>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <Building2 className="w-4 h-4 text-purple-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-purple-900 mb-1">{record.institution}</p>
                          {record.receiptNo && (
                            <p className="text-xs text-purple-700">Receipt: {record.receiptNo} • Paid: {record.paidDate}</p>
                          )}
                          {!record.receiptNo && record.status === 'Pending' && (
                            <p className="text-xs text-purple-700">Awaiting payment processing</p>
                          )}
                          {!record.receiptNo && record.status === 'Calculated' && (
                            <p className="text-xs text-purple-700">Ready for payment</p>
                          )}
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

  const renderTabungHaji = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900">Tabung Haji Management</h3>

      <SlideIn direction="up">
        <GlassmorphicCard gradient="from-pink-500/10 to-rose-500/10" blur="xl">
          <div className="p-6">
            <div className="flex items-start gap-3 mb-4">
              <Heart className="w-6 h-6 text-pink-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-pink-900 mb-1">Tabung Haji Integration</h4>
                <p className="text-sm text-pink-700 mb-3">
                  Automated monthly contributions to Lembaga Tabung Haji for Hajj savings
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white/50 rounded-lg p-4 text-center">
                <Users className="w-8 h-8 text-pink-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-pink-600">12</p>
                <p className="text-sm text-gray-600">Contributors</p>
              </div>
              <div className="bg-white/50 rounded-lg p-4 text-center">
                <DollarSign className="w-8 h-8 text-pink-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-pink-600">RM 3,600</p>
                <p className="text-sm text-gray-600">Monthly</p>
              </div>
              <div className="bg-white/50 rounded-lg p-4 text-center">
                <TrendingUp className="w-8 h-8 text-pink-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-pink-600">RM 86,400</p>
                <p className="text-sm text-gray-600">Total Savings</p>
              </div>
            </div>
          </div>
        </GlassmorphicCard>
      </SlideIn>

      <div className="grid grid-cols-1 gap-4">
        {[
          { name: 'Siti Aminah binti Razak', contribution: 300, savings: 7200, years: 2 },
          { name: 'Mohd Hafiz bin Yusof', contribution: 250, savings: 6000, years: 2 },
          { name: 'Noor Azlina binti Hassan', contribution: 350, savings: 8400, years: 2 },
        ].map((contributor, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-900 mb-3">{contributor.name}</h4>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Monthly</p>
                        <p className="font-semibold text-gray-900">RM {contributor.contribution}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Total Savings</p>
                        <p className="font-semibold text-pink-600">RM {contributor.savings.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Duration</p>
                        <p className="font-semibold text-gray-900">{contributor.years} years</p>
                      </div>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-white/50 rounded-lg transition-colors">
                    <Eye className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </GlassmorphicCard>
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-pink-50 p-4 sm:p-6 lg:p-8">
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
                className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                Zakat Management
              </motion.h1>
              <p className="text-gray-600 mt-2">Islamic finance compliance & Tabung Haji integration</p>
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
                  { id: 'employees', name: 'Records', icon: FileText },
                  { id: 'payments', name: 'Payments', icon: DollarSign },
                  { id: 'tabunghaji', name: 'Tabung Haji', icon: Heart },
                  { id: 'reports', name: 'Reports', icon: Activity },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setViewMode(tab.id as ViewMode)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                        viewMode === tab.id
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
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
            {viewMode === 'employees' && renderEmployees()}
            {viewMode === 'payments' && renderEmployees()}
            {viewMode === 'tabunghaji' && renderTabungHaji()}
            {viewMode === 'reports' && renderDashboard()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
