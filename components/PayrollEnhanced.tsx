import React, { useState } from 'react';
import { motion } from "framer-motion";
import { 
  Wallet, 
  TrendingUp, 
  DollarSign, 
  Download, 
  FileText,
  Users,
  Calculator,
  CreditCard,
  PieChart as PieChartIcon,
  Filter,
  Calendar,
  Plus,
  Eye,
  Edit,
  Send
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

interface PayrollRecord {
  id: string;
  name: string;
  position: string;
  basicSalary: number;
  allowances: number;
  epf: number;
  socso: number;
  eis: number;
  tax: number;
  netSalary: number;
  status: 'pending' | 'processed' | 'paid';
}

export function PayrollEnhanced() {
  const [selectedMonth, setSelectedMonth] = useState('June 2024');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'processed' | 'paid'>('all');

  const payrollRecords: PayrollRecord[] = [
    {
      id: '1',
      name: 'Ahmad bin Abdullah',
      position: 'Senior Software Engineer',
      basicSalary: 9500,
      allowances: 1500,
      epf: 1140,
      socso: 39.25,
      eis: 7.90,
      tax: 450,
      netSalary: 9362.85,
      status: 'paid'
    },
    {
      id: '2',
      name: 'Siti Nurhaliza',
      position: 'Sales Manager',
      basicSalary: 8200,
      allowances: 1200,
      epf: 984,
      socso: 39.25,
      eis: 7.90,
      tax: 350,
      netSalary: 8018.85,
      status: 'paid'
    },
    {
      id: '3',
      name: 'Raj Kumar',
      position: 'Marketing Specialist',
      basicSalary: 7100,
      allowances: 800,
      epf: 852,
      socso: 39.25,
      eis: 7.90,
      tax: 280,
      netSalary: 6720.85,
      status: 'processed'
    },
    {
      id: '4',
      name: 'Lee Mei Ling',
      position: 'HR Manager',
      basicSalary: 8800,
      allowances: 1100,
      epf: 1056,
      socso: 39.25,
      eis: 7.90,
      tax: 400,
      netSalary: 8396.85,
      status: 'paid'
    },
    {
      id: '5',
      name: 'Mohd Faizal',
      position: 'DevOps Engineer',
      basicSalary: 8500,
      allowances: 1000,
      epf: 1020,
      socso: 39.25,
      eis: 7.90,
      tax: 380,
      netSalary: 8052.85,
      status: 'pending'
    },
    {
      id: '6',
      name: 'Tan Wei Jian',
      position: 'Operations Lead',
      basicSalary: 7800,
      allowances: 900,
      epf: 936,
      socso: 39.25,
      eis: 7.90,
      tax: 320,
      netSalary: 7396.85,
      status: 'paid'
    },
  ];

  const filteredRecords = payrollRecords.filter(record =>
    filterStatus === 'all' || record.status === filterStatus
  );

  const totalPayroll = payrollRecords.reduce((sum, r) => sum + r.netSalary, 0);
  const totalEPF = payrollRecords.reduce((sum, r) => sum + r.epf, 0);
  const totalSOCSO = payrollRecords.reduce((sum, r) => sum + r.socso, 0);
  const totalEIS = payrollRecords.reduce((sum, r) => sum + r.eis, 0);

  const stats = [
    {
      label: 'Total Payroll',
      value: totalPayroll,
      prefix: 'RM ',
      change: '+5.2%',
      icon: Wallet,
      gradient: 'from-green-500/80 to-emerald-500/80',
    },
    {
      label: 'EPF Contribution',
      value: totalEPF,
      prefix: 'RM ',
      change: 'Employer 12%',
      icon: Calculator,
      gradient: 'from-blue-500/80 to-cyan-500/80',
    },
    {
      label: 'SOCSO + EIS',
      value: totalSOCSO + totalEIS,
      prefix: 'RM ',
      change: 'Combined',
      icon: CreditCard,
      gradient: 'from-purple-500/80 to-violet-500/80',
    },
    {
      label: 'Employees Paid',
      value: payrollRecords.filter(r => r.status === 'paid').length,
      suffix: ` / ${payrollRecords.length}`,
      change: 'This Month',
      icon: Users,
      gradient: 'from-orange-500/80 to-amber-500/80',
    },
  ];

  const monthlyTrendData = [
    { month: 'Jan', amount: 46500 },
    { month: 'Feb', amount: 47200 },
    { month: 'Mar', amount: 46800 },
    { month: 'Apr', amount: 48000 },
    { month: 'May', amount: 47500 },
    { month: 'Jun', amount: totalPayroll / 100 },
  ];

  const costBreakdownData = [
    { name: 'Basic Salary', value: payrollRecords.reduce((sum, r) => sum + r.basicSalary, 0) },
    { name: 'Allowances', value: payrollRecords.reduce((sum, r) => sum + r.allowances, 0) },
    { name: 'EPF', value: totalEPF },
    { name: 'SOCSO', value: totalSOCSO },
    { name: 'EIS', value: totalEIS },
  ];

  const departmentCostData = [
    { department: 'Engineering', cost: 35400 },
    { department: 'Sales', cost: 16400 },
    { department: 'Marketing', value: 13420 },
    { department: 'HR', cost: 16780 },
    { department: 'Operations', cost: 14796 },
  ];

  const COLORS = ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#3B82F6'];

  const getStatusColor = (status: PayrollRecord['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'processed':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'paid':
        return 'bg-green-100 text-green-700 border-green-200';
    }
  };

  const formatCurrency = (amount: number) => {
    return `RM ${amount.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute bottom-20 left-10 w-96 h-96 bg-emerald-300/30 rounded-full blur-3xl"
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
                className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                Payroll Management
              </motion.h1>
              <p className="text-gray-600 mt-2">Process and manage employee payroll with Malaysian compliance</p>
            </div>
            <div className="flex items-center gap-2">
              <GlassButton variant="secondary" onClick={() => {}}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </GlassButton>
              <GlassButton variant="primary" onClick={() => {}}>
                <Send className="w-4 h-4 mr-2" />
                Process Payroll
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
                          {stat.prefix}
                          <AnimatedCounter
                            value={stat.value}
                            duration={2}
                            
                          />
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

        {/* Malaysian Statutory Info */}
        <SlideIn direction="up" delay={0.2}>
          <GlassmorphicCard gradient="from-green-500/10 to-emerald-500/10" blur="xl">
            <div className="p-6">
              <div className="flex items-start gap-3 mb-4">
                <FileText className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-green-900 mb-1">Malaysian Statutory Contributions</h4>
                  <p className="text-sm text-green-700">Compliant with EPF Act 1991, SOCSO Act 1969, and EIS Act 2017</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-900">EPF (KWSP)</p>
                  <p className="text-xs text-gray-600 mt-1">Employee: 11% • Employer: 12%</p>
                </div>
                <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-900">SOCSO (PERKESO)</p>
                  <p className="text-xs text-gray-600 mt-1">Employee: 0.5% • Employer: 1.75%</p>
                </div>
                <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-900">EIS (SIP)</p>
                  <p className="text-xs text-gray-600 mt-1">Employee: 0.2% • Employer: 0.2%</p>
                </div>
              </div>
            </div>
          </GlassmorphicCard>
        </SlideIn>

        {/* Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SlideIn direction="left" delay={0.3}>
            <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Monthly Payroll Trend</h3>
                <div style={{ width: '100%', height: '250px', minHeight: '250px' }}>
                  <ResponsiveContainer width="100%" height="100%" minHeight={250}>
                    <AreaChart data={monthlyTrendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="month" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="amount" 
                        stroke="#10B981" 
                        fill="#10B981" 
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </GlassmorphicCard>
          </SlideIn>

          <SlideIn direction="right" delay={0.3}>
            <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Cost Breakdown</h3>
                <div style={{ width: '100%', height: '250px', minHeight: '250px' }}>
                  <ResponsiveContainer width="100%" height="100%" minHeight={250}>
                    <PieChart>
                      <Pie
                        data={costBreakdownData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {costBreakdownData.map((entry, index) => (
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
        </div>

        {/* Filters */}
        <SlideIn direction="up" delay={0.4}>
          <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
            <div className="p-6">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex gap-2">
                  {['all', 'pending', 'processed', 'paid'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilterStatus(status as any)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        filterStatus === status
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                          : 'bg-white/30 text-gray-700 hover:bg-white/50'
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                >
                  <option>June 2024</option>
                  <option>May 2024</option>
                  <option>April 2024</option>
                </select>
              </div>
            </div>
          </GlassmorphicCard>
        </SlideIn>

        {/* Payroll Table */}
        <SlideIn direction="up" delay={0.5}>
          <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Payroll Records - {selectedMonth}</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Employee</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Basic Salary</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Allowances</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">EPF</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">SOCSO+EIS</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Net Salary</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecords.map((record, index) => (
                      <motion.tr
                        key={record.id}
                        className="border-b border-gray-100 hover:bg-white/30 transition-colors"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-gray-900">{record.name}</p>
                            <p className="text-sm text-gray-600">{record.position}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {formatCurrency(record.basicSalary)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {formatCurrency(record.allowances)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {formatCurrency(record.epf)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {formatCurrency(record.socso + record.eis)}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-green-600">
                          {formatCurrency(record.netSalary)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(record.status)}`}>
                            {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button className="p-2 hover:bg-white/50 rounded-lg transition-colors">
                              <Eye className="w-4 h-4 text-gray-600" />
                            </button>
                            <button className="p-2 hover:bg-white/50 rounded-lg transition-colors">
                              <Edit className="w-4 h-4 text-gray-600" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </GlassmorphicCard>
        </SlideIn>
      </div>
    </div>
  );
}
