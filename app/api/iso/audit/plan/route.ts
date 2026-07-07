import { NextRequest, NextResponse } from 'next/server';
import { auditEngine } from '@/services/audit-engine';

export async function POST(request: NextRequest) {
  try {
    const { standard, scope, duration } = await request.json();
    
    if (!standard || !scope || typeof duration !== 'number') {
      return NextResponse.json(
        { error: 'Missing standard, scope, or duration' },
        { status: 400 }
      );
    }
    
    const plan = auditEngine.createAuditPlan({ standard, scope, duration });
    
    return NextResponse.json({ plan }, {
      headers: { 'Access-Control-Allow-Origin': '*' }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create audit plan' },
      { status: 500 }
    );
  }
}

