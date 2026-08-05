import { get } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { prisma, withTenant } from "@/lib/prisma";
import { getRequiredServerEnv } from "@/config/server-env";
import { getCurrentSession } from "@/lib/server/auth";

// Role that may view any employee's documents (HR/admin).
const HR_ROLES = new Set([
  "Super_Admin",
  "Group_HR",
  "HR_Director",
  "HR_Manager",
  "HR_Executive",
  "Payroll_Manager",
  "Payroll_Executive",
  "Finance",
  "Recruiter",
  "Department_Head",
  "Manager",
  "Compliance_Officer",
  "Auditor",
  "ADMIN",
  "HR",
]);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Tenant-scoped lookup (withTenant injects tenantId into the query).
    type DocRow = { deletedAt: Date | null; employeeId: string; fileUrl: string; contentText: string | null };
    const doc = await withTenant(session.tenantId, () =>
      prisma.documents.findUnique({
        where: { id },
        select: {
          deletedAt: true,
          employeeId: true,
          fileUrl: true,
          contentText: true,
        },
      }),
    ) as DocRow | null;

    if (!doc || doc.deletedAt) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Access control: employee can only view their own documents unless HR.
    const isHr = HR_ROLES.has(String(session.role));
    if (!isHr && doc.employeeId !== session.employeeId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const result = await get(doc.fileUrl, {
      access: "private",
      token: getRequiredServerEnv("BLOB_READ_WRITE_TOKEN"),
    });
    if (result === null) {
      return new NextResponse("Not found", { status: 404 });
    }

    const fileName = doc.contentText ?? `document-${id}`;

    return new NextResponse(result.stream, {
      headers: {
        "Cache-Control": "private, no-cache",
        "Content-Type":
          result.blob.contentType ?? "application/octet-stream",
        "Content-Disposition": `attachment; filename="${fileName.replace(/["\\]/g, "_")}"`,
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("[documents/download] Failed to fetch document:", error);
    return NextResponse.json(
      { error: "Failed to download document" },
      { status: 500 },
    );
  }
}

