import React, { useState } from 'react';
import { useRBAC } from '../contexts/RBACContext';
import { 
  Shield, 
  Users, 
  Lock, 
  CheckCircle, 
  XCircle,
  Edit,
  Plus,
  Crown,
  AlertCircle,
  Eye,
  Search
} from 'lucide-react';

export function RoleManagement() {
  const { roles, currentUser, switchRole, getCurrentRole } = useRBAC();
  const [selectedRole, setSelectedRole] = useState(getCurrentRole()?.id || '');
  const [searchTerm, setSearchTerm] = useState('');

  const currentRole = getCurrentRole();

  const permissionCategories = {
    'Employee Management': [
      'employees.view',
      'employees.create',
      'employees.edit',
      'employees.delete',
      'employees.export',
    ],
    'Leave Management': [
      'leave.view',
      'leave.create',
      'leave.approve',
      'leave.reject',
      'leave.cancel',
    ],
    'Attendance': [
      'attendance.view',
      'attendance.edit',
      'attendance.approve',
      'attendance.export',
    ],
    'Payroll': [
      'payroll.view',
      'payroll.process',
      'payroll.approve',
      'payroll.export',
    ],
    'Compliance': [
      'compliance.view',
      'compliance.manage',
      'compliance.reports',
    ],
    'Reports & Analytics': [
      'reports.view',
      'reports.create',
      'reports.export',
      'reports.analytics',
    ],
    'Advanced Modules': [
      'ir.view',
      'ir.manage',
      'er.view',
      'er.manage',
      'foreignworkers.view',
      'foreignworkers.manage',
      'zakat.view',
      'zakat.manage',
    ],
    'System Administration': [
      'settings.view',
      'settings.manage',
      'database.view',
      'database.manage',
      'users.view',
      'users.manage',
      'roles.view',
      'roles.manage',
    ],
  };

  const formatPermission = (permission: string) => {
    const parts = permission.split('.');
    return `${parts[1].charAt(0).toUpperCase()}${parts[1].slice(1)} ${parts[0]}`;
  };

  const getRoleColorClass = (color: string) => {
    const colors: { [key: string]: string } = {
      red: 'bg-red-100 text-red-700 border-red-200',
      blue: 'bg-blue-100 text-blue-700 border-blue-200',
      indigo: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      green: 'bg-green-100 text-green-700 border-green-200',
      purple: 'bg-purple-100 text-purple-700 border-purple-200',
      gray: 'bg-gray-100 text-gray-700 border-gray-200',
    };
    return colors[color] || colors.gray;
  };

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900">Role & Permission Management</h1>
          <p className="text-gray-500">Manage roles and access control for your organization</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create New Role
        </button>
      </div>

      {/* Current User Role */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-sm">
              <Crown className={`w-8 h-8 text-${currentRole?.color}-600`} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-gray-900">{currentUser.name}</h2>
                <span className={`px-3 py-1 rounded-full text-xs border ${
                  currentRole ? getRoleColorClass(currentRole.color) : ''
                }`}>
                  {currentRole?.name}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{currentUser.email}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Shield className="w-4 h-4" />
                  {currentRole?.permissions.length} permissions
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {currentUser.department}
                </span>
              </div>
            </div>
          </div>
          <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
            <Eye className="w-4 h-4" />
            View My Permissions
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search roles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRoles.map((role) => {
          const isCurrentRole = currentUser.roleId === role.id;
          return (
            <div
              key={role.id}
              className={`p-6 rounded-xl border-2 transition-all ${
                isCurrentRole
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-blue-300'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  getRoleColorClass(role.color)
                }`}>
                  <Shield className="w-6 h-6" />
                </div>
                {isCurrentRole && (
                  <div className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
                    Current
                  </div>
                )}
                {role.isSystem && (
                  <div className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-full">
                    System
                  </div>
                )}
              </div>

              <h3 className="text-gray-900 mb-2">{role.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{role.description}</p>

              <div className="flex items-center gap-2 mb-4">
                <Lock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {role.permissions.length} permissions
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedRole(role.id)}
                  className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
                >
                  View Details
                </button>
                {!isCurrentRole && (
                  <button
                    onClick={() => switchRole(role.id)}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                    Switch Role
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Role Details */}
      {selectedRole && (
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-gray-900">
              {roles.find(r => r.id === selectedRole)?.name} - Permissions
            </h3>
            <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2">
              <Edit className="w-4 h-4" />
              Edit Role
            </button>
          </div>

          <div className="space-y-6">
            {Object.entries(permissionCategories).map(([category, permissions]) => {
              const role = roles.find(r => r.id === selectedRole);
              const categoryPermissions = permissions.filter(p => 
                role?.permissions.includes(p as any)
              );
              
              if (categoryPermissions.length === 0) return null;

              return (
                <div key={category}>
                  <h4 className="text-sm text-gray-900 mb-3">{category}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {permissions.map((permission) => {
                      const hasPermission = role?.permissions.includes(permission as any);
                      return (
                        <div
                          key={permission}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
                            hasPermission
                              ? 'border-green-200 bg-green-50'
                              : 'border-gray-200 bg-gray-50'
                          }`}
                        >
                          {hasPermission ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-gray-400" />
                          )}
                          <span className={`text-sm ${
                            hasPermission ? 'text-green-900' : 'text-gray-500'
                          }`}>
                            {formatPermission(permission)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Permission Legend */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <p className="text-sm text-yellow-900">Role Management Information</p>
            <p className="text-xs text-yellow-700 mt-1">
              System roles are predefined and cannot be deleted. Custom roles can be created with specific permission combinations. Changes to roles will affect all users assigned to that role.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
