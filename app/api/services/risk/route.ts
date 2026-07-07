import { NextRequest, NextResponse } from 'next/server';
import { riskEngine } from '@/services/risk-engine';

export async function GET() {
  return NextResponse.json({ 
    risks: riskEngine.getRisks(),
    summary: riskEngine.getRiskSummary(),
    matrixConfig: riskEngine.getRisks()
  });
}

export async function POST(request: NextRequest) {
  try {
    const riskData = await request.json();
    const risk = riskEngine.addRisk(riskData);
    return NextResponse.json({ risk });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create risk' }, { status: 500 });
  }
}

