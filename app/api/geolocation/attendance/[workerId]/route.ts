import { NextRequest, NextResponse } from "next/server";

// Mock attendance records — replace with Prisma queries in production
function mockAttendance(workerId: string, date: string) {
  return [
    {
      id: `att-${workerId}-${date}`,
      workerId,
      date,
      checkIn: {
        time: `${date}T08:02:00.000Z`,
        location: {
          lat: 3.139,
          lng: 101.687,
          address: "Construction Site A, KL",
        },
      },
      checkOut: {
        time: `${date}T17:15:00.000Z`,
        location: {
          lat: 3.139,
          lng: 101.687,
          address: "Construction Site A, KL",
        },
      },
      totalHours: 9.22,
      isValid: true,
    },
  ];
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ workerId: string }> },
) {
  const { workerId } = await params;
  const date =
    request.nextUrl.searchParams.get("date") ??
    new Date().toISOString().split("T")[0];

  return NextResponse.json(mockAttendance(workerId, date));
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ workerId: string }> },
) {
  const { workerId } = await params;
  const body = await request.json();

  const record = {
    id: `att-${workerId}-${Date.now()}`,
    workerId,
    ...body,
    isValid: true,
    totalHours: 0,
  };

  return NextResponse.json(record, { status: 201 });
}
