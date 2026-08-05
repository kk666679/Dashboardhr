import { NextRequest, NextResponse } from "next/server";

// Type definitions
interface Worker {
  id?: string;
  hrId?: string;
  employeeId?: string;
  name?: string;
  department?: string;
  position?: string;
  status?: string;
  employeeNumber?: string;
  firstName?: string;
  lastName?: string;
  jobTitle?: string;
  salary?: number;
  attendanceHours?: number;
  overtimeHours?: number;
  epfNumber?: string;
  permitNumber?: string;
  worksite?: string;
  lastKnownLocation?: string;
  locationCompliant?: boolean;
  [key: string]: unknown;
}

interface AttendanceRecord {
  workerId: string;
  date: string;
  totalHours: number;
  location: string;
  [key: string]: unknown;
}

interface BambooHREmployee {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  department: string;
  jobTitle: string;
  status: string;
  [key: string]: unknown;
}

interface BambooHRResponse {
  employees: BambooHREmployee[];
  [key: string]: unknown;
}

interface PayrollData {
  workers: Worker[];
  [key: string]: unknown;
}

interface EPFData {
  workers: Worker[];
  month: string;
  year: string;
  [key: string]: unknown;
}

interface JTKData {
  workers: Worker[];
  violations?: unknown[];
  [key: string]: unknown;
}

interface RequestBody {
  system: string;
  action: string;
  data: PayrollData | EPFData | JTKData | { attendance: AttendanceRecord[] } | Record<string, unknown>;
}

// HR System Integration Hub
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as RequestBody;
    const { system, action, data } = body;

    switch (system) {
      case "bamboohr":
        return await syncBambooHR(action, data);
      case "autocount":
        return await syncAutoCount(action, data as PayrollData);
      case "epf":
        return await syncEPF(action, data as EPFData);
      case "jtk":
        return await syncJTK(action, data as JTKData);
      default:
        return NextResponse.json(
          { error: "Unsupported system" },
          { status: 400 },
        );
    }
  } catch (error) {
    console.error("HR sync error:", error);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}

async function syncBambooHR(action: string, data: Record<string, unknown>) {
  // BambooHR API integration
  const apiKey = process.env.BAMBOOHR_API_KEY;
  const subdomain = process.env.BAMBOOHR_SUBDOMAIN;

  if (action === "pull_workers") {
    if (!subdomain || !apiKey) {
      return NextResponse.json(
        { error: "BambooHR credentials not configured" },
        { status: 500 },
      );
    }
    const allowedSubdomainPattern = /^[a-zA-Z0-9-]+$/;
    if (!allowedSubdomainPattern.test(subdomain)) {
      return NextResponse.json({ error: "Invalid subdomain" }, { status: 400 });
    }
    // Fetch employee data from BambooHR
    const response = await fetch(
      `https://api.bamboohr.com/api/gateway.php/${encodeURIComponent(subdomain)}/v1/employees/directory`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${apiKey}:x`).toString("base64")}`,
          Accept: "application/json",
        },
      },
    );

    if (response.ok) {
      const employees = await response.json() as BambooHRResponse;
      return NextResponse.json({
        success: true,
        data: employees.employees.map((emp: BambooHREmployee) => ({
          hrId: emp.id,
          employeeId: emp.employeeNumber,
          name: `${emp.firstName} ${emp.lastName}`,
          department: emp.department,
          position: emp.jobTitle,
          status: emp.status === "Active" ? "active" : "inactive",
        })),
      });
    }

    return NextResponse.json(
      { error: "Failed to fetch employees from BambooHR" },
      { status: response.status },
    );
  }

  if (action === "push_attendance") {
    // Push attendance data to BambooHR
    const attendanceData = (data.attendance as AttendanceRecord[] | undefined)?.map((record: AttendanceRecord) => ({
      employeeId: record.workerId,
      date: record.date,
      hoursWorked: record.totalHours,
      location: record.location,
    })) || [];

    // BambooHR doesn't have direct attendance API, use time tracking
    return NextResponse.json({
      success: true,
      message: "Attendance logged",
      processed: attendanceData.length
    });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}

async function syncAutoCount(action: string, data: PayrollData) {
  // AutoCount Payroll integration
  const apiUrl = process.env.AUTOCOUNT_API_URL;
  const apiKey = process.env.AUTOCOUNT_API_KEY;

  if (action === "sync_payroll") {
    const payrollData = {
      employees: data.workers?.map((worker: Worker) => ({
        employeeCode: worker.hrId || worker.id,
        basicSalary: worker.salary || 0,
        attendance: worker.attendanceHours || 0,
        overtime: worker.overtimeHours || 0,
        deductions: {
          epf: (worker.salary || 0) * 0.11, // 11% EPF
          socso: Math.min((worker.salary || 0) * 0.005, 24.5), // SOCSO calculation
          eis: Math.min((worker.salary || 0) * 0.002, 7.9), // EIS calculation
        },
      })) || [],
    };

    // Mock API call - implement actual AutoCount integration
    return NextResponse.json({
      success: true,
      synced: payrollData.employees.length,
    });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}

async function syncEPF(action: string, data: EPFData) {
  // EPF (Employees Provident Fund) integration
  if (action === "submit_contributions") {
    const contributions = data.workers?.map((worker: Worker) => ({
      employeeEpfNumber: worker.epfNumber || "",
      employerContribution: (worker.salary || 0) * 0.12, // 12% employer
      employeeContribution: (worker.salary || 0) * 0.11, // 11% employee
      wages: worker.salary || 0,
      month: data.month,
      year: data.year,
    })) || [];

    // Mock EPF submission - implement actual EPF API
    return NextResponse.json({
      success: true,
      submitted: contributions.length,
    });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}

async function syncJTK(action: string, data: JTKData) {
  // JTK (Department of Labour) compliance reporting
  if (action === "report_compliance") {
    const workers = data.workers || [];
    const complianceReport = {
      reportDate: new Date().toISOString(),
      totalWorkers: workers.length,
      activeWorkers: workers.filter((w: Worker) => w.status === "active")
        .length,
      locationCompliance: workers.map((worker: Worker) => ({
        workerId: worker.hrId || worker.id,
        permitNumber: worker.permitNumber || "",
        authorizedLocation: worker.worksite || "",
        currentLocation: worker.lastKnownLocation || "",
        compliant: worker.locationCompliant || false,
      })),
      violations: data.violations || [],
    };

    // Mock JTK submission - implement actual JTK reporting API
    return NextResponse.json({
      success: true,
      reportId: `JTK_${Date.now()}`,
      report: complianceReport
    });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}