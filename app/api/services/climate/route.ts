import { NextRequest, NextResponse } from 'next/server';
import { climateRiskEngine } from '@/services/climate-risk-engine';

export async function GET() {
  return NextResponse.json({ 
    risks: climateRiskEngine.getRisks(),
    summary: climateRiskEngine.getRiskSummary(),
    hazards: climateRiskEngine.getAvailableHazards()
  });
}

export async function POST(request: NextRequest) {
  try {
    const input = await request.json();
    let risk;
    
    if (input.hazardId) {
      risk = climateRiskEngine.addRisk(input.hazardId, input);
    } else {
      risk = climateRiskEngine.addCustomRisk(input);
    }
    
    return NextResponse.json({ risk });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process climate risk' }, { status: 500 });
  }
}

