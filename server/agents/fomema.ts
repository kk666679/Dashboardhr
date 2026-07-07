import { prisma } from "@/lib/prisma";

export async function fomemaAgent(input: string, employeeId?: string) {
  try {
    const employee = employeeId
      ? await prisma.employee.findUnique({ where: { id: employeeId } })
      : await prisma.employee.findFirst();

    if (!employee) {
      return {
        type: "FOMEMA",
        data: "FOMEMA guidance: verify the latest fit-status certificate, confirm passport and permit details are current, and renew the examination before the permit renewal window closes.",
      };
    }

    const medicalDoc = await prisma.document.findFirst({
      where: { employeeId: employee.id, type: "CERTIFICATE" },
      orderBy: { createdAt: "desc" },
    });

    if (!medicalDoc) {
      return {
        type: "FOMEMA",
        data: `No FOMEMA certificate on record for ${employee.name}. Schedule an examination at a registered FOMEMA panel clinic.`,
      };
    }

    const expiry = medicalDoc.expiryDate;
    const daysLeft = expiry
      ? Math.ceil((expiry.getTime() - Date.now()) / 86400000)
      : null;
    const statusIcon = !daysLeft
      ? "⚠️"
      : daysLeft < 30
        ? "⚠️ Expiring soon"
        : "✅ Valid";

    return {
      type: "FOMEMA",
      data: `FOMEMA for ${employee.name}: ${statusIcon} — Status: ${medicalDoc.status}${expiry ? ` | Expires: ${expiry.toLocaleDateString()}${daysLeft !== null ? ` (${daysLeft} days)` : ""}` : ""}`,
    };
  } catch (error) {
    console.error("FOMEMA agent error:", error);
    return {
      type: "FOMEMA",
      data: "FOMEMA guidance: check that the medical examination is still fit/valid, confirm the certificate expiry date, and renew it before the next permit submission through MYEG or FWCMS.",
    };
  }
}
