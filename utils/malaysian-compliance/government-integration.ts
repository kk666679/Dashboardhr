// Malaysian Government API Integration Utilities

export interface EPFSubmissionData {
  employerCode: string;
  period: string;
  employees: {
    workerId: string;
    name: string;
    icNumber: string;
    epfNumber: string;
    basicSalary: number;
    employeeContribution: number;
    employerContribution: number;
  }[];
  totalEmployeeContribution: number;
  totalEmployerContribution: number;
  submissionDate: string;
}

export interface SOCSORates {
  category: number;
  wageFrom: number;
  wageTo: number;
  employeeRate: number;
  employerRate: number;
  totalContribution: number;
}

export interface PCBSubmissionData {
  employerTaxNumber: string;
  period: string;
  employees: {
    workerId: string;
    name: string;
    icNumber: string;
    monthlyTax: number;
    cumulativeTax: number;
  }[];
  totalTaxDeducted: number;
  submissionDate: string;
}

export class GovernmentAPIIntegration {
  // EPF Integration
  static async submitEPFForm(
    data: EPFSubmissionData,
  ): Promise<{ success: boolean; referenceNumber?: string; error?: string }> {
    try {
      // Mock EPF API submission
      const response = await fetch("/api/government/epf/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.EPF_API_KEY}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        return {
          success: true,
          referenceNumber: result.referenceNumber,
        };
      } else {
        return {
          success: false,
          error: "EPF submission failed",
        };
      }
    } catch (error) {
      return {
        success: false,
        error: `EPF API error: ${error}`,
      };
    }
  }

  // SOCSO Integration
  static async submitSOCSO(
    data: any,
  ): Promise<{ success: boolean; referenceNumber?: string; error?: string }> {
    try {
      const response = await fetch("/api/government/socso/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.SOCSO_API_KEY}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        return {
          success: true,
          referenceNumber: result.referenceNumber,
        };
      } else {
        return {
          success: false,
          error: "SOCSO submission failed",
        };
      }
    } catch (error) {
      return {
        success: false,
        error: `SOCSO API error: ${error}`,
      };
    }
  }

  // LHDN PCB Integration
  static async submitPCB(
    data: PCBSubmissionData,
  ): Promise<{ success: boolean; referenceNumber?: string; error?: string }> {
    try {
      const response = await fetch("/api/government/lhdn/pcb", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.LHDN_API_KEY}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        return {
          success: true,
          referenceNumber: result.referenceNumber,
        };
      } else {
        return {
          success: false,
          error: "PCB submission failed",
        };
      }
    } catch (error) {
      return {
        success: false,
        error: `LHDN API error: ${error}`,
      };
    }
  }

  // MyInvois E-Invoice Integration
  static async submitEInvoice(
    invoiceData: any,
  ): Promise<{ success: boolean; uuid?: string; error?: string }> {
    try {
      const response = await fetch("/api/government/lhdn/myinvois", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.MYINVOIS_API_KEY}`,
        },
        body: JSON.stringify({
          ...invoiceData,
          format: "JSON",
          documentType: "01", // Invoice
          codeNumber: "01", // Original document
        }),
      });

      if (response.ok) {
        const result = await response.json();
        return {
          success: true,
          uuid: result.uuid,
        };
      } else {
        return {
          success: false,
          error: "E-Invoice submission failed",
        };
      }
    } catch (error) {
      return {
        success: false,
        error: `MyInvois API error: ${error}`,
      };
    }
  }

  // BNM Exchange Rate Integration
  static async getExchangeRates(
    baseCurrency: string = "MYR",
  ): Promise<{ success: boolean; rates?: any; error?: string }> {
    try {
      const response = await fetch(
        `https://api.bnm.gov.my/public/exchange-rate/day/${new Date().toISOString().split("T")[0]}`,
        {
          headers: {
            Accept: "application/vnd.BNM.API.v1+json",
          },
        },
      );

      if (response.ok) {
        const result = await response.json();
        return {
          success: true,
          rates: result.data,
        };
      } else {
        return {
          success: false,
          error: "Failed to fetch exchange rates",
        };
      }
    } catch (error) {
      return {
        success: false,
        error: `BNM API error: ${error}`,
      };
    }
  }

  // JTK Foreign Worker Levy Integration
  static async submitLevyPayment(
    data: any,
  ): Promise<{ success: boolean; referenceNumber?: string; error?: string }> {
    try {
      const response = await fetch("/api/government/jtk/levy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.JTK_API_KEY}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        return {
          success: true,
          referenceNumber: result.referenceNumber,
        };
      } else {
        return {
          success: false,
          error: "Levy payment submission failed",
        };
      }
    } catch (error) {
      return {
        success: false,
        error: `JTK API error: ${error}`,
      };
    }
  }

  // Validate Malaysian IC Number
  static validateICNumber(icNumber: string): boolean {
    // Remove any non-digit characters
    const cleanIC = icNumber.replace(/\D/g, "");

    // Check if it's 12 digits
    if (cleanIC.length !== 12) return false;

    // Extract date parts
    const year = parseInt(cleanIC.substring(0, 2));
    const month = parseInt(cleanIC.substring(2, 4));
    const day = parseInt(cleanIC.substring(4, 6));

    // Validate date
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;

    // Validate state code (positions 7-8)
    const stateCode = parseInt(cleanIC.substring(6, 8));
    const validStateCodes = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 21, 22, 23, 24, 25,
      26, 27, 28, 29, 30, 31, 32, 33, 34, 40, 41, 42, 43, 44, 45, 46, 47, 48,
      49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66,
      67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84,
      85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99,
    ];

    return validStateCodes.includes(stateCode);
  }

  // Generate EPF Number format
  static generateEPFNumber(icNumber: string): string {
    const cleanIC = icNumber.replace(/\D/g, "");
    return `${cleanIC.substring(0, 6)}-${cleanIC.substring(6, 8)}-${cleanIC.substring(8, 12)}`;
  }

  // Validate Business Registration Number
  static validateBusinessRegNumber(regNumber: string): boolean {
    // Malaysian business registration formats
    const patterns = [
      /^\d{6}-[A-Z]$/, // Old format: 123456-A
      /^\d{12}$/, // New format: 123456789012
      /^[A-Z]{2}\d{10}$/, // Company format: AB1234567890
    ];

    return patterns.some((pattern) => pattern.test(regNumber));
  }

  // Calculate penalty for late submissions
  static calculateLatePenalty(
    amount: number,
    daysLate: number,
    penaltyRate: number = 0.06,
  ): number {
    if (daysLate <= 0) return 0;

    // Annual penalty rate divided by 365 days, multiplied by days late
    const dailyRate = penaltyRate / 365;
    return amount * dailyRate * daysLate;
  }

  // Generate compliance report for authorities
  static generateComplianceReport(period: string, data: any): any {
    return {
      reportId: `COMP-${Date.now()}`,
      period,
      generatedDate: new Date().toISOString(),
      epfCompliance: {
        submitted: data.epfSubmitted || false,
        submissionDate: data.epfSubmissionDate,
        totalContribution: data.epfTotal || 0,
        status: data.epfSubmitted ? "compliant" : "pending",
      },
      socsoCompliance: {
        submitted: data.socsoSubmitted || false,
        submissionDate: data.socsoSubmissionDate,
        totalContribution: data.socsoTotal || 0,
        status: data.socsoSubmitted ? "compliant" : "pending",
      },
      pcbCompliance: {
        submitted: data.pcbSubmitted || false,
        submissionDate: data.pcbSubmissionDate,
        totalTax: data.pcbTotal || 0,
        status: data.pcbSubmitted ? "compliant" : "pending",
      },
      levyCompliance: {
        submitted: data.levySubmitted || false,
        submissionDate: data.levySubmissionDate,
        totalLevy: data.levyTotal || 0,
        status: data.levySubmitted ? "compliant" : "pending",
      },
      overallStatus: this.calculateOverallCompliance(data),
    };
  }

  private static calculateOverallCompliance(
    data: any,
  ): "compliant" | "partial" | "non_compliant" {
    const submissions = [
      data.epfSubmitted,
      data.socsoSubmitted,
      data.pcbSubmitted,
      data.levySubmitted,
    ];

    const compliantCount = submissions.filter(Boolean).length;

    if (compliantCount === submissions.length) return "compliant";
    if (compliantCount > 0) return "partial";
    return "non_compliant";
  }
}
