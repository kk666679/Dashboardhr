import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Check, 
  X, 
  Clock, 
  Filter,
  ChevronLeft,
  ChevronRight,
  Grid3x3,
  List,
  Download,
  Plus,
  Users,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

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

type ViewMode = 'table' | 'calendar';

export function LeaveManagement() {
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [currentDate, setCurrentDate] = useState(new Date());

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
      employeeName: 'Chen Wei',
      employeeId: 'EMP006',
      leaveType: 'Medical Leave',
      startDate: '2024-12-17',
      endDate: '2024-12-17',
      days: 1,
      reason: 'Medical checkup',
      status: 'approved',
      submittedDate: '2024-12-14'
    },
    {
      id: '7',
      employeeName: 'Fatimah Zahra',
      employeeId: 'EMP007',
      leaveType: 'Annual Leave',
      startDate: '2024-12-24',
      endDate: '2024-12-26',
      days: 3,
      reason: 'Christmas holiday',
      status: 'approved',
      submittedDate: '2024-12-08'
    },
  ];

  const leaveTypes = [
    { name: 'Annual Leave', available: 14, used: 6, total: 20, color: 'blue' },
    { name: 'Medical Leave', available: 12, used: 2, total: 14, color: 'green' },
    { name: 'Hospitalization Leave', available: 60, used: 0, total: 60, color: 'purple' },
    { name: 'Maternity Leave', available: 60, used: 0, total: 60, color: 'pink' },
    { name: 'Paternity Leave', available: 7, used: 0, total: 7, color: 'orange' },
  ];

  const stats = [
    { label: 'Pending Requests', value: leaveRequests.filter(r => r.status === 'pending').length, icon: Clock, color: 'orange' },
    { label: 'Approved This Month', value: leaveRequests.filter(r => r.status === 'approved').length, icon: Check, color: 'green' },
    { label: 'On Leave Today', value: 3, icon: Users, color: 'blue' },
    { label: 'Utilization Rate', value: '68%', icon: TrendingUp, color: 'purple' },
  ];

  const filteredRequests = leaveRequests.filter(req => 
    filterStatus === 'all' || req.status === filterStatus
  );

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

  const getStatusIcon = (status: LeaveRequest['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'approved':
        return <Check className="w-4 h-4" />;
      case 'rejected':
        return <X className="w-4 h-4" />;
    }
  };

  const getLeaveTypeColor = (leaveType: string) => {
    const colorMap: { [key: string]: string } = {
      'Annual Leave': 'bg-blue-500',
      'Medical Leave': 'bg-green-500',
      'Compassionate Leave': 'bg-purple-500',
      'Maternity Leave': 'bg-pink-500',
      'Paternity Leave': 'bg-orange-500',
      'Hospitalization Leave': 'bg-red-500',
    };
    return colorMap[leaveType] || 'bg-gray-500';
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const getLeaveForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return leaveRequests.filter(leave => {
      const start = new Date(leave.startDate);
      const end = new Date(leave.endDate);
      const current = new Date(dateStr);
      return current >= start && current <= end && leave.status === 'approved';
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);
    const days = [];
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(
        <div key={`empty-${i}`} className="min-h-[100px] bg-gray-50 border border-gray-200" />
      );
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayLeaves = getLeaveForDate(date);
      const isToday = date.toDateString() === new Date().toDateString();
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;

      days.push(
        <div
          key={day}
          className={`min-h-[100px] border border-gray-200 p-2 ${
            isWeekend ? 'bg-gray-50' : 'bg-white'
          } ${isToday ? 'ring-2 ring-blue-500' : ''}`}
        >
          <div className={`text-sm mb-2 ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
            {isToday && (
              <span className="inline-block w-6 h-6 bg-blue-600 text-white rounded-full text-center leading-6 text-xs mr-1">
                {day}
              </span>
            )}
            {!isToday && day}
          </div>
          <div className="space-y-1">
            {dayLeaves.slice(0, 3).map((leave) => (
              <div
                key={leave.id}
                className={`text-xs px-2 py-1 rounded ${getLeaveTypeColor(leave.leaveType)} text-white truncate`}
                title={`${leave.employeeName} - ${leave.leaveType}`}
              >
                {leave.employeeName.split(' ')[0]}
              </div>
            ))}
            {dayLeaves.length > 3 && (
              <div className="text-xs text-gray-500 px-2">+{dayLeaves.length - 3} more</div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {/* Week day headers */}
        <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
          {weekDays.map((day) => (
            <div key={day} className="py-3 text-center text-sm text-gray-600">
              {day}
            </div>
          ))}
        </div>
        {/* Calendar grid */}
        <div className="grid grid-cols-7">
          {days}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
            <p className="text-3xl text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Leave Balance Overview */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-gray-900 mb-4">Leave Balance (Malaysian Standards)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {leaveTypes.map((type) => (
            <div key={type.name} className="border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2">{type.name}</p>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-2xl text-gray-900">{type.available}</span>
                <span className="text-sm text-gray-500">/ {type.total} days</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`bg-${type.color}-600 h-2 rounded-full transition-all`}
                  style={{ width: `${(type.available / type.total) * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">{type.used} used</p>
            </div>
          ))}
        </div>
      </div>

      {/* Malaysian Public Holidays Reminder */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-start gap-3">
          <CalendarIcon className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-sm text-blue-900 mb-1">Malaysian Public Holidays - December 2024</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
              <div className="flex items-center gap-2 text-sm text-blue-700">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span>Maulidur Rasul - 16 Dec</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-blue-700">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span>Christmas Day - 25 Dec</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-blue-700">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span>New Year - 1 Jan 2025</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* View Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Requests</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <span className="text-sm text-gray-600">
            {filteredRequests.length} request{filteredRequests.length !== 1 ? 's' : ''}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          {viewMode === 'calendar' && (
            <>
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={goToToday}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
              >
                Today
              </button>
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
              <div className="h-6 w-px bg-gray-300 mx-2"></div>
              <span className="text-sm text-gray-900 min-w-[150px] text-center">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
              <div className="h-6 w-px bg-gray-300 mx-2"></div>
            </>
          )}
          
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
                viewMode === 'table'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <List className="w-4 h-4" />
              List
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
                viewMode === 'calendar'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Grid3x3 className="w-4 h-4" />
              Calendar
            </button>
          </div>
          
          <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Request
          </button>
        </div>
      </div>

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <div>
          {renderCalendar()}
          
          {/* Calendar Legend */}
          <div className="mt-4 bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm text-gray-900 mb-3">Leave Types Legend</h4>
            <div className="flex flex-wrap gap-4">
              {leaveTypes.map((type) => (
                <div key={type.name} className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded bg-${type.color}-500`}></div>
                  <span className="text-sm text-gray-600">{type.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm text-gray-600">Employee</th>
                  <th className="px-6 py-3 text-left text-sm text-gray-600">Leave Type</th>
                  <th className="px-6 py-3 text-left text-sm text-gray-600">Duration</th>
                  <th className="px-6 py-3 text-left text-sm text-gray-600">Days</th>
                  <th className="px-6 py-3 text-left text-sm text-gray-600">Reason</th>
                  <th className="px-6 py-3 text-left text-sm text-gray-600">Status</th>
                  <th className="px-6 py-3 text-left text-sm text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-gray-900">{request.employeeName}</p>
                        <p className="text-xs text-gray-500">{request.employeeId}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded ${getLeaveTypeColor(request.leaveType)}`}></div>
                        <span className="text-sm text-gray-900">{request.leaveType}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="text-gray-900">
                          {new Date(request.startDate).toLocaleDateString('en-MY')}
                        </p>
                        <p className="text-gray-500">
                          to {new Date(request.endDate).toLocaleDateString('en-MY')}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900">{request.days} day{request.days !== 1 ? 's' : ''}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{request.reason}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm ${getStatusColor(request.status)}`}>
                        {getStatusIcon(request.status)}
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {request.status === 'pending' && (
                          <>
                            <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                              <Check className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {request.status !== 'pending' && (
                          <span className="text-sm text-gray-400">No actions</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
