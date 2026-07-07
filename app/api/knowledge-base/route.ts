import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  const kbDir = path.join(process.cwd(), 'knowledge-base');
  try {
    const files = await fs.readdir(kbDir);
    const standards = files
      .filter(f => f.endsWith('.json') && f.includes('-clauses'))
      .map(f => ({
        id: f.replace('.json', '').replace('-clauses', ''),
        name: f.replace('.json', '').replace('iso', 'ISO ').replace('_2017', ' 2017'),
        path: `/api/knowledge-base/${f.replace('.json', '')}`
      }));
    
    return NextResponse.json({ standards }, {
      headers: { 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'public, max-age=3600' }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to list standards' }, { status: 500 });
  }
}

