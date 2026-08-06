import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/server/auth';
import { ingestKnowledgeBase } from '@/lib/kb-loader';

export async function POST(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const result = await ingestKnowledgeBase(file);
    return NextResponse.json({ success: true, documents: result }, { status: 200 });
  } catch (error) {
    console.error('KB ingest error:', error);
    return NextResponse.json({ error: 'Failed to ingest file' }, { status: 500 });
  }
}
