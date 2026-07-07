// Malaysian Tax Calculator for SST (Sales and Service Tax)
// Implements Malaysian tax regulations for foreign worker services

export interface TaxableItem {
  description: string;
  amount: number;
  category: string;
  isService: boolean;
  isTaxable: boolean;
  exemptionReason?: string;
}

export interface TaxCalculationResult {
  subtotal: number;
  taxableAmount: number;
  exemptAmount: number;
  salesTaxAmount: number;
  serviceTaxAmount: number;
  totalTaxAmount: number;
  grandTotal: number;
  breakdown: TaxBreakdown[];
}

export interface TaxBreakdown {
  category: string;
  amount: number;
  taxType: "sales" | "service" | "exempt";
  taxRate: number;
  taxAmount: number;
}

export class MalaysianTaxCalculator {
  // Current Malaysian SST rates (as of 2024)
  private static readonly SALES_TAX_RATE = 0.1; // 10%
  private static readonly SERVICE_TAX_RATE = 0.06; // 6%

  // Tax registration thresholds
  private static readonly SALES_TAX_THRESHOLD = 500000; // RM 500,000 annually
  private static readonly SERVICE_TAX_THRESHOLD = 500000; // RM 500,000 annually

  // Exempt categories for foreign worker services
  private static readonly EXEMPT_CATEGORIES = [
    "medical_examination",
    "government_fees",
    "insurance_premium",
    "training_certification",
    "legal_documentation",
  ];

  // Service categories subject to service tax
  private static readonly SERVICE_CATEGORIES = [
    "recruitment_service",
    "documentation_service",
    "accommodation_service",
    "transportation_service",
    "consultation_service",
    "processing_service",
  ];

  // Calculate tax for a single item
  static calculateItemTax(item: TaxableItem): {
    taxType: "sales" | "service" | "exempt";
    taxRate: number;
    taxAmount: number;
  } {
    // Check if item is exempt
    if (!item.isTaxable || this.EXEMPT_CATEGORIES.includes(item.category)) {
      return {
        taxType: "exempt",
        taxRate: 0,
        taxAmount: 0,
      };
    }

    // Determine if it's a service or goods
    if (item.isService || this.SERVICE_CATEGORIES.includes(item.category)) {
      return {
        taxType: "service",
        taxRate: this.SERVICE_TAX_RATE,
        taxAmount: item.amount * this.SERVICE_TAX_RATE,
      };
    } else {
      return {
        taxType: "sales",
        taxRate: this.SALES_TAX_RATE,
        taxAmount: item.amount * this.SALES_TAX_RATE,
      };
    }
  }

  // Calculate total tax for multiple items
  static calculateTotalTax(items: TaxableItem[]): TaxCalculationResult {
    const breakdown: TaxBreakdown[] = [];
    let subtotal = 0;
    let taxableAmount = 0;
    let exemptAmount = 0;
    let salesTaxAmount = 0;
    let serviceTaxAmount = 0;

    // Group items by category for breakdown
    const categoryGroups = items.reduce(
      (groups, item) => {
        if (!groups[item.category]) {
          groups[item.category] = [];
        }
        groups[item.category].push(item);
        return groups;
      },
      {} as Record<string, TaxableItem[]>,
    );

    // Calculate tax for each category
    Object.entries(categoryGroups).forEach(([category, categoryItems]) => {
      let categoryAmount = 0;
      let categoryTaxAmount = 0;
      let taxType: "sales" | "service" | "exempt" = "exempt";
      let taxRate = 0;

      categoryItems.forEach((item) => {
        categoryAmount += item.amount;
        subtotal += item.amount;

        const itemTax = this.calculateItemTax(item);
        categoryTaxAmount += itemTax.taxAmount;
        taxType = itemTax.taxType;
        taxRate = itemTax.taxRate;

        if (itemTax.taxType === "exempt") {
          exemptAmount += item.amount;
        } else {
          taxableAmount += item.amount;
          if (itemTax.taxType === "sales") {
            salesTaxAmount += itemTax.taxAmount;
          } else {
            serviceTaxAmount += itemTax.taxAmount;
          }
        }
      });

      breakdown.push({
        category,
        amount: categoryAmount,
        taxType,
        taxRate,
        taxAmount: categoryTaxAmount,
      });
    });

    const totalTaxAmount = salesTaxAmount + serviceTaxAmount;
    const grandTotal = subtotal + totalTaxAmount;

    return {
      subtotal,
      taxableAmount,
      exemptAmount,
      salesTaxAmount,
      serviceTaxAmount,
      totalTaxAmount,
      grandTotal,
      breakdown,
    };
  }

  // Calculate penalty for late tax payment
  static calculateLatePenalty(
    taxAmount: number,
    daysLate: number,
    penaltyRate = 0.1, // 10% per annum
  ): number {
    if (daysLate <= 0) return 0;

    // Calculate daily penalty rate
    const dailyRate = penaltyRate / 365;
    return taxAmount * dailyRate * daysLate;
  }

  // Check if business needs to register for SST
  static checkSSTRegistrationRequirement(
    annualSalesRevenue: number,
    annualServiceRevenue: number,
  ): {
    salesTaxRegistrationRequired: boolean;
    serviceTaxRegistrationRequired: boolean;
    recommendations: string[];
  } {
    const salesTaxRequired = annualSalesRevenue >= this.SALES_TAX_THRESHOLD;
    const serviceTaxRequired =
      annualServiceRevenue >= this.SERVICE_TAX_THRESHOLD;

    const recommendations: string[] = [];

    if (salesTaxRequired) {
      recommendations.push(
        `Sales tax registration required - annual sales revenue (RM ${annualSalesRevenue.toLocaleString()}) exceeds threshold of RM ${this.SALES_TAX_THRESHOLD.toLocaleString()}`,
      );
    }

    if (serviceTaxRequired) {
      recommendations.push(
        `Service tax registration required - annual service revenue (RM ${annualServiceRevenue.toLocaleString()}) exceeds threshold of RM ${this.SERVICE_TAX_THRESHOLD.toLocaleString()}`,
      );
    }

    if (
      !salesTaxRequired &&
      annualSalesRevenue > this.SALES_TAX_THRESHOLD * 0.8
    ) {
      recommendations.push(
        "Consider voluntary sales tax registration - approaching threshold",
      );
    }

    if (
      !serviceTaxRequired &&
      annualServiceRevenue > this.SERVICE_TAX_THRESHOLD * 0.8
    ) {
      recommendations.push(
        "Consider voluntary service tax registration - approaching threshold",
      );
    }

    return {
      salesTaxRegistrationRequired: salesTaxRequired,
      serviceTaxRegistrationRequired: serviceTaxRequired,
      recommendations,
    };
  }

  // Generate tax invoice format compliant with Malaysian requirements
  static generateTaxInvoiceData(
    items: TaxableItem[],
    companyInfo: {
      name: string;
      address: string;
      sstNumber?: string;
      businessRegistrationNumber: string;
    },
    customerInfo: {
      name: string;
      address: string;
      sstNumber?: string;
    },
  ): {
    taxCalculation: TaxCalculationResult;
    invoiceData: {
      companyInfo: typeof companyInfo;
      customerInfo: typeof customerInfo;
      taxSummary: {
        totalExcludingTax: number;
        totalTax: number;
        totalIncludingTax: number;
        taxBreakdown: Array<{
          description: string;
          rate: string;
          amount: number;
        }>;
      };
      complianceNotes: string[];
    };
  } {
    const taxCalculation = this.calculateTotalTax(items);

    const taxBreakdown = [
      ...(taxCalculation.salesTaxAmount > 0
        ? [
            {
              description: "Sales Tax (10%)",
              rate: "10%",
              amount: taxCalculation.salesTaxAmount,
            },
          ]
        : []),
      ...(taxCalculation.serviceTaxAmount > 0
        ? [
            {
              description: "Service Tax (6%)",
              rate: "6%",
              amount: taxCalculation.serviceTaxAmount,
            },
          ]
        : []),
    ];

    const complianceNotes = [
      "This is a computer-generated tax invoice",
      "Payment terms: Net 30 days from invoice date",
      "Late payment may incur penalty charges",
    ];

    if (companyInfo.sstNumber) {
      complianceNotes.push(
        `Company SST Registration No: ${companyInfo.sstNumber}`,
      );
    }

    if (taxCalculation.exemptAmount > 0) {
      complianceNotes.push(
        "Some items are exempt from SST as per Malaysian tax regulations",
      );
    }

    return {
      taxCalculation,
      invoiceData: {
        companyInfo,
        customerInfo,
        taxSummary: {
          totalExcludingTax: taxCalculation.subtotal,
          totalTax: taxCalculation.totalTaxAmount,
          totalIncludingTax: taxCalculation.grandTotal,
          taxBreakdown,
        },
        complianceNotes,
      },
    };
  }

  // Calculate quarterly SST return summary
  static calculateQuarterlyReturn(
    transactions: Array<{
      date: string;
      items: TaxableItem[];
      type: "sale" | "purchase";
    }>,
    quarter: 1 | 2 | 3 | 4,
    year: number,
  ): {
    period: string;
    totalSales: number;
    totalPurchases: number;
    outputTax: number;
    inputTax: number;
    netTaxPayable: number;
    breakdown: {
      salesTax: { sales: number; tax: number };
      serviceTax: { sales: number; tax: number };
    };
  } {
    const quarterStart = new Date(year, (quarter - 1) * 3, 1);
    const quarterEnd = new Date(year, quarter * 3, 0);

    const quarterTransactions = transactions.filter((t) => {
      const transactionDate = new Date(t.date);
      return transactionDate >= quarterStart && transactionDate <= quarterEnd;
    });

    let totalSales = 0;
    let totalPurchases = 0;
    let outputTax = 0;
    let inputTax = 0;
    let salesTaxSales = 0;
    let salesTaxAmount = 0;
    let serviceTaxSales = 0;
    let serviceTaxAmount = 0;

    quarterTransactions.forEach((transaction) => {
      const taxResult = this.calculateTotalTax(transaction.items);

      if (transaction.type === "sale") {
        totalSales += taxResult.subtotal;
        outputTax += taxResult.totalTaxAmount;
        salesTaxSales += taxResult.breakdown
          .filter((b) => b.taxType === "sales")
          .reduce((sum, b) => sum + b.amount, 0);
        salesTaxAmount += taxResult.salesTaxAmount;
        serviceTaxSales += taxResult.breakdown
          .filter((b) => b.taxType === "service")
          .reduce((sum, b) => sum + b.amount, 0);
        serviceTaxAmount += taxResult.serviceTaxAmount;
      } else {
        totalPurchases += taxResult.subtotal;
        inputTax += taxResult.totalTaxAmount;
      }
    });

    return {
      period: `Q${quarter} ${year}`,
      totalSales,
      totalPurchases,
      outputTax,
      inputTax,
      netTaxPayable: Math.max(0, outputTax - inputTax),
      breakdown: {
        salesTax: { sales: salesTaxSales, tax: salesTaxAmount },
        serviceTax: { sales: serviceTaxSales, tax: serviceTaxAmount },
      },
    };
  }
}

// Export utility functions
export const calculateTax = MalaysianTaxCalculator.calculateTotalTax;
export const calculateItemTax = MalaysianTaxCalculator.calculateItemTax;
export const calculateLatePenalty = MalaysianTaxCalculator.calculateLatePenalty;
export const checkSSTRegistration =
  MalaysianTaxCalculator.checkSSTRegistrationRequirement;
export const generateTaxInvoice = MalaysianTaxCalculator.generateTaxInvoiceData;
export const calculateQuarterlyReturn =
  MalaysianTaxCalculator.calculateQuarterlyReturn;

// Tax rates and thresholds
export const TAX_RATES = {
  SALES_TAX: 0.1,
  SERVICE_TAX: 0.06,
  REGISTRATION_THRESHOLD: 500000,
};

// Common tax categories for foreign worker services
export const TAX_CATEGORIES = {
  EXEMPT: [
    "medical_examination",
    "government_fees",
    "insurance_premium",
    "training_certification",
    "legal_documentation",
  ],
  SERVICE: [
    "recruitment_service",
    "documentation_service",
    "accommodation_service",
    "transportation_service",
    "consultation_service",
    "processing_service",
  ],
  GOODS: ["equipment", "materials", "supplies", "uniforms", "safety_equipment"],
};
