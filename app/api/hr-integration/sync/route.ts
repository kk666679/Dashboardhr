import { NextRequest, NextResponse } from "next/server";

// HR System Integration Hub
export async function POST(request: NextRequest) {
  try {
    const { system, action, data } = await request.json();

    switch (system) {
      case "bamboohr":
        return await syncBambooHR(action, data);
      case "autocount":
        return await syncAutoCount(action, data);
      case "epf":
        return await syncEPF(action, data);
      case "jtk":
        return await syncJTK(action, data);
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

async function syncBambooHR(action: string, data: any) {
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
      const employees = await response.json();
      return NextResponse.json({
        success: true,
        data: employees.employees.map((emp: any) => ({
          hrId: emp.id,
          employeeId: emp.employeeNumber,
          name: `${emp.firstName} ${emp.lastName}`,
          department: emp.department,
          position: emp.jobTitle,
          status: emp.status === "Active" ? "active" : "inactive",
        })),
      });
    }
  }

  if (action === "push_attendance") {
    // Push attendance data to BambooHR
    const attendanceData = data.attendance.map((record: any) => ({
      employeeId: record.workerId,
      date: record.date,
      hoursWorked: record.totalHours,
      location: record.location,
    }));

    // BambooHR doesn't have direct attendance API, use time tracking
    return NextResponse.json({ success: true, message: "Attendance logged" });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}

async function syncAutoCount(action: string, data: any) {
  // AutoCount Payroll integration
  const apiUrl = process.env.AUTOCOUNT_API_URL;
  const apiKey = process.env.AUTOCOUNT_API_KEY;

  if (action === "sync_payroll") {
    const payrollData = {
      employees: data.workers.map((worker: any) => ({
        employeeCode: worker.hrId,
        basicSalary: worker.salary,
        attendance: worker.attendanceHours,
        overtime: worker.overtimeHours,
        deductions: {
          epf: worker.salary * 0.11, // 11% EPF
          socso: Math.min(worker.salary * 0.005, 24.5), // SOCSO calculation
          eis: Math.min(worker.salary * 0.002, 7.9), // EIS calculation
        },
      })),
    };

    // Mock API call - implement actual AutoCount integration
    // removed console.log
    return NextResponse.json({
      success: true,
      synced: payrollData.employees.length,
    });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}

async function syncEPF(action: string, data: any) {
  // EPF (Employees Provident Fund) integration
  if (action === "submit_contributions") {
    const contributions = data.workers.map((worker: any) => ({
      employeeEpfNumber: worker.epfNumber,
      employerContribution: worker.salary * 0.12, // 12% employer
      employeeContribution: worker.salary * 0.11, // 11% employee
      wages: worker.salary,
      month: data.month,
      year: data.year,
    }));

    // Mock EPF submission - implement actual EPF API
    // removed console.log
    return NextResponse.json({
      success: true,
      submitted: contributions.length,
    });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}

async function syncJTK(action: string, data: any) {
  // JTK (Department of Labour) compliance reporting
  if (action === "report_compliance") {
    const complianceReport = {
      reportDate: new Date().toISOString(),
      totalWorkers: data.workers.length,
      activeWorkers: data.workers.filter((w: any) => w.status === "active")
        .length,
      locationCompliance: data.workers.map((worker: any) => ({
        workerId: worker.hrId,
        permitNumber: worker.permitNumber,
        authorizedLocation: worker.worksite,
        currentLocation: worker.lastKnownLocation,
        compliant: worker.locationCompliant,
      })),
      violations: data.violations || [],
    };

    // Mock JTK submission - implement actual JTK reporting API
    // removed console.log
    return NextResponse.json({ success: true, reportId: `JTK_${Date.now()}` });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
