import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/server/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ workerId: string }> },
) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { workerId } = await params;
  const dateParam = request.nextUrl.searchParams.get("date");
  const date = dateParam ? new Date(dateParam) : new Date();
  const start = new Date(date); start.setHours(0, 0, 0, 0);
  const end = new Date(date); end.setHours(23, 59, 59, 999);

  const records = await prisma.attendance.findMany({
    where: { tenantId: session.tenantId, employeeId: workerId, date: { gte: start, lte: end } },
    orderBy: { date: "desc" },
  });

  return NextResponse.json(records);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ workerId: string }> },
) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { workerId } = await params;
  const body = await request.json();

  const record = await prisma.attendance.create({
    data: {
      tenantId: session.tenantId,
      employeeId: workerId,
      date: new Date(),
      ...body,
    },
  });

  return NextResponse.json(record, { status: 201 });
}
