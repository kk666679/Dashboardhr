import { NextRequest, NextResponse } from 'next/server';
import { auditEngine } from '@/services/audit-engine';

export async function GET() {
  return NextResponse.json({ 
    availableStandards: ['ISO9001', 'ISO14001', 'ISO45001'],
    methods: ['generateChecklist', 'createAuditPlan']
  });
}

export async function POST(request: NextRequest) {
  try {
    const { method, ...params } = await request.json();
    
    let result;
    switch (method) {
      case 'generateChecklist':
        result = auditEngine.generateChecklist(params.standard, params.clauses);
        break;
      case 'createAuditPlan':
        result = auditEngine.createAuditPlan(params);
        break;
      default:
        return NextResponse.json({ error: 'Unknown method' }, { status: 400 });
    }
    
    return NextResponse.json({ result });
  } catch (error) {
    return NextResponse.json({ error: 'Audit service error' }, { status: 500 });
  }
}

