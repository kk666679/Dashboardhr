import { NextRequest, NextResponse } from 'next/server';
import { correctiveActionEngine } from '@/services/corrective-action-engine';

export async function POST(request: NextRequest) {
  try {
    const { problem } = await request.json();
    
    if (!problem || typeof problem !== 'string') {
      return NextResponse.json(
        { error: 'Problem description required' },
        { status: 400 }
      );
    }
    
    const fiveWhys = correctiveActionEngine.perform5Whys(problem);
    
    return NextResponse.json({ fiveWhys }, {
      headers: { 'Access-Control-Allow-Origin': '*' }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate 5 Whys analysis' },
      { status: 500 }
    );
  }
}

