"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Calendar,
  Clock,
  Wallet,
  FileText,
  Award,
  GraduationCap,
  MessageSquare,
  Download,
  Users,
  Bell,
  Settings,
  ChevronRight,
  TrendingUp,
  Heart,
  Building2,
  Phone,
  Mail,
  MapPin,
  Edit,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Briefcase,
  Target,
  Star,
  Gift,
  Shield,
  CreditCard,
  PiggyBank,
  Activity,
  BarChart3,
  Clipboard,
  Send,
  Eye,
  PlusCircle,
  ThumbsUp,
  MessageCircle,
  Zap,
  LayoutDashboard,
  Globe
} from 'lucide-react';
import { GlassmorphicCard } from './GlassmorphicCard';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

type ESSView = 
  | 'dashboard'
  | 'profile'
  | 'leave'
  | 'attendance'
  | 'payslip'
  | 'benefits'
  | 'tax'
  | 'performance'
  | 'learning'
  | 'claims'
  | 'documents'
  | 'team'
  | 'announcements'
  | 'helpdesk';

export function EmployeeSelfService() {
  const [activeView, setActiveView] = useState<ESSView>('dashboard');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);

  // Mock employee data
  const employeeData = {
    id: 'EMP-2024-001',
    name: 'Ahmad Harith bin Abdullah',
    email: 'ahmad.harith@company.my',
    phone: '+60 12-345 6789',
    position: 'Senior Software Engineer',
    department: 'Engineering',
    manager: 'Sarah Johnson',
    joinDate: '2022-01-15',
    employmentType: 'Permanent',
    workLocation: 'Kuala Lumpur HQ',
    avatar: '👨‍💼',
    icNumber: '920815-10-5678',
    epfNumber: 'EPF123456789',
    socsoNumber: 'SO9876543',
    tinNumber: 'SG1234567890',
    bankAccount: 'Maybank - 1234567890',
    address: '123, Jalan Ampang, 50450 Kuala Lumpur',
    emergencyContact: 'Nurul Aisyah - +60 19-876 5432',
    religion: 'Islam',
    maritalStatus: 'Married',
    nationality: 'Malaysian',
  };

  const quickStats = [
    { label: 'Leave Balance', value: '18 days', icon: Calendar, color: 'blue', trend: '+2' },
    { label: 'Attendance Rate', value: '98.5%', icon: Clock, color: 'green', trend: '+0.5%' },
    { label: 'Pending Claims', value: 'RM 850', icon: DollarSign, color: 'yellow', trend: '2 items' },
    { label: 'Performance', value: '4.7/5.0', icon: Star, color: 'purple', trend: '+0.2' },
  ];

  const leaveData = [
    { type: 'Annual Leave', total: 18, used: 8, balance: 10, color: '#3B82F6' },
    { type: 'Sick Leave', total: 14, used: 3, balance: 11, color: '#10B981' },
    { type: 'Unpaid Leave', total: 0, used: 0, balance: 0, color: '#F59E0B' },
    { type: 'Compassionate', total: 5, used: 0, balance: 5, color: '#8B5CF6' },
  ];

  const attendanceHistory = [
    { date: '15 Dec', checkIn: '08:55', checkOut: '18:10', hours: 9.25, status: 'Present' },
    { date: '14 Dec', checkIn: '09:02', checkOut: '18:05', hours: 9.05, status: 'Present' },
    { date: '13 Dec', checkIn: '08:58', checkOut: '18:15', hours: 9.28, status: 'Present' },
    { date: '12 Dec', checkIn: '09:10', checkOut: '18:00', hours: 8.83, status: 'Late' },
    { date: '11 Dec', checkIn: '08:50', checkOut: '18:20', hours: 9.50, status: 'Present' },
  ];

  const salaryHistory = [
    { month: 'Nov 2024', gross: 8500, deductions: 1250, net: 7250, status: 'Paid' },
    { month: 'Oct 2024', gross: 8500, deductions: 1200, net: 7300, status: 'Paid' },
    { month: 'Sep 2024', gross: 8500, deductions: 1220, net: 7280, status: 'Paid' },
  ];

  const benefitsData = [
    { 
      name: 'Medical Insurance', 
      provider: 'Great Eastern',
      coverage: 'RM 100,000',
      status: 'Active',
      icon: Heart,
      color: 'red'
    },
    { 
      name: 'EPF Contribution', 
      provider: 'KWSP',
      coverage: '11% + 13%',
      status: 'Active',
      icon: PiggyBank,
      color: 'green'
    },
    { 
      name: 'SOCSO', 
      provider: 'PERKESO',
      coverage: 'Full Coverage',
      status: 'Active',
      icon: Shield,
      color: 'blue'
    },
    { 
      name: 'Group Life Insurance', 
      provider: 'Prudential',
      coverage: 'RM 200,000',
      status: 'Active',
      icon: Heart,
      color: 'purple'
    },
  ];

  const learningCourses = [
    { title: 'Advanced React Patterns', progress: 75, dueDate: '2024-12-31', status: 'In Progress' },
    { title: 'Leadership Skills', progress: 100, dueDate: '2024-11-30', status: 'Completed' },
    { title: 'Cybersecurity Awareness', progress: 40, dueDate: '2024-12-20', status: 'In Progress' },
  ];

  const performanceMetrics = [
    { metric: 'Technical Skills', score: 4.8, target: 4.5 },
    { metric: 'Communication', score: 4.5, target: 4.0 },
    { metric: 'Leadership', score: 4.6, target: 4.5 },
    { metric: 'Problem Solving', score: 4.7, target: 4.5 },
    { metric: 'Teamwork', score: 4.9, target: 4.5 },
  ];

  const announcements = [
    {
      id: 1,
      title: 'Year-End Bonus Announcement',
      date: '2024-12-10',
      category: 'Benefits',
      priority: 'high',
      content: 'Performance bonus will be credited by December 20th, 2024.',
      icon: Gift,
    },
    {
      id: 2,
      title: 'Office Closure - Christmas',
      date: '2024-12-08',
      category: 'General',
      priority: 'medium',
      content: 'Office will be closed on 25th December 2024.',
      icon: Bell,
    },
    {
      id: 3,
      title: 'New Medical Panel Clinic',
      date: '2024-12-05',
      category: 'Benefits',
      priority: 'low',
      content: 'Added 5 new panel clinics in Kuala Lumpur area.',
      icon: Heart,
    },
  ];

  const pendingClaims = [
    { id: 'CLM-001', type: 'Travel', amount: 450, date: '2024-12-10', status: 'Pending' },
    { id: 'CLM-002', type: 'Medical', amount: 120, date: '2024-12-08', status: 'Approved' },
    { id: 'CLM-003', type: 'Meal', amount: 280, date: '2024-12-05', status: 'Pending' },
  ];

  const documents = [
    { name: 'Employment Contract', category: 'Contract', date: '2022-01-15', size: '2.4 MB' },
    { name: 'Tax Form EA 2023', category: 'Tax', date: '2024-03-01', size: '156 KB' },
    { name: 'Increment Letter', category: 'Salary', date: '2024-01-01', size: '89 KB' },
    { name: 'Medical Card', category: 'Benefits', date: '2022-02-01', size: '445 KB' },
  ];

  const monthlyEarnings = [
    { month: 'Jun', amount: 7250 },
    { month: 'Jul', amount: 7300 },
    { month: 'Aug', amount: 7280 },
    { month: 'Sep', amount: 7280 },
    { month: 'Oct', amount: 7300 },
    { month: 'Nov', amount: 7250 },
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <GlassmorphicCard gradient="from-blue-500/90 to-purple-600/90" blur="xl">
        <div className="p-8 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-3xl mb-2">
                Welcome back, {employeeData.name.split(' ')[0]}! 👋
              </h1>
              <p className="text-blue-100 text-lg">
                {employeeData.position} • {employeeData.department}
              </p>
              <p className="text-blue-200 text-sm mt-2">
                Last login: Today at 08:55 AM
              </p>
            </div>
            <div className="text-6xl">{employeeData.avatar}</div>
          </motion.div>
        </div>
      </GlassmorphicCard>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          const colorClasses = {
            blue: 'bg-blue-500',
            green: 'bg-green-500',
            yellow: 'bg-yellow-500',
            purple: 'bg-purple-500',
          };
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 ${colorClasses[stat.color as keyof typeof colorClasses]} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                      {stat.trend}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl text-gray-900">{stat.value}</p>
                </div>
              </GlassmorphicCard>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
        <div className="p-6">
          <h3 className="text-lg text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Apply Leave', icon: Calendar, view: 'leave', color: 'blue' },
              { label: 'Submit Claim', icon: DollarSign, view: 'claims', color: 'green' },
              { label: 'View Payslip', icon: Wallet, view: 'payslip', color: 'purple' },
              { label: 'Update Profile', icon: User, view: 'profile', color: 'yellow' },
            ].map((action, index) => {
              const Icon = action.icon;
              const colorClasses = {
                blue: 'hover:bg-blue-50 text-blue-600',
                green: 'hover:bg-green-50 text-green-600',
                purple: 'hover:bg-purple-50 text-purple-600',
                yellow: 'hover:bg-yellow-50 text-yellow-600',
              };
              return (
                <button
                  key={index}
                  onClick={() => setActiveView(action.view as ESSView)}
                  className={`p-4 rounded-lg border-2 border-gray-200 transition-all ${colorClasses[action.color as keyof typeof colorClasses]}`}
                >
                  <Icon className="w-6 h-6 mx-auto mb-2" />
                  <p className="text-sm">{action.label}</p>
                </button>
              );
            })}
          </div>
        </div>
      </GlassmorphicCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leave Balance */}
        <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg text-gray-900">Leave Balance</h3>
              <button
                onClick={() => setActiveView('leave')}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                View All <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              {leaveData.slice(0, 3).map((leave, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-700">{leave.type}</span>
                    <span className="text-sm text-gray-900">
                      {leave.balance}/{leave.total} days
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${(leave.balance / leave.total) * 100}%`,
                        backgroundColor: leave.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </GlassmorphicCard>

        {/* Recent Announcements */}
        <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg text-gray-900">Announcements</h3>
              <button
                onClick={() => setActiveView('announcements')}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                View All <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              {announcements.slice(0, 3).map((announcement) => {
                const Icon = announcement.icon;
                const priorityColors = {
                  high: 'bg-red-100 text-red-700',
                  medium: 'bg-yellow-100 text-yellow-700',
                  low: 'bg-green-100 text-green-700',
                };
                return (
                  <div
                    key={announcement.id}
                    className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm text-gray-900 truncate">
                            {announcement.title}
                          </h4>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${priorityColors[announcement.priority as keyof typeof priorityColors]}`}>
                            {announcement.priority}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {announcement.content}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{announcement.date}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </GlassmorphicCard>
      </div>

      {/* Earnings Overview */}
      <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl" hover={false}>
        <div className="p-6">
          <h3 className="text-lg text-gray-900 dark:text-gray-100 mb-4">Earnings Overview (Last 6 Months)</h3>
          <div style={{ width: '100%', height: '250px', minHeight: '250px' }}>
            <ResponsiveContainer width="100%" height="100%" minHeight={250}>
              <AreaChart data={monthlyEarnings}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip />
                <Area type="monotone" dataKey="amount" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </GlassmorphicCard>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl text-gray-900">My Profile</h2>
        <button
          onClick={() => setIsEditingProfile(!isEditingProfile)}
          className={`px-4 py-2 rounded-lg border-2 transition-all ${
            isEditingProfile
              ? 'bg-red-500 border-red-600 text-white hover:bg-red-600'
              : 'bg-blue-500 border-blue-600 text-white hover:bg-blue-600'
          }`}
        >
          {isEditingProfile ? (
            <>
              <X className="w-4 h-4 inline mr-2" />
              Cancel
            </>
          ) : (
            <>
              <Edit className="w-4 h-4 inline mr-2" />
              Edit Profile
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <GlassmorphicCard gradient="from-blue-500/90 to-purple-600/90" blur="xl">
          <div className="p-6 text-white text-center">
            <div className="text-8xl mb-4">{employeeData.avatar}</div>
            <h3 className="text-xl mb-1">{employeeData.name}</h3>
            <p className="text-blue-100 mb-2">{employeeData.position}</p>
            <p className="text-blue-200 text-sm mb-4">{employeeData.id}</p>
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="px-3 py-1 bg-green-500 text-white rounded-full text-xs">
                {employeeData.employmentType}
              </span>
              <span className="px-3 py-1 bg-white/20 text-white rounded-full text-xs">
                {employeeData.department}
              </span>
            </div>
            <div className="pt-4 border-t border-white/20">
              <p className="text-sm text-blue-100 mb-1">Joined</p>
              <p className="text-sm">{employeeData.joinDate}</p>
            </div>
          </div>
        </GlassmorphicCard>

        {/* Personal Information */}
        <div className="lg:col-span-2 space-y-6">
          <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
            <div className="p-6">
              <h3 className="text-lg text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'IC Number', value: employeeData.icNumber, icon: User },
                  { label: 'Email', value: employeeData.email, icon: Mail },
                  { label: 'Phone', value: employeeData.phone, icon: Phone },
                  { label: 'Nationality', value: employeeData.nationality, icon: Globe },
                  { label: 'Religion', value: employeeData.religion, icon: Heart },
                  { label: 'Marital Status', value: employeeData.maritalStatus, icon: Users },
                ].map((field, index) => {
                  const Icon = field.icon;
                  return (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className="w-4 h-4 text-gray-500" />
                        <label className="text-xs text-gray-600">{field.label}</label>
                      </div>
                      {isEditingProfile ? (
                        <input
                          type="text"
                          defaultValue={field.value}
                          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm"
                        />
                      ) : (
                        <p className="text-sm text-gray-900">{field.value}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </GlassmorphicCard>

          <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
            <div className="p-6">
              <h3 className="text-lg text-gray-900 mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Employment Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'Department', value: employeeData.department, icon: Building2 },
                  { label: 'Position', value: employeeData.position, icon: Briefcase },
                  { label: 'Manager', value: employeeData.manager, icon: Users },
                  { label: 'Work Location', value: employeeData.workLocation, icon: MapPin },
                  { label: 'Join Date', value: employeeData.joinDate, icon: Calendar },
                  { label: 'Employment Type', value: employeeData.employmentType, icon: FileText },
                ].map((field, index) => {
                  const Icon = field.icon;
                  return (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className="w-4 h-4 text-gray-500" />
                        <label className="text-xs text-gray-600">{field.label}</label>
                      </div>
                      <p className="text-sm text-gray-900">{field.value}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </GlassmorphicCard>

          <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
            <div className="p-6">
              <h3 className="text-lg text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Malaysian Statutory Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'EPF Number', value: employeeData.epfNumber, icon: PiggyBank },
                  { label: 'SOCSO Number', value: employeeData.socsoNumber, icon: Shield },
                  { label: 'Income Tax Number', value: employeeData.tinNumber, icon: FileText },
                  { label: 'Bank Account', value: employeeData.bankAccount, icon: CreditCard },
                ].map((field, index) => {
                  const Icon = field.icon;
                  return (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className="w-4 h-4 text-gray-500" />
                        <label className="text-xs text-gray-600">{field.label}</label>
                      </div>
                      <p className="text-sm text-gray-900">{field.value}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </GlassmorphicCard>
        </div>
      </div>

      {isEditingProfile && (
        <div className="flex justify-end gap-4">
          <button
            onClick={() => setIsEditingProfile(false)}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg border-2 border-gray-300 hover:bg-gray-300 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              setIsEditingProfile(false);
              // Save logic here
            }}
            className="px-6 py-3 bg-green-500 text-white rounded-lg border-2 border-green-600 hover:bg-green-600 transition-all shadow-lg"
          >
            <Save className="w-4 h-4 inline mr-2" />
            Save Changes
          </button>
        </div>
      )}
    </div>
  );

  const renderLeave = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl text-gray-900">Leave Management</h2>
        <button
          onClick={() => setShowLeaveModal(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg border-2 border-blue-600 hover:bg-blue-600 transition-all shadow-lg"
        >
          <PlusCircle className="w-4 h-4 inline mr-2" />
          Apply Leave
        </button>
      </div>

      {/* Leave Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {leaveData.map((leave, index) => (
          <GlassmorphicCard key={index} gradient="from-white/80 to-white/60" blur="xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: leave.color }}
                />
                <span className="text-xs text-gray-600">{leave.type}</span>
              </div>
              <p className="text-3xl text-gray-900 mb-1">{leave.balance}</p>
              <p className="text-sm text-gray-600">days available</p>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Used: {leave.used} | Total: {leave.total}
                </p>
              </div>
            </div>
          </GlassmorphicCard>
        ))}
      </div>

      {/* Leave Chart */}
      <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl" hover={false}>
        <div className="p-6">
          <h3 className="text-lg text-gray-900 dark:text-gray-100 mb-4">Leave Balance Overview</h3>
          <div style={{ width: '100%', height: '300px', minHeight: '300px' }}>
            <ResponsiveContainer width="100%" height="100%" minHeight={300}>
              <BarChart data={leaveData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="type" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip />
                <Legend />
                <Bar dataKey="used" fill="#EF4444" name="Used" radius={[8, 8, 0, 0]} />
                <Bar dataKey="balance" fill="#10B981" name="Balance" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </GlassmorphicCard>

      {/* Leave History */}
      <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
        <div className="p-6">
          <h3 className="text-lg text-gray-900 mb-4">Recent Leave Applications</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 text-sm text-gray-600">Date Range</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-600">Type</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-600">Days</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-600">Reason</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { dateRange: '20-22 Dec 2024', type: 'Annual', days: 3, reason: 'Family vacation', status: 'Approved' },
                  { dateRange: '15 Nov 2024', type: 'Sick', days: 1, reason: 'Medical appointment', status: 'Approved' },
                  { dateRange: '8-10 Oct 2024', type: 'Annual', days: 3, reason: 'Personal matters', status: 'Approved' },
                  { dateRange: '25-29 Dec 2024', type: 'Annual', days: 5, reason: 'Year-end holiday', status: 'Pending' },
                ].map((leave, index) => {
                  const statusColors = {
                    Approved: 'bg-green-100 text-green-700',
                    Pending: 'bg-yellow-100 text-yellow-700',
                    Rejected: 'bg-red-100 text-red-700',
                  };
                  return (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-900">{leave.dateRange}</td>
                      <td className="py-3 px-4 text-sm text-gray-900">{leave.type}</td>
                      <td className="py-3 px-4 text-sm text-gray-900">{leave.days}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{leave.reason}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs ${statusColors[leave.status as keyof typeof statusColors]}`}>
                          {leave.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </GlassmorphicCard>
    </div>
  );

  const renderAttendance = () => (
    <div className="space-y-6">
      <h2 className="text-2xl text-gray-900">My Attendance</h2>

      {/* Attendance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Attendance Rate', value: '98.5%', icon: CheckCircle, color: 'green' },
          { label: 'Days Present', value: '23/24', icon: Calendar, color: 'blue' },
          { label: 'Late Check-ins', value: '2', icon: AlertCircle, color: 'yellow' },
        ].map((stat, index) => {
          const Icon = stat.icon;
          const colorClasses = {
            green: 'bg-green-500',
            blue: 'bg-blue-500',
            yellow: 'bg-yellow-500',
          };
          return (
            <GlassmorphicCard key={index} gradient="from-white/80 to-white/60" blur="xl">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${colorClasses[stat.color as keyof typeof colorClasses]} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-3xl text-gray-900">{stat.value}</p>
              </div>
            </GlassmorphicCard>
          );
        })}
      </div>

      {/* Check In/Out */}
      <GlassmorphicCard gradient="from-blue-500/90 to-purple-600/90" blur="xl">
        <div className="p-8 text-white">
          <div className="text-center">
            <div className="text-6xl mb-4">⏰</div>
            <h3 className="text-2xl mb-2">Quick Check-In / Check-Out</h3>
            <p className="text-blue-100 mb-6">
              Current time: {new Date().toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit' })}
            </p>
            <div className="flex items-center justify-center gap-4">
              <button className="px-8 py-4 bg-white text-blue-600 rounded-lg shadow-lg hover:shadow-xl transition-all">
                <Clock className="w-6 h-6 inline mr-2" />
                Check In
              </button>
              <button className="px-8 py-4 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all">
                <Clock className="w-6 h-6 inline mr-2" />
                Check Out
              </button>
            </div>
          </div>
        </div>
      </GlassmorphicCard>

      {/* Attendance History */}
      <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
        <div className="p-6">
          <h3 className="text-lg text-gray-900 mb-4">Recent Attendance History</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 text-sm text-gray-600">Date</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-600">Check In</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-600">Check Out</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-600">Hours</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {attendanceHistory.map((record, index) => {
                  const statusColors = {
                    Present: 'bg-green-100 text-green-700',
                    Late: 'bg-yellow-100 text-yellow-700',
                    Absent: 'bg-red-100 text-red-700',
                  };
                  return (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-900">{record.date}</td>
                      <td className="py-3 px-4 text-sm text-gray-900">{record.checkIn}</td>
                      <td className="py-3 px-4 text-sm text-gray-900">{record.checkOut}</td>
                      <td className="py-3 px-4 text-sm text-gray-900">{record.hours.toFixed(2)}h</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs ${statusColors[record.status as keyof typeof statusColors]}`}>
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </GlassmorphicCard>
    </div>
  );

  const renderPayslip = () => (
    <div className="space-y-6">
      <h2 className="text-2xl text-gray-900">Payslips & Salary</h2>

      {/* Current Salary Summary */}
      <GlassmorphicCard gradient="from-green-500/90 to-blue-600/90" blur="xl">
        <div className="p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm mb-2">Current Month Net Salary</p>
              <h2 className="text-5xl mb-2">RM 7,250.00</h2>
              <p className="text-green-100">November 2024 • Paid on 25/11/2024</p>
            </div>
            <div className="text-6xl">💰</div>
          </div>
        </div>
      </GlassmorphicCard>

      {/* Salary Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
          <div className="p-6">
            <h3 className="text-lg text-gray-900 mb-4">Earnings</h3>
            <div className="space-y-3">
              {[
                { label: 'Basic Salary', amount: 6500 },
                { label: 'Allowances', amount: 1500 },
                { label: 'Overtime', amount: 500 },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <span className="text-sm text-gray-700">{item.label}</span>
                  <span className="text-sm text-green-700">RM {item.amount.toLocaleString()}</span>
                </div>
              ))}
              <div className="pt-3 border-t-2 border-gray-200 flex items-center justify-between">
                <span className="text-gray-900">Gross Salary</span>
                <span className="text-xl text-gray-900">RM 8,500.00</span>
              </div>
            </div>
          </div>
        </GlassmorphicCard>

        <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
          <div className="p-6">
            <h3 className="text-lg text-gray-900 mb-4">Deductions</h3>
            <div className="space-y-3">
              {[
                { label: 'EPF (11%)', amount: 935 },
                { label: 'SOCSO', amount: 49.50 },
                { label: 'Income Tax (PCB)', amount: 265.50 },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                  <span className="text-sm text-gray-700">{item.label}</span>
                  <span className="text-sm text-red-700">RM {item.toLocaleString()}</span>
                </div>
              ))}
              <div className="pt-3 border-t-2 border-gray-200 flex items-center justify-between">
                <span className="text-gray-900">Total Deductions</span>
                <span className="text-xl text-gray-900">RM 1,250.00</span>
              </div>
            </div>
          </div>
        </GlassmorphicCard>
      </div>

      {/* Salary History */}
      <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
        <div className="p-6">
          <h3 className="text-lg text-gray-900 mb-4">Salary History</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 text-sm text-gray-600">Month</th>
                  <th className="text-right py-3 px-4 text-sm text-gray-600">Gross</th>
                  <th className="text-right py-3 px-4 text-sm text-gray-600">Deductions</th>
                  <th className="text-right py-3 px-4 text-sm text-gray-600">Net</th>
                  <th className="text-center py-3 px-4 text-sm text-gray-600">Status</th>
                  <th className="text-center py-3 px-4 text-sm text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {salaryHistory.map((salary, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900">{salary.month}</td>
                    <td className="py-3 px-4 text-sm text-gray-900 text-right">RM {salary.gross.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm text-red-600 text-right">RM {salary.deductions.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm text-green-600 text-right">RM {salary.net.toLocaleString()}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                        {salary.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button className="text-blue-600 hover:text-blue-700">
                        <Download className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </GlassmorphicCard>
    </div>
  );

  const renderBenefits = () => (
    <div className="space-y-6">
      <h2 className="text-2xl text-gray-900">My Benefits</h2>

      {/* Benefits Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {benefitsData.map((benefit, index) => {
          const Icon = benefit.icon;
          const colorClasses = {
            red: 'bg-red-500',
            green: 'bg-green-500',
            blue: 'bg-blue-500',
            purple: 'bg-purple-500',
          };
          return (
            <GlassmorphicCard key={index} gradient="from-white/80 to-white/60" blur="xl">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 ${colorClasses[benefit.color as keyof typeof colorClasses]} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                    {benefit.status}
                  </span>
                </div>
                <h3 className="text-lg text-gray-900 mb-2">{benefit.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{benefit.provider}</p>
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Coverage</p>
                  <p className="text-sm text-gray-900">{benefit.coverage}</p>
                </div>
              </div>
            </GlassmorphicCard>
          );
        })}
      </div>

      {/* EPF Details */}
      <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
        <div className="p-6">
          <h3 className="text-lg text-gray-900 mb-4 flex items-center gap-2">
            <PiggyBank className="w-5 h-5" />
            EPF (Employees Provident Fund) Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-600 mb-1">Current Balance (Estimated)</p>
              <p className="text-2xl text-blue-700">RM 125,450</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-xs text-green-600 mb-1">Employee Contribution (11%)</p>
              <p className="text-2xl text-green-700">RM 935/month</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-xs text-purple-600 mb-1">Employer Contribution (13%)</p>
              <p className="text-2xl text-purple-700">RM 1,105/month</p>
            </div>
          </div>
        </div>
      </GlassmorphicCard>
    </div>
  );

  const renderPerformance = () => (
    <div className="space-y-6">
      <h2 className="text-2xl text-gray-900">My Performance</h2>

      {/* Performance Score */}
      <GlassmorphicCard gradient="from-purple-500/90 to-pink-600/90" blur="xl">
        <div className="p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm mb-2">Overall Performance Score</p>
              <h2 className="text-6xl mb-2">4.7</h2>
              <p className="text-purple-100">Out of 5.0 • Exceeds Expectations</p>
              <div className="flex items-center gap-2 mt-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className={`w-6 h-6 ${star <= 4.7 ? 'fill-yellow-400 text-yellow-400' : 'text-purple-200'}`} />
                ))}
              </div>
            </div>
            <div className="text-6xl">🏆</div>
          </div>
        </div>
      </GlassmorphicCard>

      {/* Performance Radar Chart */}
      <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl" hover={false}>
        <div className="p-6">
          <h3 className="text-lg text-gray-900 dark:text-gray-100 mb-4">Performance Breakdown</h3>
          <div style={{ width: '100%', height: '400px', minHeight: '400px' }}>
            <ResponsiveContainer width="100%" height="100%" minHeight={400}>
              <RadarChart data={performanceMetrics}>
                <PolarGrid stroke="#E5E7EB" />
                <PolarAngleAxis dataKey="metric" stroke="#6B7280" />
                <PolarRadiusAxis stroke="#6B7280" domain={[0, 5]} />
                <Radar name="Your Score" dataKey="score" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
                <Radar name="Target" dataKey="target" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </GlassmorphicCard>

      {/* Recent Feedback */}
      <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
        <div className="p-6">
          <h3 className="text-lg text-gray-900 mb-4">Recent Feedback</h3>
          <div className="space-y-4">
            {[
              { from: 'Sarah Johnson', role: 'Manager', comment: 'Excellent work on the Q4 project deliverables!', rating: 5, date: '2024-12-01' },
              { from: 'Kumar Singh', role: 'Peer', comment: 'Great collaboration on the API integration.', rating: 5, date: '2024-11-28' },
              { from: 'Nurul Aisyah', role: 'HR', comment: 'Strong leadership in mentoring junior developers.', rating: 4, date: '2024-11-25' },
            ].map((feedback, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm text-gray-900">{feedback.from}</p>
                    <p className="text-xs text-gray-600">{feedback.role}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(feedback.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-2">{feedback.comment}</p>
                <p className="text-xs text-gray-500">{feedback.date}</p>
              </div>
            ))}
          </div>
        </div>
      </GlassmorphicCard>
    </div>
  );

  const renderLearning = () => (
    <div className="space-y-6">
      <h2 className="text-2xl text-gray-900">Learning & Development</h2>

      {/* Learning Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Courses Completed', value: '12', icon: CheckCircle, color: 'green' },
          { label: 'In Progress', value: '3', icon: Activity, color: 'blue' },
          { label: 'Certificates', value: '8', icon: Award, color: 'purple' },
        ].map((stat, index) => {
          const Icon = stat.icon;
          const colorClasses = {
            green: 'bg-green-500',
            blue: 'bg-blue-500',
            purple: 'bg-purple-500',
          };
          return (
            <GlassmorphicCard key={index} gradient="from-white/80 to-white/60" blur="xl">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${colorClasses[stat.color as keyof typeof colorClasses]} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-3xl text-gray-900">{stat.value}</p>
              </div>
            </GlassmorphicCard>
          );
        })}
      </div>

      {/* Current Courses */}
      <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
        <div className="p-6">
          <h3 className="text-lg text-gray-900 mb-4">My Courses</h3>
          <div className="space-y-4">
            {learningCourses.map((course, index) => {
              const statusColors = {
                'In Progress': 'bg-blue-100 text-blue-700',
                'Completed': 'bg-green-100 text-green-700',
                'Not Started': 'bg-gray-100 text-gray-700',
              };
              return (
                <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="text-sm text-gray-900 mb-1">{course.title}</h4>
                      <p className="text-xs text-gray-600">Due: {course.dueDate}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs ${statusColors[course.status as keyof typeof statusColors]}`}>
                      {course.status}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </GlassmorphicCard>

      {/* Available Courses */}
      <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
        <div className="p-6">
          <h3 className="text-lg text-gray-900 mb-4">Recommended Courses</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: 'Cloud Computing Fundamentals', duration: '4 weeks', rating: 4.8 },
              { title: 'Agile Project Management', duration: '3 weeks', rating: 4.6 },
              { title: 'Data Analytics with Python', duration: '6 weeks', rating: 4.9 },
              { title: 'Communication Skills', duration: '2 weeks', rating: 4.5 },
            ].map((course, index) => (
              <div key={index} className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200">
                <h4 className="text-sm text-gray-900 mb-2">{course.title}</h4>
                <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
                  <span>⏱️ {course.duration}</span>
                  <span>⭐ {course.rating}</span>
                </div>
                <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all text-sm">
                  Enroll Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </GlassmorphicCard>
    </div>
  );

  const renderClaims = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl text-gray-900">Claims Management</h2>
        <button
          onClick={() => setShowClaimModal(true)}
          className="px-4 py-2 bg-green-500 text-white rounded-lg border-2 border-green-600 hover:bg-green-600 transition-all shadow-lg"
        >
          <PlusCircle className="w-4 h-4 inline mr-2" />
          Submit Claim
        </button>
      </div>

      {/* Claims Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Total Claims (YTD)', value: 'RM 3,250', icon: DollarSign, color: 'blue' },
          { label: 'Pending Approval', value: 'RM 850', icon: Clock, color: 'yellow' },
          { label: 'Claims Approved', value: 'RM 2,400', icon: CheckCircle, color: 'green' },
        ].map((stat, index) => {
          const Icon = stat.icon;
          const colorClasses = {
            blue: 'bg-blue-500',
            yellow: 'bg-yellow-500',
            green: 'bg-green-500',
          };
          return (
            <GlassmorphicCard key={index} gradient="from-white/80 to-white/60" blur="xl">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${colorClasses[stat.color as keyof typeof colorClasses]} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl text-gray-900">{stat.value}</p>
              </div>
            </GlassmorphicCard>
          );
        })}
      </div>

      {/* Claims List */}
      <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
        <div className="p-6">
          <h3 className="text-lg text-gray-900 mb-4">My Claims</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 text-sm text-gray-600">Claim ID</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-600">Type</th>
                  <th className="text-right py-3 px-4 text-sm text-gray-600">Amount</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-600">Date</th>
                  <th className="text-center py-3 px-4 text-sm text-gray-600">Status</th>
                  <th className="text-center py-3 px-4 text-sm text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingClaims.map((claim, index) => {
                  const statusColors = {
                    Approved: 'bg-green-100 text-green-700',
                    Pending: 'bg-yellow-100 text-yellow-700',
                    Rejected: 'bg-red-100 text-red-700',
                  };
                  return (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-900">{claim.id}</td>
                      <td className="py-3 px-4 text-sm text-gray-900">{claim.type}</td>
                      <td className="py-3 px-4 text-sm text-gray-900 text-right">RM {claim.amount}</td>
                      <td className="py-3 px-4 text-sm text-gray-900">{claim.date}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs ${statusColors[claim.status as keyof typeof statusColors]}`}>
                          {claim.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button className="text-blue-600 hover:text-blue-700">
                          <Eye className="w-4 h-4 inline" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </GlassmorphicCard>
    </div>
  );

  const renderDocuments = () => (
    <div className="space-y-6">
      <h2 className="text-2xl text-gray-900">My Documents</h2>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((doc, index) => (
          <GlassmorphicCard key={index} gradient="from-white/80 to-white/60" blur="xl">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                  {doc.category}
                </span>
              </div>
              <h3 className="text-sm text-gray-900 mb-2">{doc.name}</h3>
              <div className="flex items-center justify-between text-xs text-gray-600 mb-4">
                <span>{doc.date}</span>
                <span>{doc.size}</span>
              </div>
              <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all text-sm">
                <Download className="w-4 h-4 inline mr-2" />
                Download
              </button>
            </div>
          </GlassmorphicCard>
        ))}
      </div>
    </div>
  );

  const renderAnnouncements = () => (
    <div className="space-y-6">
      <h2 className="text-2xl text-gray-900">Company Announcements</h2>

      <div className="space-y-4">
        {announcements.map((announcement) => {
          const Icon = announcement.icon;
          const priorityColors = {
            high: 'bg-red-100 text-red-700 border-red-200',
            medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
            low: 'bg-green-100 text-green-700 border-green-200',
          };
          return (
            <GlassmorphicCard key={announcement.id} gradient="from-white/80 to-white/60" blur="xl">
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${priorityColors[announcement.priority as keyof typeof priorityColors]}`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg text-gray-900 mb-1">{announcement.title}</h3>
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                          {announcement.category}
                        </span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs ${priorityColors[announcement.priority as keyof typeof priorityColors]}`}>
                        {announcement.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{announcement.content}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>📅 {announcement.date}</span>
                      <button className="text-blue-600 hover:text-blue-700 flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3" />
                        Like
                      </button>
                      <button className="text-blue-600 hover:text-blue-700 flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        Comment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </GlassmorphicCard>
          );
        })}
      </div>
    </div>
  );

  const modules = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', name: 'My Profile', icon: User },
    { id: 'leave', name: 'Leave', icon: Calendar },
    { id: 'attendance', name: 'Attendance', icon: Clock },
    { id: 'payslip', name: 'Payslip', icon: Wallet },
    { id: 'benefits', name: 'Benefits', icon: Heart },
    { id: 'performance', name: 'Performance', icon: Target },
    { id: 'learning', name: 'Learning', icon: GraduationCap },
    { id: 'claims', name: 'Claims', icon: DollarSign },
    { id: 'documents', name: 'Documents', icon: FileText },
    { id: 'announcements', name: 'Announcements', icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="flex gap-6 p-6">
        {/* Sidebar Navigation */}
        <div className="w-64 flex-shrink-0">
          <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
            <div className="p-4">
              <h3 className="text-lg text-gray-900 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-600" />
                Employee Portal
              </h3>
              <nav className="space-y-1">
                {modules.map((module) => {
                  const Icon = module.icon;
                  const isActive = activeView === module.id;
                  return (
                    <button
                      key={module.id}
                      onClick={() => setActiveView(module.id as ESSView)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        isActive
                          ? 'bg-blue-500 text-white shadow-lg'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm">{module.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </GlassmorphicCard>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeView === 'dashboard' && renderDashboard()}
              {activeView === 'profile' && renderProfile()}
              {activeView === 'leave' && renderLeave()}
              {activeView === 'attendance' && renderAttendance()}
              {activeView === 'payslip' && renderPayslip()}
              {activeView === 'benefits' && renderBenefits()}
              {activeView === 'performance' && renderPerformance()}
              {activeView === 'learning' && renderLearning()}
              {activeView === 'claims' && renderClaims()}
              {activeView === 'documents' && renderDocuments()}
              {activeView === 'announcements' && renderAnnouncements()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
