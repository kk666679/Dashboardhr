import { prisma } from "@/lib/prisma";
import { buildExpatriatesDashboard } from "./mapper";
import { ExpatriateSchema } from "./schema";
import type { Expatriate, ExpatriatesDashboard } from "./types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toIsoDate(value: Date | string | null | undefined): string | null {
  if (!value) return null;
  return value instanceof Date ? value.toISOString() : String(value);
}

function mapExpatriateRecord(record: {
  id: string;
  tenantId: string;
  employeeId: string;
  status: string;
  relocationInfo: unknown;
  taxInfo: unknown;
  allowances: unknown[];
  workflows: string[];
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  employee: {
    id: string;
    name: string;
    email: string;
    position: string | null;
    department: string | null;
    nationality: string | null;
    visas: Array<{ number: string; expiryDate: Date }>;
  };
}): Expatriate {
  const relocationInfo = isRecord(record.relocationInfo)
    ? {
        originCountry: String(record.relocationInfo.originCountry ?? ""),
        arrivalDate: String(record.relocationInfo.arrivalDate ?? ""),
        orientationCompleted: Boolean(
          record.relocationInfo.orientationCompleted,
        ),
      }
    : undefined;

  const taxInfo = isRecord(record.taxInfo)
    ? {
        taxResidency:
          record.taxInfo.taxResidency === "Malaysia" ||
          record.taxInfo.taxResidency === "HomeCountry" ||
          record.taxInfo.taxResidency === "None"
            ? record.taxInfo.taxResidency
            : "None",
        pcbBracket: String(record.taxInfo.pcbBracket ?? ""),
        epfEligible: Boolean(record.taxInfo.epfEligible),
      }
    : undefined;

  const allowances = record.allowances.map((allowance) => {
    if (!isRecord(allowance)) {
      return { type: "other", amount: 0, currency: "MYR" };
    }

    return {
      type: String(allowance.type ?? "other"),
      amount: Number(allowance.amount ?? 0),
      currency: String(allowance.currency ?? "MYR"),
      description:
        allowance.description === undefined
          ? undefined
          : String(allowance.description),
    };
  });

  return ExpatriateSchema.parse({
    id: record.id,
    tenantId: record.tenantId,
    employeeId: record.employeeId,
    status: record.status,
    relocationInfo,
    taxInfo,
    allowances,
    workflows: record.workflows,
    notes: record.notes,
    createdAt: toIsoDate(record.createdAt),
    updatedAt: toIsoDate(record.updatedAt),
    employee: {
      id: record.employee.id,
      name: record.employee.name,
      email: record.employee.email,
      position: record.employee.position,
      department: record.employee.department,
      nationality: record.employee.nationality,
      visas: record.employee.visas.map((visa) => ({
        number: visa.number,
        expiryDate: toIsoDate(visa.expiryDate),
      })),
    },
  });
}

export async function listExpatriates(tenantId: string): Promise<Expatriate[]> {
  const records = await prisma.expatriate.findMany({
    where: { tenantId },
    include: {
      employee: {
        select: {
          id: true,
          name: true,
          email: true,
          position: true,
          department: true,
          nationality: true,
          visas: {
            select: { number: true, expiryDate: true },
            orderBy: { expiryDate: "asc" },
          },
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return records.map(mapExpatriateRecord);
}

export async function getExpatriatesDashboard(
  tenantId: string,
): Promise<ExpatriatesDashboard> {
  const expatriates = await listExpatriates(tenantId);
  return buildExpatriatesDashboard(expatriates);
}

export async function getExpatriateById(
  id: string,
  tenantId: string,
): Promise<Expatriate | null> {
  const record = await prisma.expatriate.findFirst({
    where: { id, tenantId },
    include: {
      employee: {
        select: {
          id: true,
          name: true,
          email: true,
          position: true,
          department: true,
          nationality: true,
          visas: {
            select: { number: true, expiryDate: true },
            orderBy: { expiryDate: "asc" },
          },
        },
      },
    },
  });

  return record ? mapExpatriateRecord(record) : null;
}
