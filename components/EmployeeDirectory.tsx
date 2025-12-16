'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Plus, 
  Filter, 
  Mail, 
  Phone, 
  MapPin, 
  MoreVertical,
  Users,
  TrendingUp,
  Calendar,
  Briefcase,
  Download,
  Upload,
  Grid,
  List,
  X,
  Edit,
  Trash2,
  Eye,
  UserCircle
} from 'lucide-react';
import {
  GlassmorphicCard,
  StaggerContainer,
  StaggerItem,
  SlideIn,
  GlassButton,
  GlassInput,
} from './GlassmorphicCard';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { EmployeeSelfService } from './EmployeeSelfService';

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  location: string;
  joinDate: string;
  status: 'active' | 'on-leave' | 'remote';
  avatar?: string;
  salary?: number;
}

export function EmployeeDirectory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAddModal, setShowAddModal] = useState(false);

  const employees: Employee[] = [
    {
      id: '1',
      name: 'Ahmad bin Abdullah',
      email: 'ahmad.abdullah@company.my',
      phone: '+60 12-345 6789',
      department: 'Engineering',
      position: 'Senior Software Engineer',
      location: 'Kuala Lumpur',
      joinDate: '2022-03-15',
      status: 'active',
      salary: 9500
    },
    {
      id: '2',
      name: 'Siti Nurhaliza',
      email: 'siti.nurhaliza@company.my',
      phone: '+60 12-456 7890',
      department: 'Sales',
      position: 'Sales Manager',
      location: 'Penang',
      joinDate: '2021-07-20',
      status: 'active',
      salary: 8200
    },
    {
      id: '3',
      name: 'Raj Kumar',
      email: 'raj.kumar@company.my',
      phone: '+60 12-567 8901',
      department: 'Marketing',
      position: 'Marketing Specialist',
      location: 'Kuala Lumpur',
      joinDate: '2023-01-10',
      status: 'remote',
      salary: 7100
    },
    {
      id: '4',
      name: 'Lee Mei Ling',
      email: 'lee.meiling@company.my',
      phone: '+60 12-678 9012',
      department: 'HR',
      position: 'HR Manager',
      location: 'Johor Bahru',
      joinDate: '2020-05-01',
      status: 'active',
      salary: 8800
    },
    {
      id: '5',
      name: 'Mohd Faizal',
      email: 'mohd.faizal@company.my',
      phone: '+60 12-789 0123',
      department: 'Engineering',
      position: 'DevOps Engineer',
      location: 'Kuala Lumpur',
      joinDate: '2022-09-15',
      status: 'on-leave',
      salary: 8500
    },
    {
      id: '6',
      name: 'Tan Wei Jian',
      email: 'tan.weijian@company.my',
      phone: '+60 12-890 1234',
      department: 'Operations',
      position: 'Operations Lead',
      location: 'Selangor',
      joinDate: '2021-11-20',
      status: 'active',
      salary: 7800
    },
    {
      id: '7',
      name: 'Nurul Aisyah',
      email: 'nurul.aisyah@company.my',
      phone: '+60 12-901 2345',
      department: 'Engineering',
      position: 'Frontend Developer',
      location: 'Kuala Lumpur',
      joinDate: '2023-02-01',
      status: 'active',
      salary: 6800
    },
    {
      id: '8',
      name: 'David Tan',
      email: 'david.tan@company.my',
      phone: '+60 12-012 3456',
      department: 'Sales',
      position: 'Sales Executive',
      location: 'Penang',
      joinDate: '2022-06-10',
      status: 'active',
      salary: 5500
    },
  ];

  const departments = ['all', 'Engineering', 'Sales', 'Marketing', 'HR', 'Operations'];

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         emp.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = filterDepartment === 'all' || emp.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  const getStatusColor = (status: Employee['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'on-leave':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'remote':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusLabel = (status: Employee['status']) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'on-leave':
        return 'On Leave';
      case 'remote':
        return 'Remote';
      default:
        return status;
    }
  };

  // Analytics Data
  const departmentData = [
    { name: 'Engineering', value: employees.filter(e => e.department === 'Engineering').length },
    { name: 'Sales', value: employees.filter(e => e.department === 'Sales').length },
    { name: 'Marketing', value: employees.filter(e => e.department === 'Marketing').length },
    { name: 'HR', value: employees.filter(e => e.department === 'HR').length },
    { name: 'Operations', value: employees.filter(e => e.department === 'Operations').length },
  ];

  const statusData = [
    { name: 'Active', value: employees.filter(e => e.status === 'active').length },
    { name: 'On Leave', value: employees.filter(e => e.status === 'on-leave').length },
    { name: 'Remote', value: employees.filter(e => e.status === 'remote').length },
  ];

  const COLORS = ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#3B82F6'];

  const stats = [
    {
      label: 'Total Employees',
      value: employees.length,
      change: '+12%',
      icon: Users,
      gradient: 'from-purple-500/80 to-violet-500/80',
    },
    {
      label: 'Active',
      value: employees.filter(e => e.status === 'active').length,
      change: '93.8%',
      icon: TrendingUp,
      gradient: 'from-green-500/80 to-emerald-500/80',
    },
    {
      label: 'On Leave',
      value: employees.filter(e => e.status === 'on-leave').length,
      change: '6.2%',
      icon: Calendar,
      gradient: 'from-orange-500/80 to-amber-500/80',
    },
    {
      label: 'Departments',
      value: departments.length - 1,
      change: '5 Active',
      icon: Briefcase,
      gradient: 'from-blue-500/80 to-cyan-500/80',
    },
  ];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4 sm:p-6 lg:p-8">
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
                Employee Directory
              </motion.h1>
              <p className="text-gray-600 mt-2">Manage and view all employee information</p>
            </div>
            <div className="flex items-center gap-2">
              <GlassButton variant="secondary" onClick={() => {}}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </GlassButton>
              <GlassButton variant="primary" onClick={() => setShowAddModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Employee
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
                          {stat.value}
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
                <h3 className="text-lg font-bold text-gray-900 mb-4">Department Distribution</h3>
                <div style={{ width: '100%', height: '250px', minHeight: '250px' }}>
                  <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={250}>
                    <PieChart>
                      <Pie
                        data={departmentData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {departmentData.map((entry, index) => (
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
                <h3 className="text-lg font-bold text-gray-900 mb-4">Employee Status</h3>
                <div style={{ width: '100%', height: '250px', minHeight: '250px' }}>
                  <ResponsiveContainer width="100%" height="100%" minHeight={250}>
                    <BarChart data={statusData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="name" stroke="#6B7280" />
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

        {/* Filters */}
        <SlideIn direction="up" delay={0.3}>
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
                <select
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                  className="px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                >
                  {departments.map(dept => (
                    <option key={dept} value={dept}>
                      {dept === 'all' ? 'All Departments' : dept}
                    </option>
                  ))}
                </select>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === 'grid'
                        ? 'bg-purple-500 text-white'
                        : 'text-gray-600 hover:bg-white/20'
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === 'list'
                        ? 'bg-purple-500 text-white'
                        : 'text-gray-600 hover:bg-white/20'
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </GlassmorphicCard>
        </SlideIn>

        {/* Employee Grid/List */}
        <AnimatePresence mode="wait">
          {viewMode === 'grid' ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredEmployees.map((employee, index) => (
                  <StaggerItem key={employee.id}>
                    <GlassmorphicCard
                      gradient="from-white/80 to-white/60"
                      blur="xl"
                      animation="scale"
                      delay={index * 0.05}
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                            {getInitials(employee.name)}
                          </div>
                          <button className="text-gray-400 hover:text-gray-600">
                            <MoreVertical className="w-5 h-5" />
                          </button>
                        </div>
                        <h3 className="font-bold text-gray-900 mb-1">{employee.name}</h3>
                        <p className="text-sm text-gray-600 mb-3">{employee.position}</p>
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="w-4 h-4" />
                            <span className="truncate">{employee.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="w-4 h-4" />
                            <span>{employee.phone}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>{employee.location}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(employee.status)}`}>
                            {getStatusLabel(employee.status)}
                          </span>
                          <span className="text-xs text-gray-500">{employee.department}</span>
                        </div>
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
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Position</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Department</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Location</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEmployees.map((employee, index) => (
                        <motion.tr
                          key={employee.id}
                          className="border-b border-gray-100 hover:bg-white/30 transition-colors"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                {getInitials(employee.name)}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">{employee.name}</p>
                                <p className="text-sm text-gray-600">{employee.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">{employee.position}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{employee.department}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{employee.location}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(employee.status)}`}>
                              {getStatusLabel(employee.status)}
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
                              <button className="p-2 hover:bg-white/50 rounded-lg transition-colors">
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </button>
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