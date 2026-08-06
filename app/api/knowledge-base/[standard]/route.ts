import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const ALLOWED_STANDARDS = new Set([
  'iso9001', 'iso14001', 'iso45001', 'iso27001', 'iso17025_2017', 'iso17020',
]);

export async function GET(_request: Request, { params }: { params: Promise<{ standard: string }> }) {
  const { standard } = await params;

  // Prevent path traversal — only allow known standard identifiers
  if (!ALLOWED_STANDARDS.has(standard)) {
    return NextResponse.json(
      { error: `Standard '${standard}' not found. Available: ${[...ALLOWED_STANDARDS].join(', ')}` },
      { status: 404 }
    );
  }

  const kbFile = path.join(process.cwd(), 'knowledge-base', `${standard}-clauses.json`);

  try {
    const content = await fs.readFile(kbFile, 'utf-8');
    return new NextResponse(content, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch {
    return NextResponse.json(
      { error: `Standard '${standard}' not found.` },
      { status: 404 }
    );
  }
}
