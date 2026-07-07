import { NextRequest, NextResponse } from 'next/server';
import { complianceScoringEngine } from '@/services/compliance-scoring-engine';

export async function POST(request: NextRequest) {
  try {
    const { current, target } = await request.json();
    
    if (typeof current !== 'number' || typeof target !== 'number') {
      return NextResponse.json(
        { error: 'current and target must be numbers' },
        { status: 400 }
      );
    }
    
    const gapAnalysis = complianceScoringEngine.generateGapAnalysis(current, target);
    
    return NextResponse.json({ gapAnalysis }, {
      headers: { 'Access-Control-Allow-Origin': '*' }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate gap analysis' },
      { status: 500 }
    );
  }
}

