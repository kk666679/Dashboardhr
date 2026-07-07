import { NextRequest, NextResponse } from 'next/server';
import { exportSopToMarkdown, exportSopToHtml } from '@/lib/sop/export';

export async function GET(request: NextRequest) {
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
      return new NextResponse(html, {
        headers: { 'Content-Type': 'text/html' },
      });
    } else {
      const markdown = await exportSopToMarkdown(sopId, version);
      return new NextResponse(markdown, {
        headers: { 'Content-Type': 'text/markdown' },
      });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Export failed' }, { status: 500 });
  }
}
