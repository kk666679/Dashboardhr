import { NextRequest, NextResponse } from 'next/server';
import { riskEngine, type Risk, calculateInherentRisk, getRiskMatrixCell } from '@/services/risk-engine';
import { z } from 'zod';

const RiskInputSchema = z.object({
  title: z.string(),
  description: z.string(),
  category: z.enum(['quality', 'environmental', 'safety', 'operational', 'strategic', 'compliance']),
  likelihood: z.enum(['rare', 'unlikely', 'possible', 'likely', 'certain']),
  severity: z.enum(['negligible', 'minor', 'moderate', 'major', 'catastrophic']),
});

export async function GET() {
  return NextResponse.json({ 
    matrix: riskEngine.getRisks(),
    summary: riskEngine.getRiskSummary(),
    config: { riskMatrix: riskEngine.getRisks() }
  }, {
    headers: { 'Access-Control-Allow-Origin': '*' }
  });
}

export async function POST(request: NextRequest) {
  try {
    const input = RiskInputSchema.parse(await request.json());
    
    const risk = riskEngine.addRisk({
      title: input.title,
      description: input.description,
      category: input.category,
      likelihood: input.likelihood,
      severity: input.severity,
      currentControls: [],
      riskTreatment: 'mitigate',
      owner: 'Risk Manager',
      status: 'identified',
    });
    
    const cell = getRiskMatrixCell(input.likelihood, input.severity);
    
    return NextResponse.json({ risk, matrixCell: cell });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.format() }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create risk' }, { status: 500 });
  }
}

