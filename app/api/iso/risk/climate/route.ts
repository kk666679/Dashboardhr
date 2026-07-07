import { NextRequest, NextResponse } from 'next/server';
import { climateRiskEngine, type ClimateRisk } from '@/services/climate-risk-engine';

export async function GET() {
  return NextResponse.json({ 
    risks: climateRiskEngine.getRisks(),
    summary: climateRiskEngine.getRiskSummary(),
    hazards: climateRiskEngine.getAvailableHazards()
  }, {
    headers: { 'Access-Control-Allow-Origin': '*' }
  });
}

export async function POST(request: NextRequest) {
  try {
    const input = await request.json();
    
    let risk: ClimateRisk;
    if (input.hazardId) {
      risk = climateRiskEngine.addRisk(input.hazardId, input) || null;
    } else {
      risk = climateRiskEngine.addCustomRisk(input);
    }
    
    if (!risk) {
      return NextResponse.json({ error: 'Invalid hazard or risk data' }, { status: 400 });
    }
    
    return NextResponse.json({ risk });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create climate risk' }, { status: 500 });
  }
}

