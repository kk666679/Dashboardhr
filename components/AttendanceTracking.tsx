'use client';

import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle, Download, RefreshCw, UserCheck, UserX } from 'lucide-react';

interface AttendanceRecord {
  id: string;
  employeeName: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: 'present' | 'late' | 'absent' | 'half-day';
  workHours: string;
  employee: {
    user: {
      name: string;
    };
    department: {
      name: string;
    };
  };
}

export function AttendanceTracking() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch attendance records from backend
  const fetchAttendanceRecords = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/attendance/records');
      if (!response.ok) {
        throw new Error('Failed to fetch attendance records');
      }
      const data = await response.json();
      setAttendanceRecords(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      // Fallback to mock data if API fails
      setAttendanceRecords([
        {
          id: '1',
          employeeName: 'Ahmad bin Abdullah',
          date: '2024-06-15',
          checkIn: '08:45',
          checkOut: '17:30',
          status: 'present',
          workHours: '8h 45m',
          employee: {
            user: { name: 'Ahmad bin Abdullah' },
            department: { name: 'Engineering' }
          }
        },
        {
          id: '2',
          employeeName: 'Siti Nurhaliza',
          date: '2024-06-15',
          checkIn: '09:15',
          checkOut: '17:45',
          status: 'late',
          workHours: '8h 30m',
          employee: {
            user: { name: 'Siti Nurhaliza' },
            department: { name: 'Sales' }
          }
        },
        {
          id: '3',
          employeeName: 'Raj Kumar',
          date: '2024-06-15',
          checkIn: '08:30',
          checkOut: '17:15',
          status: 'present',
          workHours: '8h 45m',
          employee: {
            user: { name: 'Raj Kumar' },
            department: { name: 'Marketing' }
          }
        },
        {
          id: '4',
          employeeName: 'Lee Mei Ling',
          date: '2024-06-15',
          checkIn: '08:55',
          checkOut: '17:20',
          status: 'present',
          workHours: '8h 25m',
          employee: {
            user: { name: 'Lee Mei Ling' },
            department: { name: 'HR' }
          }
        },
        {
          id: '5',
          employeeName: 'Mohd Faizal',
          date: '2024-06-15',
          checkIn: '-',
          checkOut: '-',
          status: 'absent',
          workHours: '0h',
          employee: {
            user: { name: 'Mohd Faizal' },
            department: { name: 'Operations' }
          }
        },
        {
          id: '6',
          employeeName: 'Tan Wei Jian',
          date: '2024-06-15',
          checkIn: '08:40',
          checkOut: '13:00',
          status: 'half-day',
          workHours: '4h 20m',
          employee: {
            user: { name: 'Tan Wei Jian' },
            department: { name: 'Engineering' }
          }
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceRecords();
  }, []);

  const stats = [
    {
      label: 'Present',
      value: attendanceRecords.filter(r => r.status === 'present').length,
      total: attendanceRecords.length,
      color: 'green'
    },
    {
      label: 'Late',
      value: attendanceRecords.filter(r => r.status === 'late').length,
      total: attendanceRecords.length,
      color: 'orange'
    },
    {
      label: 'Absent',
      value: attendanceRecords.filter(r => r.status === 'absent').length,
      total: attendanceRecords.length,
      color: 'red'
    },
    {
      label: 'Half Day',
      value: attendanceRecords.filter(r => r.status === 'half-day').length,
      total: attendanceRecords.length,
      color: 'blue'
    },
  ];

  // Clock in/out functionality
  const handleClockIn = async (employeeId: string) => {
    try {
      const response = await fetch(`/api/attendance/clock-in/${employeeId}`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to clock in');
      }
      await fetchAttendanceRecords(); // Refresh data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clock in');
    }
  };

  const handleClockOut = async (recordId: string) => {
    try {
      const response = await fetch(`/api/attendance/clock-out/${recordId}`, {
        method: 'PUT',
      });
      if (!response.ok) {
        throw new Error('Failed to clock out');
      }
      await fetchAttendanceRecords(); // Refresh data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clock out');
    }
  };

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

  return (
    <div className="space-y-6">
      {/* Date Selector and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Select Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* Attendance Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">{stat.label}</p>
              <div className={`w-3 h-3 rounded-full bg-${stat.color}-500`} />
            </div>
            <p className="text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-1">
              {((stat.value / stat.total) * 100).toFixed(0)}% of total
            </p>
          </div>
        ))}
      </div>

      {/* Malaysian Work Hours Info */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="text-sm text-blue-900">Malaysian Work Hours Standards</h4>
            <p className="text-sm text-blue-700 mt-1">
              Standard work hours: 8 hours/day, 48 hours/week. Overtime applies after normal hours as per Employment Act 1955.
            </p>
          </div>
        </div>
      </div>

      {/* Attendance Records Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-gray-900">Attendance Records - {new Date(selectedDate).toLocaleDateString('en-MY', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm text-gray-600">Employee</th>
                <th className="px-6 py-3 text-left text-sm text-gray-600">Department</th>
                <th className="px-6 py-3 text-left text-sm text-gray-600">Check In</th>
                <th className="px-6 py-3 text-left text-sm text-gray-600">Check Out</th>
                <th className="px-6 py-3 text-left text-sm text-gray-600">Work Hours</th>
                <th className="px-6 py-3 text-left text-sm text-gray-600">Status</th>
                <th className="px-6 py-3 text-left text-sm text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {attendanceRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                        {record.employee?.user?.name?.charAt(0) || record.employeeName.charAt(0)}
                      </div>
                      <span className="text-sm text-gray-900">
                        {record.employee?.user?.name || record.employeeName}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">
                      {record.employee?.department?.name || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900">{record.checkIn}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900">{record.checkOut}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900">{record.workHours}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(record.status)}
                      <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(record.status)}`}>
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1).replace('-', ' ')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {!record.checkIn || record.checkIn === '-' ? (
                        <button
                          onClick={() => handleClockIn(record.id)}
                          className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                        >
                          <UserCheck className="w-3 h-3" />
                          Clock In
                        </button>
                      ) : !record.checkOut || record.checkOut === '-' ? (
                        <button
                          onClick={() => handleClockOut(record.id)}
                          className="flex items-center gap-1 px-3 py-1 bg-orange-600 text-white rounded text-xs hover:bg-orange-700"
                        >
                          <UserX className="w-3 h-3" />
                          Clock Out
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
          <Clock className="w-6 h-6 text-blue-600 mb-2" />
          <h4 className="text-sm text-gray-900 mb-1">Manual Check-in</h4>
          <p className="text-xs text-gray-600">Record attendance manually</p>
        </button>
        <button className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
          <AlertCircle className="w-6 h-6 text-orange-600 mb-2" />
          <h4 className="text-sm text-gray-900 mb-1">Mark Leave</h4>
          <p className="text-xs text-gray-600">Update leave records</p>
        </button>
        <button className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
          <Download className="w-6 h-6 text-purple-600 mb-2" />
          <h4 className="text-sm text-gray-900 mb-1">Monthly Report</h4>
          <p className="text-xs text-gray-600">Generate attendance report</p>
        </button>
      </div>
    </div>
  );
}
