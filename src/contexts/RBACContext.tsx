import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Permission = 
  // Employee Management
  | 'employees.view'
  | 'employees.create'
  | 'employees.edit'
  | 'employees.delete'
  | 'employees.export'
  // Leave Management
  | 'leave.view'
  | 'leave.create'
  | 'leave.approve'
  | 'leave.reject'
  | 'leave.cancel'
  // Attendance
  | 'attendance.view'
  | 'attendance.edit'
  | 'attendance.approve'
  | 'attendance.export'
  // Payroll
  | 'payroll.view'
  | 'payroll.process'
  | 'payroll.approve'
  | 'payroll.export'
  // Compliance
  | 'compliance.view'
  | 'compliance.manage'
  | 'compliance.reports'
  // Reports
  | 'reports.view'
  | 'reports.create'
  | 'reports.export'
  | 'reports.analytics'
  // Advanced Modules
  | 'ir.view'
  | 'ir.manage'
  | 'er.view'
  | 'er.manage'
  | 'foreignworkers.view'
  | 'foreignworkers.manage'
  | 'zakat.view'
  | 'zakat.manage'
  // System
  | 'settings.view'
  | 'settings.manage'
  | 'database.view'
  | 'database.manage'
  | 'users.view'
  | 'users.manage'
  | 'roles.view'
  | 'roles.manage';

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  isSystem: boolean;
  color: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  roleId: string;
  tenantId: string;
  department?: string;
  position?: string;
}

interface RBACContextType {
  currentUser: User;
  roles: Role[];
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
  switchRole: (roleId: string) => void;
  getCurrentRole: () => Role | undefined;
}

const RBACContext = createContext<RBACContextType | undefined>(undefined);

export function RBACProvider({ children }: { children: ReactNode }) {
  const roles: Role[] = [
    {
      id: 'super-admin',
      name: 'Super Admin',
      description: 'Full system access across all tenants',
      isSystem: true,
      color: 'red',
      permissions: [
        'employees.view', 'employees.create', 'employees.edit', 'employees.delete', 'employees.export',
        'leave.view', 'leave.create', 'leave.approve', 'leave.reject', 'leave.cancel',
        'attendance.view', 'attendance.edit', 'attendance.approve', 'attendance.export',
        'payroll.view', 'payroll.process', 'payroll.approve', 'payroll.export',
        'compliance.view', 'compliance.manage', 'compliance.reports',
        'reports.view', 'reports.create', 'reports.export', 'reports.analytics',
        'ir.view', 'ir.manage', 'er.view', 'er.manage',
        'foreignworkers.view', 'foreignworkers.manage',
        'zakat.view', 'zakat.manage',
        'settings.view', 'settings.manage',
        'database.view', 'database.manage',
        'users.view', 'users.manage',
        'roles.view', 'roles.manage',
      ],
    },
    {
      id: 'hr-admin',
      name: 'HR Admin',
      description: 'Full HR management access',
      isSystem: true,
      color: 'blue',
      permissions: [
        'employees.view', 'employees.create', 'employees.edit', 'employees.delete', 'employees.export',
        'leave.view', 'leave.create', 'leave.approve', 'leave.reject', 'leave.cancel',
        'attendance.view', 'attendance.edit', 'attendance.approve', 'attendance.export',
        'payroll.view', 'payroll.process', 'payroll.approve', 'payroll.export',
        'compliance.view', 'compliance.manage', 'compliance.reports',
        'reports.view', 'reports.create', 'reports.export', 'reports.analytics',
        'ir.view', 'ir.manage', 'er.view', 'er.manage',
        'foreignworkers.view', 'foreignworkers.manage',
        'zakat.view', 'zakat.manage',
        'settings.view',
        'users.view',
      ],
    },
    {
      id: 'hr-manager',
      name: 'HR Manager',
      description: 'HR operations and approvals',
      isSystem: true,
      color: 'indigo',
      permissions: [
        'employees.view', 'employees.create', 'employees.edit', 'employees.export',
        'leave.view', 'leave.create', 'leave.approve', 'leave.reject',
        'attendance.view', 'attendance.approve', 'attendance.export',
        'payroll.view', 'payroll.export',
        'compliance.view', 'compliance.reports',
        'reports.view', 'reports.create', 'reports.export',
        'ir.view', 'er.view', 'er.manage',
        'foreignworkers.view', 'foreignworkers.manage',
        'zakat.view',
      ],
    },
    {
      id: 'payroll-specialist',
      name: 'Payroll Specialist',
      description: 'Payroll processing and compliance',
      isSystem: true,
      color: 'green',
      permissions: [
        'employees.view',
        'attendance.view', 'attendance.export',
        'payroll.view', 'payroll.process', 'payroll.export',
        'compliance.view', 'compliance.reports',
        'reports.view', 'reports.export',
        'zakat.view', 'zakat.manage',
      ],
    },
    {
      id: 'manager',
      name: 'Department Manager',
      description: 'Team management and approvals',
      isSystem: true,
      color: 'purple',
      permissions: [
        'employees.view',
        'leave.view', 'leave.approve', 'leave.reject',
        'attendance.view', 'attendance.approve',
        'reports.view',
        'er.view',
      ],
    },
    {
      id: 'employee',
      name: 'Employee',
      description: 'Basic employee self-service',
      isSystem: true,
      color: 'gray',
      permissions: [
        'employees.view',
        'leave.view', 'leave.create',
        'attendance.view',
        'payroll.view',
        'reports.view',
      ],
    },
  ];

  const [currentUser, setCurrentUser] = useState<User>({
    id: '1',
    name: 'Admin User',
    email: 'admin@company.my',
    roleId: 'super-admin',
    tenantId: '1',
    department: 'IT',
    position: 'System Administrator',
  });

  const getCurrentRole = () => {
    return roles.find((role) => role.id === currentUser.roleId);
  };

  const hasPermission = (permission: Permission): boolean => {
    const role = getCurrentRole();
    return role ? role.permissions.includes(permission) : false;
  };

  const hasAnyPermission = (permissions: Permission[]): boolean => {
    return permissions.some((permission) => hasPermission(permission));
  };

  const hasAllPermissions = (permissions: Permission[]): boolean => {
    return permissions.every((permission) => hasPermission(permission));
  };

  const switchRole = (roleId: string) => {
    setCurrentUser({ ...currentUser, roleId });
  };

  return (
    <RBACContext.Provider
      value={{
        currentUser,
        roles,
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        switchRole,
        getCurrentRole,
      }}
    >
      {children}
    </RBACContext.Provider>
  );
}

export function useRBAC() {
  const context = useContext(RBACContext);
  if (context === undefined) {
    throw new Error('useRBAC must be used within a RBACProvider');
  }
  return context;
}
