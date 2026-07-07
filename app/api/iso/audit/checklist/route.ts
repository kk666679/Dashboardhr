import { NextRequest, NextResponse } from 'next/server';
import { auditEngine } from '@/services/audit-engine';

export async function POST(request: NextRequest) {
  try {
    const { standard, clauses } = await request.json();
    
    if (!standard || !Array.isArray(clauses)) {
      return NextResponse.json(
        { error: 'Missing standard or clauses array' },
        { status: 400 }
      );
    }
    
    const checklist = auditEngine.generateChecklist(standard as any, clauses);
    
    return NextResponse.json({ checklist }, {
      headers: { 'Access-Control-Allow-Origin': '*' }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate checklist' },
      { status: 500 }
    );
  }
}

