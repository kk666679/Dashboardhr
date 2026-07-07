import { NextRequest, NextResponse } from 'next/server';
import { searchKb, kbStats } from '@/lib/kb';
import type { KbSearchQuery, KbSearchResult } from '@/lib/kb/types';

export const runtime = 'nodejs';

const QuerySchema = {
  query: (q: unknown): string => String(q || '').trim(),
  topK: (k: unknown): number => Math.max(1, Math.min(Number(k) || 5, 20)),
  minScore: (s: unknown): number => Math.max(0, Math.min(Number(s) || 0.3, 1)),
  tenantId: (t: unknown): string | undefined => String(t || '').trim() || undefined,
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const query: KbSearchQuery = {
      query: QuerySchema.query(body.query),
      topK: QuerySchema.topK(body.topK),
      minScore: QuerySchema.minScore(body.minScore),
      tenantId: QuerySchema.tenantId(body.tenantId),
    };

    if (!query.query) {
      return NextResponse.json({ error: 'Query required' }, { status: 400 });
    }

    const results = await searchKb(query);
    return NextResponse.json({
      results,
      stats: kbStats(),
    });
  } catch (err) {
    console.error('[KB-Search]', err);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const query: KbSearchQuery = {
    query: QuerySchema.query(searchParams.get('q')),
    topK: QuerySchema.topK(searchParams.get('k')),
    minScore: QuerySchema.minScore(searchParams.get('s')),
    tenantId: QuerySchema.tenantId(searchParams.get('tenant')),
  };

  if (!query.query) {
    return NextResponse.json(kbStats());
  }

  const results = await searchKb(query);
  return NextResponse.json(results);
}

