import React, { ReactNode } from 'react';
import { useRBAC, Permission } from '../contexts/RBACContext';

interface RBACWrapperProps {
  children: ReactNode;
  requiredPermissions?: Permission[];
  requireAll?: boolean;
  fallback?: ReactNode;
}

export function RBACWrapper({ 
  children, 
  requiredPermissions = [], 
  requireAll = false,
  fallback = null 
}: RBACWrapperProps) {
  const { hasPermission, hasAllPermissions, hasAnyPermission } = useRBAC();

  if (requiredPermissions.length === 0) {
    return <>{children}</>;
  }

  const hasAccess = requireAll
    ? hasAllPermissions(requiredPermissions)
    : hasAnyPermission(requiredPermissions);

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

interface RestrictedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  requiredPermissions: Permission[];
  requireAll?: boolean;
  children: ReactNode;
}

export function RestrictedButton({ 
  requiredPermissions, 
  requireAll = false, 
  children, 
  ...props 
}: RestrictedButtonProps) {
  const { hasAllPermissions, hasAnyPermission } = useRBAC();

  const hasAccess = requireAll
    ? hasAllPermissions(requiredPermissions)
    : hasAnyPermission(requiredPermissions);

  if (!hasAccess) {
    return null;
  }

  return <button {...props}>{children}</button>;
}
