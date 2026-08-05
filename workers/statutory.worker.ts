/**
 * Statutory e-Filing Worker — Sprint 9, Task 9.2 (2026 Rates Updated)
 *
 * Generates Malaysian statutory submission files:
 * - CP39  : EPF monthly employer contribution (fixed-width text / i-Akaun API)
 * - Borang 8A : SOCSO (fixed-width text)
 * - Lampiran 1 : EIS (Excel XLSX / CSV)
 * - PCB CP39   : Monthly tax deduction (fixed-width text / e-PCB API)
 * - LINDUNG 24 JAM : Non-Employment Injury Scheme (employee-only contribution)
 *
 * 2026 Rate Updates:
 * - EPF: Employee 11% (below 60), Employer 13% (≤RM5,000) / 12% (>RM5,000)
 * - SOCSO: Employee 0.5%, Employer 1.75% (capped at RM6,000)
 * - EIS: Employee 0.2%, Employer 0.2% (capped at RM6,000)
 * - LINDUNG 24 JAM: Employee 0.75% (Years 1-2), 1.00% (Years 3-5), 1.25% (Year 6+)
 * - PCB: Progressive 0%–30% (YA 2026 rates unchanged from YA 2025)
 *
 * Requirements: 8.3, 27.4
 */

import { Worker, Queue } from "bullmq";
import { Decimal } from "decimal.js";
import { prisma } from "@/lib/prisma";
import { createBullMqConnection } from "@/lib/queues/bullmq-connection";
import { put } from "@vercel/blob";

// Lazy blob token
const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN ?? "";

const connection = createBullMqConnection();

export const statutoryQueue = new Queue("statutory", { connection });

// ─── EPF rate table (2026 rates) ──────────────────────────────────────────────

/**
 * 2026 EPF Contribution Rates
 * Source: PwC Malaysia Tax Summary 2026, KWSP Third Schedule
 * 
 * Malaysian citizens & PRs (below 60):
 *   - Employee: 11% (flat rate, all salary levels)
 *   - Employer: 13% (salary ≤ RM5,000) / 12% (salary > RM5,000)
 * 
 * Malaysian citizens & PRs (60 and above):
 *   - Employee: 0%
 *   - Employer: 4%
 * 
 * Non-Malaysians (mandatory from October 2025):
 *   - Employee: 2%
 *   - Employer: 2%
 * 
 * Source: https://taxsummaries.pwc.com/Malaysia/Individual/Other-taxes[reference:5]
 *         https://www.malaysia.gov.my[reference:6]
 */
export function calcEpfRate(
  grossSalary: Decimal,
  ageAtPeriodEnd: number,
  nationality: "MALAYSIAN" | "PR" | "FOREIGN"
): {
  employee: Decimal;
  employer: Decimal;
} {
  // Non-Malaysian employees: 2% each side (mandatory from October 2025)[reference:7]
  if (nationality === "FOREIGN") {
    return {
      employee: grossSalary.mul(0.02).toDecimalPlaces(2),
      employer: grossSalary.mul(0.02).toDecimalPlaces(2),
    };
  }

  // Malaysian citizens & PRs aged 60 and above[reference:8]
  if (ageAtPeriodEnd >= 60) {
    return {
      employee: new Decimal(0),
      employer: grossSalary.mul(0.04).toDecimalPlaces(2),
    };
  }

  // Malaysian citizens & PRs below 60[reference:9][reference:10]
  const employeeRate = 0.11;
  const employerRate = grossSalary.lte(5000) ? 0.13 : 0.12;

  return {
    employee: grossSalary.mul(employeeRate).toDecimalPlaces(2),
    employer: grossSalary.mul(employerRate).toDecimalPlaces(2),
  };
}

// ─── SOCSO rate table (2026 rates) ────────────────────────────────────────────

/**
 * 2026 SOCSO Contribution Rates
 * Source: PERKESO Contribution Schedule, PwC Malaysia Tax Summary 2026
 * 
 * First Category (below 60):
 *   - Employee: 0.5%
 *   - Employer: 1.75%
 * 
 * Second Category (60 and above):
 *   - Employee: 0%
 *   - Employer: 1.25%
 * 
 * Wage ceiling: RM 6,000 (effective October 2024)[reference:11]
 * 
 * Source: https://taxsummaries.pwc.com/Malaysia/Individual/Other-taxes[reference:12]
 *         https://www.teamed.global[reference:13]
 */
export function calcSocsoRate(
  grossSalary: Decimal,
  ageAtPeriodEnd: number
): { employee: Decimal; employer: Decimal } {
  const wage = Decimal.min(grossSalary, 6000);

  if (ageAtPeriodEnd >= 60) {
    // Second Category: employer-only 1.25%[reference:14]
    return {
      employee: new Decimal(0),
      employer: wage.mul(0.0125).toDecimalPlaces(2),
    };
  }

  // First Category: employee 0.5%, employer 1.75%[reference:15][reference:16]
  return {
    employee: wage.mul(0.005).toDecimalPlaces(2),
    employer: wage.mul(0.0175).toDecimalPlaces(2),
  };
}

// ─── EIS rate table (2026 rates) ──────────────────────────────────────────────

/**
 * 2026 EIS Contribution Rates
 * Source: Employment Insurance System Act 2017, PERKESO
 * 
 * Both employer and employee: 0.2% each (total 0.4%)
 * Wage ceiling: RM 6,000 (effective October 2024)[reference:17][reference:18]
 * 
 * Covers: Malaysian citizens and PRs aged 18-60
 * Excludes: Foreign workers, domestic workers[reference:19]
 * 
 * Source: https://taxsummaries.pwc.com/Malaysia/Individual/Other-taxes[reference:20]
 */
export function calcEisRate(grossSalary: Decimal): { employee: Decimal; employer: Decimal } {
  const wage = Decimal.min(grossSalary, 6000);
  return {
    employee: wage.mul(0.002).toDecimalPlaces(2),
    employer: wage.mul(0.002).toDecimalPlaces(2),
  };
}

// ─── LINDUNG 24 JAM (Non-Employment Injury Scheme) ──────────────────────────

/**
 * LINDUNG 24 JAM contribution rate phases (2026)
 * Effective from 1 June 2026
 * Source: PERKESO official website, PwC Malaysia Tax Summary 2026
 * 
 * Phase 1: Years 1-2 → 0.75%
 * Phase 2: Years 3-5 → 1.00%
 * Phase 3: Year 6 onwards → 1.25%
 * 
 * Contribution is fully borne by employees (employer pays on behalf,
 * then deducts from employee salary).
 * Wage ceiling: RM 6,000[reference:21][reference:22]
 * 
 * Mandatory for foreign workers; voluntary for Malaysians (opt-in since 8 July 2026)[reference:23]
 * 
 * Source: https://taxsummaries.pwc.com/Malaysia/Individual/Other-taxes[reference:24]
 *         https://www.perkeso.gov.my[reference:25]
 */
const LINDUNG_PHASES = [
  { maxYear: 2, rate: 0.0075 },   // Phase 1: first 2 years (0.75%)
  { maxYear: 5, rate: 0.010 },    // Phase 2: next 3 years (1.00%)
  { maxYear: Infinity, rate: 0.0125 }, // Phase 3: from 6th year onwards (1.25%)
];

export function calcLindungRate(
  grossSalary: Decimal,
  yearsSinceImplementation: number
): Decimal {
  // Wage ceiling of RM 6,000 applies[reference:26]
  const wage = Decimal.min(grossSalary, 6000);
  
  // Determine which phase applies based on years since implementation
  const phase = LINDUNG_PHASES.find((p) => yearsSinceImplementation <= p.maxYear);
  const rate = phase?.rate ?? 0.0125; // fallback to Phase 3 rate
  
  return wage.mul(rate).toDecimalPlaces(2);
}

/**
 * Determines if an employee is eligible/required for LINDUNG 24 JAM
 * - Foreign workers: mandatory[reference:27]
 * - Local workers: voluntary (employer should check employee's opt-in status)[reference:28]
 */
export function isLindungEligible(
  employeeNationality: string, // "MALAYSIAN" or "FOREIGN"
  isOptedIn: boolean = false // for local workers only
): boolean {
  if (employeeNationality === "FOREIGN") {
    return true; // mandatory for foreign workers
  }
  // Local workers: voluntary, only if they have opted in (since 8 July 2026)[reference:29]
  return isOptedIn;
}

// ─── PCB bracket calculation (YA 2026) ──────────────────────────────────────

/**
 * 2026 PCB / Monthly Tax Deduction rates (YA 2026)
 * Source: LHDN (Inland Revenue Board of Malaysia)
 * 
 * Progressive tax brackets (0% to 30%)
 * Rates unchanged from YA 2025[reference:30]
 * 
 * Note: This is a simplified calculation. Actual PCB calculation should consider:
 * - Personal reliefs (RM 9,000 individual, RM 4,000 spouse, RM 2,000+ child)[reference:31]
 * - EPF deduction (up to RM 4,000)[reference:32]
 * - Medical insurance (up to RM 3,000)[reference:33]
 * - Zakat payments[reference:34]
 * 
 * Source: https://recruitgo.com[reference:35]
 *         https://aniday.com[reference:36]
 */
export function calcPcbMonthly(annualTaxableIncome: Decimal): Decimal {
  // YA 2026 tax brackets (progressive 0% to 30%)[reference:37][reference:38]
  const brackets = [
    { limit: 5000,   rate: 0,    base: 0 },
    { limit: 20000,  rate: 0.01, base: 0 },
    { limit: 35000,  rate: 0.03, base: 150 },
    { limit: 50000,  rate: 0.06, base: 600 },  // Updated: 6% for RM35,001-50,000[reference:39]
    { limit: 70000,  rate: 0.11, base: 1500 }, // Updated: 11% for RM50,001-70,000[reference:40]
    { limit: 100000, rate: 0.19, base: 3700 }, // Updated bracket
    { limit: 250000, rate: 0.21, base: 11100 },
    { limit: 400000, rate: 0.245, base: 47100 },
    { limit: 600000, rate: 0.25, base: 83850 },
    { limit: 1000000, rate: 0.26, base: 133850 },
    { limit: 2000000, rate: 0.28, base: 237850 },
    { limit: Infinity, rate: 0.30, base: 517850 },
  ];

  let tax = new Decimal(0);
  let prevLimit = new Decimal(0);

  for (const bracket of brackets) {
    if (annualTaxableIncome.lte(prevLimit)) break;
    const taxableInBracket = Decimal.min(annualTaxableIncome, bracket.limit).sub(prevLimit);
    tax = tax.add(taxableInBracket.mul(bracket.rate));
    prevLimit = new Decimal(bracket.limit);
    if (annualTaxableIncome.lte(bracket.limit)) break;
  }

  // Monthly PCB = annual tax / 12
  return tax.div(12).toDecimalPlaces(2);
}

// ─── CP39 fixed-width format generator ───────────────────────────────────────

interface Cp39Record {
  icNumber: string;
  name: string;
  employeeEpfNumber: string;
  grossWage: Decimal;
  employeeContribution: Decimal;
  employerContribution: Decimal;
}

export function generateCp39(
  employerEpfNumber: string,
  month: string, // YYYYMM
  records: Cp39Record[]
): string {
  const lines: string[] = [];
  // Header record
  lines.push(`H${employerEpfNumber.padEnd(12)}${month}${records.length.toString().padStart(6, "0")}`);

  for (const r of records) {
    const gross = r.grossWage.toFixed(2).replace(".", "").padStart(10, "0");
    const eeContrib = r.employeeContribution.toFixed(2).replace(".", "").padStart(8, "0");
    const erContrib = r.employerContribution.toFixed(2).replace(".", "").padStart(8, "0");
    lines.push(
      `D${r.icNumber.padEnd(14)}${r.name.padEnd(60)}${r.employeeEpfNumber.padEnd(8)}${gross}${eeContrib}${erContrib}`
    );
  }

  // Footer totals
  const totalEe = records.reduce((s, r) => s.add(r.employeeContribution), new Decimal(0));
  const totalEr = records.reduce((s, r) => s.add(r.employerContribution), new Decimal(0));
  lines.push(
    `T${records.length.toString().padStart(6, "0")}${totalEe.toFixed(2).replace(".", "").padStart(12, "0")}${totalEr.toFixed(2).replace(".", "").padStart(12, "0")}`
  );

  return lines.join("\n");
}

// ─── SOCSO Borang 8A generator (fixed‑width) ────────────────────────────────

interface SocsoRecord {
  icNumber: string;
  name: string;
  socsoNumber: string;
  grossWage: Decimal;
  employeeContribution: Decimal;
  employerContribution: Decimal;
}

export function generateBorang8a(
  employerSocsoNumber: string,
  month: string,
  records: SocsoRecord[]
): string {
  // Simple fixed‑width format; adjust according to actual SOCSO spec
  const lines: string[] = [];
  lines.push(`H${employerSocsoNumber.padEnd(12)}${month}${records.length.toString().padStart(6, "0")}`);

  for (const r of records) {
    const gross = r.grossWage.toFixed(2).replace(".", "").padStart(10, "0");
    const ee = r.employeeContribution.toFixed(2).replace(".", "").padStart(8, "0");
    const er = r.employerContribution.toFixed(2).replace(".", "").padStart(8, "0");
    lines.push(
      `D${r.icNumber.padEnd(14)}${r.name.padEnd(60)}${r.socsoNumber.padEnd(10)}${gross}${ee}${er}`
    );
  }

  const totalEe = records.reduce((s, r) => s.add(r.employeeContribution), new Decimal(0));
  const totalEr = records.reduce((s, r) => s.add(r.employerContribution), new Decimal(0));
  lines.push(
    `T${records.length.toString().padStart(6, "0")}${totalEe.toFixed(2).replace(".", "").padStart(12, "0")}${totalEr.toFixed(2).replace(".", "").padStart(12, "0")}`
  );

  return lines.join("\n");
}

// ─── EIS Lampiran 1 generator (CSV) ──────────────────────────────────────────

interface EisRecord {
  icNumber: string;
  name: string;
  eisNumber: string;
  grossWage: Decimal;
  employeeContribution: Decimal;
  employerContribution: Decimal;
}

export function generateLampiran1(
  month: string,
  records: EisRecord[]
): string {
  // CSV format (compatible with SOCSO e‑submission)
  const header = "IC,Name,EIS_Number,Gross_Wage,EE_Contribution,ER_Contribution\n";
  const rows = records.map(r =>
    `${r.icNumber},${r.name},${r.eisNumber},${r.grossWage.toFixed(2)},${r.employeeContribution.toFixed(2)},${r.employerContribution.toFixed(2)}`
  ).join("\n");
  return header + rows;
}

// ─── PCB CP39 generator (fixed‑width) ────────────────────────────────────────

interface PcbRecord {
  icNumber: string;
  name: string;
  taxReference: string;
  grossWage: Decimal;
  pcbAmount: Decimal;
}

export function generatePcbCp39(
  employerTaxReference: string,
  month: string,
  records: PcbRecord[]
): string {
  // Format similar to CP39 but for PCB (tax deduction)
  const lines: string[] = [];
  lines.push(`H${employerTaxReference.padEnd(12)}${month}${records.length.toString().padStart(6, "0")}`);

  for (const r of records) {
    const gross = r.grossWage.toFixed(2).replace(".", "").padStart(10, "0");
    const pcb = r.pcbAmount.toFixed(2).replace(".", "").padStart(8, "0");
    lines.push(
      `D${r.icNumber.padEnd(14)}${r.name.padEnd(60)}${r.taxReference.padEnd(12)}${gross}${pcb}`
    );
  }

  const totalPcb = records.reduce((s, r) => s.add(r.pcbAmount), new Decimal(0));
  lines.push(
    `T${records.length.toString().padStart(6, "0")}${totalPcb.toFixed(2).replace(".", "").padStart(12, "0")}`
  );

  return lines.join("\n");
}

// ─── LINDUNG 24 JAM generator (SOCSO add-on, CSV) ───────────────────────────

interface LindungRecord {
  icNumber: string;
  name: string;
  socsoNumber: string;
  grossWage: Decimal;
  employeeContribution: Decimal; // fully employee-borne
}

export function generateLindungFile(
  month: string,
  records: LindungRecord[]
): string {
  // CSV format for LINDUNG 24 JAM submission to PERKESO
  const header = "IC,Name,SOCSO_Number,Gross_Wage,LINDUNG_EE_Contribution\n";
  const rows = records.map(r =>
    `${r.icNumber},${r.name},${r.socsoNumber},${r.grossWage.toFixed(2)},${r.employeeContribution.toFixed(2)}`
  ).join("\n");
  return header + rows;
}

// ─── Blob storage helper ────────────────────────────────────────────────────

async function storeStatutoryFile(
  tenantId: string,
  runId: string,
  filename: string,
  content: string
): Promise<string> {
  const blob = await put(`statutory/${tenantId}/${runId}/${filename}`, content, {
    access: "private",
    contentType: "text/plain",
  });
  return blob.url;
}

// ─── Helper: Calculate age from date of birth and period end ───────────────

function calculateAge(birthDate: Date, periodEnd: Date): number {
  let age = periodEnd.getFullYear() - birthDate.getFullYear();
  const m = periodEnd.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && periodEnd.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

// ─── Helper: Calculate years since LINDUNG implementation ──────────────────

function getLindungYearsSinceImplementation(periodDate: Date): number {
  // LINDUNG 24 JAM effective from 1 June 2026[reference:41]
  const implementationDate = new Date(2026, 5, 1); // June 1, 2026
  
  let years = periodDate.getFullYear() - implementationDate.getFullYear();
  const m = periodDate.getMonth() - implementationDate.getMonth();
  if (m < 0 || (m === 0 && periodDate.getDate() < implementationDate.getDate())) {
    years--;
  }
  // Ensure we don't return negative if period is before implementation
  return Math.max(0, years);
}

// ─── Worker ───────────────────────────────────────────────────────────────────

type StatutoryJobType =
  | "generate-cp39"
  | "generate-borang8a"
  | "generate-lampiran1"
  | "generate-pcb"
  | "generate-lindung";

interface StatutoryJob {
  type: StatutoryJobType;
  tenantId: string;
  legalEntityId: string;
  runId: string;
  periodYearMonth: string; // YYYYMM
}

export const statutoryWorker = new Worker<StatutoryJob>(
  "statutory",
  async (job) => {
    const { type, tenantId, runId, legalEntityId, periodYearMonth } = job.data;

    // Sanitize job data fields before any log output (CWE-117)
    const safeRunId = String(runId).replace(/[\r\n\t]/g, "_").slice(0, 64);

    // Fetch payroll run with line items
    const run = await prisma.payrollRun.findFirst({
      where: { id: runId, tenantId },
      include: { lineItems: true },
    });
    if (!run) throw new Error(`PayrollRun not found for runId ${safeRunId}`);

    // Fetch legal entity (for official registration numbers)
    const legalEntity = await prisma.legalEntity.findUnique({
      where: { id: legalEntityId },
      select: {
        epfNumber: true,
        socsoNumber: true,
        eisNumber: true,
        taxReference: true,
      },
    });
    if (!legalEntity) throw new Error(`LegalEntity not found for id ${legalEntityId}`);

    // Determine period end date (assuming run.periodEndDate exists)
    const periodEndDate = run.periodEndDate ?? new Date();

    // Calculate years since LINDUNG implementation for rate phasing
    const lindungYears = getLindungYearsSinceImplementation(periodEndDate);

    // Collect employee IDs
    const employeeIds = [...new Set(run.lineItems.map((li: any) => li.employeeId))];
    const employees = await prisma.employee.findMany({
      where: { id: { in: employeeIds }, tenantId },
      select: {
        id: true,
        name: true,
        nationalId: true,
        dateOfBirth: true,
        epfNumber: true,
        socsoNumber: true,
        eisNumber: true,
        nationality: true,        // "MALAYSIAN" | "PR" | "FOREIGN"
        lindungOptedIn: true,     // boolean for local workers who opt in
        email: true,
        employmentStatus: true,
      },
    });

    // Helper to compute gross wage per employee
    const getGrossWage = (empId: string): Decimal => {
      const empLineItems = run.lineItems.filter((li: any) => li.employeeId === empId);
      return empLineItems
        .filter(
          (li: any) =>
            ![
              "DEDUCTION",
              "EPF_EE",
              "SOCSO",
              "EIS",
              "PCB",
              "LOAN",
              "ADVANCE",
              "NET",
              "EPF_ER",
              "LINDUNG",
            ].includes(li.componentType)
        )
        .reduce((s: Decimal, li: any) => s.add(new Decimal(li.amount)), new Decimal(0));
    };

    // ─── CP39 (EPF) ────────────────────────────────────────────────────────────
    if (type === "generate-cp39") {
      if (!legalEntity.epfNumber) {
        throw new Error("Legal entity missing EPF number");
      }

      const cp39Records: Cp39Record[] = [];
      for (const emp of employees) {
        const grossWage = getGrossWage(emp.id);
        if (grossWage.lte(0)) continue;

        // Compute age at period end
        const age = emp.dateOfBirth ? calculateAge(emp.dateOfBirth, periodEndDate) : 35;
        const nationality = (emp.nationality ?? "MALAYSIAN") as "MALAYSIAN" | "PR" | "FOREIGN";
        const rates = calcEpfRate(grossWage, age, nationality);

        cp39Records.push({
          icNumber: emp.nationalId ?? "000000000000",
          name: emp.name,
          employeeEpfNumber: emp.epfNumber ?? "00000000",
          grossWage,
          employeeContribution: rates.employee,
          employerContribution: rates.employer,
        });
      }

      const cp39Content = generateCp39(
        legalEntity.epfNumber,
        periodYearMonth,
        cp39Records
      );
      const url = await storeStatutoryFile(
        tenantId,
        runId,
        `cp39_${periodYearMonth}.txt`,
        cp39Content
      );
      console.log(`[statutory-worker] CP39 generated for run ${safeRunId}: ${url}`);
    }

    // ─── Borang 8A (SOCSO) ──────────────────────────────────────────────────────
    if (type === "generate-borang8a") {
      if (!legalEntity.socsoNumber) {
        throw new Error("Legal entity missing SOCSO number");
      }

      const socsoRecords: SocsoRecord[] = [];
      for (const emp of employees) {
        const grossWage = getGrossWage(emp.id);
        if (grossWage.lte(0)) continue;

        const age = emp.dateOfBirth ? calculateAge(emp.dateOfBirth, periodEndDate) : 35;
        const rates = calcSocsoRate(grossWage, age);

        socsoRecords.push({
          icNumber: emp.nationalId ?? "000000000000",
          name: emp.name,
          socsoNumber: emp.socsoNumber ?? "0000000000",
          grossWage,
          employeeContribution: rates.employee,
          employerContribution: rates.employer,
        });
      }

      const borang8aContent = generateBorang8a(
        legalEntity.socsoNumber,
        periodYearMonth,
        socsoRecords
      );
      const url = await storeStatutoryFile(
        tenantId,
        runId,
        `borang8a_${periodYearMonth}.txt`,
        borang8aContent
      );
      console.log(`[statutory-worker] Borang 8A generated for run ${safeRunId}: ${url}`);
    }

    // ─── Lampiran 1 (EIS) ──────────────────────────────────────────────────────
    if (type === "generate-lampiran1") {
      if (!legalEntity.eisNumber) {
        throw new Error("Legal entity missing EIS number");
      }

      const eisRecords: EisRecord[] = [];
      for (const emp of employees) {
        const grossWage = getGrossWage(emp.id);
        if (grossWage.lte(0)) continue;

        // EIS only applies to Malaysians and PRs aged 18-60[reference:42]
        const nationality = emp.nationality ?? "MALAYSIAN";
        if (nationality === "FOREIGN") continue;

        const age = emp.dateOfBirth ? calculateAge(emp.dateOfBirth, periodEndDate) : 35;
        if (age < 18 || age >= 60) continue;

        const rates = calcEisRate(grossWage);
        eisRecords.push({
          icNumber: emp.nationalId ?? "000000000000",
          name: emp.name,
          eisNumber: emp.eisNumber ?? "0000000000",
          grossWage,
          employeeContribution: rates.employee,
          employerContribution: rates.employer,
        });
      }

      const lampiran1Content = generateLampiran1(periodYearMonth, eisRecords);
      const url = await storeStatutoryFile(
        tenantId,
        runId,
        `lampiran1_eis_${periodYearMonth}.csv`,
        lampiran1Content
      );
      console.log(`[statutory-worker] Lampiran 1 (EIS) generated for run ${safeRunId}: ${url}`);
    }

    // ─── PCB CP39 ──────────────────────────────────────────────────────────────
    if (type === "generate-pcb") {
      if (!legalEntity.taxReference) {
        throw new Error("Legal entity missing tax reference");
      }

      const pcbRecords: PcbRecord[] = [];
      for (const emp of employees) {
        const grossWage = getGrossWage(emp.id);
        if (grossWage.lte(0)) continue;

        // Simplified: assume annual taxable = gross monthly * 12 (no deductions)
        // Actual PCB should consider reliefs: individual RM9,000, spouse RM4,000,
        // child RM2,000+, EPF up to RM4,000, medical insurance up to RM3,000[reference:43]
        const annualTaxable = grossWage.mul(12);
        const pcbAmount = calcPcbMonthly(annualTaxable);

        pcbRecords.push({
          icNumber: emp.nationalId ?? "000000000000",
          name: emp.name,
          taxReference: emp.epfNumber ?? "000000000000",
          grossWage,
          pcbAmount,
        });
      }

      const pcbContent = generatePcbCp39(
        legalEntity.taxReference,
        periodYearMonth,
        pcbRecords
      );
      const url = await storeStatutoryFile(
        tenantId,
        runId,
        `pcb_cp39_${periodYearMonth}.txt`,
        pcbContent
      );
      console.log(`[statutory-worker] PCB CP39 generated for run ${safeRunId}: ${url}`);
    }

    // ─── LINDUNG 24 JAM ─────────────────────────────────────────────────────────
    if (type === "generate-lindung") {
      if (!legalEntity.socsoNumber) {
        throw new Error("Legal entity missing SOCSO number (required for LINDUNG submission)");
      }

      const lindungRecords: LindungRecord[] = [];
      for (const emp of employees) {
        const grossWage = getGrossWage(emp.id);
        if (grossWage.lte(0)) continue;

        // Check if employee is eligible for LINDUNG
        const nationality = emp.nationality ?? "MALAYSIAN";
        const isOptedIn = emp.lindungOptedIn ?? false;
        
        if (!isLindungEligible(nationality, isOptedIn)) {
          continue; // Skip if not eligible (local worker who hasn't opted in)
        }

        // Calculate LINDUNG contribution based on phase
        const lindungContribution = calcLindungRate(grossWage, lindungYears);

        lindungRecords.push({
          icNumber: emp.nationalId ?? "000000000000",
          name: emp.name,
          socsoNumber: emp.socsoNumber ?? "0000000000",
          grossWage,
          employeeContribution: lindungContribution,
        });
      }

      // Generate LINDUNG submission file
      const lindungContent = generateLindungFile(periodYearMonth, lindungRecords);
      const url = await storeStatutoryFile(
        tenantId,
        runId,
        `lindung_24jam_${periodYearMonth}.csv`,
        lindungContent
      );
      console.log(`[statutory-worker] LINDUNG 24 JAM generated for run ${safeRunId}: ${url}`);
      
      // Also log summary for audit
      const totalLindung = lindungRecords.reduce(
        (s, r) => s.add(r.employeeContribution), 
        new Decimal(0)
      );
      console.log(
        `[statutory-worker] LINDUNG 24 JAM summary for run ${safeRunId}: ` +
        `${lindungRecords.length} employees, total RM ${totalLindung.toFixed(2)}`
      );
    }
  },
  { connection, concurrency: 2 }
);

// ─── Graceful shutdown ──────────────────────────────────────────────────────

export async function stopWorker() {
  try {
    await statutoryWorker.close();
  } catch {}
  try {
    await statutoryQueue.close();
  } catch {}
}

console.log("[statutory-worker] Started");