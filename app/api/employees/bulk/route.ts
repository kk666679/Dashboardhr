/**
 * POST /api/employees/bulk  — Bulk import employees from CSV/JSON
 * GET  /api/employees/bulk  — Export all employees as CSV
 *
 * Missing API M2 from docs/api-analysis/10-missing-apis.md
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentSession } from "@/lib/server/auth";
import { prisma } from "@/lib/prisma";
import { put } from "@vercel/blob";

// ─── Import schema (one row) ──────────────────────────────────────────────────

const RowSchema = z.object({
  name:        z.string().min(1),
  email:       z.string().email(),
  phone:       z.string().optional(),
  department:  z.string().optional(),
  position:    z.string().optional(),
  nationality: z.string().optional(),
  hireDate:    z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  isForeign:   z.union([z.boolean(), z.enum(["true", "false", "1", "0"])]).transform(v =>
    typeof v === "boolean" ? v : v === "true" || v === "1"
  ).optional(),
});

// ─── POST: bulk import ────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const contentType = request.headers.get("content-type") ?? "";
  let rows: unknown[] = [];

  if (contentType.includes("application/json")) {
    const body = await request.json();
    rows = Array.isArray(body) ? body : body?.rows ?? [];
  } else if (contentType.includes("text/csv") || contentType.includes("multipart/form-data")) {
    let csv = "";
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
      csv = await file.text();
    } else {
      csv = await request.text();
    }
    const lines  = csv.split(/\r?\n/).filter(Boolean);
    const header = lines[0].split(",").map(h => h.trim().replace(/^"|"$/g, ""));
    rows = lines.slice(1).map(line => {
      const vals = line.split(",").map(v => v.trim().replace(/^"|"$/g, ""));
      return Object.fromEntries(header.map((h, i) => [h, vals[i] ?? ""]));
    });
  }

  const dryRun = request.nextUrl.searchParams.get("dryRun") === "true";

  const created: string[] = [];
  const skipped: string[] = [];
  const errors:  { row: number; email: string; message: string }[] = [];

  for (let i = 0; i < rows.length; i++) {
    const parsed = RowSchema.safeParse(rows[i]);
    if (!parsed.success) {
      errors.push({ row: i + 2, email: (rows[i] as any)?.email ?? "", message: parsed.error.issues[0].message });
      continue;
    }

    const data = parsed.data;

    // Check for existing email in this tenant
    const existing = await prisma.employee.findFirst({
      where: { email: data.email, tenantId: session.tenantId },
      select: { id: true },
    });

    if (existing) {
      skipped.push(data.email);
      continue;
    }

    if (!dryRun) {
      await prisma.employee.create({
        data: {
          tenantId:    session.tenantId,
          name:        data.name,
          email:       data.email,
          phone:       data.phone,
          department:  data.department,
          position:    data.position,
          nationality: data.nationality,
          hireDate:    data.hireDate ? new Date(data.hireDate) : undefined,
          isForeign:   data.isForeign ?? false,
        },
      });
    }
    created.push(data.email);
  }

  return NextResponse.json({
    created: created.length,
    skipped: skipped.length,
    errors,
    dryRun,
  }, { status: 201 });
}

// ─── GET: bulk export as CSV ──────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const employees = await prisma.employee.findMany({
    where: { tenantId: session.tenantId },
    select: {
      id: true, name: true, email: true, phone: true,
      department: true, position: true, nationality: true,
      hireDate: true, isForeign: true, createdAt: true,
    },
    orderBy: { name: "asc" },
  });

  const header = "id,name,email,phone,department,position,nationality,hireDate,isForeign,createdAt\n";
  const rows   = employees.map((e: any) =>
    [e.id, e.name, e.email, e.phone ?? "", e.department ?? "", e.position ?? "",
     e.nationality ?? "", e.hireDate?.toISOString().slice(0, 10) ?? "",
     String(e.isForeign ?? false), e.createdAt?.toISOString() ?? ""]
      .map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")
  );
  const csv = header + rows.join("\n");

  const format = request.nextUrl.searchParams.get("format");

  if (format === "blob") {
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
    if (!blobToken) return NextResponse.json({ error: "Blob not configured" }, { status: 501 });
    const filename = `employees-${session.tenantId}-${Date.now()}.csv`;
    const blob     = await put(filename, csv, { access: "private", token: blobToken });
    return NextResponse.json({ url: blob.url, count: employees.length });
  }

  return new NextResponse(csv, {
    headers: {
      "Content-Type":        "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="employees-export.csv"`,
    },
  });
}
