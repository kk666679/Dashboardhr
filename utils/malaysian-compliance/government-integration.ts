/**
 * Government Integration Utilities for Malaysian Compliance
 * Handles LHDN, EPF, SOCSO, and other government agency integrations
 */

export class GovernmentIntegration {
  /**
   * Submit invoice to LHDN MyInvois
   */
  static async submitInvoiceToLHDN(invoiceData: any): Promise<{ success: boolean; uuid?: string; error?: string }> {
    try {
      const response = await fetch("/api/government/lhdn/myinvois", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...invoiceData,
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          uuid: data.uuid,
        };
      } else {
        const error = await response.json();
        return {
          success: false,
          error: error.message || "Failed to submit invoice",
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Get exchange rates from Bank Negara Malaysia
   */
  static async getExchangeRates(baseCurrency: string = "MYR"): Promise<{ success: boolean; rates?: any; error?: string }> {
    try {
      const response = await fetch(
        `/api/government/bnm/exchange-rates?base=${baseCurrency}`
      );

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          rates: data.rates,
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
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Submit levy payment to JTK
   */
  static async submitLevyPayment(data: any): Promise<{ success: boolean; referenceNumber?: string; error?: string }> {
    try {
      const response = await fetch("/api/government/jtk/levy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
          error: "Failed to submit levy payment",
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Validate Malaysian IC Number (NRIC)
   */
  static validateICNumber(icNumber: string): boolean {
    // Basic validation for Malaysian IC (12 digits)
    const clean = icNumber.replace(/\s/g, "");
    if (!/^\d{12}$/.test(clean)) return false;

    // Check birth date (first 6 digits)
    const year = parseInt(clean.substring(0, 2));
    const month = parseInt(clean.substring(2, 4));
    const day = parseInt(clean.substring(4, 6));

    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;

    // Check birth year (00-99)
    if (year < 0 || year > 99) return false;

    return true;
  }

  /**
   * Generate EPF number from IC
   */
  static generateEPFNumber(icNumber: string): string {
    const clean = icNumber.replace(/\s/g, "");
    if (!this.validateICNumber(clean)) {
      throw new Error("Invalid IC number");
    }
    // EPF format: 00-000000-00 (using IC digits)
    return `${clean.substring(0, 2)}-${clean.substring(2, 8)}-${clean.substring(8, 10)}`;
  }

  /**
   * Validate business registration number
   */
  static validateBusinessRegNumber(regNumber: string): boolean {
    // Check for Malaysian business registration format
    const clean = regNumber.replace(/\s/g, "");
    // Formats: SSM (10 digits), ROS (8 digits), etc.
    return /^\d{10}$/.test(clean) || /^\d{8}$/.test(clean);
  }

  /**
   * Calculate late payment penalty
   */
  static calculateLatePenalty(amount: number, daysLate: number, penaltyRate: number = 0.06): number {
    if (daysLate <= 0) return 0;
    // Simple daily prorated penalty
    const dailyRate = penaltyRate / 365;
    return amount * dailyRate * daysLate;
  }

  /**
   * Generate compliance report for government submissions
   */
  static generateComplianceReport(period: string, data: any): any {
    const submissions = {
      epf: {
        submitted: data.epfSubmitted || false,
        submissionDate: data.epfSubmissionDate,
        totalContribution: data.epfTotal || 0,
        status: data.epfSubmitted ? "compliant" : "pending",
      },
      socso: {
        submitted: data.socsoSubmitted || false,
        submissionDate: data.socsoSubmissionDate,
        totalContribution: data.socsoTotal || 0,
        status: data.socsoSubmitted ? "compliant" : "pending",
      },
      pcb: {
        submitted: data.pcbSubmitted || false,
        submissionDate: data.pcbSubmissionDate,
        totalTax: data.pcbTotal || 0,
        status: data.pcbSubmitted ? "compliant" : "pending",
      },
      levy: {
        submitted: data.levySubmitted || false,
        submissionDate: data.levySubmissionDate,
        totalLevy: data.levyTotal || 0,
        status: data.levySubmitted ? "compliant" : "pending",
      },
    };

    return {
      period,
      submissions,
      overallCompliance: this.calculateOverallCompliance(data),
      generatedAt: new Date().toISOString(),
    };
  }

  /**
   * Calculate overall compliance status
   */
  private static calculateOverallCompliance(data: any): "compliant" | "partial" | "non_compliant" {
    const checks = [
      data.epfSubmitted,
      data.socsoSubmitted,
      data.pcbSubmitted,
      data.levySubmitted,
    ];

    const compliant = checks.filter(Boolean).length;
    const total = checks.length;

    if (compliant === total) return "compliant";
    if (compliant === 0) return "non_compliant";
    return "partial";
  }
}

export default GovernmentIntegration;
