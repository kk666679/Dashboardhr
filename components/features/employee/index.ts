/**
 * Employee Module Exports
 * 
 * Central export point for all employee-related components, types, and services.
 * Following FWMS module structure conventions.
 * 
 * @example
 * import { EmployeeTable, EmployeeCard, type EmployeeRow } from '@/components/features/employee'
 */

// UI Components
export { EmployeeTable, EmployeeCard, type EmployeeRow } from './employee';
export { VisaStatusCard } from '../expatriates/VisaStatusCard';
// VisaPermitForm stub — not yet implemented in employee directory
export const VisaPermitForm = () => null;
export { AutomatedAttendance } from './automated-attendance';
export { ExpatDashboard } from '../expatriates/ExpatDashboard';

// Services
export * from './employee-service';
export * from './service';

// Types and Schemas
export * from './types';
export * from './schema';

// Actions
export * from './actions';
