// Malaysian Immigration Law Compliance Checker
// This utility helps ensure compliance with Malaysian immigration laws and regulations

export interface ComplianceCheck {
  category: string;
  requirement: string;
  status: "compliant" | "non_compliant" | "warning" | "pending";
  description: string;
  actionRequired?: string;
  deadline?: string;
  reference?: string;
}

export interface WorkerComplianceReport {
  workerId: string;
  workerName: string;
  overallStatus: "compliant" | "non_compliant" | "warning";
  complianceScore: number;
  checks: ComplianceCheck[];
  lastUpdated: string;
}

export class MalaysianComplianceChecker {
  // Immigration Act 1959/63 - Work Permit Requirements
  static checkWorkPermitCompliance(worker: any): ComplianceCheck[] {
    const checks: ComplianceCheck[] = [];

    // Valid work permit check
    checks.push({
      category: "Work Permit",
      requirement: "Valid Work Permit",
      status: worker.permitStatus === "active" ? "compliant" : "non_compliant",
      description:
        "Worker must have a valid work permit under Immigration Act 1959/63",
      actionRequired:
        worker.permitStatus !== "active"
          ? "Renew or apply for work permit"
          : undefined,
      reference: "Immigration Act 1959/63, Section 6",
    });

    // Permit expiry check
    const permitExpiryDate = new Date(worker.permitExpiry);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    checks.push({
      category: "Work Permit",
      requirement: "Permit Validity Period",
      status: permitExpiryDate > thirtyDaysFromNow ? "compliant" : "warning",
      description: "Work permit must be valid and not expiring within 30 days",
      actionRequired:
        permitExpiryDate <= thirtyDaysFromNow
          ? "Initiate permit renewal process"
          : undefined,
      deadline: worker.permitExpiry,
      reference: "Immigration Regulations 1963",
    });

    return checks;
  }

  // Foreign Workers (Medical Examination) Act 1997 - FOMEMA Requirements
  static checkMedicalCompliance(worker: any): ComplianceCheck[] {
    const checks: ComplianceCheck[] = [];

    // Valid medical certificate
    checks.push({
      category: "Medical",
      requirement: "Valid FOMEMA Certificate",
      status: worker.medicalStatus === "valid" ? "compliant" : "non_compliant",
      description: "Worker must have valid FOMEMA medical certificate",
      actionRequired:
        worker.medicalStatus !== "valid"
          ? "Schedule FOMEMA medical examination"
          : undefined,
      reference: "Foreign Workers (Medical Examination) Act 1997",
    });

    // Medical examination frequency
    const lastMedicalDate = worker.lastMedicalDate
      ? new Date(worker.lastMedicalDate)
      : null;
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    if (lastMedicalDate && lastMedicalDate < oneYearAgo) {
      checks.push({
        category: "Medical",
        requirement: "Annual Medical Examination",
        status: "warning",
        description: "Medical examination should be conducted annually",
        actionRequired: "Schedule annual medical examination",
        reference: "FOMEMA Guidelines 2023",
      });
    }

    return checks;
  }

  // Workers' Minimum Standards of Housing and Amenities Act 1990
  static checkAccommodationCompliance(worker: any): ComplianceCheck[] {
    const checks: ComplianceCheck[] = [];

    // Accommodation provision
    checks.push({
      category: "Accommodation",
      requirement: "Adequate Accommodation",
      status: worker.accommodationInfo ? "compliant" : "warning",
      description:
        "Employer must provide adequate accommodation as per Act 446",
      actionRequired: !worker.accommodationInfo
        ? "Verify accommodation arrangements"
        : undefined,
      reference: "Workers' Minimum Standards of Housing and Amenities Act 1990",
    });

    // Accommodation standards
    if (worker.accommodationInfo?.type === "company_provided") {
      checks.push({
        category: "Accommodation",
        requirement: "Accommodation Standards",
        status: "pending",
        description:
          "Accommodation must meet minimum standards for space, facilities, and hygiene",
        actionRequired: "Conduct accommodation inspection",
        reference: "Workers' Minimum Standards of Housing Regulations 1991",
      });
    }

    return checks;
  }

  // Employment Act 1955 - Labor Law Compliance
  static checkEmploymentCompliance(worker: any): ComplianceCheck[] {
    const checks: ComplianceCheck[] = [];

    // Minimum wage compliance
    const minimumWage = 1500; // RM 1,500 as of 2023
    checks.push({
      category: "Employment",
      requirement: "Minimum Wage Compliance",
      status:
        worker.employmentInfo?.salary >= minimumWage
          ? "compliant"
          : "non_compliant",
      description: `Salary must meet minimum wage requirement of RM ${minimumWage}`,
      actionRequired:
        worker.employmentInfo?.salary < minimumWage
          ? "Adjust salary to meet minimum wage"
          : undefined,
      reference: "Employment Act 1955, Minimum Wages Order 2023",
    });

    // Contract validity
    const contractEndDate = new Date(worker.employmentInfo?.contractEndDate);
    const today = new Date();

    checks.push({
      category: "Employment",
      requirement: "Valid Employment Contract",
      status: contractEndDate > today ? "compliant" : "non_compliant",
      description: "Worker must have valid employment contract",
      actionRequired:
        contractEndDate <= today ? "Renew employment contract" : undefined,
      reference: "Employment Act 1955",
    });

    return checks;
  }

  // Levy payment compliance
  static checkLevyCompliance(worker: any): ComplianceCheck[] {
    const checks: ComplianceCheck[] = [];

    // Government levy payment
    checks.push({
      category: "Financial",
      requirement: "Government Levy Payment",
      status: worker.levyStatus === "paid" ? "compliant" : "non_compliant",
      description: "Government levy must be paid for foreign worker",
      actionRequired:
        worker.levyStatus !== "paid"
          ? "Pay outstanding government levy"
          : undefined,
      reference: "Immigration Act 1959/63, Immigration Regulations",
    });

    return checks;
  }

  // Generate comprehensive compliance report
  static generateComplianceReport(worker: any): WorkerComplianceReport {
    const allChecks = [
      ...this.checkWorkPermitCompliance(worker),
      ...this.checkMedicalCompliance(worker),
      ...this.checkAccommodationCompliance(worker),
      ...this.checkEmploymentCompliance(worker),
      ...this.checkLevyCompliance(worker),
    ];

    const compliantChecks = allChecks.filter(
      (check) => check.status === "compliant",
    ).length;
    const totalChecks = allChecks.length;
    const complianceScore = Math.round((compliantChecks / totalChecks) * 100);

    const hasNonCompliant = allChecks.some(
      (check) => check.status === "non_compliant",
    );
    const hasWarnings = allChecks.some((check) => check.status === "warning");

    let overallStatus: "compliant" | "non_compliant" | "warning";
    if (hasNonCompliant) {
      overallStatus = "non_compliant";
    } else if (hasWarnings) {
      overallStatus = "warning";
    } else {
      overallStatus = "compliant";
    }

    return {
      workerId: worker.id,
      workerName: worker.name,
      overallStatus,
      complianceScore,
      checks: allChecks,
      lastUpdated: new Date().toISOString(),
    };
  }

  // Get compliance summary for multiple workers
  static getComplianceSummary(workers: any[]): {
    totalWorkers: number;
    compliantWorkers: number;
    nonCompliantWorkers: number;
    warningWorkers: number;
    averageComplianceScore: number;
    criticalIssues: ComplianceCheck[];
  } {
    const reports = workers.map((worker) =>
      this.generateComplianceReport(worker),
    );

    const compliantWorkers = reports.filter(
      (r) => r.overallStatus === "compliant",
    ).length;
    const nonCompliantWorkers = reports.filter(
      (r) => r.overallStatus === "non_compliant",
    ).length;
    const warningWorkers = reports.filter(
      (r) => r.overallStatus === "warning",
    ).length;

    const averageComplianceScore = Math.round(
      reports.reduce((sum, report) => sum + report.complianceScore, 0) /
        reports.length,
    );

    const criticalIssues = reports
      .flatMap((report) => report.checks)
      .filter((check) => check.status === "non_compliant")
      .slice(0, 10); // Top 10 critical issues

    return {
      totalWorkers: workers.length,
      compliantWorkers,
      nonCompliantWorkers,
      warningWorkers,
      averageComplianceScore,
      criticalIssues,
    };
  }

  // Get upcoming compliance deadlines
  static getUpcomingDeadlines(workers: any[]): Array<{
    workerId: string;
    workerName: string;
    requirement: string;
    deadline: string;
    daysUntilDeadline: number;
    priority: "high" | "medium" | "low";
  }> {
    const deadlines: Array<{
      workerId: string;
      workerName: string;
      requirement: string;
      deadline: string;
      daysUntilDeadline: number;
      priority: "high" | "medium" | "low";
    }> = [];

    workers.forEach((worker) => {
      const report = this.generateComplianceReport(worker);

      report.checks.forEach((check) => {
        if (check.deadline) {
          const deadlineDate = new Date(check.deadline);
          const today = new Date();
          const daysUntilDeadline = Math.ceil(
            (deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
          );

          let priority: "high" | "medium" | "low";
          if (daysUntilDeadline <= 7) priority = "high";
          else if (daysUntilDeadline <= 30) priority = "medium";
          else priority = "low";

          deadlines.push({
            workerId: worker.id,
            workerName: worker.name,
            requirement: check.requirement,
            deadline: check.deadline,
            daysUntilDeadline,
            priority,
          });
        }
      });
    });

    return deadlines.sort((a, b) => a.daysUntilDeadline - b.daysUntilDeadline);
  }
}

// Export utility functions
export const checkWorkerCompliance =
  MalaysianComplianceChecker.generateComplianceReport;
export const getComplianceSummary =
  MalaysianComplianceChecker.getComplianceSummary;
export const getUpcomingDeadlines =
  MalaysianComplianceChecker.getUpcomingDeadlines;
