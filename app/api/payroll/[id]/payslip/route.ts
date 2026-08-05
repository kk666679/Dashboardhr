/**
 * GET /api/payroll/[id]/payslip
 *
 * Returns payslip data as JSON, or as a PDF blob URL if ?format=pdf.
 * Employees can only access their own payslips.
 * HR roles can access any payslip within the tenant.
 *
 * Missing API M11 from docs/api-analysis/10-missing-apis.md
 */

import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/server/auth";
import { generatePayslip } from "@/lib/payroll-service";
import { prisma } from "@/lib/prisma";

const HR_ROLES = new Set([
  "Super_Admin", "HR_Director", "HR_Manager", "HR_Executive",
  "Payroll_Manager", "Payroll_Executive", "Finance", "ADMIN", "HR",
]);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Fetch payroll record to check ownership
  const payroll = await prisma.payroll.findFirst({
    where: { id, tenantId: session.tenantId },
    select: { id: true, employeeId: true },
  });

  if (!payroll) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Access control: employees can only access their own payslips
  const isHr = HR_ROLES.has(String(session.role));
  if (!isHr && payroll.employeeId !== session.employeeId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const payslip = await generatePayslip(id);
  if (!payslip) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const format = request.nextUrl.searchParams.get("format");

  // JSON response (default)
  if (format !== "pdf") {
    return NextResponse.json({ payslip });
  }

  // PDF generation — @react-pdf/renderer is installed but requires a React
  // component; return a structured JSON that the client can render as PDF.
  // Full server-side PDF generation can be added by creating a React component
  // with react-pdf and calling renderToBuffer() in a separate worker.
  return NextResponse.json(
    {
      error:   "PDF rendering not yet implemented server-side",
      payslip, // client can use this data to render PDF with @react-pdf/renderer
      hint:    "Render using @react-pdf/renderer on the client with this data",
    },
    { status: 501 }
  );
}
