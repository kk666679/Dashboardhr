import { NextRequest, NextResponse } from "next/server";

// Stub API route for e-invoice endpoints (MyInvois integration placeholder)
// Replace with actual LHDN MyInvois integration when available.

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "10");
  const status = searchParams.get("status");

  // Return empty dataset with proper pagination structure
  return NextResponse.json({
    einvoices: [],
    total: 0,
    page,
    limit,
    message: "E-invoice module is in stub mode. Configure LHDN MyInvois integration for live data.",
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, invoiceId, id, reason } = body;

    // Stub: Accept the request and return success
    return NextResponse.json({
      success: true,
      id: id ?? invoiceId ?? `stub-${Date.now()}`,
      status: "submitted",
      message: "E-invoice stub endpoint. Replace with actual MyInvois integration.",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 },
    );
  }
}

