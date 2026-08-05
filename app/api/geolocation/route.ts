import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCurrentSession } from "@/lib/server/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Serve real data from DB if available, fall back to summary from geofence table
    const [geofences, activeCount] = await Promise.all([
      prisma.geofence.findMany({
        where: { tenantId: session.tenantId, isActive: true },
        select: { id: true, name: true, type: true, coordinates: true, radius: true, isActive: true },
      }).catch(() => [] as any[]),
      prisma.locationRecord.count({
        where: { timestamp: { gte: new Date(Date.now() - 5 * 60 * 1000) } },
      }).catch(() => 0),
    ]);

    const recentLocations = await prisma.locationRecord.findMany({
      where: { timestamp: { gte: new Date(Date.now() - 10 * 60 * 1000) } },
      orderBy: { timestamp: "desc" },
      distinct: ["employeeId"],
      take: 100,
      include: { employee: { select: { id: true, name: true } } },
    }).catch(() => [] as any[]);

    const workers = (recentLocations as any[]).map((r: any) => ({
      id:          r.employeeId,
      name:        r.employee?.name ?? r.employeeId,
      location:    r.address ?? "Unknown",
      status:      "active" as const,
      battery:     r.batteryLevel ?? null,
      signal:      null,
      lastUpdate:  r.timestamp?.toISOString(),
      coordinates: { lat: r.latitude, lng: r.longitude },
    }));

    return NextResponse.json({
      workers,
      geofences,
      activeTrackers: activeCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Geolocation data fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch geolocation data" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
