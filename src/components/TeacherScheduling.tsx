import React, { useState } from 'react';
import { 
  Calendar,
  Clock,
  Users,
  Video,
  Plus,
  Search,
  Filter,
  Download,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  BarChart3,
  UserCheck,
  Mail,
  Phone,
  MapPin,
  Star,
  BookOpen,
  DollarSign,
  Repeat,
  X
} from 'lucide-react';

interface Teacher {
  id: number;
  name: string;
  status: 'available' | 'busy' | 'partially';
  color: string;
  email?: string;
  phone?: string;
  subjects?: string[];
  rating?: number;
  totalSessions?: number;
  availability?: { day: number; startHour: number; endHour: number }[];
}

interface Appointment {
  id: number;
  teacherId: number;
  teacherName: string;
  studentName: string;
  studentEmail?: string;
  day: number;
  startHour: number;
  endHour: number;
  notes: string;
  subject?: string;
  zoomLink: string;
  color: string;
  status?: 'scheduled' | 'completed' | 'cancelled';
  recurring?: boolean;
  recurringPattern?: 'weekly' | 'biweekly' | 'monthly';
  price?: number;
}

type ViewMode = 'dashboard' | 'calendar' | 'teachers' | 'students' | 'analytics';

export function TeacherScheduling() {
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [calendarView, setCalendarView] = useState<'weekly' | 'daily' | 'monthly'>('weekly');

  const teachers: Teacher[] = [
    { 
      id: 1, 
      name: 'Mr. Ahmed Hassan', 
      status: 'available', 
      color: 'bg-blue-500',
      email: 'ahmed@school.com',
      phone: '+60 12-345 6789',
      subjects: ['Mathematics', 'Physics'],
      rating: 4.9,
      totalSessions: 156,
      availability: [
        { day: 1, startHour: 9, endHour: 17 },
        { day: 2, startHour: 9, endHour: 17 },
        { day: 3, startHour: 9, endHour: 17 },
      ]
    },
    { 
      id: 2, 
      name: 'Ms. Sarah Lim', 
      status: 'busy', 
      color: 'bg-green-500',
      email: 'sarah@school.com',
      phone: '+60 12-456 7890',
      subjects: ['English', 'Literature'],
      rating: 4.8,
      totalSessions: 203,
      availability: [
        { day: 1, startHour: 10, endHour: 18 },
        { day: 3, startHour: 10, endHour: 18 },
        { day: 5, startHour: 10, endHour: 18 },
      ]
    },
    { 
      id: 3, 
      name: 'Dr. Hassan Ali', 
      status: 'partially', 
      color: 'bg-purple-500',
      email: 'hassan@school.com',
      phone: '+60 12-567 8901',
      subjects: ['Physics', 'Chemistry'],
      rating: 5.0,
      totalSessions: 89,
      availability: [
        { day: 2, startHour: 14, endHour: 20 },
        { day: 4, startHour: 14, endHour: 20 },
      ]
    },
    { 
      id: 4, 
      name: 'Ms. Fatima Zahra', 
      status: 'available', 
      color: 'bg-orange-500',
      email: 'fatima@school.com',
      phone: '+60 12-678 9012',
      subjects: ['Chemistry', 'Biology'],
      rating: 4.7,
      totalSessions: 134,
      availability: [
        { day: 1, startHour: 9, endHour: 15 },
        { day: 2, startHour: 9, endHour: 15 },
        { day: 3, startHour: 9, endHour: 15 },
        { day: 4, startHour: 9, endHour: 15 },
      ]
    },
    { 
      id: 5, 
      name: 'Mr. Omar Yusuf', 
      status: 'busy', 
      color: 'bg-red-500',
      email: 'omar@school.com',
      phone: '+60 12-789 0123',
      subjects: ['Mathematics', 'Computer Science'],
      rating: 4.6,
      totalSessions: 178,
      availability: [
        { day: 1, startHour: 13, endHour: 19 },
        { day: 3, startHour: 13, endHour: 19 },
        { day: 5, startHour: 13, endHour: 19 },
      ]
    },
  ];

  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 1,
      teacherId: 1,
      teacherName: 'Mr. Ahmed Hassan',
      studentName: 'Ali Hassan',
      studentEmail: 'ali@student.com',
      day: 1,
      startHour: 10,
      endHour: 11,
      notes: 'Algebra review and practice problems',
      subject: 'Mathematics',
      zoomLink: 'https://zoom.us/j/123456789',
      color: 'bg-blue-500',
      status: 'scheduled',
      recurring: true,
      recurringPattern: 'weekly',
      price: 80
    },
    {
      id: 2,
      teacherId: 2,
      teacherName: 'Ms. Sarah Lim',
      studentName: 'Amira Khalil',
      studentEmail: 'amira@student.com',
      day: 1,
      startHour: 14,
      endHour: 15,
      notes: 'Shakespeare literature analysis',
      subject: 'English',
      zoomLink: 'https://zoom.us/j/987654321',
      color: 'bg-green-500',
      status: 'completed',
      price: 75
    },
    {
      id: 3,
      teacherId: 3,
      teacherName: 'Dr. Hassan Ali',
      studentName: 'Mohamed Ali',
      studentEmail: 'mohamed@student.com',
      day: 2,
      startHour: 15,
      endHour: 16,
      notes: 'Mechanics and motion study',
      subject: 'Physics',
      zoomLink: 'https://zoom.us/j/456789123',
      color: 'bg-purple-500',
      status: 'scheduled',
      recurring: true,
      recurringPattern: 'weekly',
      price: 90
    },
    {
      id: 4,
      teacherId: 1,
      teacherName: 'Mr. Ahmed Hassan',
      studentName: 'Layla Ahmed',
      studentEmail: 'layla@student.com',
      day: 3,
      startHour: 11,
      endHour: 12,
      notes: 'Calculus derivatives and integration',
      subject: 'Mathematics',
      zoomLink: 'https://zoom.us/j/789123456',
      color: 'bg-blue-500',
      status: 'scheduled',
      price: 80
    },
    {
      id: 5,
      teacherId: 4,
      teacherName: 'Ms. Fatima Zahra',
      studentName: 'Yusuf Hassan',
      studentEmail: 'yusuf@student.com',
      day: 4,
      startHour: 10,
      endHour: 11,
      notes: 'Organic chemistry compounds',
      subject: 'Chemistry',
      zoomLink: 'https://zoom.us/j/321654987',
      color: 'bg-orange-500',
      status: 'scheduled',
      recurring: true,
      recurringPattern: 'biweekly',
      price: 85
    },
  ]);

  const stats = [
    { 
      label: 'Total Sessions', 
      value: appointments.length.toString(), 
      icon: Calendar, 
      color: 'blue',
      trend: '+12%',
      description: 'This week'
    },
    { 
      label: 'Active Teachers', 
      value: teachers.filter(t => t.status === 'available' || t.status === 'partially').length.toString(), 
      icon: Users, 
      color: 'green',
      trend: '+2',
      description: 'Available now'
    },
    { 
      label: 'Completion Rate', 
      value: '94%', 
      icon: CheckCircle, 
      color: 'purple',
      trend: '+5%',
      description: 'Last 30 days'
    },
    { 
      label: 'Revenue', 
      value: `RM ${appointments.reduce((sum, apt) => sum + (apt.price || 0), 0)}`, 
      icon: DollarSign, 
      color: 'orange',
      trend: '+18%',
      description: 'This week'
    },
  ];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const hours = Array.from({ length: 13 }, (_, i) => i + 8); // 8 AM to 8 PM

  const getStatusColor = (status: string) => {
    const colors = {
      available: 'bg-green-100 text-green-700 border-green-200',
      busy: 'bg-red-100 text-red-700 border-red-200',
      partially: 'bg-orange-100 text-orange-700 border-orange-200',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getAppointmentStatusColor = (status?: string) => {
    const colors = {
      scheduled: 'bg-blue-100 text-blue-700 border-blue-200',
      completed: 'bg-green-100 text-green-700 border-green-200',
      cancelled: 'bg-red-100 text-red-700 border-red-200',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
              <span className={`text-sm text-${stat.color}-600 bg-${stat.color}-50 px-2 py-1 rounded`}>
                {stat.trend}
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
            <p className="text-3xl text-gray-900 mb-1">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.description}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Sessions */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg text-gray-900">Upcoming Sessions</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700">View All</button>
          </div>
          <div className="space-y-3">
            {appointments.filter(apt => apt.status === 'scheduled').slice(0, 4).map((apt) => (
              <div key={apt.id} className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <div className={`w-12 h-12 ${apt.color} rounded-lg flex items-center justify-center text-white flex-shrink-0`}>
                  {apt.teacherName.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-900 truncate">{apt.studentName}</p>
                    {apt.recurring && (
                      <Repeat className="w-3 h-3 text-gray-400" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{apt.subject} • {apt.teacherName}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm text-gray-900">{days[apt.day]}</p>
                  <p className="text-xs text-gray-500">{apt.startHour}:00 - {apt.endHour}:00</p>
                </div>
                <button className="p-2 hover:bg-blue-50 rounded-lg">
                  <Video className="w-4 h-4 text-blue-600" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Teacher Availability */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg text-gray-900 mb-4">Teacher Status</h3>
          <div className="space-y-3">
            {teachers.map((teacher) => (
              <div key={teacher.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${teacher.color} rounded-full flex items-center justify-center text-white text-sm`}>
                    {teacher.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">{teacher.name}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      <span className="text-xs text-gray-500">{teacher.rating}</span>
                    </div>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded border ${getStatusColor(teacher.status)}`}>
                  {teacher.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg text-gray-900 mb-4">Session Distribution</h3>
          <div className="space-y-3">
            {['Mathematics', 'Physics', 'Chemistry', 'English', 'Biology'].map((subject, index) => {
              const count = appointments.filter(apt => apt.subject === subject).length;
              const percentage = (count / appointments.length) * 100;
              return (
                <div key={subject}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">{subject}</span>
                    <span className="text-sm text-gray-900">{count} sessions</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${['bg-blue-500', 'bg-purple-500', 'bg-orange-500', 'bg-green-500', 'bg-red-500'][index]}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg text-gray-900 mb-4">Performance Metrics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700 mb-1">Avg. Session Duration</p>
              <p className="text-2xl text-blue-900">58 min</p>
            </div>
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700 mb-1">Student Satisfaction</p>
              <p className="text-2xl text-green-900">4.8/5</p>
            </div>
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <p className="text-sm text-purple-700 mb-1">Recurring Students</p>
              <p className="text-2xl text-purple-900">76%</p>
            </div>
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-sm text-orange-700 mb-1">Cancellation Rate</p>
              <p className="text-2xl text-orange-900">6%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCalendar = () => (
    <div className="space-y-6">
      {/* Calendar Controls */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="text-center">
              <p className="text-lg text-gray-900">Week of {currentWeek.toLocaleDateString('en-MY')}</p>
              <p className="text-sm text-gray-500">December 2024</p>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              {(['daily', 'weekly', 'monthly'] as const).map((view) => (
                <button
                  key={view}
                  onClick={() => setCalendarView(view)}
                  className={`px-4 py-2 rounded-lg text-sm capitalize transition-colors ${
                    calendarView === view
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {view}
                </button>
              ))}
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Appointment
            </button>
          </div>
        </div>
      </div>

      {/* Weekly Calendar Grid */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[1000px]">
            {/* Header with days */}
            <div className="grid grid-cols-8 border-b border-gray-200 bg-gray-50">
              <div className="p-4 border-r border-gray-200">
                <p className="text-sm text-gray-600">Time</p>
              </div>
              {days.slice(0, 7).map((day, index) => (
                <div key={day} className="p-4 border-r border-gray-200">
                  <p className="text-sm text-gray-900">{day}</p>
                  <p className="text-xs text-gray-500">Dec {16 + index}</p>
                </div>
              ))}
            </div>

            {/* Time slots */}
            <div className="divide-y divide-gray-200">
              {hours.map((hour) => (
                <div key={hour} className="grid grid-cols-8">
                  <div className="p-4 border-r border-gray-200 bg-gray-50">
                    <p className="text-sm text-gray-600">{hour}:00</p>
                  </div>
                  {days.map((_, dayIndex) => {
                    const dayAppointments = appointments.filter(
                      apt => apt.day === dayIndex && apt.startHour === hour
                    );
                    return (
                      <div
                        key={dayIndex}
                        className="p-2 border-r border-gray-200 min-h-[80px] hover:bg-gray-50 cursor-pointer relative"
                      >
                        {dayAppointments.map((apt) => (
                          <div
                            key={apt.id}
                            onClick={() => {
                              setSelectedAppointment(apt);
                              setIsAppointmentModalOpen(true);
                            }}
                            className={`${apt.color} text-white p-2 rounded-lg text-xs mb-1 hover:opacity-90 cursor-pointer`}
                            style={{ height: `${(apt.endHour - apt.startHour) * 80}px` }}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <p className="truncate">{apt.studentName}</p>
                              {apt.recurring && <Repeat className="w-3 h-3" />}
                            </div>
                            <p className="text-xs opacity-90 truncate">{apt.subject}</p>
                            <p className="text-xs opacity-75">
                              {apt.startHour}:00 - {apt.endHour}:00
                            </p>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTeachers = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teachers.map((teacher) => (
          <div key={teacher.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 ${teacher.color} rounded-full flex items-center justify-center text-white text-xl`}>
                  {teacher.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-lg text-gray-900">{teacher.name}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm text-gray-600">{teacher.rating} ({teacher.totalSessions} sessions)</span>
                  </div>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded border ${getStatusColor(teacher.status)}`}>
                {teacher.status}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="w-4 h-4" />
                {teacher.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
                {teacher.phone}
              </div>
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <BookOpen className="w-4 h-4 mt-0.5" />
                <div className="flex flex-wrap gap-1">
                  {teacher.subjects?.map((subject) => (
                    <span key={subject} className="px-2 py-1 bg-gray-100 rounded text-xs">
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Availability</p>
              <div className="flex flex-wrap gap-1">
                {teacher.availability?.map((slot, index) => (
                  <span key={index} className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded">
                    {days[slot.day]} {slot.startHour}:00-{slot.endHour}:00
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Book Session
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-gray-900 flex items-center gap-2">
              <Calendar className="w-7 h-7 text-blue-600" />
              Teacher Scheduling System
            </h1>
            <p className="text-gray-500">Manage appointments, teachers, and student sessions</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search teachers or students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Bell className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="flex gap-6">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'calendar', label: 'Calendar', icon: Calendar },
            { id: 'teachers', label: 'Teachers', icon: Users },
            { id: 'students', label: 'Students', icon: UserCheck },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setViewMode(tab.id as ViewMode)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                viewMode === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        {viewMode === 'dashboard' && renderDashboard()}
        {viewMode === 'calendar' && renderCalendar()}
        {viewMode === 'teachers' && renderTeachers()}
        {viewMode === 'students' && (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">Student management coming soon</p>
          </div>
        )}
        {viewMode === 'analytics' && (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">Advanced analytics coming soon</p>
          </div>
        )}
      </div>

      {/* Appointment Detail Modal */}
      {isAppointmentModalOpen && selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 ${selectedAppointment.color} rounded-lg flex items-center justify-center text-white`}>
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl text-gray-900">{selectedAppointment.subject}</h2>
                    <span className={`inline-block mt-1 text-xs px-2 py-1 rounded border ${getAppointmentStatusColor(selectedAppointment.status)}`}>
                      {selectedAppointment.status}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsAppointmentModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Student</p>
                    <p className="text-gray-900">{selectedAppointment.studentName}</p>
                    <p className="text-sm text-gray-500">{selectedAppointment.studentEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Teacher</p>
                    <p className="text-gray-900">{selectedAppointment.teacherName}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Date & Time</p>
                    <p className="text-gray-900">{days[selectedAppointment.day]}</p>
                    <p className="text-sm text-gray-600">
                      {selectedAppointment.startHour}:00 - {selectedAppointment.endHour}:00
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Duration</p>
                    <p className="text-gray-900">{selectedAppointment.endHour - selectedAppointment.startHour} hour</p>
                    {selectedAppointment.recurring && (
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Repeat className="w-3 h-3" />
                        Repeats {selectedAppointment.recurringPattern}
                      </p>
                    )}
                  </div>
                </div>

                {selectedAppointment.price && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Session Fee</p>
                    <p className="text-2xl text-gray-900">RM {selectedAppointment.price}</p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-gray-500 mb-1">Notes</p>
                  <p className="text-gray-900">{selectedAppointment.notes}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Zoom Link</p>
                  <a
                    href={selectedAppointment.zoomLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 flex items-center gap-2"
                  >
                    <Video className="w-4 h-4" />
                    Join Meeting
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-200">
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Edit Appointment
                </button>
                <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                  Send Reminder
                </button>
                <button className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
