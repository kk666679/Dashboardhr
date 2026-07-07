// Malaysian Foreign Worker Management System Compliance Utilities

export interface MalaysianComplianceConfig {
  immigration: {
    plksValidityPeriod: number;
    evalValidityPeriod: number;
    visaValidityPeriod: number;
    renewalNotificationPeriod: number;
    levyRates: {
      construction: number;
      manufacturing: number;
      plantation: number;
      services: number;
      agriculture: number;
    };
  };

  fomema: {
    medicalValidityPeriod: number;
    preEmploymentRequired: boolean;
    periodicExamInterval: number;
    examNotificationPeriod: number;
    requiredTests: string[];
  };

  jtk: {
    workerRegistrationRequired: boolean;
    monthlyReportingRequired: boolean;
    reportSubmissionDeadline: number;
    accommodationStandards: {
      minSpacePerWorker: number;
      maxOccupancyPerRoom: number;
      facilitiesRequired: string[];
      safetyRequirements: string[];
    };
  };
}

export const MALAYSIAN_COMPLIANCE_CONFIG: MalaysianComplianceConfig = {
  immigration: {
    plksValidityPeriod: 12,
    evalValidityPeriod: 12,
    visaValidityPeriod: 12,
    renewalNotificationPeriod: 60,
    levyRates: {
      construction: 1850,
      manufacturing: 1850,
      plantation: 640,
      services: 1650,
      agriculture: 640,
    },
  },

  fomema: {
    medicalValidityPeriod: 12,
    preEmploymentRequired: true,
    periodicExamInterval: 12,
    examNotificationPeriod: 30,
    requiredTests: [
      "Chest X-Ray",
      "Blood Test (HIV, Hepatitis B, Malaria, Syphilis)",
      "Urine Test (Drugs, Pregnancy)",
      "Physical Examination",
    ],
  },

  jtk: {
    workerRegistrationRequired: true,
    monthlyReportingRequired: true,
    reportSubmissionDeadline: 20,
    accommodationStandards: {
      minSpacePerWorker: 4.5,
      maxOccupancyPerRoom: 8,
      facilitiesRequired: [
        "Adequate ventilation",
        "Clean water supply",
        "Proper sanitation",
        "Kitchen facilities",
        "Recreation area",
      ],
      safetyRequirements: [
        "Fire extinguisher",
        "Emergency exits",
        "First aid kit",
        "Proper lighting",
        "Security measures",
      ],
    },
  },
};

export function checkPermitCompliance(permit: any): {
  isCompliant: boolean;
  issues: string[];
  daysToExpiry: number;
} {
  const issues: string[] = [];
  const expiryDate = new Date(permit.expiryDate);
  const today = new Date();
  const daysToExpiry = Math.ceil(
    (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (daysToExpiry <= 0) {
    issues.push("Permit has expired");
  } else if (
    daysToExpiry <=
    MALAYSIAN_COMPLIANCE_CONFIG.immigration.renewalNotificationPeriod
  ) {
    issues.push(`Permit expires in ${daysToExpiry} days - renewal required`);
  }

  if (permit.levyPaid < permit.levyAmount) {
    issues.push("Outstanding levy payment");
  }

  return {
    isCompliant: issues.length === 0,
    issues,
    daysToExpiry,
  };
}

export function calculateGovernmentLevy(
  sector: string,
  workerCount: number,
  months: number = 1,
): {
  totalAmount: number;
  monthlyRate: number;
  breakdown: {
    sector: string;
    workers: number;
    monthlyRate: number;
    months: number;
    total: number;
  };
} {
  const sectorKey =
    sector.toLowerCase() as keyof typeof MALAYSIAN_COMPLIANCE_CONFIG.immigration.levyRates;
  const monthlyRate =
    MALAYSIAN_COMPLIANCE_CONFIG.immigration.levyRates[sectorKey] ||
    MALAYSIAN_COMPLIANCE_CONFIG.immigration.levyRates.services;

  const totalAmount = monthlyRate * workerCount * months;

  return {
    totalAmount,
    monthlyRate,
    breakdown: {
      sector,
      workers: workerCount,
      monthlyRate,
      months,
      total: totalAmount,
    },
  };
}

export const GOVERNMENT_AUTHORITIES = {
  IMMIGRATION: {
    name: "Immigration Department of Malaysia",
    code: "JIM",
    requiredSubmissions: ["PLKS", "eVAL", "Visa Applications", "Levy Payments"],
    reportingFrequency: "Monthly",
  },
  JTK: {
    name: "Department of Labour (Jabatan Tenaga Kerja)",
    code: "JTK",
    requiredSubmissions: [
      "Worker Registration",
      "Monthly Reports",
      "Accommodation Details",
    ],
    reportingFrequency: "Monthly",
  },
  FOMEMA: {
    name: "Foreign Workers Medical Examination Monitoring Agency",
    code: "FOMEMA",
    requiredSubmissions: ["Medical Exam Registration", "Results Submission"],
    reportingFrequency: "As Required",
  },
};
