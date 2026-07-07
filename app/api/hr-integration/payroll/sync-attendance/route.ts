import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { workerId, startDate, endDate } = await request.json();

    console.log("[payroll/sync-attendance] Request received:", {
      workerId,
      startDate,
      endDate,
    });

    if (!workerId || !startDate || !endDate) {
      console.error("[payroll/sync-attendance] Missing required fields");
      return NextResponse.json(
        { error: "workerId, startDate and endDate are required" },
        { status: 400 },
      );
    }

    // In production: fetch attendance from DB, calculate payroll, push to payroll system
    const result = {
      workerId,
      startDate,
      endDate,
      syncedAt: new Date().toISOString(),
      hoursTotal: 9.22,
      overtimeHours: 1.22,
      status: "synced" as const,
    };

    console.log(
      "[payroll/sync-attendance] Sync completed successfully:",
      result,
    );
    return NextResponse.json(result);
  } catch (error) {
    console.error("[payroll/sync-attendance] Full error:", error);
    return NextResponse.json(
      {
        error: "Sync failed",
        details:
          process.env.NODE_ENV === "development"
            ? (error as Error).message
            : undefined,
      },
      { status: 500 },
    );
  }
}
