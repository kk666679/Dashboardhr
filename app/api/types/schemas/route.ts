import { NextResponse } from 'next/server';

const schemas = {
  AuditChecklist: {
    type: 'object',
    properties: {
      standard: { type: 'string', enum: ['ISO9001', 'ISO14001', 'ISO45001'] },
      clauses: { type: 'array', items: { type: 'string' } }
    },
    required: ['standard', 'clauses']
  },
  AuditPlan: {
    type: 'object',
    properties: {
      standard: { type: 'string' },
      scope: { type: 'string' },
      duration: { type: 'number' }
    },
    required: ['standard', 'scope', 'duration']
  },
  RiskAssessment: {
    type: 'object',
    properties: {
      title: { type: 'string' },
      category: { 
        type: 'string', 
        enum: ['quality', 'environmental', 'safety', 'operational', 'strategic', 'compliance'] 
      },
      likelihood: { 
        type: 'string', 
        enum: ['rare', 'unlikely', 'possible', 'likely', 'certain'] 
      },
      severity: { 
        type: 'string', 
        enum: ['negligible', 'minor', 'moderate', 'major', 'catastrophic'] 
      }
    },
    required: ['title', 'category', 'likelihood', 'severity']
  },
  ComplianceScore: {
    type: 'object',
    properties: {
      requirements: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            requirement: { type: 'string' },
            implemented: { type: 'boolean' },
            evidence: { type: 'array', items: { type: 'string' } }
          },
          required: ['requirement', 'implemented']
        }
      }
    },
    required: ['requirements']
  }
};

export async function GET() {
  return NextResponse.json(schemas, {
    headers: { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=86400'
    }
  });
}

