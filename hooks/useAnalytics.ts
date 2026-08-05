import { trpc } from "@/lib/trpc";

// ─── Type Definitions ────────────────────────────────────────────────────────

// Employee Report Types
interface EmployeeReportData {
  totalEmployees: number;
  activeEmployees: number;
  newHires: number;
  terminated: number;
  byDepartment: Array<{
    department: string;
    count: number;
    percentage: number;
  }>;
  byStatus: Array<{
    status: string;
    count: number;
  }>;
  byGender: Array<{
    gender: string;
    count: number;
    percentage: number;
  }>;
  byNationality: Array<{
    nationality: string;
    count: number;
  }>;
  averageTenure: number;
  turnoverRate: number;
  periodStart: Date | string;
  periodEnd: Date | string;
}

// Payroll Report Types
interface PayrollReportData {
  totalGrossPay: number;
  totalNetPay: number;
  totalDeductions: number;
  totalEmployerContributions: number;
  byDepartment: Array<{
    department: string;
    totalPay: number;
    employeeCount: number;
    averagePay: number;
  }>;
  byPayrollComponent: Array<{
    component: string;
    amount: number;
    percentage: number;
  }>;
  statutoryDeductions: {
    epf: number;
    socso: number;
    eis: number;
    pcb: number;
  };
  periodStart: Date | string;
  periodEnd: Date | string;
}

// Leave Report Types
interface LeaveReportData {
  totalRequests: number;
  approved: number;
  rejected: number;
  pending: number;
  cancelled: number;
  byLeaveType: Array<{
    leaveType: string;
    count: number;
    totalDays: number;
  }>;
  byDepartment: Array<{
    department: string;
    requests: number;
    daysTaken: number;
  }>;
  utilizationRate: number;
  periodStart: Date | string;
  periodEnd: Date | string;
}

// Attendance Report Types
interface AttendanceReportData {
  totalEmployees: number;
  present: number;
  absent: number;
  late: number;
  onLeave: number;
  byDepartment: Array<{
    department: string;
    present: number;
    absent: number;
    late: number;
    attendanceRate: number;
  }>;
  averageHoursWorked: number;
  overtimeHours: number;
  periodStart: Date | string;
  periodEnd: Date | string;
}

// Compliance Report Types
interface ComplianceReportData {
  totalEmployees: number;
  compliant: number;
  nonCompliant: number;
  pendingReview: number;
  byCategory: Array<{
    category: string;
    compliant: number;
    nonCompliant: number;
    pending: number;
  }>;
  criticalIssues: Array<{
    issue: string;
    count: number;
    severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  }>;
  complianceScore: number;
  periodStart: Date | string;
  periodEnd: Date | string;
}

// Dashboard Stats Types
interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  newHires: number;
  terminated: number;
  openPositions: number;
  pendingLeaves: number;
  pendingApprovals: number;
  complianceScore: number;
  payrollTotal: number;
  attendanceRate: number;
  periodStart: Date | string;
  periodEnd: Date | string;
}

// Dashboard Charts Types
interface DashboardCharts {
  employeeGrowth: Array<{
    month: string;
    count: number;
  }>;
  leaveTrends: Array<{
    month: string;
    approved: number;
    rejected: number;
    pending: number;
  }>;
  payrollDistribution: Array<{
    department: string;
    amount: number;
  }>;
  complianceStatus: Array<{
    category: string;
    compliant: number;
    nonCompliant: number;
  }>;
  turnoverTrends: Array<{
    month: string;
    hires: number;
    terminations: number;
  }>;
  attendanceTrends: Array<{
    month: string;
    rate: number;
  }>;
}

// Query Options Types
interface ReportQueryOptions {
  periodStart?: Date | string;
  periodEnd?: Date | string;
  department?: string;
  employeeId?: string;
}

interface DashboardQueryOptions {
  periodStart?: Date | string;
  periodEnd?: Date | string;
  department?: string;
}

interface QueryOptions {
  enabled?: boolean;
  staleTime?: number;
  refetchOnWindowFocus?: boolean;
  retry?: number;
  retryDelay?: number;
}

// ─── Hook ──────────────────────────────────────────────────────────────────

export function useAnalytics() {
  const utils = trpc.useUtils();

  // Headcount query
  const headcount = {
    getSummary: trpc.analytics.getHeadcountSummary.useQuery,
    getTurnoverRate: trpc.analytics.getTurnoverRate.useQuery,
    getDepartmentBreakdown: trpc.analytics.getDepartmentBreakdown.useQuery,
  };

  // Helper functions for invalidation
  const invalidate = {
    headcount: () => utils.analytics.getHeadcountSummary.invalidate(),
    turnover: () => utils.analytics.getTurnoverRate.invalidate(),
    departmentBreakdown: () => utils.analytics.getDepartmentBreakdown.invalidate(),
    all: async () => {
      await Promise.all([
        utils.analytics.getHeadcountSummary.invalidate(),
        utils.analytics.getTurnoverRate.invalidate(),
        utils.analytics.getDepartmentBreakdown.invalidate(),
      ]);
    },
  };

  return {
    headcount,
    invalidate,
    utils,
  };
}

// ─── Type Exports ────────────────────────────────────────────────────────────

export type {
  EmployeeReportData,
  PayrollReportData,
  LeaveReportData,
  AttendanceReportData,
  ComplianceReportData,
  DashboardStats,
  DashboardCharts,
  ReportQueryOptions,
  DashboardQueryOptions,
  QueryOptions,
};