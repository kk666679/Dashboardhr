// HR System Integration Types

export interface HRSystemConfig {
  id: string;
  name: string;
  type:
    | "bamboohr"
    | "successfactors"
    | "epf"
    | "irelam"
    | "autocount"
    | "sql_payroll"
    | "custom";
  apiEndpoint: string;
  authType: "oauth" | "api_key" | "basic" | "sso";
  credentials: Record<string, string>;
  syncEnabled: boolean;
  lastSync?: string;
  syncFrequency: number; // minutes
}

export interface HRWorkerData {
  hrId: string;
  employeeId: string;
  name: string;
  department: string;
  position: string;
  worksite: string;
  permitStatus: string;
  contractStart: string;
  contractEnd: string;
  salary: number;
  manager: string;
  status: "active" | "inactive" | "terminated";
}

export interface PayrollIntegration {
  workerId: string;
  hrId: string;
  attendanceData: {
    date: string;
    checkIn: string;
    checkOut: string;
    totalHours: number;
    overtimeHours: number;
    location: string;
    verified: boolean;
  }[];
  deductions: {
    epf: number;
    socso: number;
    eis: number;
    tax: number;
    levy: number;
  };
  allowances: {
    overtime: number;
    transport: number;
    meal: number;
  };
}

export interface ComplianceSync {
  workerId: string;
  permitData: {
    number: string;
    type: string;
    expiryDate: string;
    status: string;
    worksite: string;
  };
  locationCompliance: {
    authorizedLocations: string[];
    currentLocation: string;
    violations: number;
    lastViolation?: string;
  };
  medicalStatus: {
    lastExam: string;
    nextDue: string;
    status: "fit" | "unfit" | "pending";
  };
}

export interface SSOConfig {
  provider: "azure_ad" | "google" | "okta" | "custom";
  clientId: string;
  tenantId?: string;
  domain?: string;
  redirectUri: string;
  scopes: string[];
}
