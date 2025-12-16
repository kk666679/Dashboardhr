"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Download,
  Calendar as CalendarIcon,
  TrendingUp,
  Users,
  MapPin,
  Plus,
  Filter,
  Search
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
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface AttendanceRecord {
  id: string;
  employeeName: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: 'present' | 'late' | 'absent' | 'half-day';
  workHours: string;
  location?: string;
}

export function AttendanceTrackingEnhanced() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const attendanceRecords: AttendanceRecord[] = [
    {
      id: '1',
      employeeName: 'Ahmad bin Abdullah',
      date: '2024-12-15',
      checkIn: '08:45',
      checkOut: '17:30',
      status: 'present',
      workHours: '8h 45m',
      location: 'KL Office'
    },
    {
      id: '2',
      employeeName: 'Siti Nurhaliza',
      date: '2024-12-15',
      checkIn: '09:15',
      checkOut: '17:45',
      status: 'late',
      workHours: '8h 30m',
      location: 'Penang Office'
    },
    {
      id: '3',
      employeeName: 'Raj Kumar',
      date: '2024-12-15',
      checkIn: '08:30',
      checkOut: '17:15',
      status: 'present',
      workHours: '8h 45m',
      location: 'Remote'
    },
    {
      id: '4',
      employeeName: 'Lee Mei Ling',
      date: '2024-12-15',
      checkIn: '08:55',
      checkOut: '17:20',
      status: 'present',
      workHours: '8h 25m',
      location: 'JB Office'
    },
    {
      id: '5',
      employeeName: 'Mohd Faizal',
      date: '2024-12-15',
      checkIn: '-',
      checkOut: '-',
      status: 'absent',
      workHours: '0h',
      location: '-'
    },
    {
      id: '6',
      employeeName: 'Tan Wei Jian',
      date: '2024-12-15',
      checkIn: '08:40',
      checkOut: '13:00',
      status: 'half-day',
      workHours: '4h 20m',
      location: 'Selangor Office'
    },
    {
      id: '7',
      employeeName: 'Nurul Aisyah',
      date: '2024-12-15',
      checkIn: '08:50',
      checkOut: '17:25',
      status: 'present',
      workHours: '8h 35m',
      location: 'KL Office'
    },
    {
      id: '8',
      employeeName: 'David Tan',
      date: '2024-12-15',
      checkIn: '09:20',
      checkOut: '17:50',
      status: 'late',
      workHours: '8h 30m',
      location: 'Penang Office'
    },
  ];

  const filteredRecords = attendanceRecords.filter(record =>
    record.employeeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = [
    {
      label: 'Present',
      value: attendanceRecords.filter(r => r.status === 'present').length,
      total: attendanceRecords.length,
      icon: CheckCircle,
      gradient: 'from-green-500/80 to-emerald-500/80',
    },
    {
      label: 'Late',
      value: attendanceRecords.filter(r => r.status === 'late').length,
      total: attendanceRecords.length,
      icon: AlertCircle,
      gradient: 'from-orange-500/80 to-amber-500/80',
    },
    {
      label: 'Absent',
      value: attendanceRecords.filter(r => r.status === 'absent').length,
      total: attendanceRecords.length,
      icon: XCircle,
      gradient: 'from-red-500/80 to-rose-500/80',
    },
    {
      label: 'Half Day',
      value: attendanceRecords.filter(r => r.status === 'half-day').length,
      total: attendanceRecords.length,
      icon: Clock,
      gradient: 'from-blue-500/80 to-cyan-500/80',
    },
  ];

  const statusDistributionData = [
    { name: 'Present', value: attendanceRecords.filter(r => r.status === 'present').length },
    { name: 'Late', value: attendanceRecords.filter(r => r.status === 'late').length },
    { name: 'Absent', value: attendanceRecords.filter(r => r.status === 'absent').length },
    { name: 'Half Day', value: attendanceRecords.filter(r => r.status === 'half-day').length },
  ];

  const weeklyTrendData = [
    { day: 'Mon', present: 45, late: 3, absent: 2 },
    { day: 'Tue', present: 46, late: 2, absent: 2 },
    { day: 'Wed', present: 44, late: 4, absent: 2 },
    { day: 'Thu', present: 47, late: 1, absent: 2 },
    { day: 'Fri', present: 43, late: 5, absent: 2 },
  ];

  const monthlyAttendanceData = [
    { month: 'Jul', rate: 92 },
    { month: 'Aug', rate: 94 },
    { month: 'Sep', rate: 91 },
    { month: 'Oct', rate: 95 },
    { month: 'Nov', rate: 93 },
    { month: 'Dec', rate: 94 },
  ];

  const locationData = [
    { location: 'KL Office', count: 2 },
    { location: 'Penang Office', count: 2 },
    { location: 'Remote', count: 1 },
    { location: 'JB Office', count: 1 },
    { location: 'Selangor Office', count: 1 },
  ];

  const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#3B82F6'];

  const getStatusIcon = (status: AttendanceRecord['status']) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'late':
        return <AlertCircle className="w-5 h-5 text-orange-600" />;
      case 'absent':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'half-day':
        return <Clock className="w-5 h-5 text-blue-600" />;
    }
  };

  const getStatusColor = (status: AttendanceRecord['status']) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'late':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'absent':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'half-day':
        return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const attendanceRate = Math.round(
    ((attendanceRecords.filter(r => r.status === 'present' || r.status === 'late').length) / 
    attendanceRecords.length) * 100
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-4 sm:p-6 lg:p-8">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 right-10 w-96 h-96 bg-green-300/30 rounded-full blur-3xl"
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
                className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                Attendance Tracking
              </motion.h1>
              <p className="text-gray-600 mt-2">Monitor and manage employee attendance</p>
            </div>
            <div className="flex items-center gap-2">
              <GlassButton variant="secondary" onClick={() => {}}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </GlassButton>
              <GlassButton variant="primary" onClick={() => {}}>
                <Plus className="w-4 h-4 mr-2" />
                Manual Entry
              </GlassButton>
            </div>
          </div>
        </SlideIn>

        {/* Stats */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const percentage = Math.round((stat.value / stat.total) * 100);
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
                    <p className="text-sm text-gray-600">{percentage}% of total</p>
                  </div>
                </GlassmorphicCard>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        {/* Analytics Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SlideIn direction="left" delay={0.2}>
            <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Status Distribution</h3>
                <div style={{ width: '100%', height: '250px', minHeight: '250px' }}>
                  <ResponsiveContainer width="100%" height="100%" minHeight={250}>
                    <PieChart>
                      <Pie
                        data={statusDistributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {statusDistributionData.map((entry, index) => (
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
                <h3 className="text-lg font-bold text-gray-900 mb-4">Weekly Trend</h3>
                <div style={{ width: '100%', height: '250px', minHeight: '250px' }}>
                  <ResponsiveContainer width="100%" height="100%" minHeight={250}>
                    <BarChart data={weeklyTrendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="day" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="present" fill="#10B981" radius={[8, 8, 0, 0]} />
                      <Bar dataKey="late" fill="#F59E0B" radius={[8, 8, 0, 0]} />
                      <Bar dataKey="absent" fill="#EF4444" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </GlassmorphicCard>
          </SlideIn>
        </div>

        {/* Analytics Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SlideIn direction="left" delay={0.3}>
            <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Monthly Attendance Rate</h3>
                <div style={{ width: '100%', height: '250px', minHeight: '250px' }}>
                  <ResponsiveContainer width="100%" height="100%" minHeight={250}>
                    <AreaChart data={monthlyAttendanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="month" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="rate" 
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
                <h3 className="text-lg font-bold text-gray-900 mb-4">Location Distribution</h3>
                <div style={{ width: '100%', height: '250px', minHeight: '250px' }}>
                  <ResponsiveContainer width="100%" height="100%" minHeight={250}>
                    <BarChart data={locationData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis type="number" stroke="#6B7280" />
                      <YAxis type="category" dataKey="location" stroke="#6B7280" width={120} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#3B82F6" radius={[0, 8, 8, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </GlassmorphicCard>
          </SlideIn>
        </div>

        {/* Malaysian Work Hours Info */}
        <SlideIn direction="up" delay={0.4}>
          <GlassmorphicCard gradient="from-blue-500/10 to-cyan-500/10" blur="xl">
            <div className="p-6">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">Malaysian Work Hours Standards</h4>
                  <p className="text-sm text-blue-700">
                    Standard work hours: 8 hours/day, 48 hours/week. Overtime applies after normal hours as per Employment Act 1955.
                  </p>
                </div>
              </div>
            </div>
          </GlassmorphicCard>
        </SlideIn>

        {/* Search and Date Selector */}
        <SlideIn direction="up" delay={0.5}>
          <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
            <div className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <GlassInput
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Search employees..."
                    icon={<Search className="w-5 h-5" />}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-gray-600" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                  />
                </div>
              </div>
            </div>
          </GlassmorphicCard>
        </SlideIn>

        {/* Attendance Records Table */}
        <SlideIn direction="up" delay={0.6}>
          <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Attendance Records - {new Date(selectedDate).toLocaleDateString('en-MY', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Employee</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Check In</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Check Out</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Work Hours</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Location</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
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
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {getInitials(record.employeeName)}
                            </div>
                            <span className="text-sm font-medium text-gray-900">{record.employeeName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{record.checkIn}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{record.checkOut}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{record.workHours}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>{record.location}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(record.status)}
                            <span className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(record.status)}`}>
                              {record.status.charAt(0).toUpperCase() + record.status.slice(1).replace('-', ' ')}
                            </span>
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

        {/* Quick Actions */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: Clock, title: 'Manual Check-in', desc: 'Record attendance manually', color: 'from-blue-500 to-cyan-500' },
            { icon: AlertCircle, title: 'Mark Leave', desc: 'Update leave records', color: 'from-orange-500 to-amber-500' },
            { icon: Download, title: 'Monthly Report', desc: 'Generate attendance report', color: 'from-purple-500 to-violet-500' },
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
    </div>
  );
}
