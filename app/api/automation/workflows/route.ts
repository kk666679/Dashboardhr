import { NextRequest, NextResponse } from 'next/server';

interface Workflow {
  id: string;
  name: string;
  nodes: any[];
  edges: any[];
  createdAt: string;
}

const workflows: Workflow[] = []; // In-memory store (use DB in prod)

export async function GET() {
  return NextResponse.json({ workflows }, {
    headers: { 'Access-Control-Allow-Origin': '*' }
  });
}

export async function POST(request: NextRequest) {
  try {
    const workflow = await request.json() as Workflow;
    workflow.id = `wf_${Date.now()}`;
    workflow.createdAt = new Date().toISOString();
    workflows.push(workflow);
    
    return NextResponse.json({ workflow }, {
      headers: { 'Access-Control-Allow-Origin': '*' }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save workflow' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const workflowData = await request.json() as Omit<Workflow, 'id' | 'createdAt'>;
    const index = workflows.findIndex(w => w.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 });
    }
    
    workflows[index] = { ...workflows[index], ...workflowData };
    return NextResponse.json({ workflow: workflows[index] });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update workflow' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const index = workflows.findIndex(w => w.id === id);
    if (index > -1) {
      workflows.splice(index, 1);
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete workflow' }, { status: 500 });
  }
}

