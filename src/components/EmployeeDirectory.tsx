import React, { useState } from 'react';
import { Search, Plus, Filter, Mail, Phone, MapPin, MoreVertical } from 'lucide-react';

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
}

export function EmployeeDirectory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');

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
      status: 'active'
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
      status: 'active'
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
      status: 'remote'
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
      status: 'active'
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
      status: 'on-leave'
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
      status: 'active'
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
        return 'bg-green-100 text-green-700';
      case 'on-leave':
        return 'bg-orange-100 text-orange-700';
      case 'remote':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: Employee['status']) => {
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

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 w-full sm:max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="flex-1 sm:flex-none px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {departments.map(dept => (
              <option key={dept} value={dept}>
                {dept === 'all' ? 'All Departments' : dept}
              </option>
            ))}
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Add Employee</span>
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Total</p>
          <p className="text-gray-900 mt-1">{employees.length}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Active</p>
          <p className="text-gray-900 mt-1">
            {employees.filter(e => e.status === 'active').length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">On Leave</p>
          <p className="text-gray-900 mt-1">
            {employees.filter(e => e.status === 'on-leave').length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Remote</p>
          <p className="text-gray-900 mt-1">
            {employees.filter(e => e.status === 'remote').length}
          </p>
        </div>
      </div>

      {/* Employee Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.map((employee) => (
          <div key={employee.id} className="bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-300 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  {employee.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <h3 className="text-gray-900">{employee.name}</h3>
                  <p className="text-sm text-gray-600">{employee.position}</p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>

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

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <span className="text-sm text-gray-600">{employee.department}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(employee.status)}`}>
                {getStatusText(employee.status)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredEmployees.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No employees found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
