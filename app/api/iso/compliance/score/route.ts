import { NextRequest, NextResponse } from 'next/server';
import { complianceScoringEngine } from '@/services/compliance-scoring-engine';

export async function POST(request: NextRequest) {
  try {
    const requirements = await request.json();
    
    if (!Array.isArray(requirements)) {
      return NextResponse.json(
        { error: 'Requirements must be an array of {requirement, implemented, evidence[]}' },
        { status: 400 }
      );
    }
    
    const score = complianceScoringEngine.scoreCompliance(requirements);
    
    return NextResponse.json({ score }, {
      headers: { 'Access-Control-Allow-Origin': '*' }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to calculate compliance score' },
      { status: 500 }
    );
  }
}

