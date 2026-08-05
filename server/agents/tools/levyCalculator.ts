/**
 * Levy calculator using canonical rates from lib/constants/levy-rates.
 * This is the single source of truth — do NOT duplicate rate values here.
 */
import { calculateAnnualLevy, getSectorKey } from "@/lib/constants/levy-rates";

export async function levyCalculator(sector: string, workerCount: number, nationality?: string): Promise<{ monthlyLevy: number }> {
  // Use canonical rates: calculateAnnualLevy gives annual levy per worker
  // Divide by 12 for monthly, multiply by worker count
  const annualLevyPerWorker = calculateAnnualLevy(sector, nationality ?? "default");
  const monthlyLevy = (annualLevyPerWorker / 12) * workerCount;
  return { monthlyLevy: Math.round(monthlyLevy * 100) / 100 };
}

