// Enhanced Malaysian Tax Calculator with 2024 Rates

export interface TaxCalculationResult {
  grossSalary: number;
  epfEmployee: number;
  epfEmployer: number;
  socsoEmployee: number;
  socsoEmployer: number;
  eisEmployee: number;
  eisEmployer: number;
  pcbTax: number;
  netSalary: number;
  totalEmployerCost: number;
}

export class MalaysianTaxCalculator {
  // 2024 Tax Rates
  private static readonly TAX_RATES = {
    EPF: {
      EMPLOYEE_RATE: 0.11,
      EMPLOYER_RATE: 0.12,
      CEILING: 6000,
      MIN_CONTRIBUTION: 5,
    },
    SOCSO: {
      EMPLOYEE_RATES: [
        { min: 0, max: 30, rate: 0.005 },
        { min: 30.01, max: 50, rate: 0.01 },
        { min: 50.01, max: 70, rate: 0.015 },
        { min: 70.01, max: 100, rate: 0.02 },
        { min: 100.01, max: 140, rate: 0.025 },
        { min: 140.01, max: 200, rate: 0.03 },
        { min: 200.01, max: 300, rate: 0.035 },
        { min: 300.01, max: 400, rate: 0.04 },
        { min: 400.01, max: 500, rate: 0.045 },
        { min: 500.01, max: 600, rate: 0.05 },
        { min: 600.01, max: 700, rate: 0.055 },
        { min: 700.01, max: 800, rate: 0.06 },
        { min: 800.01, max: 900, rate: 0.065 },
        { min: 900.01, max: 1000, rate: 0.07 },
        { min: 1000.01, max: 1100, rate: 0.075 },
        { min: 1100.01, max: 1200, rate: 0.08 },
        { min: 1200.01, max: 1300, rate: 0.085 },
        { min: 1300.01, max: 1400, rate: 0.09 },
        { min: 1400.01, max: 1500, rate: 0.095 },
        { min: 1500.01, max: Infinity, rate: 0.1 },
      ],
      EMPLOYER_RATE: 0.018,
      CEILING: 4000,
    },
    EIS: {
      EMPLOYEE_RATE: 0.002,
      EMPLOYER_RATE: 0.002,
      CEILING: 4000,
    },
    PCB: [
      { min: 0, max: 5000, rate: 0, cumulativeTax: 0 },
      { min: 5000.01, max: 20000, rate: 0.01, cumulativeTax: 0 },
      { min: 20000.01, max: 35000, rate: 0.03, cumulativeTax: 150 },
      { min: 35000.01, max: 50000, rate: 0.08, cumulativeTax: 600 },
      { min: 50000.01, max: 70000, rate: 0.13, cumulativeTax: 1800 },
      { min: 70000.01, max: 100000, rate: 0.21, cumulativeTax: 4400 },
      { min: 100000.01, max: 400000, rate: 0.24, cumulativeTax: 10700 },
      { min: 400000.01, max: 600000, rate: 0.245, cumulativeTax: 82700 },
      { min: 600000.01, max: 2000000, rate: 0.25, cumulativeTax: 131700 },
      { min: 2000000.01, max: Infinity, rate: 0.3, cumulativeTax: 481700 },
    ],
    SST: {
      STANDARD_RATE: 0.06,
      SERVICE_RATE: 0.06,
      EXEMPT_THRESHOLD: 500000,
    },
  };

  static calculatePayroll(
    grossSalary: number,
    isResident: boolean = true,
  ): TaxCalculationResult {
    // EPF Calculation
    const epfEmployee = Math.min(
      grossSalary * this.TAX_RATES.EPF.EMPLOYEE_RATE,
      this.TAX_RATES.EPF.CEILING * this.TAX_RATES.EPF.EMPLOYEE_RATE,
    );
    const epfEmployer = Math.min(
      grossSalary * this.TAX_RATES.EPF.EMPLOYER_RATE,
      this.TAX_RATES.EPF.CEILING * this.TAX_RATES.EPF.EMPLOYER_RATE,
    );

    // SOCSO Calculation
    const socsoEmployee = this.calculateSOCSO(grossSalary, "employee");
    const socsoEmployer = Math.min(
      grossSalary * this.TAX_RATES.SOCSO.EMPLOYER_RATE,
      this.TAX_RATES.SOCSO.CEILING * this.TAX_RATES.SOCSO.EMPLOYER_RATE,
    );

    // EIS Calculation
    const eisEmployee = Math.min(
      grossSalary * this.TAX_RATES.EIS.EMPLOYEE_RATE,
      this.TAX_RATES.EIS.CEILING * this.TAX_RATES.EIS.EMPLOYEE_RATE,
    );
    const eisEmployer = Math.min(
      grossSalary * this.TAX_RATES.EIS.EMPLOYER_RATE,
      this.TAX_RATES.EIS.CEILING * this.TAX_RATES.EIS.EMPLOYER_RATE,
    );

    // PCB Tax Calculation (annual basis)
    const annualSalary = grossSalary * 12;
    const annualEPF = epfEmployee * 12;
    const taxableIncome = annualSalary - annualEPF;
    const annualPCB = this.calculatePCB(taxableIncome, isResident);
    const pcbTax = annualPCB / 12;

    // Net Salary
    const netSalary =
      grossSalary - epfEmployee - socsoEmployee - eisEmployee - pcbTax;

    // Total Employer Cost
    const totalEmployerCost =
      grossSalary + epfEmployer + socsoEmployer + eisEmployer;

    return {
      grossSalary: Math.round(grossSalary * 100) / 100,
      epfEmployee: Math.round(epfEmployee * 100) / 100,
      epfEmployer: Math.round(epfEmployer * 100) / 100,
      socsoEmployee: Math.round(socsoEmployee * 100) / 100,
      socsoEmployer: Math.round(socsoEmployer * 100) / 100,
      eisEmployee: Math.round(eisEmployee * 100) / 100,
      eisEmployer: Math.round(eisEmployer * 100) / 100,
      pcbTax: Math.round(pcbTax * 100) / 100,
      netSalary: Math.round(netSalary * 100) / 100,
      totalEmployerCost: Math.round(totalEmployerCost * 100) / 100,
    };
  }

  private static calculateSOCSO(
    salary: number,
    type: "employee" | "employer",
  ): number {
    if (type === "employer") {
      return Math.min(
        salary * this.TAX_RATES.SOCSO.EMPLOYER_RATE,
        this.TAX_RATES.SOCSO.CEILING * this.TAX_RATES.SOCSO.EMPLOYER_RATE,
      );
    }

    // Employee SOCSO uses tiered rates
    for (const bracket of this.TAX_RATES.SOCSO.EMPLOYEE_RATES) {
      if (salary >= bracket.min && salary <= bracket.max) {
        return salary * bracket.rate;
      }
    }
    return salary * 0.1; // Maximum rate
  }

  private static calculatePCB(
    annualIncome: number,
    isResident: boolean,
  ): number {
    if (!isResident) {
      return annualIncome * 0.28; // Non-resident flat rate
    }

    let tax = 0;
    for (const bracket of this.TAX_RATES.PCB) {
      if (annualIncome > bracket.min) {
        const taxableInBracket = Math.min(
          annualIncome - bracket.min,
          bracket.max - bracket.min,
        );
        tax = bracket.cumulativeTax + taxableInBracket * bracket.rate;
      }
    }
    return Math.max(0, tax);
  }

  static calculateSST(
    amount: number,
    isService: boolean = false,
    isExempt: boolean = false,
  ): number {
    if (isExempt) return 0;
    const rate = isService
      ? this.TAX_RATES.SST.SERVICE_RATE
      : this.TAX_RATES.SST.STANDARD_RATE;
    return amount * rate;
  }

  static calculateForeignWorkerLevy(
    category: string,
    duration: number = 12,
  ): number {
    const levyRates: Record<string, number> = {
      manufacturing: 1850, // Annual levy
      construction: 1850,
      plantation: 590,
      agriculture: 590,
      services: 1850,
      domestic: 410,
    };

    const annualLevy = levyRates[category.toLowerCase()] || 1850;
    return (annualLevy / 12) * duration;
  }

  static generatePayslip(
    calculation: TaxCalculationResult,
    workerInfo: any,
  ): any {
    return {
      workerName: workerInfo.name,
      workerId: workerInfo.id,
      payPeriod: new Date().toISOString().slice(0, 7), // YYYY-MM
      earnings: {
        basicSalary: calculation.grossSalary,
        overtime: 0,
        allowances: 0,
        totalEarnings: calculation.grossSalary,
      },
      deductions: {
        epf: calculation.epfEmployee,
        socso: calculation.socsoEmployee,
        eis: calculation.eisEmployee,
        pcb: calculation.pcbTax,
        totalDeductions:
          calculation.epfEmployee +
          calculation.socsoEmployee +
          calculation.eisEmployee +
          calculation.pcbTax,
      },
      netPay: calculation.netSalary,
      employerContributions: {
        epf: calculation.epfEmployer,
        socso: calculation.socsoEmployer,
        eis: calculation.eisEmployer,
        totalEmployerCost: calculation.totalEmployerCost,
      },
      generatedAt: new Date().toISOString(),
    };
  }

  static validateTaxCalculation(calculation: TaxCalculationResult): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Validate EPF
    if (calculation.epfEmployee < 0 || calculation.epfEmployer < 0) {
      errors.push("EPF contributions cannot be negative");
    }

    // Validate SOCSO
    if (calculation.socsoEmployee < 0 || calculation.socsoEmployer < 0) {
      errors.push("SOCSO contributions cannot be negative");
    }

    // Validate EIS
    if (calculation.eisEmployee < 0 || calculation.eisEmployer < 0) {
      errors.push("EIS contributions cannot be negative");
    }

    // Validate PCB
    if (calculation.pcbTax < 0) {
      errors.push("PCB tax cannot be negative");
    }

    // Validate net salary
    if (calculation.netSalary <= 0) {
      errors.push("Net salary must be positive");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
