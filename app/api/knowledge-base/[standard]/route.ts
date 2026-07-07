import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(request: Request, { params }: { params: Promise<{ standard: string }> }) {
  const { standard } = await params;
  const kbFile = path.join(process.cwd(), 'knowledge-base', `${standard}-clauses.json`);
  
  try {
    const content = await fs.readFile(kbFile, 'utf-8');
    const data = JSON.parse(content);
    
    return new NextResponse(content, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=86400', // 24h cache
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: `Standard '${standard}' not found. Available: iso9001, iso14001, iso45001, iso27001, iso17025_2017, iso17020` },
      { status: 404 }
    );
  }
}

