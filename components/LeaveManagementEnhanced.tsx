import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar as CalendarIcon, 
  Check, 
  X, 
  Clock, 
  Filter,
  Download,
  Plus,
  Users,
  TrendingUp,
  AlertCircle,
  FileText,
  Sun,
  Heart,
  Plane,
  Grid3x3,
  List as ListIcon,
  Eye,
  Edit,
  Trash2
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
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface LeaveRequest {
  id: string;
  employeeName: string;
  employeeId: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedDate: string;
}

export function LeaveManagementEnhanced() {
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const leaveRequests: LeaveRequest[] = [
    {
      id: '1',
      employeeName: 'Ahmad bin Abdullah',
      employeeId: 'EMP001',
      leaveType: 'Annual Leave',
      startDate: '2024-12-18',
      endDate: '2024-12-20',
      days: 3,
      reason: 'Family vacation',
      status: 'pending',
      submittedDate: '2024-12-10'
    },
    {
      id: '2',
      employeeName: 'Siti Nurhaliza',
      employeeId: 'EMP002',
      leaveType: 'Medical Leave',
      startDate: '2024-12-19',
      endDate: '2024-12-19',
      days: 1,
      reason: 'Medical appointment',
      status: 'approved',
      submittedDate: '2024-12-15'
    },
    {
      id: '3',
      employeeName: 'Raj Kumar',
      employeeId: 'EMP003',
      leaveType: 'Annual Leave',
      startDate: '2024-12-23',
      endDate: '2024-12-27',
      days: 5,
      reason: 'Year-end holiday',
      status: 'approved',
      submittedDate: '2024-12-05'
    },
    {
      id: '4',
      employeeName: 'Lee Mei Ling',
      employeeId: 'EMP004',
      leaveType: 'Compassionate Leave',
      startDate: '2024-12-20',
      endDate: '2024-12-21',
      days: 2,
      reason: 'Family emergency',
      status: 'approved',
      submittedDate: '2024-12-18'
    },
    {
      id: '5',
      employeeName: 'Mohd Faizal',
      employeeId: 'EMP005',
      leaveType: 'Annual Leave',
      startDate: '2024-12-30',
      endDate: '2025-01-02',
      days: 4,
      reason: 'New Year celebration',
      status: 'pending',
      submittedDate: '2024-12-12'
    },
    {
      id: '6',
      employeeName: 'Nurul Aisyah',
      employeeId: 'EMP007',
      leaveType: 'Sick Leave',
      startDate: '2024-12-16',
      endDate: '2024-12-17',
      days: 2,
      reason: 'Flu',
      status: 'approved',
      submittedDate: '2024-12-15'
    },
  ];

  const filteredRequests = leaveRequests.filter(req => 
    filterStatus === 'all' || req.status === filterStatus
  );

  const stats = [
    {
      label: 'Pending Requests',
      value: leaveRequests.filter(r => r.status === 'pending').length,
      change: 'Needs Review',
      icon: Clock,
      gradient: 'from-orange-500/80 to-amber-500/80',
    },
    {
      label: 'Approved',
      value: leaveRequests.filter(r => r.status === 'approved').length,
      change: 'This Month',
      icon: Check,
      gradient: 'from-green-500/80 to-emerald-500/80',
    },
    {
      label: 'Total Days',
      value: leaveRequests.reduce((sum, r) => sum + r.days, 0),
      change: 'All Requests',
      icon: CalendarIcon,
      gradient: 'from-blue-500/80 to-cyan-500/80',
    },
    {
      label: 'Team Coverage',
      value: 94,
      change: '% Available',
      icon: Users,
      gradient: 'from-purple-500/80 to-violet-500/80',
      suffix: '%'
    },
  ];

  const leaveTypeData = [
    { name: 'Annual', value: leaveRequests.filter(r => r.leaveType === 'Annual Leave').length },
    { name: 'Medical', value: leaveRequests.filter(r => r.leaveType === 'Medical Leave' || r.leaveType === 'Sick Leave').length },
    { name: 'Compassionate', value: leaveRequests.filter(r => r.leaveType === 'Compassionate Leave').length },
  ];

  const monthlyTrend = [
    { month: 'Jul', requests: 12 },
    { month: 'Aug', requests: 15 },
    { month: 'Sep', requests: 10 },
    { month: 'Oct', requests: 18 },
    { month: 'Nov', requests: 14 },
    { month: 'Dec', requests: 6 },
  ];

  const COLORS = ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#3B82F6'];

  const getStatusColor = (status: LeaveRequest['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'approved':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-200';
    }
  };

  const getLeaveIcon = (type: string) => {
    if (type.includes('Annual')) return <Plane className="w-5 h-5" />;
    if (type.includes('Medical') || type.includes('Sick')) return <Heart className="w-5 h-5" />;
    if (type.includes('Compassionate')) return <AlertCircle className="w-5 h-5" />;
    return <FileText className="w-5 h-5" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-96 h-96 bg-orange-300/30 rounded-full blur-3xl"
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
                className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                Leave Management
              </motion.h1>
              <p className="text-gray-600 mt-2">Manage employee leave requests and approvals</p>
            </div>
            <div className="flex items-center gap-2">
              <GlassButton variant="secondary" onClick={() => {}}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </GlassButton>
              <GlassButton variant="primary" onClick={() => {}}>
                <Plus className="w-4 h-4 mr-2" />
                New Request
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
                          {typeof stat.value === 'number' ? (
                            <AnimatedCounter
                              value={stat.value}
                              duration={2}
                              suffix={stat.suffix}
                            />
                          ) : (
                            stat.value
                          )}
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
                <h3 className="text-lg font-bold text-gray-900 mb-4">Leave Type Distribution</h3>
                <div style={{ width: '100%', height: '250px', minHeight: '250px' }}>
                  <ResponsiveContainer width="100%" height="100%" minHeight={250}>
                    <PieChart>
                      <Pie
                        data={leaveTypeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {leaveTypeData.map((entry, index) => (
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
                <h3 className="text-lg font-bold text-gray-900 mb-4">Monthly Trend</h3>
                <div style={{ width: '100%', height: '250px', minHeight: '250px' }}>
                  <ResponsiveContainer width="100%" height="100%" minHeight={250}>
                    <LineChart data={monthlyTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="month" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="requests" 
                        stroke="#F59E0B" 
                        strokeWidth={3}
                        dot={{ fill: '#F59E0B', r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </GlassmorphicCard>
          </SlideIn>
        </div>

        {/* Filters */}
        <SlideIn direction="up" delay={0.3}>
          <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
            <div className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex gap-2">
                  {['all', 'pending', 'approved', 'rejected'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilterStatus(status as any)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        filterStatus === status
                          ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg'
                          : 'bg-white/30 text-gray-700 hover:bg-white/50'
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
                <div className="ml-auto flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === 'grid'
                        ? 'bg-orange-500 text-white'
                        : 'text-gray-600 hover:bg-white/20'
                    }`}
                  >
                    <Grid3x3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === 'list'
                        ? 'bg-orange-500 text-white'
                        : 'text-gray-600 hover:bg-white/20'
                    }`}
                  >
                    <ListIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </GlassmorphicCard>
        </SlideIn>

        {/* Leave Requests */}
        <AnimatePresence mode="wait">
          {viewMode === 'grid' ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredRequests.map((request, index) => (
                  <StaggerItem key={request.id}>
                    <GlassmorphicCard
                      gradient="from-white/80 to-white/60"
                      blur="xl"
                      animation="scale"
                      delay={index * 0.05}
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-500 rounded-lg flex items-center justify-center text-white">
                              {getLeaveIcon(request.leaveType)}
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900">{request.employeeName}</h3>
                              <p className="text-xs text-gray-500">{request.employeeId}</p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(request.status)}`}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </span>
                        </div>

                        <div className="space-y-3 mb-4">
                          <div>
                            <p className="text-sm font-semibold text-gray-700">{request.leaveType}</p>
                            <p className="text-xs text-gray-500 mt-1">{request.reason}</p>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <CalendarIcon className="w-4 h-4" />
                            <span>{request.startDate} to {request.endDate}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>{request.days} {request.days === 1 ? 'day' : 'days'}</span>
                          </div>
                        </div>

                        {request.status === 'pending' && (
                          <div className="flex items-center gap-2">
                            <GlassButton variant="success" size="sm" className="flex-1">
                              <Check className="w-4 h-4 mr-1" />
                              Approve
                            </GlassButton>
                            <GlassButton variant="danger" size="sm" className="flex-1">
                              <X className="w-4 h-4 mr-1" />
                              Reject
                            </GlassButton>
                          </div>
                        )}
                      </div>
                    </GlassmorphicCard>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Employee</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Leave Type</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Duration</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Days</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRequests.map((request, index) => (
                        <motion.tr
                          key={request.id}
                          className="border-b border-gray-100 hover:bg-white/30 transition-colors"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-semibold text-gray-900">{request.employeeName}</p>
                              <p className="text-sm text-gray-600">{request.employeeId}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {getLeaveIcon(request.leaveType)}
                              <span className="text-sm text-gray-900">{request.leaveType}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {request.startDate} - {request.endDate}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">{request.days}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(request.status)}`}>
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {request.status === 'pending' ? (
                                <>
                                  <GlassButton variant="success" size="sm">
                                    <Check className="w-4 h-4" />
                                  </GlassButton>
                                  <GlassButton variant="danger" size="sm">
                                    <X className="w-4 h-4" />
                                  </GlassButton>
                                </>
                              ) : (
                                <button className="p-2 hover:bg-white/50 rounded-lg transition-colors">
                                  <Eye className="w-4 h-4 text-gray-600" />
                                </button>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </GlassmorphicCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}