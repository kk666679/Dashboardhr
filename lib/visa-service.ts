"use server";

import { prisma } from "@/lib/prisma";

const VisaStatus = {
  ACTIVE: "ACTIVE",
  EXPIRED: "EXPIRED",
  RENEWING: "RENEWING",
  CANCELLED: "CANCELLED",
} as const;

export interface CreateVisaInput {
  employeeId: string;
  tenantId: string;
  type: string;
  number: string;
  issueDate: Date;
  expiryDate: Date;
  status?: typeof VisaStatus[keyof typeof VisaStatus];
}

export async function createVisa(data: CreateVisaInput) {
  return await prisma.visa.create({
    data: {
      employeeId: data.employeeId,
      tenantId: data.tenantId,
      type: data.type,
      number: data.number,
      issueDate: data.issueDate,
      expiryDate: data.expiryDate,
      status: data.status || VisaStatus.ACTIVE,
    },
  });
}

export async function getVisasByEmployee(employeeId: string, tenantId: string) {
  return await prisma.visa.findMany({
    where: { employeeId, tenantId },
    orderBy: { expiryDate: "desc" },
  });
}

export async function renewVisa(visaId: string, newExpiryDate: Date) {
  return await prisma.visa.update({
    where: { id: visaId },
    data: {
      expiryDate: newExpiryDate,
      status: VisaStatus.ACTIVE,
      updatedAt: new Date(),
    },
  });
}

export async function expireVisa(visaId: string) {
  return await prisma.visa.update({
    where: { id: visaId },
    data: {
      status: VisaStatus.EXPIRED,
      updatedAt: new Date(),
    },
  });
}

export async function getExpiringVisas(
  tenantId: string,
  daysThreshold: number = 30,
) {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + daysThreshold);

  return await prisma.visa.findMany({
    where: {
      tenantId,
      status: VisaStatus.ACTIVE,
      expiryDate: {
        lte: futureDate,
        gte: new Date(),
      },
    },
    include: {
      employee: true,
    },
    orderBy: { expiryDate: "asc" },
  });
}
