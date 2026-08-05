import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/server/auth";
import { climateRiskEngine } from "@/services/climate-risk-engine";
import { z } from "zod";

export async function GET(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  return NextResponse.json({
    risks:   climateRiskEngine.getRisks(),
    summary: climateRiskEngine.getRiskSummary(),
    hazards: climateRiskEngine.getAvailableHazards(),
  });
}

export async function POST(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const input = await request.json();
    const risk = input.hazardId
      ? climateRiskEngine.addRisk(input.hazardId, input) || null
      : climateRiskEngine.addCustomRisk(input);

    if (!risk) return NextResponse.json({ error: "Invalid hazard or risk data" }, { status: 400 });
    return NextResponse.json({ risk });
  } catch {
    return NextResponse.json({ error: "Failed to create climate risk" }, { status: 500 });
  }
}
