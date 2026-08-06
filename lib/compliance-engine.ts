import { prisma } from "@/lib/prisma";

export interface ComplianceRule {
  tenantId: string;
  country: string;
  ruleType: "VISA" | "PERMIT" | "MEDICAL" | "TAX" | "LABOR";
  validityMonths: number;
  alertDays: number;
  renewalLeadTime: number;
  description: string;
  active: boolean;
}

export async function getComplianceRules(tenantId: string, country: string) {
  // Query from database when schema is ready
  // For now, return defaults
  const defaults: Record<string, ComplianceRule> = {
    MY_VISA: {
      tenantId,
      country,
      ruleType: "VISA",
      validityMonths: 12,
      alertDays: 60,
      renewalLeadTime: 30,
      description: "Malaysia work visa validity",
      active: true,
    },
    MY_MEDICAL: {
      tenantId,
      country,
      ruleType: "MEDICAL",
      validityMonths: 12,
      alertDays: 90,
      renewalLeadTime: 60,
      description: "Malaysia medical fitness certificate",
      active: true,
    },
    MY_PERMIT: {
      tenantId,
      country,
      ruleType: "PERMIT",
      validityMonths: 24,
      alertDays: 120,
      renewalLeadTime: 90,
      description: "Malaysia work permit",
      active: true,
    },
  };

  return Object.values(defaults);
}

export async function checkComplianceStatus(
  employeeId: string,
  tenantId: string,
) {
  const employee = await prisma.employee.findFirst({
    where: { id: employeeId, tenantId },
    include: {
      visas: true,
      documents: {
        where: {
          type: { in: ["PASSPORT", "VISA", "CERTIFICATE", "PERMIT"] },
        },
      },
      contracts: true,
    },
  });

  if (!employee) {
    return null;
  }

  const now = new Date();
  const alerts: Array<{
    type: string;
    severity: "INFO" | "WARNING" | "CRITICAL";
    message: string;
    daysUntilExpiry: number;
  }> = [];

  // Check visas
  employee.visas.forEach((visa) => {
    const daysLeft = Math.ceil(
      (visa.expiryDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000),
    );
    if (daysLeft < 0) {
      alerts.push({
        type: "VISA_EXPIRED",
        severity: "CRITICAL",
        message: `${visa.type} has expired`,
        daysUntilExpiry: daysLeft,
      });
    } else if (daysLeft < 30) {
      alerts.push({
        type: "VISA_EXPIRING",
        severity: "CRITICAL",
        message: `${visa.type} expires in ${daysLeft} days`,
        daysUntilExpiry: daysLeft,
      });
    } else if (daysLeft < 60) {
      alerts.push({
        type: "VISA_UPCOMING",
        severity: "WARNING",
        message: `${visa.type} expires in ${daysLeft} days`,
        daysUntilExpiry: daysLeft,
      });
    }
  });

  // Check documents
  employee.documents.forEach((doc) => {
    if (doc.expiryDate) {
      const daysLeft = Math.ceil(
        (doc.expiryDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000),
      );
      if (daysLeft < 0) {
        alerts.push({
          type: "DOCUMENT_EXPIRED",
          severity: "CRITICAL",
          message: `${doc.type} has expired`,
          daysUntilExpiry: daysLeft,
        });
      } else if (daysLeft < 30) {
        alerts.push({
          type: "DOCUMENT_EXPIRING",
          severity: "WARNING",
          message: `${doc.type} expires in ${daysLeft} days`,
          daysUntilExpiry: daysLeft,
        });
      }
    }
  });

  return {
    employee,
    complianceStatus: {
      isCompliant: alerts.every((a) => a.severity !== "CRITICAL"),
      alerts,
      lastChecked: now,
    },
  };
}
