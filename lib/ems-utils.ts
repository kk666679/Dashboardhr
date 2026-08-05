import { prisma } from "./prisma";

const VisaStatus = {
  ACTIVE: "ACTIVE",
  EXPIRED: "EXPIRED",
  RENEWING: "RENEWING",
  CANCELLED: "CANCELLED",
} as const;

const DocumentStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  EXPIRED: "EXPIRED",
} as const;

const DocumentType = {
  PASSPORT: "PASSPORT",
  VISA: "VISA",
  CONTRACT: "CONTRACT",
  PERMIT: "PERMIT",
  CERTIFICATE: "CERTIFICATE",
} as const;

export interface ExpiryStats {
  imminent: number; // <30 days
  soon: number; // 30-60 days
  safe: number; // >60 days
  total: number;
  byCountry: Record<string, number>;
}

export async function getExpiryHeatmap(tenantId: string): Promise<ExpiryStats> {
  const now = new Date();
  const imminentDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const soonDate = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);

  // Visas (include employee country fallback)
  const visas = await prisma.visa.findMany({
    where: { tenantId, status: { not: VisaStatus.EXPIRED } },
    include: { employee: true },
  });

  // Documents (passport/visa/medical)
  const documents = await prisma.document.findMany({
    where: {
      tenantId,
      status: { notIn: [DocumentStatus.EXPIRED, DocumentStatus.REJECTED] },
      type: {
        in: [
          DocumentType.PASSPORT,
          DocumentType.VISA,
          DocumentType.CERTIFICATE,
        ],
      },
      expiryDate: { not: null },
    },
    include: { employee: true },
  });

  interface ExpiryItem {
    expiry: Date;
    country: string;
  }

  const allExpiries: ExpiryItem[] = [
    ...(visas as any[]).map((v: any) => ({
      expiry: v.expiryDate,
      country: v.employee.country || v.country || "Unknown",
    })),
    ...(documents as any[]).map((d: any) => ({
      expiry: d.expiryDate!,
      country: d.employee.country || "Unknown",
    })),
  ].filter((e) => e.expiry > new Date());

  const stats: ExpiryStats = {
    imminent: 0,
    soon: 0,
    safe: 0,
    total: allExpiries.length,
    byCountry: {},
  };

  allExpiries.forEach(({ expiry, country }) => {
    const daysLeft = Math.ceil(
      (expiry.getTime() - now.getTime()) / (24 * 60 * 60 * 1000),
    );
    if (daysLeft <= 30) stats.imminent++;
    else if (daysLeft <= 60) stats.soon++;
    else stats.safe++;

    stats.byCountry[country] = (stats.byCountry[country] || 0) + 1;
  });

  return stats;
}

// Placeholder - seed rules in future
export async function ensureDefaultRules(tenantId: string) {
  await prisma.complianceRule.upsert({
    where: {
      tenantId_country_ruleType: { tenantId, country: "MY", ruleType: "VISA" },
    },
    update: {},
    create: {
      tenantId,
      country: "MY",
      ruleType: "VISA",
      validityMonths: 12,
      alertDays: 60,
      renewalLeadTime: 30,
      description: "Malaysia PLKS/Visa rules",
    },
  });
  // Add more...
}
