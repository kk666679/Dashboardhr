import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// In-memory data store (replace with Prisma/database in production)
let workers: Array<{
  id: string;
  name: string;
  location: string;
  status: "active" | "alert" | "offline";
  battery: number;
  signal: number;
  lastUpdate: string;
  coordinates: { lat: number; lng: number };
}> = [
  {
    id: "W-2024-001",
    name: "Ahmad Rahman",
    location: "Construction Site A",
    status: "active",
    battery: 85,
    signal: 4,
    lastUpdate: "2 min ago",
    coordinates: { lat: 3.139, lng: 101.6869 },
  },
  {
    id: "W-2024-002",
    name: "Kumar Patel",
    location: "Manufacturing Zone B",
    status: "active",
    battery: 92,
    signal: 5,
    lastUpdate: "1 min ago",
    coordinates: { lat: 3.142, lng: 101.689 },
  },
  {
    id: "W-2024-003",
    name: "Nguyen Van",
    location: "Restricted Zone",
    status: "alert",
    battery: 45,
    signal: 2,
    lastUpdate: "30 sec ago",
    coordinates: { lat: 3.135, lng: 101.685 },
  },
  {
    id: "W-2024-004",
    name: "Rahman Ali",
    location: "Accommodation Block C",
    status: "offline",
    battery: 12,
    signal: 0,
    lastUpdate: "15 min ago",
    coordinates: { lat: 3.138, lng: 101.688 },
  },
];

let geofences = [
  {
    name: "Construction Site A",
    type: "work",
    status: "active",
    workers: 18,
    alerts: 0,
    coordinates: [
      [
        [101.686, 3.139],
        [101.688, 3.139],
        [101.688, 3.141],
        [101.686, 3.141],
        [101.686, 3.139],
      ],
    ],
  },
  {
    name: "Manufacturing Zone B",
    type: "work",
    status: "active",
    workers: 24,
    alerts: 1,
    coordinates: [
      [
        [101.689, 3.142],
        [101.691, 3.142],
        [101.691, 3.144],
        [101.689, 3.144],
        [101.689, 3.142],
      ],
    ],
  },
  {
    name: "Restricted Storage",
    type: "restricted",
    status: "violation",
    workers: 2,
    alerts: 3,
    coordinates: [
      [
        [101.685, 3.135],
        [101.687, 3.135],
        [101.687, 3.137],
        [101.685, 3.137],
        [101.685, 3.135],
      ],
    ],
  },
  {
    name: "Accommodation Block C",
    type: "housing",
    status: "active",
    workers: 31,
    alerts: 0,
    coordinates: [
      [
        [101.688, 3.138],
        [101.69, 3.138],
        [101.69, 3.14],
        [101.688, 3.14],
        [101.688, 3.138],
      ],
    ],
  },
];

export async function GET(request: NextRequest) {
  try {
    const activeTrackers = Math.floor(Math.random() * 100) + 2350;

    return NextResponse.json({
      workers,
      geofences,
      activeTrackers,
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

// Optional: Simulate location updates via POST for testing
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // removed console.log
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
