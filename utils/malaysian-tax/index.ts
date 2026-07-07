// Base tax calculator
export {
  type TaxableItem,
  type TaxBreakdown,
  type TaxCalculationResult,
  MalaysianTaxCalculator,
  calculateTax,
  calculateItemTax,
  calculateLatePenalty,
  checkSSTRegistration,
  generateTaxInvoice,
  calculateQuarterlyReturn,
} from './tax-calculator';

// Enhanced tax calculator — alias clashing names
export {
  MalaysianTaxCalculator as EnhancedTaxCalculator,
  type TaxCalculationResult as EnhancedTaxCalculationResult,
} from './tax-calculator-enhanced';
