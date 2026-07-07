/**
 * Currency Formatting Utilities for Malaysian Ringgit (MYR)
 * Used across FWMS for consistent monetary display
 */

import Decimal from 'decimal.js';

/**
 * Format a number or Decimal as Malaysian Ringgit (MYR)
 * @param value - The monetary value to format
 * @param options - Intl.NumberFormat options override
 * @returns Formatted currency string (e.g., "RM 1,234.56")
 */
export function formatMYR(
  value: number | Decimal | string | null | undefined,
  options?: Intl.NumberFormatOptions
): string {
  if (value === null || value === undefined) {
    return 'RM 0.00';
  }

  const numericValue = value instanceof Decimal 
    ? value.toNumber() 
    : typeof value === 'string' 
      ? parseFloat(value) 
      : value;

  if (isNaN(numericValue)) {
    return 'RM 0.00';
  }

  return new Intl.NumberFormat('en-MY', {
    style: 'currency',
    currency: 'MYR',
    currencyDisplay: 'symbol',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options,
  }).format(numericValue);
}

/**
 * Format a number or Decimal as compact MYR (e.g., "RM 1.2K")
 */
export function formatMYRCompact(
  value: number | Decimal | string | null | undefined
): string {
  if (value === null || value === undefined) {
    return 'RM 0';
  }

  const numericValue = value instanceof Decimal 
    ? value.toNumber() 
    : typeof value === 'string' 
      ? parseFloat(value) 
      : value;

  if (isNaN(numericValue)) {
    return 'RM 0';
  }

  return new Intl.NumberFormat('en-MY', {
    style: 'currency',
    currency: 'MYR',
    currencyDisplay: 'symbol',
    notation: 'compact',
    compactDisplay: 'short',
  }).format(numericValue);
}

/**
 * Parse a MYR formatted string back to Decimal
 */
export function parseMYR(value: string): Decimal {
  const cleaned = value.replace(/[RM,\s]/g, '');
  return new Decimal(cleaned || '0');
}
