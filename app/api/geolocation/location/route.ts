import { NextRequest, NextResponse } from "next/server";
import type { LocationData } from "@/types/geolocation";

// Mock database - replace with actual database integration
const locationStore = new Map<string, LocationData[]>();

export async function POST(request: NextRequest) {
  try {
    const locationData: Partial<LocationData> = await request.json();

    // Validate required fields
    if (
      !locationData.workerId ||
      !locationData.latitude ||
      !locationData.longitude
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Create location record
    const location: LocationData = {
      id: `loc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      workerId: locationData.workerId,
      latitude: locationData.latitude,
      longitude: locationData.longitude,
      accuracy: locationData.accuracy || 0,
      timestamp: locationData.timestamp || new Date().toISOString(),
      source: locationData.source || "gps",
      batteryLevel: locationData.batteryLevel,
      address: locationData.address,
    };

    // Store location
    const workerLocations = locationStore.get(location.workerId) || [];
    workerLocations.push(location);

    // Keep only last 1000 locations per worker
    if (workerLocations.length > 1000) {
      workerLocations.splice(0, workerLocations.length - 1000);
    }

    locationStore.set(location.workerId, workerLocations);

    // Check geofence violations
    await checkGeofenceViolations(location);

    // Sync with HR systems if needed
    await syncLocationToHR(location);

    return NextResponse.json(location);
  } catch (error) {
    console.error("Location update error:", error);
    return NextResponse.json(
      { error: "Failed to update location" },
      { status: 500 },
    );
  }
}

async function checkGeofenceViolations(location: LocationData) {
  // Mock geofence checking - implement actual geofence logic
  const geofences = [
    {
      id: "worksite_1",
      name: "Construction Site A",
      type: "worksite",
      coordinates: [
        { latitude: 3.139, longitude: 101.6869 },
        { latitude: 3.1395, longitude: 101.6869 },
        { latitude: 3.1395, longitude: 101.6875 },
        { latitude: 3.139, longitude: 101.6875 },
      ],
    },
  ];

  // Check if location is within authorized geofences
  // This is a simplified check - implement proper polygon containment
  const isInAuthorizedArea = geofences.some((geofence) => {
    const bounds = geofence.coordinates;
    const minLat = Math.min(...bounds.map((c) => c.latitude));
    const maxLat = Math.max(...bounds.map((c) => c.latitude));
    const minLng = Math.min(...bounds.map((c) => c.longitude));
    const maxLng = Math.max(...bounds.map((c) => c.longitude));

    return (
      location.latitude >= minLat &&
      location.latitude <= maxLat &&
      location.longitude >= minLng &&
      location.longitude <= maxLng
    );
  });

  if (!isInAuthorizedArea) {
    // Create violation alert
    await createLocationAlert({
      workerId: location.workerId,
      type: "geofence_violation",
      severity: "medium",
      location,
      message: "Worker detected outside authorized work area",
    });
  }
}

async function syncLocationToHR(location: LocationData) {
  // Mock HR sync - implement actual HR system integration
  try {
    // Example: Sync to payroll system for attendance
    const attendanceData = {
      workerId: location.workerId,
      timestamp: location.timestamp,
      location: `${location.latitude},${location.longitude}`,
      source: "geolocation",
    };

    // Send to HR/Payroll API
    // await fetch("https://hr-system.com/api/attendance", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(attendanceData),
    // })

    // removed console.log
  } catch (error) {
    console.error("HR sync failed:", error);
  }
}

async function createLocationAlert(alertData: any) {
  // Mock alert creation - implement actual alert system
  // removed console.log
}
