import { NextRequest, NextResponse } from 'next/server';
import { complianceScoringEngine } from '@/services/compliance-scoring-engine';

export async function GET() {
  return NextResponse.json({ 
    availableMethods: ['scoreCompliance', 'generateGapAnalysis', 'calculateMaturityLevel']
  });
}

export async function POST(request: NextRequest) {
  try {
    const { method, ...params } = await request.json();
    
    let result;
    switch (method) {
      case 'scoreCompliance':
        result = complianceScoringEngine.scoreCompliance(params.requirements);
        break;
      case 'generateGapAnalysis':
        result = complianceScoringEngine.generateGapAnalysis(params.current, params.target);
        break;
      default:
        return NextResponse.json({ error: 'Unknown method' }, { status: 400 });
    }
    
    return NextResponse.json({ result });
  } catch (error) {
    return NextResponse.json({ error: 'Compliance service error' }, { status: 500 });
  }
}

