import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/server/auth';
import { exportSopToMarkdown, exportSopToHtml } from '@/lib/sop/export';

export async function GET(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const searchParams = request.nextUrl.searchParams;
  const sopId = searchParams.get('sopId');
  const version = parseInt(searchParams.get('version') || '1');
  const format = searchParams.get('format') || 'markdown';

  if (!sopId) {
    return NextResponse.json({ error: 'sopId required' }, { status: 400 });
  }

  try {
    if (format === 'html') {
      const html = await exportSopToHtml(sopId, version);
      return new NextResponse(html, { headers: { 'Content-Type': 'text/html' } });
    }
    const markdown = await exportSopToMarkdown(sopId, version);
    return new NextResponse(markdown, { headers: { 'Content-Type': 'text/markdown' } });
  } catch {
    return NextResponse.json({ error: 'Export failed' }, { status: 500 });
  }
}
